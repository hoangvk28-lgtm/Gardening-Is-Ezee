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
  "B09TRZLPXP","B0FGCCWV6T","B0FP3LJ74G","B0FC5KYF71","B09P45LR5T","B0FGCH2QK2",
  "B0GTN9ZGRS","B07WL4JNH7","B07FN93WW7","B0D96T79YF","B01IIOMMRS","B0GPFLM562",
  "B096N8CNBZ","B096N85ZHW","B096N9JMXF","B08XZQVWZW","B084TV6BVM",
  "B01MA3EYC5","B09VF4Z2WQ","B0CP7STCSP","B0BXXPHZLR","B07S48NHYS","B099MLDBKJ","B0DR86V4ZV","B0DX6RVJF7",
  "B0BTYD7H28","B0CXP3WZZC","B0FR97FJD8","B0FSKN56ZN",
  "B0BSMSYM9N","B00K5UZO0Q","B0FDL1LS3B","B08MSWMTN6","B0DJWMNN2M",
  "B0CNT2F4Q5","B08V4H7T47","B0CL481GS1",
  "B0FGC43YCL","B07W69LJ41","B0F1Z1VLV6","B0CYP944DP","B0F9YBMJDV"
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

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch7_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
