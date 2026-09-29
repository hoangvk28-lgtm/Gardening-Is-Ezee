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
"B0B3VSQFBG","B07Q31TB9D","B083BCTLP5","B085NDX8Y2","B08L6FY7CJ","B0GFMNCYT2","B0B4ZYY238","B09QRQCVFN","B0DMD367HJ","B0CYH6VXZ6","B0CNKJ4SL8",
"B0056B131I","B010HWCE0O","B013XFGFZ2","B00E8CIGCA",
"B09Y52L628","B0894PRC26","B07WLNFZMC",
"B08K4136SF","B0FH9PBGGW","B09WYD8GLN",
"B071Y3MSRK","B06ZXWVZ3X","B07RSH69HC","B01GU6TINM","B07CN8H84L",
"B08H83GCBT","B0DT3Q52PN","B0FR4L5XMV","B0DGBDR2PM","B0DG9ZXWMK","B08HDL3XJR","B0F8Z354YW",
"B0F6YB48N8","B0CCV6XVX6","B0DR2PZ5LC",
"B098WRBJYC","B0FS73S8WZ","B08CXQZ57R","B0BBLBYSG4","B07N5G4CZ2","B08L6FLCVK","B09YQ1ZP5F","B0CSJRLRXW",
"B01NBM0YY2","B07JJZYNRK","B01NBC762P","B07L9RPLFJ","B0765SHPK9","B07KPFGX26","B09JC17SQ3","B07CSHTB9Q","B01IB1HIY0",
"B0H4WY7XTG","B08R6R26VR","B01LYCNPFS","B09MM1WRBC",
"B08FRLSYQC","B0DB5W31X4","B09XB44G6G","B082KFTF41","B0CVVQJLWF","B0D46FMQTJ","B08L7WNHJ7",
"B0F5P2186C","B0D5Y7DLXQ","B0FM4K63P3","B0G2M2T6VN","B0FM3WLT2H","B0F7LDXHC2","B0FC1VJJFP",
"B0B33BQL8X","B0DP3JPMDC","B087QN42VM","B087QPTC7B","B0DW9HH53V","B087QNH43N","B0DP3JFY1Q","B0DW9JCDL2","B0DP3JGGJ9","B07ZHYQ5FP","B08Y9VZ6WD",
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

writeFileSync(resolve(ROOT, "scripts", "data-lcd-notebook.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
  rating: it.customerReviews?.starRating?.value,
  reviewCount: it.customerReviews?.count,
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-lcd-notebook.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-lcd-notebook.json and scripts/lookup-lcd-notebook.json");
