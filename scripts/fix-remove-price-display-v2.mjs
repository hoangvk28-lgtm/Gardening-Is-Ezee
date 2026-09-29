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
  // Price pill: <span className="...">\n  {x.price}\n</span>  (any class list)
  { re: /[ \t]*<span className="[^"]*">\s*\{[\w.]+\.price\}\s*<\/span>\n/g, replace: "" },
  // Table header cell containing just "Price" (possibly multiline)
  { re: /[ \t]*<th className="[^"]*">\s*Price\s*<\/th>\n/g, replace: "" },
  // Table data cell rendering {x.price}
  { re: /[ \t]*<td className="[^"]*">\s*\{[\w.]+\.price\}\s*<\/td>\n/g, replace: "" },
  // "Prices are approximate..." note paragraph
  { re: /[ \t]*<p className="[^"]*">Prices are approximate\.[^<]*<\/p>\n/g, replace: "" },
  // Inline "{x.price} &middot; " fragment inside a larger paragraph
  { re: /\{[\w.]+\.price\}\s*&middot;\s*/g, replace: "" },
  // Inline " &middot; {x.price}" fragment (price at the end)
  { re: /\s*&middot;\s*\{[\w.]+\.price\}/g, replace: "" },
];

let changed = 0;
let stillHasPrice = [];
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
  if (/\.price\b/.test(content)) stillHasPrice.push(file);
}

console.log(`Updated ${changed}/${files.length} files in this pass.`);
console.log(`${stillHasPrice.length} files still reference ".price" and need manual review:`);
stillHasPrice.forEach((f) => console.log(" -", f));
