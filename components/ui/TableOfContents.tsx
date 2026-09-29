"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0% -75% 0%", threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-border bg-bg p-5 mb-8 max-w-3xl"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">
        In this guide
      </p>
      <ul className="space-y-1.5">
        {items.map(({ id, text, level }) => (
          <li key={id} className={level === 3 ? "pl-4" : ""}>
            <a
              href={`#${id}`}
              className={
                "text-sm leading-snug transition-colors " +
                (activeId === id
                  ? "text-brand font-semibold"
                  : "text-ink-secondary hover:text-brand")
              }
            >
              {level === 3 && (
                <span className="mr-1.5 text-xs text-ink-muted">&ndash;</span>
              )}
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
