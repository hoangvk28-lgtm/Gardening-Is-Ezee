// Topic-first top-level sections for Gardening Is Ezee. Each is a real route
// (e.g. /lawn-care) that lists its guides and hosts /<section>/<slug> pages.

export interface Silo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}

export const silos: Silo[] = [
  { slug: "lawn-care", name: "Lawn Care", tagline: "Mowers, trimmers and the tools that keep grass in shape",
    description: "Buying guides for lawn mowers, string trimmers, edgers, aerators and dethatchers, matched to yard size, terrain and how much upkeep you want." },
  { slug: "garden-tools", name: "Garden Tools", tagline: "Hand tools, pruning saws, carts and kneelers",
    description: "Guides to shovels, pruning shears and saws, weed pullers, garden carts, wheelbarrows, seats and tool storage for everyday garden work." },
  { slug: "watering", name: "Watering", tagline: "Hoses, reels, sprinklers and smart controllers",
    description: "Guides to garden hoses, hose reels, nozzles, sprinklers, sprayers, watering cans and timers, chosen around water pressure and garden size." },
  { slug: "growing", name: "Growing", tagline: "Raised beds, planters and composting",
    description: "Guides to raised garden beds, planters, trellises and compost tumblers for growing vegetables, herbs and flowers in any space." },
  { slug: "yard-cleanup", name: "Yard Cleanup", tagline: "Blowers, pressure washers and seasonal power tools",
    description: "Guides to leaf blowers, pressure washers, snow blowers, chippers, shredders, tillers and log splitters for seasonal yard work." },
  { slug: "outdoor-living", name: "Outdoor Living", tagline: "Sheds, storage, benches and pool care",
    description: "Guides to outdoor storage sheds, deck boxes, garden benches and pool cleaners for the rest of the yard." },
];

// Kept for compatibility with components that expect aggregate hubs.
export const departmentHubs: Silo[] = [];

export function getSiloBySlug(slug: string): Silo | undefined {
  return silos.find((s) => s.slug === slug) ?? departmentHubs.find((s) => s.slug === slug);
}
