import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { products as staticProducts } from "@/data/products";
import { guides as staticGuides } from "@/data/guides";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { silos } from "@/data/silos";
import { siloForGuide } from "@/lib/migrated-silos";
import { informationalGuides } from "@/data/informational-guides";

// Try to load published slugs from Supabase; merge with static data so no slug is ever missing.
async function getPublishedProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const staticEntries = staticProducts.map((p) => ({ slug: p.slug, updatedAt: new Date().toISOString() }));

  if (!isSupabaseConfigured()) return staticEntries;

  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("slug,updated_at")
      .eq("status", "published")
      .eq("archived", false)
      .order("updated_at", { ascending: false });
    if (data && data.length > 0) {
      // Merge: Supabase entries take precedence (have real updated_at), static fills the gaps.
      const supabaseSlugs = new Set(data.map((r) => r.slug as string));
      const dbEntries = data.map((r) => ({ slug: r.slug as string, updatedAt: r.updated_at as string }));
      const staticOnly = staticEntries.filter((e) => !supabaseSlugs.has(e.slug));
      return [...dbEntries, ...staticOnly];
    }
  } catch {
    // fall through to static fallback
  }
  return staticEntries;
}

interface GuideSitemapEntry {
  slug: string;
  updatedAt: string;
  categorySlug: string;
  subcategorySlug: string;
}

async function getPublishedGuideSlugs(): Promise<GuideSitemapEntry[]> {
  // Always start with static guides — these are the source of truth for all published pages.
  const staticEntries = staticGuides.map((g) => ({
    slug: g.slug,
    updatedAt: g.lastUpdated,
    categorySlug: g.categorySlug,
    subcategorySlug: g.subcategorySlug,
  }));

  if (!isSupabaseConfigured()) return staticEntries;

  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("guides")
      .select("slug,updated_at,category_slug,subcategory_slug")
      .eq("status", "published")
      .eq("archived", false)
      .order("updated_at", { ascending: false });

    if (data && data.length > 0) {
      // Merge: Supabase entries take precedence (have real updated_at), static fills the gaps.
      const supabaseSlugs = new Set(data.map((r) => r.slug as string));
      const dbEntries = data.map((r) => ({
        slug: r.slug as string,
        updatedAt: r.updated_at as string,
        categorySlug: (r.category_slug as string) ?? "",
        subcategorySlug: (r.subcategory_slug as string) ?? "",
      }));
      const staticOnly = staticEntries.filter((e) => !supabaseSlugs.has(e.slug));
      return [...dbEntries, ...staticOnly];
    }
  } catch {
    // fall through to static fallback
  }

  return staticEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const guideSlugs = await getPublishedGuideSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/guide`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/how-we-review`,            lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${SITE_URL}/affiliate-disclosure`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Topic-first silo root pages
  const siloPages: MetadataRoute.Sitemap = silos.map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Published buying guide pages (Supabase or static fallback). A guide whose
  // category/subcategory has been migrated into a silo lives at its final
  // /<silo>/<slug> URL here — never list the legacy /guide/<slug> URL, which
  // now just 308-redirects there.
  const guidePages: MetadataRoute.Sitemap = guideSlugs.map(({ slug, updatedAt, categorySlug, subcategorySlug }) => {
    const silo = siloForGuide(categorySlug, subcategorySlug);
    return {
      url: silo ? `${SITE_URL}/${silo}/${slug}` : `${SITE_URL}/guide/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    };
  });

  const informationalPages: MetadataRoute.Sitemap = informationalGuides.map((guide) => ({
    url: `${SITE_URL}/${guide.silo}/${guide.slug}`,
    lastModified: guide.lastUpdated,
    changeFrequency: "yearly",
    priority: 0.75,
  }));

  // Static VS compare articles (not category-based)
  const vsComparePages: MetadataRoute.Sitemap = [
  ];

  return [
    ...staticPages,
    ...siloPages,
    ...guidePages,
    ...informationalPages,
    ...vsComparePages,
  ];
}
