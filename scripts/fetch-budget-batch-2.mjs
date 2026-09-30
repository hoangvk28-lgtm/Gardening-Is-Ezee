import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const index = line.indexOf("=");
  if (index > 0 && !line.startsWith("#")) process.env[line.slice(0, index)] ??= line.slice(index + 1);
}
const version = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION;
const tokenEndpoint = version === "3.2" ? "https://api.amazon.co.uk/auth/o2/token" : version === "3.3" ? "https://api.amazon.co.jp/auth/o2/token" : "https://api.amazon.com/auth/o2/token";
const marketplace = process.env.AMAZON_CREATORS_MARKETPLACE ?? "www.amazon.com";
const partnerTag = process.env.AMAZON_ASSOCIATES_PARTNER_TAG;
const pause = (ms) => new Promise((resolvePause) => setTimeout(resolvePause, ms));
const queries = {
  "electric-pruning-shears": ["electric pruning shears", "cordless electric pruning shears"],
  "electric-tillers": ["electric garden tiller", "cordless electric tiller"],
};

async function getToken() {
  const response = await fetch(tokenEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_CREATORS_CREDENTIAL_ID, client_secret: process.env.AMAZON_CREATORS_CREDENTIAL_SECRET, scope: "creatorsapi::default" }) });
  if (!response.ok) throw new Error(`Token request failed (${response.status})`);
  return (await response.json()).access_token;
}

async function search(token, keywords, page, sortBy, attempt = 1) {
  const request = { partnerTag, marketplace, keywords, searchIndex: "GardenAndOutdoor", itemCount: 10, itemPage: page, resources: ["images.primary.large", "itemInfo.title", "itemInfo.byLineInfo", "itemInfo.features", "itemInfo.productInfo", "offersV2.listings.price", "offersV2.listings.availability"] };
  if (sortBy) request.sortBy = sortBy;
  const response = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": marketplace }, body: JSON.stringify(request) });
  if (response.status === 429 && attempt <= 5) { await pause(2500 * attempt); return search(token, keywords, page, sortBy, attempt + 1); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`SearchItems failed (${response.status}): ${payload.message ?? "unknown error"}`);
  return payload.searchResult?.items ?? [];
}

function compact(item, query) {
  const listing = item.offersV2?.listings?.[0];
  return { asin: item.asin, title: item.itemInfo?.title?.displayValue ?? "", brand: item.itemInfo?.byLineInfo?.brand?.displayValue ?? item.itemInfo?.byLineInfo?.manufacturer?.displayValue ?? "", features: item.itemInfo?.features?.displayValues ?? [], productInfo: item.itemInfo?.productInfo ?? {}, image: item.images?.primary?.large?.url ?? "", price: listing?.price?.money?.amount ?? null, currency: listing?.price?.money?.currency ?? null, availability: listing?.availability?.message ?? "", detailPageURL: item.detailPageURL ?? `https://www.amazon.com/dp/${item.asin}?tag=${partnerTag}`, query };
}

const accessToken = await getToken();
const added = {};
for (const [pool, terms] of Object.entries(queries)) {
  const items = new Map();
  for (const keywords of terms) for (const sortBy of [undefined, "Price:LowToHigh"]) for (let page = 1; page <= 4; page += 1) {
    const found = await search(accessToken, keywords, page, sortBy);
    found.forEach((item) => items.set(item.asin, compact(item, keywords)));
    console.log(`${pool}: ${keywords}, ${sortBy ?? "default"}, page ${page}, ${found.length} returned`);
    await pause(1200);
  }
  added[pool] = [...items.values()];
  console.log(`${pool}: ${added[pool].length} unique items`);
}
const existing = JSON.parse(readFileSync("/tmp/gardening-budget-batch-1.json", "utf8"));
const merged = { fetchedAt: new Date().toISOString(), marketplace, pools: { ...existing.pools, ...added } };
writeFileSync("/tmp/gardening-budget-all.json", `${JSON.stringify(merged, null, 2)}\n`, { mode: 0o600 });
console.log("Saved merged private research data to /tmp/gardening-budget-all.json");
