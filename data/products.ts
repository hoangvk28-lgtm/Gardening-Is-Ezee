import { buildAmazonUrl } from "@/lib/affiliate";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductScore {
  overall: number;       // 1–10  weighted aggregate
  smallSpaceFit: number; // how well it works in a tight/dorm space
  buildQuality: number;  // materials, finish, sturdiness
  easeOfUse: number;     // setup time, daily usability
  valueForMoney: number; // price vs. performance vs. competition
  buyerFeedback: number; // derived from verified Amazon review patterns
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  image: string;
  amazonUrl: string;
  priceRange: string;   // display string, e.g. "$25–$30"
  badge?: string;       // single primary editorial badge
  shortDescription: string;
  bestFor: string[];
  notIdealFor: string[];
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  scores: ProductScore;
  reviewSummary: string;
  alternatives: string[];      // sibling product IDs
  relatedGuideSlugs: string[]; // guides that feature this product
  // Product Library fields (Phase 2)
  asin?: string;           // Amazon ASIN (auto-builds amazonUrl if set)
  priceLabel?: "Budget" | "Mid-range" | "Premium" | "Check Amazon";
  useCase?: string;        // one-line use-case summary for editors
  sourceNotes?: string;    // internal verification notes — not rendered publicly
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Gardening Is Ezee: product-level review data is added as reviews are written.
export const products: Product[] = [];

// ─── Type exports ─────────────────────────────────────────────────────────────

export type ProductSubcategory =
  | "desk-lamps"
  | "monitor-stands"
  | "laptop-stands"
  | "cable-management"
  | "bedside-caddies"
  | "under-bed-storage"
  | "storage-carts"
  | "desk-organizers"
  | "study-tools"
  | "wireless-charging"
  | "keyboards"
  | "door-organizers"
  | "storage-bins"
  | "shower-caddies"
  | "bed-risers"
  | "vacuum-bags"
  | "power-strips";
