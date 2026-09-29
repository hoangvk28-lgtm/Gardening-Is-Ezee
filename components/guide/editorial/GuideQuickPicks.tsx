import type { GuideProduct } from "@/components/guide/RichGuidePage";
import { withAmazonTag } from "@/lib/affiliate";
import { SafeImage } from "@/components/editorial/SafeImage";

const priceLinkClass =
  "whitespace-nowrap text-[0.9375rem] font-medium !text-ink underline decoration-border-dark underline-offset-4 hover:decoration-ink focus-ring";

function Thumb({ src, alt, size }: { src: string; alt: string; size: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-surface ${size}`}>
      {src && <SafeImage src={src} alt={alt} fill sizes="96px" className="object-contain p-1.5" unoptimized />}
    </div>
  );
}

/**
 * Quick Picks — a real comparison table on desktop, a readable stacked list on
 * phones/tablets. Never a squeezed multi-column table on small screens.
 */
export function GuideQuickPicks({ products }: { products: GuideProduct[] }) {
  const hasSummaries = products.some((p) => p.summary);
  return (
    <>
      {/* ── md and below: stacked list ── */}
      <ol className="divide-y divide-border border-y border-border lg:hidden">
        {products.map((p) => (
          <li key={p.id} className="flex gap-4 py-5">
            <Thumb src={p.imageUrl} alt="" size="h-20 w-20" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{p.badge}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-[1.125rem] font-semibold leading-snug text-ink">
                {p.name}
              </p>
              {p.summary && <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink">{p.summary}</p>}
              {p.bestFor && (
                <p className={`mt-1.5 text-[0.9375rem] leading-snug ${p.summary ? "" : "line-clamp-2"}`}>
                  {p.summary && <span className="font-semibold text-ink">Best for: </span>}
                  {p.bestFor}
                </p>
              )}
              <p className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1">
                <a href={`#${p.id}`} className="text-[0.9375rem] font-medium focus-ring">
                  Our take <span aria-hidden>↓</span>
                </a>
                <a href={withAmazonTag(p.amazonUrl)} target="_blank" rel="nofollow sponsored noopener noreferrer" className={priceLinkClass}>
                  Check price<span className="sr-only"> for {p.name} (opens in a new tab)</span>
                </a>
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* ── lg and up: comparison table ── */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink text-[0.8125rem] uppercase tracking-[0.08em] text-ink-secondary">
              <th scope="col" className="py-3 pr-4 font-semibold">Pick</th>
              {hasSummaries && <th scope="col" className="py-3 pr-4 font-semibold">Why it’s here</th>}
              <th scope="col" className="py-3 pr-4 font-semibold">Best for</th>
              {!hasSummaries && <th scope="col" className="py-3 pr-4 font-semibold">Key spec</th>}
              <th scope="col" className="py-3 font-semibold"><span className="sr-only">Price</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="align-top">
                <th scope="row" className="py-4 pr-4 font-normal">
                  <a href={`#${p.id}`} className="group flex items-start gap-4 focus-ring">
                    <Thumb src={p.imageUrl} alt="" size="h-16 w-16" />
                    <span className="min-w-0">
                      <span className="eyebrow block">{p.badge}</span>
                      <span className="mt-1 block font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-brand">
                        {p.name}
                      </span>
                    </span>
                  </a>
                </th>
                {hasSummaries && <td className="py-4 pr-4 text-[0.9375rem] leading-snug text-ink">{p.summary ?? "—"}</td>}
                <td className="py-4 pr-4 text-[0.9375rem] leading-snug text-ink-secondary">{p.bestFor}</td>
                {!hasSummaries && <td className="py-4 pr-4 text-[0.9375rem] leading-snug text-ink-secondary">{p.specs[0] ?? "—"}</td>}
                <td className="py-4 text-right">
                  <a href={withAmazonTag(p.amazonUrl)} target="_blank" rel="nofollow sponsored noopener noreferrer" className={priceLinkClass}>
                    Check price<span className="sr-only"> for {p.name} (opens in a new tab)</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
