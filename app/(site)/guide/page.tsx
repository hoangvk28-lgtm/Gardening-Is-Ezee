import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";
import { getPublicGuides } from "@/lib/public-guides";
import { formatDate } from "@/lib/utils";
import { categories } from "@/data/categories";
import { canonicalGuideHref } from "@/lib/migrated-silos";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "Garden & Yard Buying Guides",
  description:
    "Browse our garden and yard buying guides for lawn care, tools, watering, growing, cleanup and outdoor living.",
  path: "/guide",
});

const LATEST_COUNT = 40;
const PER_CATEGORY = 4;

function GuideCard({ guide, priority = false }: { guide: { slug: string; title: string; description: string; heroImage?: string; thumbnailImage?: string; categorySlug: string; subcategorySlug: string; readTime: string; lastUpdated: string; recommendedProductIds: string[] }; priority?: boolean }) {
  const thumb = guide.thumbnailImage || guide.heroImage;
  return (
    <Link prefetch={false}
      href={canonicalGuideHref(guide)}
      className="group flex flex-col bg-white rounded-card border border-border hover:shadow-card-hover hover:border-brand/20 transition-all overflow-hidden"
    >
      {thumb ? (
        <div className="relative w-full h-44 bg-bg overflow-hidden">
          <Image
            src={thumb}
            alt={guide.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            unoptimized
          />
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-brand px-2 py-1 rounded-full">
            {guide.subcategorySlug.replace(/-/g, " ")}
          </span>
        </div>
      ) : (
        <div className="w-full h-44 bg-brand-muted flex items-center justify-center relative">
          <svg className="w-10 h-10 text-brand/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-widest text-brand bg-brand-muted px-2 py-1 rounded-full border border-brand/20">
            {guide.subcategorySlug.replace(/-/g, " ")}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-muted">{guide.readTime}</span>
          <span className="text-xs text-ink-muted">Updated {formatDate(guide.lastUpdated)}</span>
        </div>
        <h3 className="font-bold text-ink leading-snug group-hover:text-brand transition-colors text-sm">
          {guide.title}
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 flex-1">
          {guide.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <span className="text-xs text-ink-muted">
            {guide.recommendedProductIds.length > 0 ? `${guide.recommendedProductIds.length} picks evaluated` : "Full buying guide"}
          </span>
          <span className="text-xs font-semibold text-brand group-hover:text-brand-dark transition-colors flex items-center gap-0.5">
            Read guide
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BuyingGuidesIndexPage() {
  const guides = await getPublicGuides();

  // 12 most recently updated guides
  const latestGuides = guides.slice(0, LATEST_COUNT);
  const latestSlugs = new Set(latestGuides.map((g) => g.slug));

  // Per-category: top 4, excluding guides already shown in Latest
  const guidesByCategory = categories
    .map((cat) => ({
      category: cat,
      guides: guides
        .filter((g) => g.subcategorySlug === cat.slug && !latestSlugs.has(g.slug))
        .slice(0, PER_CATEGORY),
    }))
    .filter((c) => c.guides.length > 0);

  const totalGuides = guides.length;

  return (
    <Container className="py-14">
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Buying Guides</span>
        <h1 className="text-4xl font-bold text-ink mt-3 mb-4 tracking-tight">Buying Guides</h1>
        <p className="text-lg text-ink-secondary leading-relaxed">
          Straightforward comparisons for real garden and yard jobs, updated as products and specifications change.
        </p>
      </div>

      <div className="space-y-14">
        {/* Latest guides */}
        <section aria-labelledby="latest-guides">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="latest-guides" className="text-2xl font-bold text-ink tracking-tight mb-1">
                Recently Updated
              </h2>
              <p className="text-sm text-ink-secondary">Our {LATEST_COUNT} most recently updated buying guides.</p>
            </div>
            <span className="text-xs text-ink-muted hidden sm:block">{totalGuides} guides total</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestGuides.map((guide, i) => (
              <GuideCard key={guide.slug} guide={guide} priority={i < 3} />
            ))}
          </div>
        </section>

        {/* Per-category sections */}
        {guidesByCategory.map(({ category, guides: catGuides }) => (
          <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id={`cat-${category.slug}`} className="text-2xl font-bold text-ink tracking-tight mb-1">
                  {category.name}
                </h2>
                <p className="text-sm text-ink-secondary max-w-2xl">{category.shortDescription}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {catGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        ))}

        {/* Browse all CTA */}
        <section className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-brand-muted border border-brand/10">
            <div>
              <p className="font-bold text-ink text-lg mb-1">Looking for more guides?</p>
              <p className="text-sm text-ink-secondary">
                We have <strong>{totalGuides} buying guides</strong> covering lawn care, watering, growing, cleanup and outdoor living.
              </p>
            </div>
            <Link prefetch={false}
              href="/guide/all"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-colors"
            >
              Browse all {totalGuides} guides
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
