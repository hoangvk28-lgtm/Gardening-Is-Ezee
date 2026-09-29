import fs from 'fs';

const b6 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch6_verify_results.json', 'utf8'));
const t4 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4_verify_results.json', 'utf8'));
const all = { ...b6, ...t4 };

// [asin, rating, reviewCount] — reviewCount null means "available" (no rating shown by user)
function p(asin, rating, count) { return { asin, rating: rating || null, count: count || null }; }

const guides = [
  [1, "Best Murphy Beds with Desks", "best-murphy-beds-with-desks", "compact-home-office", "murphy-beds", [
    p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0GQM56Y2N",4.5,19),p("B0DGL5B76J",4.2,396),
    p("B0DNKM6NRF",4.2,112),p("B0DXZVVHCG",4.0,141),p("B0FFSTT5LQ",4.0,141),p("B0F13Q522K",4.0,120)]],
  [2, "Best Filing Cabinets for Home Offices", "best-filing-cabinets-for-home-offices", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B08G53L8B5",4.5,1681),p("B0GTNJY2HB",4.2,1671),p("B0989HLF81",4.2,2444),
    p("B0BQJ5WL24",4.1,7901),p("B0DBZ98D94",4.2,1425),p("B0D9XYD75W",4.0,1303),p("B0D2QSQZ1X",4.0,382)]],
  [3, "Best Murphy Beds for Small Spaces", "best-murphy-beds-for-small-spaces", "compact-home-office", "murphy-beds", [
    p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0GQM56Y2N",4.5,19),p("B0DGL5B76J",4.2,396),
    p("B0DNKM6NRF",4.2,112),p("B0DYN99XTT",4.2,112),p("B0DXZVVHCG",4.0,141),p("B0F13Q522K",4.0,120)]],
  [4, "Best Office Chairs for Long Hours", "best-office-chairs-for-long-hours", "office-chairs", "long-hours", [
    p("B0DXTWTCWS",4.5,34180),p("B07Y8BXBX8",4.4,14478),p("B09B3FJHHT",4.4,10760),p("B0GF9TKQTW",4.6,165),
    p("B0F62NG547",4.4,546),p("B0CG6V2XGS",4.3,6155),p("B0CQD3K8PJ",4.3,4362),p("B0FQDM23S4",4.3,64003)]],
  [5, "Best Filing Cabinets for Small Spaces", "best-filing-cabinets-for-small-spaces", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B08G53L8B5",4.5,1681),p("B0GTNJY2HB",4.2,1671),p("B0DBZ98D94",4.2,1425),
    p("B0989HLF81",4.2,2444),p("B0BQJ5WL24",4.1,7901),p("B0D9XYD75W",4.0,1303),p("B0D2QSQZ1X",4.0,382)]],
  [6, "Best Office Chairs for Small Spaces", "best-office-chairs-for-small-spaces", "office-chairs", "small-spaces", [
    p("B0FQDM23S4",4.3,64003),p("B07B7K7N3P",4.2,68389),p("B0H294B67V",4.5,537),p("B0FXGB6L96",4.3,3442),
    p("B0DKNN49QP",4.2,2568),p("B0CQD3K8PJ",4.3,4362),p("B0CG6V2XGS",4.3,6155),p("B0CP22DQQS",null,null)]],
  [7, "Best Standing Desks for Short People", "best-standing-desks-for-short-people", "standing-desks", "short-people", [
    p("B0GDDH14P5",4.6,19),p("B0F9X3FDYY",4.6,2226),p("B08C2LC3H2",4.6,4345),p("B0BVQMQMY2",4.4,311),
    p("B09DYF1SRQ",4.4,763),p("B0BVR3RKLZ",4.4,1899),p("B0D1C9LBN5",4.0,61),p("B003M96GY0",4.5,7239)]],
  [8, "Best Rolling Filing Cabinets", "best-rolling-filing-cabinets", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B08G53L8B5",4.5,1681),p("B0DBZ98D94",4.2,1425),p("B0GTNJY2HB",4.2,1671),
    p("B0989HLF81",4.2,2444),p("B0BQJ5WL24",4.1,7901),p("B0D9XYD75W",4.0,1303),p("B0GJZPVMG8",4.1,66)]],
  [9, "Best Murphy Beds for Home Offices", "best-murphy-beds-for-home-offices", "compact-home-office", "murphy-beds", [
    p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0GQM56Y2N",4.5,19),p("B0DGL5B76J",4.2,396),
    p("B0DNKM6NRF",4.2,112),p("B0DYN99XTT",4.2,112),p("B0FFSTT5LQ",4.0,141),p("B0DXZVVHCG",4.0,141)]],
  [10, "Best Office Chairs for Big and Tall Users", "best-office-chairs-for-big-and-tall-users", "office-chairs", "big-and-tall", [
    p("B0DXTWTCWS",4.5,34180),p("B0GF9TKQTW",4.6,165),p("B0F62NG547",4.4,546),p("B09B3FJHHT",4.4,10760),
    p("B0CDCQMGSH",4.3,555),p("B07Y8BXBX8",4.4,14478),p("B0CG6V2XGS",4.3,6155),p("B0CQD3K8PJ",4.3,4362)]],
  [11, "Best Standing Desks with Storage", "best-standing-desks-with-storage", "standing-desks", "storage", [
    p("B0C4XW9167",4.4,2032),p("B0CJ8SSP2Q",4.4,1754),p("B0FVDDHRRH",4.5,365),p("B003M96GY0",4.5,7239),
    p("B0F9X3FDYY",4.6,2226),p("B0FK3DD4F1",4.6,222),p("B0BVQMQMY2",4.4,311),p("B0BVR3RKLZ",4.4,1899)]],
  [12, "Best Lateral Filing Cabinets", "best-lateral-filing-cabinets", "compact-home-office", "filing-cabinets", [
    p("B08G53L8B5",4.5,1681),p("B09YVJN8R7",4.5,1373),p("B0989HLF81",4.2,2444),p("B0GTNJY2HB",4.2,1671),
    p("B0DBZ98D94",4.2,1425),p("B0BQJ5WL24",4.1,7901),p("B0D9XYD75W",4.0,1303),p("B0GJZPVMG8",4.1,66)]],
  [13, "Best 4-Leg Standing Desks", "best-4-leg-standing-desks", "standing-desks", "4-leg", [
    p("B0F9X3FDYY",4.6,2226),p("B08C2LC3H2",4.6,4345),p("B0FK3DD4F1",4.6,222),p("B0CQNV8WBS",4.7,547),
    p("B0D21VTP3R",4.7,353),p("B0BVQMQMY2",4.4,311),p("B09DYF1SRQ",4.4,763),p("B003M96GY0",4.5,7239)]],
  [14, "Best Office Chairs with Adjustable Lumbar Support", "best-office-chairs-with-adjustable-lumbar-support", "office-chairs", "lumbar-support", [
    p("B09D33BXHL",4.5,3070),p("B0FQDM23S4",4.3,64003),p("B07T291QPJ",4.3,5382),p("B0CP22DQQS",4.3,1783),
    p("B0GXX75JN5",4.3,3442),p("B0DKNN49QP",4.2,2568),p("B0B41X9SMT",4.3,3572),p("B0FPLP3BND",4.3,1871)]],
  [15, "Best Cabinet Beds with Desks", "best-cabinet-beds-with-desks", "compact-home-office", "murphy-beds", [
    p("B0H33PY32C",4.4,4),p("B0G2M8PP28",4.2,42),p("B0G1C4H842",4.3,340),p("B0DGL5B76J",4.2,396),
    p("B0DJKJQ9SH",4.2,396),p("B0H25F5GNC",5.0,1),p("B0GX63SNCJ",null,null),p("B0FL6TKLRZ",4.2,4)]],
  [16, "Best Locking Filing Cabinets", "best-locking-filing-cabinets", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B0B3MB5F56",4.4,5174),p("B0GTNJY2HB",4.2,1671),p("B0DBZ98D94",4.2,1425),
    p("B0DQL795FX",4.2,616),p("B0D9XYD75W",4.0,1303),p("B0D2QSQZ1X",4.0,382),p("B0DCG99Y8Y",4.7,4)]],
  [17, "Best Standing Desks for Heavy Setups", "best-standing-desks-for-heavy-setups", "standing-desks", "heavy-setups", [
    p("B0FPC7XF5D",4.7,277),p("B0DWMNPW7D",4.6,1747),p("B0B41YH9B6",4.5,11572),p("B08BHPMYGK",4.5,12575),
    p("B0F8MHPVPH",4.5,8463),p("B0BZ7GXM4M",4.4,5316),p("B0DT3Y1X96",4.4,555),p("B0GS9B1X5X",4.6,155)]],
  [18, "Best Office Chairs with Flip-Up Arms", "best-office-chairs-with-flip-up-arms", "office-chairs", "flip-up-arms", [
    p("B09D33BXHL",4.5,3070),p("B0B41X9SMT",4.3,3572),p("B0CP22DQQS",4.3,1783),p("B0FPLP3BND",4.3,1871),
    p("B0DKNN49QP",4.2,2568),p("B0GXX75JN5",4.3,3442),p("B0FQDM23S4",4.3,64003),p("B07T291QPJ",4.3,5382)]],
  [19, "Best Under-Desk Filing Cabinets", "best-under-desk-filing-cabinets", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B0DBZ98D94",4.2,1425),p("B0GTNJY2HB",4.2,1671),p("B0DQL795FX",4.2,616),
    p("B0D2QSQZ1X",4.0,382),p("B0D9XYD75W",4.0,1303),p("B09KT9RG1M",4.3,1947),p("B09ZXSY378",4.1,2403)]],
  [20, "Best Murphy Beds with Storage and Desks", "best-murphy-beds-with-storage-and-desks", "compact-home-office", "murphy-beds", [
    p("B0H33PY32C",4.4,4),p("B0G1C4H842",4.3,340),p("B0DGL5B76J",4.2,396),p("B0DJKJQ9SH",4.2,396),
    p("B0G2M8PP28",4.2,42),p("B0FL6TKLRZ",4.2,4),p("B0GX63SNCJ",null,null),p("B0H25F5GNC",5.0,1)]],
  [21, "Best Reclining Office Chairs with Footrests", "best-reclining-office-chairs-with-footrests", "office-chairs", "reclining", [
    p("B0DXTWTCWS",4.5,34180),p("B0GLX92FFH",4.5,3843),p("B0FVXRZJ12",4.4,16386),p("B0FF3GMW36",4.3,1143),
    p("B0C4Q7M3VC",4.3,3548),p("B0GXX75JN5",4.3,3442),p("B0FQDM23S4",4.3,64003),p("B07T291QPJ",4.3,5382)]],
  [22, "Best Dual-Motor Standing Desks", "best-dual-motor-standing-desks", "standing-desks", "dual-motor", [
    p("B0FPC7XF5D",4.7,277),p("B0DWMNPW7D",4.6,1747),p("B0GS9B1X5X",4.6,155),p("B0B41YH9B6",4.5,11572),
    p("B08BHPMYGK",4.5,12575),p("B0F8MHPVPH",4.5,8463),p("B0BZ7GXM4M",4.4,5316),p("B0DT3Y1X96",4.4,555)]],
  [23, "Best Metal Filing Cabinets", "best-metal-filing-cabinets", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B0B3MB5F56",4.4,5174),p("B0GTNJY2HB",4.2,1671),p("B0DBZ98D94",4.2,1425),
    p("B0DQL795FX",4.2,616),p("B0D2QSQZ1X",4.0,382),p("B0D9XYD75W",4.0,1303),p("B0DCG99Y8Y",4.7,4)]],
  [24, "Best Room Dividers for Home Offices", "best-room-dividers-for-home-offices", "compact-home-office", "room-dividers", [
    p("B0DFH8C526",4.6,1499),p("B0BMTBSB7R",4.3,1593),p("B0FMDTGYK2",4.2,555),p("B0BQMR29TC",4.1,1717),
    p("B0DST8SCHS",3.9,170),p("B0FSCXHN6M",null,null),p("B0H5HRGGHF",null,null),p("B0H5LJ8H3V",null,null)]],
];

const manifest = guides.map(([n, title, slug, categorySlug, subcategorySlug, items]) => {
  const products = items.map(({asin, rating, count}) => {
    const data = all[asin];
    if (!data || data.status === 'FAIL' || data.status === 'ERROR') {
      return { asin, status: 'MISSING', rating, count };
    }
    return { asin, status: data.status, title: data.title, price: data.price, img: data.img, rating, count };
  });
  const missing = products.filter(p => p.status === 'MISSING');
  return { n, title, slug, categorySlug, subcategorySlug, products, missingCount: missing.length };
});

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4_guide_manifest.json', JSON.stringify(manifest, null, 2));

console.log('Total guides:', manifest.length);
const withMissing = manifest.filter(g => g.missingCount > 0);
console.log('Guides with missing ASINs:', withMissing.length);
withMissing.forEach(g => console.log(' -', g.n, g.title, g.products.filter(p=>p.status==='MISSING').map(p=>p.asin)));
