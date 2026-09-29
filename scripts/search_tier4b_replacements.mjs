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
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: ACCESS_KEY, client_secret: SECRET_KEY, scope: 'creatorsapi::default' }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No token: ' + JSON.stringify(data));
  return data.access_token;
}
const token = await getToken();
async function search(keywords) {
  const res = await fetch('https://creatorsapi.amazon/catalog/v1/searchItems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-marketplace': MARKETPLACE },
    body: JSON.stringify({ keywords, marketplace: MARKETPLACE, partnerTag: PARTNER_TAG,
      resources: ["images.primary.large", "itemInfo.title", "offersV2.listings.price"] }),
  });
  const data = await res.json();
  const items = data.itemsResult?.items || data.searchResult?.items || [];
  return items.slice(0,3).map(i => ({
    asin: i.itemId || i.asin,
    title: i.itemInfo?.title?.displayValue,
    price: i.offersV2?.listings?.[0]?.price?.money?.displayAmount,
    img: i.images?.primary?.large?.url
  }));
}
console.log('--- keyboard tray standing desk ---');
console.log(JSON.stringify(await search('standing desk with keyboard tray adjustable'), null, 2));
await new Promise(r=>setTimeout(r,1300));
console.log('--- room divider folding screen ---');
console.log(JSON.stringify(await search('folding room divider screen freestanding'), null, 2));
await new Promise(r=>setTimeout(r,1300));
console.log('--- room divider on wheels ---');
console.log(JSON.stringify(await search('room divider on wheels rolling privacy screen'), null, 2));
await new Promise(r=>setTimeout(r,1300));
console.log('--- double sided bookshelf ---');
console.log(JSON.stringify(await search('double sided bookshelf room divider'), null, 2));
