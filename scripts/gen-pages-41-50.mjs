import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const guides = [
  {
    slug: "best-bamboo-standing-desk",
    title: "Best Bamboo Standing Desks",
    importPath: "@/data/guides/best-bamboo-standing-desk",
    searchQuery: "bamboo+standing+desk+electric+FSC",
    aboutThings: ["Bamboo Standing Desk", "FSC Certified Desk", "Electric Height Adjustable Desk"],
    unitLabel: "desks",
    intro: [
      "A bamboo standing desk replaces MDF or laminate with FSC-certified bamboo - a surface that is harder, more moisture-resistant, and grown from one of the fastest-renewing raw materials in furniture production.",
      "This guide covers eight bamboo electric standing desks ranked by FSC certification, bamboo construction (one-piece vs laminate), motor type (single vs dual), height range, and price.",
      `For bamboo desks with higher maximum height coverage for tall users, see our <a href='/guide/best-standing-desk-for-tall-person' className='text-brand hover:underline'>best standing desks for tall people</a> guide.`,
    ],
  },
  {
    slug: "best-standing-desk-for-tall-person",
    title: "Best Standing Desks for Tall People",
    importPath: "@/data/guides/best-standing-desk-for-tall-person",
    searchQuery: "standing+desk+tall+person+50+inch+height",
    aboutThings: ["Standing Desk for Tall Person", "High Standing Desk", "Electric Height Adjustable Desk"],
    unitLabel: "desks",
    intro: [
      "A standing desk for tall people needs a maximum height of at least 50 inches to reach ergonomic standing angles for users 6'2\" and above - most standard desks cap at 47 to 48 inches.",
      "This guide covers eight standing desks for tall users ranked by maximum height (50 to 52 inches), motor stage count (2-stage vs 3-stage), surface width, and price.",
      `If you are tall and also need a chair sized for your proportions, see our <a href='/guide/best-office-chair-for-tall-person' className='text-brand hover:underline'>best office chairs for tall people</a> guide.`,
    ],
  },
  {
    slug: "best-office-chair-for-tall-person",
    title: "Best Office Chairs for Tall People",
    importPath: "@/data/guides/best-office-chair-for-tall-person",
    searchQuery: "office+chair+tall+person+high+seat",
    aboutThings: ["Office Chair for Tall Person", "High Seat Office Chair", "Ergonomic Chair for Tall Users"],
    unitLabel: "chairs",
    intro: [
      "An office chair for tall people needs a seat height range reaching 19 to 21 inches minimum, a back panel tall enough to support the shoulder blade area, and armrests that adjust high enough for extended arm positions.",
      "This guide covers eight office chairs for tall users ranked by seat height maximum, back height, lumbar position adjustability, and price - from budget under $250 to premium ergonomic options.",
      `If you also use a standing desk, see our <a href='/guide/best-standing-desk-for-tall-person' className='text-brand hover:underline'>best standing desks for tall people</a> guide to pair the right desk with your chair.`,
    ],
  },
  {
    slug: "best-office-chair-for-short-people",
    title: "Best Office Chairs for Short People",
    importPath: "@/data/guides/best-office-chair-for-short-people",
    searchQuery: "office+chair+short+person+low+seat+height",
    aboutThings: ["Office Chair for Short People", "Low Seat Office Chair", "Ergonomic Chair for Petite Users"],
    unitLabel: "chairs",
    intro: [
      "An office chair for short people needs a seat height minimum of 16 inches or lower to allow feet to rest flat on the floor with knees at 90 degrees - standard chairs that start at 17 to 18 inches leave short users sitting too high.",
      "This guide covers eight office chairs for short users ranked by minimum seat height, seat depth adjustability for shorter thighs, lumbar height configurability, and price.",
      `For chairs with the smallest purposefully sized seat pan for short frames, see our <a href='/guide/best-office-chair-under-300' className='text-brand hover:underline'>best office chairs under $300</a> guide for budget options that also fit shorter users.`,
    ],
  },
  {
    slug: "best-leather-office-chair",
    title: "Best Leather Office Chairs",
    importPath: "@/data/guides/best-leather-office-chair",
    searchQuery: "leather+office+chair+genuine+PU+ergonomic",
    aboutThings: ["Leather Office Chair", "Genuine Leather Chair", "Executive Leather Chair"],
    unitLabel: "chairs",
    intro: [
      "A leather office chair delivers a professional aesthetic that mesh chairs cannot replicate - the material type (genuine, PU, or bonded leather) determines how long the surface holds up over years of daily use.",
      "This guide covers eight leather office chairs ranked by leather type (genuine vs PU), ergonomic adjustability, reclining features, and price - from budget tufted options under $190 to premium Steelcase genuine leather.",
      `For mesh chairs that prioritize breathability over aesthetics, see our <a href='/guide/best-mesh-office-chair' className='text-brand hover:underline'>best mesh office chairs</a> guide.`,
    ],
  },
  {
    slug: "best-office-chair-for-back-pain",
    title: "Best Office Chairs for Back Pain",
    importPath: "@/data/guides/best-office-chair-for-back-pain",
    searchQuery: "office+chair+back+pain+lumbar+support+ergonomic",
    aboutThings: ["Office Chair for Back Pain", "Lumbar Support Chair", "Ergonomic Chair"],
    unitLabel: "chairs",
    intro: [
      "An office chair for back pain relief needs adjustable lumbar height (not just depth), correct seat depth to support proper pelvic tilt, and a dynamic mechanism that allows micro-movements rather than locking you in one posture.",
      "This guide covers eight office chairs for back pain ranked by lumbar adjustability, back mechanism design, seat depth, and price - from budget under $280 to clinically-informed Herman Miller and HAG Capisco designs.",
      `If sciatica or disc compression is the specific concern, see our <a href='/guide/best-executive-office-chair' className='text-brand hover:underline'>executive office chairs</a> guide for saddle and coccyx cutout options.`,
    ],
  },
  {
    slug: "best-executive-office-chair",
    title: "Best Executive Office Chairs",
    importPath: "@/data/guides/best-executive-office-chair",
    searchQuery: "executive+office+chair+leather+high+back",
    aboutThings: ["Executive Office Chair", "High Back Office Chair", "Leather Executive Chair"],
    unitLabel: "chairs",
    intro: [
      "An executive office chair balances professional visual profile with ergonomic support - the best options deliver both a high-back leather aesthetic that reads as authoritative and adjustability sufficient for 6 to 8-hour workdays.",
      "This guide covers eight executive office chairs ranked by leather type, ergonomic adjustability, headrest, and price - from the classic BOSS tufted leather under $350 to the Steelcase Gesture leather at $1,299.",
      `If you prioritize ergonomic performance over executive aesthetics, see our <a href='/guide/best-office-chair-for-back-pain' className='text-brand hover:underline'>best office chairs for back pain</a> guide instead.`,
    ],
  },
  {
    slug: "best-mesh-office-chair",
    title: "Best Mesh Office Chairs",
    importPath: "@/data/guides/best-mesh-office-chair",
    searchQuery: "mesh+office+chair+ergonomic+breathable",
    aboutThings: ["Mesh Office Chair", "Breathable Ergonomic Chair", "Mesh Back Office Chair"],
    unitLabel: "chairs",
    intro: [
      "A mesh office chair circulates air through the back and seat surface rather than trapping heat against the body - this makes mesh the practical choice for users in warm offices or those who sit 6-plus hours daily.",
      "This guide covers eight mesh office chairs ranked by mesh quality, lumbar adjustability, breathability, and price - from the Herman Miller Aeron 8Z Pellicle benchmark at $1,695 to budget mesh options under $190.",
      `For leather alternatives that provide a traditional executive look, see our <a href='/guide/best-leather-office-chair' className='text-brand hover:underline'>best leather office chairs</a> guide.`,
    ],
  },
  {
    slug: "best-office-chair-under-300",
    title: "Best Office Chairs Under $300",
    importPath: "@/data/guides/best-office-chair-under-300",
    searchQuery: "ergonomic+office+chair+under+300",
    aboutThings: ["Office Chair Under $300", "Budget Ergonomic Chair", "Affordable Office Chair"],
    unitLabel: "chairs",
    intro: [
      "A good ergonomic office chair under $300 should include adjustable lumbar height (not just depth), a seat height range that fits your body, and a warranty of at least 3 years - all three are achievable at this budget.",
      "This guide covers eight office chairs under $300 ranked by adjustability, warranty length, mesh vs padded construction, and price - from the Branch Ergonomic at $299 with a 7-year warranty to the Hbada white mesh under $190.",
      `If you are looking to step up the quality, see our <a href='/guide/best-office-chair-under-500' className='text-brand hover:underline'>best office chairs under $500</a> guide for mid-range options.`,
    ],
  },
  {
    slug: "best-office-chair-under-500",
    title: "Best Office Chairs Under $500",
    importPath: "@/data/guides/best-office-chair-under-500",
    searchQuery: "ergonomic+office+chair+under+500+mid+range",
    aboutThings: ["Office Chair Under $500", "Mid-Range Ergonomic Chair", "Office Chair"],
    unitLabel: "chairs",
    intro: [
      "An office chair under $500 sits at the upper boundary of the mid-range tier - you can get full ergonomic adjustability, quality mesh, and 5 to 7-year warranties without crossing into the $1,000-plus premium brand territory.",
      "This guide covers eight office chairs under $500 ranked by adjustment axis count, warranty, leather vs mesh, and user-size specificity - from the Branch Tall at $499 with a 7-year warranty to the HON Ignition 2.0 in genuine leather at $449.",
      `For budget options under $300, see our <a href='/guide/best-office-chair-under-300' className='text-brand hover:underline'>best office chairs under $300</a> guide.`,
    ],
  },
];

