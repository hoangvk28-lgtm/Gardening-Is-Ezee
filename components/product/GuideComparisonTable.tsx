import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor } from "@/lib/utils";

interface GuideComparisonTableProps {
  products: Product[];
}

export function GuideComparisonTable({ products }: GuideComparisonTableProps) {
  if (products.length < 2) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">Quick Comparison</h2>
      <p className="text-sm text-ink-secondary mb-4">
        All picks side-by-side. Click any product name for the full review.
      </p>

      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full text-sm" style={{ minWidth: "640px" }}>
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide w-28">
                Our Pick
              </th>
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide">
                Product
              </th>
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide hidden lg:table-cell">
                Best For
              </th>
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide hidden xl:table-cell">
                Key Strength
              </th>
              <th className="px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide text-center whitespace-nowrap">
                Score
              </th>
              <th className="px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide text-center">
                Buy
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-bg/40"} hover:bg-brand-light/30 transition-colors`}
              >
                {/* Pick label */}
                <td className="px-4 py-4 align-top">
                  <div className="flex flex-col gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {product.badge && <Badge>{product.badge}</Badge>}
                  </div>
                </td>

                {/* Product name */}
                <td className="px-4 py-4 align-top">
                  <Link prefetch={false}
                    href={`/reviews/${product.slug}`}
                    className="font-semibold text-ink hover:text-brand transition-colors leading-snug text-sm block mb-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 max-w-[220px]">
                    {product.shortDescription}
                  </p>
                </td>

                {/* Best for */}
                <td className="px-4 py-4 align-top hidden lg:table-cell">
                  <p className="text-xs text-ink-secondary leading-relaxed max-w-[180px]">
                    {product.bestFor[0] ?? "-"}
                  </p>
                </td>

                {/* Key strength (first pro) */}
                <td className="px-4 py-4 align-top hidden xl:table-cell">
                  <p className="text-xs text-ink-secondary leading-relaxed max-w-[200px]">
                    {product.pros[0] ?? "-"}
                  </p>
                </td>

                {/* Score */}
                <td className="px-4 py-4 text-center align-top">
                  <span className={`font-bold tabular-nums text-base ${scoreToColor(product.scores.overall)}`}>
                    {product.scores.overall.toFixed(1)}
                  </span>
                </td>

                {/* CTA */}
                <td className="px-4 py-4 text-center align-top">
                  <CTAButton href={product.amazonUrl} size="sm">
                    Check price
                  </CTAButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile hint */}
        <p className="lg:hidden text-xs text-ink-muted px-4 py-2.5 border-t border-border bg-bg">
          Tap a product name to read the full review. Scroll right for more columns.
        </p>
      </div>
    </div>
  );
}
