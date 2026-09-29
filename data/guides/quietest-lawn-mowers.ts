export const guideSlug = "quietest-lawn-mowers";
export const guideTitle = "Quietest Lawn Mowers";
export const metaTitle = "Quietest Lawn Mowers (2026): Reel, Battery, and Corded Picks";
export const metaDescription = "Quietest lawn mowers compared by power source, motor and blade noise, no-load versus cutting-load sound, and how each fits a noise-sensitive yard.";
export const mainKeyword = "quietest lawn mowers";
export const categorySlug = "garden-yard";
export const lastUpdated = "2026-08-06";
export const readTime = "10 min";
export const heroImage = "https://m.media-amazon.com/images/I/31f0r+Tws+L._SL500_.jpg";
export const introParagraphs = [
  "Nobody publishes a reliable dBA figure on the box, and most lawn mower listings do not measure noise at all. What actually separates a quiet mowing session from a loud one is the power source: a reel mower has no motor, battery and corded electric mowers replace a combustion engine with a much quieter motor, and gas mowers are the loudest category by design regardless of brand.",
  "We grouped mowers by power source and blade type, then compared how each handles no-load idle sound versus the louder sound made under real cutting load, since that gap matters more for a quiet yard than any single peak number ever could.",
];
export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[];
  specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }
