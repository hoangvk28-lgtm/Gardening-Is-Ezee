"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { scoreToColor, scoreToBarColor } from "@/lib/utils";

type SortKey = "overall" | "valueForMoney" | "smallSpaceFit" | "buildQuality" | "easeOfUse";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "overall", label: "Overall Score" },
  { key: "valueForMoney", label: "Value for Money" },
  { key: "smallSpaceFit", label: "Small-Space Fit" },
  { key: "buildQuality", label: "Build Quality" },
  { key: "easeOfUse", label: "Ease of Use" },
];

const SCORE_COLS: { key: SortKey; label: string; short: string }[] = [
  { key: "overall",       label: "Overall",          short: "Overall" },
  { key: "smallSpaceFit", label: "Small-Space Fit",  short: "Space" },
  { key: "buildQuality",  label: "Build Quality",    short: "Build" },
  { key: "easeOfUse",     label: "Ease of Use",      short: "Ease" },
  { key: "valueForMoney", label: "Value for Money",  short: "Value" },
];

interface Props {
  products: Product[];
  categories: Category[];
  lockedCategorySlug?: string; // set on [categorySlug] pages - disables category filter
}

function ComparePageInner({ products, categories, lockedCategorySlug }: Props) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(lockedCategorySlug ?? "all");
  const [sortBy, setSortBy] = useState<SortKey>("overall");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let base =
      selectedCategory === "all"
        ? products
        : products.filter((p) => p.categorySlug === selectedCategory || p.subcategorySlug === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.subcategorySlug.replace(/-/g, " ").includes(q) ||
          p.categorySlug.replace(/-/g, " ").includes(q) ||
          p.bestFor.some((b) => b.toLowerCase().includes(q))
      );
    }

    return [...base].sort((a, b) => b.scores[sortBy] - a.scores[sortBy]);
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <div>
      {/* Inline search bar */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Category filter */}
        {!lockedCategorySlug && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-secondary uppercase tracking-wide">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === "all"
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-ink-secondary border-border hover:border-brand hover:text-brand"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === cat.slug
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-ink-secondary border-border hover:border-brand hover:text-brand"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort-select" className="text-xs font-semibold text-ink-secondary uppercase tracking-wide">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-ink-muted ml-auto self-end pb-1">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Full comparison table ── */}
      <div id="table" className="mb-14 overflow-x-auto rounded-card border border-border">
        <table className="w-full text-sm" style={{ minWidth: "720px" }}>
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide w-52">
                Product
              </th>
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide hidden md:table-cell w-36">
                Category
              </th>
              <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide hidden lg:table-cell">
                Best For
              </th>
              {SCORE_COLS.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-center font-semibold text-xs uppercase tracking-wide whitespace-nowrap ${
                    col.key === sortBy ? "text-brand" : "text-ink-secondary"
                  }`}
                >
                  <button
                    onClick={() => setSortBy(col.key)}
                    className="hover:text-brand transition-colors flex items-center gap-1 mx-auto"
                    title={`Sort by ${col.label}`}
                  >
                    {col.short}
                    {col.key === sortBy && <span className="text-brand">↓</span>}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-ink-secondary text-xs uppercase tracking-wide">
                Buy
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => {
              const cat = categories.find((c) => c.slug === product.categorySlug);
              return (
                <tr
                  key={product.id}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-brand-light/20 ${
                    i % 2 === 0 ? "bg-white" : "bg-bg/40"
                  }`}
                >
                  {/* Product */}
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        {product.badge && (
                          <div className="mb-1">
                            <Badge>{product.badge}</Badge>
                          </div>
                        )}
                        <Link prefetch={false}
                          href={`/reviews/${product.slug}`}
                          className="font-semibold text-ink hover:text-brand transition-colors text-sm leading-snug block"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 align-top hidden md:table-cell">
                    {cat ? (
                      <Link prefetch={false}
                        href={`/categories/${cat.slug}`}
                        className="text-xs text-brand hover:text-brand-dark font-medium transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-muted">-</span>
                    )}
                  </td>

                  {/* Best For */}
                  <td className="px-4 py-4 align-top hidden lg:table-cell">
                    <p className="text-xs text-ink-secondary leading-relaxed max-w-[200px]">
                      {product.bestFor[0] ?? "-"}
                    </p>
                  </td>

                  {/* Score columns */}
                  {SCORE_COLS.map((col) => (
                    <td key={col.key} className="px-3 py-4 text-center align-top">
                      <span
                        className={`font-bold tabular-nums text-sm ${scoreToColor(product.scores[col.key])} ${
                          col.key === sortBy ? "underline decoration-dotted" : ""
                        }`}
                      >
                        {product.scores[col.key].toFixed(1)}
                      </span>
                    </td>
                  ))}

                  {/* CTA */}
                  <td className="px-4 py-4 text-center align-top">
                    <CTAButton href={product.amazonUrl} size="sm">
                      Check price
                    </CTAButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-ink-muted">
            No products found for this filter.
          </div>
        )}

        {/* Mobile hint */}
        <p className="md:hidden text-xs text-ink-muted px-4 py-2.5 border-t border-border bg-bg">
          Scroll right to see all score columns. Tap a product name to read the full review.
        </p>
      </div>

      {/* ── Product cards ── */}
      <div id="cards">
        <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">Browse All Products</h2>
        <p className="text-sm text-ink-secondary mb-6">
          Click any card to read the full review. Scores are on a 1–10 scale.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} categories={categories} sortBy={sortBy} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Product card sub-component ────────────────────────────────────────────────

