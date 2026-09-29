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
  // Laptop Screen Extenders
  "B0CFKLK9JY","B088D8JG3L","B07V465K93","B0CH9XW8RK","B0G3X999FY","B0F6K5TXD5","B092LRR8HT","B08HDKVB75",
  "B0FVWQ6KZS","B0BHKY6JCC","B0DKXKG135","B0FBLP5K9G","B0GHXZX2J2","B0CPL3R2ZX","B0GK6VF7WH","B0G7FFB6P1",
  "B0GSZGP489","B0DFZVD25G","B0GLNM8BLC","B0GN697Y3C","B0F5HLWCJ5","B0GTXQ3VF5","B0H4TZK1CJ","B0FKH4MBQY",
  "B0GCNP4VGX","B0G2L4PLTD","B0CH9Y9SV3","B0B9NNWXVP","B09K3FWMPL","B07ZLY26FW","B0BNWWF32B","B0FWQZ1HT4",
  "B0GY2V4TG5","B0CP7XRW9S","B0H2YB4Z3Q","B0CL66GVJ5","B0GZYRF35L","B0G8YYGVKV","B0G1BD4GJY","B0GT7WTLV9",
  "B0F5QLJBS7","B0CQC2WSVJ","B0D59RS829","B0G4QHGL55","B0FMRGDL7V","B0FNQVJKX4","B0DP6Z8QMM",
  "B0BZ4FPN3K","B0H3L3TVHX","B0FR2222FL","B0FXX3416Q","B0GRDZFF9N","B0G2BG1DHL","B0G2BDJ91J","B0G34Y7KDH",
  "B0H2HGDJFR","B0CH9WTW56","B0GHP4MKMP","B09G9FQ844","B0GJSXHDCG","B0DWXLCTGZ",
  // USB-C Monitors
  "B0FVMC4BYJ","B0CPXW4F3B","B0B6PCXZ79","B0F1GFD44G","B0CDJBXNGW","B08KFSMGJ8","B08K2NT2G7","B0GD21577Z",
  "B09BXXWT6K","B0BLT79X2G","B0874M3KW4","B0BQLLB61B","B0GBX2LXWY","B0DYDRSNBS","B0H4DCTPDL","B0DR3YBSL4",
  "B0F1H325FN","B0H1VFKC84","B0DB8HLNPN","B0DHCW52VS","B0FKHMQ342","B0FHZVYNQ2","B0FNG95VKS","B0CZ3KWC3P",
  "B0FKJ2HB4C","B0FNFZ6H5F","B0FNQDB6JY","B0FLLSJ5PC","B0GGHPTLX9","B0G1YQ8CDM","B0F99864F1","B0CD3WJXWH",
  "B0CPFYVPBG","B08LCPY1TR","B0BQPSX5CR","B0FWHF97TT","B081FJRQJL","B0CP4PD3SM","B0DD3X51XS","B0F6MPW2JX",
  "B0CW2JGRN4","B0DK46JV64",
  // KVM Switches
  "B0CFFCPL26","B0GY4R958W","B0G34NJ11Y","B0DXF66SWR","B0F6MTC9LR","B0GSZCW9NF","B0G6KFDS9T","B0GVMKWZRP",
  "B0CFVBK4XQ","B0C8MSP967","B0D5D4FK1H","B0H2YVL93R","B0BWNDX4VL","B0CJ56ZPCG","B0DXF5Z23S","B0GTPW6ZMN",
  "B0GYMRCQ7X","B0C3MWLCYS","B0FCXN5P3T","B0FM2SJS3K","B0DLGP1NDJ","B0GX1D9MCB","B0FWC9NS9V","B0H6X7Y3WZ",
  "B0CRDQW4GT","B0FNR3L4W9","B0H6HVK9JF","B082F5Z1ZX","B07DPHFK23","B08FT2XMTQ","B09G8FQKFN","B07W5V79GS",
  "B0BG3FG7LF","B09Y4WFBYZ","B0C9SFKV52","B09HFJMRK7","B0CPMS3XGS","B0FDYBCFGR",
  // Mini PCs
  "B0GFCMGHJT","B0CQ4C9ZY1","B0BTBPC6TY","B0DMCRSBNT","B0DT68M444","B0F9FK9CT4","B0C7437S8H","B0DWSLBS9B",
  "B0D6G965BC","B0FPC1J2L3","B0DZX5DWS5","B0DZGRLFLQ","B0F1KCNPQV","B0G19ZF99R","B0GLF2KYKN","B0G2C2CDR4",
  "B0DSPB26NK","B0GHQX488K","B0FW43RV3D","B0FLJQW1RD","B0DRP316J1","B0CS31JRLG","B0D79439GH","B0C96FR8YC",
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

writeFileSync(resolve(ROOT, "scripts", "data-90plus.json"), JSON.stringify(allItems, null, 2), "utf8");
console.log("Saved to scripts/data-90plus.json");
