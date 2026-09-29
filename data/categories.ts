export interface Category {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  subcategories: string[];
  /**
   * Optional list of underlying guide categorySlug/subcategorySlug values this
   * category aggregates. When present, guide matching uses this array instead
   * of a single exact `categorySlug === slug` check. Existing categories that
   * omit this keep their original single-slug matching behavior unchanged.
   */
  matchSlugs?: string[];
}

export const categories: Category[] = [
  {
    slug: "lawn-care",
    name: "Lawn Care",
    description: "Mowers, trimmers, edgers and aerators matched to yard size, terrain and upkeep.",
    shortDescription: "Mowers, trimmers, edgers and aerators matched to yard size, terrain and upkeep.",
    icon: "Leaf",
    color: "#3f6b3a",
    subcategories: ["lawn-care"],
    matchSlugs: ["lawn-care"],
  },
  {
    slug: "garden-tools",
    name: "Garden Tools",
    description: "Pruning saws, weed pullers, carts, kneelers and tool storage for everyday garden work.",
    shortDescription: "Pruning saws, weed pullers, carts, kneelers and tool storage for everyday garden work.",
    icon: "Leaf",
    color: "#5f665b",
    subcategories: ["garden-tools"],
    matchSlugs: ["garden-tools"],
  },
  {
    slug: "watering",
    name: "Watering",
    description: "Hoses, reels, nozzles, sprinklers and timers chosen around water pressure and garden size.",
    shortDescription: "Hoses, reels, nozzles, sprinklers and timers chosen around water pressure and garden size.",
    icon: "Leaf",
    color: "#3b6f8a",
    subcategories: ["watering"],
    matchSlugs: ["watering"],
  },
  {
    slug: "growing",
    name: "Growing",
    description: "Raised beds, planters, trellises and composting for vegetables, herbs and flowers.",
    shortDescription: "Raised beds, planters, trellises and composting for vegetables, herbs and flowers.",
    icon: "Leaf",
    color: "#6b8a3a",
    subcategories: ["growing"],
    matchSlugs: ["growing"],
  },
  {
    slug: "yard-cleanup",
    name: "Yard Cleanup",
    description: "Leaf blowers, pressure washers, snow blowers, chippers and tillers for seasonal jobs.",
    shortDescription: "Leaf blowers, pressure washers, snow blowers, chippers and tillers for seasonal jobs.",
    icon: "Leaf",
    color: "#b0642f",
    subcategories: ["yard-cleanup"],
    matchSlugs: ["yard-cleanup"],
  },
  {
    slug: "outdoor-living",
    name: "Outdoor Living",
    description: "Sheds, deck boxes, benches and pool cleaners for the rest of the yard.",
    shortDescription: "Sheds, deck boxes, benches and pool cleaners for the rest of the yard.",
    icon: "Leaf",
    color: "#8d6b4f",
    subcategories: ["outdoor-living"],
    matchSlugs: ["outdoor-living"],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
