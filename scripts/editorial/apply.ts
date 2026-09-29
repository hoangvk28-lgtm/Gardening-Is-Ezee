/**
 * Apply an editorial rewrite (JSON) to a rich guide data file.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/editorial/apply.ts <slug> <rewrite.json>
 *
 * The JSON may set top-level editorial fields and, under `products`, per-id
 * editorial fields. Commerce/identity fields (id, rank, name, price, rating,
 * reviews, imageUrl, amazonUrl) and non-editorial exports (lastUpdated,
 * readTime, heroImage, mainKeyword, relatedGuides unless provided) are always
 * carried over from the original module unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TOP_LEVEL = [
  "guideTitle", "breadcrumbLabel", "metaTitle", "metaDescription", "introParagraphs",
  "buyingCriteria", "howWeEvaluated", "howToChoose", "faq", "bottomLine", "sectionHeadings", "relatedGuides",
] as const;
const PRODUCT_EDITORIAL = ["badge", "summary", "description", "bestFor", "skipIf", "specs", "pros", "cons"] as const;
const ORDER = [
  "guideSlug", "guideTitle", "breadcrumbLabel", "metaTitle", "metaDescription", "mainKeyword", "introParagraphs",
  "lastUpdated", "readTime", "heroImage", "products", "howWeEvaluated", "buyingCriteria", "howToChoose",
  "faq", "bottomLine", "sectionHeadings", "relatedGuides",
];

async function main() {
  const [slug, jsonPath] = process.argv.slice(2);
  const file = path.resolve("data/guides", `${slug}.ts`);
  const orig = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  const edit = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Record<string, unknown>;

  const out: Record<string, unknown> = { ...orig };
  for (const k of TOP_LEVEL) if (edit[k] !== undefined) out[k] = edit[k];

  const edits = (edit.products ?? {}) as Record<string, Record<string, unknown>>;
  const products = (orig.products as Record<string, unknown>[]).map((p) => {
    const e = edits[String(p.id)];
    if (!e) throw new Error(`No editorial entry for product id ${p.id}`);
    const next: Record<string, unknown> = { ...p };
    for (const k of PRODUCT_EDITORIAL) if (e[k] !== undefined) next[k] = e[k];
    return next;
  });
  const unknown = Object.keys(edits).filter((id) => !products.some((p) => p.id === id));
  if (unknown.length) throw new Error(`Editorial entries for unknown ids: ${unknown.join(", ")}`);
  out.products = products;

  const keys = [...ORDER.filter((k) => k in out), ...Object.keys(out).filter((k) => !ORDER.includes(k))];
  const body = keys
    .filter((k) => typeof out[k] !== "function")
    .map((k) => `export const ${k} = ${JSON.stringify(out[k], null, 2)};`)
    .join("\n\n");
  const header =
    `// Editorial rewrite for The Office Journal (docs/editorial-guide.md).\n` +
    `// Commerce fields (ids, ranks, prices, images, affiliate URLs) are carried over unchanged.\n` +
    `import type { GuideProduct, HowToChooseSection } from "@/components/guide/RichGuidePage";\n\n`;
  const typed = body
    .replace(/^export const products = /m, "export const products: GuideProduct[] = ")
    .replace(/^export const howToChoose = /m, "export const howToChoose: HowToChooseSection[] = ");
  fs.writeFileSync(file, header + typed + "\n");
  console.log(`applied: ${slug} (${products.length} products)`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
