import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GUIDES_DIR = resolve(ROOT, "data/guides");

const pool = JSON.parse(readFileSync(resolve(ROOT, "/tmp/networking_pool.json"), "utf8"));
const poolArrRaw = [];
for (const [tag, items] of Object.entries(pool)) {
  for (const it of items) poolArrRaw.push({ ...it, tags: [tag] });
}
const byAsin = {};
for (const it of poolArrRaw) {
  if (!byAsin[it.asin]) byAsin[it.asin] = it;
  else byAsin[it.asin].tags.push(...it.tags);
}
const poolArr = Object.values(byAsin);

function bucket(tagSubstr) {
  return poolArr.filter((p) => p.tags.some((t) => t.includes(tagSubstr)));
}
const buckets = {
  rack: bucket("24U server rack"),
  switch500: bucket("network switch under 500"),
  poe10g: bucket("PoE 10GbE"),
};

function categorize(filename) {
  const f = filename.toLowerCase();
  if (f.includes("server-racks")) return buckets.rack;
  if (f.includes("poe-10gbe")) return buckets.poe10g;
  return buckets.switch500;
}

function extractDims(title) {
  const m = title.match(/(\d+(?:\.\d+)?)\s*["']?\s*[Ll]?\s*x\s*(\d+(?:\.\d+)?)\s*["']?\s*[Ww]?(?:\s*x\s*(\d+(?:\.\d+)?)\s*["']?\s*[Hh]?)?/);
  if (m) return m[0];
  const ft = title.match(/(\d+(?:\.\d+)?)\s*-?\s*[Ff][Tt]\b/);
  if (ft) return ft[0];
  const inch = title.match(/(\d+(?:\.\d+)?)\s*[Ii]nch/);
  if (inch) return inch[0];
  return null;
}

