import { readFileSync, writeFileSync } from "fs";

const lookup = JSON.parse(readFileSync("scripts/lookup-1-80.json", "utf8"));
const ratingsRaw = readFileSync(
  "C:\\Users\\ADMIN\\AppData\\Local\\Temp\\claude\\c--Users-ADMIN-Downloads-Roo-Code-main\\7a958fa6-60ae-4d86-b724-c8aa863de12b\\scratchpad\\raw_asins_1_80.txt",
  "utf8"
);
const ratingMap = {};
for (const line of ratingsRaw.split("\n")) {
  const m = line.match(/^(B[A-Z0-9]{9})\s*–\s*([\d.]+|NA)\s*–\s*([\d,]+|nonamazon)/);
  if (m) ratingMap[m[1]] = { rating: m[2], count: m[3] };
}
const merged = lookup.map((it) => ({ ...it, ...ratingMap[it.asin] }));
const badAsins = new Set(["B07YKBKWX2", "B08R5W2782"]);
const final = merged.filter((it) => !badAsins.has(it.asin) && it.title);
writeFileSync("scripts/merged-1-80.json", JSON.stringify(final, null, 0));
console.log("final count:", final.length);
