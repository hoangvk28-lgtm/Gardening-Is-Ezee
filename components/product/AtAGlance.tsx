"use client";

import { useState } from "react";
import Image from "next/image";
import { withAmazonTag } from "@/lib/affiliate";
import type { ProductReviewCardProps } from "./ProductReviewCard";

interface AtAGlanceItem
  extends Pick<
    ProductReviewCardProps,
    "rank" | "badge" | "name" | "brand" | "imageUrl" | "affiliateUrl" | "price" | "pros" | "cons"
  > {
  anchorId: string; // matches the id on the full ProductReviewCard section
}

interface AtAGlanceProps {
  items: AtAGlanceItem[];
}

function AtAGlanceRow({ item }: { item: AtAGlanceItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      {/* Main row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 px-1 sm:flex-nowrap">
        {/* Thumbnail */}
        <div className="shrink-0 w-20 h-20 bg-surface overflow-hidden flex items-center justify-center">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="object-contain w-full h-full p-1"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-[10rem]">
          {item.badge && (
            <a
              href={`#${item.anchorId}`}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-brand hover:text-brand-dark transition-colors leading-tight block mb-1"
            >
              {item.badge}
            </a>
          )}
          <p className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-ink leading-snug line-clamp-2">{item.name}</p>
          <a
            href={`#${item.anchorId}`}
            className="text-sm text-ink-secondary hover:text-ink transition-colors mt-1 inline-block"
          >
            Our take ↓
          </a>
        </div>

        {/* CTA */}
        <a
          href={withAmazonTag(item.affiliateUrl)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="ml-24 shrink-0 whitespace-nowrap text-[0.9375rem] font-medium !text-ink sm:ml-0 underline decoration-border-dark underline-offset-4 hover:decoration-ink"
        >
          Check price
        </a>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-center gap-1.5 min-h-11 text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
      >
        {`${open ? "Hide" : "Show"} Pros & Cons`}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable pros/cons */}
      {open && (
        <div className="grid sm:grid-cols-2 gap-5 px-1 pb-5 pt-1">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink mb-2">Pros</p>
            <ul className="space-y-1.5">
              {item.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.9375rem] leading-snug text-ink">
                  <span aria-hidden className="font-semibold text-olive">+</span>
                  {pro.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink mb-2">Cons</p>
            <ul className="space-y-1.5">
              {item.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-[0.9375rem] leading-snug text-ink">
                  <span aria-hidden className={`font-semibold ${con.severity === "major" ? "text-score-low" : "text-ink-secondary"}`}>−</span>
                  {con.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function AtAGlance({ items }: AtAGlanceProps) {
  return (
    <div className="my-8 border-t border-ink">
      <h2 className="py-3 text-[1.5rem]">At a Glance</h2>

      {/* Rows */}
      <div className="border-t border-border">
        {items.map((item) => (
          <AtAGlanceRow key={item.rank} item={item} />
        ))}
      </div>
    </div>
  );
}

export type { AtAGlanceItem };
