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
  "B07Q8TJ2KL","B0DSJN4XSX","B07T3KCQ94","B0GK7FVTR4","B0FQM6QB48","B0DGPZR6P1","B0DQ19YC9H","B0G523STF2",
  "B07Q1NJ15Q","B09T78LQYQ","B07T5SY43L","B0GK6DT5SF","B0CMT59SX2","B0855ZBPXD","B009S750LA",
  "B00358RFJ8",
  "B01LY6Z2M6","B07QLNYBG9","B0BMFQP2ZZ","B0C74GYW3J","B0D458QDVN","B06XCKGLTP","B0CCV74CL7","B07GR31BZZ",
  "B0BFJ4CRKD","B09NBWWP79","B0CJHZ92P6","B0CT6FFK4R","B0DHWGNW4P","B09C1BT8W3","B07K986YLL","B086GHDRX4",
  "B07ZWK2TQT","B0BTNY72VD","B0BKKYRQ31","B0FM2YSP5Q","B075GZVD4T","B01MFCTRZM","B09DKMB981",
  "B0BKVY4WKT","B0BTNXW6W2","B0FDFZLCMM","B09W4X9BMV","B0BZCCXJJ4","B0D94V544S","B0DX791FXY","B0GWZ33NFN",
  "B0CT444BH6","B00CMALD3E","B0089ZLENA","B0G3PCSK8B","B0FKCYLM55",
  "B083XT2WWD","B0B688M8MW",
  "B09TR4Y91J","B07WS7KSGT","B09JG7KRC7","B0D1DSW8TF","B09LK2Q3HL","B07QQB9VCV","B0CF3VGQFL","B0CDWP1D58",
  "B0DXZ97PCG","B0DCVPGB9N","B08MKSNYJD","B08LSJ4RHH","B0BDMLY69R","B09LK1P1RD",
  "B0BKVZK4TH","B0BKW3LB2B","B09LK3JCHX","B08B5WHYTT","B0D53P4PBY","B098JPSVKY",
  "B0BNTN886Y","B0CBPNWCVS","B0F36RKWDH","B089KV4YYX","B079JLY5M5",
  "B0D14LQ9XW"
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

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch3_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
