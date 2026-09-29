import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
function loadDotEnvLocal() {
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
}
loadDotEnvLocal();
const ACCESS_KEY = process.env.AMAZON_PAAPI_ACCESS_KEY;
const SECRET_KEY = process.env.AMAZON_PAAPI_SECRET_KEY;
const PARTNER_TAG = process.env.AMAZON_PAAPI_PARTNER_TAG ?? "theofficejournal-20";
const MARKETPLACE = "www.amazon.com";
async function getToken() {
  const res = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: ACCESS_KEY, client_secret: SECRET_KEY, scope: "creatorsapi::default" }),
  });
  const data = await res.json();
  return data.access_token;
}
async function search(token, keywords) {
  const res = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "x-marketplace": MARKETPLACE },
    body: JSON.stringify({ keywords, marketplace: MARKETPLACE, partnerTag: PARTNER_TAG, resources: ["images.primary.large", "itemInfo.title", "itemInfo.features", "offersV2.listings.price"] }),
  });
  const data = await res.json();
  return data.itemsResult?.items || data.searchResult?.items || [];
}
const token = await getToken();
const queries = [
  "60 inch office credenza with storage",
  "office credenza with hutch",
  "modern office credenza cabinet",
  "budget office credenza under 300",
];
const pool = {};
for (const q of queries) {
  const items = await search(token, q);
  pool[q] = items.slice(0, 8).map(i => ({
    asin: i.itemId || i.asin,
    title: i.itemInfo?.title?.displayValue,
    price: i.offersV2?.listings?.[0]?.price?.money?.displayAmount,
    img: i.images?.primary?.large?.url,
    features: i.itemInfo?.features?.displayValues || [],
  })).filter(x => x.img);
  console.log(`\n=== ${q} (${pool[q].length}) ===`);
  pool[q].forEach(x => console.log(x.asin, x.price, x.title));
  await new Promise(r => setTimeout(r, 400));
}
writeFileSync(resolve(ROOT, "/tmp/credenza_pool.json"), JSON.stringify(pool, null, 2));
