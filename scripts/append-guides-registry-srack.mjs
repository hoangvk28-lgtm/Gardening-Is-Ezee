import fs from "fs";
import { pathToFileURL } from "url";

const slugs = fs.readFileSync("scripts/_srack_slug_list.txt", "utf8").trim().split(" ");

let entries = "";
for (const slug of slugs) {
  const mod = await import(pathToFileURL(`data/guides/${slug}.ts`).href + "?t=" + Date.now());
  const relatedSlugs = (mod.relatedGuides || []).map((r) => r.href.replace("/guide/", ""));
  entries += `  {
    title: ${JSON.stringify(mod.guideTitle)},
    slug: "${slug}",
    categorySlug: "compact-home-office",
    subcategorySlug: "desk-accessories",
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
