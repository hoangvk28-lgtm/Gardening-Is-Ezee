import fs from "fs";

const STOP_TAIL = new Set([
  "in","on","at","to","for","with","of","from","under","over","than","without",
  "before","after","through","near","by","about","into","onto","upon","against",
  "between","among","within","along","per","across","off","out","up","down",
  "a","an","the","and","or","but","so","because","since","while","if","as",
  "more","most","less","fewer","such","very","too","also","only","just","even","not","that","this","those","these",
]);

function repair(s) {
  let out = s.trim();
  let words = out.split(/\s+/);
  let guard = 0;
  while (words.length > 3 && guard < 10) {
    const last = words[words.length - 1].toLowerCase().replace(/[.,;:]$/, "");
    if (STOP_TAIL.has(last)) {
      words.pop();
      guard++;
    } else {
      break;
    }
  }
  out = words.join(" ").trim();
  if (out.length > 0) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

async function process(fileName, varName) {
  const mod = await import(`./${fileName}?t=${Date.now()}`);
  const P = mod[varName];
  let fixed = 0;
  for (const asin of Object.keys(P)) {
    const entry = P[asin];
    entry.pros = entry.pros.map((s) => {
      const r = repair(s);
      if (r !== s) fixed++;
      return r;
    });
    entry.cons = (entry.cons || []).map((s) => {
      const r = repair(s);
      if (r !== s) fixed++;
      return r;
    });
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
  fs.writeFileSync(`scripts/${fileName}`, out);
  console.log(`${fileName}: fixed ${fixed} entries`);
}

await process("firesafe-products.mjs", "P");
await process("officecred-products.mjs", "P");
