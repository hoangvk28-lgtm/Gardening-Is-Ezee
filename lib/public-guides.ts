/**
 * Public-facing async guide data layer.
 *
 * Architecture:
 * - Static data/guides.ts is the SOURCE OF TRUTH for all content fields
 *   (title, sections, faq, recommendedProductIds, relatedGuideSlugs, etc.)
 * - Supabase DB supplements with SEO-only fields (meta_title, meta_description,
 *   intro, hero_image_alt) and stores DB-only guides created via admin panel.
 * - Editing data/guides.ts + deploying is sufficient to update content.
 *   No manual Force Sync required.
 */
import { guides as staticGuides, type Guide } from "@/data/guides";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import type { GuideProductPick } from "@/lib/guides-store";
import { withAmazonTag } from "@/lib/affiliate";

export type { GuideProductPick };

export interface PublicGuide extends Guide {
  metaTitle?: string;
  metaDescription?: string;
  heroImageAlt?: string;
  intro?: string;
  productPicks?: GuideProductPick[];
}

// ── DB row shape ──────────────────────────────────────────────────────────────

interface GuideRow {
  id: string;
  title: string;
  slug: string;
  category_slug: string;
  subcategory_slug: string;
  description: string;
  hero_image: string;
  hero_image_alt: string;
  thumbnail_image?: string;
  meta_title: string;
  meta_description: string;
  main_keyword: string;
  sub_keywords: string[];
  intro: string;
  recommended_product_ids: string[];
  sections: Guide["sections"];
  faq: Guide["faq"];
  related_guide_slugs: string[];
  author: string;
  read_time: string;
  last_updated: string;
  status: string;
  archived: boolean;
  updated_at: string;
  product_picks?: GuideProductPick[];
}

/**
 * Convert a DB row into a PublicGuide.
 *
 * If the slug exists in static data, static fields win for ALL content.
 * DB only contributes SEO extras (meta_title, meta_description, intro,
 * hero_image_alt) and hero/thumbnail images if the static guide has none.
 *
 * If the slug is DB-only (no static equivalent), DB fields are used as-is.
 */
function rowToPublicGuide(row: GuideRow): PublicGuide {
  const staticGuide = staticGuides.find((g) => g.slug === row.slug);

  if (staticGuide) {
    // Static-backed guide: content always comes from static file
    return {
      ...staticGuide,
      // Layer DB SEO-only extras on top
      heroImage: staticGuide.heroImage || row.hero_image || "",
      thumbnailImage:
        staticGuide.thumbnailImage ||
        staticGuide.heroImage ||
        row.thumbnail_image ||
        row.hero_image ||
        undefined,
      heroImageAlt: row.hero_image_alt || undefined,
      metaTitle: row.meta_title || undefined,
      metaDescription: row.meta_description || undefined,
      intro: row.intro || undefined,
    };
  }

  // DB-only guide (created via admin panel, not in static files)
  return {
    title: row.title,
    slug: row.slug,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    description: row.description,
    heroImage: row.hero_image || "",
    thumbnailImage: row.thumbnail_image || row.hero_image || undefined,
    heroImageAlt: row.hero_image_alt || undefined,
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
    intro: row.intro || undefined,
    mainKeyword: row.main_keyword ?? "",
    subKeywords: row.sub_keywords ?? [],
    lastUpdated: row.updated_at?.split("T")[0] ?? row.last_updated ?? new Date().toISOString().split("T")[0],
    author: row.author || "Gardening Is Ezee Editors",
    readTime: row.read_time || "",
    recommendedProductIds: row.recommended_product_ids ?? [],
    sections: row.sections ?? [],
    faq: row.faq ?? [],
    relatedGuideSlugs: row.related_guide_slugs ?? [],
    buyingCriteria: undefined,
    // Guard here, the seam between the stored product_picks JSONB (admin-
    // entered, may carry a stale/legacy tracking tag) and every rendered
    // inline pick — see the matching comment in lib/public-products.ts.
    productPicks: ((row.product_picks as GuideProductPick[]) ?? []).map((pick) => ({
      ...pick,
      affiliateUrl: withAmazonTag(pick.affiliateUrl),
    })),
  };
}

// ── Core fetch ────────────────────────────────────────────────────────────────

