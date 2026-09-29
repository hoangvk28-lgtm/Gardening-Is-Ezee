/**
 * Public-facing async product data layer.
 *
 * - Server-only: do NOT import in client components.
 * - Queries Supabase for published, non-archived products.
 * - Falls back to static data/products.ts on missing env vars or any query error.
 * - Returns Product objects compatible with all existing UI components.
 */
import { products as staticProducts, type Product } from "@/data/products";
import { isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import type { Category } from "@/data/categories";
import { withAmazonTag } from "@/lib/affiliate";

// ── DB row → Product mapping ───────────────────────────────────────────────────

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  subcategory_slug: string;
  badge: string | null;
  short_description: string;
  review_summary: string;
  amazon_url: string;
  price_range: string;
  image: string;
  best_for: string[];
  not_ideal_for: string[];
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  scores: Product["scores"];
  alternatives: string[];
  related_guide_slugs: string[];
  status: string;
  archived: boolean;
  updated_at: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    badge: row.badge ?? undefined,
    shortDescription: row.short_description,
    reviewSummary: row.review_summary,
    // Guard here, at the single seam between stored data (Supabase amazon_url
    // column, which may carry a stale/legacy tracking tag) and every rendered
    // product card/CTA site-wide — sets the current AMAZON_TAG once, never
    // duplicates a `tag` param, regardless of what's stored.
    amazonUrl: withAmazonTag(row.amazon_url),
    priceRange: row.price_range,
    image: row.image,
    bestFor: row.best_for ?? [],
    notIdealFor: row.not_ideal_for ?? [],
    specs: row.specs ?? {},
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    scores: row.scores,
    alternatives: row.alternatives ?? [],
    relatedGuideSlugs: row.related_guide_slugs ?? [],
  };
}

// ── Core fetch ─────────────────────────────────────────────────────────────────

/**
 * Returns all published, non-archived products.
 * Falls back to static data on any Supabase error or missing config.
 */
export async function getPublicProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("archived", false)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    const dbProducts = (data as ProductRow[]).map(rowToProduct);
    // Merge: static products as baseline, DB products override by slug
    const dbSlugSet = new Set(dbProducts.map((p) => p.slug));
    const staticOnly = staticProducts.filter((p) => !dbSlugSet.has(p.slug));
    return [...dbProducts, ...staticOnly];
  } catch (e) {
    console.warn("[public-products] Supabase query failed - falling back to static data:", e);
    return staticProducts;
  }
}

/**
 * Returns a single product by slug. Only published, non-archived.
 * Falls back to static data on error. Returns undefined if not found anywhere.
 */
export async function getPublicProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return staticProducts.find((p) => p.slug === slug);
  }

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .eq("archived", false)
      .single();

    if (error?.code === "PGRST116") {
      // Not found in DB - try static fallback (covers pre-seeded slugs at build time)
      return staticProducts.find((p) => p.slug === slug);
    }
    if (error) throw error;
    return rowToProduct(data as ProductRow);
  } catch (e) {
    console.warn(`[public-products] getPublicProductBySlug("${slug}") failed - falling back:`, e);
    return staticProducts.find((p) => p.slug === slug);
  }
}

/**
 * Returns product slugs for generateStaticParams.
 * Falls back to static slugs on error - build never fails.
 */
export async function getPublicProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return staticProducts.map((p) => p.slug);

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("products")
      .select("slug")
      .eq("status", "published")
      .eq("archived", false);

    if (error) throw error;
    const dbSlugs = (data as { slug: string }[]).map((r) => r.slug);
    // Union with static slugs so pre-seeded pages are always included at build time
    const all = new Set([...staticProducts.map((p) => p.slug), ...dbSlugs]);
    return [...all];
  } catch (e) {
    console.warn("[public-products] getPublicProductSlugs failed - using static slugs:", e);
    return staticProducts.map((p) => p.slug);
  }
}

// ── Derived helpers (built on getPublicProducts for efficiency) ────────────────

/**
 * Returns products for a category hub - direct match first,
 * then subcategory-collected fallback for thematic categories.
 * Mirrors the logic from lib/helpers.ts getProductsForCategoryHub.
 */
export async function getPublicProductsForCategoryHub(category: Category): Promise<Product[]> {
  const all = await getPublicProducts();

  const direct = all.filter((p) => p.categorySlug === category.slug);
  if (direct.length > 0) return direct;

  // Thematic category - collect from subcategories, deduped
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const sub of category.subcategories) {
    for (const p of all.filter((p) => p.subcategorySlug === sub)) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }
  }
  return result.sort((a, b) => b.scores.overall - a.scores.overall);
}
