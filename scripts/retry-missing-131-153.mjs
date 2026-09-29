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

async function getItem(asin, token) {
  const res = await fetch(`${API_BASE}/catalog/v1/getItems`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: [asin],
      itemIdType: "ASIN",
      marketplace: MARKETPLACE,
      partnerTag: PARTNER_TAG,
      resources: ["images.primary.large", "itemInfo.title", "offersV2.listings.price", "customerReviews.starRating", "customerReviews.count"],
    }),
  });
  const json = await res.json();
  if (json.errors?.length) return null;
  return json.itemsResult?.items?.[0] ?? null;
}

const missing = [
  "B0CWMKGXQN","B0D5RDXP5G","B0CXQG7MNB","B0D1WQZK9T","B0CY4ZQPX6","B0D3HXKL7M","B0CZPMNQ8S","B0D7QVJX3N","B0CRXNM4PB","B0D2KPLQ7S",
  "B0CV8ZQNMP","B0D1G2MQ3K","B0C7GPQV3M","B0BX29KKDN","B0CMWQK8PD","B0D3KPLQ7S","B0CZQMNP8S","B0D5RDVP5G","B0CY7ZQPX6","B0CV8ZQNMQ",
  "B09NWSLW65","B0BX4KZQTM","B0C8PQKL7N","B0D1GHMQ3K","B0CMWPK8PD","B0CZPMNQ9S","B0CY4ZQPX7","B0D7QVJX4N",
];

const token = await getAccessToken();
const recovered = [];
for (const asin of missing) {
  const item = await getItem(asin, token);
  if (item) {
    console.log(`RECOVERED: ${asin}`);
    recovered.push(item);
  } else {
    console.log(`still invalid: ${asin}`);
  }
  await new Promise((r) => setTimeout(r, 1200));
}

console.log(`\nRecovered ${recovered.length}/${missing.length}`);
writeFileSync(resolve(ROOT, "scripts", "data-131-153-retry.json"), JSON.stringify(recovered, null, 2), "utf8");
