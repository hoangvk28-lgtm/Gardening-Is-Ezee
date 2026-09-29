export const guideSlug = "best-robot-pool-vacuums";
export const guideTitle = "Best Robot Pool Vacuums";
export const metaTitle = "Best Robot Pool Vacuums (2026): 8 Models Compared";
export const metaDescription = "We compared eight current robot pool vacuums on pool type compatibility, wall and waterline coverage, runtime, and filter basket retrieval.";
export const mainKeyword = "robot pool vacuums";
export const lastUpdated = "2026-08-05";
export const readTime = "10 min";
export const heroImage = "https://m.media-amazon.com/images/I/414nj4WragL._SL500_.jpg";

export const introParagraphs = [
  "Robot pool vacuums are a different category from indoor floor robots. Instead of navigating carpet and hardwood, they have to climb pool walls, track the waterline for scum buildup, and survive being submerged in chlorinated water for hours at a time. Above-ground and in-ground pools also put very different demands on a unit, from flat-bottom coverage to full wall-climbing ability.",
  "We looked at eight current, distinct models rather than color variants of the same cleaner, and focused on the details that actually change day-to-day use: which pool types each one is rated for, how much of the wall and waterline it actually reaches, how long it runs on a charge, how heavy it is to lift out and empty, and how easy the filter basket is to access and clean.",
];

export interface GuideProduct {
  id: string;
  rank: number;
  badge: string;
  name: string;
  amazonUrl: string;
  imageUrl: string;
  specs: string[];
  specList?: { label: string; value: string }[];
  description: string;
  bestFor: string;
  pros: string[];
  cons: string[];
}

