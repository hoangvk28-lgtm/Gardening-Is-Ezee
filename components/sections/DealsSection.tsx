import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";
import { scoreToColor } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "desk-setup": "#7c9068",
  "dorm-essentials": "#a8875a",
  "small-room-storage": "#63635a",
  "compact-home-office": "#5c6f4b",
  "budget-finds": "#c9a876",
};
function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? "#7c9068";
}

interface DealsSectionProps {
  products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-14 border-t border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-dark">
              Editor Picks
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Products worth considering
          </h2>
          <p className="text-ink-secondary mt-2 leading-relaxed max-w-2xl">
            A small selection of products we think genuinely improve a home workspace.
          </p>
        </div>
        <Link prefetch={false}
          href="/deals"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors shrink-0 flex items-center gap-1"
        >
          All editor picks
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white rounded-card border border-border overflow-hidden hover:shadow-card-hover transition-shadow"
          >
            {/* Product image or illustration fallback */}
            {product.image && product.image.startsWith("http") ? (
              <div className="relative w-full h-36 bg-bg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-contain p-3"
                  unoptimized
                />
              </div>
            ) : (
              <CategoryIllustration
                subcategorySlug={product.subcategorySlug}
                categoryColor={getCategoryColor(product.categorySlug)}
                className="w-full h-36"
              />
            )}
            <div className="flex flex-col gap-4 p-5 flex-1">
            {/* Badge row */}
            <div className="flex items-center justify-between gap-2">
              {product.badge ? (
                <Badge>{product.badge}</Badge>
              ) : (
                <Badge variant="muted">Recommended</Badge>
              )}
              <span
                className={`text-base font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}
              >
                {product.scores.overall.toFixed(1)}
                <span className="text-xs font-normal text-ink-muted ml-0.5">/10</span>
              </span>
            </div>

            {/* Name */}
            <div className="flex-1">
              <Link prefetch={false} href={`/reviews/${product.slug}`} className="group">
                <h3 className="font-bold text-ink text-sm leading-snug group-hover:text-brand transition-colors mb-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                {product.shortDescription}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-3 border-t border-border flex flex-col gap-2.5">
              <CTAButton href={product.amazonUrl} size="sm" fullWidth>
                Check on Amazon
              </CTAButton>
              <Link prefetch={false}
                href={`/reviews/${product.slug}`}
               
                className="text-center text-xs text-ink-muted hover:text-brand transition-colors"
              >
                Read review →
              </Link>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-ink-muted">
        Check Amazon for current pricing and availability.
      </p>
    </section>
  );
}
