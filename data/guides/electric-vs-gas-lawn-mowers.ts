export const guideSlug = "electric-vs-gas-lawn-mowers";
export const guideTitle = "Electric vs Gas Lawn Mowers";
export const metaTitle = "Electric vs Gas Lawn Mowers (2026): Which Power Source Fits Your Yard";
export const metaDescription = "Electric vs gas lawn mowers compared by deck width, active mowing time, cut quality, ownership cost, and which power source fits which yard.";
export const mainKeyword = "electric vs gas lawn mowers";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "11 min";
export const heroImage = "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg";
export const introParagraphs = [
  "There is no single winner between electric and gas lawn mowers. The right choice depends on lawn size, terrain, how long a mowing session runs, and whether the interruption you can tolerate is a battery swap, a charge wait, or a refuel and a pull cord. We matched real electric and gas mowers at comparable deck widths so the comparison reflects actual buying decisions instead of a blanket recommendation.",
  "Below we compare deck width, active mowing time against refuel and recharge interruptions, cut and bagging quality, three-year running cost, and scenario-based picks so you can match a mower to the yard you actually have, not an average one.",
];

export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }

export const products: GuideProduct[] = [
  {
    id: "ego-lm2114", rank: 1, badge: "Best Electric Overall", name: "EGO Power+ LM2114 21-Inch Cordless Mower",
    amazonUrl: "https://www.amazon.com/dp/B0BLT8L937?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "56V battery platform", "Battery and charger included", "Push drive"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"56V battery platform"},{"label":"Battery","value":"Battery and charger included"},{"label":"Feature 4","value":"Push drive"}],
    description: "That combination makes it the electric pick most comparable in cutting width to a standard gas push mower, without the fuel, oil, or pull-start routine.\n\nAgainst a gas equivalent, the tradeoff is charge time rather than refuel time: a spent battery needs to recharge before the mower can finish a large lawn in one pass, while a gas mower only needs a fuel top-off. For yards that fit inside one battery charge, the EGO removes engine maintenance entirely.",
    bestFor: "standard-size lawns wanting gas-equivalent deck width without engine maintenance",
    pros: ["21-inch deck matches typical gas mower cutting width", "56V battery and charger included, no separate fuel purchase", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["A depleted battery needs a full recharge before finishing a large lawn", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "powersmart-easyglide-144cc", rank: 2, badge: "Best Gas Overall", name: "PowerSmart EasyGlide 21-Inch Gas Mower, 144cc",
    amazonUrl: "https://www.amazon.com/dp/B0CB9XSR1S?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/419ZsDeTwFL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "144cc 4-stroke OHV engine", "3-in-1 mulch, bag, or side discharge", "6-position height adjustment"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Feature 2","value":"144cc 4-stroke OHV engine"},{"label":"Collection","value":"3-in-1 mulch, bag, or side discharge"},{"label":"Adjustability","value":"6-position height adjustment"}],
    description: "As long as the fuel tank is full, active mowing time is not capped the way a single battery charge caps a cordless mower, which matters most on larger or overgrown lawns mowed in one continuous session.\n\nThe tradeoff moves from charge time to upkeep: oil changes, air filter checks, spark plug replacement, and pull-start reliability become the owner's responsibility, along with storing and handling gasoline safely between seasons. For a lawn too large to finish on one electric charge, that upkeep buys uninterrupted runtime.",
    bestFor: "larger lawns mowed in one session where uninterrupted engine runtime matters more than avoiding maintenance",
    pros: ["Refueling is faster than a full battery recharge", "3-in-1 mulch, bag, or side discharge on a steel deck", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Requires ongoing oil, filter, spark plug, and fuel upkeep", "Gasoline storage and engine noise are tradeoffs a battery mower avoids"],
  },
  {
    id: "ego-lm2134sp", rank: 3, badge: "Best Electric for Self-Propelled Power", name: "EGO Power+ LM2134SP-2 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CVSG63DG?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41bI4lOM9KL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "Self-propelled drive", "Cordless battery platform", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Lighting","value":"Self-propelled drive"},{"label":"Battery","value":"Cordless battery platform"},{"label":"Durability","value":"Compared using published specifications, included components, compatibility, and practical trade-offs."}],
    description: "Self-propel closes one of the biggest practical gaps between electric and gas mowers on sloped or larger properties, where pushing a battery mower without drive assist gets tiring well before the battery runs low.\n\nSelf-propel draws from the same battery that powers the blade, so drive use on hills or at higher speed can shorten the mowing time available before a recharge is needed.",
    bestFor: "sloped or larger yards where self-propel matters as much as going cordless",
    pros: ["Self-propelled drive on a full 21-inch cordless deck", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "No engine maintenance or fuel handling"],
    cons: ["Drive assist shares battery capacity with the blade, shortening runtime on hills", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "greenworks-60v-21", rank: 4, badge: "Best Electric Alternative", name: "Greenworks 60V 21-Inch Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B0C2ZPBHC7?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41R0pwuOOQL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "60V 5.0Ah battery and charger included", "Push drive", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"60V 5.0Ah battery and charger included"},{"label":"Drive Type","value":"Push drive"},{"label":"Durability","value":"Compared using published specifications, included components, compatibility, and practical trade-offs."}],
    description: "Like other single-battery push mowers, active mowing time is limited by one charge, and a second battery is the practical way to extend a session without waiting for a recharge mid-lawn. For buyers already invested in Greenworks 60V tools, it also shares a battery platform across the yard.",
    bestFor: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    pros: ["21-inch deck with 5.0Ah battery and charger included", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "Shares a battery platform with other Greenworks 60V tools"],
    cons: ["One included battery caps active mowing time before a recharge", "Push-only drive on a lawn where self-propel would help"],
  },
  {
    id: "greenworks-40v-16", rank: 5, badge: "Best Electric for Small Yards", name: "Greenworks 40V 16-Inch Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B00BBQVL5U?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41hGtP+Q5jL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["16-inch deck", "40V 4.0Ah battery and charger included", "Push drive", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    specList: [{"label":"Size","value":"16-inch deck"},{"label":"Power Source","value":"40V 4.0Ah battery and charger included"},{"label":"Drive Type","value":"Push drive"},{"label":"Durability","value":"Compared using published specifications, included components, compatibility, and practical trade-offs."}],
    description: "The narrower 16-inch deck means more passes on a mid-size lawn compared with a 21-inch mower of either power type, and the single included battery limits a session on anything beyond a small yard. For a genuinely small or trim-focused lawn, the lighter weight and lack of fuel handling are the bigger factors.",
    bestFor: "small lawns where light weight matters more than deck width",
    pros: ["Lightest mower in this comparison with battery and charger included", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["16-inch deck needs more passes than a 21-inch mower on a mid-size lawn", "Single battery limits active mowing time on anything beyond a small yard"],
  },
  {
    id: "lawnmaster-meb1114k", rank: 6, badge: "Best Electric Corded Value", name: "LawnMaster MEB1114K 15-Inch Corded Mower",
    amazonUrl: "https://www.amazon.com/dp/B092CMM5XM?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41tLNlfosEL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["15-inch deck", "11A corded motor", "No battery to charge or replace", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    specList: [{"label":"Size","value":"15-inch deck"},{"label":"Feature 2","value":"11A corded motor"},{"label":"Battery","value":"No battery to charge or replace"},{"label":"Durability","value":"Compared using published specifications, included components, compatibility, and practical trade-offs."}],
    description: "Because it plugs into an outlet, it never needs a recharge or a refuel, but it also never runs untethered, which rules it out for larger or obstacle-heavy yards regardless of how it compares to gas on power.\n\nFor a small, unobstructed lawn near an outlet, it avoids both sides of the electric-vs-gas tradeoff: no engine upkeep and no battery capacity to manage, at the cost of managing an extension cord around the mowing path.",
    bestFor: "small unobstructed lawns near an outlet where cord management is acceptable",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Never needs a recharge, refuel, or engine service", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Cord length and routing limit it to small, unobstructed yards", "Not comparable to gas or cordless mowers on deck width or open-range mowing"],
  },
];

