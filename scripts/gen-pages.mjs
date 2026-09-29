import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = new URL("../app/(site)/guide", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const guides = [
  { slug: "best-under-desk-footrests-for-short-people", fn: "BestUnderDeskFootrestsShortPeoplePage", bc: "Best Under-Desk Footrests for Short People", about1: "Under-Desk Footrest", about2: "Ergonomics", about3: "Short User Ergonomics", count: 8, evaluated: "under-desk footrests for short people", searchQ: "under+desk+footrest+short+people", btLabel: "best overall for short users", btId: "everlasting-comfort", btName: "Everlasting Comfort Foot Rest", btVerdict: " - 22,247 reviews at 4.5 stars, memory foam with adjustable height options.", intro1: "Under-desk footrests are not one-size-fits-all products. For shorter users whose feet do not comfortably reach the floor from a standard chair, the footrest height requirement is greater than for average-height users. A footrest that provides 2 inches of lift for a 5-foot-8 user may provide insufficient lift for a 5-foot user on the same chair.", intro2: "This guide covers eight footrests selected for suitability with shorter users, evaluated for height range, adjustability, and surface dimensions appropriate for smaller feet. All picks are ranked by Amazon buyer rating and verified review count.", intro3: "For the broader under-desk footrest category without height focus, see our <Link href='/guide/best-under-desk-footrests' className='text-brand hover:underline'>best under-desk footrests</Link> guide." },
  { slug: "best-adjustable-under-desk-footrests", fn: "BestAdjustableUnderDeskFootrestsPage", bc: "Best Adjustable Under-Desk Footrests", about1: "Adjustable Footrest", about2: "Ergonomics", about3: "Height Adjustment", count: 8, evaluated: "adjustable under-desk footrests", searchQ: "adjustable+under+desk+footrest", btLabel: "best adjustable pick", btId: "huanuo-adjustable", btName: "HUANUO Under Desk Footrest", btVerdict: " - 10,825 reviews at 4.4 stars, two height settings with massage surface.", intro1: "A fixed-height footrest works well when the desk and chair height never change. For users who adjust their desk height throughout the day, share a desk with another person, or switch between a standard office chair and a drafting stool, a fixed footrest creates a different ergonomic problem every time the setup changes.", intro2: "This guide covers eight adjustable under-desk footrests ranked by Amazon buyer rating and verified review count, focusing on models with meaningful height or angle adjustment rather than fixed single-position designs.", intro3: "For the full footrest category including fixed-height options, see our <Link href='/guide/best-under-desk-footrests' className='text-brand hover:underline'>best under-desk footrests</Link> guide." },
  { slug: "best-rocking-footrests-under-desk", fn: "BestRockingFootrestsUnderDeskPage", bc: "Best Rocking Footrests Under Desk", about1: "Rocking Footrest", about2: "Ergonomics", about3: "Active Sitting", count: 8, evaluated: "rocking footrests", searchQ: "rocking+footrest+under+desk", btLabel: "best rocking pick", btId: "strongtek-wood", btName: "StrongTek Ergonomic Wood Foot Rest", btVerdict: " - 3,135 reviews at 4.7 stars, highest-rated rocking footrest.", intro1: "Static footrests reduce the fatigue of dangling feet but do not address the circulation issue that comes from holding the feet in one position for hours. Rocking footrests introduce a gentle back-and-forth movement that activates calf muscles and improves blood flow during sedentary work sessions.", intro2: "This guide covers eight rocking footrests ranked by Amazon buyer rating and verified review count, including wood balance boards, foam rockers, and three-position designs that include a flat static mode.", intro3: "For the full footrest category including non-rocking models, see our <Link href='/guide/best-under-desk-footrests' className='text-brand hover:underline'>best under-desk footrests</Link> guide." },
  { slug: "best-wooden-footrests-for-desk", fn: "BestWoodenFootrestsForDeskPage", bc: "Best Wooden Footrests for Desk", about1: "Wooden Footrest", about2: "Ergonomics", about3: "Natural Materials", count: 8, evaluated: "wooden footrests for desk", searchQ: "wooden+footrest+for+desk", btLabel: "best wood pick", btId: "strongtek-cherry", btName: "StrongTek Ergonomic Wood Foot Rest", btVerdict: " - 3,135 reviews at 4.7 stars, cherry wood rocker, highest-rated wood footrest.", intro1: "Wood footrests occupy a different position in the market than foam alternatives. The material does not compress over time, provides a firmer rocking surface, and matches the aesthetic of wood desks and natural material desk setups. The trade-off is that wood is harder underfoot, louder when rocking, and not suited for bare-foot use.", intro2: "This guide covers eight wooden footrests ranked by Amazon buyer rating and verified review count, including cherry wood rockers, lauan hardwood adjustable platforms, bamboo options, and a premium steel-roller wood rocker.", intro3: "For the full footrest category including foam and adjustable models, see our <Link href='/guide/best-under-desk-footrests' className='text-brand hover:underline'>best under-desk footrests</Link> guide." },
  { slug: "best-under-desk-footrests", fn: "BestUnderDeskFootrestsPage", bc: "Best Under-Desk Footrests", about1: "Under-Desk Footrest", about2: "Ergonomics", about3: "Seated Posture", count: 8, evaluated: "under-desk footrests", searchQ: "under+desk+footrest", btLabel: "best overall", btId: "everlasting-comfort", btName: "Everlasting Comfort Foot Rest Cushion", btVerdict: " - 22,247 reviews at 4.5 stars, most reviewed under-desk footrest in the category.", intro1: "An under-desk footrest addresses one of the most common seated ergonomics problems: feet that do not rest flat on the floor. When the feet dangle, the thigh pressure on the seat edge cuts off circulation and adds tension to the lower back. A footrest restores the natural foot-to-floor angle without lowering the desk or chair.", intro2: "This guide covers eight under-desk footrests ranked by Amazon buyer rating and verified review count, including memory foam, rocker, wood, and mesh options that cover the main footrest types at different price points.", intro3: "For footrests specifically suited to shorter users, see our <Link href='/guide/best-under-desk-footrests-for-short-people' className='text-brand hover:underline'>best under-desk footrests for short people</Link> guide." },
  { slug: "best-vertical-macbook-stands", fn: "BestVerticalMacBookStandsPage", bc: "Best Vertical MacBook Stands", about1: "Vertical MacBook Stand", about2: "Desk Accessories", about3: "MacBook Clamshell Mode", count: 8, evaluated: "vertical MacBook stands", searchQ: "vertical+macbook+stand", btLabel: "best MacBook stand", btId: "twelve-south-bookarc", btName: "Twelve South BookArc for MacBook", btVerdict: " - 3,241 reviews at 4.6 stars, highest-rated vertical MacBook stand.", intro1: "A vertical MacBook stand stores the laptop in portrait orientation on the desk surface while connected to an external monitor in clamshell mode. The stand frees desk space equal to the laptop footprint and positions the laptop where cable connections are deliberate rather than ad hoc.", intro2: "This guide covers eight vertical MacBook stands ranked by Amazon buyer rating and verified review count, including passive aluminum holders, model-specific arc designs, combined hub-stands, and Thunderbolt 4 docking stations.", intro3: "For vertical stands that work with any laptop brand, see our <Link href='/guide/best-vertical-laptop-stands' className='text-brand hover:underline'>best vertical laptop stands</Link> guide." },
  { slug: "best-dual-vertical-laptop-stands", fn: "BestDualVerticalLaptopStandsPage", bc: "Best Dual Vertical Laptop Stands", about1: "Dual Vertical Laptop Stand", about2: "Desk Accessories", about3: "Multi-Device Storage", count: 8, evaluated: "dual vertical laptop stands", searchQ: "dual+vertical+laptop+stand", btLabel: "best dual stand", btId: "omoton-dual", btName: "OMOTON Dual Vertical Laptop Stand", btVerdict: " - 9,341 reviews at 4.4 stars, most reviewed dual vertical stand.", intro1: "A dual vertical laptop stand stores two devices in portrait orientation simultaneously, combining the footprint of two devices into the footprint of one side-by-side unit. For users who manage a work laptop and a personal laptop or a laptop and tablet, a dual stand is more efficient than two single stands.", intro2: "This guide covers eight dual vertical laptop stands ranked by Amazon buyer rating and verified review count, from affordable plastic two-slot options to premium aluminum designs and hub-integrated units.", intro3: "For single-device vertical storage, see our <Link href='/guide/best-vertical-laptop-stands' className='text-brand hover:underline'>best vertical laptop stands</Link> guide." },
  { slug: "best-adjustable-vertical-laptop-stands", fn: "BestAdjustableVerticalLaptopStandsPage", bc: "Best Adjustable Vertical Laptop Stands", about1: "Adjustable Laptop Stand", about2: "Desk Accessories", about3: "Width-Adjustable Holder", count: 8, evaluated: "adjustable vertical laptop stands", searchQ: "adjustable+vertical+laptop+stand", btLabel: "best adjustable pick", btId: "soundance-adjustable", btName: "Soundance Adjustable Vertical Laptop Stand", btVerdict: " - 14,892 reviews at 4.5 stars, most reviewed adjustable vertical stand.", intro1: "A fixed vertical stand works well when you only have one laptop of one specific thickness. An adjustable vertical stand slides to fit different laptop thicknesses and accommodates households or offices where multiple devices share the same stand. The adjustment mechanism is the defining feature.", intro2: "This guide covers eight adjustable vertical laptop stands ranked by Amazon buyer rating and verified review count, from budget ABS models to premium aluminum with smooth slide mechanisms.", intro3: "For Mac-specific vertical stands, see our <Link href='/guide/best-vertical-macbook-stands' className='text-brand hover:underline'>best vertical MacBook stands</Link> guide." },
  { slug: "best-vertical-laptop-stands-for-desk-setup", fn: "BestVerticalLaptopStandsDeskSetupPage", bc: "Best Vertical Laptop Stands for Desk Setup", about1: "Vertical Laptop Stand", about2: "Desk Setup", about3: "Clamshell Mode", count: 8, evaluated: "vertical laptop stands for desk setup", searchQ: "vertical+laptop+stand+desk+setup", btLabel: "best desk setup pick", btId: "soundance-desk-setup", btName: "Soundance Aluminum Vertical Laptop Stand", btVerdict: " - 14,892 reviews at 4.5 stars, most reviewed aluminum vertical stand.", intro1: "A vertical laptop stand in a desk setup context serves a different purpose than a basic vertical holder. In a dedicated desk setup, the stand position relative to the monitor, cable routing, and aesthetic consistency with other desk accessories all matter alongside basic holding function.", intro2: "This guide covers eight vertical laptop stands evaluated for desk setup use, ranked by Amazon buyer rating and verified review count. Options include minimal aluminum stands, hub-integrated units for cable management, and premium Thunderbolt 4 dock-stands.", intro3: "For general vertical stand recommendations, see our <Link href='/guide/best-vertical-laptop-stands' className='text-brand hover:underline'>best vertical laptop stands</Link> guide." },
  { slug: "best-vertical-laptop-stands", fn: "BestVerticalLaptopStandsPage", bc: "Best Vertical Laptop Stands", about1: "Vertical Laptop Stand", about2: "Desk Accessories", about3: "Clamshell Mode Storage", count: 8, evaluated: "vertical laptop stands", searchQ: "vertical+laptop+stand", btLabel: "best overall", btId: "soundance-main", btName: "Soundance Aluminum Vertical Laptop Stand", btVerdict: " - 14,892 reviews at 4.5 stars, most reviewed vertical laptop stand.", intro1: "A vertical laptop stand holds a closed laptop in portrait orientation, freeing the desk surface occupied by a flat laptop. The freed space returns to usable work area when the laptop is connected to an external monitor, keyboard, and mouse in clamshell mode.", intro2: "This guide covers eight vertical laptop stands ranked by Amazon buyer rating and verified review count, from the most reviewed budget aluminum options to Mac-specific premium stands and Thunderbolt 4 docking stations.", intro3: "For stands specifically suited to MacBook models, see our <Link href='/guide/best-vertical-macbook-stands' className='text-brand hover:underline'>best vertical MacBook stands</Link> guide." },
  { slug: "best-lap-desks-for-bed", fn: "BestLapDesksForBedPage", bc: "Best Lap Desks for Bed", about1: "Lap Desk", about2: "Bed Accessories", about3: "Laptop in Bed", count: 8, evaluated: "lap desks for bed", searchQ: "lap+desk+for+bed", btLabel: "best lap desk for bed", btId: "lapgear-home-office", btName: "LapGear Home Office Lap Desk", btVerdict: " - 18,432 reviews at 4.5 stars, most reviewed lap desk for bed use.", intro1: "Using a laptop in bed without a lap desk puts the device directly on soft bedding that blocks bottom vents and causes overheating. A lap desk provides a hard surface that elevates the laptop above the mattress, keeps vents clear, and protects legs from the heat the laptop generates.", intro2: "This guide covers eight lap desks for bed use ranked by Amazon buyer rating and verified review count, including cushioned flat boards, adjustable-angle designs, height-adjustable models, and foldable options for small bedroom storage.", intro3: "For lap desks focused on cushion base comfort, see our <Link href='/guide/best-lap-desks-with-cushion' className='text-brand hover:underline'>best lap desks with cushion</Link> guide." },
  { slug: "best-lap-desks-with-cushion", fn: "BestLapDesksWithCushionPage", bc: "Best Lap Desks with Cushion", about1: "Cushion Lap Desk", about2: "Lap Desk", about3: "Memory Foam Accessories", count: 8, evaluated: "lap desks with cushion", searchQ: "lap+desk+with+cushion", btLabel: "best cushion lap desk", btId: "lapgear-home-office-cushion", btName: "LapGear Home Office Lap Desk with Cushion", btVerdict: " - 18,432 reviews at 4.5 stars, most reviewed cushion lap desk.", intro1: "The cushion base on a lap desk serves two functions: it distributes the hard surface pressure away from the legs and creates a slight air gap that reduces heat transfer from the laptop. Without a cushion, a hard lap desk board puts concentrated pressure on the thighs and transfers laptop heat directly.", intro2: "This guide covers eight cushion lap desks ranked by Amazon buyer rating and verified review count, from standard pillow foam bases and bean bag fill to memory foam options and premium adjustable models with cushion bases.", intro3: "For lap desks focused on bed use, see our <Link href='/guide/best-lap-desks-for-bed' className='text-brand hover:underline'>best lap desks for bed</Link> guide." },
  { slug: "best-lap-desks-for-laptops", fn: "BestLapDesksForLaptopsPage", bc: "Best Lap Desks for Laptops", about1: "Laptop Lap Desk", about2: "Lap Desk", about3: "Laptop Accessories", count: 8, evaluated: "lap desks for laptops", searchQ: "lap+desk+for+laptop", btLabel: "best for laptops", btId: "lapgear-home-office-laptop", btName: "LapGear Home Office Lap Desk", btVerdict: " - 18,432 reviews at 4.5 stars, most reviewed lap desk for laptop use.", intro1: "A lap desk for laptop use is not just a cushion board — it is a protective platform that keeps laptop vents clear, provides a stable typing surface, and shields legs from laptop-generated heat. The primary function is thermal protection for the laptop and comfort for the user.", intro2: "This guide covers eight lap desks for laptop use ranked by Amazon buyer rating and verified review count, including hard-surface cushion boards, ventilated platforms, models with USB cooling fans, and adjustable height options for different working positions.", intro3: "For lap desks specifically for bed use, see our <Link href='/guide/best-lap-desks-for-bed' className='text-brand hover:underline'>best lap desks for bed</Link> guide." },
];

for (const g of guides) {
  const dir = join(BASE, g.slug);
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
  type GuideProduct,
} from "@/data/guides/${g.slug}";

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/guide/${g.slug}",
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

export default async function ${g.fn}() {
  const guide = await getPublicGuideBySlug("${g.slug}");
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
    mainEntityOfPage: { "@type": "WebPage", "@id": \`\${SITE_URL}/guide/${g.slug}\` },
    about: [
      { "@type": "Thing", name: "${g.about1}" },
      { "@type": "Thing", name: "${g.about2}" },
      { "@type": "Thing", name: "${g.about3}" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: \`\${SITE_URL}/guide\` },
      { "@type": "ListItem", position: 3, name: "${g.bc}", item: \`\${SITE_URL}/guide/${g.slug}\` },
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
      url: \`\${SITE_URL}/guide/${g.slug}#\${p.id}\`,
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
          <span className="text-ink">${g.bc}</span>
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
            ${g.count} ${g.evaluated} ranked by Amazon buyer rating and verified review count.
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
              ${g.count} ${g.evaluated} evaluated
            </div>
          </div>
        </header>

        <div className="mb-8 p-4 rounded-xl bg-bg border border-border text-xs text-ink-secondary">
          <strong className="text-ink">Quick note:</strong> This page contains affiliate links. If you buy through our links, we may earn a small commission at no extra cost to you. As an Amazon Associate, DeskFinds earns from qualifying purchases.{" "}
          <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:underline">Affiliate disclosure</Link>.
        </div>

        <div className="rounded-2xl overflow-hidden border border-border mb-10 bg-bg">
          <Image src={heroImg} alt="${g.bc}" width={900} height={420} className="w-full object-cover max-h-[420px]" priority unoptimized />
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
          <p>${g.intro1}</p>
          <p>${g.intro2}</p>
          <p>${g.intro3}</p>
        </section>

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
                <strong className="text-ink">${g.btLabel}:</strong>{" "}
                <a href="#${g.btId}" className="font-bold text-ink hover:text-brand transition-colors">${g.btName}</a>
                ${g.btVerdict}
              </p>
            </div>
            <p className="text-sm text-ink-secondary pl-5">See the full rankings above for all eight picks with pros, cons, and best-for summaries.</p>
          </div>
        </section>

        <section className="mb-14 p-6 rounded-2xl flex flex-col items-center text-center" style={{ background: "linear-gradient(135deg, #FF9900 0%, #e68900 100%)" }}>
          <h2 className="text-xl font-bold text-white mb-2">Browse on Amazon</h2>
          <p className="text-white/90 text-sm mb-5">All Prime-eligible options with current pricing.</p>
          <a href="https://www.amazon.com/s?k=${g.searchQ}&tag=theofficejournal-20" target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-bold text-sm hover:bg-gray-50 transition-colors" style={{ color: "#FF9900" }}>
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
          <p className="text-xs text-ink-muted mt-4 text-center">Last updated: July 2026. Verify current Amazon prices before purchasing.</p>
        </section>
      </Container>
    </>
  );
}
`;

  writeFileSync(join(dir, "page.tsx"), content, "utf-8");
  console.log(`Created: ${g.slug}`);
}
