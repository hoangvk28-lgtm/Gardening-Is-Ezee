"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

/** Desktop: sticky "On This Page" rail with the current section highlighted. */
export function GuideTocSidebar({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items);
  return (
    <nav aria-labelledby="toc-heading" className="sticky top-28">
      <h2 id="toc-heading" className="eyebrow !text-ink-secondary">On This Page</h2>
      <ol className="mt-3 border-l border-border">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-[0.9375rem] leading-snug focus-ring ${
                  isActive ? "border-ink font-medium !text-ink" : "border-transparent !text-ink-secondary hover:!text-ink"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Mobile/tablet: compact sticky "Jump to" disclosure that closes after a choice. */
export function GuideJumpTo({ items }: { items: TocItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const active = useActiveSection(items);
  const current = items.find((i) => i.id === active)?.label;

  return (
    <details ref={ref} className="group sticky top-16 z-30 -mx-4 border-y border-border bg-bg/95 backdrop-blur-sm sm:-mx-6">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[0.9375rem] focus-ring sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 truncate">
          <span className="font-semibold text-ink">Jump to</span>
          {current && <span className="text-ink-secondary"> · {current}</span>}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ol className="max-h-[60svh] overflow-y-auto border-t border-border px-4 pb-3 sm:px-6">
        {items.map((item) => (
          <li key={item.id} className="border-b border-border last:border-0">
            <a
              href={`#${item.id}`}
              onClick={() => ref.current?.removeAttribute("open")}
              className="block py-3 text-base !text-ink focus-ring"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

function useActiveSection(items: TocItem[]) {
  const [active, setActive] = useState<string | undefined>(undefined);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);
  return active;
}
