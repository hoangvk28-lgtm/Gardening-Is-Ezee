// Fixes fabricated placeholder image URLs (m.media-amazon.com/.../41K6xTLW3dL...) by
// replacing them with each product's real image from scripts/lookup-90plus.json,
// matched by ASIN extracted from the product's amazonUrl.
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const lookup = JSON.parse(readFileSync(resolve(ROOT, "scripts/lookup-90plus.json"), "utf-8"));
const asinToImage = new Map(lookup.map((p) => [p.asin, p.image]));

const FAKE = "https://m.media-amazon.com/images/I/41K6xTLW3dL._SL500_.jpg";

const guidesDir = resolve(ROOT, "data/guides");
const files = readdirSync(guidesDir).filter((f) => f.endsWith(".ts"));

let filesChanged = 0;
let fieldsChanged = 0;
let missingAsin = [];

for (const file of files) {
  const path = resolve(guidesDir, file);
  let content = readFileSync(path, "utf-8");
  if (!content.includes(FAKE)) continue;

  let changed = false;

  // Replace each product's imageUrl based on the ASIN in its own amazonUrl (same object).
  // Product objects follow pattern: imageUrl: "...", amazonUrl: "https://www.amazon.com/dp/ASIN?...
  content = content.replace(
    /imageUrl:\s*"([^"]*)",\n(\s*)amazonUrl:\s*"https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]+)\?/g,
    (match, imgUrl, indent, asin) => {
      if (imgUrl !== FAKE) return match;
      const real = asinToImage.get(asin);
      if (!real) {
        missingAsin.push(`${file}: ${asin}`);
        return match;
      }
      changed = true;
      fieldsChanged++;
      return `imageUrl: "${real}",\n${indent}amazonUrl: "https://www.amazon.com/dp/${asin}?`;
    }
  );

  // Replace heroImage: use the first product's real image found in the file (already replaced above).
  if (content.includes(`heroImage = "${FAKE}"`)) {
    const firstImg = content.match(/imageUrl:\s*"(https:\/\/m\.media-amazon\.com\/[^"]+)"/);
    if (firstImg && firstImg[1] !== FAKE) {
      content = content.replace(`heroImage = "${FAKE}"`, `heroImage = "${firstImg[1]}"`);
      changed = true;
      fieldsChanged++;
    }
  }

  if (changed) {
    writeFileSync(path, content, "utf-8");
    filesChanged++;
  }
}

console.log(`Files changed: ${filesChanged}`);
console.log(`Fields changed: ${fieldsChanged}`);
if (missingAsin.length) {
  console.log(`\nASINs with no verified image found (left as-is, needs manual check):`);
  missingAsin.forEach((m) => console.log(`  ${m}`));
}