export async function getPublicGuides(): Promise<PublicGuide[]> {
  if (!isSupabaseConfigured()) return staticGuides;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("guides")
      .select("*")
      .eq("status", "published")
      .eq("archived", false);

    if (error) throw error;
    const dbRows = data as GuideRow[];
    const dbSlugSet = new Set(dbRows.map((r) => r.slug));

    // DB-only guides (not in static) converted via rowToPublicGuide
    const dbOnlyGuides = dbRows
      .filter((r) => !staticGuides.find((g) => g.slug === r.slug))
      .map(rowToPublicGuide);

    // SEO extras from DB keyed by slug (for static-backed guides)
    const dbSeoBySlug = new Map(dbRows.map((r) => [r.slug, r]));

    // Static guides get DB SEO extras layered on if available
    const staticWithSeo: PublicGuide[] = staticGuides.map((g) => {
      const row = dbSeoBySlug.get(g.slug);
      if (!row) return g;
      return {
        ...g,
        heroImage: g.heroImage || row.hero_image || "",
        thumbnailImage: g.thumbnailImage || g.heroImage || row.thumbnail_image || row.hero_image || undefined,
        heroImageAlt: row.hero_image_alt || undefined,
        metaTitle: row.meta_title || undefined,
        metaDescription: row.meta_description || undefined,
        intro: row.intro || undefined,
      };
    });

    // Add any DB-only guides not in static
    const merged = [...staticWithSeo, ...dbOnlyGuides];

    // Sort by lastUpdated desc
    merged.sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? ""));
    return merged;
  } catch (e) {
    console.warn("[public-guides] Supabase query failed - falling back to static data:", e);
    return staticGuides;
  }
}

export async function getPublicGuideBySlug(slug: string): Promise<PublicGuide | undefined> {
  const staticGuide = staticGuides.find((g) => g.slug === slug);

  if (!isSupabaseConfigured()) return staticGuide;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("guides")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .eq("archived", false)
      .single();

    if (error?.code === "PGRST116") {
      // Not in DB at all - return static if available
      return staticGuide;
    }
    if (error) throw error;

    return rowToPublicGuide(data as GuideRow);
  } catch (e) {
    console.warn(`[public-guides] getPublicGuideBySlug("${slug}") failed - falling back:`, e);
    return staticGuide;
  }
}

export async function getPublicGuideSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return staticGuides.map((g) => g.slug);

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("guides")
      .select("slug")
      .eq("status", "published")
      .eq("archived", false);

    if (error) throw error;
    const dbSlugs = (data as { slug: string }[]).map((r) => r.slug);
    // Union: static slugs + DB-only slugs
    const all = new Set([...staticGuides.map((g) => g.slug), ...dbSlugs]);
    return [...all];
  } catch (e) {
    console.warn("[public-guides] getPublicGuideSlugs failed - using static slugs:", e);
    return staticGuides.map((g) => g.slug);
  }
}

// ── Derived helpers ───────────────────────────────────────────────────────────

/**
 * Returns guides belonging to a category.
 *
 * Default behavior (matchSlugs omitted): exact match against g.categorySlug,
 * unchanged from the original single-slug lookup used by the original 4
 * categories.
 *
 * When matchSlugs is provided (aggregating categories like Chairs/Monitors/
 * Lighting/Accessories), a guide matches if either its categorySlug or its
 * finer-grained subcategorySlug appears in matchSlugs.
 */
export async function getPublicGuidesByCategory(
  categorySlug: string,
  matchSlugs?: string[]
): Promise<PublicGuide[]> {
  const all = await getPublicGuides();
  if (matchSlugs && matchSlugs.length > 0) {
    return all.filter(
      (g) => matchSlugs.includes(g.categorySlug) || matchSlugs.includes(g.subcategorySlug)
    );
  }
  return all.filter((g) => g.categorySlug === categorySlug);
}

export async function getFeaturedPublicGuides(limit = 6): Promise<PublicGuide[]> {
  const all = await getPublicGuides();
  return all.slice(0, limit);
}

export async function getRelatedPublicGuides(slugs: string[]): Promise<PublicGuide[]> {
  if (slugs.length === 0) return [];
  const all = await getPublicGuides();
  return slugs
    .map((slug) => all.find((g) => g.slug === slug))
    .filter((g): g is PublicGuide => g !== undefined);
}
