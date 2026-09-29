import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadDotEnvLocal() {
  try {
    const content = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/\r$/, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {}
}
loadDotEnvLocal();

const TOKEN_ENDPOINT = process.env.AMAZON_PAAPI_TOKEN_ENDPOINT ?? "https://api.amazon.com/auth/o2/token";
const API_BASE = "https://creatorsapi.amazon";
const MARKETPLACE = process.env.AMAZON_PAAPI_MARKETPLACE ?? "www.amazon.com";
const PARTNER_TAG = process.env.AMAZON_PAAPI_PARTNER_TAG ?? "theofficejournal-20";

async function getAccessToken() {
  const clientId = process.env.AMAZON_PAAPI_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_PAAPI_SECRET_KEY;
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function getItemsWithRetry(asins, token, attempt = 1) {
  const res = await fetch(`${API_BASE}/catalog/v1/getItems`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: "ASIN",
      marketplace: MARKETPLACE,
      partnerTag: PARTNER_TAG,
      resources: [
        "images.primary.large",
        "itemInfo.title",
        "itemInfo.features",
        "offersV2.listings.price",
        "customerReviews.starRating",
        "customerReviews.count",
      ],
    }),
  });
  if (res.status === 429 && attempt <= 4) {
    const wait = 3000 * attempt;
    console.log(`429 throttled, retrying in ${wait}ms (attempt ${attempt})`);
    await new Promise((r) => setTimeout(r, wait));
    return getItemsWithRetry(asins, token, attempt + 1);
  }
  if (!res.ok) throw new Error(`getItems failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) {
    for (const e of json.errors) console.log(`ERROR ${e.code}: ${e.message}`);
  }
  return json.itemsResult?.items ?? [];
}

const allAsins = [
  // Monitor shelves 154-155
  "B0F5PPDTVR","B0DJKSMV2T","B0D9882DJK","B0GWM5GS53","B0GTLWCMVB","B0G722M14P","B0H44STD1G","B0G4R17HMV",
  "B07KK6RXS2","B0C4SZ286V","B09K58BMV6","B0C131DL82","B0CJM56XHG","B0G58C9PK6","B0GTR4HPH9","B0GTLV3HDV",
  // Pegboards 156-159
  "B0DHRMN1CK","B0CJ9G6F49","B0CHMZNFB8","B0FHSMK1T7","B0CHN1KJRJ","B0FCFD7C4D","B09NCZ53X9","B0CJ9HJGLB",
  "B0CY29ZZ3V","B0G41Y1HV9","B0FJ8Y59BJ","B0GTR1898X","B0G1MT55BM",
  // Under-desk PC mounts 160-162
  "B0FCY4Q147","B0GLYK9NPM","B0FWCHJBFN","B0GX68WXL3","B0GQSS7YDX","B0GHMXC54Q","B0FHVD4QZ6","B082FNNX49",
  "B078JXC9X8","B08DDK44TY","B0FD9XCYM7","B0DB5RQH7V","B0GZW651J5","B0DGQPHDBM",
  // Vertical mice 163-167
  "B0DR1K3DM1","B0DM8KRK37","B09J1TB35S","B0F1YD86Z6","B0CX18LHWS","B07BFCVJZC","B0FWQN4VL1","B0DG5SW7F4",
  "B07FNJB8TT","B0DCBW3B3T","B0DQ5YLR29","B00BIFNTMC","B098JK6G5N",
  // Ergonomic keyboards 168-175
  "B0BKKYRQ31","B0CGL8X4H6","B0BTNY72VD","B075GZVD4T","B07ZWK2TQT","B0BLZPLWX4","B0FPG76W39","B0DGTKJV5M",
  "B09G5L6Z53","B09FTNMT84","B09N9CPX34","B08Z7J4KV3","B0G3PCSK8B","B0DQ4T5M8C","B0DJ6TC9D8","B0FPR2GR6F",
  "B0G6ZZ95GB","B0FJWMGFF5","B0DZ6DR13F","B0GQ95XNQX",
];

const token = await getAccessToken();
const allItems = [];
for (let i = 0; i < allAsins.length; i += 10) {
  const batch = allAsins.slice(i, i + 10);
  console.log(`Fetching batch ${i / 10 + 1}: ${batch.join(", ")}`);
  const items = await getItemsWithRetry(batch, token);
  allItems.push(...items);
  if (i + 10 < allAsins.length) await new Promise((r) => setTimeout(r, 2000));
}

const foundAsins = new Set(allItems.map((it) => it.asin));
const missing = allAsins.filter((a) => !foundAsins.has(a));
console.log(`\nFetched ${allItems.length}/${allAsins.length} items.`);
if (missing.length) console.log("MISSING/INVALID ASINs:", missing.join(", "));

writeFileSync(resolve(ROOT, "scripts", "data-154-175.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-154-175.json");
