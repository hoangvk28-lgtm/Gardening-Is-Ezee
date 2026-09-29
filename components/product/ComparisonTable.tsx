import Link from "next/link";
import type { Product, ProductScore } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor } from "@/lib/utils";

interface ComparisonTableProps {
  products: Product[];
  showSpecs?: boolean;
}

const SCORE_COLS: { key: keyof ProductScore; label: string }[] = [
  { key: "overall",       label: "Overall" },
  { key: "valueForMoney", label: "Value" },
  { key: "buildQuality",  label: "Build" },
  { key: "easeOfUse",     label: "Ease of Use" },
  { key: "smallSpaceFit", label: "Space Fit" },
];

export function ComparisonTable({ products, showSpecs = false }: ComparisonTableProps) {
  if (products.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-ink-secondary w-36">
              Criteria
            </th>
            {products.map((p) => (
              <th key={p.id} className="px-4 py-3 text-center min-w-[160px]">
                <div className="flex flex-col gap-1.5 items-center">
                  {p.badge && <Badge>{p.badge}</Badge>}
                  <Link prefetch={false}
                    href={`/reviews/${p.slug}`}
                    className="font-semibold text-ink hover:text-brand transition-colors text-xs leading-snug text-center"
                  >
                    {p.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Scores */}
          {SCORE_COLS.map(({ key, label }, rowIdx) => (
            <tr
              key={key}
              className={`border-b border-border ${rowIdx % 2 === 0 ? "bg-white" : "bg-bg/50"} ${key === "overall" ? "font-semibold" : ""}`}
            >
              <td className="px-4 py-3 text-ink-secondary font-medium">{label}</td>
              {products.map((p) => (
                <td key={p.id} className="px-4 py-3 text-center">
                  <span className={`font-bold tabular-nums text-base ${scoreToColor(p.scores[key])}`}>
                    {p.scores[key].toFixed(1)}
                  </span>
                </td>
              ))}
            </tr>
          ))}

          {/* Specs rows */}
          {showSpecs &&
            products[0]?.specs &&
            Object.keys(products[0].specs).map((specKey, i) => (
              <tr
                key={specKey}
                className={`border-b border-border ${i % 2 === 0 ? "bg-bg/50" : "bg-white"}`}
              >
                <td className="px-4 py-3 text-ink-secondary font-medium">{specKey}</td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center text-ink-secondary">
                    {p.specs[specKey] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}

          {/* Buy CTA */}
          <tr className="bg-white">
            <td className="px-4 py-4 text-ink-secondary font-medium">Buy</td>
            {products.map((p) => (
              <td key={p.id} className="px-4 py-4 text-center">
                <CTAButton href={p.amazonUrl} size="sm">
                  Amazon →
                </CTAButton>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
