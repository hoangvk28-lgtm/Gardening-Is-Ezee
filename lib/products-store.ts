import { createAdminClient } from "@/lib/supabase/server";
import type { Product } from "@/data/products";

export interface StoredProduct extends Product {
  lastUpdated: string;
  status: "draft" | "verified" | "published";
}

// ── DB row shape (snake_case columns) ─────────────────────────────────────────

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
  asin: string | null;
  price_label: string | null;
  use_case: string | null;
  source_notes: string | null;
  status: string;
  archived: boolean;
  updated_at: string;
  created_at: string;
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

function rowToProduct(row: ProductRow): StoredProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    badge: row.badge ?? undefined,
    shortDescription: row.short_description,
    reviewSummary: row.review_summary,
    amazonUrl: row.amazon_url,
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
    asin: row.asin ?? undefined,
    priceLabel: (row.price_label as StoredProduct["priceLabel"]) ?? undefined,
    useCase: row.use_case ?? undefined,
    sourceNotes: row.source_notes ?? undefined,
    status: (row.status as StoredProduct["status"]) ?? "draft",
    lastUpdated: row.updated_at?.split("T")[0] ?? new Date().toISOString().split("T")[0],
  };
}

function productToRow(p: StoredProduct): Omit<ProductRow, "created_at" | "updated_at" | "archived"> {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category_slug: p.categorySlug,
    subcategory_slug: p.subcategorySlug,
    badge: p.badge ?? null,
    short_description: p.shortDescription,
    review_summary: p.reviewSummary,
    amazon_url: p.amazonUrl,
    price_range: p.priceRange,
    image: p.image,
    best_for: p.bestFor,
    not_ideal_for: p.notIdealFor,
    specs: p.specs,
    pros: p.pros,
    cons: p.cons,
    scores: p.scores,
    alternatives: p.alternatives,
    related_guide_slugs: p.relatedGuideSlugs,
    asin: p.asin ?? null,
    price_label: p.priceLabel ?? null,
    use_case: p.useCase ?? null,
    source_notes: p.sourceNotes ?? null,
    status: p.status,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<StoredProduct[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("archived", false)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductById(id: string): Promise<StoredProduct | undefined> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("archived", false)
    .single();

  if (error?.code === "PGRST116") return undefined; // not found
  if (error) throw new Error(`getProductById: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function getProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("archived", false)
    .single();

  if (error?.code === "PGRST116") return undefined;
  if (error) throw new Error(`getProductBySlug: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const db = createAdminClient();
  let query = db
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("archived", false);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw new Error(`isSlugUnique: ${error.message}`);
  return (data?.length ?? 0) === 0;
}

export async function isAsinUnique(asin: string, excludeId?: string): Promise<boolean> {
  const db = createAdminClient();
  let query = db
    .from("products")
    .select("id")
    .eq("asin", asin)
    .eq("archived", false);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query;
  if (error) throw new Error(`isAsinUnique: ${error.message}`);
  return (data?.length ?? 0) === 0;
}

export async function createProduct(product: StoredProduct): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("products").insert(productToRow(product));
  if (error) {
    if (error.code === "23505") throw new Error(`A product with id or slug "${product.slug}" already exists.`);
    throw new Error(`createProduct: ${error.message}`);
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<StoredProduct>
): Promise<StoredProduct> {
  const db = createAdminClient();

  // Fetch current row first so we can merge properly
  const current = await getProductById(id);
  if (!current) throw new Error(`Product "${id}" not found.`);

  const merged = { ...current, ...updates, id };
  const row = productToRow(merged as StoredProduct);

  const { data, error } = await db
    .from("products")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updateProduct: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  // Soft delete: set archived = true
  const db = createAdminClient();
  const { error } = await db
    .from("products")
    .update({ archived: true })
    .eq("id", id);

  if (error) throw new Error(`deleteProduct: ${error.message}`);
}
