import Link from "next/link";
import { departmentNav, companyNav, secondaryNav } from "@/data/nav";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink bg-bg">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[4fr_2fr_2fr_2fr]">
          <div className="col-span-2 md:col-span-1">
            <Wordmark size="sm" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              Straightforward garden and yard guides, so you can buy the right tool the first time.
            </p>
          </div>
          <nav aria-labelledby="footer-departments">
            <h2 id="footer-departments" className="eyebrow !text-ink-secondary">Departments</h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {departmentNav.map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href} className="!text-ink hover:!text-brand focus-ring">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-formats">
            <h2 id="footer-formats" className="eyebrow !text-ink-secondary">Formats</h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {secondaryNav.map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href} className="!text-ink hover:!text-brand focus-ring">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="eyebrow !text-ink-secondary">The Journal</h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {companyNav.map((l) => (
                <li key={l.label}>
                  <Link prefetch={false} href={l.href} className="!text-ink hover:!text-brand focus-ring">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-ink-secondary sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl !text-sm">
            Gardening Is Ezee is reader-supported. When you buy through links on our site, we may earn an affiliate
            commission at no extra cost to you. This never influences what we recommend.{" "}
            <Link prefetch={false} href="/affiliate-disclosure" className="underline underline-offset-2 focus-ring">
              Affiliate disclosure
            </Link>
          </p>
          <p className="shrink-0 !text-sm">© {year} Gardening Is Ezee</p>
        </div>
      </div>
    </footer>
  );
}
