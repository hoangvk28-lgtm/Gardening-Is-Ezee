import fs from 'fs';

const envRaw = fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/.env.local', 'utf8');
const env = {};
envRaw.split(/\r?\n/).forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/\r$/, '');
});

const ACCESS_KEY = env.AMAZON_PAAPI_ACCESS_KEY;
const SECRET_KEY = env.AMAZON_PAAPI_SECRET_KEY;
const PARTNER_TAG = env.AMAZON_PAAPI_PARTNER_TAG;
const MARKETPLACE = 'www.amazon.com';

async function getToken() {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: ACCESS_KEY,
      client_secret: SECRET_KEY,
      scope: 'creatorsapi::default',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No token: ' + JSON.stringify(data));
  return data.access_token;
}

const asins = [
  "B0932BCM2T","B09Q2ZZGH2","B01L3LL95O","B00QXT5T3U","B0DLBD36HL","B0DDT75R2R",
  "B0D14N2QZF","B0D17C3ZVJ","B0D3CZYCH2","B08Z6X4NK3","B07WJ5D3H4",
  "B0B2DMKFM5","B08Z7J4KV3","B0DM8T2YZY","B0D14L7VZ6","B0B2DPFWGR","B07ZGDPT4M","B0BXX499PC"
];
const unique = [...new Set(asins)];
console.log('Total unique ASINs to verify:', unique.length);

const token = await getToken();

const results = {};
for (const asin of unique) {
  try {
    const res = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-marketplace': MARKETPLACE,
      },
      body: JSON.stringify({
        itemIds: [asin],
        itemIdType: 'ASIN',
        marketplace: MARKETPLACE,
        partnerTag: PARTNER_TAG,
        resources: ["images.primary.large", "itemInfo.title", "offersV2.listings.price", "customerReviews.starRating", "customerReviews.count"],
      }),
    });
    const data = await res.json();
    const item = data.itemsResult?.items?.[0];
    if (!item || data.errors?.length) {
      results[asin] = { status: 'FAIL', error: JSON.stringify(data.errors || data).slice(0, 200) };
    } else {
      const img = item.images?.primary?.large?.url;
      const title = item.itemInfo?.title?.displayValue;
      const price = item.offersV2?.listings?.[0]?.price?.money?.displayAmount;
      const rating = item.customerReviews?.starRating?.value;
      const count = item.customerReviews?.count?.value;
      const isPlaceholder = img && img.includes('01RmK+J4pJL');
      results[asin] = { status: isPlaceholder ? 'PLACEHOLDER_IMG' : 'OK', img, title, price, rating, count };
    }
  } catch (e) {
    results[asin] = { status: 'ERROR', error: String(e) };
  }
  console.log(asin, results[asin].status, results[asin].price || '', results[asin].rating || '');
  await new Promise(r => setTimeout(r, 1300));
}

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch4_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
