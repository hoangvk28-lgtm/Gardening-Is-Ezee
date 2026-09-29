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

// Matches the standard "Comparison Table" block emitted by scripts/generate-guide-page.mjs
// (post price-removal shape): heading + table with Pick/Product columns + CTA-only cell.
const TABLE_BLOCK_RE =
  /<section className="mb-10">\s*<h2 className="text-2xl font-bold text-ink mb-4 tracking-tight">Comparison Table<\/h2>\s*<div className="overflow-x-auto rounded-xl border border-border">\s*<table className="w-full text-sm">\s*<thead>\s*<tr className="bg-brand text-white">\s*<th className="text-left px-4 py-3 font-semibold">Pick<\/th>\s*<th className="text-left px-4 py-3 font-semibold">Product<\/th>\s*<th className="px-4 py-3"><\/th>\s*<\/tr>\s*<\/thead>\s*<tbody>\s*\{(\w+)\.map\(\((\w+), i\) => \(\s*<tr key=\{\2\.id\} className=\{i % 2 === 0 \? "bg-white" : "bg-bg"\}>\s*<td className="px-4 py-3">\s*<a href=\{`#\$\{\2\.id\}`\} className="text-xs font-bold text-brand hover:underline">\{\2\.badge\}<\/a>\s*<\/td>\s*<td className="px-4 py-3 font-semibold text-ink text-xs">\{\2\.name\}<\/td>\s*<td className="px-4 py-3">\s*<a href=\{\2\.amazonUrl\} target="_blank" rel="noopener noreferrer sponsored" className="text-xs font-bold px-3 py-1\.5 rounded-lg text-white whitespace-nowrap inline-block" style=\{\{ background: "#FF9900" \}\}>\s*Check price\s*<\/a>\s*<\/td>\s*<\/tr>\s*\)\)\}\s*<\/tbody>\s*<\/table>\s*<\/div>\s*<\/section>/;

let changed = 0;
let noMatch = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const m = content.match(TABLE_BLOCK_RE);
  if (!m) {
    if (/Comparison Table<\/h2>/.test(content)) noMatch.push(file);
    continue;
  }
  const [fullMatch, arrayVar, itemVar] = m;

  const replacement = `<AtAGlance
          items={${arrayVar}.map((${itemVar}) => ({
            rank: ${itemVar}.rank,
            badge: ${itemVar}.badge,
            name: ${itemVar}.name,
            brand: "",
            imageUrl: ${itemVar}.imageUrl,
            affiliateUrl: ${itemVar}.amazonUrl,
            price: "",
            pros: ${itemVar}.pros.map((text) => ({ text })),
            cons: ${itemVar}.cons.map((text) => ({ text, severity: "minor" as const })),
            anchorId: ${itemVar}.id,
          }))}
        />`;

  let updated = content.replace(fullMatch, replacement);

  if (!/from "@\/components\/product\/AtAGlance"/.test(updated)) {
    // Insert the import right after the last existing top-of-file import line.
    const importBlockMatch = updated.match(/(^import[^\n]*\n)+/);
    if (importBlockMatch) {
      const insertAt = importBlockMatch[0].length;
      updated =
        updated.slice(0, insertAt) +
        `import { AtAGlance } from "@/components/product/AtAGlance";\n` +
        updated.slice(insertAt);
    }
  }

  writeFileSync(file, updated, "utf8");
  changed++;
}

console.log(`Updated ${changed}/${files.length} files.`);
console.log(`${noMatch.length} files have a "Comparison Table" heading but didn't match the standard block shape (need manual review):`);
noMatch.forEach((f) => console.log(" -", f));
