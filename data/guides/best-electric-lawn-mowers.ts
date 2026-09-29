export const guideSlug = "best-electric-lawn-mowers";
export const guideTitle = "Best Electric Lawn Mowers";
export const metaTitle = "Best Electric Lawn Mowers (2026): Current Models and Buying Guide";
export const metaDescription = "Best Electric Lawn Mowers compared by mower class, handling, property fit, ownership cost, maintenance, and service support.";
export const mainKeyword = "lawn mowers electric";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "11 min";
export const heroImage = "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg";
export const introParagraphs = [
  "Electric mower lists often rank by voltage, even though voltage is not battery capacity and says little about runtime by itself. We separated corded and cordless workflows and compared included watt-hours, drive load, charging, replacement cost, and deck size.",
  "We compare mower format, yard fit, handling, power workflow, maintenance, storage, and long-term ownership needs so you can narrow the shortlist without paying for capacity you will not use.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "ego-lm2114", rank: 1, badge: "Best Overall", name: "EGO Power+ LM2114 21-Inch Cordless Mower",
    amazonUrl: "https://www.amazon.com/dp/B0BLT8L937?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck","56V battery platform","Battery and charger included","Push drive"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"56V battery platform"},{"label":"Battery","value":"Battery and charger included"},{"label":"Feature 4","value":"Push drive"}],
    description: "EGO Power+ LM2114 21-Inch Cordless Mower combines 21-inch deck, 56V battery platform, Battery and charger included. That combination makes it a practical option for standard-size lawns needing a full-width battery mower.\n\nIncluded watt-hours and runtime under tall or damp grass should be verified against the current kit. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "standard-size lawns needing a full-width battery mower",
    pros: ["21-inch deck","56V battery platform","Battery and charger included"],
    cons: ["Included watt-hours and runtime under tall or damp grass should be verified against the current kit.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "greenworks-80v-21", rank: 2, badge: "Best Alternative", name: "Greenworks 80V 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0CLSC6B2T?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41XlO0UuWrL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck","80V 4Ah battery","320Wh nominal energy","Self-propelled"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"80V 4Ah battery"},{"label":"Feature 3","value":"320Wh nominal energy"},{"label":"Lighting","value":"Self-propelled"}],
    description: "Greenworks 80V 21-Inch Self-Propelled Mower combines 21-inch deck, 80V 4Ah battery, 320Wh nominal energy. That combination makes it a practical option for buyers wanting self-propel and a higher-energy included pack.\n\nVoltage alone does not predict runtime, and drive use consumes energy that could otherwise power the blade. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "buyers wanting self-propel and a higher-energy included pack",
    pros: ["21-inch deck","80V 4Ah battery","320Wh nominal energy"],
    cons: ["Voltage alone does not predict runtime, and drive use consumes energy that could otherwise power the blade.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "greenworks-40v-16", rank: 3, badge: "Best for a Different Use", name: "Greenworks 40V 16-Inch Push Mower",
    amazonUrl: "https://www.amazon.com/dp/B00BBQVL5U?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41hGtP+Q5jL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["16-inch deck","40V 4Ah battery","160Wh included energy","Push drive"],
    specList: [{"label":"Size","value":"16-inch deck"},{"label":"Power Source","value":"40V 4Ah battery"},{"label":"Feature 3","value":"160Wh included energy"},{"label":"Drive Type","value":"Push drive"}],
    description: "Greenworks 40V 16-Inch Push Mower combines 16-inch deck, 40V 4Ah battery, 160Wh included energy. That combination makes it a practical option for small lawns and buyers already using Greenworks 40V tools.\n\nThe narrow deck and single included pack limit productivity on larger or overgrown lawns. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "small lawns and buyers already using Greenworks 40V tools",
    pros: ["16-inch deck","40V 4Ah battery","160Wh included energy"],
    cons: ["The narrow deck and single included pack limit productivity on larger or overgrown lawns.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "lawnmaster-meb1114k", rank: 4, badge: "Also Consider", name: "LawnMaster MEB1114K Corded Mower",
    amazonUrl: "https://www.amazon.com/dp/B092CMM5XM?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41tLNlfosEL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["15-inch deck","11A corded motor","No battery replacement","Cord-limited workflow"],
    specList: [{"label":"Size","value":"15-inch deck"},{"label":"Feature 2","value":"11A corded motor"},{"label":"Battery","value":"No battery replacement"},{"label":"Feature 4","value":"Cord-limited workflow"}],
    description: "LawnMaster MEB1114K Corded Mower combines 15-inch deck, 11A corded motor, No battery replacement. That combination makes it a practical option for small unobstructed yards near an outlet.\n\nManaging an extension cord around trees, beds, and the mowing path is the core tradeoff. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "small unobstructed yards near an outlet",
    pros: ["15-inch deck","11A corded motor","No battery replacement"],
    cons: ["Managing an extension cord around trees, beds, and the mowing path is the core tradeoff.","Check storage space, maintenance needs, and local service access before buying."],
  }
];
export const buyingCriteria = [
  { criterion: "Watt-hours, not voltage", explanation: "Multiply nominal volts by amp-hours to compare approximate battery energy. Then confirm how many packs are included and whether the mower can use them simultaneously.\n\nGetting this wrong is one of the more common reasons a lawn mowers electric purchase disappoints once it actually arrives, since watt-hours, not voltage affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Grass load changes runtime", explanation: "Manufacturer runtime is not a guarantee in tall, damp, dense, or mulched grass. Plan capacity around the difficult parts of the lawn, not the easiest pass.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a lawn mowers electric weeks after buying, since grass load changes runtime plays out differently in daily use than it does on paper." },
  { criterion: "Self-propel energy", explanation: "Drive motors reduce pushing effort but share stored energy with the blade. Slopes and high drive speed can shorten mowing time.\n\nCompare how each lawn mowers electric in this roundup actually handles self-propel energy rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Charging workflow", explanation: "Compare full charge time, battery cooling delay, number of charger ports, and whether household wiring can support simultaneous fast charging.\n\nCharging workflow is easy to overlook next to flashier specs, but it's frequently the difference between a lawn mowers electric that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Corded constraints", explanation: "A corded mower avoids battery replacement but needs the correct outdoor extension cord and a mowing pattern that keeps the cable behind the machine.\n\nGetting this wrong is one of the more common reasons a lawn mowers electric purchase disappoints once it actually arrives, since corded constraints affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." }
];
export const howWeEvaluated = [
  { title: "Yard and mower fit", description: "We matched mower class, deck width, access, terrain, storage, and operator effort before comparing headline power or speed." },
  { title: "Handling and daily use", description: "Turning room, propulsion, control layout, bag handling, boundary work, and cleaning all affect how manageable a mower feels week after week." },
  { title: "Power workflow", description: "We considered fuel, cords, included battery capacity, charging, drive load, and the interruptions each power source can add to a mowing session." },
  { title: "Maintenance and ownership cost", description: "We included blades, belts, filters, tires, batteries, winter storage, delivery, service access, and likely replacement cycles." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match the Property Before the Brand", table: { headers: ["Buyer situation", "Recommended direction"], rows: [["Small or access-constrained lawn","EGO Power+ LM2114 21-Inch Cordless Mower"],["Medium maintained lawn","Greenworks 80V 21-Inch Self-Propelled Mower"],["Large or specialized property","Greenworks 40V 16-Inch Push Mower"],["Steep or safety-sensitive terrain","Follow the exact manufacturer slope guidance before selecting any mower"]] } },
  { subheading: "Choose the Right Mower Format", cards: [ { label: "Walk-behind", text: "Best for smaller or detailed lawns where compact storage, easy trimming, and control around obstacles matter." }, { label: "Riding or zero-turn", text: "Best for larger properties when deck width, seating comfort, safe terrain handling, and transport space are already accounted for." }, { label: "Robot", text: "Best for frequent automated maintenance when the yard supports reliable navigation and the owner accepts setup, edge trimming, and seasonal care." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Cost or task", "Verify before buying"], rows: [["Power", "Fuel, battery watt-hours, extra packs, charger, and circuit needs"], ["Wear parts", "Blades, belts, filters, tires, and model-specific availability"], ["Logistics", "Delivered width, gate, shed, trailer, and service transport"], ["Support", "Residential/commercial warranty and nearest authorized service"]] } },
  { subheading: "Comfort and Workload Checklist", cards: [ { label: "During mowing", text: "Consider starting steps, control reach, push or drive effort, turning room, noise, and how often the mower needs attention." }, { label: "After mowing", text: "Check bag removal, deck cleaning, charging or refueling, folding, storage footprint, and access to routine service parts." } ] },
];
export const faq = [
  { q: "What should I check before buying lawn mowers electric?", a: "Measure mowable area, narrowest access point, storage, terrain, and slope first. Then compare mower class, complete operating weight, power workflow, service access, and delivered ownership cost." },
  { q: "Can I trust voltage, horsepower, or deck width alone?", a: "No. Voltage is not battery capacity, horsepower does not establish cut quality or transmission durability, and deck width does not include every part that must pass through a gate or fit on a trailer." },
  { q: "Which mower type is easiest to live with?", a: "For a small flat lawn, a light battery or corded walk-behind is usually simplest. Self-propel helps on slopes, riding mowers reduce walking on large properties, and robots reduce routine mowing time but add setup and edge work." },
  { q: "When should I move from a push mower to self-propelled, riding, or robotic?", a: "Choose self-propel when slopes or mower weight make pushing tiring. Consider riding for large open lawns and long sessions. Consider a robot when the yard supports dependable navigation and frequent automated cuts matter more than a perfectly finished edge." },
  { q: "How should I compare long-term cost?", a: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
];
export const relatedGuides: { title: string; href: string }[] = [{"title":"Best Toro Lawn Mowers","href":"/guide/best-toro-lawn-mowers"},{"title":"Best Zero-Turn Lawn Mowers","href":"/guide/best-zero-turn-lawn-mowers"},{"title":"Best Craftsman Lawn Mowers","href":"/guide/best-craftsman-lawn-mowers"}];
