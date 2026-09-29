import Link from "next/link";
import { DISCLOSURE_SHORT } from "@/lib/affiliate";
import { clsx } from "@/lib/utils";

interface AffiliateDisclosureBarProps {
  variant?: "inline" | "banner";
  className?: string;
  disclosureText?: string;
}

export function AffiliateDisclosureBar({
  variant = "inline",
  className,
  disclosureText,
}: AffiliateDisclosureBarProps) {
  const text = disclosureText ?? DISCLOSURE_SHORT;

  if (variant === "banner") {
    return (
      <div
        className={clsx(
          "flex items-start gap-2 px-3 py-2 bg-brand-light border border-brand-muted rounded-lg w-full",
          className
        )}
      >
        <svg
          className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-brand leading-relaxed flex-1 min-w-0">
          <span className="font-semibold">Affiliate Disclosure:</span>{" "}
          We may earn a small commission on qualifying Amazon purchases at no extra cost to you.{" "}
          <Link prefetch={false}
            href="/affiliate-disclosure"
            className="font-semibold underline underline-offset-2 hover:no-underline whitespace-nowrap"
          >
            Full disclosure →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <p className={clsx("text-xs text-ink-muted", className)}>
      {text}{" "}
      <Link prefetch={false}
        href="/affiliate-disclosure"
        className="underline underline-offset-2 hover:text-brand transition-colors"
      >
        Affiliate disclosure
      </Link>
    </p>
  );
}
