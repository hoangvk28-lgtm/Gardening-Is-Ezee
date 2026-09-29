import type { Metadata } from "next";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { ShoppingCategoryStrip } from "@/components/editorial/ShoppingCategoryStrip";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { ArticleCardMedium } from "@/components/editorial/ArticleCards";
import { RankedArticleList } from "@/components/editorial/RankedArticleList";
import { DepartmentSection } from "@/components/editorial/DepartmentSection";
import { WorkspaceIdeasSection } from "@/components/editorial/WorkspaceIdeasSection";
import { EditorsPickCard } from "@/components/editorial/EditorsPickCard";
import { ReviewMethodologyBand } from "@/components/editorial/ReviewMethodologyBand";
import { NewsletterSignup } from "@/components/editorial/NewsletterSignup";
import { getPublicGuides } from "@/lib/public-guides";
import { getPublicProducts } from "@/lib/public-products";
import { getPublicFeaturedDeals } from "@/lib/public-deals";
import { createResolver, guideHref, publicAsset, toPickView } from "@/lib/homepage";
import { homepageEditorial as cfg } from "@/data/homepage-editorial";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

const OG_IMAGE = publicAsset("images/brand/og.jpg");

export const metadata: Metadata = buildMetadata({
  title: "Gardening Is Ezee | Garden & Yard Buying Guides",
  description:
    "Straightforward buying guides for lawn mowers, garden tools, hoses, raised beds, leaf blowers and outdoor storage, compared on real specs and trade-offs.",
  path: "/",
  image: OG_IMAGE,
});

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default async function HomePage() {
  const [guides, products, featuredDeals] = await Promise.all([
    getPublicGuides(),
    getPublicProducts(),
    getPublicFeaturedDeals(),
  ]);

  // Order matters: each guide appears once, claimed by the first section that lists it.
  const resolve = createResolver(guides);
  const featuredGuide = resolve.first(cfg.featured.candidates);
  const latest = resolve.list(cfg.latest);
  const mostRead = resolve.list(cfg.mostRead);
  const departments = cfg.departments.map((d) => ({ ...d, items: resolve.list(d.articles) }));
  const ideas = resolve.list(cfg.workspaceIdeas.articles);
  const workBetter = resolve.list(cfg.workBetter.articles);

  // Editor's picks: featured DB deals first (unchanged source), else the local fallback list.
  const dealProducts = featuredDeals.filter((d) => d.product).map((d) => d.product!);
  const picks =
    dealProducts.length > 0
      ? dealProducts.slice(0, 4).map((p) => toPickView(p))
      : cfg.editorsPicksFallback.flatMap(({ slug, useCase }) => {
          const p = products.find((x) => x.slug === slug);
          return p ? [toPickView(p, useCase)] : [];
        });

  const heroImage =
    publicAsset("images/brand/hero.webp") ?? featuredGuide?.heroImage ?? undefined;

  return (
    <>
      <Wrap>
        {/* 1 — Featured story */}
        {featuredGuide && (
          <FeaturedStory
            eyebrow={cfg.featured.eyebrow}
            headline={cfg.featured.headline}
            dek={cfg.featured.dek}
            href={guideHref(featuredGuide)}
            image={heroImage}
            imageAlt="A cordless push lawn mower on a freshly cut backyard lawn"
            byline={cfg.featured.byline}
            updated={featuredGuide.lastUpdated}
            readTime={featuredGuide.readTime}
          />
        )}

        {/* 2 — What are you shopping for? */}
        <ShoppingCategoryStrip />

        {/* 3 — Latest recommendations + Most read */}
        {/* Side-by-side only at xl; below that Most Read drops under the cards. */}
        <div className="grid gap-12 py-12 lg:py-14 xl:grid-cols-[7fr_3fr] xl:gap-10">
          <section aria-labelledby="latest-heading">
            <SectionHeader id="latest-heading" title="Latest Recommendations" href="/guide" />
            {/* Phones: one column. Tablet: lead card full width + two below. xl: three columns. */}
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {latest.map((a, i) => (
                <ArticleCardMedium
                  key={a.slug}
                  article={a}
                  eager={i === 0}
                  className={i === 0 ? "sm:col-span-2 xl:col-span-1" : ""}
                />
              ))}
            </div>
          </section>
          <div className="xl:border-l xl:border-border xl:pl-10">
            <RankedArticleList id="most-read-heading" title="Most Read" articles={mostRead} />
          </div>
        </div>

        {/* 4–6 — Office Furniture, Desk Setup, Lighting */}
        <div className="divide-y divide-border border-t border-border">
          {departments.map((d, i) => (
            <DepartmentSection
              key={d.id}
              id={d.id}
              title={d.title}
              href={d.href}
              topics={d.topics}
              articles={d.items}
              layout={i === 2 ? "grid" : "lead"}
            />
          ))}

          {/* 7 — Workspace Ideas */}
          <WorkspaceIdeasSection title={cfg.workspaceIdeas.title} href={cfg.workspaceIdeas.href} articles={ideas} />

          {/* 8 — Work Better */}
          <DepartmentSection id="work-better" title={cfg.workBetter.title} href={cfg.workBetter.href} articles={workBetter} layout="grid" />

          {/* 9 — Editor's Picks */}
          {picks.length > 0 && (
            <section aria-labelledby="editors-picks-heading" className="py-12 lg:py-14">
              <SectionHeader
                id="editors-picks-heading"
                title="Editor’s Picks"
                href="/guide"
                description="Tools and upgrades we think genuinely make garden work easier."
              />
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {picks.map((p) => (
                  <EditorsPickCard key={p.id} pick={p} />
                ))}
              </div>
              <p className="mt-8 text-xs text-ink-secondary">
                We may earn a commission when you buy through these links. It never affects which products we pick.
              </p>
            </section>
          )}
        </div>
      </Wrap>

      {/* 10 — How we review */}
      <ReviewMethodologyBand />

      {/* 11 — Newsletter */}
      <Wrap>
        <NewsletterSignup />
      </Wrap>
    </>
  );
}
