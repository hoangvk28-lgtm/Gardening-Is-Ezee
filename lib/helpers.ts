import { categories, type Category } from "@/data/categories";
import { products, type Product } from "@/data/products";
import { guides, type Guide } from "@/data/guides";

// ─── Category helpers ─────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

// ─── Product helpers ──────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Returns products for a category hub page.
 * For categories that directly own products, returns those.
 * For thematic/cross-cutting categories (like "budget-finds", "compact-home-office"),
 * falls back to collecting products from the category's subcategory list, deduped.
 */
export function getProductsForCategoryHub(category: Category): Product[] {
  const direct = getProductsByCategory(category.slug);
  if (direct.length > 0) return direct;

  const seen = new Set<string>();
  const result: Product[] = [];
  for (const sub of category.subcategories) {
    for (const p of getProductsBySubcategory(sub)) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }
  }
  return result.sort((a, b) => b.scores.overall - a.scores.overall);
}

export function getProductsBySubcategory(subcategorySlug: string): Product[] {
  return products.filter((p) => p.subcategorySlug === subcategorySlug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products
    .filter((p) => p.badge !== undefined)
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit);
}

export function getAlternativeProducts(product: Product): Product[] {
  return product.alternatives
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

// ─── Guide helpers ────────────────────────────────────────────────────────────

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(categorySlug: string): Guide[] {
  return guides.filter((g) => g.categorySlug === categorySlug);
}

export function getGuidesBySubcategory(subcategorySlug: string): Guide[] {
  return guides.filter((g) => g.subcategorySlug === subcategorySlug);
}

export function getFeaturedGuides(limit = 6): Guide[] {
  return guides.slice(0, limit);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  return guide.relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== undefined);
}

// ─── Cross-entity helpers ─────────────────────────────────────────────────────

/**
 * Returns the full Product objects for a guide's recommendedProductIds,
 * preserving the original order (first = primary pick).
 */
export function getRecommendedProductsForGuide(guide: Guide): Product[] {
  return guide.recommendedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

/**
 * Returns every guide that features a given product.
 */
export function getGuidesForProduct(productId: string): Guide[] {
  return guides.filter((g) => g.recommendedProductIds.includes(productId));
}

/**
 * Builds a side-by-side comparison set for a subcategory.
 * Returns all products in the subcategory sorted by overall score descending.
 */
export function getComparisonSetBySubcategory(subcategorySlug: string): Product[] {
  return getProductsBySubcategory(subcategorySlug).sort(
    (a, b) => b.scores.overall - a.scores.overall
  );
}

/**
 * Returns unique subcategory slugs present in the products array.
 */
export function getAllSubcategories(): string[] {
  return [...new Set(products.map((p) => p.subcategorySlug))];
}
