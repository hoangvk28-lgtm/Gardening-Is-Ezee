import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GUIDES_DIR = resolve(ROOT, "data/guides");

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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: ACCESS_KEY, client_secret: SECRET_KEY, scope: "creatorsapi::default" }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("No token: " + JSON.stringify(data));
  return data.access_token;
}

async function getItems(asins, token) {
  const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
    body: JSON.stringify({
      itemIds: asins, itemIdType: "ASIN", marketplace: MARKETPLACE, partnerTag: PARTNER_TAG,
      resources: ["images.primary.large", "itemInfo.title", "offersV2.listings.price"],
    }),
  });
  const json = await res.json();
  return { items: json.itemsResult?.items ?? [], errors: json.errors ?? [] };
}

// Gather all distinct file+ASIN pairs across the ENTIRE site with the broken placeholder
const allFiles = readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".ts"));
const pairs = [];
for (const f of allFiles) {
  const filepath = resolve(GUIDES_DIR, f);
  const content = readFileSync(filepath, "utf8");
  if (!content.includes("01RmK")) continue;
  const productRegex = /imageUrl:\s*"([^"]*)"[\s\S]{0,400}?amazonUrl:\s*"[^"]*dp\/([A-Z0-9]+)/g;
  let m;
  while ((m = productRegex.exec(content)) !== null) {
    if (m[1].includes("01RmK")) pairs.push({ file: f, asin: m[2] });
  }
}
const distinctAsins = [...new Set(pairs.map((p) => p.asin))];
console.log("Total files affected:", new Set(pairs.map((p) => p.file)).size);
console.log("Total broken product slots:", pairs.length);
console.log("Distinct ASINs:", distinctAsins.length);

const token = await getToken();
const status = {}; // asin -> { real: bool, img, title, price, notFound: bool }
for (let i = 0; i < distinctAsins.length; i += 10) {
  const batch = distinctAsins.slice(i, i + 10);
  const { items, errors } = await getItems(batch, token);
  const returnedAsins = new Set();
  for (const it of items) {
    const asin = it.asin;
    returnedAsins.add(asin);
    const url = it.images?.primary?.large?.url;
    status[asin] = {
      real: !!url && !url.includes("01RmK"),
      img: url,
      title: it.itemInfo?.title?.displayValue,
      price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
      notFound: false,
    };
  }
  for (const a of batch) {
    if (!returnedAsins.has(a)) status[a] = { real: false, notFound: true };
  }
  process.stdout.write(`\rChecked ${Math.min(i + 10, distinctAsins.length)}/${distinctAsins.length}`);
  await new Promise((r) => setTimeout(r, 400));
}

const realCount = Object.values(status).filter((s) => s.real).length;
const stillNoImageCount = Object.values(status).filter((s) => !s.real && !s.notFound).length;
const notFoundCount = Object.values(status).filter((s) => s.notFound).length;
console.log("\n\n=== RESULTS ===");
console.log("Now have a REAL image:", realCount);
console.log("Valid product but Amazon has no image at all:", stillNoImageCount);
console.log("Not returned by API (likely delisted/invalid):", notFoundCount);

writeFileSync(resolve(ROOT, "/tmp/asin_status_full.json"), JSON.stringify(status, null, 2));
writeFileSync(resolve(ROOT, "/tmp/all_broken_pairs.json"), JSON.stringify(pairs, null, 2));
