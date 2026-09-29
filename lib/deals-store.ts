import { createAdminClient } from "@/lib/supabase/server";

export interface StoredDeal {
  id: string;
  productId: string;
  productSlug: string;
  title: string;
  slug: string;
  label: string;
  description: string;
  section: string;
  placement: string;
  amazonUrlOverride: string;
  ctaText: string;
  priceRangeOverride: string;
  imageOverride: string;
  imageAlt: string;
  featured: boolean;
  displayOrder: number;
  status: "draft" | "active" | "inactive" | "archived";
  archived: boolean;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

function fromRow(row: Record<string, unknown>): StoredDeal {
  return {
    id: row.id as string,
    productId: (row.product_id as string) ?? "",
    productSlug: (row.product_slug as string) ?? "",
    title: row.title as string,
    slug: row.slug as string,
    label: (row.label as string) ?? "Worth checking",
    description: (row.description as string) ?? "",
    section: (row.section as string) ?? "general",
    placement: (row.placement as string) ?? "deals",
    amazonUrlOverride: (row.amazon_url_override as string) ?? "",
    ctaText: (row.cta_text as string) ?? "Check current price",
    priceRangeOverride: (row.price_range_override as string) ?? "",
    imageOverride: (row.image_override as string) ?? "",
    imageAlt: (row.image_alt as string) ?? "",
    featured: (row.featured as boolean) ?? false,
    displayOrder: (row.display_order as number) ?? 0,
    status: (row.status as StoredDeal["status"]) ?? "draft",
    archived: (row.archived as boolean) ?? false,
    startsAt: (row.starts_at as string) ?? "",
    endsAt: (row.ends_at as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

function toRow(deal: Partial<StoredDeal>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (deal.id !== undefined) row.id = deal.id;
  if (deal.productId !== undefined) row.product_id = deal.productId || null;
  if (deal.productSlug !== undefined) row.product_slug = deal.productSlug || null;
  if (deal.title !== undefined) row.title = deal.title;
  if (deal.slug !== undefined) row.slug = deal.slug;
  if (deal.label !== undefined) row.label = deal.label;
  if (deal.description !== undefined) row.description = deal.description;
  if (deal.section !== undefined) row.section = deal.section;
  if (deal.placement !== undefined) row.placement = deal.placement;
  if (deal.amazonUrlOverride !== undefined) row.amazon_url_override = deal.amazonUrlOverride || null;
  if (deal.ctaText !== undefined) row.cta_text = deal.ctaText;
  if (deal.priceRangeOverride !== undefined) row.price_range_override = deal.priceRangeOverride || null;
  if (deal.imageOverride !== undefined) row.image_override = deal.imageOverride || null;
  if (deal.imageAlt !== undefined) row.image_alt = deal.imageAlt || null;
  if (deal.featured !== undefined) row.featured = deal.featured;
  if (deal.displayOrder !== undefined) row.display_order = deal.displayOrder;
  if (deal.status !== undefined) row.status = deal.status;
  if (deal.archived !== undefined) row.archived = deal.archived;
  if (deal.startsAt !== undefined) row.starts_at = deal.startsAt || null;
  if (deal.endsAt !== undefined) row.ends_at = deal.endsAt || null;
  return row;
}

export async function getAllDeals(): Promise<StoredDeal[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("archived", false)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getDealById(id: string): Promise<StoredDeal | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("deals").select("*").eq("id", id).single();
  if (error) return undefined;
  return fromRow(data as Record<string, unknown>);
}

export async function getDealBySlug(slug: string): Promise<StoredDeal | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("deals").select("*").eq("slug", slug).single();
  if (error) return undefined;
  return fromRow(data as Record<string, unknown>);
}

export async function getActiveDeals(): Promise<StoredDeal[]> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .eq("archived", false)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getFeaturedDeals(): Promise<StoredDeal[]> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .eq("archived", false)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("display_order", { ascending: true })
    .limit(8);
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getDealsBySection(section: string): Promise<StoredDeal[]> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("section", section)
    .eq("status", "active")
    .eq("archived", false)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function isDealSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = createAdminClient();
  let query = supabase.from("deals").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return !data || data.length === 0;
}

export async function createDeal(deal: StoredDeal): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("deals").insert(toRow(deal));
  if (error) throw new Error(error.message);
}

export async function updateDeal(id: string, updates: Partial<StoredDeal>): Promise<StoredDeal> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deals")
    .update(toRow(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function archiveDeal(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("deals")
    .update({ archived: true, status: "archived" })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
