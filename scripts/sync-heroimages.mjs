// Syncs heroImage in data/guides.ts (legacy array) with the fixed heroImage
// exported from each data/guides/<slug>.ts file, for the 87-guide batch.
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const slugs = readFileSync(resolve(ROOT, "scripts/new-slugs.txt"), "utf-8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  const guidesPath = resolve(ROOT, "data/guides.ts");
  let content = readFileSync(guidesPath, "utf-8");
  let changed = 0;

  for (const slug of slugs) {
    const fileUrl = pathToFileURL(resolve(ROOT, `data/guides/${slug}.ts`)).href;
    const mod = await import(fileUrl);
    const realHero = mod.heroImage;

    // Find this slug's block and replace its heroImage line only.
    const slugMarker = `slug: ${JSON.stringify(slug)},`;
    const idx = content.indexOf(slugMarker);
    if (idx === -1) {
      console.log(`WARN: slug not found in guides.ts: ${slug}`);
      continue;
    }
    const heroRe = /heroImage:\s*"[^"]*",/;
    const after = content.slice(idx);
    const m = after.match(heroRe);
    if (!m) {
      console.log(`WARN: no heroImage field found for: ${slug}`);
      continue;
    }
    const newLine = `heroImage: ${JSON.stringify(realHero)},`;
    if (m[0] === newLine) continue; // already correct
    const absoluteIdx = idx + after.indexOf(m[0]);
    content = content.slice(0, absoluteIdx) + newLine + content.slice(absoluteIdx + m[0].length);
    changed++;
  }

  writeFileSync(guidesPath, content, "utf-8");
  console.log(`Updated heroImage for ${changed} guides in data/guides.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
