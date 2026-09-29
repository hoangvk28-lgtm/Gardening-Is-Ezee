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
  // Portable monitors 102-120
  "B0GHP4MKMP","B0FR8D6BQ3","B0CD3WJXWH","B0FVMC4BYJ","B07ZLY26FW","B0GGHPTLX9","B0DWXLCTGZ","B088D8JG3L",
  "B0BHNLZCNF","B0B9NNWXVP","B0DT44HPT3","B07TWGBG3P","B0D44QFCPQ","B0FXX3416Q","B0C9GNMDX3","B0GS6M3BZK",
  "B0CH9WTW56","B0FDL2VR2C","B0C9CH7MVN","B0C8J9VB27","B0F6VHTMGX","B0H3JDL4L2","B0G5YRPXTV","B0DP2HD8H8",
  "B0D95P19CT","B0DQGQW8YH","B0GN697Y3C","B0D9R8P9LL","B0F99H1KSL","B0FZT2V5HW","B0F99S27MZ","B0FSZZHJKC",
  "B0FR2222FL","B0G31WC68M","B0CH9XR3G4","B0FFRQFGML","B08LCPY1TR",
  // Paper shredders 121-135
  "B0CSJ3K6T3","B0DG2MGVMV","B0GFD6JYH1","B07CX4DZ4Z","B00IOFD08C","B09N991KVT","B0D5XPJ524","B0DTKBX3D9",
  "B0GVNH9RY2","B09FFJPQGD","B08J2N4CS2","B09FFHG8TZ","B0C6LZG69W","B0C6LZ8S34","B08YJ7V76J","B0C6LXQTST",
  "B07R3FXLLQ","B08NY9W23W","B07WJ4NLFX","B0C6LXGNY1","B0CJR7KXJX","B09MHR4457","B0GXZVRK3R","B0DK73XJCX",
  "B0DKXGNDLT","B0DSJSGHPP",
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

writeFileSync(resolve(ROOT, "scripts", "data-102-135.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-102-135.json");
