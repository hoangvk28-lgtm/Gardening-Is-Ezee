export const guideSlug = "best-21-inch-lawn-mowers";
export const guideTitle = "Best 21-Inch Lawn Mowers";
export const metaTitle = "Best 21-Inch Lawn Mowers (2026): Current Models and Buying Guide";
export const metaDescription = "Best 21-inch lawn mowers compared by cutting swath, drive type, battery workflow, weight, and bag capacity so you can match one to your yard.";
export const mainKeyword = "21 inch lawn mowers";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "11 min";
export const heroImage = "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg";
export const introParagraphs = [
  "A 21-inch deck is the most common size for mid-size residential lawns, but the number on the box is the total machine width, not the actual cutting swath, and it says nothing about whether the mower is a push model, a self-propelled unit, or how much battery or fuel workflow comes with it.",
  "We compared current 21-inch class mowers on drive type, included battery capacity where applicable, operating weight, bag size, and the tradeoffs each format brings so you can match a mower to your actual lawn instead of chasing a headline deck size.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "ego-lm2114", rank: 1, badge: "Best Overall", name: "EGO Power+ LM2114 21-Inch Cordless Mower",
    amazonUrl: "https://www.amazon.com/dp/B0BLT8L937?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "56V battery platform", "Battery and charger included", "Push drive"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"56V battery platform"},{"label":"Battery","value":"Battery and charger included"},{"label":"Feature 4","value":"Push drive"}],
    description: "The EGO Power+ LM2114 pairs a 21-inch deck with the 56V battery platform, and it ships with a battery and charger rather than requiring a separate purchase to get running.\n\nIt is a push model, not self-propelled, so operator effort scales with lawn size and any slope. Confirm the included battery's watt-hours against your lawn size before buying, since runtime in tall or damp grass will be shorter than the rated figure.",
    bestFor: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    pros: ["21-inch deck with battery and charger included", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "56V platform shared across other EGO tools"],
    cons: ["Push drive only, so larger or sloped lawns require more operator effort", "Included watt-hours should be checked against your lawn size before buying"],
  },
  {
    id: "greenworks-80v-21-sp", rank: 2, badge: "Best Self-Propelled", name: "Greenworks 80V 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CLSC6B2T?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41XlO0UuWrL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "80V 4.0Ah battery", "Self-propelled drive", "Battery and charger included"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"80V 4.0Ah battery"},{"label":"Lighting","value":"Self-propelled drive"},{"label":"Battery","value":"Battery and charger included"}],
    description: "The Greenworks 80V 21-Inch Self-Propelled Mower combines the 21-inch deck with an 80V 4.0Ah battery and a self-propelled drive, which reduces pushing effort on larger or gently sloped lawns.\n\nSelf-propel draws from the same battery as the blade, so runtime will run shorter than a push-only model with the same pack. Compare its total weight and turning behavior around beds and obstacles before deciding it fits a smaller or tightly landscaped yard.",
    bestFor: "medium to larger lawns where self-propel reduces walking effort",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Battery and charger included", "80V pack gives more headroom than a 40V or 56V push mower"],
    cons: ["Self-propel shares battery energy with the blade, shortening runtime versus push-only use", "Heavier than push models, which matters for storage and lifting over curbs"],
  },
  {
    id: "greenworks-60v-21-push", rank: 3, badge: "Best Value", name: "Greenworks 60V 21-Inch Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B0C2ZPBHC7?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41R0pwuOOQL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "60V 5.0Ah battery", "Push drive", "Battery and charger included"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"60V 5.0Ah battery"},{"label":"Drive Type","value":"Push drive"},{"label":"Battery","value":"Battery and charger included"}],
    description: "As a push-only model it needs more operator effort than the self-propelled 80V version, but the larger 5.0Ah pack gives it more working time per charge than smaller included batteries. Weigh that against whether your lawn's terrain makes self-propel worth the added cost.",
    bestFor: "flat to gently sloped lawns where a larger included battery matters more than self-propel",
    pros: ["Larger 5.0Ah included battery than several push competitors", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Push drive only, so effort increases on slopes or larger lots", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "worx-wg752", rank: 4, badge: "Best for Mulching and Bagging", name: "Worx WG752 40V 21-Inch 3-in-1 Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CZRJWVJJ?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41RvKAwS-sL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "40V battery platform", "3-in-1 mulch, bag, or side discharge", "Rated for up to 1/2 acre"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"40V battery platform"},{"label":"Collection","value":"3-in-1 mulch, bag, or side discharge"},{"label":"Durability","value":"Rated for up to 1/2 acre"}],
    description: "The Worx WG752 combines a 21-inch deck with a 40V battery platform and 3-in-1 capability, letting you switch between mulching, bagging, and side discharge without changing mowers.\n\nThe 40V platform is lighter-duty than the 60V and 80V options here, so verify the included pack's capacity covers your full lawn before committing to a single charge per session. The flexibility of switching cutting modes is the main draw over single-mode competitors.",
    bestFor: "lawns needing flexible mulch, bag, or discharge switching in one machine",
    pros: ["3-in-1 mulch, bag, and discharge switching", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "Manufacturer-rated for lawns up to about 1/2 acre"],
    cons: ["40V platform has less headroom than the 60V or 80V options in this guide", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "greenworks-80v-21-push", rank: 5, badge: "Best High-Rated Push Model", name: "Greenworks 80V 21-Inch Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CLSBDL43?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41VCBvwT7BL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "80V 4.0Ah battery", "Push drive", "Battery and charger included"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"80V 4.0Ah battery"},{"label":"Drive Type","value":"Push drive"},{"label":"Battery","value":"Battery and charger included"}],
    description: "The Greenworks 80V 21-Inch Push Mower uses the same 80V 4.0Ah battery as its self-propelled sibling but skips the drive motor, so all of that energy goes to the blade instead of being shared with propulsion.\n\nWithout self-propel, operator effort still scales with lawn size and slope, but the tradeoff is longer working time per charge than a self-propelled mower pulling from the same pack. It is also the most expensive push model in this comparison.",
    bestFor: "buyers who want the 80V platform's runtime without paying for self-propel",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Full 80V 4.0Ah battery energy goes to the blade with no drive motor drawing from it", "Battery and charger included"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "senix-x6-60v", rank: 6, badge: "Best for Feature Set", name: "SENIX X6 60V 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0GWL8DPV6?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/51URoz8Vl4L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "60V 8Ah battery", "Self-propelled with 7-level height adjustment", "Smart display"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"60V 8Ah battery"},{"label":"Adjustability","value":"Self-propelled with 7-level height adjustment"},{"label":"Feature 4","value":"Smart display"}],
    description: "The SENIX X6 pairs a 21-inch deck with a 60V 8Ah battery, the largest included pack by amp-hours in this guide, along with self-propelled drive, a 7-level cutting height adjustment, and a smart display for monitoring the mower's status.",
    bestFor: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    pros: ["Largest included battery capacity by amp-hours in this guide", "Self-propelled with a 7-level height adjustment and smart display", "3-in-1 cutting modes"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Newer to market, so long-term reliability is less established"],
  }
];
export const buyingCriteria = [
  { criterion: "Actual cutting swath vs total machine width", explanation: "The 21-inch figure is usually the deck's outer width, and the true cutting swath (what actually gets clipped in a single pass) is typically an inch or so narrower once you account for the deck housing and wheel placement. Check the manufacturer's cutting width spec, not just the marketing deck size.\n\nGetting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since actual cutting swath vs total machine width affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Overlap and pass-count time savings", explanation: "A wider effective swath needs fewer passes to cover the same lawn, but only if you overlap each pass slightly to avoid missed strips. Estimate total mowing time from swath width and lawn area, not deck size alone.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a lawn mowers weeks after buying, since overlap and pass-count time savings plays out differently in daily use than it does on paper." },
  { criterion: "Turning around tight obstacles", explanation: "A 21-inch mower still needs clearance to turn around beds, trees, and fence corners. Self-propelled models with rear-wheel drive typically turn tighter than front-wheel-drive units, so check drive type if your yard has many obstacles.\n\nCompare how each lawn mowers in this roundup actually handles turning around tight obstacles rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Operating weight and bag size", explanation: "Battery packs and self-propel motors add weight that matters when lifting the mower over curbs, into a shed, or up stairs. Bag capacity affects how often you stop to empty clippings on a full mow.\n\nOperating weight and bag size is easy to overlook next to flashier specs, but it's frequently the difference between a lawn mowers that fits your routine and one that quietly becomes a hassle." },
  { criterion: "When an adjacent deck size fits better", explanation: "A 21-inch mower is a middle ground. Very small lots may be better served by a 16 to 19-inch push mower for easier storage and lighter weight, while larger open lawns may be better matched to a wider self-propelled or riding mower to reduce total pass count.\n\nGetting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since when an adjacent deck size fits better affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." }
];
export const howWeEvaluated = [
  { title: "Deck and drive fit", description: "We compared each mower's cutting swath, drive type, and rated lawn size against typical mid-size residential lots before comparing headline specs." },
  { title: "Battery and power workflow", description: "For battery models we compared included pack voltage and amp-hours, whether a charger came in the box, and how self-propel draws down that same energy." },
  { title: "Handling and daily use", description: "Turning room around obstacles, push or drive effort, height adjustment range, and bag handling all affect how manageable a 21-inch mower feels week after week." },
  { title: "Compared using published specifications, included components, compatibility, and practical trade-offs.", description: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match the Property Before the Badge", table: { headers: ["Buyer situation", "Recommended direction"], rows: [["Want the most proven, widely reviewed option", "EGO Power+ LM2114 21-Inch Cordless Mower"], ["Larger lawn where self-propel matters most", "Greenworks 80V 21-Inch Self-Propelled Mower"], ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Greenworks 60V 21-Inch Push Mower"], ["Need to switch between mulch, bag, and discharge often", "Worx WG752 40V 21-Inch 3-in-1 Mower"], ["Want maximum runtime without paying for self-propel", "Greenworks 80V 21-Inch Push Mower"]] } },
  { subheading: "Choose the Right Drive Type", cards: [ { label: "Push drive", text: "Best for flat, smaller lawns where lower weight, lower cost, and simpler maintenance matter more than reduced walking effort." }, { label: "Self-propelled", text: "Best for larger or gently sloped lawns where reducing operator effort over a full mowing session outweighs the added weight and cost." }, { label: "3-in-1 switching", text: "Best for lawns that change condition through the season, letting one mower mulch in spring and bag or discharge later without a second machine." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Cost or task", "Verify before buying"], rows: [["Power", "Battery voltage, amp-hours, and whether a charger is included in the box"], ["Wear parts", "Blades, and model-specific availability for replacement batteries"], ["Logistics", "Delivered deck width versus gate and shed clearance"], ["Support", "Warranty length and nearest authorized service for the brand"]] } },
  { subheading: "Comfort and Workload Checklist", cards: [ { label: "During mowing", text: "Consider starting steps, handle height adjustment, push or drive effort, turning room around obstacles, and cutting height adjustment range." }, { label: "After mowing", text: "Check bag removal and capacity, deck cleaning, charging time between uses, folding for storage, and access to replacement parts." } ] },
];
export const faq = [
  { q: "Is 21 inches the actual cutting width or the total machine width?", a: "The 21-inch figure is generally the deck's outer width. The true cutting swath is usually about an inch narrower once the housing and wheel placement are accounted for, so check the manufacturer's cutting width spec for precise pass planning." },
  { q: "Do I need self-propel on a 21-inch mower?", a: "Self-propel mainly helps on larger lawns or gentle slopes where walking effort adds up over a full mowing session. On a small flat lawn, a lighter push model is often easier to store and maintain." },
  { q: "How much does battery voltage matter compared to amp-hours?", a: "Voltage alone does not tell you runtime. Multiply the pack's voltage by its amp-hours for an approximate energy figure, then compare that against your lawn size and whether the mower is push or self-propelled, since self-propel shares that energy with the blade." },
  { q: "Compared using published specifications, included components, compatibility, and practical trade-offs.", a: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
  { q: "When should I choose a different deck size instead of 21 inches?", a: "A smaller 16 to 19-inch mower can be easier to store and lift for very small lots, while a wider self-propelled or riding mower can cut total mowing time on large open lawns by reducing the number of passes needed." },
];
export const relatedGuides: { title: string; href: string }[] = [];
