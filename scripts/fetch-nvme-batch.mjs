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

const allAsins = ["B0F933F1G8","B09T97Z7DM","B0D53K7HK9","B0BJ24GHC7","B0F62NG7K3","B0FVPMBYCS","B08RVC6F9Y","B07MNFH1PX","B08G14NBCS","B08QTPFG95","B0FCRZ5Z5W","B0C8CZB5S7","B08FT59SB6","B0CLV3D3H6","B0F8VDRTS7","B0FV1PNJ5B","B0DQD5ZSD3","B0GG9PS1F6","B0DXF5SV2L","B0FS1P13VY","B0FWC16GK6","B0FDKHN1VZ","B0GWKN9BGT","B0CVNPMR4Q","B0DN5ZM2ZR","B0D2NHJT6T","B0CPRHVLFQ","B0CPR88QFJ","B0FFJWMRN2","B0FFJKGCFP","B0F1MVDNJX","B0B6NDWK32","B0B4N5PM2F","B0DRRK4NS5","B0FSZH7VZW","B0DBYCDPWG","B0FCMSYS6Z","B0BYPVNBTQ","B0D5B8KYLW","B0F8BFGXK9","B0FPWWTVNC","B0FPWTQ332","B0D54XG52K","B0DJWV75PZ","B0CB3K5ZVF","B0CFTNMW1W","B0GSPVC4FW","B0GZNSMN1K","B0G1RS96HN","B0CR7BY3Y3","B0CFXS4KNC","B07ZKB4SLK","B0BW1XGH57","B0F1DXBGGK","B0H3518B1X","B0FBBH35P8","B0GWKJJXTL","B0CYLDM23M","B0892BK5L6","B097H7JZVG","B0FB3GBFF7","B0DRX4X7VD","B0G2XMHJLQ","B0FX9KC3JK","B0FX9LCS4C","B0C93VPP6W","B0BGQJ7CZH","B0CJ5TWXYQ","B0DFM52586","B0GDY4HZBH","B07N48N5GR","B0GYW5RNCS","B0GYX1WQCK","B0DV6WJ88D","B0GQ4DN6MH","B0GQ42B4WQ","B0GC9S23R1","B0FMDZ63WM","B0BF9CFMCC","B0FKFX8H24","B0F1MVPHQM","B0DL5MF1NM","B0FT7GKYTF","B0DR8RS7R6","B0CC949SF2","B0G1MD2KDN","B0FQ5CYC8X","B0CP85BQKV","B0FP8Q5TKV","B0F9WJL218","B0FRM8Q873","B0G7VZKXPZ","B0GR6SQYNS","B0DP9GYKVX"];

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

writeFileSync(resolve(ROOT, "scripts", "data-nvme.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-nvme.json");
