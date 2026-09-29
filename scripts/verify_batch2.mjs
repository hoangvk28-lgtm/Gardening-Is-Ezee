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

// Only ASINs NOT already verified in the previous NAS/docking batch
const asins = [
  "B0F7SFQM2Y","B08DDH5CPW","B01FKTZLBS","B0DTSZC5Y7",
  "B0GTWWJK9V","B0GN3YJN2F","B0FTFSGBB1","B0FHVZ53RN",
  "B0G8HFLYTN",
  "B0CP4PD3SM","B0DD3X51XS","B0F6MTC9LR","B0FMQVLGX3",
  "B0G34NJ11Y",
  "B0G7C8Q9FX","B0GLXBNVJ5","B0GF7XFTWQ","B09XH3PD25","B0FFS34WRY","B0BXDQS4BD",
  "B0BY7LGMNP","B07K4RC7X9","B0CTTL9R7Z",
  "B0FBXD383M","B0916F5DTM",
  "B0CBTVMMLB","B0CMQ6SK7W",
  "B0G6ZNG8MG",
  "B0C8814GKB",
  "B00JKM0ES2",
  "B0GXVK3G7S","B0FD38VQMJ","B08HLZ4X8Q",
  "B0GHR83DX5",
  "B088F7SY6S","B0D2BW24HM",
  "B00JKM0A36",
  "B0G7CYPZGW","B0DQWJNJ21","B0DDBV6BG7","B0F9NQGRR3","B0FRXGDPL5","B0F634PRY7",
  "B08DZHL5V5",
  "B0GKP61LKH","B0H2YRP5FS",
  "B0F83SH22S","B0DQXXSNW1",
  "B0BSG1V54Y","B0CKJNZRW3",
  "B0DKB3GQBM"
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

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch2_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
