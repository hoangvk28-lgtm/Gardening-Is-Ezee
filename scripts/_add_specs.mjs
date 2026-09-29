import fs from "fs";
let c = fs.readFileSync("scripts/gen-mini-ups-data.mjs", "utf8");

const specs = {
  B0C1YRSBMN: ["10,000mAh / 37Wh built-in", "4 rails: 5V USB, 5V/9V/12V DC", "60W max combined output"],
  B07WLD32RP: ["27,000mAh / 97.2Wh (12-cell)", "4x DC 12V, 1x DC 9V, 2x USB", "37W continuous ceiling"],
  B0CQR5GMN4: ["20,000mAh with AVR regulation", "5V/9V/12V DC + USB + Type-C", "LED battery indicator"],
  B0GWC8GVGZ: ["16,000mAh LiFePO4 battery", "Passive PoE 15V/24V + DC rails", "36W max, 12-month warranty"],
  B0FF9QS7LK: ["20,000mAh / 74Wh built-in", "Dual 12V DC rails + 9V + 5V USB", "60W max combined output"],
  B0GJBWXM66: ["48Wh (9.6V/5000mAh) battery", "Passive PoE 24V & 48V (1000Mbps)", "30W max, ships with 8 DC tips"],
  B0CP693BWD: ["8,000mAh / 29.6Wh battery", "PoE 24V + DC 12V/9V + USB 5V", "Claimed 0-second switchover"],
  B0G2QWNVCK: ["13,500mAh battery", "12V / 9V / 5V DC output ports", "LED power indicator"],
  B0FCV2Q8TB: ["10,400mAh / 38Wh battery", "PoE 15V/24V + DC 9V/12V + USB", "LCD real-time status screen"],
  B0FXFTFBBF: ["6,000mAh, ~5 hr claimed runtime", "5V USB, 5V/9V DC, dual 12V DC", "4.72 x 3.54 x 0.98in compact"],
  B0F2K1PL64: ["20,000mAh battery", "6 protection circuits", ">95% router/modem compatibility claim"],
  B0CGHGVG3L: ["10,400mAh, dual charging input", "USB 5V/2A, DC 9V/2A, DC 12V/2A", "9V/12V DC or 5V USB input"],
  B0CGVZBCKH: ["10,400mAh / 18Wh battery", "Dual input: 9V/12V DC or 5V USB", "USB 5V/2A, DC 9V/2A, DC 12V/2A"],
  B0CLVSQY5S: ["10,400mAh / 18Wh battery", "Dual DC input: 9V and 12V", "Automatic switchover on outage"],
};

for (const [asin, arr] of Object.entries(specs)) {
  const marker = `  ${asin}: {`;
  const idx = c.indexOf(marker);
  if (idx === -1) { console.log("MISSING", asin); continue; }
  const endMarker = "\n  },";
  const endIdx = c.indexOf(endMarker, idx);
  const insertion = `,\n    specs: ${JSON.stringify(arr)}`;
  c = c.slice(0, endIdx) + insertion + c.slice(endIdx);
}
fs.writeFileSync("scripts/gen-mini-ups-data.mjs", c);
console.log("done");
