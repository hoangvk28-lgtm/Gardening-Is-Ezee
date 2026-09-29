import fs from "fs";
import { P } from "./firesafe-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-firesafe.json", "utf8"));
const raw = fs.readFileSync("scripts/_firesafe_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Independent Fire Evidence, Not Brand Reputation", description: "Checked whether each model's fire-resistance claim is backed by an independent classification (UL, ETL) or is only a manufacturer's own stated figure, since brand reputation and steel weight alone don't establish a duration." },
  { title: "Time and Temperature as Separate Facts", description: "Recorded fire duration and test temperature separately for each model rather than accepting a vague 'fireproof' label, since a 30-minute rating and a 2-hour rating protect very differently in a real house fire." },
  { title: "Water Evidence Verified Independently", description: "Checked water-resistance claims (submersion depth, duration) as a separate fact from the fire rating, since the two protections are tested and certified independently even on the same product." },
  { title: "Usable Capacity Over Nominal Cubic Feet", description: "Compared interior dimensions, shelf layout, and door clearance rather than trusting nominal cubic-foot figures alone, since insulation and hardware can meaningfully shrink usable space." },
  { title: "Ownership Details: Weight, Anchoring, and Lock Support", description: "Weighed empty and loaded weight, anchoring hardware, and lock or key replacement support, since a fireproof safe is a long-term purchase that outlives its first key or battery." },
];

const sharedFaqPool = [
  { key: "fireproof-vs-fire-resistant", q: "What's the real difference between 'fireproof' and 'fire-resistant' safes?", a: "No consumer safe is truly fireproof in the sense of being immune to fire; every model is rated for a specific duration and temperature after which its contents are no longer guaranteed protected. 'Fire-resistant' is the more accurate term, and the specific UL or ETL classification (time and temperature) tells you more than either marketing word alone." },
  { key: "ul-classification-mean", q: "What does a UL fire classification actually certify?", a: "A UL Classified rating means an independent lab tested that specific model to a defined time-and-temperature standard (commonly 1/2 hour at 1550°F, 1 hour at 1700°F, or 2 hours at 1850°F) and confirmed the interior stayed below a safe threshold for paper documents. It's a model-specific certification, not a general brand claim." },
  { key: "fireproof-vs-waterproof-safe", q: "Does a fireproof safe also protect against water damage?", a: "Not automatically. Fire and water resistance are tested and certified separately, even on the same product, so check both ratings independently rather than assuming a fireproof safe is also waterproof, or vice versa. Many current SentrySafe and Master Lock models document both, but budget safes may only address one." },
  { key: "nominal-vs-usable-capacity", q: "Does the cubic-foot rating on a safe match its real usable storage space?", a: "Not exactly. Fire insulation, shelving, and door hardware all take up interior volume, so the nominal cubic-foot figure is always somewhat larger than what you can actually pack inside. Check interior dimensions and shelf layout, not just the headline capacity number." },
  { key: "anchoring-safe-floor-wall", q: "Should a fireproof safe be bolted to the floor or wall?", a: "For anything beyond a small portable chest, yes, if theft deterrence matters to you: an unanchored safe, however heavy, can still be carried off by a determined thief with the right tools and enough time. Most safes over about 1 cubic foot include pre-drilled mounting holes and hardware for this reason." },
  { key: "warranty-fire-damage-replacement", q: "What happens if a safe is actually damaged in a real fire?", a: "Policies vary by brand. Some manufacturers, including SentrySafe and TIGERKING, offer a fire-damage replacement program that replaces the safe (not necessarily its contents) if it's damaged protecting your belongings in an actual fire; check the specific model's warranty terms rather than assuming this is universal." },
  { key: "moisture-safe-humidity", q: "Do I need to worry about humidity inside a closed fireproof safe?", a: "Yes, especially in humid climates or basements. First Alert and other manufacturers recommend periodically airing out the safe and using a silica gel packet inside molded fire-resistant safes, since the same seal that keeps fire and water out during an emergency can also trap ambient moisture during normal storage." },
];

function fillFaq(specificFaq, count = 5) {
  const out = [...specificFaq];
  const specificText = specificFaq.map((f) => (f.q + f.a).toLowerCase()).join(" ");
  for (const item of sharedFaqPool) {
    if (out.length >= count) break;
    const topicWords = item.key.split("-");
    const alreadyCovered = topicWords.filter((w) => w.length > 3).every((w) => specificText.includes(w));
    if (alreadyCovered) continue;
    out.push({ q: item.q, a: item.a });
  }
  return out;
}

function badgeFor(i, total) {
  if (i === 0) return "Best Overall";
  if (i === total - 1 && total > 2) return "Budget Pick";
  return ["Runner-Up", "Also Great", "Strong Alternative", "Worth Considering", "Solid Option", "Another Pick"][Math.min(i - 1, 5)];
}

function pick(asin, badgeText) {
  const meta = lookup[asin];
  const info = P[asin];
  if (!meta || !info) return null;
  return {
    asin, badge: badgeText,
    name: info.name,
    price: meta.price || "Check price",
    rating: meta.rating,
    reviews: meta.reviewCount,
    imageUrl: meta.image,
    amazonUrl: `https://www.amazon.com/dp/${asin}?tag=theofficejournal-20`,
    description: info.p1,
    specs: info.specs,
    pros: info.pros,
    cons: info.cons || [],
    bestFor: "",
  };
}

