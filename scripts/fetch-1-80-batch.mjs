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

const allAsins = ["B00006B81E","B004VGIGVY","B0057IKIZM","B00BTKAPUU","B00TP1C1UC","B01728NLRG","B01L0OSH18","B079K8W49X","B07BTN3QPT","B07PG9MSYX","B07Q3DJL3W","B07TWDB7CJ","B07V32PJ59","B07VVK39F7","B07YKBKWX2","B083JKSSR5","B083TMWFSZ","B08BF79MXN","B08FJ678YK","B08GQ9BQB4","B08K3R8QPF","B08KPJ76RR","B08KPJCDN6","B08LMYM7GW","B08LYHR45P","B08MTBCXWX","B08ND7C7P4","B08NP57YRG","B08P5LRY37","B08PJQ3MWB","B08R5W2782","B08R794ZMX","B08Z2ZKVXX","B092J8LPWR","B094ZFQ9QD","B09BNLNX9B","B09BNTZDB3","B09DF5PBBC","B09F2XPJ47","B09GTRVJQM","B09L2V6NKL","B09LMF648R","B09MF98MD2","B09NLW5HMX","B09NP7VSNK","B09P1TRMHL","B09PDLBFKY","B09QX53KH2","B09SG2Q23M","B09SKXDKF1","B09Y7DNJFR","B09YYDSGLK","B0B1DKN9HG","B0B3DC27Q3","B0B4ZSKPNL","B0B5G6MDQ6","B0B5X5DQPT","B0B84JLVBZ","B0B92W3QYY","B0B9SL7894","B0B9Y6N8QK","B0BFD3JVLB","B0BGPF71Q6","B0BHN1XNCM","B0BHRQNNGL","B0BJ1G18T3","B0BJ1SWDNB","B0BJXJ4WZJ","B0BLTYNJCK","B0BMF7PJ4X","B0BN2MGV5H","B0BNDM2RNG","B0BNLNRBN1","B0BNW64BPF","B0BRKQXNVQ","B0BVVPFRP7","B0BWJZQMKN","B0BWY8FBFP","B0BXP2ZTWB","B0BZ7H9RD9","B0BZPV9DYM","B0C453CLSY","B0C5M5P36T","B0C5X3DJ1Z","B0C6S6TPRH","B0C7JJKX5K","B0C7LGBTPD","B0C7QXZMN8","B0C8NDKJXV","B0C9GXKQLT","B0CF2CJ8WL","B0CHHZ4MGG","B0CHMG5XHM","B0CHW2LLSJ","B0CJNXP2KL","B0CKR7B9T9","B0CN6V6M5F","B0CRTQ69L6","B0CV3KGW1P","B0CYGSFFFW","B0CYHBHRHW","B0D1QNCRFH","B0D1XH8NJP","B0D2PQWXNM","B0D5R2J428","B0D7LQN3JT","B0D7M5XX6C","B0DBSTDM5D","B0DC6GXZSV","B0DCBC8KKV","B0DCZFXDDS","B0DG3PS4FY","B0DJVKNBGN","B0DK2QNXMR","B0DKBZ28T4","B0DKJKL5DF","B0DPKKMPBD","B0DPXVHFSB","B0DSFXVVX8","B0DT4F8T4L","B0DTHKDY14","B0DXPRK65X","B0DY4S3HP2","B0DYJMPJSV","B0DZ254SSR","B0F1T9R63P","B0F5LNYTR7","B0F83KL8LV","B0FKCS9XD2","B0FN2TGQR5","B0FNDG2TNK","B0FPFF7JN8","B0FR56387C","B0G8GN8PMS","B0GCLSGD3T","B0GGYZB137","B0GKM9D5G3","B0GVRYVC5C"];

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

writeFileSync(resolve(ROOT, "scripts", "data-1-80.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-1-80.json");
