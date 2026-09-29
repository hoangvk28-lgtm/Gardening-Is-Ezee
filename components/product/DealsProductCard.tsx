import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor, scoreToBarColor } from "@/lib/utils";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";

const CATEGORY_COLORS: Record<string, string> = {
  "desk-setup": "#7c9068",
  "dorm-essentials": "#7c3aed",
  "small-room-storage": "#0891b2",
};
function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? "#7c9068";
}

interface DealsProductCardProps {
  product: Product;
}

export function DealsProductCard({ product }: DealsProductCardProps) {
  return (
    <div className="bg-white rounded-card border border-border overflow-hidden flex flex-col hover:shadow-card-hover hover:border-brand/30 transition-all group">
      {product.image && product.image.startsWith("http") ? (
        <div className="relative w-full h-40 bg-bg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <CategoryIllustration
          subcategorySlug={product.subcategorySlug}
          categoryColor={getCategoryColor(product.categorySlug)}
        />
      )}

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Badge + scores header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.badge && <Badge>{product.badge}</Badge>}
          </div>
          <div className="text-right shrink-0">
            <div className={`text-xl font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}>
              {product.scores.overall.toFixed(1)}
            </div>
            <div className="text-xs text-ink-muted">/10</div>
          </div>
        </div>

        {/* Name */}
        <Link prefetch={false} href={`/reviews/${product.slug}`} className="group/name">
          <h3 className="font-semibold text-ink text-sm leading-snug group-hover/name:text-brand transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Best for */}
        {product.bestFor[0] && (
          <div className="flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <p className="text-xs text-ink-secondary leading-snug line-clamp-2">{product.bestFor[0]}</p>
          </div>
        )}

        {/* Value score bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Value for Money</span>
            <span className={`text-xs font-bold tabular-nums ${scoreToColor(product.scores.valueForMoney)}`}>
              {product.scores.valueForMoney.toFixed(1)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${scoreToBarColor(product.scores.valueForMoney)}`}
              style={{ width: `${(product.scores.valueForMoney / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="pt-3 border-t border-border space-y-2.5">
          <div className="flex items-center justify-end">
            <Link prefetch={false}
              href={`/reviews/${product.slug}`}
              className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
            >
              Full review →
            </Link>
          </div>
          <CTAButton href={product.amazonUrl} size="md" fullWidth>
            Check Current Price
          </CTAButton>
          <p className="text-center text-xs text-ink-muted">
            Price may vary · Check Amazon for latest
          </p>
        </div>
      </div>
    </div>
  );
}
