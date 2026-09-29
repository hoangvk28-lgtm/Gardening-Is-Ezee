export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const mainNav: NavItem[] = [
  {
    label: "Garden Guides",
    href: "/guide",
    children: [
      { label: "Lawn Care", href: "/lawn-care", description: "Mowers, trimmers, edgers and aerators" },
      { label: "Garden Tools", href: "/garden-tools", description: "Pruning, digging, carts and kneelers" },
      { label: "Watering", href: "/watering", description: "Hoses, reels, sprinklers and timers" },
      { label: "Growing", href: "/growing", description: "Raised beds, planters and composting" },
      { label: "Yard Cleanup", href: "/yard-cleanup", description: "Blowers, pressure washers and snow" },
      { label: "Outdoor Living", href: "/outdoor-living", description: "Sheds, storage, benches and pools" },
    ],
  },
  { label: "How We Review", href: "/how-we-review" },
  { label: "About", href: "/about" },
];

export const footerNav = {
  categories: [
    { label: "Lawn Care", href: "/lawn-care" },
    { label: "Garden Tools", href: "/garden-tools" },
    { label: "Watering", href: "/watering" },
    { label: "Growing", href: "/growing" },
    { label: "Yard Cleanup", href: "/yard-cleanup" },
    { label: "Outdoor Living", href: "/outdoor-living" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "How We Review", href: "/how-we-review" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

// ── Gardening Is Ezee editorial navigation ──────────────────────────────────
// Primary departments are topical. Reviews / Buying Guides / Deals are content
// formats and live in the secondary nav only.
export const departmentNav: { label: string; href: string; description: string }[] = [
  { label: "Lawn Care", href: "/lawn-care", description: "Mowers, trimmers, edgers and aerators" },
  { label: "Garden Tools", href: "/garden-tools", description: "Pruning, digging, carts and kneelers" },
  { label: "Watering", href: "/watering", description: "Hoses, reels, sprinklers and timers" },
  { label: "Growing", href: "/growing", description: "Raised beds, planters and composting" },
  { label: "Yard Cleanup", href: "/yard-cleanup", description: "Blowers, pressure washers and snow" },
  { label: "Outdoor Living", href: "/outdoor-living", description: "Sheds, storage, benches and pools" },
];

export const secondaryNav: { label: string; href: string }[] = [
  { label: "All Guides", href: "/guide" },
];

export const companyNav: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "How We Review", href: "/how-we-review" },
  { label: "Editorial Policy", href: "/how-we-review#editorial-policy" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/privacy-policy#terms" },
];
