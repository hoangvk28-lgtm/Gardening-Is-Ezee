/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Light-touch editorial pass (no LLM): new H1 / SEO title / meta / dek, removal of
 * DeskFinds template sentences, star ratings and review counts, marketing wording
 * and a/an fixes. Commerce fields are never touched.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/editorial/light.ts <slugs-file>
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { guides } from "@/data/guides";
import { siloForGuide } from "@/lib/migrated-silos";
import { guideTopic, indefiniteArticle } from "@/lib/guide-headings";

const COMMERCE = new Set(["id", "rank", "name", "price", "rating", "reviews", "imageUrl", "amazonUrl"]);
const BAD_SENTENCE = new RegExp(
  [
    "real strength", "flip side", "genuine advantage", "worth calling out", "set against that", "both matter when",
    "neither should be a surprise", "^on the other hand,", "^the tradeoff is", "^the catch is", "worth knowing before you decide",
    "main tradeoff to weigh", "one spot below", "ranked just behind", "sitting just under", "that's the real difference",
    "that's the swap", "whether that trade is worth it", "compromise here is straightforward", "what you gain in return",
    "here's the honest tradeoff", "here's what it gets you instead", "in exchange, it offers", "earns the top spot in this comparison",
    "\\d\\.\\d[- ]?stars?", "\\d[\\d,]* (verified )?(ratings|reviews)\\b", "highest-rated", "most-reviewed", "review base",
    "we tested", "after (weeks|months|years) of use", "users love", "customers (agree|love)",
  ].join("|"),
  "i"
);
const REPLACE: [RegExp, string][] = [
  [/\bat pricing is\b/gi, "is"],
  [/\bat pricing\b/gi, ""],
  [/,? ?at an? (budget-friendly|competitive|premium|mid-range) price\b/gi, ""],
  [/\ba competitive price\+?/gi, "its price"],
  [/\bbudget-friendly\b/gi, "low-cost"],
  [/\bgenuinely\s+/gi, ""],
  [/\bperfect for\b/gi, "well suited to"],
  [/\bperfect\b/gi, "well suited"],
  [/\b(amazing|incredible|unbeatable|best-in-class|feature-packed)\s+/gi, ""],
  [/\bgame[- ]chang(er|ing)\b/gi, "notable"],
  [/\bmust-have\b/gi, "useful"],
  [/\bpremium quality\b/gi, "solid build"],
  [/\b(excellent choice|great option)\b/gi, "good fit"],
  [/\bwe evaluated\b/gi, "we compared"],
  [/\b([a-z])([A-Z]{1,5})\b/g, (_: string, a: string, b: string) => a.toUpperCase() + b] as unknown as [RegExp, string],
];

export function fixArticles(s: string): string {
  return s
    .replace(/\b([Aa]) ([A-Za-z][\w-]*)/g, (m, a, w) => {
      const want = indefiniteArticle(w);
      if (want === "an" && !/^[A-Z]{2,}/.test(w) && /^[aeio]/i.test(w)) return (a === "A" ? "An " : "an ") + w;
      return m;
    })
    .replace(/\b([Aa])n ([bcdfgjklmnpqrstvwxyz][a-z][\w-]*)/g, (m, a, w) =>
      /^(hour|honest|honor|herb)/i.test(w) ? m : (a === "A" ? "A " : "a ") + w);
}

export function cleanText(s: string): string {
  const paras = s.split(/\n\n/).map((p) => {
    const sentences = p.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [p];
    const kept = sentences
      .map((x) => x.trim())
      .filter((x) => x && !BAD_SENTENCE.test(x) && x.split(/\s+/).length > 4);
    let out = kept.join(" ");
    for (const [re, rep] of REPLACE) out = out.replace(re, rep as string);
    out = fixArticles(out).replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, c) => p1 + c.toUpperCase());
    return out.trim();
  });
  return paras.filter(Boolean).join("\n\n");
}

export function cleanList(arr: unknown): string[] | unknown {
  if (!Array.isArray(arr)) return arr;
  const kept = (arr as string[])
    .filter((x) => typeof x !== "string" || !BAD_SENTENCE.test(x))
    .map((x) => {
      if (typeof x !== "string") return x;
      let o = x;
      for (const [re, rep] of REPLACE) o = o.replace(re, rep as string);
      return fixArticles(o).replace(/\s{2,}/g, " ").trim();
    });
  return kept.length ? kept : arr;
}

export function deep(v: unknown): unknown {
  if (typeof v === "string") return cleanText(v);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]));
  return v;
}

export const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
export const pick = <T,>(arr: T[], s: string) => arr[hash(s) % arr.length];

export const OUTCOME: Record<string, string[]> = {
  "desk-setup": ["for a Better Desk Setup", "for a Cleaner, More Useful Desk", "for Everyday Desk Work"],
  chairs: ["for Everyday Work", "for a Better Home Office", "for Comfortable Workdays"],
  desks: ["for Home Offices", "for Everyday Work", "for a Better Workspace"],
  lighting: ["for a Better-Lit Workspace", "for Focused Work", "for Home Offices"],
  "work-better": ["for a Better Workday", "for Home-Office Comfort", "for Everyday Work"],
  "workspace-ideas": ["for Small and Everyday Spaces", "for a Better Home Office", "for Real-World Rooms"],
};
export const CRITERIA: Record<string, string> = {
  "desk-setup": "compatibility, build, features and price",
  chairs: "seat height, adjustment, support and warranty",
  desks: "size, height range, stability and features",
  lighting: "brightness, color temperature, adjustability and power",
  "work-better": "features, comfort and practical fit",
  "workspace-ideas": "size, storage and fit",
};

