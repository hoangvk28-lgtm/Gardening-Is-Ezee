import { createAdminClient } from "@/lib/supabase/server";
import type { Guide } from "@/data/guides";

// ── Product Pick type for inline guide product entries ────────────────────────
// Stored as JSONB in guides.product_picks column (migration 006)

export interface GuideProductPick {
  id: string;           // client-generated uuid for stable keys
  productId?: string;   // links to products table; all other fields may override
  badge: string;        // "Best Overall", "Best Budget", "Best Premium", etc.
  name: string;
  brand?: string;
  asin?: string;        // auto-generates affiliateUrl: https://www.amazon.com/dp/{ASIN}?tag=theofficejournal-20
  affiliateUrl: string; // always use rel="nofollow sponsored noopener noreferrer"
  imageUrl: string;
  priceLabel: "Budget" | "Mid-range" | "Premium" | "Check Amazon";
  fitScore?: number;    // 0–10 editorial score — labeled "Gardening Is Ezee Fit Score" in UI
  summary: string;      // 1–2 sentence overview
  whyItWins: string;    // key differentiator paragraph
  bestFor?: string;     // one-line ideal user description
  skipIf?: string;      // one-line skip condition
  specs: { label: string; value: string }[];
  pros: string[];
  cons: string[];
  ctaLabel?: string;    // defaults to "Check price on Amazon"
}

export interface StoredGuide extends Omit<Guide, "lastUpdated"> {
  id: string;
  heroImageAlt: string;
  thumbnailImage: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  status: "draft" | "published" | "archived";
  lastUpdated: string;
  productPicks: GuideProductPick[];
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
  comparison_order: string[];
  sections: Guide["sections"];
  faq: Guide["faq"];
  related_guide_slugs: string[];
  author: string;
  read_time: string;
  last_updated: string;
  status: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  product_picks?: GuideProductPick[];
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

function rowToGuide(row: GuideRow): StoredGuide {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    description: row.description,
    heroImage: row.hero_image,
    heroImageAlt: row.hero_image_alt,
    thumbnailImage: row.thumbnail_image || row.hero_image || "",
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    mainKeyword: row.main_keyword,
    subKeywords: row.sub_keywords ?? [],
    intro: row.intro,
    recommendedProductIds: row.recommended_product_ids ?? [],
    relatedGuideSlugs: row.related_guide_slugs ?? [],
    sections: row.sections ?? [],
    faq: row.faq ?? [],
    author: row.author,
    readTime: row.read_time,
    lastUpdated: row.updated_at?.split("T")[0] ?? row.last_updated ?? new Date().toISOString().split("T")[0],
    status: (row.status as StoredGuide["status"]) ?? "draft",
    productPicks: (row.product_picks as GuideProductPick[]) ?? [],
  };
}

function guideToRow(g: StoredGuide): Omit<GuideRow, "created_at" | "updated_at" | "archived"> {
  return {
    id: g.id,
    title: g.title,
    slug: g.slug,
    category_slug: g.categorySlug,
    subcategory_slug: g.subcategorySlug,
    description: g.description,
    hero_image: g.heroImage,
    hero_image_alt: g.heroImageAlt,
    thumbnail_image: g.thumbnailImage || g.heroImage,
    meta_title: g.metaTitle,
    meta_description: g.metaDescription,
    main_keyword: g.mainKeyword,
    sub_keywords: g.subKeywords,
    intro: g.intro,
    recommended_product_ids: g.recommendedProductIds,
    comparison_order: g.recommendedProductIds,
    sections: g.sections,
    faq: g.faq,
    related_guide_slugs: g.relatedGuideSlugs,
    author: g.author,
    read_time: g.readTime,
    last_updated: g.lastUpdated,
    status: g.status,
    product_picks: g.productPicks ?? [],
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getAllGuides(): Promise<StoredGuide[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("guides")
    .select("*")
    .eq("archived", false)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`getAllGuides: ${error.message}`);
  return (data as GuideRow[]).map(rowToGuide);
}

export async function getGuideById(id: string): Promise<StoredGuide | undefined> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("guides")
    .select("*")
    .eq("id", id)
    .eq("archived", false)
    .single();

  if (error?.code === "PGRST116") return undefined;
  if (error) throw new Error(`getGuideById: ${error.message}`);
  return rowToGuide(data as GuideRow);
}

export async function getGuideBySlug(slug: string): Promise<StoredGuide | undefined> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .eq("archived", false)
    .single();

  if (error?.code === "PGRST116") return undefined;
  if (error) throw new Error(`getGuideBySlug: ${error.message}`);
  return rowToGuide(data as GuideRow);
}

export async function isGuideSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const db = createAdminClient();
  let query = db.from("guides").select("id").eq("slug", slug).eq("archived", false);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw new Error(`isGuideSlugUnique: ${error.message}`);
  return (data?.length ?? 0) === 0;
}

export async function createGuide(guide: StoredGuide): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("guides").insert(guideToRow(guide));
  if (error) {
    if (error.code === "23505") throw new Error(`A guide with slug "${guide.slug}" already exists.`);
    throw new Error(`createGuide: ${error.message}`);
  }
}

export async function updateGuide(id: string, updates: Partial<StoredGuide>): Promise<StoredGuide> {
  const db = createAdminClient();
  const current = await getGuideById(id);
  if (!current) throw new Error(`Guide "${id}" not found.`);
  const merged = { ...current, ...updates, id };
  const row = guideToRow(merged as StoredGuide);
  const { data, error } = await db.from("guides").update(row).eq("id", id).select().single();
  if (error) throw new Error(`updateGuide: ${error.message}`);
  return rowToGuide(data as GuideRow);
}

export async function archiveGuide(id: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("guides").update({ archived: true }).eq("id", id);
  if (error) throw new Error(`archiveGuide: ${error.message}`);
}

export async function getGuidesByCategory(categorySlug: string): Promise<StoredGuide[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("guides")
    .select("*")
    .eq("category_slug", categorySlug)
    .eq("archived", false)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`getGuidesByCategory: ${error.message}`);
  return (data as GuideRow[]).map(rowToGuide);
}
