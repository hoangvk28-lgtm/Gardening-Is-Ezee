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

const allAsins = ["B0DSBSSRTL","B0DT6BMF75","B0DT6PSH74","B0D5Y8W3MD","B0FKVTTKC4","B0FCFQCBFR","B0H3T2LRYT","B0CYLDWZ2G","B0FM8Z5C31","B0FNRYHJW6","B0D5YCD65Y","B0FNRWHJ2W","B0DT4QMCT2","B0FCMYZBD5","B0D6XDQG6W","B01MZXDGZ2","B0D14MCG58","B0DBLBH7VW","B0C3MVF134","B0DWLB9YQN","B0F8BC37HB","B08P25GL3G","B0DW9GCDJ4","B0CH15YS6Y","B0CJM28JLM","B08SVVT9QV","B01N6L8QMG","B0FHSPLRR4","B0BDQ84L6Z","B0B5PLPHVV","B0F9HH4V6B","B06Y5MMHXB","B0FRLYC1Z7","B0F3XG2WHG","B007I8R97O","B000G1E79S","B0FJ28CG28","B0F2N282RL","B0BG5RVXD5","B08413MWDV","B0DBHVWYSG","B0DTFW13J4","B0F8B7H78L","B0GQZMFVPV","B0FH73V125","B0FR43HLTX","B0H3T6HJPY","B0BTP2PRZ8","B0DWLCT2GT","B0FB3RRXCP","B0C141DHLL","B0FCG845TV","B0DS58BPGS","B0CS9GMXT2","B0FRS2GJYY","B0F9Y7QBDL","B0FGCV6N8W","B0FB3VD3VT","B0DBLB2TRG","B0GQZJNDFM","B0FHW6YPQ6","B0FS5VGR6B","B0FGCWBYVD","B0FV8F222Y","B0FKVSRV23","B0GGYZ25LP","B0FQP2BZFS","B0FH22L5HY","B0CLQS4KRV","B0C28DNHRV","B0FPMDHXFN","B0DSBDN4X4"];

async function getItemsWithRetry(batch, token, retries = 5) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await getItems(batch, token);
    } catch (e) {
      if (String(e.message).includes("429") && attempt < retries - 1) {
        const wait = 3000 * (attempt + 1);
        console.log(`Rate limited, waiting ${wait}ms...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
}

const token = await getAccessToken();
const allItems = [];
for (let i = 0; i < allAsins.length; i += 10) {
  const batch = allAsins.slice(i, i + 10);
  console.log(`Fetching batch ${i / 10 + 1}: ${batch.join(", ")}`);
  const items = await getItemsWithRetry(batch, token);
  allItems.push(...items);
  if (i + 10 < allAsins.length) await new Promise((r) => setTimeout(r, 2000));
}

const foundAsins = new Set(allItems.map((it) => it.asin));
const missing = allAsins.filter((a) => !foundAsins.has(a));
console.log(`\nFetched ${allItems.length}/${allAsins.length} items.`);
if (missing.length) console.log("MISSING/INVALID ASINs:", missing.join(", "));

writeFileSync(resolve(ROOT, "scripts", "data-iwb.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-iwb.json");
