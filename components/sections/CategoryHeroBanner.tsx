import Link from "next/link";
import type { Category } from "@/data/categories";
import { amazonSearchLinks } from "@/lib/amazon-links";

// Per-category config: tagline, stats, icon emoji, top pick hint
const categoryConfig: Record<string, {
  tagline: string;
  icon: string;
  guideCount: number;
  highlights: string[];
}> = {
  "desk-setup": {
    tagline: "Best gear for compact desks & small workspaces",
    icon: "🖥️",
    guideCount: 4,
    highlights: ["Desk Lamps", "Monitor Stands", "Laptop Stands", "Cable Management"],
  },
  "dorm-essentials": {
    tagline: "Space-saving picks for a smaller workspace footprint",
    icon: "📐",
    guideCount: 3,
    highlights: ["Cable Management", "Desk Lamps", "Power Strips"],
  },
  "small-room-storage": {
    tagline: "Maximize every inch of your small space",
    icon: "📦",
    guideCount: 2,
    highlights: ["Under-Bed Storage", "Storage Carts"],
  },
  "compact-home-office": {
    tagline: "Setup ideas and gear for a real working home office",
    icon: "💼",
    guideCount: 4,
    highlights: ["Monitor Stands", "Laptop Stands", "Desk Lamps", "Cable Mgmt"],
  },
  "budget-finds": {
    tagline: "High-value small-space products under $30, $50, $100",
    icon: "🏷️",
    guideCount: 4,
    highlights: ["Under $30", "Under $50", "Under $100", "Best Value"],
  },
};

interface CategoryHeroBannerProps {
  category: Category;
  productCount: number;
  guideCount: number;
  topProductName?: string;
  topProductScore?: number;
  topProductSlug?: string;
}

export function CategoryHeroBanner({
  category,
  productCount,
  guideCount,
  topProductName,
  topProductScore,
  topProductSlug,
}: CategoryHeroBannerProps) {
  const config = categoryConfig[category.slug] ?? {
    tagline: category.shortDescription,
    icon: "📋",
    guideCount,
    highlights: category.subcategories,
  };

  return (
    <div
      className="rounded-2xl overflow-hidden mb-8"
      style={{ background: `linear-gradient(135deg, ${category.color}12 0%, ${category.color}06 100%)`, border: `1px solid ${category.color}25` }}
    >
      {/* Main banner content */}
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

          {/* Left: icon + name + tagline */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-2xl" aria-hidden="true">{config.icon}</span>
              <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight leading-tight">
                {category.name}
              </h1>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-lg">
              {config.tagline}
            </p>
          </div>

          {/* Right: stats chips */}
          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ background: `${category.color}18`, color: category.color }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {productCount} product{productCount !== 1 ? "s" : ""} reviewed
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ background: `${category.color}18`, color: category.color }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              {guideCount} buying guide{guideCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Top pick bar */}
        {topProductName && topProductSlug && (
          <Link prefetch={false}
            href={`/reviews/${topProductSlug}`}
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-90 group"
            style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
              style={{ background: category.color, color: "#fff" }}
            >
              Top Pick
            </span>
            <span className="text-sm font-semibold text-ink truncate flex-1 group-hover:text-brand transition-colors">
              {topProductName}
            </span>
            {topProductScore !== undefined && (
              <span
                className="text-sm font-bold tabular-nums shrink-0 px-2 py-0.5 rounded-lg"
                style={{ background: `${category.color}25`, color: category.color }}
              >
                {topProductScore.toFixed(1)}
              </span>
            )}
            <svg className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: category.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Amazon shop button */}
      {amazonSearchLinks[category.slug] && (
        <div className="px-5 pb-4 sm:px-7">
          <a
            href={amazonSearchLinks[category.slug]}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ background: category.color, color: "#fff" }}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z"/>
            </svg>
            Shop {category.name} Finds on Amazon
          </a>
        </div>
      )}

      {/* Bottom: highlights pills */}
      <div
        className="px-5 py-3 sm:px-7 flex flex-wrap items-center gap-2"
        style={{ borderTop: `1px solid ${category.color}20`, background: `${category.color}08` }}
      >
        <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide mr-1 shrink-0">Covers:</span>
        {config.highlights.map((h) => (
          <span
            key={h}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: `${category.color}15`, color: category.color }}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