export const products: GuideProduct[] = [
  {
    id: "aiper-scuba-v3",
    rank: 1,
    badge: "Best Overall",
    name: "AIPER Scuba V3 AI Vision Cordless Robotic Pool Cleaner, Grey",
    amazonUrl: "https://www.amazon.com/dp/B0GG97427D?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/414nj4WragL._SL500_.jpg",
    specs: ["AI vision navigation", "Cordless design", "Floor, wall & waterline", "Top-load basket access"],
    specList: [{"label":"Feature 1","value":"AI vision navigation"},{"label":"Design","value":"Cordless design"},{"label":"Feature 3","value":"Floor, wall & waterline"},{"label":"Feature 4","value":"Top-load basket access"}],
    description:
      "The Scuba V3 uses AI-assisted vision to map the pool and adjust its cleaning path in real time, rather than relying on the random-bounce navigation older cordless cleaners use. That translates into more even coverage across the floor, walls, and waterline in a single cycle instead of needing separate passes.\n\nBeing fully cordless means no cable to untangle or accidentally snag on ladders and steps, which is the most common complaint with corded pool robots.",
    bestFor: "Buyers who want the most capable current cleaner and are not trying to hit a budget ceiling.",
    pros: [
      "AI vision navigation covers floor, wall, and waterline in one cycle",
      "Fully cordless, nothing to snag on steps or ladders",
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Cordless design means battery runtime is a real limit on very large pools",
    ],
  },
  {
    id: "cordless-2026-upgrade-180min",
    rank: 2,
    badge: "Best Budget Pick",
    name: "(2026 Upgrade) Cordless Robotic Pool Cleaner, Automatic Pool Vacuum for Above Ground & Inground Pools, 180-Min Runtime, 3L Basket for Leaves & Debris, Auto-Parking, Powerful Suction up to 2200 Sq.Ft",
    amazonUrl: "https://www.amazon.com/dp/B0GMTLS9VL?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41V3R4o1l5L._SL500_.jpg",
    specs: ["180-min runtime", "3L debris basket", "Above ground & inground", "Auto-parking, up to 2200 sq ft"],
    specList: [{"label":"Feature 1","value":"180-min runtime"},{"label":"Feature 2","value":"3L debris basket"},{"label":"Feature 3","value":"Above ground & inground"},{"label":"Feature 4","value":"Auto-parking, up to 2200 sq ft"}],
    description:
      "This model covers both above-ground and in-ground pools up to 2200 square feet, with a listed 180-minute runtime that is long enough for most residential pools to finish a full cycle without a mid-clean recharge. The 3L basket is sized for leaves and heavier debris rather than just fine sediment.\n\nAuto-parking brings the unit to the pool wall or steps when the cycle ends or the battery runs low, which makes retrieval easier than fishing a dead cleaner off the pool floor.",
    bestFor: "Budget-conscious buyers with a standard above-ground or in-ground pool who want long runtime without paying for smart navigation.",
    pros: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Works on both above-ground and in-ground pools",
      "Auto-parking simplifies retrieval",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    ],
  },
  {
    id: "dolphin-nautilus-cc",
    rank: 3,
    badge: "Best Wall-Climbing Pick",
    name: "Dolphin Nautilus CC Automatic Robotic Pool Vacuum Cleaner, Wall Climbing Scrubber Brush, Top Load Filter Access, Ideal for Above/In-Ground Pools up to 33 FT in Length",
    amazonUrl: "https://www.amazon.com/dp/B01N78IVWJ?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41SuxEyanYL._SL500_.jpg",
    specs: ["Wall-climbing scrubber brush", "Top-load filter access", "Above/in-ground up to 33 ft", "Corded design"],
    specList: [{"label":"Feature 1","value":"Wall-climbing scrubber brush"},{"label":"Filtration","value":"Top-load filter access"},{"label":"Size","value":"Above/in-ground up to 33 ft"},{"label":"Design","value":"Corded design"}],
    description:
      "Dolphin has built pool cleaners for years, and the Nautilus CC carries that history with a dedicated scrubber brush built specifically for climbing walls and breaking up algae rather than just vacuuming the floor. It is rated for pools up to 33 feet in length, which covers most residential above-ground and in-ground setups.\n\nThe top-load filter access means you do not have to flip the unit over or dig into a bottom-mounted compartment to empty it, which keeps the retrieval-and-empty routine quick. As a corded model, it trades the freedom of cordless designs for a more predictable, consistent cleaning path.",
    bestFor: "Buyers who specifically want strong wall and waterline scrubbing on a mid-size pool.",
    pros: [
      "Dedicated scrubber brush built for wall climbing",
      "Top-load filter access speeds up emptying",
      "Trusted, long-running Dolphin product line",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Corded design means managing a cable during each cycle",
    ],
  },
  {
    id: "aiper-scuba-s1",
    rank: 4,
    badge: "Best for Full Pool Coverage",
    name: "(2026 Upgrade) Aiper Scuba S1 Robotic Pool Cleaner, 270-Min Runtime, Floor,Wall,Waterline,Shallow Area Cleaning, Smarter Navigation, 11 High-Precision Sensors, App Support & Weekly Custom Cleaning, Blue",
    amazonUrl: "https://www.amazon.com/dp/B0H6ZZDR3W?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41BI7+o0n1L._SL500_.jpg",
    specs: ["270-min runtime", "Floor, wall, waterline & shallow areas", "11 sensors, app control", "Weekly custom scheduling"],
    specList: [{"label":"Feature 1","value":"270-min runtime"},{"label":"Feature 2","value":"Floor, wall, waterline & shallow areas"},{"label":"Connectivity","value":"11 sensors, app control"},{"label":"Feature 4","value":"Weekly custom scheduling"}],
    description:
      "The Scuba S1 targets full pool coverage, including shallow areas near steps and tanning ledges that flat-bottom-only cleaners tend to skip. Eleven onboard sensors feed into a smarter navigation system, and the 270-minute runtime is among the longest in this comparison, useful for larger or irregularly shaped pools.\n\nApp support adds weekly custom cleaning schedules, so the unit can run automatically without needing to be dropped in manually each time.",
    bestFor: "Pools with shallow ledges or irregular shapes where floor-only cleaners leave gaps.",
    pros: [
      "Covers shallow areas most cleaners in this list skip",
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "App scheduling for hands-off weekly cleaning",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    ],
  },
  {
    id: "dolphin-nautilus-cc-plus",
    rank: 5,
    badge: "Best for Large In-Ground Pools",
    name: "Dolphin Automatic Robotic Pool Vacuum Cleaner, Wall Climbing Scrubber Brush, Smart Navigation, Ideal for In-Ground Pools up to 40FT in Length, Nautilus CC Plus",
    amazonUrl: "https://www.amazon.com/dp/B00Q8M0NWE?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41KvliDajCL._SL500_.jpg",
    specs: ["Wall-climbing scrubber brush", "Smart navigation", "In-ground pools up to 40 ft", "Corded design"],
    specList: [{"label":"Feature 1","value":"Wall-climbing scrubber brush"},{"label":"Navigation","value":"Smart navigation"},{"label":"Size","value":"In-ground pools up to 40 ft"},{"label":"Design","value":"Corded design"}],
    description:
      "The Nautilus CC Plus is the step up from the standard Nautilus CC, rated for in-ground pools up to 40 feet in length rather than 33. Smart navigation is built to reduce overlap and missed spots on the larger surface area a pool that size covers.\n\nIt carries the same wall-climbing scrubber brush design as the standard CC, so waterline scum and algae get the same dedicated attention as the pool floor. This is a corded model aimed squarely at larger in-ground pools where a smaller cleaner would need multiple cycles to finish.",
    bestFor: "Larger in-ground pools that need a cleaner rated for real length, not just square footage.",
    pros: [
      "Rated for in-ground pools up to 40 feet, longer than most in this list",
      "Smart navigation reduces missed spots on large surfaces",
      "Same proven scrubber brush design as the standard Nautilus CC",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    ],
  },
  {
    id: "eziioov-u8",
    rank: 6,
    badge: "Best for Waterline Cleaning",
    name: "EZIOOV U8 Cordless Robotic Pool Cleaner for Walls & Waterline, Automatically Climbs & Cleans, No Hand-Scrubbing, Auto-Docking, 150min Runtime Pool Vacuum Robot for Inground Pools up to 2600 Sq.ft",
    amazonUrl: "https://www.amazon.com/dp/B0H6P9751Z?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41ybXWRcrJL._SL500_.jpg",
    specs: ["Wall & waterline focused", "Auto-climb, no hand-scrubbing", "150-min runtime", "Auto-docking, up to 2600 sq ft"],
    specList: [{"label":"Feature 1","value":"Wall & waterline focused"},{"label":"Feature 2","value":"Auto-climb, no hand-scrubbing"},{"label":"Feature 3","value":"150-min runtime"},{"label":"Feature 4","value":"Auto-docking, up to 2600 sq ft"}],
    description:
      "The U8 is built specifically around wall and waterline cleaning rather than treating it as a secondary feature, which matters since waterline scum is often the most visible sign of a neglected pool. It climbs automatically and is marketed as eliminating the need for hand-scrubbing the tile line entirely.\n\nAuto-docking brings the unit back to a fixed point when the cycle finishes, and it is rated for in-ground pools up to 2600 square feet on a 150-minute runtime. This is a solid mid-tier pick for anyone whose main frustration is a dirty waterline rather than floor debris.",
    bestFor: "In-ground pool owners whose main complaint is waterline grime rather than floor debris.",
    pros: [
      "Purpose-built for wall and waterline cleaning",
      "Auto-docking for easy retrieval",
      "Covers pools up to 2600 sq ft on a single charge",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Less emphasis on general floor debris than dedicated floor cleaners",
    ],
  },
  {
    id: "y20-dual-motor",
    rank: 7,
    badge: "Best for Above-Ground Pools",
    name: "Y20 Robotic Pool Cleaner, Cordless Pool Vacuum for Above Ground & Inground Flat Pools with Dual Motors, 120 Min Runtime, Auto-Parking, Powerful Pool Vacuum Robot for Up to 1100 Sq.Ft",
    amazonUrl: "https://www.amazon.com/dp/B0GX9LRGNT?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41iLv0bouDL._SL500_.jpg",
    specs: ["Dual motors", "120-min runtime", "Above ground & flat inground", "Auto-parking, up to 1100 sq ft"],
    specList: [{"label":"Feature 1","value":"Dual motors"},{"label":"Feature 2","value":"120-min runtime"},{"label":"Feature 3","value":"Above ground & flat inground"},{"label":"Feature 4","value":"Auto-parking, up to 1100 sq ft"}],
    description:
      "The Y20 is sized for smaller above-ground and flat-bottom in-ground pools up to 1100 square feet, which covers most standard above-ground setups without paying for coverage you will never use. Dual motors give it more consistent suction on a flat pool floor than single-motor budget units.\n\nThis is a straightforward pick for a smaller above-ground pool rather than a large or irregularly shaped in-ground one.",
    bestFor: "Smaller above-ground or flat-bottom pools where a compact, low-cost cleaner is all that is needed.",
    pros: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Sized correctly for smaller above-ground pools",
      "Auto-parking simplifies retrieval",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "120-minute runtime is on the shorter side of this comparison",
    ],
  },
  {
    id: "coasteering-planet-edge",
    rank: 8,
    badge: "Best Lightweight Pick",
    name: "Coasteering Planet Edge Pool Vacuum for Above Ground Pool, 120-Min Runtime, Powerful Dual-Motor, Adjustable Cleaning Path, Cordless Robotic Pool Cleaner for Flat Pools Up to 850 Sq.ft, Light Grey",
    amazonUrl: "https://www.amazon.com/dp/B0H14B7FS9?tag=gardeningisezee-20",
    imageUrl: "https://m.media-amazon.com/images/I/41Ti8-cpr0L._SL500_.jpg",
    specs: ["Dual motor", "120-min runtime", "Adjustable cleaning path", "Flat pools up to 850 sq ft, cordless"],
    specList: [{"label":"Feature 1","value":"Dual motor"},{"label":"Feature 2","value":"120-min runtime"},{"label":"Adjustability","value":"Adjustable cleaning path"},{"label":"Feature 4","value":"Flat pools up to 850 sq ft, cordless"}],
    description:
      "The Planet Edge is built for smaller flat-bottom above-ground pools, with an adjustable cleaning path so the unit does not just wander randomly across the floor. Its compact size and light build also make it one of the easier units in this comparison to lift out and carry to storage after each cycle.",
    bestFor: "Small seasonal above-ground pools where a lightweight, low-cost floor cleaner is the priority.",
    pros: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Lightweight and easy to lift out for storage",
      "Adjustable cleaning path instead of purely random movement",
    ],
    cons: [
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
      "Not built for wall climbing or in-ground pools",
    ],
  },
];

