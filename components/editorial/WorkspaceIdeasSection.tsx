import Link from "next/link";
import type { ArticleView } from "@/lib/homepage";
import { SectionHeader } from "./SectionHeader";
import { EditorialImage } from "./EditorialImage";

/** The most visual section: one tall lifestyle image beside a 2×2 of large images. */
export function WorkspaceIdeasSection({ title, href, articles }: { title: string; href: string; articles: ArticleView[] }) {
  if (articles.length === 0) return null;
  const [hero, ...rest] = articles;

  return (
    <section aria-labelledby="workspace-ideas-heading" className="py-12 lg:py-14">
      <SectionHeader
        id="workspace-ideas-heading"
        title={title}
        href={href}
        description="Raised beds, planters and composting for vegetables, herbs and flowers in any space."
      />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <article className="group relative">
          <EditorialImage src={hero.image} alt={hero.imageAlt} aspect="aspect-[4/3] lg:aspect-[6/5]" sizes="(max-width: 1024px) 100vw, 620px" />
          <p className="eyebrow mt-4">{hero.eyebrow}</p>
          <h3 className="mt-2 text-2xl leading-tight sm:text-[1.875rem]">
            <Link prefetch={false} href={hero.href} className="text-ink transition-colors group-hover:text-brand focus-ring after:absolute after:inset-0 after:content-['']">
              {hero.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2">{hero.excerpt}</p>
        </article>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {rest.map((a) => (
            <article key={a.slug} className="group relative">
              <EditorialImage src={a.image} alt={a.imageAlt} aspect="aspect-[4/3]" sizes="(max-width: 640px) 100vw, 300px" />
              <p className="eyebrow mt-3">{a.eyebrow}</p>
              <h3 className="mt-1.5 text-[1.25rem] leading-snug">
                <Link prefetch={false} href={a.href} className="text-ink transition-colors group-hover:text-brand focus-ring after:absolute after:inset-0 after:content-['']">
                  {a.title}
                </Link>
              </h3>
              <p className="mt-1.5 line-clamp-2 text-base">{a.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
