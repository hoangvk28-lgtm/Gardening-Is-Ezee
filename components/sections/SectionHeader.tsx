import Link from "next/link";
import { clsx } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 mb-8",
        centered ? "items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-brand">
          {eyebrow}
        </span>
      )}
      <div
        className={clsx(
          "flex items-end justify-between w-full gap-4",
          centered && "flex-col items-center"
        )}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
          {title}
        </h2>
        {href && !centered && (
          <Link prefetch={false}
            href={href}
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors shrink-0 flex items-center gap-1"
          >
            {hrefLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>
      {description && (
        <p className={clsx("text-ink-secondary text-base leading-relaxed", centered ? "max-w-2xl" : "max-w-3xl")}>
          {description}
        </p>
      )}
      {href && centered && (
        <Link prefetch={false}
          href={href}
          className="mt-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          {hrefLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
