import fs from "node:fs";
import path from "node:path";
import type { PublicGuide } from "@/lib/public-guides";
import type { Product } from "@/data/products";
import { canonicalGuidePath } from "@/lib/migrated-silos";
import type { ArticleFormat, HomepageArticleRef } from "@/data/homepage-editorial";

export interface ArticleView {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image?: string;
  imageAlt: string;
  eyebrow: string;
  author: string;
  date: string;
  readTime: string;
}

export interface PickView {
  id: string;
  name: string;
  image?: string;
  useCase: string;
  sentence: string;
  reviewHref: string;
  priceHref?: string;
}

function inferFormat(g: PublicGuide): ArticleFormat {
  if (/-vs-|explained|chart|guide$|kelvin|lumens|rule/.test(g.slug)) return "Explainer";
  if (/ideas|setup$/.test(g.slug)) return "Ideas";
  return "Buying Guide";
}

function normaliseImage(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return undefined;
}

/** The guide's canonical (200, no-redirect) URL. */
export function guideHref(g: PublicGuide): string {
  return canonicalGuidePath(g);
}

export function toArticleView(g: PublicGuide, format?: ArticleFormat): ArticleView {
  return {
    slug: g.slug,
    href: guideHref(g),
    title: g.title,
    excerpt: g.description,
    image: normaliseImage(g.thumbnailImage || g.heroImage),
    imageAlt: g.heroImageAlt || g.title,
    eyebrow: format ?? inferFormat(g),
    author: g.author,
    date: g.lastUpdated,
    readTime: g.readTime,
  };
}

/** Resolves slug refs against real guide data, skipping missing and already-used slugs. */
export function createResolver(all: PublicGuide[]) {
  const bySlug = new Map(all.map((g) => [g.slug, g]));
  const used = new Set<string>();
  return {
    first(candidates: string[]): PublicGuide | undefined {
      const g = candidates.map((s) => bySlug.get(s)).find((x) => x && !used.has(x.slug));
      if (g) used.add(g.slug);
      return g;
    },
    list(refs: HomepageArticleRef[]): ArticleView[] {
      return refs.flatMap((r) => {
        const g = bySlug.get(r.slug);
        if (!g || used.has(g.slug)) return [];
        used.add(g.slug);
        return [toArticleView(g, r.format)];
      });
    },
  };
}

export function toPickView(p: Product, useCase?: string): PickView {
  const sentence =
    p.reviewSummary?.split(/(?<=\.)\s/)[0] ||
    p.shortDescription ||
    (p.bestFor?.length ? `Best for ${p.bestFor.slice(0, 2).join(" and ").toLowerCase()}.` : "");
  return {
    id: p.id,
    name: p.name,
    image: normaliseImage(p.image),
    useCase: useCase || p.useCase || p.bestFor?.[0] || "Worth considering",
    sentence,
    reviewHref: `/reviews/${p.slug}`,
    priceHref: p.amazonUrl || undefined,
  };
}

/** Brand asset if present in /public, else undefined so callers can fall back. */
export function publicAsset(relPath: string): string | undefined {
  return fs.existsSync(path.join(process.cwd(), "public", relPath)) ? `/${relPath}` : undefined;
}
