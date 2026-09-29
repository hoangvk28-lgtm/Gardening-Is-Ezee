export const guideSlug = "best-honda-lawn-mowers";
export const guideTitle = "Best Honda Lawn Mowers";
export const metaTitle = "Best Honda Lawn Mowers (2026): Current Models and Buying Guide";
export const metaDescription = "Best Honda Lawn Mowers compared by mower class, handling, property fit, ownership cost, maintenance, and service support.";
export const mainKeyword = "lawn mowers honda";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "11 min";
export const heroImage = "https://m.media-amazon.com/images/I/41TWe75N1ML._SL500_.jpg";
export const introParagraphs = [
  "A current Honda mower guide should not rank discontinued U.S. gas models as if they were the active lineup. The current Honda lineup is a four-model battery family: HRN-BV, HRX-BV, HRX-BE, and the commercial HRC-BE, each with a different battery-bay and drive workflow.",
  "We compare mower format, yard fit, handling, power workflow, maintenance, storage, and long-term ownership needs so you can narrow the shortlist without paying for capacity you will not use.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "honda-hrn-bv", rank: 1, badge: "Best Overall", name: "Honda HRN-BV 21-Inch Battery Mower",
    amazonUrl: "https://www.amazon.com/dp/B0G8XZ8R49?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41TWe75N1ML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch steel deck","8Ah battery configuration","Variable-speed self-propel","Current battery generation"],
    specList: [{"label":"Size","value":"21-inch steel deck"},{"label":"Battery","value":"8Ah battery configuration"},{"label":"Speed","value":"Variable-speed self-propel"},{"label":"Feature 4","value":"Current battery generation"}],
    description: "Honda HRN-BV 21-Inch Battery Mower combines 21-inch steel deck, 8Ah battery configuration, Variable-speed self-propel. That combination makes it a practical option for residential buyers wanting Honda's least expensive current battery mower.\n\nCheck the package contents carefully because battery and charger bundles can vary by seller. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "residential buyers wanting Honda's least expensive current battery mower",
    pros: ["21-inch steel deck","8Ah battery configuration","Variable-speed self-propel"],
    cons: ["Check the package contents carefully because battery and charger bundles can vary by seller.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "honda-hrx-bv", rank: 2, badge: "Best Alternative", name: "Honda HRX-BV 21-Inch Battery Mower",
    amazonUrl: "https://www.amazon.com/dp/B0G3CZMVT9?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41KGr4vq+3L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch NeXite deck","Single battery bay","Select Drive","4-in-1 Versamow"],
    specList: [{"label":"Size","value":"21-inch NeXite deck"},{"label":"Battery","value":"Single battery bay"},{"label":"Drive Type","value":"Select Drive"},{"label":"Feature 4","value":"4-in-1 Versamow"}],
    description: "Honda HRX-BV 21-Inch Battery Mower combines 21-inch NeXite deck, Single battery bay, Select Drive. That combination makes it a practical option for homeowners prioritizing deck warranty and mowing-mode flexibility.\n\nThe single-bay configuration limits continuous runtime unless batteries are swapped manually. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "homeowners prioritizing deck warranty and mowing-mode flexibility",
    pros: ["21-inch NeXite deck","Single battery bay","Select Drive"],
    cons: ["The single-bay configuration limits continuous runtime unless batteries are swapped manually.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "honda-hrx-be", rank: 3, badge: "Best for a Different Use", name: "Honda HRX-BE 21-Inch Battery Mower",
    amazonUrl: "https://www.amazon.com/dp/B0G8Y6WZ9B?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41e3xsau+aL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck","Dual battery bays","eSelect Drive","Roto-Stop blade control"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Battery","value":"Dual battery bays"},{"label":"Drive Type","value":"eSelect Drive"},{"label":"Blades","value":"Roto-Stop blade control"}],
    description: "Honda HRX-BE 21-Inch Battery Mower combines 21-inch deck, Dual battery bays, eSelect Drive. That combination makes it a practical option for larger residential lawns needing dual-bay flexibility.\n\nA second bay improves workflow only if the buyer budgets for enough battery capacity. Compare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "larger residential lawns needing dual-bay flexibility",
    pros: ["21-inch deck","Dual battery bays","eSelect Drive"],
    cons: ["A second bay improves workflow only if the buyer budgets for enough battery capacity.","Check storage space, maintenance needs, and local service access before buying."],
  },
  {
    id: "honda-hrc-be", rank: 4, badge: "Also Consider", name: "Honda HRC-BE Commercial Battery Mower",
    amazonUrl: "https://www.amazon.com/dp/B0G3D2QYY1?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41YLXB7DlzL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch commercial deck","Dual battery bays","Electronic cruise control","Commercial positioning"],
    specList: [{"label":"Size","value":"21-inch commercial deck"},{"label":"Battery","value":"Dual battery bays"},{"label":"Feature 3","value":"Electronic cruise control"},{"label":"Feature 4","value":"Commercial positioning"}],
    description: "Honda HRC-BE Commercial Battery Mower combines 21-inch commercial deck, Dual battery bays, Electronic cruise control. That combination makes it a practical option for professional or high-frequency mowing.\n\nCompare its operating width, power setup, storage needs, and local service options with your property before buying.",
    bestFor: "professional or high-frequency mowing",
    pros: ["21-inch commercial deck","Dual battery bays","Electronic cruise control"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.","Check storage space, maintenance needs, and local service access before buying."],
  }
];
export const buyingCriteria = [
  { criterion: "Current vs legacy", explanation: "Treat older HRN and HRX gas machines as used or remaining stock, not direct equivalents to the current battery lineup. Verify recall and service status by model and serial number.\n\nGetting this wrong is one of the more common reasons a lawn mowers honda purchase disappoints once it actually arrives, since current vs legacy affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Residential vs commercial", explanation: "HRN and HRX target homeowners while HRC is designed for frequent commercial work.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a lawn mowers honda weeks after buying, since residential vs commercial plays out differently in daily use than it does on paper." },
  { criterion: "Battery bay and energy", explanation: "HRN-BV and HRX-BV use one bay; HRX-BE and HRC-BE support two. Battery count and amp-hours matter more than the family name.\n\nCompare how each lawn mowers honda in this roundup actually handles battery bay and energy rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Published runtime", explanation: "Honda states roughly 30 minutes with 8Ah and 45 minutes with 12Ah under qualifying conditions. Grass height, pace, drive use, and terrain can reduce that result.\n\nPublished runtime is easy to overlook next to flashier specs, but it's frequently the difference between a lawn mowers honda that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Charging and dealer support", explanation: "Honda lists long standard-charge times and optional faster charging. Include charger choice, spare battery cost, parts, and dealer access in the purchase decision.\n\nGetting this wrong is one of the more common reasons a lawn mowers honda purchase disappoints once it actually arrives, since charging and dealer support affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." }
];
export const howWeEvaluated = [
  { title: "Yard and mower fit", description: "We matched mower class, deck width, access, terrain, storage, and operator effort before comparing headline power or speed." },
  { title: "Handling and daily use", description: "Turning room, propulsion, control layout, bag handling, boundary work, and cleaning all affect how manageable a mower feels week after week." },
  { title: "Power workflow", description: "We considered fuel, cords, included battery capacity, charging, drive load, and the interruptions each power source can add to a mowing session." },
  { title: "Maintenance and ownership cost", description: "We included blades, belts, filters, tires, batteries, winter storage, delivery, service access, and likely replacement cycles." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match the Property Before the Brand", table: { headers: ["Buyer situation", "Recommended direction"], rows: [["Small or access-constrained lawn","Honda HRN-BV 21-Inch Battery Mower"],["Medium maintained lawn","Honda HRX-BV 21-Inch Battery Mower"],["Large or specialized property","Honda HRX-BE 21-Inch Battery Mower"],["Steep or safety-sensitive terrain","Follow the exact manufacturer slope guidance before selecting any mower"]] } },
  { subheading: "Choose the Right Mower Format", cards: [ { label: "Walk-behind", text: "Best for smaller or detailed lawns where compact storage, easy trimming, and control around obstacles matter." }, { label: "Riding or zero-turn", text: "Best for larger properties when deck width, seating comfort, safe terrain handling, and transport space are already accounted for." }, { label: "Robot", text: "Best for frequent automated maintenance when the yard supports reliable navigation and the owner accepts setup, edge trimming, and seasonal care." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Cost or task", "Verify before buying"], rows: [["Power", "Fuel, battery watt-hours, extra packs, charger, and circuit needs"], ["Wear parts", "Blades, belts, filters, tires, and model-specific availability"], ["Logistics", "Delivered width, gate, shed, trailer, and service transport"], ["Support", "Residential/commercial warranty and nearest authorized service"]] } },
  { subheading: "Comfort and Workload Checklist", cards: [ { label: "During mowing", text: "Consider starting steps, control reach, push or drive effort, turning room, noise, and how often the mower needs attention." }, { label: "After mowing", text: "Check bag removal, deck cleaning, charging or refueling, folding, storage footprint, and access to routine service parts." } ] },
];
export const faq = [
  { q: "What should I check before buying lawn mowers honda?", a: "Measure mowable area, narrowest access point, storage, terrain, and slope first. Then compare mower class, complete operating weight, power workflow, service access, and delivered ownership cost." },
  { q: "Can I trust voltage, horsepower, or deck width alone?", a: "No. Voltage is not battery capacity, horsepower does not establish cut quality or transmission durability, and deck width does not include every part that must pass through a gate or fit on a trailer." },
  { q: "Which mower type is easiest to live with?", a: "For a small flat lawn, a light battery or corded walk-behind is usually simplest. Self-propel helps on slopes, riding mowers reduce walking on large properties, and robots reduce routine mowing time but add setup and edge work." },
  { q: "When should I move from a push mower to self-propelled, riding, or robotic?", a: "Choose self-propel when slopes or mower weight make pushing tiring. Consider riding for large open lawns and long sessions. Consider a robot when the yard supports dependable navigation and frequent automated cuts matter more than a perfectly finished edge." },
  { q: "How should I compare long-term cost?", a: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
];
export const relatedGuides: { title: string; href: string }[] = [{"title":"Best Riding Lawn Mowers","href":"/guide/best-riding-lawn-mowers"},{"title":"Best Push Lawn Mowers","href":"/guide/best-push-lawn-mowers"},{"title":"Best Robot Lawn Mowers","href":"/guide/best-robot-lawn-mowers"}];
