// gen-pages-25-32.mjs — generates page.tsx for guides 25-32
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GUIDE_DIR = join(__dirname, "../app/(site)/guide");

const guides = [
  {
    slug: "best-walking-pads-for-standing-desks",
    importSlug: "best-walking-pads-for-standing-desks",
    fnName: "BestWalkingPadsForStandingDesksPage",
    breadcrumb: "Best Walking Pads for Standing Desks",
    heroAlt: "Best Walking Pads for Standing Desks",
    introParagraphs: [
      "A walking pad under a standing desk lets you accumulate steps and burn calories during the work day without dedicated gym time. At 1.5 mph you can type accurately and join video calls while covering 3 to 5 miles over a full work day.",
      "This guide covers eight walking pads for standing desks ranked by motor power, incline capability, noise level, and weight capacity, covering budget options under $150 and premium 2-in-1 models up to $400.",
      "For compact options suited to small apartments and tight desk spaces, see our <a href='/guide/best-compact-walking-pads-for-small-spaces' className='text-brand hover:underline'>best compact walking pads for small spaces</a> guide.",
    ],
    evaluatedCount: "8 walking pads evaluated",
    amazonSearch: "walking+pad+for+standing+desk",
    aboutSchema: [
      { "@type": "Thing", name: "Walking Pad" },
      { "@type": "Thing", name: "Under-Desk Treadmill" },
      { "@type": "Thing", name: "Standing Desk Accessories" },
    ],
  },
  {
    slug: "best-compact-walking-pads-for-small-spaces",
    importSlug: "best-compact-walking-pads-for-small-spaces",
    fnName: "BestCompactWalkingPadsPage",
    breadcrumb: "Best Compact Walking Pads for Small Spaces",
    heroAlt: "Best Compact Walking Pads for Small Spaces",
    introParagraphs: [
      "Compact walking pads solve the space problem of standard treadmills by folding to 4 to 6 inches thin for storage under beds and sofas, or folding in half for closet storage. Many measure under 35 inches long, fitting under desks in alcoves and tight spaces.",
      "This guide covers eight compact walking pads ranked by folded profile, belt width, noise level, and value for apartment users and small home offices.",
      "For options specifically designed for use under standing desks during work, see our <a href='/guide/best-walking-pads-for-standing-desks' className='text-brand hover:underline'>best walking pads for standing desks</a> guide.",
    ],
    evaluatedCount: "8 compact walking pads evaluated",
    amazonSearch: "compact+walking+pad+small+spaces",
    aboutSchema: [
      { "@type": "Thing", name: "Compact Walking Pad" },
      { "@type": "Thing", name: "Under-Desk Treadmill" },
      { "@type": "Thing", name: "Small Space Fitness" },
    ],
  },
  {
    slug: "best-walking-pads-for-home-offices",
    importSlug: "best-walking-pads-for-home-offices",
    fnName: "BestWalkingPadsForHomeOfficesPage",
    breadcrumb: "Best Walking Pads for Home Offices",
    heroAlt: "Best Walking Pads for Home Offices",
    introParagraphs: [
      "Home-office walking pads face different requirements than gym treadmills: quiet enough for video calls, compact enough for room aesthetics, and reliable enough for daily use without maintenance interruptions.",
      "This guide covers eight walking pads for home offices ranked by noise level, daily-use durability, app connectivity, and value, including options under $100 and premium quiet-motor models.",
      "For incline-specific options that maximize calorie burn during desk sessions, see our <a href='/guide/best-walking-pads-with-incline' className='text-brand hover:underline'>best walking pads with incline</a> guide.",
    ],
    evaluatedCount: "8 home office walking pads evaluated",
    amazonSearch: "walking+pad+home+office",
    aboutSchema: [
      { "@type": "Thing", name: "Walking Pad" },
      { "@type": "Thing", name: "Home Office Equipment" },
      { "@type": "Thing", name: "Under-Desk Treadmill" },
    ],
  },
  {
    slug: "best-walking-pads-with-incline",
    importSlug: "best-walking-pads-with-incline",
    fnName: "BestWalkingPadsWithInclinePage",
    breadcrumb: "Best Walking Pads with Incline",
    heroAlt: "Best Walking Pads with Incline",
    introParagraphs: [
      "Incline walking pads burn significantly more calories than flat-belt alternatives at the same walking speed. A 12% incline at 2 mph burns approximately 60% more calories per hour than flat walking, without requiring faster walking that disrupts concentration or typing.",
      "This guide covers eight incline walking pads ranked by maximum incline grade, incline levels, motor power, and noise level, including auto-incline and manual-incline options.",
      "For general walking pad recommendations without incline as a primary filter, see our <a href='/guide/best-walking-pads' className='text-brand hover:underline'>best walking pads</a> guide.",
    ],
    evaluatedCount: "8 incline walking pads evaluated",
    amazonSearch: "walking+pad+with+incline",
    aboutSchema: [
      { "@type": "Thing", name: "Incline Walking Pad" },
      { "@type": "Thing", name: "Under-Desk Treadmill" },
      { "@type": "Thing", name: "Calorie Burn Exercise" },
    ],
  },
  {
    slug: "best-walking-pads",
    importSlug: "best-walking-pads",
    fnName: "BestWalkingPadsPage",
    breadcrumb: "Best Walking Pads",
    heroAlt: "Best Walking Pads",
    introParagraphs: [
      "Walking pads are compact under-desk treadmills designed for 1 to 4 mph walking during desk work or light cardio. They fold flat for storage under furniture, operate quietly enough for home and office use, and require minimal maintenance compared to full-size treadmills.",
      "This guide covers eight top-rated walking pads ranked by buyer feedback, noise level, weight capacity, incline capability, and value across all budgets from $89 to $400.",
      "For walking pads with specific incline capability, see our <a href='/guide/best-walking-pads-with-incline' className='text-brand hover:underline'>best walking pads with incline</a> guide.",
    ],
    evaluatedCount: "8 walking pads evaluated",
    amazonSearch: "best+walking+pad",
    aboutSchema: [
      { "@type": "Thing", name: "Walking Pad" },
      { "@type": "Thing", name: "Under-Desk Treadmill" },
      { "@type": "Thing", name: "Compact Treadmill" },
    ],
  },
  {
    slug: "best-cable-management-boxes-for-desks",
    importSlug: "best-cable-management-boxes-for-desks",
    fnName: "BestCableManagementBoxesForDesksPage",
    breadcrumb: "Best Cable Management Boxes for Desks",
    heroAlt: "Best Cable Management Boxes for Desks",
    introParagraphs: [
      "Cable management boxes hide power strips, surge protectors, and cable clusters from view, turning the tangled wire pile behind a desk into a clean organized unit. They work on desk surfaces, floors, and under desk surfaces via clamp-mount trays.",
      "This guide covers eight cable management boxes for desks ranked by size, design, safety features, and value, including on-desk boxes and under-desk clamp trays.",
      "For wood-aesthetic cable management options, see our <a href='/guide/best-wood-cable-management-boxes' className='text-brand hover:underline'>best wood cable management boxes</a> guide.",
    ],
    evaluatedCount: "8 cable management boxes evaluated",
    amazonSearch: "cable+management+box+for+desk",
    aboutSchema: [
      { "@type": "Thing", name: "Cable Management Box" },
      { "@type": "Thing", name: "Desk Organization" },
      { "@type": "Thing", name: "Power Strip Organizer" },
    ],
  },
  {
    slug: "best-wood-cable-management-boxes",
    importSlug: "best-wood-cable-management-boxes",
    fnName: "BestWoodCableManagementBoxesPage",
    breadcrumb: "Best Wood Cable Management Boxes",
    heroAlt: "Best Wood Cable Management Boxes",
    introParagraphs: [
      "Wood cable management boxes bring natural material aesthetics to desk organization, matching premium wood desks and styled home offices far better than plastic alternatives. Solid wood, bamboo, and handwoven rattan options provide distinct aesthetic profiles for different desk styles.",
      "This guide covers eight wood cable management boxes ranked by material quality, interior size, lid mechanism, and value, from budget bamboo picks to premium handcrafted mango wood.",
      "For a broader cable management comparison including plastic and under-desk tray options, see our <a href='/guide/best-cable-management-boxes' className='text-brand hover:underline'>best cable management boxes</a> guide.",
    ],
    evaluatedCount: "8 wood cable management boxes evaluated",
    amazonSearch: "wood+cable+management+box",
    aboutSchema: [
      { "@type": "Thing", name: "Wood Cable Management Box" },
      { "@type": "Thing", name: "Bamboo Cable Organizer" },
      { "@type": "Thing", name: "Desk Organization" },
    ],
  },
  {
    slug: "best-cable-management-boxes",
    importSlug: "best-cable-management-boxes",
    fnName: "BestCableManagementBoxesPage",
    breadcrumb: "Best Cable Management Boxes",
    heroAlt: "Best Cable Management Boxes",
    introParagraphs: [
      "Cable management boxes solve the most visible desk organization problem: the power strip and cable tangle that accumulates behind every desk, entertainment center, and workstation. The right box hides the clutter, protects children and pets from live cables, and integrates into the desk aesthetic rather than looking like an organizer product.",
      "This guide covers eight top-rated cable management boxes ranked by buyer feedback, size, material, safety features, and value, including plastic boxes, wood-lid options, under-desk trays, and natural rattan designs.",
      "For wood-specific recommendations, see our <a href='/guide/best-wood-cable-management-boxes' className='text-brand hover:underline'>best wood cable management boxes</a> guide.",
    ],
    evaluatedCount: "8 cable management boxes evaluated",
    amazonSearch: "best+cable+management+box",
    aboutSchema: [
      { "@type": "Thing", name: "Cable Management Box" },
      { "@type": "Thing", name: "Cord Organizer" },
      { "@type": "Thing", name: "Desk Organization" },
    ],
  },
];

