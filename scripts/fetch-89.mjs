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
  // Wi-Fi 7 Routers
  "B0DC99N2T8","B0DVBP5L6Y","B0DW27FNG3","B0F114274T","B0CJSNSVMR","B0F76PQ2T8","B0GCQFVDNJ","B0CN8QLS4K",
  "B0FTTPB4MQ","B0DVV9KJSN","B0CPQYSXCW","B0D55SWRSM","B0C4VZWTM7","B0GQ6QHTND","B0D955ZMSR","B0DQP4DNNJ",
  "B0DKVDZXSN","B0FH39S1XJ","B0CD9QCPS5","B0BRD7YGR6","B0D48GS6KB","B0BRD3P4XV","B0CF7L4D4N","B0D6GZDYS3",
  "B082XW53G3",
  // Portable SSDs
  "B0DCNKKS91","B0CX4V14YG","B0BX411HCT","B09QV692XJ","B0BFHQMJR8","B0C5JWV5LR","B0B2QNKXRD","B0CKXQ9NMB",
  // Monitor Shelves
  "B094QTGHNZ","B073VKC134","B088NHGC48","B0DJKSMV2T","B0F5PPDTVR","B09QWC568X","B0CFQ5Y7SY","B0BYCPN4G5",
  "B095RLRP2L","B0DB8F7GDN","B08L3TMM2X","B07Q79ZZJ6","B0BHMW8HFB","B09FM3DJ3Q","B0DCC5S4SX","B0D8HYFZSW",
  "B0DSZ9NYTL","B097DB15ZH","B07KK6RXS2","B0GDTXTCWV","B072QDMRS8","B0C131DL82","B08NPKVRD9","B0CP1L1KS9",
  "B07DDBJHPT","B071G5KX3X","B0BHNVC7HN","B083JYX48S","B08KPQQ8B2","B07S868SFX","B0GD7SNZDD","B0BP2TS5Q5",
  "B0BHNYG71G","B0GD7X2T74","B0D9882DJK",
  // Desk Pegboards
  "B09CVJWJF5","B09CFJGXTG","B0B4KFVSBH","B0BYNF8HQX","B0BT3XZ9XB","B0C9QVKX2N","B0CF7PG9W8","B0BXZJL7M4",
  "B0CY29ZZ3V","B0G41Y1HV9","B0H6B73JS1","B0DYJR7JLB","B0F3TN7G3F","B0DVDSJPL5","B0G6K8HR11","B0FQJ21TD4",
  "B0CTQND9BL","B0CTQ8NWTQ","B0G4R17HMV","B0DK13ZHNJ","B0CLWM7K88","B0D28PWFMS","B0D28G6X4W","B0CP15DGV5",
  "B0DBHJ71VB","B0CJ2MYYHH",
  // Under-Desk PC Mounts
  "B01MEDE9WO","B0DXMKWPFQ","B0DBB2W47P","B0DGQR4DNJ","B0DGQPHDBM","B0CJ4PF7Q7","B0G6YWLKQH","B0FHVQ5T8N",
  "B0BHF5W87B","B0FCY4Q147","B0FBTV38DN","B0G4VWDDQF","B0GLYK9NPM","B0FWCHJBFN","B0FG7VYC6T","B0GF95FV2V",
  "B0GWGZCWWX","B0DZXWGNRY","B0H24RR3F2","B0C98RW5D7","B0FD9XCYM7","B0CLJ8GKF9","B0FQP5HTYH","B0G583XQC2",
  "B0D8K75FDV","B0DG8NVXY9",
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

writeFileSync(resolve(ROOT, "scripts", "data-89.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
  rating: it.customerReviews?.starRating?.value,
  reviewCount: it.customerReviews?.count,
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-89.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-89.json and scripts/lookup-89.json");
