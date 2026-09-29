"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "./Container";
import { mainNav } from "@/data/nav";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-brand text-ink-inverse text-xs py-1.5 px-4 flex items-center justify-center gap-2">
        <span className="opacity-90 hidden sm:inline">Gardening Is Ezee earns a commission on qualifying Amazon purchases.</span>
        <span className="opacity-90 sm:hidden text-[10px] leading-tight whitespace-nowrap">Amazon affiliate links - we earn a commission.</span>
        <Link prefetch={false}
          href="/affiliate-disclosure"
         
          className="shrink-0 font-semibold text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
        >
          Affiliate disclosure
        </Link>
      </div>

      {/* Main header */}
      <Container className="flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link prefetch={false}
          href="/"
          className="group shrink-0 focus-ring flex items-center gap-2"
          aria-label="Gardening Is Ezee - Home"
        >
          <Image
            src="/logo-icon.png"
            alt=""
            width={96}
            height={96}
            className="h-10 w-10 object-contain
              transition-transform duration-300 ease-out
              group-hover:scale-105 group-active:scale-95"
            priority
          />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            Gardening Is Ezee
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {mainNav.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link prefetch={false}
                href={item.href}
               
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-secondary rounded-md hover:text-brand hover:bg-brand-light transition-colors focus-ring"
              >
                {item.label}
                {item.children && (
                  <svg
                    className="w-3.5 h-3.5 mt-px opacity-60 group-hover:opacity-100 transition-transform group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {/* Dropdown */}
              {item.children && openDropdown === item.label && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-white rounded-xl shadow-card-hover border border-border py-2">
                    {item.children.map((child) => (
                      <Link prefetch={false}
                        key={child.href}
                        href={child.href}
                       
                        className="block px-4 py-2.5 hover:bg-bg transition-colors focus-ring"
                      >
                        <span className="block text-sm font-medium text-ink">
                          {child.label}
                        </span>
                        {child.description && (
                          <span className="block text-xs text-ink-muted mt-0.5">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link prefetch={false}
            href="/guide"
           
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent-light text-accent-dark rounded-full border border-accent/30 hover:bg-accent hover:text-white transition-colors"
          >
            <span className="text-base leading-none">🔥</span>
            All Guides
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-1.5 rounded-md hover:bg-bg transition-colors focus-ring"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform origin-center ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform origin-center ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white overflow-y-auto max-h-[calc(100svh-6rem)]">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {mainNav.map((item) => (
              <div key={item.label}>
                <Link prefetch={false}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                 
                  className="block px-3 py-2.5 text-sm font-semibold text-ink rounded-md hover:bg-bg transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 flex flex-col gap-0.5 mb-2">
                    {item.children.map((child) => (
                      <Link prefetch={false}
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                       
                        className="block px-3 py-2 text-sm text-ink-secondary rounded-md hover:bg-bg hover:text-brand transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <Link prefetch={false}
                href="/guide"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-accent-dark hover:bg-accent-light rounded-md transition-colors"
              >
                All Guides
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
