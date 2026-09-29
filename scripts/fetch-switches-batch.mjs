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

const allAsins = ["B07PFYM5MZ","B00A121WN6","B00A128S24","B08QDVSWX4","B07GR9S6FN","B0779R9LJ3","B09CYNHL4S","B0BTK552K2","B076HZFY3F","B0CWJMRTWY","B08MBFLMDC","B0FHK6N2H4","B082NRZFSD","B08222RLCG","B07S98YLHM","B000BCC0LO","B0863M7C1L","B0916BNNML","B0DS4KC7Y3","B0FS1FF6W2","B09LNLMH9Y","B0F43F5JJ3","B0DQ4SHSD1","B085TLT6Z4","B0CPT3K48S","B08PMDVS6F","B0F926J46M","B0F1GG2DC8","B07PJ7XZ7X","B0D9W9YNWD","B00K4DS5KU","B00CUG8ESM","B0CMFX748Y","B0CMXXPTVH","B08BZFJTRV","B0BFG73H7G","B0000BVYT3","B08CC8S1RM","B09NLCNGC7","B08CC7WNYQ","B09NN4ZNR7","B0FSCS1DZX","B0FVSNKX62","B079J6NWX1","B076DDXB2W","B0CH8NLKLF","B0CB1KKNK8","B0CH53KS25","B00MPVR50A","B085PQV5RW","B085PN1SNB","B09R3RDRGR","B07SN193Q6","B0BGKJDPDH","B0CMY2GT1G","B0C4X7VZV9","B0897WD95L","B0823HN12D","B0824HNVRY","B0721V1TGV","B0DT7S2JBP","B07Z8P4JZ2","B08J9ZC6J5","B076PRM2C5","B082KM3PWY","B0F99HKVD3","B082G2G2F8","B07788WK5V","B07KPLZ5Q2","B0CC9XGQVX","B0C9Y7C2BQ","B0B1HXD6BJ","B08TBXGN7J","B09FJLYLLY","B09WY79QBM","B07Y5ZWBCY","B0GKPNRFGF","B0DN6FL5S5","B08X6GQC6C","B0BZT6PKGY","B0CH9NHFHS","B0723DT6MN","B07NFXN4SS","B0DPR8KLV6","B07LFKGP1L","B082KNP2Y6","B08CQPGXZB","B0C2JLGLWQ","B004UBUJZG","B071KWTT8N","B0BYJM6FQ8","B0BQM8Z5WV","B0F7M592CC","B07HG8ZNBM","B0C2534G1N","B0BWWWF43C","B0DMGBNKS9","B0C64N2QN7","B0DNDSXHCK","B0CJMTT9DF","B0DPJPZS7S","B0CM9N3FTL","B07F2QMMTL","B078YDXVGH","B07C7TTYVX","B079C6NM48","B0DFMSNJVH","B006KAP4EG","B0G4CKXNTQ","B0G4CLYSYQ","B092CK2366","B0FGPCPG6W","B0GBX27LC3","B0823H5HLZ","B0CYRQB8YM","B0FH7QLRFH","B0FQYQHJLX","B000BC7QMM","B0C5S1C35Z","B0C5S3FSGQ","B0007SQGV2","B0C2J3599B","B0FJVVTFP4","B07PPXXHG5","B0G6CWFVB8","B0D953VG1X","B0BZGXQRQC","B0CQ2H55FY","B0D1XZJQ19","B0DCYRLNXP","B0BZH2W195","B0DY1NVQ6T","B0D9JBTBZB","B0CXD1BGH5","B001QUA6R0","B08MLN7BKZ","B0D954PJBM","B0D3FM7Z4L","B0DNSTHRGQ","B0FQJ7J8DR","B0FVDG68JX","B0DQ9QGQYR","B0G1WJFR5V","B0DJLNTBVF","B0DJLPNQZ6","B0D54STHFZ","B0FGL2PDZB","B08XWKF55C","B0BBLW7DXG","B0F4JZ9YJW","B0F9DWKZN3","B0H4YRQG38","B087QQ46K4"];

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

writeFileSync(resolve(ROOT, "scripts", "data-switches.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-switches.json");
