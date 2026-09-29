import Image from "next/image";
import { AMAZON_TAG } from "@/lib/affiliate";
import { clsx } from "@/lib/utils";

type BountyVariant = "prime" | "primeYoungAdults" | "haul";

interface AmazonBountyBannerProps {
  variant?: BountyVariant;
  className?: string;
}

const VARIANTS: Record<
  BountyVariant,
  {
    eyebrow: string;
    heading: string;
    body: string;
    cta: string;
    href: string;
  }
> = {
  prime: {
    eyebrow: "Amazon Prime",
    heading: "New to Amazon Prime?",
    body: "Get fast, free shipping on every pick in this guide, plus Prime Video and exclusive deals.",
    cta: "Try Prime Free",
    href: `https://www.amazon.com/amazonprime?tag=${AMAZON_TAG}`,
  },
  primeYoungAdults: {
    eyebrow: "Prime for Young Adults",
    heading: "Student or 18-24? Save more.",
    body: "Get Prime free for 6 months, then 50% off, plus 5% cash back on electronics and more.",
    cta: "Check Eligibility",
    href: `https://www.amazon.com/primeyoungadult?tag=${AMAZON_TAG}`,
  },
  haul: {
    eyebrow: "Amazon Haul",
    heading: "Want it even cheaper?",
    body: "Browse budget-friendly finds available through Amazon Haul.",
    cta: "Shop Amazon Haul",
    href: `https://www.amazon.com/haul?tag=${AMAZON_TAG}`,
  },
};

export function AmazonBountyBanner({ variant = "prime", className }: AmazonBountyBannerProps) {
  const v = VARIANTS[variant];

  return (
    <a
      href={v.href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-border mb-8 block w-full h-[110px] sm:h-auto sm:aspect-[6/1]",
        "transition-shadow hover:shadow-md",
        className
      )}
    >
      <Image
        src="/images/banners/banner-deskfinds-v2.webp"
        alt="Gardening Is Ezee desk setup with docking station"
        fill
        priority={false}
        quality={90}
        sizes="(max-width: 640px) 100vw, 900px"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-4/5 sm:w-3/5 bg-gradient-to-r from-white via-white/85 to-transparent"
        aria-hidden="true"
      />

      <div className="relative h-full flex flex-col justify-center gap-1 p-4 sm:p-5 max-w-[72%] sm:max-w-[55%]">
        <span className="inline-block w-fit text-[10px] font-bold uppercase tracking-widest text-accent-dark">
          {v.eyebrow}
        </span>
        <h3 className="text-sm sm:text-base font-bold leading-snug text-ink">{v.heading}</h3>
        <p className="hidden sm:block text-xs text-ink-secondary leading-relaxed max-w-md">{v.body}</p>

        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-btn bg-accent text-white font-semibold text-xs px-4 py-2 min-h-[36px] group-hover:bg-accent-dark transition-colors shadow-sm whitespace-nowrap w-fit">
          {v.cta}
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </span>
      </div>
    </a>
  );
}