const ANGLE_BY_CAT = {
  budget: "verifying the fire rating actually holds up at a lower price, not just the sticker",
  brand: [
    "checking which specific models in the lineup actually carry an independent fire rating",
    "mapping the brand's current fire-rated lineup instead of assuming every model qualifies",
    "verifying model-level fire evidence rather than trusting brand reputation alone",
  ],
  ul: "confirming the UL classification is documented for the exact model, not just the brand",
  cash: "separating burglary-resistance features from the fire rating itself",
  jewelry: "checking fire evidence and interior lining as two separate concerns",
  waterproof: "verifying fire and water resistance as two independently tested claims",
  combination: "weighing dial reliability against the convenience of a digital keypad",
  digital: "checking keypad reliability, battery life, and backup access",
  small: "measuring real usable interior space against the compact exterior",
  large: "checking loaded weight, floor support, and delivery logistics",
  home: "matching capacity and fire duration to what a household actually needs to protect",
  documents: "verifying paper-specific fire evidence and real folder clearance",
  box: "checking fire evidence for the exact chest, not just the safe category",
  hour: "confirming both the exact duration and the test temperature together",
  capacity: [
    "checking real usable interior space against the advertised cubic footage",
    "verifying how much insulation eats into the nominal cubic-foot figure",
    "measuring actual interior height, width, and depth against the listed capacity",
    "confirming shelf and door hardware don't quietly shrink the advertised interior",
  ],
  key: "weighing key-only access against replacement support if a key is lost",
  drawer: "verifying filing direction and anti-tip behavior when multiple drawers open",
  portable: "weighing loaded carry weight against the security tradeoffs of true portability",
  heavyduty: "requiring documented fire evidence to back up heavy steel construction",
  office: "balancing shared access control with genuine fire and water protection",
  generic: "verifying independent fire evidence instead of trusting a listing's own claims",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves function-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a headline spec on the box.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} products vary enough that ${angle} matters more than brand name alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or star rating.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between models is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to price, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on independent fire evidence and ${angle}, since specs alone regularly overstate real-world performance.`,
  (angle) => `Our ranking weighs independent fire evidence and ${angle} ahead of marketing language or exterior appearance.`,
  (angle) => `Each pick here was judged on independent fire evidence and ${angle}, not just its star rating or price tag.`,
  (angle) => `We prioritized independent fire evidence and ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we verified independent fire evidence and ${angle} for every product on this list.`,
  (angle) => `The picks below were sorted by independent fire evidence and ${angle}, the details that actually decide how a safe performs when it matters.`,
  (angle) => `What separates these picks is independent fire evidence and ${angle}, checked model by model instead of assumed from the brand.`,
  (angle) => `Every entry on this list was screened for independent fire evidence and ${angle} before anything else was weighed.`,
  (angle) => `Independent fire evidence and ${angle} decided this ranking far more than star counts or review volume did.`,
  (angle) => `We leaned on independent fire evidence and ${angle} to separate genuinely strong picks from well-marketed ones.`,
];

function buildIntro(cat, kw, title, num) {
  let angleEntry = ANGLE_BY_CAT[cat] || ANGLE_BY_CAT.generic;
  const angle = Array.isArray(angleEntry) ? angleEntry[num % angleEntry.length] : angleEntry;
  const firstIdx = num % FIRST_TEMPLATES.length;
  const secondIdx = (num * 3 + 2) % SECOND_TEMPLATES.length;
  return [FIRST_TEMPLATES[firstIdx](title, kw, angle), SECOND_TEMPLATES[secondIdx](angle)];
}

function bc(criterion, explanation) {
  return { criterion, explanation };
}

const articles = raw.map((line) => {
  const [num, title, asinStr] = line.split("\t");
  const asins = asinStr.split("|").map((s) => s.trim()).filter(Boolean);
  return { num: Number(num), title: title.trim(), asins: [...new Set(asins)] };
});

function slugify(title) {
  return title.toLowerCase().replace(/’/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mainKeywordFor(title) {
  return title.replace(/^Best\s+/i, "").trim().toLowerCase();
}

function classify(title) {
  const t = title.toLowerCase();
  if (/under \$/.test(t)) return "budget";
  if (/brinks|sentrysafe|tigerking|honeywell|first alert|yale/.test(t)) return "brand";
  if (/\bul rated\b/.test(t)) return "ul";
  if (/\bcash\b/.test(t)) return "cash";
  if (/jewelry/.test(t)) return "jewelry";
  if (/waterproof/.test(t)) return "waterproof";
  if (/combination/.test(t)) return "combination";
  if (/digital/.test(t)) return "digital";
  if (/keypad/.test(t)) return "digital";
  if (/\bkey\b|key lock/.test(t)) return "key";
  if (/drawer/.test(t)) return "drawer";
  if (/\bbox\b/.test(t)) return "box";
  if (/portable/.test(t)) return "portable";
  if (/heavy duty/.test(t)) return "heavyduty";
  if (/important documents?/.test(t)) return "documents";
  if (/documents?\b/.test(t)) return "documents";
  if (/office/.test(t)) return "office";
  if (/\bhour\b/.test(t)) return "hour";
  if (/\bcu(bic)?\s*\.?\s*ft\b|cubic feet/.test(t)) return "capacity";
  if (/extra large|large/.test(t)) return "large";
  if (/small/.test(t)) return "small";
  if (/\bhome\b/.test(t)) return "home";
  return "generic";
}

function buildHowToChoose(cat, kw) {
  const K = kw;
  switch (cat) {
    case "home":
      return [
        { subheading: "Size the Safe to a Real Home Inventory", note: `Build an actual list of documents, media, and valuables before choosing a ${K}, rather than guessing at a size, since nominal cubic feet regularly overstates real usable space.` },
        { subheading: "Verify Fire and Water Evidence Separately", note: "Check the exact model's independent fire classification and, separately, any water-resistance claim, since a home safe's marketing often blends the two into one vague 'protection' label." },
        { subheading: "Weigh Portability Against Theft Deterrence", note: "A lightweight, portable chest is easy to grab during evacuation but also easy for a thief to carry off; an anchored, heavier safe trades some portability for real theft deterrence." },
        { subheading: "Plan Delivery, Stairs, and Floor Path", note: "Check the safe's shipping weight against your home's stairs, doorways, and floor load before ordering, especially for anything above roughly 100 lbs." },
        { subheading: "Include Off-Site or Digital Backups", note: "For genuinely irreplaceable records, keep a digital scan or off-site copy in addition to the physical safe, since no home safe eliminates fire and flood risk entirely." },
      ];
    case "documents":
      return [
        { subheading: "Verify Paper-Specific Fire Evidence", note: `Check that ${K}'s fire rating specifically covers paper records, and treat any digital-media claim as a separate fact rather than assuming one rating covers both.` },
        { subheading: "Measure Letter and Legal Fit", note: "Confirm whether folders lie flat or need to be folded, and check hanging-file compatibility if that's how your documents are currently organized." },
        { subheading: "Check Folder and Binder Clearance", note: "Measure the door or lid opening against actual binders, certificates, and envelopes, not just loose paper, since binders and rigid folders need more clearance." },
        { subheading: "Plan for Humidity Inside the Safe", note: "Long-term paper storage benefits from occasional airing out and a silica gel packet, since the same seal that blocks fire and water can trap ambient moisture." },
        { subheading: "Design for Retrieval, Not Just Storage", note: "Organize the safe so you can pull a specific document without unloading everything else, especially if it holds passports, deeds, or other frequently needed originals." },
      ];
    case "box":
      return [
        { subheading: "Require Documented Fire Evidence for the Exact Chest", note: `Verify ${K}'s specific fire classification rather than assuming a chest-style box automatically carries the same rating as a full-size safe.` },
        { subheading: "Check Water Resistance Separately", note: "A fireproof rating does not guarantee waterproofing; check the water claim independently before assuming basement or flood-zone protection." },
        { subheading: "Calculate Loaded Carry Weight", note: "Chests are marketed on portability, so weigh them loaded with real documents and media, not just empty, before assuming one person can carry it out during an evacuation." },
        { subheading: "Measure Document Fit and Lid Clearance", note: "Confirm letter or legal documents actually fit as intended, and check lid-opening clearance if the chest will sit on a shelf or in a closet." },
        { subheading: "Understand the Real Theft Deterrence Level", note: "A portable chest with a simple key or combination lock deters casual snooping, not a determined thief; don't treat chest-class security as equivalent to a bolted-down safe." },
      ];
    case "hour":
      return [
        { subheading: "Confirm the Duration Is Independently Documented", note: `Require exact evidence (UL Classified, ETL Verified, or equivalent) for ${K}'s stated fire duration rather than accepting a manufacturer's own unverified claim at face value.` },
        { subheading: "Check the Test Temperature, Not Just the Time", note: "A duration figure means little without its paired temperature; SentrySafe, for example, documents 1-hour testing at 1700°F and 2-hour testing at 1850°F, meaningfully different heat exposure." },
        { subheading: "Verify What Contents the Rating Actually Covers", note: "Paper-document protection and digital-media protection (CDs, USB drives, hard drives) are often tested and rated separately, even within the same duration class." },
        { subheading: "Treat Water and Impact Claims as Separate Facts", note: "A fire-duration rating says nothing about water resistance or drop/impact survival; check those claims independently if either matters for your situation." },
        { subheading: "Weigh the Size and Weight Tradeoff", note: "Longer fire ratings generally require thicker insulation, which adds weight and reduces usable interior space relative to the exterior footprint; factor this into your final size choice." },
      ];
    case "small":
      return [
        { subheading: "Set Explicit Size and Weight Thresholds", note: `Define what "small" actually means for ${K} in both exterior dimensions and weight, since the label alone doesn't guarantee it fits a specific drawer or closet shelf.` },
        { subheading: "Check Usable Interior, Not Just Cubic Feet", note: "Small safes lose a disproportionate share of their exterior volume to insulation; check actual interior dimensions rather than trusting the nominal capacity figure." },
        { subheading: "Require Exact Fire Time and Temperature Evidence", note: "Don't assume a small safe automatically has a shorter or weaker fire rating; check the specific model's documented duration and temperature." },
        { subheading: "Calculate Loaded Portability", note: "If portability matters, weigh the safe loaded with your actual documents and valuables, not empty, since even a small safe gets meaningfully heavier once packed." },
        { subheading: "Separate Privacy Locking From Real Security", note: "A small safe's lock (key or basic combination) is usually privacy-level protection; check for anchoring holes and hardware if genuine burglary deterrence matters." },
      ];
    case "large":
      return [
        { subheading: "Publish Usable Interior vs. Exterior Footprint", note: `Get ${K}'s actual interior dimensions and shelf layout, not just its exterior size, since insulation and hardware take a real bite out of large safes too.` },
        { subheading: "Calculate Realistic Loaded Weight", note: "Large safes can weigh hundreds of pounds empty; account for the added weight of everything you plan to store before assuming your floor can support it." },
        { subheading: "Plan Stairs, Doorways, and Professional Delivery", note: "Check doorway widths, stairwells, and floor loading along the delivery path, and budget for professional delivery on anything in the 150+ lb range." },
        { subheading: "Verify Shelf Adjustability and Door Clearance", note: "Confirm shelves can be reconfigured for your actual items, and measure the door's full swing clearance in the room where the safe will sit." },
        { subheading: "Check Anchoring Instructions and Warranty Impact", note: "Some safes require anchoring to maintain their stated security rating or warranty coverage; check the manufacturer's specific installation requirements before skipping this step." },
      ];
    case "cash":
      return [
        { subheading: "Separate Fire Evidence From Burglary Features", note: `Verify ${K}'s fire classification independently from any bolts, steel gauge, or pry-resistance claims, since a fire rating alone says nothing about theft resistance.` },
        { subheading: "Document Actual Steel, Bolts, and Hinge Construction", note: "Check bolt count, bolt diameter, and hinge design specifically, rather than trusting a general 'heavy duty' or 'anti-theft' label." },
        { subheading: "Compare Access Methods and Failure Modes", note: "Key, mechanical combination, and electronic access each fail differently (lost key, forgotten combination, dead battery); pick the method whose failure mode you're most prepared to handle." },
        { subheading: "Organize Cash So It Isn't Immediately Exposed", note: "A safe that dumps all contents into view the moment it opens exposes cash to anyone glancing over your shoulder; shelves, trays, or a separate locking drawer help control this." },
        { subheading: "Verify Anchoring for Stationary Cash Storage", note: "For cash kept in one place long-term, anchoring hardware meaningfully improves theft deterrence versus a portable chest that can simply be carried away." },
      ];
    case "combination":
      return [
        { subheading: "Verify Factory-Set vs. User-Changeable Combinations", note: `Check whether ${K}'s combination can be changed by the owner or is permanently factory-set, since a fixed code matters if the safe changes hands or a code is compromised.` },
        { subheading: "Test Dial Readability and Access Time", note: "A mechanical dial takes longer to operate than a keypad; consider how often you'll need access and whether the dial numbers are large and clear enough for quick reading." },
        { subheading: "Understand the Override Key's Role", note: "Many combination safes include a physical override key for backup access; store it somewhere other than inside the safe itself, and confirm whether losing it requires locksmith service." },
        { subheading: "Check Fire Evidence Independently of Lock Type", note: "A combination lock offers no fire protection on its own; verify the safe's fire classification separately from its lock mechanism." },
        { subheading: "Confirm Lost-Combination Support", note: "Ask what happens if the combination is forgotten and the override key is lost, since mechanical combination locks generally require professional locksmith service to open." },
      ];
    case "waterproof":
      return [
        { subheading: "Require Fire and Water Evidence as Two Separate Claims", note: `Check ${K}'s fire classification and its water-resistance rating independently, since manufacturers test and certify each separately even when both appear on the same product.` },
        { subheading: "Check Water Depth and Duration Specifically", note: "Waterproof claims vary meaningfully by depth (a few inches versus full submersion) and duration (24 hours versus 72 hours); check the exact figures rather than trusting the word 'waterproof' alone." },
        { subheading: "Plan for Post-Flood Handling", note: "Know how to safely open and dry out a safe that's been exposed to floodwater, since opening it improperly can expose contents to residual moisture or contamination." },
        { subheading: "Understand This Is Different From Splash Resistance", note: "A true waterproof or submersion rating (ETL Verified, for example) is a meaningfully stronger claim than a basic splash-resistant or IPX-rated seal; check which one applies to the specific model." },
        { subheading: "Manage Normal Humidity Separately", note: "Even a genuinely waterproof safe can trap ambient humidity during normal storage; periodic airing out and a silica gel packet help protect paper contents long-term." },
      ];
    case "digital":
      return [
        { subheading: "Test Keypad Reliability and Lockout Behavior", note: `Check how ${K}'s keypad handles repeated entries and what happens after multiple wrong attempts, since lockout duration and alarm behavior vary meaningfully between models.` },
        { subheading: "Verify Battery Type and Backup Access", note: "Confirm what batteries the keypad needs, whether a low-battery warning exists, and what backup access (physical key, external battery port) is available if the batteries die." },
        { subheading: "Understand Master and User Code Behavior", note: "Check whether the safe supports multiple codes for different users, and how straightforward the code-change process actually is." },
        { subheading: "Verify Fire Rating Independently of the Lock", note: "A digital lock is a convenience feature, not a fire-protection feature; check the safe's fire classification separately from its keypad specs." },
        { subheading: "Separate Alarm and Security Features From Fire Performance", note: "Tamper alarms, vibration sensors, and bolt count address theft, not fire; evaluate these as a distinct category from the fire-resistance rating." },
      ];
    case "jewelry":
      return [
        { subheading: "Verify Fire and Security Claims Independently", note: `Check ${K}'s fire classification and physical security features (bolts, hinges, steel gauge) as two separate facts before assuming either applies to the other.` },
        { subheading: "Look for Soft-Lined Interior Storage", note: "A felt-lined shelf, tray, or dedicated jewelry bag prevents pieces from scratching against bare metal or each other during normal use." },
        { subheading: "Plan for Humidity and Tarnish Control", note: "Sealed safes can trap humidity that accelerates tarnish on silver and some metals; periodic airing out or a moisture-absorbing packet helps for long-term jewelry storage." },
        { subheading: "Confirm Organizers Stay Secure During Movement", note: "Check that removable trays or shelves lock into place rather than sliding freely, especially if the safe will ever be moved or bolted in later." },
        { subheading: "Document Anchoring and Access Control", note: "For genuinely valuable jewelry collections, anchoring hardware and a documented access-control method (not just a basic privacy lock) matter more than for everyday document storage." },
      ];
    case "brand":
      return [
        { subheading: "Map the Brand's Current Fire-Rated Lineup", note: `Confirm which current models actually carry a fire rating rather than assuming every product in the ${K} catalog does, since brands often sell fire-resistant and purely security-focused safes side by side.` },
        { subheading: "Require Exact Model-Level Rating Evidence", note: "A brand's overall reputation doesn't establish any single model's fire duration; check the specific classification for the exact SKU you're buying." },
        { subheading: "Compare Lock Variants Within the Line", note: "The same brand often offers key, dial-combination, and digital-keypad versions of a similar safe body; compare these as genuinely different products, not interchangeable options." },
        { subheading: "Check the Documented Capacity Range", note: "Map the brand's current size range against your actual storage needs, since one popular model doesn't represent the full lineup's capacity options." },
        { subheading: "Verify Warranty and Replacement Support", note: "Check what warranty, fire-damage replacement, and lost-key or lost-combination support the brand actually documents for the specific model." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp the Price and Separate Shipping", note: `Verify ${K}'s current price at checkout, since posted prices and available stock change, and factor in shipping cost separately for anything with real weight.` },
        { subheading: "Require Explicit Fire Evidence Before Trusting the Label", note: "Low-cost listings are the most likely to use vague 'fireproof' language without independent backing; require a specific classification before treating a budget product as genuinely fire-resistant." },
        { subheading: "Compare Usable Capacity Per Dollar", note: "Compare interior dimensions, not just price, since a cheaper safe with a smaller usable interior may not actually be the better value." },
        { subheading: "Understand the Security Level You're Paying For", note: "Budget safes generally use privacy-level locks rather than serious burglary deterrence; confirm this matches your actual security needs before buying on price alone." },
        { subheading: "Check Warranty and Return Practicality", note: "Confirm the return policy and any stated warranty before ordering, especially for heavier items where return shipping cost could offset the low purchase price." },
      ];
    case "key":
      return [
        { subheading: "Verify Whether the Key Controls a Simple Latch or Real Bolts", note: `Check whether ${K}'s key operates a basic latch or engages multiple locking bolts, since these offer very different levels of physical security despite both being "key lock" designs.` },
        { subheading: "Plan Spare Key Storage Away From the Safe", note: "Store the included spare key somewhere other than inside or right next to the safe itself, since keeping both keys together defeats the point of a backup." },
        { subheading: "Understand Replacement-Key Support", note: "Check whether the manufacturer offers replacement keys by serial or lock-cylinder number if the originals are lost, since a key-only safe with no replacement path may need a locksmith or full lock replacement." },
        { subheading: "Verify Fire Evidence Independently of the Lock Type", note: "A key lock is a battery-free convenience, not a fire-protection feature; check the fire classification separately." },
        { subheading: "Weigh Security Limits for Portable Key-Lock Models", note: "A portable chest with a key lock deters casual access, not a determined thief who can simply carry the whole box away; anchor stationary key-lock safes if genuine security matters." },
      ];
    case "drawer":
      return [
        { subheading: "Verify the Exact Drawer Model's Fire Evidence", note: `Check ${K}'s specific fire classification, since drawer and file-style fireproof storage is tested differently than a swing-door safe and shouldn't be assumed equivalent.` },
        { subheading: "Publish Letter/Legal Filing Direction and Dimensions", note: "Confirm whether the drawer supports letter, legal, or both, and in what orientation, since drawer-style storage handles filing direction differently than a box or chest." },
        { subheading: "Check Full-Extension Slides and Anti-Tip Behavior", note: "Test whether the drawer extends fully for real access and whether an anti-tip mechanism prevents the whole unit from tipping forward when loaded and open." },
        { subheading: "Map Which Drawers Actually Lock", note: "In multi-drawer designs, confirm which specific drawers lock and whether all drawers share one lock or have independent access control." },
        { subheading: "Measure Operator Aisle With the Drawer Fully Open", note: "Check the clearance needed in front of the safe with the drawer at full extension, not just the closed footprint, before planning where it will sit." },
      ];
    case "portable":
      return [
        { subheading: "Set a Maximum Loaded Carry-Weight Threshold", note: `Test ${K} loaded with real documents and valuables, not empty, since a manageable empty weight can become genuinely difficult to carry once packed.` },
        { subheading: "Inspect the Handle Under Repeated Carrying", note: "Check handle and hinge durability specifically, since portable safes get picked up and moved far more often than stationary models." },
        { subheading: "Verify Fire and Water Claims Independently", note: "Confirm the specific fire duration and, separately, any water-resistance claim, rather than assuming a portable design has weaker protection by default." },
        { subheading: "Measure Real Document and Media Fit", note: "Check actual interior dimensions against your documents and media, since portable safes tend to have less usable interior relative to exterior size than stationary models." },
        { subheading: "Understand the Mobility-vs-Theft Tradeoff", note: "A safe designed to be carried is also a safe a thief can carry away; if it will stay in one place, check whether it includes a tether or anchor option despite its portable design." },
      ];
    case "heavyduty":
      return [
        { subheading: "Require Fire Evidence Before Crediting Heavy Construction", note: `Verify ${K}'s documented fire classification directly, since a heavy steel body alone doesn't establish any specific fire duration.` },
        { subheading: "Publish Steel Gauge, Bolt Count, and Hinge Design", note: "Check the specific steel thickness, number and diameter of locking bolts, and hinge construction, rather than trusting a general 'heavy duty' label." },
        { subheading: "Weigh Theft Deterrence Against Installation Burden", note: "A heavier safe is harder to carry off, but also harder to deliver, position, and potentially move again later; weigh both sides of that tradeoff." },
        { subheading: "Verify Anchoring and Floor Suitability", note: "Confirm the floor can support the safe's weight and that anchoring hardware and instructions are included if you plan to bolt it down." },
        { subheading: "Avoid Assuming Burglary Certification", note: "Heavy-duty construction is not the same as an independently tested burglary rating; don't assume one implies the other unless it's explicitly documented." },
      ];
    case "office":
      return [
        { subheading: "Inventory Records, Media, and Cash Separately", note: `Separate what ${K} actually needs to hold, paper records, digital media, and cash, since office safes often need to accommodate all three with different organizational needs.` },
        { subheading: "Define Shared Key or Code Administration", note: "For a safe multiple employees access, decide in advance who controls the code or key and how it's changed when staff turn over." },
        { subheading: "Verify Fire and Water Evidence Independently", note: "Check both the fire classification and any water-resistance claim specifically, since office records often include both paper and digital backups." },
        { subheading: "Check Floor Loading and Delivery Logistics", note: "Larger office safes may require freight delivery and floor-load verification, especially on upper floors of a commercial building." },
        { subheading: "Keep Off-Site or Cloud Copies of Critical Records", note: "For records the business genuinely can't lose, maintain an off-site or cloud backup in addition to the physical safe." },
      ];
    case "ul":
      return [
        { subheading: "Require Exact-Model UL Classification Evidence", note: `Check that ${K}'s UL classification is documented for the exact model, not inferred from a generic UL logo or a related product in the same line.` },
        { subheading: "Publish the Fire Time and Test Temperature Together", note: "UL fire endurance tests specify both a duration and a furnace temperature; check that the listing states both, since either figure alone is incomplete." },
        { subheading: "Verify Protected-Content Scope", note: "Check whether the UL rating covers paper documents only, or also digital media, since these are sometimes classified separately even under the same UL program." },
        { subheading: "Separate Impact and Explosion Claims From Basic Endurance", note: "Some models add drop or impact testing beyond basic fire endurance; treat this as an additional, separate claim rather than assuming all UL-classified safes include it." },
        { subheading: "Link the Model Number to Official Documentation", note: "Cross-check the exact model number against UL's own database or the manufacturer's documentation where possible, rather than relying solely on the product listing's claim." },
      ];
    case "capacity":
      return [
        { subheading: "Use a Stated Tolerance Around the Target Capacity", note: `Require documentation close to ${K}'s advertised cubic-foot figure rather than assuming every listing hits the exact number precisely.` },
        { subheading: "Publish Interior Height, Width, and Depth", note: "Check actual interior dimensions so the nominal volume figure can be verified, since insulation thickness varies between models even at similar advertised capacity." },
        { subheading: "Measure Clear Door Opening and Shelf Intrusion", note: "Confirm how much the door opening and any fixed shelving reduce genuinely usable space versus the raw interior volume." },
        { subheading: "Compare Exterior Footprint and Weight Per Cubic Foot", note: "Two safes with the same nominal capacity can have meaningfully different exterior footprints and weights depending on wall thickness and construction." },
        { subheading: "Verify Fire Evidence for Every Capacity-Qualified Product", note: "A specific capacity size doesn't guarantee a specific fire rating; check the fire classification independently for each model at this size." },
      ];
  }
  return [
    { subheading: "Require Independent Fire Evidence", note: `Verify ${K}'s fire classification is backed by an independent test (UL, ETL) rather than accepting a manufacturer's own unverified claim.` },
    { subheading: "Check Time and Temperature Together", note: "A fire rating means little without both the duration and the test temperature stated together." },
    { subheading: "Verify Usable Interior Dimensions", note: "Check actual interior space rather than trusting the nominal capacity figure alone." },
    { subheading: "Separate Water and Security Claims", note: "Treat fire, water, and burglary protection as three separate facts, never assumed from one another." },
    { subheading: "Weigh Ownership Details", note: "Factor in weight, anchoring, and lock or key replacement support as part of the real cost of ownership." },
  ];
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "home":
      return [
        { q: `How big of a ${K} do I actually need?`, a: "Start with an inventory of what you'd actually store: passports, deeds, a few external drives, maybe some jewelry, then check interior dimensions against that list rather than picking a size based on price alone." },
        { q: "Is a fireproof safe for home worth it if I already back up digital copies?", a: "Yes for physical originals like passports, deeds, and birth certificates that can't simply be re-printed from a backup; digital backups protect information, a physical safe protects the irreplaceable original document itself." },
      ];
    case "documents":
      return [
        { q: `Do I need to fold documents to fit in a ${K}?`, a: "It depends on interior depth; some document safes lay letter-size paper flat while more compact chests require folding. Check the stated interior dimensions against your actual folder sizes before assuming either way." },
        { q: "Are digital media (USB drives, CDs) protected the same way as paper documents?", a: "Not automatically. Digital media has a lower heat tolerance than paper, so many safes carry a separate, often shorter-duration ETL verification specifically for digital media alongside the main paper-document fire rating." },
      ];
    case "box":
      return [
        { q: `Is a ${K} as secure as a full-size safe?`, a: "Generally no. A chest-style box typically uses a simpler key or latch lock and lighter construction than a bolted-down safe, trading some security for portability and lower cost." },
        { q: "Can a fireproof box be anchored to prevent theft?", a: "Some models include bolt-down hardware, but many chest-style boxes are designed purely for portability and don't include anchoring points; check the specific listing if theft deterrence matters to you." },
      ];
    case "hour":
      return [
        { q: `Is a longer duration always better for a ${K}?`, a: "Generally yes for protection, but longer ratings also mean thicker insulation, more weight, and less usable interior space per exterior cubic foot, so match the duration to your genuine risk rather than always buying the maximum." },
        { q: "How is a fire-duration rating actually tested?", a: "Independent labs place a loaded safe in a furnace at a specified temperature for the stated duration, then check that the interior stayed below the threshold that would damage paper (typically well under 350°F even when the exterior sees 1550-1850°F)." },
      ];
    case "small":
      return [
        { q: `What actually fits inside a ${K}?`, a: "Small fireproof safes typically fit folded or letter-size documents, passports, some cash, and small jewelry; check interior dimensions specifically if you plan to store anything bulkier like binders or a laptop." },
        { q: "Is a small fireproof safe easy to steal since it's portable?", a: "Yes, that's the real tradeoff of small, portable safes: the same size that makes them convenient to hide or carry also makes them easy for a thief to simply take the whole unit. Anchor it or store it somewhere genuinely concealed if that's a concern." },
      ];
    case "large":
      return [
        { q: `How much does a ${K} typically weigh?`, a: "Large fireproof safes commonly weigh anywhere from 100 to over 300 lbs depending on capacity and fire-duration rating; always check the specific model's weight against your floor and delivery access before ordering." },
        { q: "Do large fireproof safes require professional installation?", a: "Not always required, but professional delivery and placement is strongly recommended for anything over roughly 150 lbs, both for safety and to avoid floor or stairwell damage during the move." },
      ];
    case "cash":
      return [
        { q: `Is a ${K} rated for burglary protection or just fire?`, a: "Check independently. Many fireproof safes marketed for cash storage have real physical security features like solid bolts and steel construction, but formal burglary-rated (UL RSC or higher) testing is a separate, less common certification." },
        { q: "Should a cash safe be anchored even if it's not very heavy?", a: "Yes, especially for cash. A lighter safe that isn't bolted down can simply be carried away by a thief regardless of its lock quality, so anchoring hardware matters more for cash storage than for document-only safes." },
      ];
    case "combination":
      return [
        { q: `What happens if I forget the combination on a ${K}?`, a: "Most combination safes include an emergency override key for exactly this situation; if that key is also lost, you'll likely need a professional locksmith, since mechanical combination locks generally can't be reset without one." },
        { q: "Are combination locks more reliable than digital keypads long-term?", a: "Mechanical combination locks have no battery to fail, which is a real long-term reliability advantage, though they're typically slower to operate day-to-day than a digital keypad." },
      ];
    case "waterproof":
      return [
        { q: `How deep of water can a ${K} actually handle?`, a: "This varies significantly by model, from a few inches for a limited period up to full submersion for 24 to 72 hours on premium models; check the specific depth and duration figures rather than trusting the word 'waterproof' alone." },
        { q: "Can I open a waterproof safe immediately after flood exposure?", a: "It's generally safer to let the safe sit and drain before opening if it's been submerged, and to dry contents carefully afterward; check the manufacturer's specific post-flood handling guidance if available." },
      ];
    case "digital":
      return [
        { q: `What batteries does a ${K} typically need?`, a: "Most digital fireproof safes use standard AA batteries, commonly 4 of them, and many include a low-battery warning light or sound before they fully die; check whether batteries are included or need to be purchased separately." },
        { q: "What happens if the batteries die and I don't have a spare key?", a: "Most digital safes with this risk include an external battery port or connector that lets you power the keypad temporarily from an outside battery pack to unlock and replace the internal batteries." },
      ];
    case "jewelry":
      return [
        { q: `Will storing jewelry in a ${K} cause tarnishing?`, a: "Sealed environments can trap humidity that accelerates tarnish on silver and some metals; airing the safe out periodically or adding a silica gel or anti-tarnish packet helps mitigate this for long-term storage." },
        { q: "Do fireproof safes include dedicated jewelry trays?", a: "Some do, particularly models marketed toward valuables, while many general-purpose fireproof safes just include a flat shelf; check the specific listing if a soft-lined jewelry tray matters to you." },
      ];
    case "brand":
      return [
        { q: `Are all ${K} products fire-rated, or just some?`, a: "Check each specific model individually. Established brands in this category typically sell both fire-resistant safes and purely security-focused (non-fire-rated) products side by side under the same name." },
        { q: "Does buying a well-known brand guarantee better fire protection than a generic safe?", a: "Not automatically, though established brands more often publish independent UL or ETL evidence for their fire-rated models. Always check the specific classification rather than relying on brand name alone." },
      ];
    case "budget":
      return [
        { q: `Are budget fireproof safes genuinely fire-tested, or just marketed that way?`, a: "It varies significantly. Some budget models carry genuine UL or ETL classifications at a lower price point, while others use 'fireproof' or 'fire-resistant' language without independent backing; check for a specific documented rating before trusting the claim." },
        { q: "What am I giving up by buying the cheapest fireproof safe available?", a: "Typically usable interior space, bolt count and steel thickness, warranty length, and sometimes independent fire-test documentation; compare these specifics rather than price alone." },
      ];
    case "key":
      return [
        { q: `How many keys come with a ${K}?`, a: "Most key-lock fireproof safes include 2 keys as standard, one for daily use and one spare; check the specific listing since this can vary by model." },
        { q: "What if I lose both keys to my fireproof safe?", a: "Options depend on the model: some manufacturers offer replacement keys by serial or lock-cylinder number, while others may require drilling the lock or professional locksmith service. Check the manufacturer's stated replacement-key policy before you need it." },
      ];
    case "drawer":
      return [
        { q: `Can a ${K} hold both letter and legal-size files?`, a: "Check the specific listing, since drawer-style fireproof storage varies in filing orientation and dimension; some support both sizes while others are sized for one or the other specifically." },
        { q: "Do fireproof file drawers need an anti-tip feature?", a: "Yes, if the unit is tall or top-heavy; a loaded top drawer opened without anti-tip protection can cause the whole unit to tip forward, so check for this feature on any multi-drawer fireproof storage." },
      ];
    case "portable":
      return [
        { q: `How heavy does a ${K} get once it's actually loaded?`, a: "This depends heavily on what you store, but even a modest stack of documents plus a laptop or hard drives can add meaningful weight to a safe that felt light empty; check the safe's own weight and add a realistic estimate of your contents." },
        { q: "Is a portable fireproof safe as secure as a stationary one?", a: "Generally no. The same portability that makes it easy to grab during an evacuation also makes it easier for a thief to carry off; portable safes trade some security for mobility, which is a reasonable tradeoff for some use cases but not others." },
      ];
    case "heavyduty":
      return [
        { q: `Does "heavy duty" mean a ${K} is burglary-rated?`, a: "Not automatically. Heavy-duty construction (thick steel, multiple bolts) improves real-world forced-entry resistance, but a formal independent burglary rating (like UL RSC) is a separate, specific certification that not all heavy-duty safes carry." },
        { q: "Is a heavier fireproof safe always better protection?", a: "Weight helps deter casual theft and can indicate thicker steel, but it doesn't by itself establish a fire rating or verified burglary resistance; check both of those specifically rather than judging by weight alone." },
      ];
    case "office":
      return [
        { q: `Should an office ${K} use a shared code or individual employee codes?`, a: "It depends on your access-control needs; a single shared code is simpler but harder to audit, while individual codes (on models that support multiple users) let you track and revoke access per employee." },
        { q: "Do office fireproof safes need to be bolted down?", a: "Strongly recommended for anything storing cash, checks, or sensitive records, since an unanchored safe in a semi-public office space is more vulnerable to being carried out than one in a private home." },
      ];
    case "ul":
      return [
        { q: `Is a ${K} rating the same as a general fireproof claim?`, a: "No, a specific UL classification is a documented, independently tested standard tied to an exact model, time, and temperature, meaningfully stronger evidence than a general 'fireproof' or 'fire-resistant' marketing claim." },
        { q: "Where can I verify a safe's UL classification independently?", a: "Check UL's own online certification directory using the model number where possible, or request documentation directly from the manufacturer, rather than relying solely on the product listing's stated claim." },
      ];
    case "capacity":
      return [
        { q: `Does the cubic-foot number on a ${K} include the door and shelving space?`, a: "Nominal cubic-foot figures are typically based on the full interior cavity before subtracting shelving or door-hardware intrusion, so real usable space is somewhat less than the advertised number." },
        { q: "How much does fire insulation reduce usable interior space?", a: "It varies by model and fire-duration rating, but insulation commonly accounts for a meaningful share of the difference between a safe's exterior footprint and its interior capacity, more so on longer-duration (1-2 hour) models than on lighter 30-minute chests." },
      ];
    default:
      return [
        { q: `Is a ${K} genuinely fireproof, or just fire-resistant?`, a: "No consumer safe is immune to fire indefinitely; every rated model protects for a specific duration and temperature, after which contents are no longer guaranteed safe. 'Fire-resistant' with a documented rating is the more accurate framing than 'fireproof.'" },
        { q: `What should I check before buying a ${K}?`, a: "Verify the independent fire classification (time and temperature), check usable interior dimensions rather than nominal capacity, and confirm water resistance and physical security as separate facts rather than assuming any one claim covers the others." },
      ];
  }
}

