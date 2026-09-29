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
        "customerReviews.starRating",
        "customerReviews.count",
      ],
    }),
  });
  if (res.status === 429 && attempt <= 4) {
    const wait = 3000 * attempt;
    console.log(`429 throttled, retrying in ${wait}ms (attempt ${attempt})`);
    await new Promise((r) => setTimeout(r, wait));
    return getItemsWithRetry(asins, token, attempt + 1);
  }
  if (!res.ok) throw new Error(`getItems failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) {
    for (const e of json.errors) console.log(`ERROR ${e.code}: ${e.message}`);
  }
  return json.itemsResult?.items ?? [];
}

const allAsins = [
  // KVM 116-126
  "B0BYQH8JY7","B0C3MWLCYS","B0CFFCPL26","B0DXF66SWR","B09HFJMRK7","B0B3MWLCYS","B0CP4PD3SM","B0DD3X51XS",
  "B082F5Z1ZX","B07DPHFK23","B08FT2XMTQ","B09G8FQKFN","B0BG3FG7LF","B0C9SFKV52","B0GYMRCQ7X","B0GTPW6ZMN",
  "B0G34NJ11Y","B0GSZCW9NF","B0GY4R958W","B0DXF5Z23S","B0CRDQW4GT","B0H6X7Y3WZ","B07W5V79GS","B09Y4WFBYZ",
  "B0C8MSP967","B0CFVBK4XQ","B0F6MPW2JX","B0CW2JGRN4","B0FCXN5P3T","B0DLGP1NDJ","B0FM2SJS3K","B0GVMKWZRP",
  "B0FWC9NS9V","B0FNR3L4W9","B0GX1D9MCB","B0H6HVK9JF",
  // USB-C Monitor 127-135
  "B0CXJHGJX8","B0BWHPLSC6","B0C87DXQYZ","B0CP6ZQGVC","B0D1WPLQYB","B0CNJK4QKP","B0BXSG7W7R","B0CF3XQPKR",
  "B0CV24GQ9W","B08LCPY1TR","B0GD21577Z","B0F2349MJT","B0GKGBW8HT","B0B6PCXZ79","B0G31WC68M","B0FN4FF8L6",
  "B0FH6R7KZW","B0CDJF17G5","B0GFVYFS3S","B0H4DCTPDL","B0CQC2WSVJ","B0FV7H7CP3","B0G4QHGL55","B0F9SNYJDN",
  "B088D8JG3L","B0FPWVVS4Z","B0DN61HY1J","B0GJL9MWCB","B0B9NNWXVP","B0D44QFCPQ","B0F3MMK1J4",
  // Laptop Screen Extender 136-140
  "B0DKXKG135","B0CFKLK9JY","B0FNRNK72C","B0CD3WJXWH","B0DWXLCTGZ","B0GBY1CGWG","B0GZ1PHJYB","B0GG72J683",
  "B0GBYMFVKY",
  // Mini PC 141-152
  "B0GKZJ8GP7","B0GX69JJQZ","B0GRFR7TX2","B0GS8BRTNF","B0DNFNXXYN","B0H328M6ZP","B099KSJN8P","B0BC7S9R5C",
  "B0GLF2KYKN","B0G2C2CDR4","B0FW43RV3D","B0FLJQW1RD","B0DRP316J1","B0DSPB26NK","B0DWSLBS9B","B0H6988Y89",
  "B0GHQX488K","B0C7437S8H","B0GBX2LXWY","B0DYDRSNBS","B0G6JJL7HZ","B0DPGYKH7G","B0F2MW96PT","B0DP5ZTRZN",
  "B0GFCMGHJT","B0CQ4C9ZY1","B0G19ZF99R","B0FKMDG1DM","B0CXSRR796","B0DBYB71GJ","B0FLDC98GC","B0FPC1J2L3",
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

writeFileSync(resolve(ROOT, "scripts", "data-116-152.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-116-152.json");
