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

async function getItems(asins, token) {
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
  if (!res.ok) throw new Error(`getItems failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) {
    for (const e of json.errors) console.log(`ERROR ${e.code}: ${e.message}`);
  }
  return json.itemsResult?.items ?? [];
}

const allAsins = [
  // Document Scanners 136-150
  "B0FWGTB3S3","B0F9B1H5VN","B0F9B1PMTS","B08P3YVH3X","B09FX5DWBK","B09FX5SRQT","B08FBHTD9B","B07KQZWPYN",
  "B083R36CY4","B083R3XYQN","B07G5XZVLQ","B07KRXXWYY","B07FPQZ6H8","B08P3ZT5WH","B08P3YM18F","B0C6NL3HFX",
  "B07VSHQSKW","B0CC9SRRL3","B0075323W8","B00Z2GDAOK","B0018POCW8","B0GJWWZ77J","B0BWNTNGN5",
  "B0BM92YPHW","B08NSJQ65L","B0FCBVYMC6","B09TRFK7D2","B0GXZJ5FC6","B091MDDQK9",
  // UPS 151-160
  "B08GRY1W93","B0779KYKLB","B00429N19W","B00429N192","B00429N18S","B077Y62GSJ","B0D5QSYK69","B0D5QNMS8N",
  "B0BCMLLSHL","B06VY6FXMM","B06VY12HW4","B00K8ZMTAQ","B000BMBT4I","B06WP9Q8ZN","B085JJZDFK","B005GZRUZW",
  "B01FWAZEIU","B0GPY6ZNV2","B0FPD6PJ92","B000QZ3UG0","B0B354X985","B0GJ5WBM5D","B07GZR9DSK","B0010DF6UK",
  "B07SKX78PV","B0FL2RKQ54","B00DBAAJQ6","B07GZR981Y","B00DBAA696","B000RZPK1W","B004ZMESXE",
  // Speakerphones 161-165
  "B07ZNT7PRL","B0F4GCS5WG","B0F28HTJP3","B0BWKTR73Y","B0FC3XV5DK","B09FJ7LWX4","B0BVZLS5GZ","B08CV6MGJH",
  "B09WWYKP42","B00AQUO5RI","B0F28GK73P",
  // Desk Privacy 166-169
  "B07ZHP4N5T","B0CJ5PSVDP","B0B4N5QKC1","B07ZHPPV9J","B0C6XLTPH5","B0FYPJNB82","B0C9LJKRL2","B0F8B7N5K6",
  "B0GTQM26FB","B0DDK7VFNV","B0GL8CKJMS","B0F7R7GKQS",
  // Acoustic Dividers 170-171
  "B0C1GFN2YT","B0GLYKSZYN","B0DPFRWSTM","B0FYPHYYRV","B0F2HC56SD","B0F2HCQN2H","B0GG9TW8MK","B07ZWN92PX","B0DG54HMNC",
  // Video Lighting 172-175
  "B08LZKSMRH","B08YJPJLFV","B0C2C9QT91","B0BLHHV648","B0FLPR9ZBK","B0F6TYSX29","B087CZ85GV","B095741MZS",
  "B097QZGRCQ","B0D2XMLRL3","B0CZMPX2PW","B0F4KR9R2D","B0C4JTPPYY",
];

const token = await getAccessToken();
const allItems = [];
for (let i = 0; i < allAsins.length; i += 10) {
  const batch = allAsins.slice(i, i + 10);
  console.log(`Fetching batch ${i / 10 + 1}: ${batch.join(", ")}`);
  const items = await getItems(batch, token);
  allItems.push(...items);
  if (i + 10 < allAsins.length) await new Promise((r) => setTimeout(r, 400));
}

const foundAsins = new Set(allItems.map((it) => it.asin));
const missing = allAsins.filter((a) => !foundAsins.has(a));
console.log(`\nFetched ${allItems.length}/${allAsins.length} items.`);
if (missing.length) console.log("MISSING/INVALID ASINs:", missing.join(", "));

writeFileSync(resolve(ROOT, "scripts", "data-136-175.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-136-175.json");
