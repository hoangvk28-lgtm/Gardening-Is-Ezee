import Link from "next/link";

/** Site-wide affiliate disclosure, shown directly under the header on every page. */
export function SiteDisclosureBar() {
  return (
    <div className="border-b border-border bg-[#eef0e6]">
      <p className="mx-auto max-w-[1280px] px-4 py-2.5 text-center text-[0.8125rem] leading-snug !text-ink-secondary sm:px-6 lg:px-8">
        We research everything we recommend. When you buy through our links, we may earn a commission.{" "}
        <Link prefetch={false} href="/affiliate-disclosure" className="whitespace-nowrap font-medium !text-ink hover:underline focus-ring">
          Learn more <span aria-hidden>›</span>
        </Link>
      </p>
    </div>
  );
}
