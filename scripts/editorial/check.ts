/* eslint-disable @typescript-eslint/no-explicit-any */
/** Verify commerce/identity fields are byte-identical to the saved original.
 *  npx tsx --tsconfig tsconfig.json scripts/editorial/check.ts <slug> <original.ts> */
import path from "node:path";
import { pathToFileURL } from "node:url";
const FIELDS = ["id", "rank", "name", "price", "rating", "reviews", "imageUrl", "amazonUrl"];
const TOP = ["lastUpdated", "readTime", "heroImage", "mainKeyword", "guideSlug"];
async function main() {
  const [slug, origPath] = process.argv.slice(2);
  const a = (await import(pathToFileURL(path.resolve(origPath)).href)) as Record<string, any>;
  const b = (await import(pathToFileURL(path.resolve("data/guides", `${slug}.ts`)).href)) as Record<string, any>;
  const errs: string[] = [];
  for (const k of TOP) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) errs.push(`top ${k}`);
  if (a.products.length !== b.products.length) errs.push("product count");
  a.products.forEach((p: any, i: number) => FIELDS.forEach((f) => { if (p[f] !== b.products[i]?.[f]) errs.push(`${p.id}.${f}`); }));
  const missing = b.products.filter((p: any) => !p.skipIf || !p.summary).map((p: any) => p.id);
  if (missing.length) errs.push(`missing skipIf/summary: ${missing.join(",")}`);
  if (!b.bottomLine || !b.breadcrumbLabel) errs.push("missing bottomLine/breadcrumbLabel");
  console.log(errs.length ? `CHECK FAIL ${slug}: ${errs.join("; ")}` : `CHECK OK ${slug}`);
  if (errs.length) process.exit(1);
}
main();
