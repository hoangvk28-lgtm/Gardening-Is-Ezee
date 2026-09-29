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
  "B085Z7WVXR","B0DFXS9X72","B0BXXK6JF5","B0H4LVYPC2","B0GWYP696K","B0EXPERLAM",
  "B0CNH9SQT7",
  "B0DLL4H69Z",
  "B0DFW9D66S","B0784HWPN6","B075JYG2TB","B0BY17NR4Q","B0CR1CM8JK","B0F2H4X11C","B0DCFZV2GP",
  "B0DBQ4JX85",
  "B0CLDV21TZ","B0DN5P11PP",
  "B0FLJ8MKRW","B0BQCRMYYK","B0GQ95QCV6","B0FK9SYSVB","B0GH134WWH",
  "B00CYQ5PPI","B0DK3KNV8X","B0FK9WL95D",
  "B0H6JFQKW7","B0H6J86PS3","B0H94FKL7V","B0H94DMCSW","B0GS52M63V",
  "B0CR18R9YM",
  "B0DFH84G4N","B0DZGN4B8V","B0DFH4ZR71","B0FH3TC367",
  "B0DKSRFWF7","B0H3L3224G","B0DK1BMNBD","B0DK196S27","B0DST8C4GG",
  "B0B3J58T4N","B095HN9SFR","B0FBZ6HFBX","B0F8Q51T9M",
  "B0DFH7RGSC",
  "B0GYQLX52Z","B0GTN96T9J","B0DTH9XM7F","B0832D9S62","B0CP4YY751"
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

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4b_verify_results.json', JSON.stringify(results, null, 2));
console.log('Done');
