import Link from "next/link";

interface SectionHeaderProps {
  id: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  description?: string;
  size?: "lg" | "md";
}

/** "Title ………… View all →" over a thin rule. */
export function SectionHeader({ id, title, href, hrefLabel = "View all", description, size = "lg" }: SectionHeaderProps) {
  return (
    <div className="mb-6 border-b border-ink pb-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className={`min-w-0 ${size === "lg" ? "text-[1.5rem] min-[360px]:text-[1.75rem] sm:text-[2rem]" : "text-2xl"}`}>
          {title}
        </h2>
        {href && (
          <Link
            prefetch={false}
            href={href}
            className="group shrink-0 text-sm font-medium !text-brand focus-ring"
          >
            {hrefLabel}
            <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
            <span className="sr-only"> {title}</span>
          </Link>
        )}
      </div>
      {description && <p className="mt-1 text-base text-ink-secondary">{description}</p>}
    </div>
  );
}
