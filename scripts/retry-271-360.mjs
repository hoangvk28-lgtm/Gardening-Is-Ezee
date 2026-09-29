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

const TOKEN_ENDPOINT = process.env.AMAZON_PAAPI_TOKEN_ENDPOINT ?? "https://api.amazon.com/auth/o2/token";
const API_BASE = "https://creatorsapi.amazon";
const MARKETPLACE = process.env.AMAZON_PAAPI_MARKETPLACE ?? "www.amazon.com";
const PARTNER_TAG = process.env.AMAZON_PAAPI_PARTNER_TAG ?? "theofficejournal-20";

async function getAccessToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.AMAZON_PAAPI_ACCESS_KEY,
      client_secret: process.env.AMAZON_PAAPI_SECRET_KEY,
      scope: "creatorsapi::default",
    }),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

async function getItemsWithRetry(asins, token, attempt = 1) {
  const res = await fetch(`${API_BASE}/catalog/v1/getItems`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
    body: JSON.stringify({
      itemIds: asins, itemIdType: "ASIN", marketplace: MARKETPLACE, partnerTag: PARTNER_TAG,
      resources: ["images.primary.large", "itemInfo.title", "itemInfo.features", "offersV2.listings.price", "customerReviews.starRating", "customerReviews.count"],
    }),
  });
  if ((res.status === 429 || res.status >= 500) && attempt <= 5) {
    const wait = 4000 * attempt;
    console.log(`${res.status}, retrying in ${wait}ms (attempt ${attempt})`);
    await new Promise((r) => setTimeout(r, wait));
    return getItemsWithRetry(asins, token, attempt + 1);
  }
  if (!res.ok) throw new Error(`getItems failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) for (const e of json.errors) console.log(`ERROR ${e.code}: ${e.message}`);
  return json.itemsResult?.items ?? [];
}

const missing = readFileSync(resolve(ROOT, "scripts", "missing-271-360.txt"), "utf-8").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
console.log(`Retrying ${missing.length} ASINs one at a time (slower, avoids throttling)`);

const token = await getAccessToken();
const allItems = [];
for (const asin of missing) {
  try {
    const items = await getItemsWithRetry([asin], token);
    allItems.push(...items);
    console.log(items.length ? `OK ${asin}` : `STILL MISSING ${asin}`);
  } catch (e) {
    console.log(`FAILED ${asin}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1200));
}

const existing = JSON.parse(readFileSync(resolve(ROOT, "scripts", "data-271-360.json"), "utf-8"));
const merged = [...existing, ...allItems];
writeFileSync(resolve(ROOT, "scripts", "data-271-360.json"), JSON.stringify(merged, null, 2), "utf8");

const lookup = JSON.parse(readFileSync(resolve(ROOT, "scripts", "lookup-271-360.json"), "utf-8"));
for (const it of allItems) {
  lookup[it.asin] = {
    title: it.itemInfo?.title?.displayValue ?? "",
    features: it.itemInfo?.features?.displayValues ?? [],
    price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount ?? null,
    image: it.images?.primary?.large?.url ?? null,
    rating: it.customerReviews?.starRating?.value ?? null,
    reviewCount: it.customerReviews?.count ?? null,
  };
}
writeFileSync(resolve(ROOT, "scripts", "lookup-271-360.json"), JSON.stringify(lookup, null, 2), "utf8");

const stillMissing = missing.filter(a => !merged.find(it => it.asin === a));
console.log(`\nRetried. Now have ${merged.length} total items. Still missing: ${stillMissing.length}`);
console.log(stillMissing.join(", "));