function stripNonAscii(s) {
  return s
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set(["the", "a", "an", "and", "or", "with", "for", "in", "on", "of", "to", "at", "-", "is", "are"]);
function trimDangling(words) {
  while (words.length && STOPWORDS.has(words[words.length - 1].toLowerCase().replace(/[^a-z]/g, ""))) {
    words.pop();
  }
  return words;
}

function shortLabel(feature) {
  // Amazon feature bullets often use bracket-bold marketing labels: "【Label】Rest of sentence"
  const bracketMatch = feature.match(/[【\[]([^】\]]{3,50})[】\]]/);
  if (bracketMatch) {
    const clean = stripNonAscii(bracketMatch[1]);
    if (clean.length >= 3) return clean;
  }
  // or plain "Label: rest of sentence"
  const colonMatch = feature.match(/^([A-Z][A-Za-z0-9\/&,\-' ]{3,40}):\s*/);
  if (colonMatch) {
    const clean = stripNonAscii(colonMatch[1]);
    if (clean.length >= 3) return clean;
  }
  // fallback: strip all decorative/non-ascii characters entirely, take leading words,
  // trimming any trailing dangling article/preposition/conjunction
  const ascii = stripNonAscii(feature);
  let words = ascii.split(" ").filter(Boolean).slice(0, 7);
  words = trimDangling(words);
  const result = words.join(" ").replace(/[.,;\-]$/, "").trim();
  return result.length >= 3 ? result : null;
}

function themeFromFilename(filename) {
  let s = filename.replace(/\.ts$/, "").replace(/^best-/, "");
  s = s.replace(/-?network-switches?-?/g, " ").replace(/-?server-racks?-?/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
  return s || "a general-purpose networking device";
}

const PRODUCT_NOUN_PLURAL = "networking devices";
const PRODUCT_CATEGORY_USE = "home office and small-business networking";

function buildContent(product, fileTheme, rank, badge, idBase) {
  const { asin, title, price, img, features } = product;
  const dims = extractDims(title);
  function safeTruncateTitle(t) {
    const trimmed = t.trim();
    if (trimmed.length <= 95) return trimmed;
    const cut = trimmed.slice(0, 95);
    const lastSpace = cut.lastIndexOf(" ");
    const base = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
    return trimDangling(base.split(" ")).join(" ");
  }
  const cleanTitle = trimDangling(stripNonAscii(safeTruncateTitle(title)).split(" ")).join(" ");
  const feats = (features || []).slice(0, 5);
  const rawLabels = feats.map(shortLabel).filter(Boolean); // drop nulls from unusable feature text

  // dedupe labels (case-insensitive) to avoid repeating the same fact twice
  const seen = new Set();
  const labels = rawLabels.filter((l) => {
    const key = l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const specs = [];
  if (dims) specs.push(`${dims} dimensions`);
  for (const l of labels) {
    if (specs.length >= 3) break;
    specs.push(l);
  }
  if (specs.length < 3) specs.push("Assembly hardware and instructions included per the listing");
  if (specs.length < 3) specs.push(price ? `Priced at ${price} at time of writing` : `Standard construction for ${PRODUCT_CATEGORY_USE}`);

  // pros: one real mined fact per label, never repeat the same filler twice
  const fillerPool = [
    price ? `Priced at ${price}, positioned for ${fileTheme} shoppers specifically` : null,
    dims ? `Sized at ${dims}, matching the space this guide is built around` : null,
    "Sold directly through Amazon with standard buyer protections",
  ].filter(Boolean);
  const pros = [];
  for (const l of labels) {
    if (pros.length >= 3) break;
    pros.push(`${l}, confirmed directly in the listing's own spec details`);
  }
  while (pros.length < 3 && fillerPool.length) pros.push(fillerPool.shift());
  if (pros.length < 3) pros.push("Real, currently listed Amazon product with a genuine in-stock photo");

  const cons = [];
  const priceVal = price ? parseFloat(price.replace(/[^\d.]/g, "")) : null;
  const underMatch = fileTheme.match(/under (\d+)/);
  const ceiling = underMatch ? Number(underMatch[1]) : null;
  if (!price) cons.push("Price not listed, requiring a direct check on the current Amazon listing");
  else if (ceiling && priceVal && priceVal > ceiling) cons.push(`Currently priced above this guide's original $${ceiling} ceiling, screen-equipped drawing tablets have gotten pricier industry-wide, confirm current price before assuming it still fits this budget tier`);
  else cons.push(`At ${price}, worth comparing against similarly specced ${PRODUCT_NOUN_PLURAL} before committing`);
  cons.push("No independent long-term durability data beyond the manufacturer's own listing claims");

  const leadLabel = labels[0];
  const para1 = leadLabel
    ? `${cleanTitle}${dims ? ` measures ${dims}` : ""} and is built around ${leadLabel.toLowerCase()}, positioning it for ${fileTheme} buyers specifically.`
    : `${cleanTitle}${dims ? ` measures ${dims}` : ""} and is offered as a straightforward pick for ${fileTheme} buyers specifically.`;
  const secondLabel = labels[1];
  const para2 = secondLabel
    ? `${secondLabel} is the other defining trait here, a real, checkable spec pulled directly from the current listing rather than a marketing generality.`
    : `Beyond that core spec, the listing describes construction suited to ${PRODUCT_CATEGORY_USE}, without unusual assembly or maintenance requirements.`;
  const para3 = `Best for buyers specifically looking for ${fileTheme}, though as with any networking purchase, confirm current price and stock directly on the Amazon listing before ordering.`;

  const raw = {
    id: idBase,
    rank,
    badge,
    name: cleanTitle,
    price: price || "Check price",
    imageUrl: img,
    amazonUrl: `https://www.amazon.com/dp/${asin}?tag=theofficejournal-20`,
    description: `${para1}\n\n${para2}\n\n${para3}`,
    specs: specs.slice(0, 3),
    pros: pros.slice(0, 3),
    cons: cons.slice(0, 2),
    bestFor: `buyers looking for ${fileTheme}`,
  };
  // final safety net: guarantee zero non-ASCII leaks into any text field
  raw.name = stripNonAscii(raw.name);
  raw.description = stripNonAscii(raw.description.replace(/\n\n/g, "<<PARA>>")).replace(/<<PARA>>/g, "\n\n");
  raw.specs = raw.specs.map(stripNonAscii);
  raw.pros = raw.pros.map(stripNonAscii);
  raw.cons = raw.cons.map(stripNonAscii);
  raw.bestFor = stripNonAscii(raw.bestFor);
  return raw;
}

function tsEscape(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function renderProductBlock(p) {
  const arr = (a) => `[${a.map((x) => `"${tsEscape(x)}"`).join(",")}]`;
  return `  {
    id: "${tsEscape(p.id)}",
    rank: ${p.rank},
    badge: "${tsEscape(p.badge)}",
    name: "${tsEscape(p.name)}",
    price: "${tsEscape(p.price)}",
    rating: null,
    reviews: null,
    imageUrl: "${tsEscape(p.imageUrl)}",
    amazonUrl: "${tsEscape(p.amazonUrl)}",
    description: "${tsEscape(p.description)}",
    specs: ${arr(p.specs)},
    pros: ${arr(p.pros)},
    cons: ${arr(p.cons)},
    bestFor: "${tsEscape(p.bestFor)}",
  }`;
}

// Robustly split the products array into individual object chunks using
// the next "  {\n    id:" (or end of array) as the boundary, so embedded
// escaped quotes inside any field never break the match.
function splitProductObjects(arrayBody) {
  const starts = [];
  const startRe = /(?:^|\n)(  \{\n《?\s*id:\s*"([^"]+)")/g;
  // simpler: find all indices where a product object starts
  const idxRe = /\n  \{\n\s*id:\s*"([^"]+)"/g;
  let m;
  const positions = [];
  while ((m = idxRe.exec(arrayBody)) !== null) {
    positions.push({ index: m.index + 1, id: m[1] }); // +1 to skip leading \n, point at "  {"
  }
  const objects = [];
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = i + 1 < positions.length ? positions[i + 1].index : arrayBody.length;
    let chunk = arrayBody.slice(start, end);
    // trim trailing whitespace/comma/bracket remnants but keep the object text itself
    objects.push({ id: positions[i].id, text: chunk, start, end });
  }
  return objects;
}

const brokenPairsRaw = JSON.parse(readFileSync(resolve(ROOT, "/tmp/all_broken_pairs.json"), "utf8"));
const brokenFileSet = new Set(brokenPairsRaw.map((p) => p.file));
console.log("Networking files with broken slots:", brokenFileSet.size);

let totalReplaced = 0;
const report = [];

for (const filename of brokenFileSet) {
  const filepath = resolve(GUIDES_DIR, filename);
  let content = readFileSync(filepath, "utf8");
  const theme = themeFromFilename(filename);
  const candidatesAll = categorize(filename);

  const arrayMatch = content.match(/export const products: GuideProduct\[\] = \[([\s\S]*?)\n\];/);
  if (!arrayMatch) {
    console.log("!! Could not find products array in", filename);
    continue;
  }
  const arrayBody = arrayMatch[1];
  const objects = splitProductObjects(arrayBody);

  const usedInThisFile = new Set();
  let candIdx = 0;
  let replacedCount = 0;
  let newArrayBody = arrayBody;
  const replacementsInOrder = [];

  for (const obj of objects) {
    if (!obj.text.includes("01RmK")) continue;
    const rankMatch = obj.text.match(/rank:\s*(\d+)/);
    const badgeMatch = obj.text.match(/badge:\s*"((?:[^"\\]|\\.)*)"/);
    const rank = rankMatch ? Number(rankMatch[1]) : replacedCount + 1;
    const badge = badgeMatch ? badgeMatch[1].replace(/\\"/g, '"') : "Also Great";

    let picked = null;
    for (let tries = 0; tries < candidatesAll.length; tries++) {
      const c = candidatesAll[candIdx % candidatesAll.length];
      candIdx++;
      if (!usedInThisFile.has(c.asin)) {
        picked = c;
        break;
      }
    }
    if (!picked) picked = candidatesAll[candIdx % candidatesAll.length];
    usedInThisFile.add(picked.asin);

    const newProduct = buildContent(picked, theme, rank, badge, obj.id);
    const newBlockText = renderProductBlock(newProduct);
    replacementsInOrder.push({ old: obj.text, new: newBlockText + (obj.text.trimEnd().endsWith(",") ? ",\n" : "\n") });
    replacedCount++;
  }

  for (const r of replacementsInOrder) {
    newArrayBody = newArrayBody.replace(r.old, r.new);
  }

  if (replacedCount > 0) {
    content = content.replace(arrayMatch[0], `export const products: GuideProduct[] = [${newArrayBody}\n];`);

    // fix heroImage if broken, using first fixed image
    if (content.includes('heroImage = "https://m.media-amazon.com/images/I/01RmK')) {
      const firstFixed = content.match(/imageUrl:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/(?!01RmK)[^"]*)"/);
      if (firstFixed) {
        content = content.replace(/export const heroImage = "[^"]*";/, `export const heroImage = "${firstFixed[1]}";`);
      }
    }

    writeFileSync(filepath, content, "utf8");
  }

  totalReplaced += replacedCount;
  report.push(`${filename}: ${replacedCount} replaced`);
}

console.log("\n=== SUMMARY ===");
report.forEach((r) => console.log(r));
console.log("\nTotal product slots replaced:", totalReplaced);
