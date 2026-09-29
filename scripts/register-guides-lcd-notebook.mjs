// One-off script: registers the 87 new guide data files into data/guides.ts (legacy array)
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const slugs = readFileSync(resolve(ROOT, "scripts/new-slugs-lcd-notebook.txt"), "utf-8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

function subcategoryFor(slug) {
  if (slug.includes("laptop-screen-extender")) return "laptop-screen-extenders";
  if (slug.includes("usb-c-monitor")) return "usb-c-monitors";
  if (slug.includes("kvm")) return "kvm-switches";
  if (slug.includes("mini-pc")) return "mini-pcs";
  return "desk-accessories";
}

async function main() {
  const entries = [];
  for (const slug of slugs) {
    const fileUrl = pathToFileURL(resolve(ROOT, `data/guides/${slug}.ts`)).href;
    const mod = await import(fileUrl);
    const kw = mod.mainKeyword || slug.replace(/^best-/, "").replace(/-/g, " ");
    const subKeywords = [kw, `${kw} guide`, `best ${kw}`];
    const entry = `  {
    title: ${JSON.stringify(mod.guideTitle)},
    slug: ${JSON.stringify(mod.guideSlug)},
    categorySlug: "compact-home-office",
    subcategorySlug: ${JSON.stringify(subcategoryFor(slug))},
    description: ${JSON.stringify(mod.metaDescription)},
    mainKeyword: ${JSON.stringify(kw)},
    subKeywords: ${JSON.stringify(subKeywords)},
    heroImage: ${JSON.stringify(mod.heroImage)},
    lastUpdated: ${JSON.stringify(mod.lastUpdated)},
    author: "Jamie Cole",
    readTime: ${JSON.stringify(mod.readTime)},
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: ${JSON.stringify((mod.relatedGuides || []).map((r) => r.href.replace("/guide/", "")))},
    buyingCriteria: [],
  },`;
    entries.push(entry);
  }

  const guidesPath = resolve(ROOT, "data/guides.ts");
  const content = readFileSync(guidesPath, "utf-8");
  const marker = "\n];";
  const lastIdx = content.lastIndexOf(marker);
  if (lastIdx === -1) throw new Error("Could not find closing marker in guides.ts");
  const newContent = content.slice(0, lastIdx) + "\n" + entries.join("\n") + content.slice(lastIdx);
  writeFileSync(guidesPath, newContent, "utf-8");
  console.log(`Registered ${entries.length} guides into data/guides.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
