import Link from "next/link";
import type { ArticleView } from "@/lib/homepage";
import { EditorialImage } from "./EditorialImage";
import { ArticleMetadata } from "./ArticleMetadata";

const headlineLink =
  "text-ink transition-colors group-hover:text-brand focus-ring after:absolute after:inset-0 after:content-['']";

/** Lead story within a department: big image, larger headline, excerpt. */
export function ArticleCardLarge({ article, headingLevel = "h3" }: { article: ArticleView; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="group relative">
      <EditorialImage src={article.image} alt={article.imageAlt} aspect="aspect-[16/10]" sizes="(max-width: 1024px) 100vw, 640px" />
      <p className="eyebrow mt-4">{article.eyebrow}</p>
      <H className="mt-2 text-[1.625rem] leading-tight sm:text-[1.875rem]">
        <Link prefetch={false} href={article.href} className={headlineLink}>
          {article.title}
        </Link>
      </H>
      <p className="mt-3 line-clamp-3 text-base leading-relaxed">{article.excerpt}</p>
      <ArticleMetadata className="mt-3" author={article.author} date={article.date} />
    </article>
  );
}

/** Standard grid card: image, eyebrow, headline, excerpt, byline. */
export function ArticleCardMedium({
  article,
  showExcerpt = true,
  eager,
  className = "",
}: {
  article: ArticleView;
  showExcerpt?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return (
    <article className={`group relative ${className}`}>
      <EditorialImage eager={eager} src={article.image} alt={article.imageAlt} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 300px" />
      <p className="eyebrow mt-3">{article.eyebrow}</p>
      <h3 className="mt-1.5 text-[1.25rem] leading-snug">
        <Link prefetch={false} href={article.href} className={headlineLink}>
          {article.title}
        </Link>
      </h3>
      {showExcerpt && <p className="mt-2 line-clamp-3 text-base leading-relaxed">{article.excerpt}</p>}
      <ArticleMetadata className="mt-2.5" author={article.author} date={article.date} />
    </article>
  );
}

/**
 * Supporting story. Phones: full-width image above the headline (no tiny
 * thumbnails). From `sm`: text-led row with a thumbnail on the right.
 */
export function ArticleCardCompact({ article }: { article: ArticleView }) {
  return (
    <article className="group relative flex flex-col gap-3 py-5 sm:flex-row-reverse sm:items-start sm:gap-5 sm:py-4">
      <EditorialImage
        src={article.image}
        alt=""
        aspect="aspect-[3/2] sm:aspect-[4/3]"
        className="w-full shrink-0 sm:w-32"
        sizes="(max-width: 640px) 100vw, 128px"
      />
      <div className="min-w-0 flex-1">
        <p className="eyebrow">{article.eyebrow}</p>
        <h3 className="mt-1 text-[1.25rem] leading-snug sm:text-[1.125rem]">
          <Link prefetch={false} href={article.href} className={headlineLink}>
            {article.title}
          </Link>
        </h3>
        <ArticleMetadata className="mt-1.5" date={article.date} readTime={article.readTime} />
      </div>
    </article>
  );
}