export const products: GuideProduct[] = [
  {
    id: "american-lawn-mower-1204-14", rank: 1, badge: "Best Overall (Quietest Possible)", name: "American Lawn Mower 1204-14 14-Inch 4-Blade Push Reel Mower",
    amazonUrl: "https://www.amazon.com/dp/B00004RA3F?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/31f0r+Tws+L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["14-inch cutting width", "4-blade reel cutting head", "No motor, no battery, no cord", "Push-powered operation"],
    specList: [{"label":"Size","value":"14-inch cutting width"},{"label":"Hose","value":"4-blade reel cutting head"},{"label":"Battery","value":"No motor, no battery, no cord"},{"label":"Color/Finish","value":"Push-powered operation"}],
    description: "American Lawn Mower 1204-14 14-Inch 4-Blade Push Reel Mower has no engine and no electric motor, so the only sound it produces is the mechanical snip of the reel blades against the grass and the whir of the wheels turning.\n\nBecause there is no motor to generate no-load idle noise or louder cutting-load noise, a reel mower is the only category here that is quiet by construction rather than by degree. The tradeoff is that reel mowers work best on small, level, obstacle-light lawns and generally need more frequent passes to stay effective on thicker or taller grass.",
    bestFor: "small, flat lawns where true motor-free quiet matters most",
    pros: ["No motor or battery means no idle or cutting-load motor noise at all", "Simple mechanical design with low long-term maintenance", "Lightweight and easy to store"],
    cons: ["Best suited to small, level lawns rather than large or uneven properties", "Needs more frequent mowing to keep grass at an even height"],
  },
  {
    id: "ego-lm2114", rank: 2, badge: "Best Battery Mower", name: "EGO Power+ 21-Inch Cordless Electric Lawn Mower with Battery, Charger (LM2114)",
    amazonUrl: "https://www.amazon.com/dp/B0BLT8L937?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/418i3mcBfML._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch cutting deck", "56V battery platform", "Battery and charger included", "Brushless motor"],
    specList: [{"label":"Size","value":"21-inch cutting deck"},{"label":"Power Source","value":"56V battery platform"},{"label":"Battery","value":"Battery and charger included"},{"label":"Feature 4","value":"Brushless motor"}],
    description: "Battery mowers like this one are inherently quieter than gas equivalents because there is no combustion engine, no exhaust pulse, and no idle noise while the machine sits between passes.\n\nReviewers commonly describe brushless battery mowers in this class as low-noise for daily use compared to a gas mower, though the motor and blade still produce audible cutting-load sound once it engages with grass, and that sound rises further in thick or damp conditions. A brushless motor also tends to run smoother than a brushed one, which can make the overall sound feel less harsh even when it is not dramatically quieter in isolation.",
    bestFor: "standard-size lawns wanting full battery power with meaningfully lower noise than gas",
    pros: ["Brushless motor with no combustion engine noise or idle exhaust sound", "Full 21-inch deck for standard-size lawns", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Cutting-load sound still rises in thick or tall grass", "Battery and charger add cost and require a charging routine"],
  },
  {
    id: "greenworks-80v-21", rank: 3, badge: "Best Self-Propelled", name: "Greenworks 80V 21-Inch Self-Propelled Lawn Mower, 4.0 Ah Battery and Charger",
    amazonUrl: "https://www.amazon.com/dp/B0CLSC6B2T?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41XlO0UuWrL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["21-inch cutting deck", "80V 4Ah battery included", "Self-propelled drive", "Battery-electric motor"],
    specList: [{"label":"Size","value":"21-inch cutting deck"},{"label":"Power Source","value":"80V 4Ah battery included"},{"label":"Lighting","value":"Self-propelled drive"},{"label":"Battery","value":"Battery-electric motor"}],
    description: "Like any battery mower, it avoids the combustion noise of a gas engine, but the self-propel drive motor is an additional moving part and mechanical noise source alongside the blade motor and the deck itself.\n\nBuyers who want the lowest-effort mowing session without a gas engine will find this a reasonable middle ground, though the drive motor engaging and disengaging adds its own mechanical sound on top of blade noise, and that combination should be weighed against a simpler push battery mower if noise minimization is the top priority over reduced pushing effort.",
    bestFor: "larger or sloped lawns wanting self-propel without gas engine noise",
    pros: ["No gas engine, avoiding combustion and exhaust noise entirely", "Self-propelled drive reduces pushing effort on slopes", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Drive motor is an added mechanical noise source beyond the blade motor", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
  },
  {
    id: "mzk-20v-13", rank: 4, badge: "Best Compact Pick", name: "MZK 20V 13-Inch Electric Lawn Mower, Compact Brushless Mower",
    amazonUrl: "https://www.amazon.com/dp/B0H8SH465J?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41bn6ghaLLL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["13-inch cutting deck", "20V battery platform", "Brushless motor", "Compact, lightweight build"],
    specList: [{"label":"Size","value":"13-inch cutting deck"},{"label":"Power Source","value":"20V battery platform"},{"label":"Feature 3","value":"Brushless motor"},{"label":"Weight Capacity","value":"Compact, lightweight build"}],
    description: "Its smaller brushless motor and narrower deck mean lower overall power draw, which generally corresponds to a lighter mechanical sound signature than a full-size deck pushing through the same grass.\n\nThe compact size makes this a fit for small yards, patches, or tight side lots rather than a primary mower for a full-size lawn, and reviewers commonly describe small brushless motors like this as noticeably calmer to run than either a gas mower or a larger battery deck under similar conditions.",
    bestFor: "small yards or tight areas wanting a light, low-noise electric option",
    pros: ["Small brushless motor generally runs with a lighter sound signature", "Lightweight and easy to maneuver in tight spaces", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "13-inch deck is impractical for anything beyond a small yard"],
  },
  {
    id: "litheli-cordless-14", rank: 5, badge: "Best Lightweight Push Mower", name: "Litheli Cordless Lawn Mower 14 Inch, Brushless Motor Push Mower, 5.0Ah Battery and Charger",
    amazonUrl: "https://www.amazon.com/dp/B0GXVD6ZLV?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/51zw5LOnu7L._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["14-inch cutting deck", "Brushless motor", "5.0Ah battery and charger included", "5-position height adjustment"],
    specList: [{"label":"Size","value":"14-inch cutting deck"},{"label":"Feature 2","value":"Brushless motor"},{"label":"Battery","value":"5.0Ah battery and charger included"},{"label":"Adjustability","value":"5-position height adjustment"}],
    description: "Its brushless motor and modest 14-inch deck still put it firmly in the quieter battery-electric category compared to any gas mower, since there is no engine, exhaust, or idle combustion sound.\n\nWith cutting listed up to 3,000 square feet on a charge, it is sized for a small lawn rather than a primary mower for a larger property, and the lighter deck and motor generally mean less cutting-load strain and a calmer mechanical sound than a heavier full-size deck working through the same patch of grass.",
    bestFor: "small lawns under about 3,000 square feet wanting a light, no-maintenance battery mower",
    pros: ["Brushless motor avoids gas engine and exhaust noise", "Lightweight design with simple height adjustment", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "14-inch deck and stated coverage limit it to small lawns"],
  },
  {
    id: "greenworks-40v-16", rank: 6, badge: "Best for Small to Mid Lawns", name: "Greenworks 40V 16-Inch Push Lawn Mower, 4.0 Ah Battery and Charger",
    amazonUrl: "https://www.amazon.com/dp/B00BBQVL5U?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/41hGtP+Q5jL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["16-inch cutting deck", "40V 4Ah battery included", "Push drive", "Established Greenworks 40V platform"],
    specList: [{"label":"Size","value":"16-inch cutting deck"},{"label":"Power Source","value":"40V 4Ah battery included"},{"label":"Drive Type","value":"Push drive"},{"label":"Color/Finish","value":"Established Greenworks 40V platform"}],
    description: "As a push-only battery mower with no self-propel drive motor, it has one fewer mechanical noise source than the self-propelled Greenworks model above, since there is no drive motor engaging and disengaging during use.\n\nThe 16-inch deck sits between the compact options and the full-size 21-inch mowers, making it a practical middle ground for small to mid-size lawns where buyers want an established, well-reviewed battery mower without the added mechanical sound of a self-propel system.",
    bestFor: "small to mid-size lawns wanting a proven, push-only battery mower",
    pros: ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "No self-propel drive motor to add extra mechanical noise", "40V platform shares batteries with other Greenworks tools"],
    cons: ["16-inch deck is narrower than full-size 21-inch mowers", "No self-propel option for larger or sloped yards"],
  },
  {
    id: "black-decker-besta512cm", rank: 7, badge: "Best Corded Budget Pick", name: "BLACK+DECKER Electric Lawn Mower, Weed Eater and Edger 3-in-1 Combo, Corded 12-Inch Push Mower (BESTA512CM)",
    amazonUrl: "https://www.amazon.com/dp/B078YYPWLY?tag=gardeningisezee-20", imageUrl: "https://m.media-amazon.com/images/I/31CdnGNWAvL._SL500_.jpg",
    ctaLabel: "Check price on Amazon", shortCtaLabel: "Check price",
    specs: ["12-inch cutting deck", "6.5 Amp corded motor", "3-in-1 mower, trimmer, and edger combo", "No battery needed"],
    specList: [{"label":"Size","value":"12-inch cutting deck"},{"label":"Motor","value":"6.5 Amp corded motor"},{"label":"Feature 3","value":"3-in-1 mower, trimmer, and edger combo"},{"label":"Battery","value":"No battery needed"}],
    description: "A corded electric motor is in the same quieter-than-gas category as battery motors, avoiding combustion and exhaust noise, and its small 12-inch deck and modest amp draw generally mean a lighter mechanical load than a larger deck cutting the same grass.\n\nThe corded design means no battery to charge or replace, but it also means managing an extension cord through the mowing path, and the compact deck plus combo trimmer and edger attachments position this as a tool for small patches and touch-up edging rather than a primary mower for a full lawn.",
    bestFor: "small patches, edging, and touch-up mowing near an outlet",
    pros: ["Corded electric motor avoids gas engine and exhaust noise", "3-in-1 combo covers mowing, trimming, and edging", "Compared using published specifications, included components, compatibility, and practical trade-offs."],
    cons: ["Small 12-inch deck limits it to small areas or edging work", "Extension cord management is required during use"],
  },
];
export const buyingCriteria = [
  { criterion: "Motor and blade noise are separate sources", explanation: "A mower's overall sound comes from the motor or engine, the blade cutting through grass, the deck resonating, and, on self-propelled models, a separate drive motor. Reducing one source does not automatically reduce the others.\n\nGetting this wrong is one of the more common reasons a quietest lawn mowers purchase disappoints once it actually arrives, since motor and blade noise are separate sources affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
  { criterion: "No-load noise versus cutting-load noise", explanation: "A mower running with no grass under the deck sounds different from the same mower under real cutting load.\n\nThis is the kind of detail that looks minor in a spec list but shapes how satisfied you actually are with a quietest lawn mowers weeks after buying, since no-load noise versus cutting-load noise plays out differently in daily use than it does on paper." },
  { criterion: "Whole-job noise duration, not just peak level", explanation: "A quieter mower that takes twice as long to finish a lawn can produce more total noise exposure than a louder mower that finishes quickly. Consider deck width, self-propel speed, and how long a full mowing session actually runs.\n\nCompare how each quietest lawn mowers in this roundup actually handles whole-job noise duration, not just peak level rather than assuming they're interchangeable on this point, since the listings here differ on it more than the headline specs suggest." },
  { criterion: "Battery and corded electric versus gas", explanation: "Battery and corded electric motors avoid the combustion engine, exhaust pulse, and idle noise that make gas mowers the loudest category as a rule. A reel mower with no motor at all goes a step further than any powered option.\n\nBattery and corded electric versus gas is easy to overlook next to flashier specs, but it's frequently the difference between a quietest lawn mowers that fits your routine and one that quietly becomes a hassle." },
  { criterion: "Balance quietness with cut quality and mowing time", explanation: "The quietest option on paper is not useful if it cannot keep up with the lawn's size or grass type. Weigh deck width, drive assistance, and battery runtime against how much quieter operation is worth to your household.\n\nGetting this wrong is one of the more common reasons a quietest lawn mowers purchase disappoints once it actually arrives, since balance quietness with cut quality and mowing time affects real day-to-day use in a way marketing photos and bullet points don't always make obvious." },
];
export const howWeEvaluated = [
  { title: "Power source grouping", description: "We grouped mowers by reel, corded electric, and battery electric, since power source is the single largest determinant of how loud a mower is, rather than ranking every mower on one undifferentiated list." },
  { title: "Noise source breakdown", description: "We considered the motor, the blade against grass, the deck, and any self-propel drive motor as separate contributors, since a quiet motor paired with a loud deck or drive system will not produce a uniformly quiet mower." },
  { title: "Real listing feedback", description: "Compared using published specifications, included components, compatibility, and practical trade-offs." },
  { title: "Fit for a noise-sensitive yard", description: "We matched deck size and drive type to realistic lawn sizes, since an underpowered mower working longer or straining through thick grass can add more total noise exposure than a slightly louder mower that finishes the job faster." },
];
export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }
export const howToChoose: HowToChooseSection[] = [
  { subheading: "Match Your Yard and Noise Priority", table: { headers: ["Buyer situation", "Recommended direction"], rows: [["Small, flat lawn wanting the quietest option possible","American Lawn Mower 1204-14 14-Inch 4-Blade Push Reel Mower"],["Standard-size lawn wanting full battery power with less noise than gas","EGO Power+ 21-Inch Cordless Electric Lawn Mower with Battery, Charger (LM2114)"],["Larger or sloped lawn wanting self-propel without a gas engine","Greenworks 80V 21-Inch Self-Propelled Lawn Mower, 4.0 Ah Battery and Charger"],["Small yard wanting a light, compact battery mower","MZK 20V 13-Inch Electric Lawn Mower, Compact Brushless Mower"],["Small patch or edging job near an outlet","BLACK+DECKER Electric Lawn Mower, Weed Eater and Edger 3-in-1 Combo, Corded 12-Inch Push Mower (BESTA512CM)"]] } },
  { subheading: "Understand the Noise Sources", cards: [ { label: "Motor or engine", text: "A gas engine is the loudest source by design, a corded or battery electric motor is quieter, and a reel mower removes this source entirely." }, { label: "Blade and cutting load", text: "Any mower gets louder once the blade engages real grass, and that increase is larger in thick, tall, or damp conditions regardless of power source." }, { label: "Deck and drive system", text: "The deck can resonate mechanical sound, and a self-propel drive motor adds its own noise on top of the blade motor when engaged." } ] },
  { subheading: "Real Ownership Checklist", table: { headers: ["Factor", "Verify before buying"], rows: [["Power source", "Reel, corded electric, or battery electric, and how that affects both noise and mowing schedule"], ["Deck width and lawn size", "Whether the deck can finish your lawn in a reasonable session without straining"], ["Drive type", "Whether self-propel is worth its added mechanical noise for your terrain"], ["Compared using published specifications, included components, compatibility, and practical trade-offs.", "Compared using published specifications, included components, compatibility, and practical trade-offs."]] } },
  { subheading: "Living With a Quieter Mower", cards: [ { label: "Before mowing", text: "Check battery charge or cord reach, and plan mowing time around neighbors or household schedules that a quieter mower makes easier to accommodate." }, { label: "During mowing", text: "Expect cutting-load sound to rise in thick or tall grass regardless of power source, and keep an even mowing pace to avoid bogging down the blade." } ] },
];
export const faq = [
  { q: "Is a reel mower really quieter than every powered mower?", a: "Yes, in terms of motor noise specifically, since a reel mower has no engine or electric motor at all. It still makes mechanical sound from the blades and wheels, but there is no combustion, exhaust, or motor whir to add to it." },
  { q: "Are battery mowers actually quieter than gas mowers?", a: "Battery and corded electric mowers are inherently quieter than gas equivalents because they avoid the combustion engine, exhaust pulse, and idle noise that gas mowers produce. Reviewers commonly describe well-built battery mowers as low-noise for daily use compared to gas." },
  { q: "Why don't you list decibel numbers for these mowers?", a: "Manufacturers rarely publish independently verified dBA figures for lawn mowers, and we do not have lab equipment to measure sound levels ourselves. Discussing noise qualitatively, by power source and reviewer feedback, is more honest than presenting invented numbers as fact." },
  { q: "Does a self-propelled mower add noise compared to a push mower?", a: "Yes, generally. A self-propel drive motor is an additional mechanical component beyond the blade motor, and it engages and disengages as you walk, which adds its own sound on top of the blade and deck noise." },
  { q: "Will a quieter mower take longer to mow my lawn?", a: "It can, especially with a narrower deck or a lighter motor working through thick grass. Consider the whole mowing session, not just how quiet the mower sounds at idle, since a longer session at a lower volume can still add up to meaningful total noise exposure." },
];
export const relatedGuides: { title: string; href: string }[] = [];
