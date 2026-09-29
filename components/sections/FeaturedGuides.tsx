import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/data/guides";
import { categories } from "@/data/categories";
import { formatDate } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";
import { canonicalGuideHref } from "@/lib/migrated-silos";

interface FeaturedGuidesProps {
  guides: Guide[];
  title?: string;
  description?: string;
  showAll?: boolean;
}

export function FeaturedGuides({
  guides,
  title = "Popular Guides",
  description = "Carefully evaluated product comparisons for better home workdays - no padding, just our honest picks.",
  showAll = true,
}: FeaturedGuidesProps) {
  return (
    <section className="py-14">
      <SectionHeader
        eyebrow="Buying Guides"
        title={title}
        description={description}
        href={showAll ? "/guide" : undefined}
        hrefLabel="View all guides"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => {
          const categoryColor =
            categories.find((c) => c.slug === guide.categorySlug)?.color ?? "#7c9068";
          return (
            <GuideCard key={guide.slug} guide={guide} categoryColor={categoryColor} />
          );
        })}
      </div>
    </section>
  );
}

function GuideCard({
  guide,
  categoryColor,
}: {
  guide: Guide;
  categoryColor: string;
}) {
  const category = categories.find((c) => c.slug === guide.categorySlug);

  return (
    <Link prefetch={false}
      href={canonicalGuideHref(guide)}
     
      className="group flex flex-col gap-4 bg-white rounded-card border border-border border-t-4 border-t-transparent overflow-hidden hover:shadow-card-hover transition-all"
      style={{ borderTopColor: categoryColor }}
    >
      {/* Cover - hero image or fallback illustration */}
      {guide.heroImage && guide.heroImage.startsWith("http") ? (
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <CategoryIllustration
          subcategorySlug={guide.subcategorySlug}
          categoryColor={categoryColor}
          className="w-full h-44"
        />
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Meta - read time, date, and category badge */}
        <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
          <span>{guide.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {formatDate(guide.lastUpdated)}</span>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColor }}
                  aria-hidden="true"
                />
                {category.name}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-ink group-hover:text-brand transition-colors leading-snug text-base">
          {guide.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 flex-1">
          {guide.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-border flex flex-col gap-1.5">
          {/* Picks count row */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {guide.recommendedProductIds.length > 0
              ? `${guide.recommendedProductIds.length} ${guide.recommendedProductIds.length === 1 ? "pick" : "picks"} evaluated`
              : "Full buying guide"}
            <span className="ml-auto flex items-center gap-0 group-hover:gap-2 transition-all">→</span>
          </div>

          {/* Main keyword tag */}
          {guide.mainKeyword && (
            <div className="flex items-center gap-1">
              <span className="inline-block text-[10px] leading-none px-1.5 py-0.5 rounded bg-surface text-ink-muted font-medium border border-border">
                {guide.mainKeyword}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