export const buyingCriteria = [
  { criterion: "Match deck width before comparing power source", explanation: "A 16-inch electric mower and a 21-inch gas mower are not a fair comparison. Compare mowers at the same or nearly the same deck width so the power-source difference is the only real variable.\n\nGetting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since match deck width before comparing power source affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Active mowing time versus interruptions", explanation: "Gas mowers are limited by tank size and refueling speed, while battery mowers are limited by charge capacity and recharge time. Estimate how long your lawn actually takes to mow and compare that against each mower's realistic uninterrupted range.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a lawn mowers weeks after buying, since active mowing time versus interruptions plays out differently in daily use than it does on paper." },
  { criterion: "Cut, bagging, and mulching quality", explanation: "Compare deck design, discharge options (mulch, bag, side discharge), and height adjustment range rather than assuming power source alone determines cut quality at a matched deck width.\n\nCompare how each lawn mowers in this roundup actually handles cut, bagging, and mulching quality rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Three-year energy, fuel, and maintenance cost", explanation: "Three-year energy, fuel, and maintenance cost is easy to overlook next to flashier specs, but it's frequently the difference between a lawn mowers that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Scenario-based winner, not a universal answer", explanation: "The better mower depends on lawn size, slope, session length, and how much engine maintenance or charge planning the owner wants to take on. Match the mower to the scenario rather than picking a power source first.\n\nGetting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since scenario-based winner, not a universal answer affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
];

export const howWeEvaluated = [
  { title: "Deck width parity", description: "We compared electric and gas mowers at matched or near-matched deck widths so the power-source comparison was not distorted by cutting a wider or narrower path." },
  { title: "Session length realism", description: "We weighed active mowing time against the real interruption each power source adds, whether that is a mid-lawn recharge wait or a refuel and restart." },
  { title: "Cut and discharge quality", description: "We compared mulch, bag, and side-discharge options and height adjustment range rather than assuming power source alone decides cut quality." },
  { title: "Total ownership cost", description: "We considered included batteries and chargers, replacement battery cost, fuel and oil, filters, spark plugs, and routine engine service across a multi-year ownership window." },
];

export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }

