import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const GUIDE_DIR = resolve(ROOT, "app", "(site)", "guide");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry === "page.tsx") out.push(full);
  }
}

const PRICE_PILL_RE = /\s*<span className="text-xs px-2\.5 py-1 rounded-lg bg-brand-muted text-brand font-bold">\s*\{product\.price\}\s*<\/span>\n/;
const TABLE_HEADER_RE = /\s*<th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Price<\/th>\n/;
const TABLE_CELL_RE = /\s*<td className="px-4 py-3 text-ink-secondary text-xs hidden sm:table-cell">\{product\.price\}<\/td>\n/;
const PRICE_NOTE_RE = /\s*<p className="text-xs text-ink-muted mt-2">Prices are approximate\. Check Amazon for current pricing before purchasing\.<\/p>\n/;

const files = [];
walk(GUIDE_DIR, files);

let changed = 0;
let skipped = [];
for (const file of files) {
  let content = readFileSync(file, "utf8");
  const before = content;
  content = content.replace(PRICE_PILL_RE, "\n");
  content = content.replace(TABLE_HEADER_RE, "\n");
  content = content.replace(TABLE_CELL_RE, "\n");
  content = content.replace(PRICE_NOTE_RE, "\n");
  if (content !== before) {
    writeFileSync(file, content, "utf8");
    changed++;
  } else if (before.includes("product.price")) {
    skipped.push(file);
  }
}

console.log(`Updated ${changed}/${files.length} literal guide pages.`);
if (skipped.length) {
  console.log(`\n${skipped.length} files still contain "product.price" and need manual review:`);
  skipped.forEach((f) => console.log(" -", f));
}
