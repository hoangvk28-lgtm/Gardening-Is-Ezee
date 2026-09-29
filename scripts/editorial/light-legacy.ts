/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Light editorial pass for guides outside the rich template:
 *  - registry-only guides (rendered by GuideDetail): title/metaTitle/description + cleaned sections/faq
 *  - hand-authored /guide/<slug> pages: title/meta exports + cleaned long string literals in the data file,
 *    and the stale "WorkCocoon" publisher name in page schema.
 * Commerce fields and URLs are never touched.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/editorial/light-legacy.ts <registry-slugs> <hand-slugs>
 */
import fs from "node:fs";
import { guides } from "@/data/guides";
import { siloForGuide } from "@/lib/migrated-silos";
import { guideTopic } from "@/lib/guide-headings";
import { cleanText, pick, OUTCOME, CRITERIA } from "./light";

function newMeta(slug: string, oldTitle: string, silo: string, n?: number) {
  const crumb = oldTitle.replace(/^\d+\s+/, "").replace(/\s*\(20\d\d\)\s*$/, "").replace(/\s+(in|for)\s+20\d\d$/i, "").trim();
  const { plural } = guideTopic(crumb);
  if (!plural) return null;
  const hasContext = /\s(for|under|with|in|on|without|vs\.?)\s/i.test(plural);
  const title = hasContext
    ? pick([`The Best ${plural}, Compared`, `The Best ${plural}: Picks and Trade-offs`, `The Best ${plural}: Our Picks`], slug)
    : `The Best ${plural} ${pick(OUTCOME[silo] ?? ["for Home Offices", "for Everyday Use", "for a Better Workspace"], slug)}`;
  const metaTitle = hasContext ? `Best ${plural} (2026)` : `Best ${plural} for Home Offices (2026)`;
  const lower = plural.replace(/\b([A-Z][a-z]+)\b/g, (w) => w.toLowerCase());
  const crit = CRITERIA[silo] ?? "features, build and practical fit";
  const count = n ? `${n} ` : "";
  const description = pick([
    `We compared ${count}${lower} on ${crit} to help you choose the right one for your space.`,
    `A practical comparison of ${count}${lower}, focused on ${crit}, and the trade-offs between them.`,
    `How ${count}${lower} compare on ${crit}, with clear notes on who each one suits.`,
  ], slug);
  return { title, metaTitle, description };
}

const [regFile, handFile] = process.argv.slice(2);
const regSlugs = new Set(fs.readFileSync(regFile, "utf8").split(/\s+/).filter(Boolean));
const handSlugs = fs.readFileSync(handFile, "utf8").split(/\s+/).filter(Boolean);

let reg = fs.readFileSync("data/guides.ts", "utf8");
let nReg = 0, nHand = 0, nPage = 0;

function replaceBlock(slug: string, fn: (block: string) => string) {
  const i = reg.indexOf(`    slug: "${slug}",`);
  if (i < 0) return;
  const start = reg.lastIndexOf("  {\n", i), end = reg.indexOf("\n  },", i);
  reg = reg.slice(0, start) + fn(reg.slice(start, end)) + reg.slice(end);
}
const setField = (block: string, key: string, val: string) =>
  block.replace(new RegExp(`\\n    ${key}: ".*?",`), () => `\n    ${key}: ${JSON.stringify(val)},`);

// 1) Registry-only guides: regenerate the entry from the cleaned object.
for (const g of guides) {
  if (!regSlugs.has(g.slug)) continue;
  const silo = siloForGuide(g.categorySlug, g.subcategorySlug) ?? "";
  const m = newMeta(g.slug, g.title, silo, g.recommendedProductIds?.length || undefined);
  const next: any = { ...g };
  if (m) { next.title = m.title; next.metaTitle = m.metaTitle; next.description = m.description; }
  next.sections = (g.sections ?? []).map((s) => ({ ...s, body: cleanText(s.body) || s.body }));
  next.faq = (g.faq ?? []).map((f) => ({ ...f, answer: cleanText(f.answer) || f.answer }));
  if (g.buyingCriteria) next.buyingCriteria = g.buyingCriteria.map((c) => ({ ...c, content: cleanText(c.content) || c.content }));
  const ordered: any = {};
  for (const k of ["title", "metaTitle", ...Object.keys(g).filter((k) => k !== "title" && k !== "metaTitle")]) if (next[k] !== undefined) ordered[k] = next[k];
  const body = JSON.stringify(ordered, null, 2).split("\n").map((l, i) => (i === 0 ? "  {" : "  " + l)).join("\n")
    .replace(/^ {4}"([A-Za-z]+)":/gm, "    $1:").replace(/\n {2}\}$/, "");
  replaceBlock(g.slug, () => body);
  nReg++;
}

// 2) Hand-authored pages: in-place edits of the data file and page schema.
for (const slug of handSlugs) {
  const g = guides.find((x) => x.slug === slug);
  const dataFile = `data/guides/${slug}.ts`;
  const silo = g ? siloForGuide(g.categorySlug, g.subcategorySlug) ?? "" : "";
  if (fs.existsSync(dataFile)) {
    let src = fs.readFileSync(dataFile, "utf8");
    const old = src.match(/export const guideTitle\s*=\s*\n?\s*"([^"]+)"/)?.[1] ?? g?.title ?? "";
    const n = (src.match(/\bamazonUrl\b|\baffiliateUrl\b/g) ?? []).length || undefined;
    const m = newMeta(slug, old, silo, n ? Math.min(n, 12) : undefined);
    if (m) {
      src = src.replace(/(export const guideTitle\s*=\s*\n?\s*)"(?:[^"\\\n]|\\.)*"/, (_, a) => a + JSON.stringify(m.title));
      src = src.replace(/(export const metaTitle\s*=\s*\n?\s*)"(?:[^"\\\n]|\\.)*"/, (_, a) => a + JSON.stringify(m.metaTitle));
      src = src.replace(/(export const metaDescription\s*=\s*\n?\s*)"(?:[^"\\\n]|\\.)*"/, (_, a) => a + JSON.stringify(m.description));
      if (g) replaceBlock(slug, (b) => setField(setField(b.replace(/\n    metaTitle: ".*?",/, ""), "title", m.title), "description", m.description)
        .replace(`\n    title: ${JSON.stringify(m.title)},`, `\n    title: ${JSON.stringify(m.title)},\n    metaTitle: ${JSON.stringify(m.metaTitle)},`));
    }
    // Clean long prose string literals only (skip URLs and short labels).
    src = src.replace(/"((?:[^"\\\n]|\\.){80,})"/g, (whole, inner: string) => {
      if (/https?:\/\/|^\/|\.(webp|jpg|png)$/.test(inner)) return whole;
      const cleaned = cleanText(inner.replace(/\\n/g, "\n")).replace(/\n/g, "\\n");
      return cleaned ? `"${cleaned}"` : whole;
    });
    src = src.replace(/\bWorkCocoon\b/g, "The Office Journal");
    fs.writeFileSync(dataFile, src);
    nHand++;
  }
  const page = `app/(site)/guide/${slug}/page.tsx`;
  if (fs.existsSync(page)) {
    const p = fs.readFileSync(page, "utf8");
    const q = p.replace(/name: "WorkCocoon"/g, 'name: "The Office Journal"').replace(/\bWorkCocoon\b/g, "The Office Journal");
    if (q !== p) { fs.writeFileSync(page, q); nPage++; }
  }
}

fs.writeFileSync("data/guides.ts", reg);
console.log({ registryGuides: nReg, handDataFiles: nHand, pagesFixed: nPage });
