import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";
import { getPublicGuides } from "@/lib/public-guides";
import { categories } from "@/data/categories";
import { canonicalGuideHref } from "@/lib/migrated-silos";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "All Buying Guides – Complete List",
  description:
    "Browse every Gardening Is Ezee buying guide across lawn care, tools, watering, growing, cleanup and outdoor living.",
  path: "/guide/all",
});

export default async function AllGuidesPage() {
  const guides = await getPublicGuides();

  const guidesByCategory = categories
    .map((cat) => ({
      category: cat,
      guides: guides.filter((g) => g.subcategorySlug === cat.slug),
    }))
    .filter((c) => c.guides.length > 0);

  const knownSlugs = new Set(categories.map((c) => c.slug));
  const uncategorised = guides.filter((g) => !knownSlugs.has(g.subcategorySlug));

  return (
    <Container className="py-14">
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-8">
        <Link prefetch={false} href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link prefetch={false} href="/guide" className="hover:text-brand transition-colors">Buying Guides</Link>
        <span>/</span>
        <span className="text-ink">All Guides</span>
      </nav>

      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Complete List</span>
        <h1 className="text-4xl font-bold text-ink mt-3 mb-4 tracking-tight">All Buying Guides</h1>
        <p className="text-lg text-ink-secondary leading-relaxed">
          Every guide we&apos;ve published — {guides.length} guides across all categories. Organized by use case below.
        </p>
      </div>

      {/* Category jump links */}
      <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-border">
        {guidesByCategory.map(({ category }) => (
          <a
            key={category.slug}
            href={`#cat-${category.slug}`}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-border text-ink-secondary hover:text-brand hover:border-brand transition-colors"
          >
            {category.name}
          </a>
        ))}
      </div>

      <div className="space-y-14">
        {guidesByCategory.map(({ category, guides: catGuides }) => (
          <section key={category.slug} id={`cat-${category.slug}`} aria-labelledby={`h-${category.slug}`} className="scroll-mt-20">
            <div className="mb-6">
              <h2 id={`h-${category.slug}`} className="text-2xl font-bold text-ink tracking-tight mb-1">
                {category.name}
              </h2>
              <p className="text-sm text-ink-secondary max-w-2xl">{category.shortDescription}</p>
              <p className="text-xs text-ink-muted mt-1">{catGuides.length} guides</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {catGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link prefetch={false}
                    href={canonicalGuideHref(guide)}
                    className="group flex items-baseline gap-2 py-1.5 border-b border-border/60 hover:border-brand/40 transition-colors"
                  >
                    <span className="text-sm text-ink group-hover:text-brand transition-colors leading-snug">
                      {guide.title}
                    </span>
                    <span className="text-xs text-ink-muted shrink-0 ml-auto">{guide.readTime}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {uncategorised.length > 0 && (
          <section id="cat-other" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-ink tracking-tight mb-6">More Guides</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {uncategorised.map((guide) => (
                <li key={guide.slug}>
                  <Link prefetch={false} href={canonicalGuideHref(guide)}
                    className="group flex items-baseline gap-2 py-1.5 border-b border-border/60 hover:border-brand/40 transition-colors">
                    <span className="text-sm text-ink group-hover:text-brand transition-colors leading-snug">{guide.title}</span>
                    <span className="text-xs text-ink-muted shrink-0 ml-auto">{guide.readTime}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="pt-6 border-t border-border text-center">
          <Link prefetch={false} href="/guide" className="text-sm font-semibold text-brand hover:underline">
            ← Back to Buying Guides
          </Link>
        </div>
      </div>
    </Container>
  );
}
