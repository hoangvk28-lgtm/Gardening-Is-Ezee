"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { departmentNav, secondaryNav } from "@/data/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid h-10 w-10 place-items-center text-ink focus-ring"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="h-6 w-6">
          {open ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-border bg-bg lg:top-20"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-[1280px] px-4 pb-10 pt-4 sm:px-6">
            <p className="eyebrow !text-ink-secondary">Departments</p>
            <ul className="mt-2 divide-y divide-border border-b border-border">
              {departmentNav.map((item) => (
                <li key={item.href}>
                  <Link prefetch={false} href={item.href} onClick={() => setOpen(false)} className="block py-4 focus-ring">
                    <span className="block font-[family-name:var(--font-display)] text-2xl text-ink">{item.label}</span>
                    <span className="mt-0.5 block text-sm text-ink-secondary">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[0.9375rem]">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link prefetch={false} href={item.href} onClick={() => setOpen(false)} className="!text-ink font-medium focus-ring">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