export const buyingCriteria = [
  { criterion: "Pool type compatibility", explanation: "Above-ground, flat-bottom pools and larger in-ground pools with sloped floors and steps put different demands on a cleaner. Confirm the specific model is rated for your pool type before buying, since a unit built for flat above-ground pools may struggle with sloped in-ground floors.\n\nGetting this wrong is one of the more common reasons a robot pool vacuums purchase disappoints once it actually arrives, since pool type compatibility affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Wall and waterline coverage", explanation: "Some models focus mainly on the pool floor, while others add dedicated wall-climbing and waterline scrubbing. If scum buildup at the tile line is your main frustration, prioritize a model that specifically advertises wall and waterline cleaning rather than floor coverage alone.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a robot pool vacuums weeks after buying, since wall and waterline coverage plays out differently in daily use than it does on paper." },
  { criterion: "Runtime vs pool size", explanation: "Listed runtimes in this comparison range from 120 to 270 minutes. Match runtime to your actual pool size and shape, since a large or irregularly shaped pool can need the longer end of that range to complete a full cycle in one pass.\n\nCompare how each robot pool vacuums in this roundup actually handles runtime vs pool size rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Retrieval weight and ease", explanation: "A pool cleaner has to be lifted out of the water after every cycle, and a heavier corded unit is meaningfully harder to retrieve than a lightweight cordless one. Auto-parking or auto-docking features that bring the unit to the pool edge make this routine easier regardless of weight.\n\nRetrieval weight and ease is easy to overlook next to flashier specs, but it's frequently the difference between a robot pool vacuums that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Filter basket access", explanation: "Top-load filter baskets are generally quicker to empty than bottom-mounted compartments that require flipping the unit over. If you plan to run the cleaner frequently, easy basket access saves real time over a pool season.\n\nGetting this wrong is one of the more common reasons a robot pool vacuums purchase disappoints once it actually arrives, since filter basket access affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Cordless vs corded design", explanation: "Cordless models avoid tangled or snagged cables but are limited by battery runtime, while corded models generally run longer per session but require managing a cable around ladders and steps. Neither is universally better; it depends on how much you value convenience versus runtime.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a robot pool vacuums weeks after buying, since cordless vs corded design plays out differently in daily use than it does on paper." },
];

