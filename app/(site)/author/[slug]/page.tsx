import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAuthorBySlug, authors } from "@/data/authors";
import { getPublicGuides } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { canonicalGuideHref } from "@/lib/migrated-silos";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return buildMetadata({
    title: `${author.name} — ${author.role} | Gardening Is Ezee`,
    description: author.bio,
    path: `/author/${slug}`,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const allGuides = await getPublicGuides();
  const authorGuides = allGuides.filter(
    (g) =>
      g.author?.toLowerCase() === author.name.toLowerCase() ||
      g.author?.toLowerCase().includes("deskfinds")
  );

  const jsonLd = author.isPerson
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/author/${slug}`,
        name: author.name,
        jobTitle: author.role,
        description: author.bio,
        url: `${SITE_URL}/author/${slug}`,
        ...(author.avatarUrl ? { image: author.avatarUrl } : {}),
        sameAs: author.social.filter((s) => s.url).map((s) => s.url),
        knowsAbout: author.expertise,
        worksFor: { "@type": "Organization", name: "Gardening Is Ezee", url: SITE_URL },
        publishingPrinciples: `${SITE_URL}/how-we-review`,
      }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/author/${slug}`,
        name: author.name,
        description: author.bio,
        url: `${SITE_URL}/author/${slug}`,
        sameAs: author.social.map((s) => s.url),
        knowsAbout: author.expertise,
        publishingPrinciples: `${SITE_URL}/how-we-review`,
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-10 max-w-4xl">
        <Breadcrumbs
          crumbs={[
            { label: "Authors", href: "/author" },
            { label: author.name },
          ]}
        />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mt-8 mb-10 pb-10 border-b border-border">
          {author.avatarUrl ? (
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={96}
              height={96}
              className="rounded-full shrink-0 object-cover"
              unoptimized
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">{author.name}</h1>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                {author.role}
              </span>
            </div>
            <p className="text-ink-secondary leading-relaxed mb-4">{author.bio}</p>
            <div className="flex flex-wrap gap-3">
              {author.social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
                >
                  {s.platform === "LinkedIn" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {s.label}
                </a>
              ))}
              <Link prefetch={false}
                href="/how-we-review"
                className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                </svg>
                Our review methodology
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {author.credentials.map((c) => (
            <div key={c.label} className="bg-surface rounded-xl border border-border p-4 text-center">
              <p className="text-xl font-bold text-ink mb-1">{c.value}</p>
              <p className="text-xs text-ink-muted">{c.label}</p>
            </div>
          ))}
        </div>

        {/* ── About / Long Bio ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink mb-4">About This Team</h2>
          <div className="prose prose-sm max-w-none text-ink-secondary leading-relaxed space-y-4">
            {author.longBio.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* ── Expertise ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink mb-4">Areas of Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 rounded-full bg-surface border border-border text-sm text-ink-secondary font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        {/* ── Editorial Process ─────────────────────────────────────────── */}
        <section className="mb-10 bg-surface rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-ink mb-4">Editorial Process</h2>
          <div className="space-y-4 text-sm text-ink-secondary leading-relaxed">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">Research & Evaluation</p>
                <p>{author.editorial.process}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">Editorial Independence</p>
                <p>{author.editorial.independence}</p>
              </div>
            </div>
          </div>
          <Link prefetch={false}
            href="/how-we-review"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-accent hover:underline"
          >
            Read our full methodology
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>

        {/* ── Published Guides ──────────────────────────────────────────── */}
        {authorGuides.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-ink mb-6">
              Published Guides
              <span className="ml-2 text-sm font-normal text-ink-muted">({authorGuides.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authorGuides.map((guide) => (
                <Link prefetch={false}
                  key={guide.slug}
                  href={canonicalGuideHref(guide)}
                  className="group flex gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/40 hover:shadow-sm transition-all"
                >
                  {(guide.thumbnailImage || guide.heroImage) && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-bg">
                      <Image
                        src={(guide.thumbnailImage || guide.heroImage)!}
                        alt={guide.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-muted mb-1">{formatDate(guide.lastUpdated)}</p>
                    <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {guide.title}
                    </h3>
                    {guide.readTime && (
                      <p className="text-xs text-ink-muted mt-1.5">{guide.readTime} read</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
