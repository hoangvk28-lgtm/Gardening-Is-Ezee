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

const files = [];
walk(GUIDE_DIR, files);

const patterns = [
  // Pill span: <span className="...">{x.priceRange}</span> — same line or its own line
  { re: /[ \t]*<span className="[^"]*">\{[\w.]+\.priceRange\}<\/span>\n/g, replace: "" },
  { re: /[ \t]*\{[\w.]+\.priceRange\}\n/g, replace: "" },
  // Table header cell "Price"
  { re: /[ \t]*<th className="[^"]*">\s*Price\s*<\/th>\n/g, replace: "" },
  // Table data cell
  { re: /[ \t]*<td className="[^"]*">\{[\w.]+\.priceRange\}<\/td>\n/g, replace: "" },
  // Standalone span not on its own line (inline within a larger div), fallback: strip just the tag+expr
  { re: /<span className="[^"]*">\{[\w.]+\.priceRange\}<\/span>/g, replace: "" },
];

let changed = 0;
let stillHas = [];
for (const file of files) {
  let content = readFileSync(file, "utf8");
  const before = content;
  for (const { re, replace } of patterns) {
    content = content.replace(re, replace);
  }
  if (content !== before) {
    writeFileSync(file, content, "utf8");
    changed++;
  }
  if (/\.priceRange\b/.test(content)) stillHas.push(file);
}

console.log(`Updated ${changed}/${files.length} files.`);
console.log(`${stillHas.length} files still reference ".priceRange":`);
stillHas.forEach((f) => console.log(" -", f));
