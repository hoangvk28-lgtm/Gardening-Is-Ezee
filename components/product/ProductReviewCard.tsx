import Image from "next/image";
import Link from "next/link";

export interface ReviewPro {
  text: string;
}

export interface ReviewCon {
  text: string;
  severity?: "minor" | "major"; // minor = yellow, major = red
}

export interface ProductReviewCardProps {
  rank: number;
  badge?: string; // e.g. "Top Pick", "Best Budget", "Best for Large Tablets"
  name: string;
  brand: string;
  imageUrl: string;
  imageAlt?: string;
  affiliateUrl: string;
  price: string;
  style?: string; // e.g. "Height and angle-adjustable, foldable"
  supportsCharging?: boolean;
  pros: ReviewPro[];
  cons: ReviewCon[];
  reviewText: string | string[]; // one or multiple paragraphs
  realPhotoUrl?: string;
  realPhotoAlt?: string;
  realPhotoCredit?: string;
  reviewSlug?: string; // if there's a full review page
  scoreOverall?: number;
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "Top Pick":       { bg: "#7c9068", text: "#fff" },
  "Best Budget":    { bg: "#5f7a4a", text: "#fff" },
  "Best Premium":   { bg: "#7c3aed", text: "#fff" },
  "Most Portable":  { bg: "#0891b2", text: "#fff" },
  "Best for Dorms": { bg: "#c9a876", text: "#fff" },
  "Editors' Choice":{ bg: "#dc2626", text: "#fff" },
};

export function ProductReviewCard({
  rank,
  badge,
  name,
  brand,
  imageUrl,
  imageAlt,
  affiliateUrl,
  price,
  style,
  supportsCharging,
  pros,
  cons,
  reviewText,
  realPhotoUrl,
  realPhotoAlt,
  realPhotoCredit,
  reviewSlug,
  scoreOverall,
}: ProductReviewCardProps) {
  const badgeStyle = badge ? (BADGE_COLORS[badge] ?? { bg: "#7c9068", text: "#fff" }) : null;
  const paragraphs = Array.isArray(reviewText) ? reviewText : [reviewText];

  return (
    <article className="mb-10 rounded-2xl border border-border bg-white overflow-hidden shadow-card">
      {/* ── Header bar ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 text-white"
          style={{ background: "#7c9068" }}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="font-bold text-ink text-base leading-tight hover:text-brand transition-colors"
            >
              <h3>{name}</h3>
            </a>
            {badge && badgeStyle && (
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                style={{ background: badgeStyle.bg, color: badgeStyle.text }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted mt-0.5">{brand}</p>
        </div>
        {scoreOverall !== undefined && (
          <div className="shrink-0 flex flex-col items-center">
            <span
              className="text-lg font-bold tabular-nums px-2.5 py-1 rounded-xl"
              style={{
                background: scoreOverall >= 8.5 ? "#dcfce7" : scoreOverall >= 7 ? "#fef9c3" : "#fee2e2",
                color: scoreOverall >= 8.5 ? "#5f7a4a" : scoreOverall >= 7 ? "#a8875a" : "#dc2626",
              }}
            >
              {scoreOverall.toFixed(1)}
            </span>
            <span className="text-[10px] text-ink-muted mt-0.5">/ 10</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* ── Image + price + CTA ── */}
        <div className="flex flex-col sm:flex-row gap-5 mb-5">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="shrink-0 flex items-center justify-center w-full sm:w-64 h-56 rounded-xl bg-bg border border-border overflow-hidden hover:opacity-90 transition-opacity"
          >
            <Image
              src={imageUrl}
              alt={imageAlt ?? name}
              width={240}
              height={200}
              className="object-contain w-full h-full p-3"
              unoptimized
            />
          </a>

          <div className="flex flex-col justify-between gap-3 flex-1 min-w-0">
            {/* Style spec */}
            {(style || supportsCharging !== undefined) && (
              <div className="text-xs text-ink-secondary leading-relaxed">
                {style && (
                  <span><strong className="text-ink">Style:</strong> {style}</span>
                )}
                {style && supportsCharging !== undefined && <span className="mx-2 text-border-dark">|</span>}
                {supportsCharging !== undefined && (
                  <span><strong className="text-ink">Supports Charging While in Stand:</strong> {supportsCharging ? "Yes" : "No"}</span>
                )}
              </div>
            )}

            {/* Pros / Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cta mb-2">Reasons to Buy</p>
                <ul className="space-y-1.5">
                  {pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-cta-light text-cta flex items-center justify-center shrink-0 font-bold text-[9px]">+</span>
                      {pro.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-dark mb-2">Reasons to Avoid</p>
                <ul className="space-y-1.5">
                  {cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                      <span
                        className="mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 font-bold text-[9px]"
                        style={{
                          background: con.severity === "major" ? "#fee2e2" : "#fef9c3",
                          color: con.severity === "major" ? "#dc2626" : "#a8875a",
                        }}
                      >
                        −
                      </span>
                      {con.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <a
                href={affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 text-white"
                style={{ background: "#FF9900" }}
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z"/>
                </svg>
                Check price on Amazon
              </a>
              {reviewSlug && (
                <Link prefetch={false}
                  href={`/reviews/${reviewSlug}`}
                  className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  Full review →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Review text ── */}
        <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* ── Real photo from buyer/tester ── */}
        {realPhotoUrl && (
          <figure className="mt-5">
            <div className="rounded-xl overflow-hidden border border-border">
              <Image
                src={realPhotoUrl}
                alt={realPhotoAlt ?? `${name} in real use`}
                width={800}
                height={450}
                className="w-full object-cover max-h-80"
                unoptimized
              />
            </div>
            {realPhotoCredit && (
              <figcaption className="text-[11px] text-ink-muted mt-2 text-right italic">
                {realPhotoCredit}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </article>
  );
}
