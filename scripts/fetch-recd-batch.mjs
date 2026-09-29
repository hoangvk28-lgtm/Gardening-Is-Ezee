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

const allAsins = ["B076CN96PK","B079RMDKZL","B079RMQ3Z5","B07KCM77LR","B07T4KL2JV","B08XN32TLL","B09HNKYRLW","B09NR9N6KL","B0B1B2PLB3","B0B5P4HSR5","B0BD4HDJWQ","B0BSZ86Q6F","B0BSZ8STXL","B0BSZD98MW","B0BSZF1CX1","B0BTK31BH1","B0BZT1CMCJ","B0C74V1KLW","B0CBX18WDW","B0CCSL6PTK","B0CH4SYZ7N","B0CPVW9Y3G","B0CSHZFMM6","B0CTCF7XYR","B0CTQFCRGK","B0CVR8GQH3","B0CWGR4YHS","B0CWGR9S3J","B0CWGS2JSW","B0D1DZKRY4","B0D6FVNS84","B0D9LMFQYD","B0D9QMQLKS","B0DBHCGCX2","B0DC68DKQ2","B0DFPYM24L","B0DHSCG98F","B0DK1GZZ3Y","B0DK792GQ5","B0DM1ZMDYK","B0DMD4QY78","B0DQKKL4M3","B0DR954VQ3","B0DSL853VB","B0DSPJDWYQ","B0DV4D5XLH","B0DVDWDGVD","B0DVDZPZR4","B0DWSSSGFC","B0DXTYXVN1","B0DYNNCY6R","B0F1VZ4XWD","B0F2SZCWSP","B0F5Q7VW2Q","B0F62D4Y2Z","B0F6VHD3NH","B0F7LKBP12","B0F846HR79","B0F8B95G8T","B0F9KSJ993","B0FB38WNPX","B0FCFNBPFR","B0FH65V64R","B0FHKW7JNB","B0FJ57TBC6","B0FJLR52LF","B0FJS13QLT","B0FP2DK5BJ","B0FSJ2H914","B0FSJ2LJXN","B0FSL9BGQ4","B0FVXRTN6W","B0FWJSYJ9Y","B0FWJYPPP3","B0FX3LKCJW","B0FXRFRFYG","B0FZ8MHB4N","B0G2S44MYC","B0G3C2WZQQ","B0G3CGVYQ8","B0G4M9Q3NB","B0G4VZPKVQ","B0G5P9Y69L","B0G6YWTW5X","B0G8ZPL9DS","B0GBWGFZ88","B0GDMNPVTF","B0GDMZRXQX","B0GDNS2NWN","B0GDPCMXHN","B0GDQCBKDW","B0GDQG85KV","B0GDQS6D8K","B0GDQWHJC8","B0GGY471WK","B0GKF7QRCF","B0GLXZCTW4","B0GLYDK28R","B0GLYFGYQM","B0GMBCZPHX","B0GMPWBHCR","B0GMQ32NXF","B0GNG72N1N","B0GRGD637J","B0GRGJLFDF","B0GRRL23LQ","B0GS5BP7L1","B0GSFD6SZK","B0GSFMX7BD","B0GSG2CJG6","B0GSZLDFX4","B0GV3S3L6M","B0GWRXDPQJ","B0GX9ZYHBG","B0GXB26RLF","B0GY4CDPSJ","B0GYCYSDNN","B0GZ3DY23D","B0H1HDXK9P","B0H2MFBWHH","B0H2VQD2GN","B0H2VV1W5L","B0H3PMZT37","B0H68Z6T1F","B0H6MP2XX2","B0H6WZ8SC7","B0H6X3VPY2","B0H7S7HFBQ","B0H7WTQSFY","B0H82YCQH5","B0H8YD2TWH","B0H8YHKHSQ","B0H8YSKTGY","B0H9D8FVKT","B0H9KTZTQ5","B0H9RFYVXR","B0HB3LTJXS","B0HB43BN19","B0HBBF4JFC","B0HBBFKJ4W","B0HBVNRNT1","B0HCL53ZGG","B0HDNDT5K6"];

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

writeFileSync(resolve(ROOT, "scripts", "data-recd.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-recd.json");