export const howToChoose: HowToChooseSection[] = [
  {
    subheading: "Match the Scenario to a Power Source and Pick",
    table: {
      headers: ["Buyer scenario", "Recommended power source", "Named pick"],
      rows: [
        ["Standard lawn, want gas-equivalent width without engine upkeep", "Electric", "EGO Power+ LM2114 21-Inch Cordless Mower"],
        ["Larger lawn mowed in one continuous session", "Gas", "PowerSmart EasyGlide 21-Inch Gas Mower, 144cc"],
        ["Sloped or larger yard where self-propel matters", "Electric", "EGO Power+ LM2134SP-2 21-Inch Self-Propelled Mower"],
        ["Small lawn, budget-focused, comparing against an entry gas mower", "Electric", "Greenworks 40V 16-Inch Push Mower"],
        ["Small unobstructed lawn near an outlet, lowest cost", "Electric (corded)", "LawnMaster MEB1114K 15-Inch Corded Mower"],
      ],
    },
  },
  {
    subheading: "Electric vs Gas, Side by Side",
    cards: [
      { label: "Electric", text: "No fuel, oil, or spark plugs to manage, quieter operation, but active mowing time is capped by one charge unless a second battery is on hand, and larger decks add real weight and cost." },
      { label: "Gas", text: "Refueling is faster than a full battery recharge and there is no charge ceiling on a single session, but the engine needs oil changes, filter checks, spark plug replacement, and gasoline storage between uses." },
    ],
  },
  {
    subheading: "Real Ownership Checklist",
    table: {
      headers: ["Cost or task", "Verify before buying"],
      rows: [
        ["Power source", "Fuel and oil for gas, or battery watt-hours, extra packs, and charger for electric"],
        ["Session length", "Whether your lawn finishes within one tank or one charge, or needs a refuel or recharge mid-session"],
        ["Wear parts", "Blades and, for gas, filters, spark plugs, and belts, plus model-specific availability"],
        ["Logistics and support", "Storage space, delivered weight, and warranty or service access for the power source you choose"],
      ],
    },
  },
];

export const faq = [
  { q: "Is electric or gas better for lawn mowers?", a: "Neither is better in every case. Electric mowers avoid fuel and engine maintenance but are limited by battery charge, while gas mowers keep running as long as the tank has fuel but require ongoing oil, filter, and spark plug upkeep. The better choice depends on lawn size and session length." },
  { q: "How much lawn can a battery mower cut on one charge?", a: "It depends on the included battery's watt-hours, deck width, grass height and moisture, and whether self-propel is in use, since drive motors share stored energy with the blade. Check the manufacturer's runtime figure against your yard's actual mowing time, not just the advertised number." },
  { q: "Do gas mowers cut grass better than electric mowers?", a: "At a matched deck width, cut quality depends more on blade design, deck shape, and discharge options than on power source alone. Compare mulch, bag, and side-discharge features directly rather than assuming gas or electric wins by default." },
  { q: "Which costs less to own over time, electric or gas?", a: "Add fuel, oil, filters, and spark plugs for a gas mower against battery replacement and electricity cost for an electric mower over a three-year window." },
  { q: "When does a gas mower make more sense than an electric one?", a: "Gas makes more sense for larger lawns mowed in one continuous session where a charge ceiling would interrupt mowing, or where refueling speed matters more than avoiding engine maintenance." },
];

export const relatedGuides: { title: string; href: string }[] = [];
