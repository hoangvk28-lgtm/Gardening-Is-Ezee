/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Convert hand-authored /guide/<slug> pages whose data file already matches the
 * RichGuidePage shape into thin wrappers around the shared editorial template.
 * URL (/guide/<slug>), metadata source and data are unchanged. Intro copy that
 * only existed in the page JSX is carried over as introParagraphs.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/editorial/convert-literal.ts <slugs-file>
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { cleanText } from "./light";

const PAGE = (s: string) => `app/(site)/guide/${s}/page.tsx`;

(async () => {
  const candidates = fs.readFileSync(process.argv[2], "utf8").split(/\s+/).filter(Boolean);
  const compatible: string[] = [];
  for (const s of candidates) {
    const f = path.resolve("data/guides", `${s}.ts`);
    if (!fs.existsSync(f) || !fs.existsSync(PAGE(s))) continue;
    const m: any = await import(pathToFileURL(f).href);
    const p = m.products;
    const ok = Array.isArray(p) && p.length > 0 &&
      p.every((x: any) => x.id && x.name && x.amazonUrl && x.imageUrl && typeof x.description === "string" &&
        Array.isArray(x.specs) && Array.isArray(x.pros) && Array.isArray(x.cons) && x.badge !== undefined && typeof x.bestFor === "string") &&
      m.guideTitle && m.metaDescription &&
      (!m.faq || m.faq.every((q: any) => q.q && q.a)) &&
      (!m.buyingCriteria || m.buyingCriteria.every((c: any) => c.criterion && c.explanation));
    if (ok) compatible.push(s);
  }

  // Text nodes shared by many pages are template boilerplate; unique ones are page copy.
  const nodes = new Map<string, string[]>();
  const freq = new Map<string, number>();
  for (const s of compatible) {
    const t = fs.readFileSync(PAGE(s), "utf8");
    const ns = [...t.matchAll(/>([^<>{}]{50,})</g)].map((x) => x[1].replace(/\s+/g, " ").trim()).filter((x) => x.length > 50);
    nodes.set(s, ns);
    new Set(ns).forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
  }

  let converted = 0, withIntro = 0;
  for (const s of compatible) {
    const m: any = await import(pathToFileURL(path.resolve("data/guides", `${s}.ts`)).href);
    const dataSrc = fs.readFileSync(`data/guides/${s}.ts`, "utf8");
    let intro: string[] | null = null;
    if (!Array.isArray(m.introParagraphs) || m.introParagraphs.length === 0) {
      const uniq = (nodes.get(s) ?? [])
        .filter((n) => (freq.get(n) ?? 0) < 5 && !dataSrc.includes(n.slice(0, 40)) && /[.!?]$/.test(n))
        .map((n) => cleanText(n.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&")))
        .filter(Boolean);
      if (uniq.length) intro = uniq;
    }
    const page = `import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { RichGuidePage, type RichGuidePageProps } from "@/components/guide/RichGuidePage";
import * as data from "@/data/guides/${s}";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: "/guide/${s}",
  image: data.heroImage,
  type: "article",
});
${intro ? `\n// Intro copy carried over from the previous hand-authored page.\nconst introParagraphs: string[] = ${JSON.stringify(intro, null, 2)};\n` : ""}
export default function Page() {
  return <RichGuidePage slug="${s}" {...(data as unknown as Omit<RichGuidePageProps, "slug">)}${intro ? " introParagraphs={introParagraphs}" : ""} />;
}
`;
    fs.writeFileSync(PAGE(s), page);
    converted++;
    if (intro) withIntro++;
  }
  fs.writeFileSync("scripts/editorial/converted-literal.txt", compatible.join("\n") + "\n");
  console.log({ compatible: compatible.length, converted, introCarriedOver: withIntro });
})();
