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
  const res = await fetch(TOKEN_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_PAAPI_ACCESS_KEY, client_secret: process.env.AMAZON_PAAPI_SECRET_KEY, scope: "creatorsapi::default" }) });
  if (!res.ok) throw new Error(`Token failed: ${await res.text()}`);
  return (await res.json()).access_token;
}
async function getItems(asins, token) {
  const res = await fetch(`${API_BASE}/catalog/v1/getItems`, { method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
    body: JSON.stringify({ itemIds: asins, itemIdType: "ASIN", marketplace: MARKETPLACE, partnerTag: PARTNER_TAG,
      resources: ["images.primary.large","itemInfo.title","offersV2.listings.price","customerReviews.starRating","customerReviews.count"] }) });
  const json = await res.json();
  if (json.errors?.length) for (const e of json.errors) console.log(`ERROR ${e.code}: ${e.message}`);
  return json.itemsResult?.items ?? [];
}
const missing = ["B0DKXKG135","B0GBX2LXWY","B0DYDRSNBS","B0FKMDG1DM"];
const token = await getAccessToken();
const items = await getItems(missing, token);
console.log("Retried, found:", items.map(i=>i.asin).join(", "));
const existing = JSON.parse(readFileSync(resolve(ROOT,"scripts/data-116-152.json"),"utf-8"));
writeFileSync(resolve(ROOT,"scripts/data-116-152.json"), JSON.stringify([...existing, ...items], null, 2));
