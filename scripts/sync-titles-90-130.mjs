import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const slugs = readFileSync(resolve(ROOT, "scripts/new-slugs-90-130.txt"), "utf-8").split("\n").map(s=>s.trim()).filter(Boolean);

async function main() {
  let guidesContent = readFileSync(resolve(ROOT, "data/guides.ts"), "utf-8");
  let changed = 0;
  for (const slug of slugs) {
    const fileUrl = pathToFileURL(resolve(ROOT, `data/guides/${slug}.ts`)).href;
    const mod = await import(fileUrl + "?t=" + Date.now());
    const slugMarker = `slug: ${JSON.stringify(slug)},`;
    const idx = guidesContent.indexOf(slugMarker);
    if (idx === -1) { console.log("NOT FOUND in guides.ts:", slug); continue; }
    const blockStart = guidesContent.lastIndexOf("{", idx);
    let blockEnd = guidesContent.indexOf("\n  },", idx);
    if (blockEnd === -1) continue;
    blockEnd += "\n  },".length;
    let block = guidesContent.slice(blockStart, blockEnd);
    const newTitle = JSON.stringify(mod.guideTitle);
    const newDesc = JSON.stringify(mod.metaDescription);
    const newHero = JSON.stringify(mod.heroImage);
    block = block.replace(/title: ".*?",\n/, `title: ${newTitle},\n`);
    block = block.replace(/description: ".*?",\n/, `description: ${newDesc},\n`);
    block = block.replace(/heroImage: ".*?",\n/, `heroImage: ${newHero},\n`);
    guidesContent = guidesContent.slice(0, blockStart) + block + guidesContent.slice(blockEnd);
    changed++;
  }
  writeFileSync(resolve(ROOT, "data/guides.ts"), guidesContent, "utf-8");
  console.log(`Synced ${changed}/${slugs.length} guides' title/description/heroImage in data/guides.ts`);
}
main().catch(e => { console.error(e); process.exit(1); });
