import fs from "fs";
import { pathToFileURL } from "url";

const slugs = [
  "best-mini-ups-for-routers",
  "best-mini-ups-for-routers-and-modems",
  "best-mini-dc-ups-for-wifi-routers",
  "best-12v-mini-ups-for-routers",
  "best-20000mah-mini-ups-for-wifi-routers",
  "best-8800mah-mini-ups-for-routers",
  "best-mini-ups-for-fiber-routers",
  "best-mini-ups-for-routers-and-cctv-cameras",
  "best-mini-ups-for-routers-and-onus",
  "best-oakter-mini-ups-for-routers",
  "best-wgp-mini-ups-for-routers",
  "best-10400mah-mini-ups-for-routers",
  "best-5v-mini-ups-for-routers",
  "best-9v-mini-ups-for-wifi-routers",
  "best-cuzor-mini-ups-for-routers",
  "best-mini-ups-for-two-routers",
];

let entries = "";
for (const slug of slugs) {
  const mod = await import(pathToFileURL(`data/guides/${slug}.ts`).href + "?t=" + Date.now());
  const relatedSlugs = mod.relatedGuides || [];
  entries += `  {
    title: ${JSON.stringify(mod.guideTitle)},
    slug: "${slug}",
    categorySlug: "networking",
    subcategorySlug: "power-backup",
    description: ${JSON.stringify(mod.metaDescription)},
    mainKeyword: ${JSON.stringify(mod.mainKeyword)},
    subKeywords: [${JSON.stringify(mod.mainKeyword)}],
    heroImage: ${JSON.stringify(mod.heroImage)},
    lastUpdated: ${JSON.stringify(mod.lastUpdated)},
    author: "Jamie Cole",
    readTime: ${JSON.stringify(mod.readTime)},
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: ${JSON.stringify(relatedSlugs)},
    buyingCriteria: [],
  },
`;
}

let content = fs.readFileSync("data/guides.ts", "utf8");
const hadCRLF = content.includes("\r\n");
if (hadCRLF) content = content.replace(/\r\n/g, "\n");
content = content.replace(/\n\];\s*$/, `\n${entries}];\n`);
if (hadCRLF) content = content.replace(/\n/g, "\r\n");
fs.writeFileSync("data/guides.ts", content);
console.log("appended", slugs.length, "entries");
