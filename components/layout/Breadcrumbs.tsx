import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted flex-wrap">
      <Link prefetch={false} href="/" className="hover:text-brand transition-colors">
        Home
      </Link>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 opacity-40 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
            {isLast || !crumb.href ? (
              <span className={isLast ? "text-ink-secondary font-medium" : "hover:text-brand"}>
                {crumb.label}
              </span>
            ) : (
              <Link prefetch={false} href={crumb.href} className="hover:text-brand transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