const BASE_DIR = "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\app\\(site)\\guide";

for (const guide of guides) {
  const dir = join(BASE_DIR, guide.slug);
  mkdirSync(dir, { recursive: true });

  const content = `import type { Metadata } from "next";
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
} from "${guide.importPath}";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/guide/${guide.slug}",
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
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-ink-secondary font-medium">
                  {spec}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">About this pick</p>
              {product.description.split("\\n\\n").map((para, i) => (
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

export default async function Page() {
  const guide = await getPublicGuideBySlug("${guide.slug}");
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
    mainEntityOfPage: { "@type": "WebPage", "@id": \`\${SITE_URL}/guide/${guide.slug}\` },
    about: ${JSON.stringify(guide.aboutThings.map(n => ({ "@type": "Thing", name: n })))},
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: \`\${SITE_URL}/guide\` },
      { "@type": "ListItem", position: 3, name: "${guide.title}", item: \`\${SITE_URL}/guide/${guide.slug}\` },
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
      url: \`\${SITE_URL}/guide/${guide.slug}#\${p.id}\`,
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
          <span className="text-ink">${guide.title}</span>
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
              {products.length} ${guide.unitLabel} evaluated
            </div>
          </div>
        </header>

        <div className="mb-8 p-4 rounded-xl bg-bg border border-border text-xs text-ink-secondary">
          <strong className="text-ink">Quick note:</strong> This page contains affiliate links. If you buy through our links, we may earn a small commission at no extra cost to you. As an Amazon Associate, DeskFinds earns from qualifying purchases.{" "}
          <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:underline">Affiliate disclosure</Link>.
        </div>

        <div className="rounded-2xl overflow-hidden border border-border mb-10 bg-bg">
          <Image src={heroImg} alt="${guide.title}" width={900} height={420} className="w-full object-cover max-h-[420px]" priority unoptimized />
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
          ${guide.intro.map(p => `<p>${p}</p>`).join("\n          ")}
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
          <a href={\`https://www.amazon.com/s?k=${guide.searchQuery}&tag=theofficejournal-20\`} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors" style={{ color: "#FF9900" }}>
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

  writeFileSync(join(dir, "page.tsx"), content, "utf8");
  console.log(`Created: app/(site)/guide/${guide.slug}/page.tsx`);
}

console.log("All 10 page.tsx files created.");
