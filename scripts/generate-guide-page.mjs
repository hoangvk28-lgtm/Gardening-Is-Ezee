/**
 * Deterministically generates app/(site)/guide/<slug>/page.tsx from a
 * data/guides/<slug>.ts file, following the exact template established by
 * app/(site)/guide/best-corner-standing-desk/page.tsx.
 *
 * The data file must export: guideSlug, guideTitle, metaTitle, metaDescription,
 * lastUpdated, readTime, heroImage, products, buyingCriteria, howWeEvaluated,
 * howToChoose, faq, relatedGuides, mainKeyword, introParagraphs (string[], 2-3
 * sentences).
 *
 * Two advisory sections render AFTER the individual product reviews and BEFORE the
 * FAQ section, in this order:
 *
 * 1. howWeEvaluated: { title: string; description: string }[] — 4-5 entries, a card
 *    grid titled "How We Evaluated These X", explaining the guide-specific scoring
 *    methodology (e.g. Stability, Adjustability, Build quality, Device compatibility,
 *    Value for price for a tablet-stand guide). Category-specific, not generic filler.
 *
 * 2. howToChoose: a deep, multi-subsection "How to Choose the Right X" advisory block.
 *    Each entry is one subsection with a subheading plus an optional intro paragraph,
 *    an optional table, an optional 2-col card grid, and an optional closing note:
 *      { subheading: string; intro?: string;
 *        table?: { headers: string[]; rows: string[][] };
 *        cards?: { label: string; text: string }[]; note?: string }[]
 *    Model this on scenario-based tables that map a buyer situation directly to a
 *    named pick (e.g. "By Sitting Duration" -> daily hours -> which pick to buy;
 *    "Chair Height vs Your Height" -> a measurement -> which picks fit). 4-6
 *    subsections per guide is the target depth — this is the guide's primary
 *    E-E-A-T / content-gap section.
 *
 * Both are required as of 2026-07-18 — do not omit either, even if short.
 *
 * Usage:
 *   node scripts/generate-guide-page.mjs best-tv-stand-white
 *   node scripts/generate-guide-page.mjs best-tv-stand-white best-tv-stand-black ...
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function extractStringConst(content, name) {
  const re = new RegExp(`export const ${name}\\s*=\\s*(?:\`([^\`]*)\`|"((?:[^"\\\\]|\\\\.)*)")`, "s");
  const m = content.match(re);
  if (!m) return null;
  const raw = m[1] ?? m[2];
  return raw.replace(/\\"/g, '"').replace(/\\n/g, "\n");
}

function extractArrayLength(content, name) {
  const re = new RegExp(`export const ${name}[^=]*=\\s*\\[`, "s");
  const m = content.match(re);
  if (!m) return 0;
  let depth = 1;
  let i = m.index + m[0].length;
  let count = content[i] === "]" ? 0 : 1;
  while (depth > 0 && i < content.length) {
    i++;
    if (content[i] === "[") depth++;
    else if (content[i] === "]") depth--;
  }
  return null; // not used, we import the module instead for arrays
}

function toBreadcrumbTitle(guideTitle) {
  return guideTitle.replace(/^\d+\s+/, "").replace(/\s+in\s+2026$/i, "");
}

function toAmazonSearchQuery(mainKeyword, guideSlug) {
  const kw = mainKeyword || guideSlug.replace(/^best-/, "").replace(/-/g, " ");
  return kw.replace(/\s+/g, "+");
}

// Singularizes a breadcrumb-style title's trailing plural product noun for use in
// "N Criteria to Look For Before Buying a ___" and "How We Evaluated These ___" headings.
// Falls back to the first noun-ish token if no simple plural is detected.
function toProductNounSingular(breadcrumbTitle) {
  const words = breadcrumbTitle.replace(/^Best\s+/i, "").trim();
  if (/ies$/i.test(words)) return words.replace(/ies$/i, "y");
  if (/ches$|shes$|xes$|sses$/i.test(words)) return words.replace(/es$/i, "");
  if (/s$/i.test(words) && !/ss$/i.test(words)) return words.replace(/s$/i, "");
  return words;
}

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error("Usage: node scripts/generate-guide-page.mjs <slug> [<slug> ...]");
    process.exit(1);
  }

  for (const slug of slugs) {
    const dataPath = resolve(ROOT, "data", "guides", `${slug}.ts`);
    if (!existsSync(dataPath)) {
      console.error(`✗ ${slug}: data file not found at ${dataPath}`);
      continue;
    }
    const content = readFileSync(dataPath, "utf8");

    const guideTitle = extractStringConst(content, "guideTitle");
    const metaDescription = extractStringConst(content, "metaDescription");
    const mainKeyword = extractStringConst(content, "mainKeyword");
    const introParagraphsRaw = content.match(/export const introParagraphs[^=]*=\s*\[([\s\S]*?)\n\];/);

    if (!guideTitle) {
      console.error(`✗ ${slug}: could not parse guideTitle — skipping`);
      continue;
    }

    // This template unconditionally imports howWeEvaluated/howToChoose/buyingCriteria.
    // Legacy guides created before the 2026-07-18 template revision don't export these
    // fields, so generating a page for them would produce a page.tsx with a broken
    // import and fail the build. Skip rather than emit unbuildable output.
    const requiredExports = ["howWeEvaluated", "howToChoose", "buyingCriteria"];
    const missingExports = requiredExports.filter(
      (name) => !new RegExp(`export const ${name}\\b`).test(content)
    );
    if (missingExports.length > 0) {
      console.error(`✗ ${slug}: missing required export(s) [${missingExports.join(", ")}] — skipping (legacy guide, needs backfill first)`);
      continue;
    }

    let introParagraphs = [];
    if (introParagraphsRaw) {
      // crude but reliable extraction of double-quoted or template strings in the array
      const items = introParagraphsRaw[1].match(/(?:"(?:[^"\\]|\\.)*"|`[^`]*`)/g) || [];
      introParagraphs = items.map((s) =>
        s.startsWith("`")
          ? s.slice(1, -1)
          : JSON.parse(s)
      );
    }
    if (introParagraphs.length === 0) {
      introParagraphs = [
        `This guide covers the top picks for ${mainKeyword || guideTitle.toLowerCase()}, ranked by real product specs, weight capacity, and buyer feedback.`,
      ];
    }

    const breadcrumbTitle = toBreadcrumbTitle(guideTitle);
    const amazonQuery = toAmazonSearchQuery(mainKeyword, slug);
    const pascalSchemaName = breadcrumbTitle;
    const productNoun = toProductNounSingular(breadcrumbTitle);
    const productNounPlural = breadcrumbTitle.replace(/^Best\s+/i, "").trim();

    const introBlock = introParagraphs.map((p) => `          <p>${p}</p>`).join("\n");

    const page = `import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { AtAGlance } from "@/components/product/AtAGlance";
import {
  guideTitle,
  metaTitle,
  metaDescription,
  lastUpdated,
  readTime,
  heroImage as fallbackHeroImage,
  products,
  faq,
  relatedGuides,
  buyingCriteria,
  howWeEvaluated,
  howToChoose,
  type GuideProduct,
} from "@/data/guides/${slug}";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/guide/${slug}",
  image: fallbackHeroImage,
  type: "article",
});

function ProductSection({ product }: { product: GuideProduct }) {
  return (
    <section id={product.id} className="mb-14 scroll-mt-20">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-brand shrink-0">
          {product.badge}
        </span>
        <h2 className="text-2xl font-bold text-ink tracking-tight min-w-0 break-words">
          {product.name}
        </h2>
      </div>
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-card">
        <div className="flex flex-col sm:flex-row gap-5 p-5">
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 flex items-center justify-center w-full sm:w-60 h-52 rounded-xl border border-border bg-gray-50 overflow-hidden hover:opacity-90 transition-opacity"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={220}
              height={200}
              className="object-cover w-full h-full"
              unoptimized
            />
          </a>
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {product.specs.map((spec, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-ink-secondary font-medium">
                  {spec}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">About this pick</p>
              {product.description.split("\\n\\n").map((para, i) => (
                <p key={i} className={"text-sm text-ink-secondary leading-relaxed indent-6 " + (i > 0 ? "mt-2" : "")}>
                  {para}
                </p>
              ))}
            </div>
            <p className="text-xs text-ink-muted">
              <span className="font-semibold text-ink">Best for:</span>{" "}
              {product.bestFor}
            </p>
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity w-fit mt-auto"
              style={{ background: "#FF9900" }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z" />
              </svg>
              Check price on Amazon
            </a>
          </div>
        </div>
        <div className="border-t border-border grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cta mb-3">Pros</p>
            <ul className="space-y-1.5">
              {product.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                  <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-cta-light text-cta flex items-center justify-center shrink-0 font-bold text-[9px]">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-dark mb-3">Cons</p>
            <ul className="space-y-1.5">
              {product.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                  <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0 font-bold text-[9px]">&minus;</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  const heroImg = fallbackHeroImage;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guideTitle,
    description: metaDescription,
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    author: { "@type": "Person", name: "Jamie Cole", url: \`\${SITE_URL}/author/jamie-cole\` },
    publisher: { "@type": "Organization", name: "DeskFinds", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": \`\${SITE_URL}/guide/${slug}\` },
    about: [{"@type":"Thing","name":"${pascalSchemaName}"}],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: \`\${SITE_URL}/guide\` },
      { "@type": "ListItem", position: 3, name: "${breadcrumbTitle}", item: \`\${SITE_URL}/guide/${slug}\` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guideTitle,
    description: metaDescription,
    numberOfItems: products.length,
    itemListElement: products.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      name: \`\${p.name} - \${p.badge}\`,
      url: \`\${SITE_URL}/guide/${slug}#\${p.id}\`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Container className="py-12 max-w-4xl">
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6">
          <Link prefetch={false} href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link prefetch={false} href="/guide" className="hover:text-brand transition-colors">Buying Guides</Link>
          <span>/</span>
          <span className="text-ink">${breadcrumbTitle}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Buying Guide</span>
            <span className="text-ink-muted">&middot;</span>
            <span className="text-xs text-ink-muted">{readTime} read</span>
            <span className="text-ink-muted">&middot;</span>
            <span className="text-xs text-ink-muted">Updated July 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-tight mb-4">
            {guideTitle}
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed max-w-3xl">
            {metaDescription}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <div className="w-7 h-7 rounded-full bg-brand-muted flex items-center justify-center">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span>Jamie Cole, Lead Product Researcher</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {products.length} options evaluated
            </div>
          </div>
        </header>

        <div className="mb-8 p-4 rounded-xl bg-bg border border-border text-xs text-ink-secondary">
          <strong className="text-ink">Quick note:</strong> We may earn a commission when you buy through Amazon links. This guide is based on product specs, buyer feedback, use cases, and comparison criteria, not paid placement.{" "}
          <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:underline">Affiliate disclosure</Link>.
        </div>

        <div className="rounded-2xl overflow-hidden border border-border mb-10 bg-white h-56 sm:h-64 md:hidden flex items-center justify-center p-3">
          <Image src={heroImg} alt="${breadcrumbTitle}" width={900} height={420} className="w-full h-full object-contain" priority unoptimized />
        </div>
        <div
          className="hidden md:grid rounded-2xl overflow-hidden border border-border mb-10 gap-px bg-border"
          style={{ gridTemplateColumns: \`repeat(\${products.length}, minmax(0,1fr))\` }}
        >
          {products.map((product, i) => (
            <div key={product.id} className="h-56 bg-white flex items-center justify-center p-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-contain"
                priority={i === 0}
                unoptimized
              />
            </div>
          ))}
        </div>

        <AtAGlance
          items={products.map((product) => ({
            rank: product.rank,
            badge: product.badge,
            name: product.name,
            brand: "",
            imageUrl: product.imageUrl,
            affiliateUrl: product.amazonUrl,
            price: "",
            pros: product.pros.map((text) => ({ text })),
            cons: product.cons.map((text) => ({ text, severity: "minor" as const })),
            anchorId: product.id,
          }))}
        />

        <section className="mb-10 space-y-4 text-base text-ink-secondary leading-relaxed">
${introBlock}
        </section>

        {buyingCriteria.length > 0 && (
          <section className="mb-12 p-6 rounded-2xl border border-border bg-white">
            <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">{buyingCriteria.length} Criteria to Look For Before Buying a ${productNoun}</h2>
            <p className="text-sm text-ink-muted mb-5">Key buying criteria so you get the right fit the first time.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {buyingCriteria.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-bg">
                  <p className="text-sm font-bold text-ink mb-1.5">{item.criterion}</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav className="mb-12 p-4 rounded-xl bg-bg border border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">Jump to pick</p>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <a key={p.id} href={\`#\${p.id}\`} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-border text-ink-secondary hover:text-brand hover:border-brand transition-colors">
                #{p.rank} {p.badge}
              </a>
            ))}
            <a href="#faq" className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-border text-ink-secondary hover:text-brand hover:border-brand transition-colors">FAQ</a>
          </div>
        </nav>

        <h2 className="text-2xl font-bold text-ink mb-8 tracking-tight">{guideTitle}</h2>

        {products.map((product) => (
          <ProductSection key={product.id} product={product} />
        ))}

        {howWeEvaluated.length > 0 && (
          <section className="mb-12 p-6 rounded-2xl border border-border bg-white">
            <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">How We Evaluated These ${productNounPlural}</h2>
            <p className="text-sm text-ink-muted mb-5">Each pick was assessed across {howWeEvaluated.length} criteria weighted for real-world use.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {howWeEvaluated.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-bg">
                  <p className="text-sm font-bold text-ink mb-1.5">{item.title}</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {howToChoose.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-ink mb-6 tracking-tight">How to Choose the Right ${productNounPlural}</h2>
            <div className="space-y-8">
              {howToChoose.map((sub, i) => (
                <div key={i}>
                  <h3 className="text-lg font-bold text-ink mb-3">{sub.subheading}</h3>
                  {sub.intro && (
                    <p className="text-sm text-ink-secondary leading-relaxed mb-3">{sub.intro}</p>
                  )}
                  {sub.table && (
                    <div className="overflow-x-auto rounded-xl border border-border mb-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-brand text-white">
                            {sub.table.headers.map((h, hi) => (
                              <th key={hi} className="text-left px-4 py-3 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sub.table.rows.map((row, ri) => (
                            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-bg"}>
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 text-ink-secondary text-xs">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {sub.cards && (
                    <div className="grid sm:grid-cols-2 gap-3 mb-2">
                      {sub.cards.map((c, ci) => (
                        <div key={ci} className="p-4 rounded-xl border border-border bg-bg">
                          <p className="text-sm font-bold text-ink mb-1">{c.label}</p>
                          <p className="text-sm text-ink-secondary leading-relaxed">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {sub.note && (
                    <p className="text-xs text-ink-muted leading-relaxed">{sub.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="faq" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold text-ink mb-6 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-white">
                <p className="font-bold text-ink text-sm mb-2">{item.q}</p>
                <p className="text-sm text-ink-secondary leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 p-6 rounded-2xl border border-border bg-white">
          <h2 className="text-xl font-bold text-ink mb-5 tracking-tight">Bottom Line</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />
              <p className="text-sm text-ink-secondary">
                <strong className="text-ink">best overall:</strong>{" "}
                <a href={\`#\${products[0]?.id}\`} className="font-bold text-ink hover:text-brand transition-colors">{products[0]?.name}</a>
                {" "}- {products[0]?.badge.toLowerCase()} pick in this roundup.
              </p>
            </div>
            <p className="text-sm text-ink-secondary pl-5">See the full rankings above for all picks with pros, cons, and best-for summaries.</p>
          </div>
        </section>

        <section className="mb-14 p-6 rounded-2xl flex flex-col items-center text-center" style={{ background: "linear-gradient(135deg, #FF9900 0%, #e68900 100%)" }}>
          <h2 className="text-xl font-bold text-white mb-2">Browse on Amazon</h2>
          <p className="text-white/90 text-sm mb-5">All Prime-eligible options with current pricing.</p>
          <a href={\`https://www.amazon.com/s?k=${amazonQuery}&tag=theofficejournal-20\`} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors" style={{ color: "#FF9900" }}>
            Shop on Amazon &rarr;
          </a>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Related Guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedGuides.map((g) => (
              <Link key={g.href} href={g.href} prefetch={false} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white hover:border-brand transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-brand-muted flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-ink text-sm group-hover:text-brand transition-colors">{g.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
`;

    const pageDir = resolve(ROOT, "app", "(site)", "guide", slug);
    mkdirSync(pageDir, { recursive: true });
    writeFileSync(resolve(pageDir, "page.tsx"), page, "utf8");
    console.log(`✓ ${slug}: page.tsx generated`);
  }
}

main();
