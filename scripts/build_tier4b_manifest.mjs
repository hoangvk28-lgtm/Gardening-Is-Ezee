import fs from 'fs';

const b6 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/batch6_verify_results.json', 'utf8'));
const t4 = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4_verify_results.json', 'utf8'));
const t4b = JSON.parse(fs.readFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4b_verify_results.json', 'utf8'));
const all = { ...b6, ...t4, ...t4b };

const SUB = {
  'B0BY17NR4Q': 'B0DBQFGY9S',
  'B0DFH84G4N': 'B0FQNP28CD',
  'B0DK1BMNBD': 'B0CZNRLW9S',
  'B095HN9SFR': 'B0CZNVB9M5',
};
const DROP = new Set(['B0EXPERLAM']); // user explicitly marked N/A

function p(asin, rating, count) { return { asin, rating: rating || null, count: count || null }; }

const guides = [
  [25, "Best Cube Storage Room Dividers", "best-cube-storage-room-dividers", "compact-home-office", "room-dividers", [
    p("B085Z7WVXR",4.5,8231),p("B0DFXS9X72",4.7,264),p("B0BXXK6JF5",4.2,3329),p("B0H4LVYPC2",4.0,235),
    p("B0GWYP696K",4.2,37),p("B0EXPERLAM",null,null),p("B0DFH8C526",4.6,1499)]],
  [26, "Best Office Chairs with Headrests", "best-office-chairs-with-headrests", "office-chairs", "headrests", [
    p("B0DXTWTCWS",4.5,34180),p("B09D33BXHL",4.5,3070),p("B0GLX92FFH",4.5,3843),p("B0FVXRZJ12",4.4,16386),
    p("B0CP22DQQS",4.3,1783),p("B0FQDM23S4",4.3,64003),p("B07T291QPJ",4.3,5382),p("B0GXX75JN5",4.3,3442)]],
  [27, "Best Office Chairs for Heavy People", "best-office-chairs-for-heavy-people", "office-chairs", "heavy-people", [
    // reuse big-and-tall pool from prior batch
    p("B0DXTWTCWS",4.5,34180),p("B0GF9TKQTW",4.6,165),p("B0F62NG547",4.4,546),p("B09B3FJHHT",4.4,10760),
    p("B0CDCQMGSH",4.3,555),p("B07Y8BXBX8",4.4,14478),p("B0CG6V2XGS",4.3,6155),p("B0CQD3K8PJ",4.3,4362)]],
  [28, "Best Premium Ergonomic Office Chairs", "best-premium-ergonomic-office-chairs", "office-chairs", "premium", [
    p("B0FQDM23S4",4.3,64003),p("B0FXGB6L96",4.3,3442),p("B07T291QPJ",4.3,5382),p("B0CP22DQQS",4.3,1783),
    p("B0DKNN49QP",4.2,2568),p("B09D33BXHL",4.5,3070),p("B0B41X9SMT",4.3,3572),p("B0GXX75JN5",4.3,3442)]],
  [29, "Best Standing Desk Frames", "best-standing-desk-frames", "standing-desks", "frames", [
    p("B0F9X3FDYY",4.6,2226),p("B0DWMNPW7D",4.6,1747),p("B0B41YH9B6",4.5,11572),p("B0F8MHPVPH",4.5,8463),
    p("B0BZ7GXM4M",4.4,5316),p("B0GS9B1X5X",4.6,155),p("B0DT3Y1X96",4.4,555),p("B0CNH9SQT7",4.5,598)]],
  [30, "Best Standing Desks for Two People", "best-standing-desks-for-two-people", "standing-desks", "two-people", [
    p("B0DLL4H69Z",4.6,263),p("B0F9X3FDYY",4.6,2226),p("B0DWMNPW7D",4.6,1747),p("B0B41YH9B6",4.5,11572),
    p("B0F8MHPVPH",4.5,8463),p("B0CNH9SQT7",4.5,598),p("B0BZ7GXM4M",4.4,5316),p("B0DT3Y1X96",4.4,555)]],
  [31, "Best Standing Desks with Keyboard Trays", "best-standing-desks-with-keyboard-trays", "standing-desks", "keyboard-trays", [
    p("B0DFW9D66S",4.7,503),p("B0784HWPN6",4.6,10101),p("B075JYG2TB",4.6,15560),p("B0CNH9SQT7",4.5,598),
    p("B0BY17NR4Q",4.5,280),p("B0CR1CM8JK",4.6,737),p("B0F2H4X11C",4.5,54),p("B0DCFZV2GP",4.4,1078)]],
  [32, "Best Standing Desks with Built-In Power Outlets", "best-standing-desks-with-built-in-power-outlets", "standing-desks", "power-outlets", [
    p("B0CR1CM8JK",4.6,737),p("B0DFW9D66S",4.7,503),p("B0GS9B1X5X",4.6,155),p("B0DBQ4JX85",4.5,500),
    p("B0B41YH9B6",4.5,11572),p("B0F8MHPVPH",4.5,8463),p("B0DWMNPW7D",4.6,1747),p("B0DT3Y1X96",4.4,555)]],
  [33, "Best Standing Desks Under $1,000", "best-standing-desks-under-1000", "standing-desks", "under-1000", [
    p("B0784HWPN6",4.6,10101),p("B075JYG2TB",4.6,15560),p("B0F9X3FDYY",4.6,2226),p("B0DWMNPW7D",4.6,1747),
    p("B0B41YH9B6",4.5,11572),p("B0F8MHPVPH",4.5,8463),p("B0CNH9SQT7",4.5,598),p("B0BZ7GXM4M",4.4,5316)]],
  [34, "Best Queen Murphy Beds with Desks", "best-queen-murphy-beds-with-desks", "compact-home-office", "murphy-beds", [
    p("B0H33PY32C",4.4,4),p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0GQM56Y2N",4.5,19),
    p("B0CLDV21TZ",4.0,181),p("B0DXZVVHCG",4.0,141),p("B0DN5P11PP",4.3,340),p("B0DGL5B76J",4.2,396)]],
  [35, "Best Full-Size Murphy Beds with Desks", "best-full-size-murphy-beds-with-desks", "compact-home-office", "murphy-beds", [
    p("B0FLJ8MKRW",4.5,2),p("B0BQCRMYYK",4.0,29),p("B0GQ95QCV6",1.0,1),p("B0FL6TKLRZ",4.2,4),
    p("B0FK9SYSVB",3.0,2),p("B0GH134WWH",3.0,9),p("B017701FUE",4.6,1610),p("B00CYPV29W",4.6,2138)]],
  [36, "Best Horizontal Murphy Beds with Desks", "best-horizontal-murphy-beds-with-desks", "compact-home-office", "murphy-beds", [
    p("B00CYQ5PPI",4.6,2138),p("B0DK3KNV8X",4.7,7),p("B0FK9WL95D",3.7,11),p("B0FFSTT5LQ",4.0,141),
    p("B0DXZVVHCG",4.0,141),p("B0GQM56Y2N",4.5,19),p("B0DGL5B76J",4.2,396),p("B017701FUE",4.6,1610)]],
  [37, "Best Freestanding Murphy Beds", "best-freestanding-murphy-beds", "compact-home-office", "murphy-beds", [
    p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0H6JFQKW7",null,null),p("B0H6J86PS3",null,null),
    p("B0H94FKL7V",null,null),p("B0H94DMCSW",null,null),p("B0GS52M63V",4.0,120),p("B0GQM56Y2N",4.5,19)]],
  [38, "Best Murphy Bed Cabinets for Studio Apartments", "best-murphy-bed-cabinets-for-studio-apartments", "compact-home-office", "murphy-beds", [
    p("B00CYPV29W",4.6,2138),p("B017701FUE",4.6,1610),p("B0GQM56Y2N",4.5,19),p("B0DN5P11PP",4.3,340),
    p("B0DGL5B76J",4.2,396),p("B0GS52M63V",4.0,120),p("B0FFSTT5LQ",4.0,141),p("B0DXZVVHCG",4.0,141)]],
  [39, "Best Filing Cabinets for Legal-Size Documents", "best-filing-cabinets-for-legal-size-documents", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B08G53L8B5",4.5,1681),p("B0GTNJY2HB",4.2,1671),p("B0DBZ98D94",4.2,1425),
    p("B0DQL795FX",4.2,616),p("B0D9XYD75W",4.0,1303),p("B0GS9B1X5X",4.6,155),p("B0B3MB5F56",4.4,5174)]],
  [40, "Best Filing Cabinets with Bookshelves", "best-filing-cabinets-with-bookshelves", "compact-home-office", "filing-cabinets", [
    p("B0GYQLX52Z",4.3,18),p("B0GTN96T9J",4.2,1671),p("B0989HLF81",4.2,2444),p("B0DTH9XM7F",4.0,176),
    p("B09YVJN8R7",4.5,1373),p("B0GTNJY2HB",4.2,1671),p("B0832D9S62",4.4,2071),p("B0CP4YY751",4.4,214)]],
  [41, "Best Filing Cabinets with Printer Stands", "best-filing-cabinets-with-printer-stands", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B0832D9S62",4.4,2071),p("B0CP4YY751",4.4,214),p("B09KT9RG1M",4.3,1947),
    p("B0GTN96T9J",4.2,1671),p("B0989HLF81",4.2,2444),p("B0DBZ98D94",4.2,1425),p("B0FKMZ1M3W",4.1,499)]],
  [42, "Best Fireproof Filing Cabinets for Home Offices", "best-fireproof-filing-cabinets-for-home-offices", "compact-home-office", "filing-cabinets", [
    p("B09YVJN8R7",4.5,1373),p("B0CR18R9YM",4.5,1373),p("B0B3MB5F56",4.4,5174),p("B0GTNJY2HB",4.2,1671),
    p("B0DBZ98D94",4.2,1425),p("B0DQL795FX",4.2,616),p("B0D9XYD75W",4.0,1303),p("B0D2QSQZ1X",4.0,382)]],
  [43, "Best Narrow Room Dividers for Small Spaces", "best-narrow-room-dividers-for-small-spaces", "compact-home-office", "room-dividers", [
    p("B0DFH8C526",4.6,1499),p("B0DFH84G4N",4.6,1499),p("B0DZGN4B8V",4.6,1030),p("B0DFH4ZR71",4.5,987),
    p("B0FH3TC367",4.5,271),p("B0BMTBSB7R",4.3,1593),p("B0FMDTGYK2",4.2,555),p("B0DST8SCHS",3.9,170)]],
  [44, "Best Room Dividers on Wheels", "best-room-dividers-on-wheels", "compact-home-office", "room-dividers", [
    p("B0FMDTGYK2",4.2,555),p("B0DKSRFWF7",4.2,102),p("B0H3L3224G",4.3,11),p("B0DK1BMNBD",3.8,116),
    p("B0DK196S27",3.7,265),p("B0DST8SCHS",3.9,170),p("B0BMTBSB7R",4.3,1593),p("B0DST8C4GG",3.9,170)]],
  [45, "Best Double-Sided Bookshelves", "best-double-sided-bookshelves", "compact-home-office", "bookshelves", [
    p("B0B3J58T4N",4.6,420),p("B095HN9SFR",4.4,376),p("B0FBZ6HFBX",5.0,3),p("B0F8Q51T9M",4.2,26),
    p("B0GTNJY2HB",4.2,1671),p("B0989HLF81",4.2,2444),p("B0832D9S62",4.4,2071),p("B0DFH8C526",4.6,1499)]],
  [46, "Best No-Drill Room Dividers for Renters", "best-no-drill-room-dividers-for-renters", "compact-home-office", "room-dividers", [
    p("B0DFH8C526",4.6,1499),p("B0DFH84G4N",4.6,1499),p("B0DZGN4B8V",4.6,1030),p("B0DFH4ZR71",4.5,987),
    p("B0DFH7RGSC",4.5,993),p("B0FH3TC367",4.5,271),p("B0BMTBSB7R",4.3,1593),p("B0FMDTGYK2",4.2,555)]],
  [47, "Best Tall Room Dividers for High Ceilings", "best-tall-room-dividers-for-high-ceilings", "compact-home-office", "room-dividers", [
    p("B0DFH8C526",4.6,1499),p("B0DFH84G4N",4.6,1499),p("B0DZGN4B8V",4.6,1030),p("B0B3J58T4N",4.6,420),
    p("B0DFH4ZR71",4.5,987),p("B0FH3TC367",4.5,271),p("B0BMTBSB7R",4.3,1593),p("B0FMDTGYK2",4.2,555)]],
];

