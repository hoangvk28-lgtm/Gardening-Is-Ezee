/**
 * Sync product price + rating + review count from Amazon Creators API
 * into data/guides/*.ts static files.
 *
 * Usage:
 *   node scripts/sync-amazon-prices.mjs                # sync all guides
 *   node scripts/sync-amazon-prices.mjs best-corner-standing-desk   # sync one guide
 *
 * Requires AMAZON_PAAPI_ACCESS_KEY / AMAZON_PAAPI_SECRET_KEY / AMAZON_PAAPI_PARTNER_TAG
 * in .env.local. Only updates `price`, `rating`, `reviews` fields — never touches
 * description/specs/pros/cons (editorial content, per CLAUDE.md).
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GUIDES_DIR = resolve(ROOT, "data", "guides");

// ── Load .env.local (same pattern as scripts/seed-products.ts) ────────────────
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
  } catch {
    // no .env.local — rely on real env vars
  }
}
loadDotEnvLocal();

const TOKEN_ENDPOINT = process.env.AMAZON_PAAPI_TOKEN_ENDPOINT ?? "https://api.amazon.com/auth/o2/token";
const API_BASE = "https://creatorsapi.amazon";
const MARKETPLACE = process.env.AMAZON_PAAPI_MARKETPLACE ?? "www.amazon.com";
const PARTNER_TAG = process.env.AMAZON_PAAPI_PARTNER_TAG ?? "theofficejournal-20";

let cachedToken = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken;
  }
  const clientId = process.env.AMAZON_PAAPI_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_PAAPI_SECRET_KEY;
  if (!clientId || !clientSecret) {
    throw new Error("AMAZON_PAAPI_ACCESS_KEY / AMAZON_PAAPI_SECRET_KEY not set in .env.local");
  }
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
  cachedToken = { accessToken: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return cachedToken.accessToken;
}

async function getItems(asins, attempt = 1) {
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
      resources: ["itemInfo.title", "offersV2.listings.price", "customerReviews.starRating", "customerReviews.count"],
    }),
  });
  if (res.status === 429) {
    if (attempt > 5) throw new Error(`getItems failed (429) after ${attempt} attempts`);
    const wait = 2000 * attempt;
    console.log(`  ⏳ rate limited, waiting ${wait}ms (attempt ${attempt})`);
    await new Promise((r) => setTimeout(r, wait));
    return getItems(asins, attempt + 1);
  }
  if (!res.ok) throw new Error(`getItems failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) {
    for (const e of json.errors) console.log(`  ⚠ ${e.code}: ${e.message}`);
  }
  return json.itemsResult?.items ?? [];
}

function extractAsin(amazonUrl) {
  const m = amazonUrl.match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

async function syncGuideFile(filePath) {
  let content = readFileSync(filePath, "utf-8");

  // Pull id + amazonUrl pairs to find ASINs, in file order.
  const productBlockRegex = /id:\s*"([^"]+)"[\s\S]*?amazonUrl:\s*"([^"]+)"/g;
  const idToAsin = [];
  let m;
  while ((m = productBlockRegex.exec(content)) !== null) {
    const [, id, amazonUrl] = m;
    const asin = extractAsin(amazonUrl);
    if (asin) idToAsin.push({ id, asin });
  }

  if (idToAsin.length === 0) return { file: filePath, updated: 0, skipped: [] };

  const asins = idToAsin.map((x) => x.asin);
  const items = [];
  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);
    items.push(...(await getItems(batch)));
    if (i + 10 < asins.length) await new Promise((r) => setTimeout(r, 300));
  }
  const byAsin = new Map(items.map((it) => [it.asin, it]));

  let updated = 0;
  const skipped = [];

  for (const { id, asin } of idToAsin) {
    const item = byAsin.get(asin);
    if (!item) {
      skipped.push(`${id} (${asin}): not returned by API`);
      continue;
    }

    const priceAmount = item.offersV2?.listings?.[0]?.price?.money?.displayAmount;
    const rating = item.customerReviews?.starRating?.value;

    // Scope this replace to the specific product block by id, to avoid touching
    // a different product that happens to share a price/rating string.
    const idIndex = content.indexOf(`id: "${id}"`);
    if (idIndex === -1) continue;
    const nextIdIndex = content.indexOf('id: "', idIndex + 1);
    const blockEnd = nextIdIndex === -1 ? content.length : nextIdIndex;
    let block = content.slice(idIndex, blockEnd);
    const originalBlock = block;

    if (priceAmount) {
      block = block.replace(/price:\s*"\$[^"]*"/, `price: "$${priceAmount.replace(/^\$/, "")}"`);
    }
    if (rating) {
      block = block.replace(/rating:\s*"[^"]*"/, `rating: "${rating.toFixed(1)} stars"`);
    }

    if (block !== originalBlock) {
      content = content.slice(0, idIndex) + block + content.slice(blockEnd);
      updated++;
    }
  }

  writeFileSync(filePath, content, "utf-8");
  return { file: filePath, updated, skipped };
}

async function main() {
  const targetSlug = process.argv[2];
  const files = readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => !targetSlug || f === `${targetSlug}.ts`)
    .map((f) => resolve(GUIDES_DIR, f));

  if (files.length === 0) {
    console.error(`No guide file matched: ${targetSlug}`);
    process.exit(1);
  }

  const failedFiles = [];
  for (const file of files) {
    try {
      const result = await syncGuideFile(file);
      console.log(`✓ ${result.file.split(/[\\/]/).pop()}: ${result.updated} products updated`);
      if (result.skipped.length) {
        console.log(`  skipped: ${result.skipped.join(", ")}`);
      }
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
      failedFiles.push(file);
    }
    // pace requests between files to stay under the rate limit
    await new Promise((r) => setTimeout(r, 800));
  }

  if (failedFiles.length) {
    console.log(`\n${failedFiles.length} file(s) failed, retrying once more...\n`);
    for (const file of failedFiles) {
      try {
        const result = await syncGuideFile(file);
        console.log(`✓ (retry) ${result.file.split(/[\\/]/).pop()}: ${result.updated} products updated`);
      } catch (err) {
        console.error(`✗ (retry) ${file}: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

main();
