import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_PATH =
  "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\data\\guides";

const guideImageMaps = {
  "best-corner-standing-desk": {
    B0FKSN1WR2: "https://m.media-amazon.com/images/I/71vlFqe7+iL._AC_SL1500_.jpg",
    B09B2VDSYJ: "https://m.media-amazon.com/images/I/719-sAd25AL._AC_SL1500_.jpg",
    B0GC2M4T5P: "https://m.media-amazon.com/images/I/61ve8iAp3kL._AC_SL1500_.jpg",
    B0DV52BPCM: "https://m.media-amazon.com/images/I/81hRNILWT4L._AC_SL1500_.jpg",
    B0F2M4G51K: "https://m.media-amazon.com/images/I/71tE4RDzEzL._AC_SL1500_.jpg",
    B0FPFSYXNF: "https://m.media-amazon.com/images/I/81-6StF8zYL._AC_SL1500_.jpg",
    B0CNCQSLQF: "https://m.media-amazon.com/images/I/81JQN0EnNgL._AC_SL1500_.jpg",
    B09B6X4TS6: "https://m.media-amazon.com/images/I/81UoYyaTcNL._AC_SL1500_.jpg",
  },
  "best-standing-desks-for-gaming": {
    B0GF96VQ6T: "https://m.media-amazon.com/images/I/71KE+qv-ITL._AC_SL1500_.jpg",
    B09Z1Z5PMN: "https://m.media-amazon.com/images/I/71Z7TB5SdML._AC_SL1500_.jpg",
    B0BM5WDR18: "https://m.media-amazon.com/images/I/71RR6uUBj3L._AC_SL1500_.jpg",
    B09VT3X2LZ: "https://m.media-amazon.com/images/I/71g86-3zUaL._AC_SL1500_.jpg",
    B0CPFJZ5JP: "https://m.media-amazon.com/images/I/71LZAFuVemL._AC_SL1500_.jpg",
    B0CR1CM8JK: "https://m.media-amazon.com/images/I/71obfmT3WsL._AC_SL1500_.jpg",
    B0DWMNPW7D: "https://m.media-amazon.com/images/I/61tvhGirBlL._AC_SL1500_.jpg",
    B0G1SBV948: "https://m.media-amazon.com/images/I/51vwGD6jXYL._AC_SL1000_.jpg",
  },
  "best-standing-desk-for-dual-monitors": {
    B0G7WXDDQK: "https://m.media-amazon.com/images/I/71ZMU5EPuZL._AC_SL1500_.jpg",
    B07Q3TGL7M: "https://m.media-amazon.com/images/I/819pj+V8QcL._AC_SL1500_.jpg",
    B0DJ2XKJJT: "https://m.media-amazon.com/images/I/71KwCPJpoAL._AC_SL1500_.jpg",
    B0CH1V1MVG: "https://m.media-amazon.com/images/I/61u2kVQis8L._AC_SL1500_.jpg",
    B0GD75Y6SC: "https://m.media-amazon.com/images/I/71jwqC-hN5L._AC_SL1500_.jpg",
    B09DYF1SRQ: "https://m.media-amazon.com/images/I/71G57ucOZtL._AC_SL1500_.jpg",
    B0C28WNMP1: "https://m.media-amazon.com/images/I/71DIMqM35kL._AC_SL1500_.jpg",
    B0BYTLT7TZ: "https://m.media-amazon.com/images/I/718Z9N7RgML._AC_SL1500_.jpg",
  },
  "best-glass-standing-desk": {
    B08S3TWCJ6: "https://m.media-amazon.com/images/I/812smItbPZL._AC_SL1500_.jpg",
    B0F3DPKBL6: "https://m.media-amazon.com/images/I/819pd1cHZYL._AC_SL1500_.jpg",
    B0BZNSMSC5: "https://m.media-amazon.com/images/I/71-Epo9scCL._AC_SL1500_.jpg",
    B0C9V4XP9M: "https://m.media-amazon.com/images/I/81B4GYFh32L._AC_SL1500_.jpg",
    B0GLG5D7J6: "https://m.media-amazon.com/images/I/81HQETihPdL._AC_SL1500_.jpg",
    B0CN9GR9N2: "https://m.media-amazon.com/images/I/718zJLhcx-L._AC_SL1500_.jpg",
    B0CS36RZJG: "https://m.media-amazon.com/images/I/716h1aN5kwL._AC_SL1500_.jpg",
    B0G48RMMJY: "https://m.media-amazon.com/images/I/81nZMzXZyoL._AC_SL1500_.jpg",
  },
  "best-standing-desk-under-1000": {
    B0851BVHCD: "https://m.media-amazon.com/images/I/61UXVXyGRyL._AC_SL1500_.jpg",
    B07H2WGFQN: "https://m.media-amazon.com/images/I/717OHX3si4L._AC_SL1500_.jpg",
    B09DYF1SRQ: "https://m.media-amazon.com/images/I/71G57ucOZtL._AC_SL1500_.jpg",
    B0CJDXPNX9: "https://m.media-amazon.com/images/I/91PiLeS6SaL._AC_SL1500_.jpg",
    B0CQBZC41V: "https://m.media-amazon.com/images/I/61+jf60rVXL._AC_SL1500_.jpg",
    B0CSRDN4RC: "https://m.media-amazon.com/images/I/61zreN8xAYL._AC_SL1500_.jpg",
    B09BFZJMC6: "https://m.media-amazon.com/images/I/61Cy+-1ecnL._AC_SL1500_.jpg",
    B0C28WNMP1: "https://m.media-amazon.com/images/I/71DIMqM35kL._AC_SL1500_.jpg",
  },
  "best-standing-desk-48-inch": {
    B0B41YH9B6: "https://m.media-amazon.com/images/I/718KkXOCktL._AC_SL1500_.jpg",
    B08BJ2QRM9: "https://m.media-amazon.com/images/I/61qYqlizh2L._AC_SL1500_.jpg",
    B0DJ2XKJJT: "https://m.media-amazon.com/images/I/71KwCPJpoAL._AC_SL1500_.jpg",
    B08BHN4ZSN: "https://m.media-amazon.com/images/I/71GjWLqbuUL._AC_SL1500_.jpg",
    B08RJ5FXR5: "https://m.media-amazon.com/images/I/71MTvT27CuL._AC_SL1500_.jpg",
    B096L6XC4R: "https://m.media-amazon.com/images/I/617iLezWHYL._AC_SL1500_.jpg",
    B0F8MHPVPH: "https://m.media-amazon.com/images/I/71smFjr2QgL._AC_SL1500_.jpg",
    B0CQC3RVMV: "https://m.media-amazon.com/images/I/71CfxsqVXmL._AC_SL1500_.jpg",
  },
  "best-walnut-standing-desk": {
    B08JSGYC57: "https://m.media-amazon.com/images/I/71qs4fUcPkL._AC_SL1500_.jpg",
    B0DX6SRFD3: "https://m.media-amazon.com/images/I/71O7Sg4Wk3L._AC_SL1500_.jpg",
    B0D1VCYJND: "https://m.media-amazon.com/images/I/711+nkgeB4L._AC_SL1500_.jpg",
    B0DC8S2887: "https://m.media-amazon.com/images/I/61jPVMdm04L._AC_SL1500_.jpg",
    B0B8DWTG25: "https://m.media-amazon.com/images/I/71LIwlh6yLL._AC_SL1500_.jpg",
    B0GMV1J8B5: "https://m.media-amazon.com/images/I/71O0hjKp1YL._AC_SL1500_.jpg",
    B0CKP284VZ: "https://m.media-amazon.com/images/I/71G9tKi9MKL._AC_SL1500_.jpg",
    B0DCN78QMV: "https://m.media-amazon.com/images/I/71eZHASeBjL._AC_SL1500_.jpg",
  },
  "best-standing-desk-for-tall-person": {
    B0FJBHZTMV: "https://m.media-amazon.com/images/I/71u7smW5rEL._AC_SL1500_.jpg",
    B0C28WNMP1: "https://m.media-amazon.com/images/I/71DIMqM35kL._AC_SL1500_.jpg",
    B0BN2H1V67: "https://m.media-amazon.com/images/I/51uPqvm7ouL._AC_SL1500_.jpg",
    B0CWH5GJ8X: "https://m.media-amazon.com/images/I/91fczW1BjaL._AC_SL1500_.jpg",
    B09DYF1SRQ: "https://m.media-amazon.com/images/I/81pTkZzga6L._AC_SL1500_.jpg",
    B0FC6G6JLC: "https://m.media-amazon.com/images/I/81lSAQrno1L._AC_SL1500_.jpg",
    B0CQNV8WBS: "https://m.media-amazon.com/images/I/71JlS6PhO8L._AC_SL1500_.jpg",
    B07V6ZSHF4: "https://m.media-amazon.com/images/I/61TTe3L6wWL._AC_SL1500_.jpg",
  },
  "best-office-chair-for-tall-person": {
    B0DXTWTCWS: "https://m.media-amazon.com/images/I/71TLcAA1fTL._AC_SL1500_.jpg",
    B07BDFW1Y7: "https://m.media-amazon.com/images/I/71YPWS91dmL._AC_SL1500_.jpg",
    B0G5WQ65P2: "https://m.media-amazon.com/images/I/71TkxS-LUHL._AC_SL1500_.jpg",
    B0CP22DQQS: "https://m.media-amazon.com/images/I/712kZm3lUrL._AC_SL1500_.jpg",
    B0C3T865C2: "https://m.media-amazon.com/images/I/71M28wdmSpL._AC_SL1500_.jpg",
    B016OIF2JU: "https://m.media-amazon.com/images/I/41vJblEokkL._AC_.jpg",
    B006H1QYBA: "https://m.media-amazon.com/images/I/81sWuwGx1ML._AC_SL1500_.jpg",
    B08LMM1148: "https://m.media-amazon.com/images/I/71izlgQABoL._AC_SL1500_.jpg",
  },
  "best-office-chair-for-short-people": {
    B0FQDM23S4: "https://m.media-amazon.com/images/I/71cMYhSQ8+L._AC_SL1500_.jpg",
    B0FXGB6L96: "https://m.media-amazon.com/images/I/71YwSR6jIoL._AC_SL1250_.jpg",
    B0G4C4GPKB: "https://m.media-amazon.com/images/I/81LG+VImyTL._AC_SL1500_.jpg",
    B0D3KYSY3F: "https://m.media-amazon.com/images/I/81R1fahxU2L._AC_SL1500_.jpg",
    B0F5GRYWTJ: "https://m.media-amazon.com/images/I/71oIVTS7MrL._AC_SL1500_.jpg",
    B0FR8W9CS1: "https://m.media-amazon.com/images/I/717Tlu+mQKL._AC_SL1500_.jpg",
    B0G5WQ65P2: "https://m.media-amazon.com/images/I/71TkxS-LUHL._AC_SL1500_.jpg",
    B0F9W7C2H5: "https://m.media-amazon.com/images/I/71rKDjDjbBL._AC_SL1500_.jpg",
  },
  "best-leather-office-chair": {
    B01MRZ02TL: "https://m.media-amazon.com/images/I/712KPnl9KPL._AC_SL1500_.jpg",
    B00IFHPVEU: "https://m.media-amazon.com/images/I/919nt1eVEeL._AC_SL1500_.jpg",
    B01LXXM5EK: "https://m.media-amazon.com/images/I/71Qi5vBgHgL._AC_SL1500_.jpg",
    B0CZP9QB9Z: "https://m.media-amazon.com/images/I/71UQ3ltXXpL._AC_SL1500_.jpg",
    B0BD7Z94ZQ: "https://m.media-amazon.com/images/I/7111zdN5PjL._AC_SL1500_.jpg",
    B07T291QPJ: "https://m.media-amazon.com/images/I/81pdW0BIbYL._AC_SL1500_.jpg",
    B0116W5B5O: "https://m.media-amazon.com/images/I/913Ez0aB4UL._AC_SL1500_.jpg",
    B01JCHG7P8: "https://m.media-amazon.com/images/I/61+b-9f+2FS._AC_SL1500_.jpg",
  },
  "best-office-chair-for-back-pain": {
    B0BGZB6VZM: "https://m.media-amazon.com/images/I/718ihNc4u-L._AC_SL1500_.jpg",
    B0GVGZW415: "https://m.media-amazon.com/images/I/81hBoyFz5pL._AC_SL1500_.jpg",
    B006H1QYBA: "https://m.media-amazon.com/images/I/61Aeun7rdDL._AC_SL1000_.jpg",
    B078HG8HWF: "https://m.media-amazon.com/images/I/71elzuc7cBL._AC_SL1500_.jpg",
    B016OIF2JU: "https://m.media-amazon.com/images/I/71TDHouvP9L._AC_SL1500_.jpg",
    B0C3T865C2: "https://m.media-amazon.com/images/I/71M28wdmSpL._AC_SL1500_.jpg",
    B0BG1H99FB: "https://m.media-amazon.com/images/I/81atIP72gxL._AC_SL1500_.jpg",
    B0147WIC7E: "https://m.media-amazon.com/images/I/71uQhhZAx+L._AC_SL1500_.jpg",
  },
  "best-executive-office-chair": {
    B0CZP9QB9Z: "https://m.media-amazon.com/images/I/71UQ3ltXXpL._AC_SL1500_.jpg",
    B07T291QPJ: "https://m.media-amazon.com/images/I/81pdW0BIbYL._AC_SL1500_.jpg",
    B0DK39KTNV: "https://m.media-amazon.com/images/I/71uI-xD6WjL._AC_SL1500_.jpg",
    B01JCHG7P8: "https://m.media-amazon.com/images/I/61+b-9f+2FS._AC_SL1500_.jpg",
    B0116W5B5O: "https://m.media-amazon.com/images/I/913Ez0aB4UL._AC_SL1500_.jpg",
    B00AVUQQES: "https://m.media-amazon.com/images/I/719PaGg1GvL._AC_SL1500_.jpg",
    B07645VL18: "https://m.media-amazon.com/images/I/81VR2c-We9L._AC_SL1500_.jpg",
    B06Y3PGPR2: "https://m.media-amazon.com/images/I/71AmEZ0N2AL._AC_SL1500_.jpg",
  },
  "best-mesh-office-chair": {
    B0FQDM23S4: "https://m.media-amazon.com/images/I/81sLDLdB8CL._AC_SL1500_.jpg",
    B0FXGB6L96: "https://m.media-amazon.com/images/I/71YwSR6jIoL._AC_SL1250_.jpg",
    B07GNDDNMW: "https://m.media-amazon.com/images/I/71-w+1c6JPL._AC_SL1500_.jpg",
    B07BDFW1Y7: "https://m.media-amazon.com/images/I/71YPWS91dmL._AC_SL1500_.jpg",
    B07Y8BXBX8: "https://m.media-amazon.com/images/I/91bA1LZMqFL._AC_SL1500_.jpg",
    B0C3T865C2: "https://m.media-amazon.com/images/I/71M28wdmSpL._AC_SL1500_.jpg",
    B06Y3PGPR2: "https://m.media-amazon.com/images/I/71AmEZ0N2AL._AC_SL1500_.jpg",
    B078HG8HWF: "https://m.media-amazon.com/images/I/71elzuc7cBL._AC_SL1500_.jpg",
  },
  "best-office-chair-under-300": {
    B0FQDM23S4: "https://m.media-amazon.com/images/I/81sLDLdB8CL._AC_SL1500_.jpg",
    B0BGWZKVPX: "https://m.media-amazon.com/images/I/81lCJOQwKVL._AC_SL1500_.jpg",
    B085XQRBC5: "https://m.media-amazon.com/images/I/71h3GAsF7ML._AC_SL1500_.jpg",
    B07GNDDNMW: "https://m.media-amazon.com/images/I/71-w+1c6JPL._AC_SL1500_.jpg",
    B08XXNQT2Y: "https://m.media-amazon.com/images/I/71nLBIhG+0L._AC_SL1500_.jpg",
    B0DKP341VM: "https://m.media-amazon.com/images/I/81rJG1VNeLL._AC_SL1500_.jpg",
    B0797HZ8W1: "https://m.media-amazon.com/images/I/71crI8HDP9L._AC_SL1500_.jpg",
    B07Y8BXBX8: "https://m.media-amazon.com/images/I/91bA1LZMqFL._AC_SL1500_.jpg",
  },
  "best-office-chair-under-500": {
    B0FDVXF8PW: "https://m.media-amazon.com/images/I/81X9duDwN9L._AC_SL1500_.jpg",
    B0H6LQ91V7: "https://m.media-amazon.com/images/I/61dJiaUkEUL._AC_SL1254_.jpg",
    B078HFDMKD: "https://m.media-amazon.com/images/I/71Ldl5FVFuL._AC_SL1500_.jpg",
    B074SRKX9H: "https://m.media-amazon.com/images/I/71xzimoBkjL._AC_SL1500_.jpg",
    B0FMGZFVK9: "https://m.media-amazon.com/images/I/71sxDY0MXML._AC_SL1500_.jpg",
    B0H3QN6C1T: "https://m.media-amazon.com/images/I/710vHTC3o+L._AC_SL1500_.jpg",
    B0FXQH5SP3: "https://m.media-amazon.com/images/I/81KYzn8UBXL._AC_SL1500_.jpg",
    // B00T07KHGQ skipped - no Amazon CDN URL available
  },
  "best-bamboo-standing-desk": {
    B09DYF5MPY: "https://m.media-amazon.com/images/I/81BFaPd9-gL._AC_SL1500_.jpg",
    B0FMFL2G14: "https://m.media-amazon.com/images/I/91datiyLh8L._AC_SL1500_.jpg",
    B0CWG5NC5D: "https://m.media-amazon.com/images/I/91dPO-NMlPL._AC_SL1500_.jpg",
    B0CWGJCDXX: "https://m.media-amazon.com/images/I/91jC02GjAIL._AC_SL1500_.jpg",
    B0GR2Y3WL5: "https://m.media-amazon.com/images/I/81ebKY7wAgL._AC_SL1500_.jpg",
    B0GR2R91W3: "https://m.media-amazon.com/images/I/81BHl+NNIDL._AC_SL1500_.jpg",
    B0F6LP1M8Q: "https://m.media-amazon.com/images/I/81-o2rrlXQL._AC_SL1500_.jpg",
    B0FJXVP1BG: "https://m.media-amazon.com/images/I/81uNImVKk2L._AC_SL1500_.jpg",
  },
};

let totalUpdated = 0;

for (const [slug, asinMap] of Object.entries(guideImageMaps)) {
  const filePath = resolve(BASE_PATH, `${slug}.ts`);
  let content;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    console.log(`SKIP (not found): ${slug}.ts`);
    continue;
  }

  let updatedCount = 0;
  for (const [asin, imageUrl] of Object.entries(asinMap)) {
    // Match imageUrl line (template literal or string) immediately before amazonUrl containing this ASIN
    const regex = new RegExp(
      `(imageUrl:\\s*(?:\`[^\`]*\`|"[^"]*"),)(\\s*\\n\\s*amazonUrl:\\s*"[^"]*${asin})`,
      "g"
    );
    const before = content;
    content = content.replace(regex, (_match, _imgPart, amazonPart) => {
      return `imageUrl: "${imageUrl}",${amazonPart}`;
    });
    if (content !== before) updatedCount++;
  }

  writeFileSync(filePath, content, "utf8");
  console.log(`✓ ${slug}: ${updatedCount}/${Object.keys(asinMap).length} updated`);
  totalUpdated += updatedCount;
}

console.log(`\nDone. Total products updated: ${totalUpdated}`);
