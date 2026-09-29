import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getPublicGuideBySlug, getPublicGuideSlugs, getPublicGuides } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { categories, getCategoryBySlug } from "@/data/categories";
import { guideDataLoaders } from "@/data/guides-index.generated";
import { RichGuidePage } from "@/components/guide/RichGuidePage";
import { GuideDetail } from "@/components/guide/GuideDetail";
import { siloForGuide } from "@/lib/migrated-silos";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const [guideSlugs] = await Promise.all([getPublicGuideSlugs()]);
  const categorySlugs = categories.map((c) => c.slug);

  // Slugs that already have a dedicated static route at app/(site)/guide/<slug>/page.tsx
  // are fully handled by that literal route and must be excluded here. Including them
  // causes this dynamic route to rebuild (and ISR-write) the same page a second time on
  // every deploy, needlessly multiplying Vercel Fast Data Cache read/write usage across
  // 1500+ guides.
  const fs = await import("fs");
  const path = await import("path");
  const guideDir = path.join(process.cwd(), "app", "(site)", "guide");
  let staticRouteSlugs = new Set<string>();
  try {
    staticRouteSlugs = new Set(
      fs
        .readdirSync(guideDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("[") && !d.name.startsWith("("))
        .map((d) => d.name)
    );
  } catch {
    // If the directory can't be read for any reason, fall back to including everything
    // rather than silently dropping legitimate DB-only guides.
  }

  // Slugs backed by a rich data/guides/<slug>.ts file (via guideDataLoaders) are
  // rendered on-demand through the RichGuidePage branch below and must also stay out
  // of eager static generation here, whether or not they still have a literal route
  // directory - that's the whole point of moving them off the eager-build path.
  const all = [...new Set([...guideSlugs, ...categorySlugs])].filter(
    (slug) => !staticRouteSlugs.has(slug) && !guideDataLoaders[slug]
  );
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Category listing page metadata
  const category = getCategoryBySlug(slug);
  if (category) {
    return buildMetadata({
      title: `${category.name} Buying Guides`,
      description: category.description,
      path: `/guide/${slug}`,
    });
  }

  // Rich guide (data/guides/<slug>.ts), rendered on-demand instead of via a literal route
  const loadRichGuide = guideDataLoaders[slug];
  if (loadRichGuide) {
    const richData = await loadRichGuide();
    return buildMetadata({
      title: richData.metaTitle,
      description: richData.metaDescription,
      path: `/guide/${slug}`,
      image: richData.heroImage,
      type: "article",
    });
  }

  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return {};

  // Use hero image as OG image — supports both Supabase (http) and local (/images) paths
  const heroImage = guide.heroImage?.startsWith("http")
    ? guide.heroImage
    : guide.heroImage?.startsWith("/")
    ? `${SITE_URL}${guide.heroImage}`
    : undefined;

  const base = buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.description,
    path: `/guide/${slug}`,
    image: heroImage,
    type: "article",
  });

  return {
    ...base,
    keywords: [guide.mainKeyword, ...guide.subKeywords],
    openGraph: {
      ...(base.openGraph as object),
      type: "article",
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
      section: guide.subcategorySlug.replace(/-/g, " "),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BuyingGuidePage({ params }: Props) {
  const { slug } = await params;

  // ── Silo redirect check — MUST run before any render branch below ─────────
  // A guide whose category/subcategory has been migrated into a topic-first
  // silo lives at /<silo>/<slug> now. This check used to sit further down,
  // after the "rich guide" branch below — since most of the site's actual
  // guide content ships as a rich data/guides/<slug>.ts file and returns
  // early from that branch, the redirect never ran for those guides at all,
  // silently leaving the legacy /guide/<slug> duplicate-content URL live for
  // the majority of migrated guides. Checking it first, against the same
  // static registry every render path already shares, fixes that for all of
  // them uniformly.
  const registryGuide = await getPublicGuideBySlug(slug);
  if (registryGuide) {
    const silo = siloForGuide(registryGuide.categorySlug, registryGuide.subcategorySlug);
    if (silo) {
      permanentRedirect(`/${silo}/${slug}`);
    }
  }

  // ── Rich guide (data/guides/<slug>.ts), rendered on-demand ────────────────
  // Guides that ship without a literal app/(site)/guide/<slug>/page.tsx route (either
  // because they were never generated as one, or because they were demoted off the
  // eager-build path) render here instead, via the same template every generated
  // static page uses. First request renders and ISR-caches it; it never costs build
  // time regardless of how many guides exist.
  const loadRichGuide = guideDataLoaders[slug];
  if (loadRichGuide) {
    const richData = await loadRichGuide();
    return <RichGuidePage slug={slug} {...richData} />;
  }

  // ── Category listing page ─────────────────────────────────────────────────
  const category = getCategoryBySlug(slug);
  if (category) {
    const allGuides = await getPublicGuides();
    const categoryGuides = allGuides.filter((g) => g.categorySlug === slug);

    return (
      <Container className="py-10">
        <Breadcrumbs crumbs={[{ label: "Buying Guides", href: "/guide" }, { label: category.name }]} />

        <header className="mt-6 mb-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">{category.name}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">
            {category.name} Buying Guides
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed">{category.description}</p>
        </header>

        {categoryGuides.length === 0 ? (
          <div className="py-16 text-center text-ink-muted">
            <p className="text-lg font-medium mb-2">No guides yet in this category.</p>
            <p className="text-sm">Check back soon - we&apos;re working on it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryGuides.map((guide) => {
              const cover = (guide as { thumbnailImage?: string }).thumbnailImage || guide.heroImage;
              return (
                <Link prefetch={false}
                  key={guide.slug}
                  href={`/guide/${guide.slug}`}
                  className="group flex flex-col bg-white rounded-card border border-border hover:shadow-card-hover hover:border-brand/20 transition-all overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden bg-bg">
                    {(cover?.startsWith("http") || cover?.startsWith("/")) ? (
                      <Image
                        src={cover}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-ink-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col gap-2 p-5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <span>{guide.readTime} read</span>
                      <span aria-hidden="true">·</span>
                      <span>Updated {formatDate(guide.lastUpdated)}</span>
                    </div>
                    <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-base leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 flex-1">
                      {guide.description}
                    </p>
                    <div className="pt-3 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                        Read guide
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Link back to all guides */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link prefetch={false} href="/guide" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1">
            ← View all buying guides
          </Link>
        </div>
      </Container>
    );
  }

  // ── Individual guide page ─────────────────────────────────────────────────
  // (silo-redirect check already ran at the top of this function, against
  // the same registryGuide lookup, before any render branch was reached)
  if (!registryGuide) notFound();

  return <GuideDetail slug={slug} basePath="/guide" sectionLabel="Buying Guides" sectionHref="/guide" />;
}
