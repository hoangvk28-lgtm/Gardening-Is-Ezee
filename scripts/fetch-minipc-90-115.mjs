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
  "B0C7437S8H","B0D6G965BC","B0FW43RV3D","B0FLJQW1RD","B0DRP316J1","B0G2C2CDR4","B0GLF2KYKN","B0FPC1J2L3",
  "B0GBX2LXWY","B0DYDRSNBS","B0DSPB26NK","B0DWSLBS9B","B0G6JJL7HZ","B0F2MW96PT","B0DP5ZTRZN","B0DPGYKH7G",
  "B0H1V7B63Z","B0FKMDG1DM","B0GY76RPSY","B0CXSRR796","B0DBYB71GJ","B0GCH917SW","B0GS3ST7XT","B0GT77MR53",
  "B0GQXR6FXG","B0GQXR6FX5","B0GY1N6LJD","B0DMCRSBNT","B0GX9J93RM","B0GJ4SHYNT","B0FLDC98GC","B0FSXDC7NR",
  "B0GD7NRS93","B0D22PLNJZ","B0CNZGFNWV","B0GGYB66SN","B0GR463LCQ","B0G2BGVKSL","B0G32PTF92","B0GF78LHXP",
  "B0GX667HRM","B0DLGP1NDJ","B0F53MLYQ6","B0F53QXNGH","B0FKYZF9HL","B0GLFF3XY2","B0G7YVNFWZ","B0GLF4KRYT",
  "B0F4WXKZRB","B0H6988Y89","B0G7F3FLDN","B0G39HV95T","B099KSJN8P","B0BC7S9R5C","B0DZGRLFLQ","B0F2MCQ8XQ",
  "B0GKZJ8GP7","B0DT68M444","B0H328M6ZP","B0DNFNXXYN","B0GX69JJQZ","B0GS8BRTNF","B0GRFR7TX2","B0BTBPC6TY",
  "B0CHWPQNGF","B0DZX5DWS5","B0F1KCNPQV","B0D79439GH",
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

writeFileSync(resolve(ROOT, "scripts", "data-minipc-90-115.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-minipc-90-115.json");