const articleMeta = {};
const slugTitleMap = {};
for (const a of articles) {
  const slug = slugify(a.title);
  slugTitleMap[slug] = a.title;
}

for (const a of articles) {
  const slug = slugify(a.title);
  const kw = mainKeywordFor(a.title);
  const cat = classify(a.title);
  const count = a.asins.length;
  const badges = a.asins.map((_, i) => badgeFor(i, count));
  const picksRaw = a.asins.map((asin, i) => pick(asin, badges[i]));
  const picks = picksRaw.filter(Boolean);
  picks.forEach((p, i) => { p.badge = badgeFor(i, picks.length); });

  const intro = buildIntro(cat, kw, a.title, a.num);

  const howToChoose = buildHowToChoose(cat, kw);
  const bespoke = buildBespokeFaq(cat, kw);
  const faq = fillFaq(bespoke, 5);

  const metaTitle = `${a.title} 2026`;
  const metaDescription = `We compared ${kw} by independent fire evidence, usable interior capacity, and separately verified water and security claims rather than ranking by brand or price alone.`;

  articleMeta[slug] = {
    title: `${count >= 4 ? count : ""} Best ${a.title.replace(/^Best\s+/i, "")} in 2026`.replace(/^\s+/, ""),
    metaTitle, metaDescription, mainKeyword: kw,
    intro, picks, howToChoose, faq, related: [], _cat: cat, _num: a.num,
  };
}

