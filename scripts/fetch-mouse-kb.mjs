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
"B00BIFNTMC","B07FNJB8TT","B07BFCVJZC","B09J1TB35S","B0CX18LHWS","B00FPAVUHC","B0CMC1F5WB","B00427TAIK",
"B0DVD5RTZ5","B0GNMPGM7G","B0F9PDRYZK","B0C3D6853V","B0CW38N1HQ","B0D14D4P98","B0F4JNS3PX","B0894QX7SK",
"B00427OTEU","B0GTLWFNS6","B00F0Y3IIW","B09J1SYX5B","B0FX86VTZ5","B0F4J1J65P","B0BBQ3ZYNY","B0FPFTF4NH",
"B0D7Q21GG8","B0D7Q37FD1","B0GJZBCV44","B07ZWT3Q2Y","B07YCFYLVX","B0F9KFSY9G","B0FND19T5W",
"B07ZWK2TQT","B0BTNY72VD","B075GZVD4T","B08G1WNS6F","B0BKKYRQ31","B01MFCTRZM","B0DJ6SJF2V","B0DMDJB6G2",
"B084BP8T18","B0FPG76W39","B0FTZLXBCZ","B0DF2CZZ8Z","B0GW95B1Z8","B0DCVVBT3C","B0DQ4T5M8C","B0G6ZZ95GB",
"B0FJWMGFF5","B0CGL8X4H6","B0GXKJWH2H","B0BTNZSXLG","B0G76X6Z2R","B0G772BRRL","B09DKQWTNC","B0FJQVD15L",
"B0GCZNDB69","B0D3HG7XZL","B0CWKPLHLH","B0GMQMKVKF","B0GQ95XNQX","B0F1TLPDWT","B0FPR2GR6F","B0DX791FXY",
"B0BZCCXJJ4","B0FDFZLCMM","B0FDG2RQTL","B0DZ6DR13F","B0FY2XRSJX","B0BTNZWYT5","B0F66LFC8Q",
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

writeFileSync(resolve(ROOT, "scripts", "data-mouse-kb.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-mouse-kb.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-mouse-kb.json and scripts/lookup-mouse-kb.json");
