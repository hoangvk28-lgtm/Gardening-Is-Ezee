import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/data/guides";
import type { PublicGuide } from "@/lib/public-guides";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";
import { scoreToColor } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { categories } from "@/data/categories";
import { canonicalGuideHref } from "@/lib/migrated-silos";

interface FeaturedGuideHeroProps {
  guide: Guide | PublicGuide;
  products: Product[];
}

export function FeaturedGuideHero({ guide, products }: FeaturedGuideHeroProps) {
  const topThree = products.slice(0, 3);
  const categoryColor = categories.find((c) => c.slug === guide.categorySlug)?.color ?? "#7c9068";
  const coverImage = (guide as PublicGuide).thumbnailImage || guide.heroImage || "";

  return (
    <section className="py-14 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-6 h-0.5 bg-brand rounded-full" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-widest text-brand">
          Featured Guide
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left - editorial card */}
        <div className="flex flex-col gap-5 p-7 bg-white rounded-card border border-brand-muted shadow-card">
          {/* Guide cover - thumbnail (preferred) or hero image or fallback illustration */}
          {coverImage.startsWith("http") ? (
            <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden">
              <Image
                src={coverImage}
                alt={guide.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <CategoryIllustration
              subcategorySlug={guide.subcategorySlug}
              categoryColor={categoryColor}
              className="w-full h-48 sm:h-56 rounded-lg"
            />
          )}

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span className="font-semibold text-brand uppercase tracking-wide">
              {guide.subcategorySlug.replace(/-/g, " ")}
            </span>
            <span aria-hidden="true">·</span>
            <span>{guide.readTime} read</span>
            <span aria-hidden="true">·</span>
            <span>Updated {formatDate(guide.lastUpdated)}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-ink leading-tight tracking-tight">
            {guide.title}
          </h3>

          {/* Description */}
          <p className="text-ink-secondary leading-relaxed">
            {guide.description}
          </p>

          {/* Quick-pick labels */}
          {topThree.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topThree.map((p, i) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-bg rounded-badge border border-border text-xs font-medium text-ink-secondary"
                >
                  <span className="w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link prefetch={false}
              href={canonicalGuideHref(guide)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-btn hover:bg-brand-dark transition-colors text-sm"
            >
              Read Full Guide
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right - top 3 product mini-cards */}
        {topThree.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Top Picks from this Guide
            </p>
            {topThree.map((product, i) => (
              <Link prefetch={false}
                key={product.id}
                href={`/reviews/${product.slug}`}
                className="group flex items-start gap-4 p-4 bg-white rounded-card border border-border hover:border-brand/30 hover:shadow-card transition-all"
              >
                {/* Rank */}
                <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-ink text-sm leading-snug group-hover:text-brand transition-colors">
                      {product.name}
                    </p>
                    {product.badge && (
                      <Badge>{product.badge}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 mb-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className={`text-base font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}>
                      {product.scores.overall.toFixed(1)}
                    </span>
                    <span className="text-xs text-ink-muted">/10</span>
                  </div>
                </div>
              </Link>
            ))}

            <div className="pt-2">
              <CTAButton
                href={topThree[0].amazonUrl}
                size="sm"
                fullWidth
              >
                Check Top Pick on Amazon
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