function buildPage(g) {
  const importSlug = g.importSlug;
  const slug = g.slug;
  const fnName = g.fnName;
  const breadcrumb = g.breadcrumb;
  const heroAlt = g.heroAlt;
  const aboutSchemaStr = JSON.stringify(g.aboutSchema, null, 2).replace(/^/gm, "      ");
  const introParagraphsJSX = g.introParagraphs
    .map((p) => `          <p>${p}</p>`)
    .join("\n");

  return `import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { getPublicGuideBySlug } from "@/lib/public-guides";
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
  type GuideProduct,
} from "@/data/guides/${importSlug}";

export const revalidate = 86400;

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
              <span className="text-xs px-2.5 py-1 rounded-lg bg-brand-muted text-brand font-bold">
                {product.price}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-ink-secondary font-medium">
                {product.rating}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-ink-secondary font-medium">
                {product.reviews}
              </span>
              {product.specs.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-ink-secondary font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">
                About this pick
              </p>
              {product.description.split('\\n\\n').map((para, i) => (
                <p key={i} className="text-sm text-ink-secondary leading-relaxed">
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

export default async function ${fnName}() {
  const guide = await getPublicGuideBySlug("${slug}");
  const heroImg = guide?.thumbnailImage ?? guide?.heroImage ?? fallbackHeroImage;

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
    about: ${aboutSchemaStr.trim()},
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: \`\${SITE_URL}/guide\` },
      { "@type": "ListItem", position: 3, name: "${breadcrumb}", item: \`\${SITE_URL}/guide/${slug}\` },
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
          <span className="text-ink">${breadcrumb}</span>
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
              ${g.evaluatedCount}
            </div>
          </div>
        </header>

        <div className="mb-8 p-4 rounded-xl bg-bg border border-border text-xs text-ink-secondary">
          <strong className="text-ink">Quick note:</strong> This page contains affiliate links. If you buy through our links, we may earn a small commission at no extra cost to you. As an Amazon Associate, DeskFinds earns from qualifying purchases.{" "}
          <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:underline">Affiliate disclosure</Link>.
        </div>

        <div className="rounded-2xl overflow-hidden border border-border mb-10 bg-bg">
          <Image src={heroImg} alt="${heroAlt}" width={900} height={420} className="w-full object-cover max-h-[420px]" priority unoptimized />
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-ink mb-4 tracking-tight">Quick Picks</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand text-white">
                  <th className="text-left px-4 py-3 font-semibold">Pick</th>
                  <th className="text-left px-4 py-3 font-semibold">Product</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Price</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Reviews</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} className={i % 2 === 0 ? "bg-white" : "bg-bg"}>
                    <td className="px-4 py-3">
                      <a href={\`#\${product.id}\`} className="text-xs font-bold text-brand hover:underline">{product.badge}</a>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink text-xs">{product.name}</td>
                    <td className="px-4 py-3 text-ink-secondary text-xs hidden sm:table-cell">{product.price}</td>
                    <td className="px-4 py-3 text-ink-secondary text-xs hidden sm:table-cell">{product.rating}</td>
                    <td className="px-4 py-3 text-ink-secondary text-xs hidden sm:table-cell">{product.reviews}</td>
                    <td className="px-4 py-3">
                      <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="text-xs font-bold px-3 py-1.5 rounded-lg text-white whitespace-nowrap inline-block" style={{ background: "#FF9900" }}>
                        Check price
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 space-y-4 text-base text-ink-secondary leading-relaxed">
${introParagraphsJSX}
        </section>

        {buyingCriteria.length > 0 && (
          <section className="mb-12 p-6 rounded-2xl border border-border bg-white">
            <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">How to Choose the Right One</h2>
            <p className="text-sm text-ink-muted mb-5">Key buying criteria so you get the right fit the first time.</p>
            <div className="divide-y divide-border">
              {buyingCriteria.map((item, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-bold text-ink mb-1">{item.criterion}</p>
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
                {" "}- {products[0]?.rating}, {products[0]?.badge.toLowerCase()} pick in this roundup.
              </p>
            </div>
            <p className="text-sm text-ink-secondary pl-5">See the full rankings above for all eight picks with pros, cons, and best-for summaries.</p>
          </div>
        </section>

        <section className="mb-14 p-6 rounded-2xl flex flex-col items-center text-center" style={{ background: "linear-gradient(135deg, #FF9900 0%, #e68900 100%)" }}>
          <h2 className="text-xl font-bold text-white mb-2">Browse on Amazon</h2>
          <p className="text-white/90 text-sm mb-5">All Prime-eligible options with current pricing.</p>
          <a href="https://www.amazon.com/s?k=${g.amazonSearch}&tag=theofficejournal-20" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors" style={{ color: "#FF9900" }}>
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
}

for (const g of guides) {
  const dir = join(GUIDE_DIR, g.slug);
  mkdirSync(dir, { recursive: true });
  const content = buildPage(g);
  writeFileSync(join(dir, "page.tsx"), content, "utf8");
  console.log(`[${g.slug}] created page.tsx`);
}

console.log("All 8 page.tsx files generated.");
