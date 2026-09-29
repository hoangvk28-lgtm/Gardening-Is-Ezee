import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const guides = [
  {
    slug: "best-corner-standing-desk",
    title: "Best Corner Standing Desks",
    importPath: "@/data/guides/best-corner-standing-desk",
    searchQuery: "corner+L-shaped+standing+desk",
    aboutThings: ["Corner Standing Desk", "L-Shaped Standing Desk", "Electric Height Adjustable Desk"],
    intro: [
      "A corner standing desk maximizes your available wall space by using two walls simultaneously, giving you more surface area than a straight desk of the same listed width.",
      "This guide covers eight L-shaped electric standing desks ranked by frame stability, motor configuration, desktop size, and price, from budget options under $200 to heavy-duty triple-motor frames.",
      `For a straight standing desk instead of an L-shape, see our <a href='/guide/best-standing-desk-for-dual-monitors' className='text-brand hover:underline'>best standing desks for dual monitors</a> guide.`,
    ],
  },
  {
    slug: "best-standing-desks-for-gaming",
    title: "Best Standing Desks for Gaming",
    importPath: "@/data/guides/best-standing-desks-for-gaming",
    searchQuery: "gaming+standing+desk+electric",
    aboutThings: ["Gaming Desk", "Standing Desk", "Electric Height Adjustable Desk"],
    intro: [
      "A standing desk for gaming lets you alternate between sitting and standing during long sessions, reducing fatigue and back strain without changing your gaming position.",
      "This guide covers eight standing desks for gaming ranked by shape (wing, L-shaped, straight), RGB features, weight capacity, and price, from budget options under $130 to premium $1,000+ battlestation desks.",
      `For the best L-shaped corner gaming setup, see our <a href='/guide/best-corner-standing-desk' className='text-brand hover:underline'>best corner standing desks</a> guide.`,
    ],
  },
  {
    slug: "best-standing-desk-for-dual-monitors",
    title: "Best Standing Desks for Dual Monitors",
    importPath: "@/data/guides/best-standing-desk-for-dual-monitors",
    searchQuery: "standing+desk+dual+monitor+wide",
    aboutThings: ["Standing Desk", "Dual Monitor Desk", "Wide Electric Desk"],
    intro: [
      "A standing desk for dual monitors needs at least 55 inches of surface width, a stable frame that handles the combined monitor weight, and a height range that covers both your sitting and standing positions.",
      "This guide covers eight standing desks for dual monitors ranked by width (48 to 72 inches), surface depth, motor configuration, and special features like bamboo tops, risers, and drawers.",
      `For the widest possible surface in an L-shaped format, see our <a href='/guide/best-corner-standing-desk' className='text-brand hover:underline'>best corner standing desks</a> guide.`,
    ],
  },
  {
    slug: "best-glass-standing-desk",
    title: "Best Glass Standing Desks",
    importPath: "@/data/guides/best-glass-standing-desk",
    searchQuery: "glass+standing+desk+electric+tempered",
    aboutThings: ["Glass Standing Desk", "Tempered Glass Desk", "Electric Height Adjustable Desk"],
    intro: [
      "A glass standing desk adds a clean, open aesthetic to a home office while providing a smooth working surface. Tempered safety glass is the standard for all desks in this category.",
      "This guide covers eight glass standing desks ranked by glass type (clear, frosted, dry-erase white), built-in features (drawer, USB charging, monitor riser, RGB), and price.",
      `For a solid wood alternative to glass, see our <a href='/guide/best-walnut-standing-desk' className='text-brand hover:underline'>best walnut standing desks</a> guide.`,
    ],
  },
  {
    slug: "best-standing-desk-under-1000",
    title: "Best Standing Desks Under $1000",
    importPath: "@/data/guides/best-standing-desk-under-1000",
    searchQuery: "best+standing+desk+under+1000",
    aboutThings: ["Standing Desk", "Electric Height Adjustable Desk", "Bamboo Standing Desk"],
    intro: [
      "The under $1000 range covers everything from reliable budget desks under $250 to commercial-grade BIFMA-certified options and premium bamboo frames approaching the $1000 ceiling.",
      "This guide covers eight standing desks under $1000 ranked by warranty, motor quality, surface material, and certification, starting at $208 and ending just under $1000.",
      `For the best value desks in a specific narrow range, see our <a href='/guide/best-standing-desk-under-200' className='text-brand hover:underline'>best standing desks under $200</a> guide.`,
    ],
  },
  {
    slug: "best-standing-desk-48-inch",
    title: "Best 48 Inch Standing Desks",
    importPath: "@/data/guides/best-standing-desk-48-inch",
    searchQuery: "48+inch+standing+desk+electric",
    aboutThings: ["48 Inch Standing Desk", "Compact Standing Desk", "Electric Height Adjustable Desk"],
    intro: [
      "A 48-inch standing desk is the most popular compact size, fitting comfortably in most bedrooms, studios, and small home offices while handling a single monitor or laptop plus peripherals.",
      "This guide covers eight 48-inch electric standing desks ranked by price, special features (drawer, power strip, USB ports), depth (24 vs 30 inch), and brand warranty.",
      `For a wider surface in the same price range, see our <a href='/guide/best-standing-desk-for-dual-monitors' className='text-brand hover:underline'>best standing desks for dual monitors</a> guide (55 to 72 inch options).`,
    ],
  },
  {
    slug: "best-walnut-standing-desk",
    title: "Best Walnut Standing Desks",
    importPath: "@/data/guides/best-walnut-standing-desk",
    searchQuery: "walnut+standing+desk+electric+black+walnut",
    aboutThings: ["Walnut Standing Desk", "Black Walnut Desk", "Electric Height Adjustable Desk"],
    intro: [
      "A walnut standing desk adds a warm executive aesthetic to a home office at a fraction of the cost of solid walnut furniture, using walnut-tone laminate over MDF that looks similar at normal viewing distance.",
      "This guide covers eight walnut standing desks ranked by walnut tone (black, dark, special), size (32 to 79 inches), special features (drawers, L-shaped, 3-stage legs), and value.",
      `For a glass surface alternative with a different aesthetic, see our <a href='/guide/best-glass-standing-desk' className='text-brand hover:underline'>best glass standing desks</a> guide.`,
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
              {products.length} desks evaluated
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

console.log("All 7 page.tsx files created.");
