import fs from "fs";

const CUT_PATTERNS = [
  /, (not just [^,]*)$/i,
  /, (not a [^,]*)$/i,
  /, (a detail[^,]*)$/i,
  /, (a genuine[^,]*)$/i,
  /, (a common[^,]*)$/i,
  /, (a real[^,]*)$/i,
  /, (a distinct[^,]*)$/i,
  /, (a specific[^,]*)$/i,
  /, (a notably[^,]*)$/i,
  /, (which [^,]*)$/i,
  /, (since [^,]*)$/i,
  /, (rather than [^,]*)$/i,
  /, (unlike [^,]*)$/i,
  /, (though [^,]*)$/i,
  /, (while [^,]*)$/i,
  /, (that other[^,]*)$/i,
  /, (no other[^,]*)$/i,
  /, (most competitors[^,]*)$/i,
  /, (many competitors[^,]*)$/i,
  /, (most comparable[^,]*)$/i,
  /, (most other[^,]*)$/i,
  /, (most .*(cluster|batch)[^,]*)$/i,
  /, (even though[^,]*)$/i,
  /, (not the[^,]*)$/i,
  /, (a meaningful[^,]*)$/i,
];

function shortenOnce(s) {
  let out = s.trim();
  let changed = true;
  let guard = 0;
  while (changed && guard < 5) {
    changed = false;
    guard++;
    for (const re of CUT_PATTERNS) {
      const m = out.match(re);
      if (m) {
        out = out.slice(0, m.index).trim();
        changed = true;
      }
    }
  }
  // trim trailing conjunctions/prepositions left dangling
  out = out.replace(/\s+(and|or|but|to|for|with|of|in|on|at|a|an|the)$/i, "").trim();

  const words = out.split(/\s+/);
  if (words.length > 14) {
    out = words.slice(0, 14).join(" ");
    out = out.replace(/\s+(and|or|but|to|for|with|of|in|on|at|a|an|the)$/i, "").trim();
  }
  if (out.length > 0) out = out[0].toUpperCase() + out.slice(1);
  out = out.replace(/,\s*$/, "").replace(/\.\s*$/, "");
  return out;
}

async function process(path, varName) {
  const mod = await import(`./${path.split("/").pop()}?t=${Date.now()}`);
  const P = mod[varName];
  for (const asin of Object.keys(P)) {
    const entry = P[asin];
    entry.pros = entry.pros.map(shortenOnce);
    entry.cons = (entry.cons || []).map(shortenOnce);
  }

  let out = `export const ${varName} = {\n`;
  for (const [asin, entry] of Object.entries(P)) {
    out += `  ${asin}: {\n`;
    out += `    name: ${JSON.stringify(entry.name)},\n`;
    out += `    p1: ${JSON.stringify(entry.p1)},\n`;
    out += `    specs: ${JSON.stringify(entry.specs)},\n`;
    out += `    pros: ${JSON.stringify(entry.pros)},\n`;
    out += `    cons: ${JSON.stringify(entry.cons)},\n`;
    out += `  },\n`;
  }
  out += `};\n`;
  fs.writeFileSync(path, out);
  console.log(`rewrote ${path}: ${Object.keys(P).length} entries`);
}

await process("scripts/firesafe-products.mjs", "P");
await process("scripts/officecred-products.mjs", "P");
