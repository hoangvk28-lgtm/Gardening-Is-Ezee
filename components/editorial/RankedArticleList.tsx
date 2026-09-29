import Link from "next/link";
import type { ArticleView } from "@/lib/homepage";
import { EditorialImage } from "./EditorialImage";
import { ArticleMetadata } from "./ArticleMetadata";

export function RankedArticleList({ id, title, articles }: { id: string; title: string; articles: ArticleView[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="border-b border-ink pb-3 text-[1.75rem]">
        {title}
      </h2>
      <ol className="divide-y divide-border">
        {articles.map((a, i) => (
          <li key={a.slug} className="group relative flex items-center gap-4 py-4">
            <span aria-hidden className="w-6 shrink-0 text-center font-[family-name:var(--font-display)] text-2xl text-ink-secondary">
              {i + 1}
            </span>
            <EditorialImage src={a.image} alt="" aspect="aspect-[4/3]" className="w-24 shrink-0" sizes="96px" />
            <div className="min-w-0">
              <h3 className="text-[1.0625rem] leading-snug">
                <Link
                  prefetch={false}
                  href={a.href}
                  className="text-ink transition-colors group-hover:text-brand focus-ring after:absolute after:inset-0 after:content-['']"
                >
                  <span className="sr-only">Number {i + 1}: </span>
                  {a.title}
                </Link>
              </h3>
              <ArticleMetadata className="mt-1" date={a.date} readTime={a.readTime} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
