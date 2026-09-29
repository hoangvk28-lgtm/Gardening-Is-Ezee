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
  // NAS
  "B0FB7KQLR1","B0BRNBVTJK","B0D22HBFK1","B0FNWHSPXF","B0C5MB5MTS","B0CHYPGX1M","B091DWPH4T","B0GTX78T19",
  "B0G1C1YNN8","B0D22JRHZB","B0F895RV3K","B0C8S7SF4B","B0GTZC19FX","B0F8BX4RCV",
  // Docking
  "B0CW9249DK","B0874M3KW4","B0D1XSKZRJ","B0FCLC1RMM","B0DW85W3FV","B0GWH4ZZ7T","B0CNTTVVN6","B0CM2WKGLC",
  "B0C616N8T5","B0FGFW5FVD","B0DSVVJXK5","B0F2GQZXVL","B08TQPTPCK","B0GGTQ2KDQ","B09GK8LBWS",
  "B09DNL4C9J","B07R68XHZ9","B0D2JH1RWR","B0DJDVVC7Q",
  "B0D437YLL5","B08669458L","B0BL8MXCQ8","B0B13Y2QVW","B0FSRNYYMH","B0CK7L7M6S"
];
const unique = [...new Set(asins)];
console.log('Total unique ASINs:', unique.length);

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

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/nas_docking_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
