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
  // Wi-Fi 7 Routers 131-138
  "B0DC99N2T8","B0DW27FNG3","B0FHZGXZH7","B0DQP4DNNJ","B0F114274T","B0DR8TJSSY","B0DVBP5L6Y","B0CJSNSVMR",
  "B0FTTPB4MQ","B0FX9C5QVJ","B0FVB76FH2","B0DK7Q5SCN","B0FB8X43KJ","B0F76PQ2T8","B0C4VZWTM7","B0D7MSQG4T",
  // Portable SSDs 139-148
  "B0FVMGFPHT","B0FVMLZJ1D","B0DR381N86","B0F7NZJ1SK","B0F3377JBN","B0GMWYYRQL","B0874XN4D8","B0BGL4SHY8",
  "B09ZRD38D8","B09BJYXMDW","B08Y1Q2KSZ","B0C5JQ68FY","B0F37WWYY4","B0DYDHLN81","B09Z5VSL2Q","B08HN37XC1",
  "B08F1VVBL9","B09VLK9W3S","B0C3B32H9M","B077QZ3T93","B007JGB0EI","B09VLHR4JC","B0DLK38TR9","B0GRTZWGRN",
  "B0FJWT5LF2","B0GGPXDH1R","B0CLV9GG54",
  // Monitor Shelves 149-153
  "B09NFQML72","B07NMZF1PZ","B0CP1L1KS9","B0DCC5S4SX","B0DJKSMV2T","B0C4SZ286V","B0F8VN5T7K","B09QWC568X",
  "B09HKN2ZRT","B0F7LPVJ5X","B0GJS7FXZC","B0DPQ66X7V","B0D8HYFZSW","B0DSZ9NYTL","B0C131DL82","B0CRHCKDVW",
  "B0DWJT3ZRY","B0G2RYGFDK","B07DJRLCFP","B0G2RTY746",
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

writeFileSync(resolve(ROOT, "scripts", "data-131-153.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-131-153.json");
