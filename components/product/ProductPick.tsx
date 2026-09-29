import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { scoreToColor } from "@/lib/utils";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";

const CATEGORY_COLORS: Record<string, string> = {
  "desk-setup": "#7c9068",
  "dorm-essentials": "#7c3aed",
  "small-room-storage": "#0891b2",
};
function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? "#7c9068";
}

interface ProductPickProps {
  product: Product;
  /** Override pick label - defaults to product.badge */
  pickLabel?: string;
  rank?: number;
  lastUpdated?: string;
}

export function ProductPick({ product, pickLabel, rank, lastUpdated }: ProductPickProps) {
  const label = pickLabel ?? product.badge ?? "Recommended";

  const hasRealImage = product.image && product.image.startsWith("http");

  return (
    <div className="bg-white rounded-card border border-border overflow-hidden">
      {hasRealImage ? (
        <div className="relative w-full h-48 bg-bg overflow-hidden">
          <Image
            src={product.image!}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-contain p-4"
            unoptimized
          />
        </div>
      ) : (
        <CategoryIllustration
          subcategorySlug={product.subcategorySlug}
          categoryColor={getCategoryColor(product.categorySlug)}
          className="w-full h-28"
        />
      )}

      {/* Pick label banner */}
      <div className="flex items-center justify-between px-5 py-3 bg-brand-light border-b border-brand-muted">
        <div className="flex items-center gap-2.5">
          {rank !== undefined && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold">
              {rank}
            </span>
          )}
          <Badge variant="primary">{label}</Badge>
        </div>
        {lastUpdated && (
          <span className="text-xs text-ink-muted">
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <Link prefetch={false} href={`/reviews/${product.slug}`} className="group">
              <h3 className="text-xl font-bold text-ink leading-snug group-hover:text-brand transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Review summary excerpt */}
          <div className="flex gap-2.5">
            <svg
              className="w-5 h-5 text-cta shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
              {product.reviewSummary}
            </p>
          </div>

          {/* Best for */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {product.bestFor.slice(0, 4).map((item) => (
              <div key={item} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-cta shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span className="text-sm text-ink-secondary">{item}</span>
              </div>
            ))}
          </div>

          {/* Not ideal for */}
          {product.notIdealFor.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {product.notIdealFor.slice(0, 2).map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-score-mid shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm text-ink-secondary">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CTAButton href={product.amazonUrl} size="lg">
              Check Price on Amazon
            </CTAButton>
            <Link prefetch={false}
              href={`/reviews/${product.slug}`}
              className="text-sm font-medium text-brand hover:text-brand-dark transition-colors"
            >
              Read full review →
            </Link>
          </div>
        </div>

        {/* Score sidebar */}
        <div className="sm:w-52 flex flex-col gap-4 shrink-0">
          {/* Overall score */}
          <div className="flex flex-col items-center justify-center p-4 bg-bg rounded-lg border border-border">
            <span
              className={`text-4xl font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}
            >
              {product.scores.overall.toFixed(1)}
            </span>
            <span className="text-xs text-ink-muted mt-1">Overall Score</span>
          </div>


          {/* Mini score bars */}
          <div className="flex flex-col gap-2.5">
            <ScoreBar label="Value"       score={product.scores.valueForMoney}  compact showLabel={false} />
            <ScoreBar label="Build"       score={product.scores.buildQuality}   compact showLabel={false} />
            <ScoreBar label="Ease of Use" score={product.scores.easeOfUse}      compact showLabel={false} />
            <ScoreBar label="Small Space" score={product.scores.smallSpaceFit}  compact showLabel={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
