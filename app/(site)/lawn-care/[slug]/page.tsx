import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { GuideDetail } from "@/components/guide/GuideDetail";
import { RichGuidePage } from "@/components/guide/RichGuidePage";
import { guideDataLoaders } from "@/data/guides-index.generated";
import { getPublicGuideBySlug, getPublicGuidesByCategory } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { matchSlugsForSilo, hasLegacyLiteralRoute } from "@/lib/migrated-silos";
import { InformationalGuidePage } from "@/components/guide/InformationalGuidePage";
import { getInformationalGuide, getInformationalGuidesBySilo } from "@/data/informational-guides";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

const SILO = "lawn-care";
const matchSlugs = matchSlugsForSilo(SILO);

export async function generateStaticParams() {
  const guides = await getPublicGuidesByCategory(SILO, matchSlugs);
  return [
    ...guides.filter((g) => !guideDataLoaders[g.slug]).map((g) => ({ slug: g.slug })),
    ...getInformationalGuidesBySilo(SILO).map((g) => ({ slug: g.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const informational = getInformationalGuide(slug);
  if (informational?.silo === SILO) {
    return buildMetadata({ title: informational.metaTitle, description: informational.description, path: `/${SILO}/${slug}`, image: informational.heroImage, type: "article" });
  }
  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return {};

  const heroImage = guide.heroImage?.startsWith("http")
    ? guide.heroImage
    : guide.heroImage?.startsWith("/")
    ? `${SITE_URL}${guide.heroImage}`
    : undefined;

  const base = buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.description,
    path: `/lawn-care/${slug}`,
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

export default async function LawnCareGuidePage({ params }: Props) {
  const { slug } = await params;

  const informational = getInformationalGuide(slug);
  if (informational?.silo === SILO) return <InformationalGuidePage guide={informational} />;

  const guide = await getPublicGuideBySlug(slug);
  if (!guide) notFound();

  // Guard: a guide only renders under /lawn-care if it actually belongs to the
  // migrated Lawn Care category/subcategories — anything else 404s here rather
  // than silently rendering unrelated content at a lawn-care URL.
  if (!matchSlugs.includes(guide.categorySlug) && !matchSlugs.includes(guide.subcategorySlug)) {
    notFound();
  }

  // Rich guide (data/guides/<slug>.ts) has the full buying-criteria/FAQ/
  // comparison content; the plain registry entry used above only carries
  // thin stub fields for guides built this way, so GuideDetail alone would
  // silently render an emptied-out page. Prefer the rich renderer whenever
  // this guide has dedicated rich data, matching /guide/[slug]'s own dispatch.
  const loadRichGuide = guideDataLoaders[slug];
  if (loadRichGuide) {
    const richData = await loadRichGuide();
    return <RichGuidePage slug={slug} {...richData} />;
  }

  // This guide's full content only exists in a hand-authored static route at
  // /guide/<slug> (legacy schema, not covered by guideDataLoaders) — GuideDetail
  // would render a thin, emptied-out page. Send it back to the working URL
  // rather than lose content, until this guide is rewritten to the modern schema.
  if (hasLegacyLiteralRoute(slug)) {
    permanentRedirect(`/guide/${slug}`);
  }

  return <GuideDetail slug={slug} basePath="/lawn-care" sectionLabel="Lawn Care" sectionHref="/lawn-care" />;
}
