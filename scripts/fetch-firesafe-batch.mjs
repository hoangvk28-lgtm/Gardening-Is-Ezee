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

const allAsins = ["B008NHKWZU","B005P12C5A","B00MV7MYRM","B004QWZIMI","B00GE57DFK","B004FORBWW","B00CIAO77W","B08D6JLTXJ","B00BTMU8VY","B0F62VKH88","B09SZ6GPGR","B000GB3CBC","B0DTJWWDQZ","B004FORBX6","B000MPRHBS","B000MPMEZ2","B09CDFMX5X","B08K34LMXP","B0DZ83PN3G","B0H8TTKVBL","B0H91D3L9F","B0H8BKTQVS","B0H9YMC354","B0H87DHL4K","B0052U3EUQ","B0H66G2MZH","B0GTT1J592","B0CRR524VK","B00JQ753YQ","B0CLLZ9Q21","B0BQ8LPBV7","B00HS3NI4W","B078F5YFC5","B0G1LWZ1X6","B0FSJQPSTX","B0C333ZHLF","B0BQRV82F3","B0G1M87HB3","B0D3F9R7HS","B0194U7BMG","B0052U3E4W","B0BBNFTDZX","B0H5MQFK79","B005P12F2K","B008HZUI34","B0DLGCDTWM","B0FH1NW9RG","B0GGJ2BGSZ","B0GGHWPFH7","B0H5GM9K6K","B0GCR1Z73Z","B0C5DGQRCG","B0GC2X5PF4","B0CSKF7P7F","B0GWD6F45C","B0DSDMDX4M","B0FBVT8RKJ","B0H4QKX548","B0GTL48PX9","B0B2KXYBJ1","B0GLNHMRQT","B008HZUH94","B00LALPS50","B0H8M4HRKK","B0CGTW5YPX","B0F143XL1K","B0GRG2V3PZ","B0FPFQT7XL","B004VGA4VY","B0DJNJK1DB","B0GLF7Q1DW","B0H9SLC7DF","B0GRV7WC3R","B0GV3R89NC","B0GLNM151V","B0F7HL7SH3","B0DYNXWQ3N","B0DZ6HYYLT","B0FT6VKTMN","B0GL1SF4GH","B0B181WZ58","B0GLGL8XSY","B0918M5G28","B0BX2Z1TTT","B0BP1DZDK9","B0F6LBKKCW","B0GR9CNW4G","B07H2PBRXN"];

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

writeFileSync(resolve(ROOT, "scripts", "data-firesafe.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-firesafe.json");
