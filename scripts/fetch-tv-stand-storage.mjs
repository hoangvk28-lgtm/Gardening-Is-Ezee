import { readFileSync } from "fs";
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
  if (!res.ok) throw new Error(`Token failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function getItems(asins) {
  const token = await getAccessToken();
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
  const text = await res.text();
  if (!res.ok) {
    console.error(`FAILED (${res.status}): ${text}`);
    return [];
  }
  const json = JSON.parse(text);
  if (json.errors?.length) {
    for (const e of json.errors) console.log(`  WARN ${e.code}: ${e.message}`);
  }
  return json.itemsResult?.items ?? [];
}

const asins = [
  "B09SHDW2KT",
  "B0GTYTR9VQ",
  "B0DBLBLMWL",
  "B0FK5BDCQ2",
  "B0H45H4VSP",
  "B0G52296MW",
  "B0FN3MYCGD",
  "B0FW4KXJ52",
];

const items = await getItems(asins);
for (const it of items) {
  console.log("=====", it.asin, "=====");
  console.log("title:", it.itemInfo?.title?.displayValue);
  console.log("image:", it.images?.primary?.large?.url);
  console.log("price:", it.offersV2?.listings?.[0]?.price?.money?.displayAmount);
  console.log("rating:", it.customerReviews?.starRating?.value, "count:", it.customerReviews?.count);
  console.log("features:", it.itemInfo?.features?.displayValues ?? it.itemInfo?.features);
}
console.log("\nReturned ASINs:", items.map((i) => i.asin));
console.log("Missing:", asins.filter((a) => !items.find((i) => i.asin === a)));
