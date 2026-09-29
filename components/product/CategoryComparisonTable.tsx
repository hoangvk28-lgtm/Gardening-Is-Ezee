import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor } from "@/lib/utils";

interface CategoryComparisonTableProps {
  products: Product[];
}

function ScoreCell({ score }: { score: number }) {
  return (
    <span className={`font-bold tabular-nums text-sm ${scoreToColor(score)}`}>
      {score.toFixed(1)}
    </span>
  );
}

export function CategoryComparisonTable({ products }: CategoryComparisonTableProps) {
  if (products.length === 0) return null;

  const sorted = [...products].sort((a, b) => b.scores.overall - a.scores.overall);

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-sm" style={{ minWidth: "600px" }}>
        <thead>
          <tr className="bg-bg border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide">
              Product
            </th>
            <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide hidden sm:table-cell">
              Best For
            </th>
            <th className="px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide text-center whitespace-nowrap">
              Score
            </th>
            <th className="px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide text-center whitespace-nowrap hidden md:table-cell">
              Space Fit
            </th>
            <th className="px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide text-center">
              Buy
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((product, i) => (
            <tr
              key={product.id}
              className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-bg/40"} hover:bg-brand-light/40 transition-colors`}
            >
              {/* Product name + badge */}
              <td className="px-4 py-3.5">
                <div className="flex flex-col gap-1.5">
                  {product.badge && <Badge>{product.badge}</Badge>}
                  <Link prefetch={false}
                    href={`/reviews/${product.slug}`}
                    className="font-semibold text-ink hover:text-brand transition-colors leading-snug text-sm"
                  >
                    {product.name}
                  </Link>
                </div>
              </td>

              {/* Best for - first item only */}
              <td className="px-4 py-3.5 hidden sm:table-cell">
                <p className="text-xs text-ink-secondary leading-relaxed max-w-[200px]">
                  {product.bestFor[0] ?? "-"}
                </p>
              </td>

              {/* Overall score */}
              <td className="px-4 py-3.5 text-center">
                <ScoreCell score={product.scores.overall} />
              </td>

              {/* Small-space fit */}
              <td className="px-4 py-3.5 text-center hidden md:table-cell">
                <ScoreCell score={product.scores.smallSpaceFit} />
              </td>

              {/* Buy CTA */}
              <td className="px-4 py-3.5 text-center">
                <CTAButton href={product.amazonUrl} size="sm">
                  Amazon →
                </CTAButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile note */}
      <p className="sm:hidden text-xs text-ink-muted px-4 py-2 border-t border-border bg-bg">
        Scroll right to see more columns. Tap a product name to read the full review.
      </p>
    </div>
  );
}