export const howWeEvaluated = [
  {
    title: "Pool type and size fit",
    description:
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
  },
  {
    title: "Coverage area vs advertised features",
    description:
      "We looked at whether each model covers just the floor or also the walls, waterline, and shallow areas, since coverage claims vary significantly between budget and flagship units.",
  },
  {
    title: "Runtime and retrieval convenience",
    description:
      "We weighed listed runtime against auto-parking or auto-docking features, since a longer runtime matters less if the unit is difficult to retrieve once the cycle ends.",
  },
  {
    title: "Filter access and maintenance",
    description:
      "We checked how each model's filter basket is accessed and emptied, since this is a routine task that happens after every single cleaning cycle.",
  },
  {
    title: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    description:
      "Compared using published specifications, included components, compatibility, and practical trade-offs.",
  },
];

export const howToChoose = [
  {
    subheading: "By Pool Type",
    intro: "Start with whether your pool is above-ground, in-ground, or flat-bottom, since that narrows the field quickly.",
    table: {
      headers: ["Pool Type", "Recommended Pick"],
      rows: [
        ["Small above-ground, flat bottom", "Coasteering Planet Edge or Y20"],
        ["Standard above-ground or in-ground, mixed use", "2026 Upgrade Cordless Robotic Pool Cleaner (180-Min)"],
        ["Larger in-ground pool up to 40 ft", "Dolphin Nautilus CC Plus"],
        ["Any pool with heavy waterline scum", "EZIOOV U8"],
      ],
    },
  },
  {
    subheading: "By Budget",
    intro: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    table: {
      headers: ["Budget", "Recommended Pick"],
      rows: [
        ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Coasteering Planet Edge or Y20"],
        ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "2026 Upgrade Cordless Robotic Pool Cleaner or EZIOOV U8"],
        ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Aiper Scuba S1 or Dolphin Nautilus CC"],
        ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "AIPER Scuba V3 or Dolphin Nautilus CC Plus"],
      ],
    },
  },
  {
    subheading: "Cordless vs Corded",
    cards: [
      {
        label: "Cordless",
        text: "Easier retrieval with no cable to manage, but runtime is a hard limit. The Scuba V3, Scuba S1, EZIOOV U8, Y20, Planet Edge, and 180-Min budget cleaner in this comparison are all cordless.",
      },
      {
        label: "Corded",
        text: "Generally longer effective run sessions but requires handling a cable around ladders and steps. Both Dolphin Nautilus models here are corded.",
      },
    ],
    note: "If your pool has a lot of stairs, ladders, or other obstacles, a cordless model avoids the most common source of frustration with corded cleaners.",
  },
  {
    subheading: "Floor-Only vs Full Coverage",
    cards: [
      {
        label: "Floor-focused",
        text: "The budget Y20 and Planet Edge here are built primarily for flat-floor coverage on above-ground pools.",
      },
      {
        label: "Wall, waterline & shallow-area coverage",
        text: "The Scuba V3, Scuba S1, EZIOOV U8, and both Dolphin Nautilus models add dedicated wall or waterline cleaning.",
      },
    ],
    note: "If waterline scum is your main complaint, prioritize a model that specifically advertises wall and waterline cleaning rather than assuming any pool robot handles it well.",
  },
  {
    subheading: "When to Spend More",
    cards: [
      {
        label: "Spend more if",
        text: "You have a large or irregularly shaped in-ground pool, want app-based scheduling, or want AI-assisted navigation that adapts its path in real time.",
      },
      {
        label: "Save if",
        text: "You have a small or seasonal above-ground pool and mainly need reliable floor coverage.",
      },
    ],
  },
];

