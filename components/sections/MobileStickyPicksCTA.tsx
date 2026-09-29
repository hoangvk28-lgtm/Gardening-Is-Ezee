"use client";

import { useEffect, useState } from "react";

interface MobileStickyPicksCTAProps {
  label?: string;
  targetId?: string;
}

export function MobileStickyPicksCTA({
  label = "View top picks",
  targetId = "picks",
}: MobileStickyPicksCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 320);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe-area-inset-bottom"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
    >
      <div className="flex items-center gap-2 bg-ink/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-white/10 mb-1">
        <a
          href={`#${targetId}`}
          className="flex-1 text-center text-sm font-semibold text-white"
        >
          {label} ↑
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/50 hover:text-white/80 transition-colors text-lg leading-none ml-1 shrink-0"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
