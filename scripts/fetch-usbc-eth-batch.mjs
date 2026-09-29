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

const allAsins = ["B08CK9X9Z8","B077KXY71Q","B082K62S48","B08HQBC678","B07XTGKP5M","B08989MYQ2","B0CD1FDKT1","B014FBQ738","B08C9HZ5YT","B087QZVQJX","B0DNSTHRGQ","B0871ZL9TG","B0D3FRMNW5","B07HL1BG4X","B07GVZH5VG","B016FK6SCW","B0CWPKWRS4","B087QFQW6F","B011K4RKFW","B011DDXGVC","B084L4JL9K","B0CZYSGKS6","B0GY7T11DH","B0DTBLB6WY","B0C3GHBLB6","B0D3GZMN8X","B0F8TDL49F","B0D2RHMDTP","B0BW2TLQ8S","B01DKPJTWQ","B0B2JVQYFB","B0CQ78YZVL","B071SLP2B8","B0D953K2WK","B075FW7H5J","B0FMBLFTWW","B0G1WJFR5V","B0FY4RVJNM","B0FQJ7J8DR","B0CXBRNSC4","B0DQ9QGQYR","B0GR52N7WG","B0DSSV26P5","B0C2H9HVH3","B0DHXLGC92","B0DSCDGD4G","B0DY15GFNG","B0G81K4C12","B07H2ZS1B5","B0DN9F245H","B0DWF16X1N","B0FCMGDV5L","B0D3FM7Z4L","B0FVDG68JX","B0FC61NLVD","B0F8B7143W","B0FRFL14KV","B0DBV64QK2","B081QLZGCN","B0B7HVZNMB","B0F249TYWY","B0B28PCDM2","B0CS6BWL4Q"];

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

writeFileSync(resolve(ROOT, "scripts", "data-usbc-eth.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-usbc-eth.json");
