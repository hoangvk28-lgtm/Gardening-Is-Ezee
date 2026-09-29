import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor } from "@/lib/utils";

interface GuideRecommendationBoxProps {
  picks: Product[];
}

export function GuideRecommendationBox({ picks }: GuideRecommendationBoxProps) {
  if (picks.length === 0) return null;

  return (
    <div className="mb-10 max-w-3xl rounded-card border-2 border-brand-muted bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-brand-light border-b border-brand-muted flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-0.5">
            Our Recommendations
          </p>
          <h2 className="text-base font-bold text-ink">Everything We Recommend</h2>
        </div>
        <span className="text-xs text-ink-muted shrink-0">{picks.length} pick{picks.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Pick list */}
      <ol className="divide-y divide-border">
        {picks.map((product, i) => (
          <li key={product.id} className="flex gap-0 group">
            {/* Rank stripe */}
            <div className="w-10 shrink-0 flex items-start justify-center pt-5 bg-bg border-r border-border">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>

            {/* Card content */}
            <div className="flex-1 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  {product.badge && <Badge>{product.badge}</Badge>}
                </div>
                <span className={`text-lg font-bold tabular-nums shrink-0 ${scoreToColor(product.scores.overall)}`}>
                  {product.scores.overall.toFixed(1)}
                  <span className="text-xs font-normal text-ink-muted ml-0.5">/10</span>
                </span>
              </div>

              <Link prefetch={false} href={`/reviews/${product.slug}`} className="group/link">
                <h3 className="font-bold text-ink text-base leading-snug group-hover/link:text-brand transition-colors mb-1">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-ink-secondary leading-relaxed mb-3 line-clamp-2">
                {product.shortDescription}
              </p>

              {product.bestFor[0] && (
                <div className="flex items-start gap-2 mb-4">
                  <svg className="w-3.5 h-3.5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-xs text-ink-secondary leading-snug">{product.bestFor[0]}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <CTAButton href={product.amazonUrl} size="sm">
                  Check Price on Amazon
                </CTAButton>
                <div className="flex items-center gap-2">
                  <Link prefetch={false}
                    href={`/reviews/${product.slug}`}
                    className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
                  >
                    Full review →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Footer note */}
      <div className="px-6 py-3 bg-bg border-t border-border">
        <p className="text-xs text-ink-muted">
          Scroll down for detailed reviews, a comparison table, buying advice, and FAQs.
        </p>
      </div>
    </div>
  );
}
