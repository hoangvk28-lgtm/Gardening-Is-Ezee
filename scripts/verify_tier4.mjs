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
  "B00CYPV29W","B017701FUE","B0GQM56Y2N","B0DGL5B76J","B0DNKM6NRF","B0DXZVVHCG","B0FFSTT5LQ","B0F13Q522K","B0DYN99XTT",
  "B08G53L8B5","B0D9XYD75W","B0D2QSQZ1X",
  "B0DXTWTCWS","B07Y8BXBX8","B09B3FJHHT","B0GF9TKQTW","B0F62NG547","B0CG6V2XGS","B0CQD3K8PJ","B0FQDM23S4",
  "B07B7K7N3P","B0H294B67V","B0FXGB6L96","B0DKNN49QP","B0CP22DQQS",
  "B0GDDH14P5","B0F9X3FDYY","B08C2LC3H2","B0BVQMQMY2","B09DYF1SRQ","B0BVR3RKLZ","B0D1C9LBN5","B003M96GY0",
  "B0GJZPVMG8","B0CDCQMGSH",
  "B0C4XW9167","B0CJ8SSP2Q","B0FVDDHRRH","B0FK3DD4F1",
  "B0CQNV8WBS","B0D21VTP3R",
  "B09D33BXHL","B07T291QPJ","B0GXX75JN5","B0B41X9SMT","B0FPLP3BND",
  "B0H33PY32C","B0G2M8PP28","B0G1C4H842","B0DJKJQ9SH","B0H25F5GNC","B0GX63SNCJ","B0FL6TKLRZ",
  "B0B3MB5F56","B0DQL795FX","B0DCG99Y8Y",
  "B0FPC7XF5D","B0DWMNPW7D","B0B41YH9B6","B08BHPMYGK","B0F8MHPVPH","B0BZ7GXM4M","B0DT3Y1X96","B0GS9B1X5X",
  "B09KT9RG1M","B09ZXSY378",
  "B0GLX92FFH","B0FVXRZJ12","B0FF3GMW36","B0C4Q7M3VC",
  "B0DFH8C526","B0BMTBSB7R","B0FMDTGYK2","B0BQMR29TC","B0DST8SCHS","B0FSCXHN6M","B0H5HRGGHF","B0H5LJ8H3V"
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
      const isPlaceholder = img && img.includes('01RmK+J4pJL');
      results[asin] = { status: isPlaceholder ? 'PLACEHOLDER_IMG' : 'OK', img, title, price };
    }
  } catch (e) {
    results[asin] = { status: 'ERROR', error: String(e) };
  }
  console.log(asin, results[asin].status, results[asin].price || '');
  await new Promise(r => setTimeout(r, 1300));
}

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
