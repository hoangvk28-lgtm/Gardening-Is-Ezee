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

async function getItemsWithRetry(asins, token, attempt = 1) {
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
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (attempt < 3) {
      console.log(`Retry ${attempt} after error: ${res.status}`);
      await new Promise((r) => setTimeout(r, 3000));
      return getItemsWithRetry(asins, token, attempt + 1);
    }
    throw new Error(`getItems failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  return json.itemsResult?.items ?? [];
}

const allAsins = [
"B0CKYS81T4","B07P2VK93P","B079QY6RFQ","B0D5YJ42CX","B0DN1C9RH2",
"B0CZTSXN5D","B07F8S18D5","B07Z82895W","B0DP42G526","B0CLKRZYSQ",
"B0BXPJZ93B","B07S9JXQP2","B0B9N41MCS",
"B0BYZG2YBY","B0C8M2JYP1","B0FRMMZ3RG","B0FH231Z93","B0C77YK94D","B09CPBXYH4","B0CCXFJYNK","B0CG16LSPG",
"B0DLLCWTR4","B0FBRMLLPY","B088RD7P4Q","B0FS7RVCMF","B0FHPSSS33","B0C77Z8WMM","B0CH9VBM6R","B0FPDDQ29F",
"B0FJRWBP6Y","B0GFVV4QXV",
"B0FQW29RCV","B0BFRHWCFV","B08LDHY54T","B0DQ8HGVLD","B0D8NYZVZW","B074473Z6T","B07N9L5934","B01G2RL026",
"B0GDFRLKPV","B0BGXH8F67","B09N184352","B001YJGDY8","B0G4QTWVWS",
"B0B8MK52TC","B0CNT2HNS1","B0DSMRXZKX","B0FK54K7Q4","B0CXCS7YBL","B0856Y4YZD","B01DPWLUU8","B0FQ8CP4RC",
"B0CJDS9JZ8","B0BR4K8HCZ","B0CT3YPZPS","B0DSZMWPW2","B0FRMF31RD","B0F21QLBYM",
"B005XK3R02","B09CRT7XZT","B0H25L4K69",
"B08T6P8LB6","B09FVJZD3L","B005T7XNDK","B09TQ6HY4J","B004GXB6RI","B0D8CNX88V","B0D92V2XZT","B0F6FGSF7Z",
"B000K3GBGY","B000GP0Z6I","B0D2TTGLDX",
"B0B5STNV6J","B0B3JSCMTS","B009JY00YE","B074T8WDJV","B09V16B2ZV","B0DP51HKWS",
"B082B29YKM",
"B0F62NH31N","B0DKDY3QMT",
"B08D6JLTXJ","B09W5B4B8V","B0BRTQ3C7G","B0BF4Y5WCS","B0DTJWWDQZ","B00GE57DFK","B0DMDJF8R2","B0F37SXGQ5",
"B0DKDYHRHF","B0CJ2FNCTQ","B0DRFNCHJZ","B0FWRFZPHW",
"B0GTWYT23D",
"B0DK3BCNFQ","B0FHJ4YM1X","B0BHNSXXPQ","B0GTWSYYCC",
"B0BKTMLGCT","B00CZOKOWI","B00TT1SX9Q","B09QRWT4ZF",
"B0GTWW1Z9Q","B09FVM5RNL","B0CN6G2DJ6","B0D2HMKRLR","B0BS9R6WN2",
"B0D62TW71V","B0GX12QFSV",
"B01GTX5WT0","B09KWY77P5",
"B002JGJ47S","B004I2GLJK",
"B07H82MBZ4","B08221QMF2","B09S9JD5G5","B0CS2ZZ8LH","B00256FXQI",
"B0GY8TFHMG",
"B0CDFHM4PR","B0FWRNWZKZ",
];

const uniqueAsins = [...new Set(allAsins)];
console.log(`Total unique ASINs to fetch: ${uniqueAsins.length}`);

const token = await getAccessToken();
const allItems = [];
for (let i = 0; i < uniqueAsins.length; i += 10) {
  const batch = uniqueAsins.slice(i, i + 10);
  console.log(`Fetching batch ${Math.floor(i / 10) + 1}/${Math.ceil(uniqueAsins.length / 10)}`);
  const items = await getItemsWithRetry(batch, token);
  allItems.push(...items);
  if (i + 10 < uniqueAsins.length) await new Promise((r) => setTimeout(r, 2000));
}

const foundAsins = new Set(allItems.map((it) => it.asin));
const missing = uniqueAsins.filter((a) => !foundAsins.has(a));
console.log(`\nFetched ${allItems.length}/${uniqueAsins.length} items.`);
if (missing.length) console.log("MISSING/INVALID ASINs:", missing.join(", "));

writeFileSync(resolve(ROOT, "scripts", "data-phonearm-cupholder-hanging-filebox.json"), JSON.stringify(allItems, null, 2), "utf8");

const lookup = allItems.map((it) => ({
  asin: it.asin,
  title: it.itemInfo?.title?.displayValue ?? "",
  price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
  image: it.images?.primary?.large?.url,
  features: it.itemInfo?.features?.displayValues ?? [],
}));
writeFileSync(resolve(ROOT, "scripts", "lookup-phonearm-cupholder-hanging-filebox.json"), JSON.stringify(lookup, null, 2), "utf8");
console.log("Saved to scripts/data-phonearm-cupholder-hanging-filebox.json and scripts/lookup-phonearm-cupholder-hanging-filebox.json");
