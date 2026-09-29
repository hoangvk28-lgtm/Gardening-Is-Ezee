import Image from "next/image";
import Link from "next/link";
import { ArticleMetadata } from "./ArticleMetadata";

interface FeaturedStoryProps {
  eyebrow: string;
  headline: string;
  dek: string;
  href: string;
  image?: string;
  imageAlt: string;
  byline: string;
  updated: string;
  readTime: string;
}

/** Editorial split hero: ~58% image, ~42% story. Image first on mobile. */
export function FeaturedStory(p: FeaturedStoryProps) {
  return (
    <section aria-labelledby="featured-story" className="grid gap-6 pt-4 sm:pt-6 lg:grid-cols-[58fr_42fr] lg:gap-12 lg:pt-8">
      <Link prefetch={false} href={p.href} tabIndex={-1} aria-hidden className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[#ebe7df] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/11]">
          {p.image && (
            <Image
              src={p.image}
              alt={p.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 740px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-col justify-center lg:py-6">
        <p className="eyebrow">{p.eyebrow}</p>
        <h1 id="featured-story" className="mt-3 text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
          <Link prefetch={false} href={p.href} className="text-ink transition-colors hover:text-brand focus-ring">
            {p.headline}
          </Link>
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed sm:text-lg">{p.dek}</p>
        <div className="mt-6 flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <ArticleMetadata author={p.byline} date={p.updated} datePrefix="Updated" readTime={p.readTime} />
          <Link
            prefetch={false}
            href={p.href}
            className="group inline-flex shrink-0 items-center gap-2 self-start bg-brand px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-brand-dark focus-ring sm:self-auto"
          >
            Read the guide
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
