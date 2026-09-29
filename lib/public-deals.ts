import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getPublicProducts } from "@/lib/public-products";
import type { StoredDeal } from "@/lib/deals-store";
import type { Product } from "@/data/products";

export interface PublicDeal {
  id: string;
  productId: string;
  productSlug: string;
  title: string;
  slug: string;
  label: string;
  description: string;
  section: string;
  placement: string;
  amazonUrl: string;
  ctaText: string;
  priceRange: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  displayOrder: number;
  // resolved product (if linked)
  product?: Product;
}

function dealToPublic(deal: StoredDeal, products: Product[]): PublicDeal {
  const product = deal.productSlug
    ? products.find((p) => p.slug === deal.productSlug || p.id === deal.productId)
    : undefined;
  return {
    id: deal.id,
    productId: deal.productId,
    productSlug: deal.productSlug,
    title: deal.title,
    slug: deal.slug,
    label: deal.label,
    description: deal.description,
    section: deal.section,
    placement: deal.placement,
    amazonUrl: deal.amazonUrlOverride || product?.amazonUrl || "",
    ctaText: deal.ctaText || "Check current price",
    priceRange: deal.priceRangeOverride || product?.priceRange || "",
    image: deal.imageOverride || product?.image || "",
    imageAlt: deal.imageAlt || product?.name || deal.title,
    featured: deal.featured,
    displayOrder: deal.displayOrder,
    product,
  };
}

async function fetchActiveDeals(): Promise<StoredDeal[]> {
  const { getActiveDeals } = await import("@/lib/deals-store");
  return getActiveDeals();
}

export async function getPublicDeals(): Promise<PublicDeal[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const [deals, products] = await Promise.all([fetchActiveDeals(), getPublicProducts()]);
    if (deals.length === 0) return [];
    return deals.map((d) => dealToPublic(d, products));
  } catch (e) {
    console.warn("[public-deals] Supabase error, returning empty:", (e as Error).message);
    return [];
  }
}

export async function getPublicFeaturedDeals(): Promise<PublicDeal[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { getFeaturedDeals } = await import("@/lib/deals-store");
    const [deals, products] = await Promise.all([getFeaturedDeals(), getPublicProducts()]);
    if (deals.length === 0) return [];
    return deals.map((d) => dealToPublic(d, products));
  } catch (e) {
    console.warn("[public-deals] Supabase error for featured deals:", (e as Error).message);
    return [];
  }
}

export async function getPublicDealsBySection(section: string): Promise<PublicDeal[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { getDealsBySection } = await import("@/lib/deals-store");
    const [deals, products] = await Promise.all([getDealsBySection(section), getPublicProducts()]);
    return deals.map((d) => dealToPublic(d, products));
  } catch (e) {
    console.warn("[public-deals] Supabase error for section deals:", (e as Error).message);
    return [];
  }
}