export function ComparePageClient(props: Props) {
  return (
    <Suspense fallback={<div className="py-8 text-center text-ink-muted text-sm">Loading…</div>}>
      <ComparePageInner {...props} />
    </Suspense>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${scoreToBarColor(score)}`}
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
  );
}

function ProductCard({
  product,
  categories,
  sortBy,
}: {
  product: Product;
  categories: Category[];
  sortBy: SortKey;
}) {
  const cat = categories.find((c) => c.slug === product.categorySlug);

  return (
    <div className="rounded-card border border-border bg-white overflow-hidden hover:border-brand/40 hover:shadow-sm transition-all group">
      {/* Top bar */}
      <div className="px-4 py-3 border-b border-border bg-bg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {product.badge && <Badge>{product.badge}</Badge>}
          {cat && (
            <Link prefetch={false}
              href={`/categories/${cat.slug}`}
              className="text-xs text-ink-muted hover:text-brand transition-colors truncate"
            >
              {cat.name}
            </Link>
          )}
        </div>
        <span className={`font-bold tabular-nums text-lg shrink-0 ${scoreToColor(product.scores.overall)}`}>
          {product.scores.overall.toFixed(1)}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-3">
        <Link prefetch={false} href={`/reviews/${product.slug}`}>
          <h3 className="font-semibold text-ink text-sm leading-snug group-hover:text-brand transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-ink-secondary leading-relaxed mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Score bars for 3 key dims */}
        <div className="space-y-2 mb-4">
          {SCORE_COLS.filter((c) => c.key !== "overall").map((col) => (
            <div key={col.key} className="flex items-center gap-2">
              <span
                className={`text-xs w-14 shrink-0 ${
                  col.key === sortBy ? "font-semibold text-brand" : "text-ink-muted"
                }`}
              >
                {col.short}
              </span>
              <ScoreBar score={product.scores[col.key]} />
              <span className={`text-xs tabular-nums w-7 text-right shrink-0 font-medium ${scoreToColor(product.scores[col.key])}`}>
                {product.scores[col.key].toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Link prefetch={false}
              href={`/reviews/${product.slug}`}
              className="text-xs font-medium text-brand hover:text-brand-dark transition-colors"
            >
              Review →
            </Link>
            <CTAButton href={product.amazonUrl} size="sm" variant="amazon">
              Buy
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
