import Link from "next/link";
import { departmentNav } from "@/data/nav";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden className="h-5 w-5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

// Server component; only the mobile menu toggle ships JS.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Wordmark />

        <nav aria-label="Departments" className="hidden lg:block">
          <ul className="flex items-center gap-4 whitespace-nowrap xl:gap-7">
            {departmentNav.map((item) => (
              <li key={item.href}>
                <Link
                  prefetch={false}
                  href={item.href}
                  className="text-[0.875rem] font-medium xl:text-[0.9375rem] !text-ink underline-offset-[6px] decoration-brand decoration-2 hover:underline focus-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            prefetch={false}
            href="/guide"
            aria-label="Search guides"
            className="grid h-10 w-10 place-items-center !text-ink hover:!text-brand focus-ring"
          >
            <SearchIcon />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
