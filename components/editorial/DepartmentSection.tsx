import Link from "next/link";
import type { ArticleView } from "@/lib/homepage";
import { SectionHeader } from "./SectionHeader";
import { ArticleCardLarge, ArticleCardCompact, ArticleCardMedium } from "./ArticleCards";

interface DepartmentSectionProps {
  id: string;
  title: string;
  href: string;
  topics?: string[];
  articles: ArticleView[];
  /** "lead": one large story + compact list. "grid": equal columns. */
  layout?: "lead" | "grid";
}

/** One data-driven section used for every topical department on the homepage. */
export function DepartmentSection({ id, title, href, topics, articles, layout = "lead" }: DepartmentSectionProps) {
  if (articles.length === 0) return null;
  const headingId = `${id}-heading`;
  const [lead, ...rest] = articles;

  return (
    <section aria-labelledby={headingId} className="py-12 lg:py-14">
      <SectionHeader id={headingId} title={title} href={href} />

      {topics && topics.length > 0 && (
        <ul className="no-scrollbar -mt-2 mb-7 flex gap-x-5 gap-y-1 overflow-x-auto whitespace-nowrap text-sm text-ink-secondary sm:flex-wrap">
          {topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {layout === "lead" ? (
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
          <ArticleCardLarge article={lead} />
          <div className="divide-y divide-border border-t border-border lg:border-t-0">
            {rest.map((a) => (
              <ArticleCardCompact key={a.slug} article={a} />
            ))}
            <p className="pt-4">
              <Link prefetch={false} href={href} className="group text-sm font-medium focus-ring">
                More in {title}
                <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {articles.map((a) => (
            <ArticleCardMedium key={a.slug} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}
