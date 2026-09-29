export const guideSlug = "best-cordless-lawn-mowers";
export const guideTitle = "Best Cordless Lawn Mowers";
export const metaTitle = "Best Cordless Lawn Mowers (2026): 6 Models Compared";
export const metaDescription = "Best Cordless Lawn Mowers compared by watt-hours, deck width, self-propel draw, charging workflow, and real ownership cost.";
export const mainKeyword = "cordless lawn mowers";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "10 min";
export const heroImage = "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg";
export const introParagraphs = [
  "Cordless mower listings tend to lead with a voltage number, but voltage alone does not tell you how long a mower will run. Watt-hours, which is voltage multiplied by amp-hours, is the figure that actually approximates stored energy, and it is worth checking against the included battery rather than the largest pack the platform can technically accept.",
  "A cordless mower also differs from a corded electric mower in ways beyond convenience. There is no cable to manage around beds and trees, but there is a charging workflow, a finite runtime per charge, and battery replacement cost to plan for down the line.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "ego-lm2114", rank: 1, badge: "Best Overall", name: "EGO Power+ 21-Inch Cordless Lawn Mower (LM2114)",
    amazonUrl: "https://www.amazon.com/dp/B0BLT8L937?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "56V battery platform", "Battery and charger included", "Push drive"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"56V battery platform"},{"label":"Battery","value":"Battery and charger included"},{"label":"Feature 4","value":"Push drive"}],
    description: "The LM2114 pairs a full 21-inch deck with EGO's 56V battery platform, and it ships complete with a battery and charger rather than requiring a separate purchase to get running.\n\nFor a standard-size, mostly flat lawn, the deck width and included pack are enough to finish a typical mow in one charge for most yards. It is a push mower, not self-propelled, so hilly or larger lots will feel the difference compared to the self-propelled options below.",
    bestFor: "standard-size lawns that want a full-width cordless deck without buying the battery separately",
    pros: ["Full 21-inch deck for faster coverage", "Battery and charger included in the box", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Push drive only, no self-propel", "Included watt-hours should be checked against your lawn size before buying"],
  },
  {
    id: "greenworks-80v-21", rank: 2, badge: "Best Self-Propelled", name: "Greenworks 80V 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CLSC6B2T?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41XlO0UuWrL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "80V 4Ah battery", "Self-propelled drive", "Battery and charger included"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"80V 4Ah battery"},{"label":"Lighting","value":"Self-propelled drive"},{"label":"Battery","value":"Battery and charger included"}],
    description: "This Greenworks model steps up to an 80V 4Ah pack and adds a self-propelled drive, which matters most on sloped yards or for anyone who mows a larger area in one session.\n\nSelf-propel draws energy from the same pack that powers the blade, so actual runtime under load will land below what a push-only mower with an identical pack would deliver. Anyone comparing this to a push mower purely on voltage should account for that tradeoff, not just the higher number.",
    bestFor: "sloped or larger lawns where self-propel meaningfully reduces walking effort",
    pros: ["21-inch deck with self-propelled drive", "Higher-capacity 80V 4Ah included pack", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Self-propel draws energy that would otherwise extend blade runtime", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "greenworks-48v-combo", rank: 3, badge: "Best Multi-Tool Combo", name: "Greenworks 48V (24V x 2) 20-Inch Mower, Trimmer, and Blower Combo Kit",
    amazonUrl: "https://www.amazon.com/dp/B0FCWGJXZM?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/51lY4YwLq1L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["20-inch deck", "48V (24V x 2) battery bay", "Includes string trimmer and 320 CFM blower", "Three batteries and chargers included"],
    specList: [{"label":"Size","value":"20-inch deck"},{"label":"Power Source","value":"48V (24V x 2) battery bay"},{"label":"Airflow","value":"Includes string trimmer and 320 CFM blower"},{"label":"Battery","value":"Three batteries and chargers included"}],
    description: "This kit bundles a 20-inch cordless mower with a string trimmer and a 320 CFM blower, running off a dual 24V bay that totals to a 48V platform, and it ships with three batteries plus chargers so all three tools can be kept charged in rotation.\n\nFor a buyer replacing several separate gas tools with one battery ecosystem, the shared-battery design is the real value, not just the mower on its own. Anyone who only needs a mower will likely get better per-tool value from a standalone model.",
    bestFor: "buyers who want a mower, trimmer, and blower on one shared battery platform",
    pros: ["Mower, trimmer, and blower share one battery system", "Three batteries and chargers included", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "greenworks-40v-16", rank: 4, badge: "Best Value", name: "Greenworks 40V 16-Inch Cordless Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B00BBQVL5U?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41hGtP+Q5jL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["16-inch deck", "40V 4Ah battery", "Battery and charger included", "Push drive"],
    specList: [{"label":"Size","value":"16-inch deck"},{"label":"Power Source","value":"40V 4Ah battery"},{"label":"Battery","value":"Battery and charger included"},{"label":"Drive Type","value":"Push drive"}],
    description: "The narrower 16-inch deck means more passes to cover the same area compared to a 21-inch mower, which makes the most sense on a small lot or as a second mower for tight corners. Buyers already invested in Greenworks 40V tools can also share batteries across the platform.",
    bestFor: "small lawns and buyers already invested in Greenworks 40V battery tools",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compatible with the wider Greenworks 40V tool lineup", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["16-inch deck means more passes on a mid-size or larger lawn", "Push drive only"],
  },
  {
    id: "seyvum-40v-16", rank: 5, badge: "Best Budget Pick", name: "SEYVUM 40V 16-Inch Cordless Lawn Mower",
    amazonUrl: "https://www.amazon.com/dp/B0DX6TZM4M?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41ZZvdyiq-L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["16-inch deck", "40V with dual 4Ah batteries", "45L collection bag", "Push drive"],
    specList: [{"label":"Size","value":"16-inch deck"},{"label":"Power Source","value":"40V with dual 4Ah batteries"},{"label":"Collection","value":"45L collection bag"},{"label":"Drive Type","value":"Push drive"}],
    description: "The SEYVUM comes with two 4Ah batteries rather than one, so a depleted pack can be swapped mid-mow instead of waiting through a full charge cycle.\n\nThe 16-inch deck and lesser-known brand are the tradeoffs against the more established Greenworks and EGO options above.",
    bestFor: "budget-conscious buyers who want a spare battery included from the start",
    pros: ["Two 4Ah batteries included, so one can charge while the other runs", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "45L collection bag included"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "16-inch deck limits coverage per pass"],
  },
  {
    id: "generic-40v-18", rank: 6, badge: "Also Consider", name: "18-Inch 40V Brushless Cordless Push Lawn Mower",
    amazonUrl: "https://www.amazon.com/dp/B0H1LVKY6C?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/410KAfiMf2L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["18-inch deck", "40V brushless motor", "Push drive", "Lightweight frame"],
    specList: [{"label":"Size","value":"18-inch deck"},{"label":"Power Source","value":"40V brushless motor"},{"label":"Drive Type","value":"Push drive"},{"label":"Weight Capacity","value":"Lightweight frame"}],
    description: "A brushless motor is generally more efficient and longer-lived than a brushed one, which is a genuine upside on paper.",
    bestFor: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    pros: ["Brushless motor for efficiency and longevity", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "18-inch deck is wider than the 16-inch budget options"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
];
export const buyingCriteria = [
  { criterion: "Watt-hours, not voltage", explanation: "A higher voltage platform with a small included pack can hold less actual energy than a lower-voltage mower with a larger pack.\n\nGetting this wrong is one of the more common reasons a cordless lawn mowers purchase disappoints once it actually arrives, since watt-hours, not voltage affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Grass load changes runtime", explanation: "Manufacturer runtime figures are usually measured under light, dry grass. Tall, damp, thick, or recently missed lawns draw more current per pass and will shorten the real runtime you get from any given pack.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a cordless lawn mowers weeks after buying, since grass load changes runtime plays out differently in daily use than it does on paper." },
  { criterion: "Self-propel draws the same battery", explanation: "A self-propelled drive shares stored energy with the blade motor rather than running on a separate battery. Slopes, higher drive speed, and heavier mowers will all reduce mowing time compared to the rated figure.\n\nCompare how each cordless lawn mowers in this roundup actually handles self-propel draws the same battery rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Charging workflow", explanation: "Compare full charge time, whether the battery needs to cool before fast charging again, how many batteries are included, and whether a second charger is worth buying to keep one pack topped up while another runs.\n\nCharging workflow is easy to overlook next to flashier specs, but it's frequently the difference between a cordless lawn mowers that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Cordless vs. corded tradeoff", explanation: "A cordless mower removes the extension cord but adds a finite runtime per charge and an eventual battery replacement cost. A corded mower has unlimited runtime tethered to an outlet but no battery to plan around. Choose based on which constraint fits your yard and outlet access better.\n\nGetting this wrong is one of the more common reasons a cordless lawn mowers purchase disappoints once it actually arrives, since cordless vs. corded tradeoff affects real day-to-day use in a way marketing photos and bullet points don't always make obvious.\n\nBefore buying, check the specific listing's stated details on cordless vs." },
];
export const howWeEvaluated = [
  { title: "Battery capacity and platform fit", description: "We compared included watt-hours rather than headline voltage, and noted where a listed voltage came from a dual-battery bay rather than a single higher-voltage pack." },
  { title: "Deck width and lawn size", description: "We matched deck width against the coverage each mower is realistically suited for, since a narrower deck needs more passes to finish the same lawn." },
  { title: "Drive type and terrain", description: "We separated push and self-propelled models and noted where self-propel draws down the same battery that powers the blade, since that tradeoff matters more on slopes." },
  { title: "Compared using published specifications, included components, compatibility, and practical trade-offs.", description: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match the Mower to Your Yard", table: { headers: ["Buyer situation", "Recommended pick"], rows: [["Standard-size flat lawn, no self-propel needed", "EGO Power+ 21-Inch Cordless Lawn Mower (LM2114)"], ["Sloped or larger lawn where self-propel matters", "Greenworks 80V 21-Inch Self-Propelled Mower"], ["Want mower, trimmer, and blower on one battery system", "Greenworks 48V Mower, Trimmer, and Blower Combo Kit"], ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Greenworks 40V 16-Inch Cordless Push Mower"], ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "SEYVUM 40V 16-Inch Cordless Lawn Mower"]] } },
  { subheading: "Understand the Power Tradeoffs", cards: [ { label: "Higher voltage platform", text: "Usually means more available power and often a larger included pack, but check the actual watt-hours rather than assuming voltage alone predicts runtime." }, { label: "Self-propelled drive", text: "Reduces pushing effort on slopes and larger lawns, but shares the same battery as the blade, so expect shorter mowing time than a push-only mower with the same pack." }, { label: "Dual or spare batteries", text: "Lets you swap a depleted pack mid-mow instead of waiting through a full charge, which matters most on larger lawns or when the included pack alone won't finish in one charge." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Cost or task", "Verify before buying"], rows: [["Battery", "Compared using published specifications, included components, compatibility, and practical trade-offs."], ["Charging", "Full charge time, cooldown between fast charges, and whether a second charger is worth buying"], ["Wear parts", "Blades and, for self-propelled models, drive belts and their model-specific availability"], ["Support", "Warranty length and nearest authorized service for the specific brand and platform"]] } },
  { subheading: "Before and After Mowing", cards: [ { label: "Before mowing", text: "Confirm the battery is fully charged, check the deck for debris, and clear the lawn of sticks or rocks that could damage the blade." }, { label: "After mowing", text: "Recharge the battery promptly, clear clippings from under the deck, and store the mower somewhere dry to protect the electronics and battery contacts." } ] },
];
export const faq = [
  { q: "What should I check before buying a cordless lawn mower?", a: "Measure your lawn size, check the included battery's watt-hours rather than just the voltage, decide whether you need self-propel for slopes, and confirm the deck width matches how much coverage you want per pass." },
  { q: "Is a higher voltage always better?", a: "Not by itself. Voltage times amp-hours gives an approximate energy figure, and a lower-voltage mower with a larger included pack can outlast a higher-voltage mower with a small pack. Always check the actual watt-hours of what ships in the box." },
  { q: "How much does self-propel affect runtime?", a: "Self-propelled drive pulls energy from the same battery that powers the blade, so runtime under a self-propelled load is typically shorter than the same pack would deliver on a push-only mower, especially on slopes or at higher drive speeds." },
  { q: "Should I buy a mower with two included batteries?", a: "A second included battery lets you swap packs mid-mow instead of waiting through a full charge, which is most useful on larger lawns where one pack won't finish the job. For a small lawn, a single well-sized pack is often enough." },
  { q: "How is a cordless mower different from a corded one?", a: "A cordless mower has no cable to manage but a finite runtime per charge and an eventual battery replacement cost. A corded mower has unlimited runtime but requires an outlet and extension cord within reach and a mowing pattern that keeps the cable clear of the blade." },
];
export const relatedGuides: { title: string; href: string }[] = [];