const manifest = guides.map(([n, title, slug, categorySlug, subcategorySlug, items]) => {
  const filtered = items.filter(({asin}) => !DROP.has(asin));
  const products = filtered.map(({asin, rating, count}) => {
    const realAsin = SUB[asin] || asin;
    const data = all[realAsin];
    if (!data || data.status === 'FAIL' || data.status === 'ERROR') {
      return { asin: realAsin, status: 'MISSING', rating, count };
    }
    return { asin: realAsin, status: data.status, title: data.title, price: data.price, img: data.img, rating, count };
  });
  const missing = products.filter(p => p.status === 'MISSING');
  return { n, title, slug, categorySlug, subcategorySlug, products, missingCount: missing.length };
});

fs.writeFileSync('c:/Users/ADMIN/Downloads/Roo-Code-main/smartspace-picks/scripts/tier4b_guide_manifest.json', JSON.stringify(manifest, null, 2));

console.log('Total guides:', manifest.length);
const withMissing = manifest.filter(g => g.missingCount > 0);
console.log('Guides with missing ASINs:', withMissing.length);
withMissing.forEach(g => console.log(' -', g.n, g.title, g.products.filter(p=>p.status==='MISSING').map(p=>p.asin)));
manifest.forEach(g => console.log(g.n, g.title, '-> products:', g.products.length));
