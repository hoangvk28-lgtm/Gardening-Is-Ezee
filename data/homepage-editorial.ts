// ── Homepage presentation mapping (Gardening Is Ezee) ───────────────────────
// PRESENTATION CONFIG ONLY. Every entry references an EXISTING guide or
// product by slug — nothing here creates records or content. Missing slugs are
// skipped at render time, and a guide is never shown twice on the page.
//
// FALLBACK NOTE: "mostRead" is an editorial selection, not analytics-driven —
// replace with real pageview ranking once a data source exists.

export type ArticleFormat = "Buying Guide" | "Review" | "Explainer" | "Ideas" | "How-To";

export interface HomepageArticleRef {
  slug: string;
  /** Optional eyebrow override; otherwise derived from the guide. */
  format?: ArticleFormat;
}

export const homepageEditorial = {
  /** First slug that exists wins. */
  featured: {
    candidates: ["best-push-lawn-mowers", "best-electric-lawn-mowers", "best-robot-lawn-mowers"],
    eyebrow: "Featured Guide",
    headline: "The Best Lawn Mowers for Your Yard",
    dek: "We compare cut width, power source, handling and upkeep to help you choose a mower that fits your lawn, your storage space and how often you mow.",
    byline: "Gardening Is Ezee Editors",
  },
  latest: [
    { slug: "best-cedar-raised-garden-beds", format: "Buying Guide" },
    { slug: "best-expandable-garden-hoses", format: "Buying Guide" },
    { slug: "best-cordless-leaf-blowers", format: "Buying Guide" },
  ] as HomepageArticleRef[],
  mostRead: [
    { slug: "best-robot-lawn-mowers" },
    { slug: "best-weed-pullers" },
    { slug: "best-retractable-garden-hose-reels" },
    { slug: "best-elevated-garden-beds" },
    { slug: "best-robotic-pool-cleaners" },
  ] as HomepageArticleRef[],
  departments: [
    {
      id: "lawn-care",
      title: "Lawn Care",
      href: "/lawn-care",
      topics: ["Push Mowers", "Riding Mowers", "Robot Mowers", "Trimmers", "Edgers"],
      articles: [
        { slug: "best-riding-lawn-mowers", format: "Buying Guide" },
        { slug: "best-zero-turn-lawn-mowers" },
        { slug: "best-toro-lawn-mowers" },
        { slug: "best-honda-lawn-mowers" },
        { slug: "best-husqvarna-lawn-mowers" },
      ] as HomepageArticleRef[],
    },
    {
      id: "watering",
      title: "Watering",
      href: "/watering",
      topics: ["Garden Hoses", "Hose Reels", "Sprinklers", "Nozzles", "Timers"],
      articles: [
        { slug: "best-garden-hoses", format: "Buying Guide" },
        { slug: "best-wall-mounted-garden-hose-reels" },
        { slug: "best-flexzilla-garden-hoses" },
        { slug: "best-100-foot-garden-hoses" },
        { slug: "best-garden-hoses-with-reels" },
      ] as HomepageArticleRef[],
    },
    {
      id: "garden-tools",
      title: "Garden Tools",
      href: "/garden-tools",
      topics: ["Weed Pullers", "Pruning Saws", "Garden Carts", "Kneelers", "Tool Storage"],
      articles: [
        { slug: "best-electric-weed-pullers" },
        { slug: "best-stand-up-weed-pullers" },
        { slug: "best-long-handled-weed-pullers" },
        { slug: "best-weed-pullers-for-seniors" },
      ] as HomepageArticleRef[],
    },
  ],
  workspaceIdeas: {
    title: "Growing",
    href: "/growing",
    articles: [
      { slug: "best-self-watering-raised-garden-beds", format: "Buying Guide" },
      { slug: "best-galvanized-raised-garden-beds" },
      { slug: "best-l-shaped-raised-garden-beds" },
      { slug: "best-composite-raised-garden-beds" },
    ] as HomepageArticleRef[],
  },
  workBetter: {
    title: "Yard Cleanup",
    href: "/yard-cleanup",
    articles: [
      { slug: "best-battery-backpack-leaf-blowers" },
      { slug: "best-leaf-blower-vacuum-combos" },
      { slug: "best-gas-backpack-leaf-blowers" },
      { slug: "best-high-cfm-leaf-blowers" },
    ] as HomepageArticleRef[],
  },
  /** Product-level picks are added once review pages exist. */
  editorsPicksFallback: [] as { slug: string; useCase: string }[],
};

export const shoppingCategories = [
  { icon: "mower", label: "Lawn Mowers", note: "Push, riding, robot", href: "/lawn-care" },
  { icon: "trimmer", label: "Trimmers", note: "String, edgers, shears", href: "/lawn-care" },
  { icon: "hose", label: "Hoses & Reels", note: "Expandable, retractable", href: "/watering" },
  { icon: "sprout", label: "Raised Beds", note: "Cedar, metal, elevated", href: "/growing" },
  { icon: "blower", label: "Leaf Blowers", note: "Cordless, backpack, gas", href: "/yard-cleanup" },
  { icon: "shears", label: "Pruning Tools", note: "Saws, shears, pullers", href: "/garden-tools" },
  { icon: "shed", label: "Sheds & Storage", note: "Resin, metal, deck boxes", href: "/outdoor-living" },
] as const;

export type CategoryIconName = (typeof shoppingCategories)[number]["icon"];