const allSlugs = Object.keys(articleMeta);
for (const slug of allSlugs) {
  const meta = articleMeta[slug];
  const sameCat = allSlugs.filter((s) => s !== slug && articleMeta[s]._cat === meta._cat);
  const pool = sameCat.length >= 3 ? sameCat : [...sameCat, ...allSlugs.filter((s) => s !== slug && !sameCat.includes(s))];
  meta.related = pool.slice(0, 3);
}

const SKIP_SLUGS = new Set(["best-small-fireproof-safes"]);

let written = 0;
for (const [slug, meta] of Object.entries(articleMeta)) {
  if (SKIP_SLUGS.has(slug)) { console.log("SKIPPING existing slug", slug); continue; }
  const { title, metaTitle, metaDescription, mainKeyword, intro, picks, howToChoose, faq, related } = meta;
  if (picks.length === 0) { console.log("NO VALID PICKS FOR", slug); continue; }
  picks.forEach((p) => { p.bestFor = `buyers prioritizing ${(p.specs[0] || "this pick's strengths").toLowerCase()}`; });

  const productsCode = picks.map((p, i) => `  {
    id: "${slug}-${i + 1}",
    rank: ${i + 1},
    badge: "${p.badge}",
    name: ${JSON.stringify(p.name)},
    price: ${JSON.stringify(p.price)},
    rating: ${p.rating ?? "null"},
    reviews: ${p.reviews ?? "null"},
    imageUrl: ${JSON.stringify(p.imageUrl)},
    amazonUrl: ${JSON.stringify(p.amazonUrl)},
    description: ${JSON.stringify(p.description)},
    specs: ${JSON.stringify(p.specs)},
    pros: ${JSON.stringify(p.pros)},
    cons: ${JSON.stringify(p.cons)},
    bestFor: ${JSON.stringify(p.bestFor)},
  }`).join(",\n");

  const content = `export const guideSlug = "${slug}";
export const guideTitle = ${JSON.stringify(title)};
export const metaTitle = ${JSON.stringify(metaTitle)};
export const metaDescription = ${JSON.stringify(metaDescription)};
export const mainKeyword = ${JSON.stringify(mainKeyword)};
export const introParagraphs = ${JSON.stringify(intro, null, 2)};
export const lastUpdated = "2026-08-16";
export const readTime = "${Math.max(6, Math.ceil(picks.length * 1.3))} min";
export const heroImage = ${JSON.stringify(picks[0].imageUrl)};

export interface GuideProduct {
  id: string; rank: number; badge: string; name: string; price: string; rating: number | null; reviews: number | null;
  imageUrl: string; amazonUrl: string; description: string; specs: string[]; pros: string[]; cons: string[]; bestFor: string;
}

export const products: GuideProduct[] = [
${productsCode}
];

export const howWeEvaluated = ${JSON.stringify(howWeEvaluatedDefault, null, 2)};

export interface HowToChooseSection {
  subheading: string;
  intro?: string;
  table?: { headers: string[]; rows: string[][] };
  cards?: { label: string; text: string }[];
  note?: string;
}

export const howToChoose: HowToChooseSection[] = ${JSON.stringify(howToChoose, null, 2)};

export const buyingCriteria = ${JSON.stringify(howToChoose.map(h => bc(h.subheading, h.note)), null, 2)};

export const faq = ${JSON.stringify(faq.map(f => ({ q: f.q, a: f.a })), null, 2)};

export const relatedGuides: { href: string; title: string }[] = ${JSON.stringify(related.map((s) => ({ href: `/guide/${s}`, title: slugTitleMap[s] ? `Best ${slugTitleMap[s].replace(/^Best\s+/i, "")} in 2026` : s })))};
`;
  fs.writeFileSync(`data/guides/${slug}.ts`, content);
  written++;
}

fs.writeFileSync("scripts/_firesafe_slug_list.txt", allSlugs.filter((s) => !SKIP_SLUGS.has(s)).join(" "));
console.log(`wrote ${written} guide files`);
