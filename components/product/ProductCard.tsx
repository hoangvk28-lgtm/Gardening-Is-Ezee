import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { clsx, scoreToColor } from "@/lib/utils";
import { CategoryIllustration } from "@/components/ui/CategoryIllustration";

const CATEGORY_COLORS: Record<string, string> = {
  "desk-setup": "#7c9068",
  "dorm-essentials": "#7c3aed",
  "small-room-storage": "#0891b2",
};
function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? "#7c9068";
}

interface ProductCardProps {
  product: Product;
  showScore?: boolean;
}

function ProductImage({ product }: { product: Product }) {
  if (product.image && product.image.startsWith("http")) {
    return (
      <div className="relative w-full h-44 bg-bg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }
  return (
    <CategoryIllustration
      subcategorySlug={product.subcategorySlug}
      categoryColor={getCategoryColor(product.categorySlug)}
    />
  );
}

export function ProductCard({ product, showScore = true }: ProductCardProps) {
  return (
    <div className="bg-white rounded-card border border-border overflow-hidden flex flex-col hover:shadow-card-hover hover:border-brand/20 transition-all group">
      <ProductImage product={product} />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Category + badge */}
        <div className="flex items-center gap-2 flex-wrap min-h-[1.25rem]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            {product.subcategorySlug.replace(/-/g, " ")}
          </span>
          {product.badge && <Badge>{product.badge}</Badge>}
        </div>

        {/* Name */}
        <Link prefetch={false} href={`/reviews/${product.slug}`}>
          <h3 className="font-bold text-ink text-base leading-snug group-hover:text-brand transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        {/* Score row */}
        {showScore && (
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className={clsx("text-2xl font-bold tabular-nums", scoreToColor(product.scores.overall))}>
                {product.scores.overall.toFixed(1)}
              </span>
              <span className="text-xs text-ink-muted">/10</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border">
          <CTAButton href={product.amazonUrl} size="md" fullWidth>
            Check Price on Amazon
          </CTAButton>
          <Link prefetch={false}
            href={`/reviews/${product.slug}`}
           
            className="text-center text-xs font-medium text-ink-muted hover:text-brand transition-colors py-1"
          >
            Read our full review →
          </Link>
        </div>
      </div>
    </div>
  );
}