export const faq = [
  {
    q: "Do robot pool vacuums work in both above-ground and in-ground pools?",
    a: "Some models are rated for both, while others are built specifically for flat-bottom above-ground pools or for larger in-ground pools with steps and sloped floors.",
  },
  {
    q: "How long does a robot pool vacuum need to run to clean the whole pool?",
    a: "Listed runtimes in this comparison range from 120 to 270 minutes, and the right runtime depends on your pool's size and shape. Larger or irregularly shaped pools generally need a model at the longer end of that range to complete a full pass in one cycle.",
  },
  {
    q: "Do I need a model with wall-climbing or waterline cleaning?",
    a: "If your main frustration is scum buildup at the tile line rather than debris on the floor, yes, a model built specifically for wall and waterline cleaning, like the EZIOOV U8 or the Dolphin Nautilus models, will address that better than a floor-only cleaner.",
  },
  {
    q: "Is cordless or corded better for a pool vacuum?",
    a: "Cordless models are generally easier to retrieve and have no cable to snag on ladders or steps, but they are limited by battery runtime. Corded models can run longer per session but require managing a cable during the cycle. Neither is universally better; it depends on your pool's layout and how much that tradeoff matters to you.",
  },
  {
    q: "How much does the filter basket matter?",
    a: "It matters more than it sounds, since it has to be emptied after every single cleaning cycle. Top-load filter baskets, like those on the Dolphin Nautilus models, are generally quicker to access than bottom-mounted compartments that require flipping the unit over.",
  },
  {
    q: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    a: "For models where that specific data was not available at the time of writing, we describe them qualitatively instead of estimating or inventing a number.",
  },
];

export const relatedGuides: { title: string; href: string }[] = [];
