export const guideSlug = "best-60v-lawn-mowers";
export const guideTitle = "Best 60V Lawn Mowers";
export const metaTitle = "Best 60V Lawn Mowers (2026): Push, Self-Propelled, and Riding Models Compared";
export const metaDescription = "Best 60V lawn mowers compared by included battery capacity, deck size, drive type, and property fit, since voltage alone does not tell you runtime or cut.";
export const mainKeyword = "60v lawn mowers";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "10 min";
export const heroImage = "https://m.media-amazon.com/images/I/41R0pwuOOQL._SL500_.jpg";
export const introParagraphs = [
  "60V has become a popular label on cordless mower boxes, but the number by itself does not describe how long a mower will run or how it will feel on a real lawn. Voltage alone does not equal battery energy: two 60V mowers can ship with very different amp-hour packs, and a mower with more included watt-hours will typically outrun one with a bigger voltage number and a smaller pack.",
  "We compared four current 60V mowers across push, self-propelled, and riding formats, looking at included battery capacity, deck width, drive type, and what each model is realistically suited for, so you can match a mower to your property instead of shopping on the voltage label alone.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "greenworks-60v-21-push", rank: 1, badge: "Best Overall", name: "Greenworks 60V 21-Inch Push Lawn Mower",
    amazonUrl: "https://www.amazon.com/dp/B0C2ZPBHC7?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41R0pwuOOQL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "60V platform", "5.0Ah battery and charger included", "Push drive"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Power Source","value":"60V platform"},{"label":"Battery","value":"5.0Ah battery and charger included"},{"label":"Feature 4","value":"Push drive"}],
    description: "A push mower without self-propel assist works best on flat to gently sloped lawns where the operator supplies all the forward motion. The included 5.0Ah pack gives a reasonable starting point, but actual runtime will still depend on grass height, moisture, and mowing speed, so it is worth confirming those details against the current listing before buying.",
    bestFor: "standard-size flat to gently sloped lawns where a well-reviewed push mower is enough",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "21-inch deck covers standard lawns efficiently", "Battery and charger included in the box"],
    cons: ["No self-propel assist, so slopes and larger areas mean more physical effort", "Runtime in tall or damp grass should be checked against the current battery kit"],
  },
  {
    id: "greenworks-60v-21-self-propelled", rank: 2, badge: "Best Self-Propelled", name: "Greenworks 60V 21-Inch Brushless Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0H389SFNF?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/410Kmx0JdYL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "Two 4.0Ah batteries included", "Self-propelled, brushless motor", "4-in-1 cutting, IPX4 rated"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Battery","value":"Two 4.0Ah batteries included"},{"label":"Lighting","value":"Self-propelled, brushless motor"},{"label":"Durability","value":"4-in-1 cutting, IPX4 rated"}],
    description: "The Greenworks 60V 21-Inch Brushless Self-Propelled Mower ships with two 4.0Ah batteries and a rapid charger, which is meant to cover roughly three-quarter-acre lawns without a mid-mow recharge. The brushless motor and self-propel drive are aimed at buyers who want less physical effort on larger or uneven yards, and it also includes an extra mower blade and LED lights for low-light mowing.",
    bestFor: "larger lawns up to about three-quarter acre where self-propel and dual batteries reduce recharge interruptions",
    pros: ["Two 4.0Ah batteries plus a rapid charger for extended coverage", "Self-propelled brushless drive reduces pushing effort", "Includes a spare blade and IPX4 water resistance"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "greenworks-60v-30-riding", rank: 3, badge: "Best for Large Properties", name: "Greenworks 60V 30-Inch Riding Lawn Mower",
    amazonUrl: "https://www.amazon.com/dp/B0DLKLBRYP?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41uRION5OkL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["30-inch deck", "Four 8.0Ah batteries (1,920Wh max)", "Rated for up to 1.25 acres", "Tows up to 200 lbs"],
    specList: [{"label":"Size","value":"30-inch deck"},{"label":"Battery","value":"Four 8.0Ah batteries (1,920Wh max)"},{"label":"Durability","value":"Rated for up to 1.25 acres"},{"label":"Weight Capacity","value":"Tows up to 200 lbs"}],
    description: "Because this is a riding mower, the buying considerations shift toward transport width, storage space, and whether the property has open enough terrain to justify a ride-on machine instead of a walk-behind. The included battery capacity is large in absolute watt-hours, which is the more meaningful number here than the shared 60V platform label.",
    bestFor: "properties around one acre or more where a walk-behind mower would take too long",
    pros: ["1,920Wh maximum battery capacity from four included 8.0Ah packs", "Compared using published specifications, included components, compatibility, and practical trade-offs.", "Can tow attachments up to 200 lbs"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Requires storage space and property access suited to a riding mower, not a walk-behind"],
  },
  {
    id: "senix-x6-60v-self-propelled", rank: 4, badge: "Also Consider", name: "SENIX X6 60V Max 21-Inch Self-Propelled Mower",
    amazonUrl: "https://www.amazon.com/dp/B0GWL8DPV6?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/51URoz8Vl4L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch deck", "3-in-1 cutting", "8Ah battery and charger included", "Smart display, 7-level height adjustment"],
    specList: [{"label":"Size","value":"21-inch deck"},{"label":"Feature 2","value":"3-in-1 cutting"},{"label":"Battery","value":"8Ah battery and charger included"},{"label":"Adjustability","value":"Smart display, 7-level height adjustment"}],
    description: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    bestFor: "Compared using published specifications, included components, compatibility, and practical trade-offs.",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Smart display and 7-level height adjustment for tuning cut quality", "Self-propelled drive with 3-in-1 cutting modes"],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Newer brand in this category with less of a track record than Greenworks or EGO"],
  }
];
export const buyingCriteria = [
  { criterion: "Normalize by watt-hours, not the voltage label", explanation: "Multiply nominal volts by the included amp-hours to estimate watt-hours, then compare that number across mowers. Two 60V mowers with different pack sizes, like a single 4.0Ah battery versus dual 4.0Ah batteries or a 1,920Wh riding pack, will run for very different lengths of time.\n\nGetting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since normalize by watt-hours, not the voltage label affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "Runtime claims assume matched grass conditions", explanation: "Manufacturer runtime figures are typically measured under favorable, dry, moderate-height grass. Tall, damp, dense, or freshly overgrown grass draws more power per pass, so real sessions on a difficult lawn will run shorter than the advertised figure.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a lawn mowers weeks after buying, since runtime claims assume matched grass conditions plays out differently in daily use than it does on paper." },
  { criterion: "Charging and thermal delay between sessions", explanation: "Batteries can need a cooldown period before or during fast charging, especially after a long mowing session in hot weather. If a lawn needs more charge than one battery provides, factor in that delay rather than assuming back-to-back charging is instant.\n\nCompare how each lawn mowers in this roundup actually handles charging and thermal delay between sessions rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Mower weight and deck performance often matter more than the voltage number", explanation: "A heavier deck, wheel size, and blade design affect cut quality and how the mower handles uneven ground as much as or more than the battery voltage. Two mowers on the same 60V platform can behave very differently once you account for deck construction and weight.\n\nMower weight and deck performance often matter more than the voltage number is easy to overlook next to flashier specs, but it's frequently the difference between a lawn mowers that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Replacement-pack and ecosystem cost", explanation: "Getting this wrong is one of the more common reasons a lawn mowers purchase disappoints once it actually arrives, since replacement-pack and ecosystem cost affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." }
];
export const howWeEvaluated = [
  { title: "Included battery energy over voltage label", description: "We looked at the actual amp-hours and number of batteries included with each mower rather than treating every 60V listing as equivalent, since included watt-hours is the better predictor of runtime." },
  { title: "Deck size and drive type versus property fit", description: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
  { title: "Compared using published specifications, included components, compatibility, and practical trade-offs.", description: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
  { title: "Ownership and charging workflow", description: "We considered included charger speed, whether extra batteries are included, and what replacement or spare battery costs look like on each platform over time." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match the Property Before the Voltage Number", table: { headers: ["Buyer situation", "Recommended direction"], rows: [["Standard flat to gently sloped lawn","Greenworks 60V 21-Inch Push Lawn Mower"],["Larger lawn up to about three-quarter acre","Greenworks 60V 21-Inch Brushless Self-Propelled Mower"],["Property around one acre or more","Greenworks 60V 30-Inch Riding Lawn Mower"],["Budget-conscious self-propel buyer comfortable with a newer listing","SENIX X6 60V Max 21-Inch Self-Propelled Mower"]] } },
  { subheading: "Choose the Right Drive Type", cards: [ { label: "Push", text: "Compared using published specifications, included components, compatibility, and practical trade-offs." }, { label: "Self-propelled", text: "Best for larger or uneven lawns where reduced pushing effort extends how long a mowing session stays comfortable." }, { label: "Riding", text: "Best for properties around an acre or more where a walk-behind mower, even a self-propelled one, would take too long or add too much physical effort." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Cost or task", "Verify before buying"], rows: [["Battery energy", "Confirm amp-hours and number of included batteries, not just the voltage label"], ["Wear parts", "Blades, and for riding mowers, tires and drive components"], ["Logistics", "Delivered width, gate access, and storage space, especially for the riding model"], ["Support", "Warranty terms and where to source a replacement battery or blade"]] } },
  { subheading: "Comfort and Workload Checklist", cards: [ { label: "During mowing", text: "Consider starting steps, push or self-propel effort, turning room around obstacles, and how grass height affects both runtime and cut quality." }, { label: "After mowing", text: "Check battery charging time, cooldown delay before recharging, blade access for cleaning, and how the mower folds down for storage." } ] },
];
export const faq = [
  { q: "Does a 60V mower always run longer than a 40V or 56V mower?", a: "No. Voltage alone does not determine runtime. A 60V mower with a small single battery can run shorter than a 40V or 56V mower with a larger included pack. Compare amp-hours and the number of included batteries, not just the voltage number on the box." },
  { q: "How do I estimate runtime before buying?", a: "Multiply the nominal voltage by the included amp-hours to estimate watt-hours, then compare that figure across mowers. Keep in mind that manufacturer runtime claims are typically measured under favorable grass conditions, so tall or damp grass will shorten real sessions." },
  { q: "Is a self-propelled mower worth the extra cost over a push mower?", a: "It depends on the property. On a small flat lawn, a push mower is often enough." },
  { q: "When does a riding mower make sense over a self-propelled walk-behind?", a: "Consider a riding mower once the property approaches an acre or more, where even a self-propelled walk-behind mower would take a long time to cover. Riding mowers also require more storage space and transport width, so confirm those logistics first." },
  { q: "Compared using published specifications, included components, compatibility, and practical trade-offs.", a: "Treat the manufacturer's specifications as a starting point rather than a confirmed result." },
];
export const relatedGuides: { title: string; href: string }[] = [];
