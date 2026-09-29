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
  "B08HN37XC1","B09VLK9W3S","B0874XN4D8","B0C5JQ68FY","B0BGL4SHY8","B0F3377JBN","B0CLV9GG54","B0GMWYYRQL",
  "B0FVMGFPHT","B0DR381N86","B08Y1Q2KSZ","B0FVMLZJ1D","B0F7NZJ1SK","B09VLHR4JC","B0C3B32H9M","B0FJWT5LF2",
  "B0GGPXDH1R","B0GRTZWGRN","B09BJYXMDW","B09ZRD38D8","B0F37WWYY4","B0DYDHLN81","B09Z5VSL2Q",
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

writeFileSync(resolve(ROOT, "scripts", "data-ssd.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-ssd.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-ssd.json and scripts/lookup-ssd.json");