async function main() {
  const slugs = fs.readFileSync(process.argv[2], "utf8").split(/\s+/).filter(Boolean);
  const registry = fs.readFileSync("data/guides.ts", "utf8");
  let reg = registry;
  let deks = fs.readFileSync("data/guide-deks.ts", "utf8");
  const done: string[] = [];
  for (const slug of slugs) {
    if (fs.existsSync(`scripts/editorial/rewrites/${slug}.json`)) continue;
    const g = guides.find((x) => x.slug === slug);
    const file = path.resolve("data/guides", `${slug}.ts`);
    if (!g || !fs.existsSync(file)) continue;
    const orig = (await import(pathToFileURL(file).href)) as Record<string, any>;
    if (!Array.isArray(orig.products)) continue;
    const silo = siloForGuide(g.categorySlug, g.subcategorySlug) ?? "desk-setup";
    const oldTitle = String(orig.guideTitle ?? g.title);
    const crumb = oldTitle.replace(/^\d+\s+/, "").replace(/\s+(in|for)\s+20\d\d$/i, "").trim();
    const { plural } = guideTopic(crumb);
    const n = orig.products.length;

    const out: Record<string, any> = { ...orig };
    if (plural) {
      const hasContext = /\s(for|under|with|in|on|without|vs\.?)\s/i.test(plural);
      out.guideTitle = hasContext
        ? pick([`The Best ${plural}, Compared`, `The Best ${plural}: Picks and Trade-offs`, `The Best ${plural}: Our Picks`], slug)
        : `The Best ${plural} ${pick(OUTCOME[silo] ?? OUTCOME["desk-setup"], slug)}`;
      out.breadcrumbLabel = `Best ${plural}`;
      out.metaTitle = hasContext ? `Best ${plural} (2026)` : `Best ${plural} for Home Offices (2026)`;
      const lower = plural.replace(/\b([A-Z][a-z]+)\b/g, (w) => w.toLowerCase());
      out.metaDescription = pick([
        `We compared ${n} ${lower} on ${CRITERIA[silo]} to help you choose the right one for your space.`,
        `A practical comparison of ${n} ${lower}, focused on ${CRITERIA[silo]}, and the trade-offs between them.`,
        `How ${n} ${lower} compare on ${CRITERIA[silo]}, with clear notes on who each one suits.`,
      ], slug);
    }
    for (const k of ["introParagraphs", "buyingCriteria", "howWeEvaluated", "howToChoose", "faq"]) if (orig[k]) out[k] = deep(orig[k]);
    out.products = orig.products.map((p: Record<string, any>) => {
      const q: Record<string, any> = { ...p };
      for (const [k, v] of Object.entries(p)) {
        if (COMMERCE.has(k)) continue;
        if (k === "pros" || k === "cons" || k === "specs") q[k] = cleanList(v);
        else if (typeof v === "string") q[k] = cleanText(v) || v;
      }
      return q;
    });

    const keys = Object.keys(out).filter((k) => typeof out[k] !== "function");
    const body = keys.map((k) => `export const ${k} = ${JSON.stringify(out[k], null, 2)};`).join("\n\n")
      .replace(/^export const products = /m, "export const products: GuideProduct[] = ")
      .replace(/^export const howToChoose = /m, "export const howToChoose: HowToChooseSection[] = ");
    fs.writeFileSync(file,
      `// Light editorial pass for The Office Journal (scripts/editorial/light.ts).\n// Commerce fields are carried over unchanged.\nimport type { GuideProduct, HowToChooseSection } from "@/components/guide/RichGuidePage";\nexport type { GuideProduct };\n\n` + body + "\n");

    if (plural) {
      const i = reg.indexOf(`    slug: "${slug}",`);
      if (i > -1) {
        const start = reg.lastIndexOf("  {\n", i), end = reg.indexOf("\n  },", i);
        let block = reg.slice(start, end);
        block = block.replace(/\n    title: ".*?",(\n    metaTitle: ".*?",)?/, () => `\n    title: ${JSON.stringify(out.guideTitle)},\n    metaTitle: ${JSON.stringify(out.metaTitle)},`);
        block = block.replace(/\n    description: ".*?",/, () => `\n    description: ${JSON.stringify(out.metaDescription)},`);
        reg = reg.slice(0, start) + block + reg.slice(end);
      }
      const lowerP = plural.replace(/\b([A-Z][a-z]+)\b/g, (w) => w.toLowerCase());
      const dek = `We looked at ${n} ${lowerP} side by side, with the trade-offs that separate them and who each one suits.`;
      if (!deks.includes(`"${slug}":`)) deks = deks.replace(/\n};\s*$/, `\n  ${JSON.stringify(slug)}:\n    ${JSON.stringify(dek)},\n};\n`);
    }
    fs.writeFileSync(`scripts/editorial/rewrites/${slug}.json`, JSON.stringify({ light: true }) + "\n");
    done.push(slug);
  }
  fs.writeFileSync("data/guides.ts", reg);
  fs.writeFileSync("data/guide-deks.ts", deks);
  fs.appendFileSync("scripts/editorial/light-done.txt", done.join("\n") + (done.length ? "\n" : ""));
  console.log("light pass:", done.length);
}
if (process.argv[1]?.endsWith("light.ts")) main().catch((e) => { console.error(e); process.exit(1); });
