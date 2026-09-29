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
// Mini PC Mounts
"B07KY3LHVG","B082FMHW2Q","B0CJ7BK9CM","B0FD9XCYM7","B0DB5RQH7V","B0B2PTMHDD","B0CLJ8GKF9","B0FQP5HTYH",
"B07KB4YWQS","B0CB2CPVRC","B0C9SVTQHG","B0DXDVS61F","B0FKWP592F","B0DJH53M9G","B0G2Y8B6J3","B0GZW651J5","B0H6HMD78P",
"B0DLGJNQ1M","B0FN44R7F2","B0G4CZGRT7","B0GYD33WJ5","B0GZ655GDQ",
// Laptop Cooling Pads
"B00NNMB3KS","B01469DJLM","B016CL2DE6","B0C69BVWGB","B0DJDWWHTV","B0DDSZP449","B0GGZDNRCN","B096ZKRBB2",
"B0CL7FZ5NV","B0D5H11KHN","B0GK23SC1C","B07QXJN1RK","B08TRGT9VZ","B002NU5O9C","B00439G59E",
"B014F4SBMK","B07Q34QC74","B0C7BKZ883","B0BN434Q85","B087WF59N1","B09BMYW2JD","B0C5X1248D","B09D6J56NS",
"B0084V5FD4","B0CYC7T38X","B09Z71ZSM6","B0FLD8YSJ3","B0D4DS24TG","B0C7VQCCG9","B0DMT1ZL5P",
"B09XGZKFKJ","B08SW4RWWQ","B0B5QT3197","B0F9P7NDJY","B0DMP5LX5G","B0D8SVB4F9","B0F6LG31LV","B0GY4HZNFV",
"B074473Z6T","B07N9L5934","B01G2RL026","B0DFY69GFS",
"B003ZSHKJ8","B0CP58Z4CP",
];

const uniqueAsins = [...new Set(allAsins)];
console.log(`Total unique ASINs to fetch: ${uniqueAsins.length}`);

const token = await getAccessToken();
const allItems = [];
for (let i = 0; i < uniqueAsins.length; i += 10) {
  const batch = uniqueAsins.slice(i, i + 10);
  console.log(`Fetching batch ${Math.floor(i / 10) + 1}/${Math.ceil(uniqueAsins.length / 10)}`);
  const items = await getItemsWithRetry(batch, token);
  allItems.push(...items);
  if (i + 10 < uniqueAsins.length) await new Promise((r) => setTimeout(r, 2000));
}

const foundAsins = new Set(allItems.map((it) => it.asin));
const missing = uniqueAsins.filter((a) => !foundAsins.has(a));
console.log(`\nFetched ${allItems.length}/${uniqueAsins.length} items.`);
if (missing.length) console.log("MISSING/INVALID ASINs:", missing.join(", "));

writeFileSync(resolve(ROOT, "scripts", "data-mpm-lcp.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
  features: it.itemInfo?.features?.displayValues ?? [],
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-mpm-lcp.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-mpm-lcp.json and scripts/lookup-mpm-lcp.json");
