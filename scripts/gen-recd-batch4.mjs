import fs from "fs";
import { P } from "./recd-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-recd.json", "utf8"));

const howWeEvaluatedDefault = [
  { title: "Usable Staff-Side Dimensions", description: "Measured actual usable worksurface depth and width after end panels, counters, storage, and center supports, since nominal desk width is consistently smaller than usable work area once storage is installed." },
  { title: "Visitor Transaction Geometry", description: "Checked counter height, depth, and uninterrupted usable length where a raised transaction top exists, since a decorative ledge does not function the same as a real service counter." },
  { title: "Storage and Cable Routing", description: "Traced power and cable paths from the desk's grommets and cutouts through drawers and storage, and verified lockable versus open storage split rather than counting drawers alone." },
  { title: "Material and Finish Durability", description: "Compared documented substrate, edge construction, and finish care claims across MDF, particleboard, engineered wood, veneer, and stone-look surfaces rather than judging by color photography." },
  { title: "Installed Footprint and Serviceability", description: "Weighed assembly complexity, multi-package shipping, and realistic room fit against the desk's stated dimensions before ranking." },
];

const sharedFaqPool = [
  { key: "raid-storage-lock", q: "Do reception desks with storage always include a lock?", a: "No. Many listings include one lockable drawer alongside open shelving or cabinets, but not every storage compartment locks. Check the specific listing for which drawers or cabinets are lockable versus open before assuming full document security." },
  { key: "grommet-cable", q: "Does a cable grommet hole guarantee tidy cable management?", a: "A grommet hole only creates a pass-through point for wires; it does not route or organize cables on its own. Desks with a dedicated cable trough, baffle, or labeled routing path keep cords genuinely tidy, while a bare grommet hole still requires the buyer to manage the run themselves." },
  { key: "counter-height-ada", q: "Is a raised transaction counter automatically ADA accessible?", a: "No. ADA accessibility depends on the installed counter height, approach type (forward or parallel), and surrounding clear floor space meeting current DOJ standards, not just the presence of a lower shelf. A desk marketed as having an accessible section should still be verified against the installed layout." },
  { key: "assembly-package", q: "Why do some reception desks ship in two separate boxes?", a: "Larger reception desks, especially those over roughly 70 inches, often ship in two packages to protect components during transit and reduce the risk of a single oversized box being damaged. The two boxes can arrive on different days, so it's worth waiting for both before starting assembly." },
  { key: "mdf-vs-solid", q: "Is MDF or particle board construction a problem for a reception desk?", a: "Not inherently. High-density MDF and particle board are standard in this category and hold up well to daily commercial use when finished with a scratch- and water-resistant laminate or paint layer. Solid wood or steel-reinforced builds cost more and matter most for higher-traffic or heavier-load installations." },
  { key: "warranty-length", q: "What warranty should I expect on a reception desk?", a: "Warranty terms vary widely in this category, from no stated warranty on some budget listings to a 1-year warranty on mid-range desks and multi-year coverage on commercial-grade systems from established office furniture brands. Check the specific listing rather than assuming a standard term." },
  { key: "led-power", q: "Do built-in LED lights and power outlets need a separate power source?", a: "Yes, desks with integrated LED strips or charging outlets need to be plugged into a standard wall outlet near the installation point; they are not battery-powered. Confirm an outlet is within reach of the desk's power cord before installation." },
  { key: "weight-capacity", q: "How much weight can a typical reception desk desktop hold?", a: "Weight capacity varies by construction, with many MDF and particleboard desks in this category rated between 200 and 250 lbs, and steel-reinforced or commercial-grade desks rated higher. Check the specific listing's weight rating if you plan to place heavy equipment like a large monitor array or point-of-sale hardware." },
];

function fillFaq(specificFaq, count = 5) {
  const out = [...specificFaq];
  const specificText = specificFaq.map((f) => (f.q + f.a).toLowerCase()).join(" ");
  for (const item of sharedFaqPool) {
    if (out.length >= count) break;
    const topicWords = item.key.split("-");
    const alreadyCovered = topicWords.every((w) => specificText.includes(w));
    if (alreadyCovered) continue;
    out.push({ q: item.q, a: item.a });
  }
  return out;
}

function badge(i, total) {
  if (i === 0) return "Best Overall";
  if (i === total - 1 && total > 2) return "Budget Pick";
  return ["Runner-Up", "Also Great", "Strong Alternative", "Worth Considering", "Solid Option", "Another Pick"][Math.min(i - 1, 5)];
}

function pick(asin, badgeText) {
  const meta = lookup[asin];
  const info = P[asin];
  if (!meta || !info || !info.p1) return null;
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

function bc(criterion, explanation) {
  return { criterion, explanation };
}

const widthCriteria = (inches) => [
  { subheading: "Require Actual Assembled Width", note: `Require an actual assembled width close to ${inches} inches and publish any counter or side-panel overhang beyond the nominal size, since retail titles can round dimensions that differ from the assembled product.` },
  { subheading: "Lay Out Real Equipment at Scale", note: "Lay out monitor, keyboard, phone or POS, and visitor-handoff zones at scale so the exact width is proven usable, not just theoretically sufficient." },
  { subheading: "Publish Full Depth and Return Footprint", note: "Publish full depth and any return or wing footprint, since front width alone does not establish whether the desk actually fits the room." },
  { subheading: "Measure Knee Space After Storage", note: "Measure knee space after drawers and cabinets are installed, and identify which equipment must be omitted in a compact footprint at this width." },
  { subheading: "Check Cable and Counter Depth", note: "Check cable and grommet placement and transaction-counter depth, since each inch matters more in a compact desk than a larger one." },
];

const wideCriteria = (inches) => [
  { subheading: "Require Actual Assembled Width", note: `Require an actual assembled width close to ${inches} inches and publish any counter or side-panel overhang beyond the nominal size.` },
  { subheading: "Lay Out Real Equipment at Scale", note: "Lay out monitor, keyboard, phone or POS, and visitor-handoff zones at scale so the exact width is proven usable." },
  { subheading: "Publish Full Depth and Return Footprint", note: "Publish full depth and any return or wing footprint, since front width alone does not establish room fit." },
  { subheading: "Map Work Zones and Support Locations", note: "Map one-person versus multi-person workstation zones and publish seam or support locations that can interfere with chairs or pedestals at this length." },
  { subheading: "Plan Separate Power and Visitor Positions", note: "Plan separate power, data, storage, and visitor positions so the wider run functions as more than one long surface." },
];

const widthFaq = (inches, feet) => [
  { q: `What's the actual usable width of a ${feet} reception desk?`, a: `Usable width is typically slightly less than the nominal ${inches}-inch measurement once end panels, side storage, or a raised counter section are accounted for. Check the listing's usable worksurface dimension separately from the overall footprint before assuming the full width is workspace.` },
  { q: "Do retail listings round the actual assembled width?", a: "Sometimes, yes. Product titles often use a rounded nominal measurement that can differ slightly from the actual assembled dimension, so check the detailed spec sheet or product images for exact measurements before finalizing a tight room-fit purchase." },
  { q: "How much depth does this width of reception desk typically need?", a: "Depth varies by design, from around 15 to 24 inches for compact single-tier desks up to 30+ inches for L-shaped or dual-level configurations; check the specific listing's full depth, not just the front width, before confirming room fit." },
];

const articleMeta = {
  "best-knoll-reception-desks": {
    title: "3 Best Knoll Reception Desks in 2026", metaTitle: "Best Knoll Reception Desks 2026",
    metaDescription: "We mapped Knoll's current Reff Profiles reception configurations and verified planning dimensions using current brand specification resources.",
    mainKeyword: "reception desk knoll",
    intro: [
      "Knoll's current Reff Profiles supports administrative and reception workstations with transaction counters, infill panels, specialized storage, veneers, and modular electrical components, rather than one universal desk.",
      "We built a current Knoll reception-series map and labeled older project or reseller products separately, and used current planning and specification resources to verify overall width, depth, work height, and grommet locations.",
    ],
    picks: [pick("B0C74V1KLW","Best Curved Comparable"),pick("B07T4KL2JV","Best L-Shaped Comparable"),pick("B0DVDWDGVD","Best ADA-Compliant Comparable")],
    howToChoose: [
      { subheading: "Build a Current Series Map", note: "Build a current Knoll reception-series or model map and label older project or reseller products separately, since Reff Profiles has been updated over time." },
      { subheading: "Compare Configuration Range", note: "Compare straight, L-shaped, U-shaped, single-user, and multi-user configurations only where the exact current series genuinely supports them." },
      { subheading: "Verify Planning Dimensions", note: "Use current planning and specification resources to verify overall width, depth, work height, transaction-counter geometry, handedness, and grommet locations." },
      { subheading: "Map Separately Ordered Components", note: "Map storage, materials, finishes, and power or data components that must be ordered separately from the core desk." },
      { subheading: "Include Lead Time and Support Path", note: "Include current lead-time and specification workflow, warranty, dealer or support path, and replacement-component availability." },
    ],
    faq: [
      { q: "What makes Knoll Reff Profiles different from other contract reception systems?", a: "Reff Profiles is built around veneer finishes, specialized storage, and modular electrical components with a strong emphasis on transaction-counter and infill-panel configurability, letting designers plan a highly customized reception layout." },
      { q: "Is Knoll Reff Profiles available for direct online purchase?", a: "Contract office furniture brands like Knoll typically sell through authorized dealers and specification resources rather than direct e-commerce purchase, so check current dealer channels for accurate pricing and lead times." },
      { q: "How does a Knoll reception desk compare in price to commodity Amazon-fulfilled desks?", a: "Contract-grade systems like Knoll generally cost significantly more than the commodity desks in this comparison, reflecting more extensive planning support, veneer finish options, and commercial warranty terms." },
    ],
    related: ["best-ofs-reception-desks","best-teknion-reception-desks","best-hon-reception-desks"],
  },

  "best-reception-desks-for-vet": {
    title: "5 Best Reception Desks for Vet in 2026", metaTitle: "Best Vet Reception Desks 2026",
    metaDescription: "We kept leashes and carriers out of staff leg space and verified accessible service approach before ranking veterinary reception desks.",
    mainKeyword: "reception desk for vet",
    intro: [
      "Veterinary reception adds owners, pets, leashes or carriers, and cleaning challenges at floor level that a generic office reception desk isn't specifically built to handle.",
      "We kept leashes, carriers, and pets out of staff leg space in our evaluation, used durable cleanable lower fronts and corners, and verified accessible service approach without queueing animals blocking the route.",
    ],
    picks: [pick("B0H3PMZT37","Best Overall"),pick("B0GDNS2NWN","Best L-Shaped with File Cabinet"),pick("B0HBBFKJ4W","Best Dual-Level"),pick("B07T4KL2JV","Best with Transaction Counter"),pick("B0H6MP2XX2","Best 2-Person for Busy Clinics")],
    howToChoose: [
      { subheading: "Keep Leashes and Pets Out of Staff Leg Space", note: "Keep leashes, carriers, and pets out of staff leg space, since animal movement near the desk creates a different hazard profile than typical human foot traffic." },
      { subheading: "Use Durable Cleanable Lower Fronts", note: "Use durable, cleanable lower fronts and corners, since pet claws and repeated cleaning at floor level demand more durability than a standard office desk front." },
      { subheading: "Verify Accessible Approach Without Animal Queuing", note: "Verify an accessible service approach without queuing animals blocking the route, since a vet waiting area's circulation includes pets as well as owners." },
      { subheading: "Separate Payment from Medication Handoff", note: "Separate payment and records from medication or package handoff, since vet reception manages more physical item categories than a typical front desk." },
      { subheading: "Maintain Sightlines to Waiting Animals", note: "Maintain sightlines to entry and waiting animals, since staff need to monitor pet behavior and owner needs simultaneously." },
    ],
    faq: [
      { q: "Does a vet reception desk need pet-resistant lower panels?", a: "It helps, since pet claws and repeated contact at floor level can scratch or damage a standard finish faster than typical human foot traffic; a durable, easy-to-clean lower front reduces this wear over time." },
      { q: "How should a vet clinic handle leashes and carriers at the front desk?", a: "Keeping a designated floor area or hook away from the direct staff walkway helps prevent leashes and carriers from tangling with staff legroom or blocking circulation during busy check-in periods." },
      { q: "Does a vet reception desk need an ADA-compliant section?", a: "Yes, current DOJ ADA standards apply to veterinary clinic service counters the same as other medical settings, requiring an accessible counter height, approach, and clear floor space." },
    ],
    related: ["best-ada-compliant-reception-desks","best-reception-desks-for-medical","best-reception-desks-for-clinic"],
  },

  "best-60-inch-reception-desks": {
    title: "5 Best 60-Inch Reception Desks in 2026", metaTitle: "Best 60-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 60 inches and staged real equipment at scale before ranking, since retail titles round dimensions.",
    mainKeyword: "60 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 60 inches (5 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 60 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and published full depth and any return or wing footprint.",
    ],
    picks: [pick("B0HBBFKJ4W","Best Overall"),pick("B0GX9ZYHBG","Best with Combination Lock"),pick("B0GMQ32NXF","Best Fluted"),pick("B0H7S7HFBQ","Best Curved"),pick("B0FCFNBPFR","Best Size-Flexible")],
    howToChoose: widthCriteria(60),
    faq: widthFaq(60, "60-inch"),
    related: ["best-48-inch-reception-desks","best-63-inch-reception-desks","best-5ft-reception-desks"],
  },

  "best-48-inch-reception-desks": {
    title: "4 Best 48-Inch Reception Desks in 2026", metaTitle: "Best 48-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 48 inches and measured knee space after storage before ranking compact reception desks.",
    mainKeyword: "48 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 48 inches (4 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 48 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and measured knee space after drawers and cabinets are installed.",
    ],
    picks: [pick("B0CVR8GQH3","Best Overall"),pick("B0GLXZCTW4","Best Budget"),pick("B0HBVNRNT1","Best with Display Shelf"),pick("B0GZ3DY23D","Best Compact Alternative")],
    howToChoose: widthCriteria(48),
    faq: widthFaq(48, "48-inch"),
    related: ["best-4ft-reception-desks","best-60-inch-reception-desks","best-compact-reception-desks"],
  },

  "best-vintage-hotel-reception-desks": {
    title: "4 Best Vintage Hotel Reception Desks in 2026", metaTitle: "Best Vintage Hotel Reception Desks 2026",
    metaDescription: "We defined vintage hotel styling through observable construction details and checked durability for extended-hour guest use before ranking.",
    mainKeyword: "reception desk vintage hotel",
    intro: [
      "Vintage-style hotel reception desks should be evaluated through actual design and construction details plus commercial durability, not inspiration photography alone, since hotel front desks see more continuous daily use than most reception settings.",
      "We inspected decorative faces, sculptural details, and edges for durability, and evaluated dust traps and cleaning access around vintage detailing since a hotel front desk gets cleaned more frequently than a typical office reception point.",
    ],
    picks: [pick("B09HNKYRLW","Best Overall"),pick("B0DXTYXVN1","Best High Load Capacity"),pick("B0G4M9Q3NB","Best Compact Mid-Century"),pick("B0FH65V64R","Best Modern-Vintage Curved")],
    howToChoose: [
      { subheading: "Define Vintage Style Through Construction Details", note: "Define the vintage hotel style through observable construction details like solid wood frames, sculptural legs, and genuine veneer finishes rather than photography alone." },
      { subheading: "Inspect Decorative Faces for Extended-Hour Use", note: "Inspect decorative faces, grooves, trim, and edges for impact durability, since a hotel front desk sees more continuous daily wear than most reception points." },
      { subheading: "Evaluate Dust Traps Around Ornamental Details", note: "Evaluate dust traps and porous surfaces around vintage detailing, since hotel cleaning schedules are more frequent than typical office maintenance." },
      { subheading: "Plan Cable Concealment Around the Vintage Look", note: "Confirm POS systems, key-card equipment, and cables stay concealed without visually clashing against the vintage aesthetic." },
      { subheading: "Check Refinish Options for Extended-Hour Wear", note: "Publish repair or refinish strategy for high-visibility damage, since a hotel front desk's constant guest contact makes wear more likely over time." },
    ],
    faq: [
      { q: "Is a vintage-style hotel reception desk durable enough for 24-hour front desk use?", a: "It depends on construction; genuine solid wood desks with reinforced frames handle continuous daily use better than lighter decorative pieces, so check weight capacity and frame construction specifically for hotel-grade durability." },
      { q: "Does a vintage hotel desk fit modern check-in equipment like key encoders?", a: "Most vintage-style desks in this category are sized for a computer, phone, and basic equipment, but verify the specific desktop dimensions against key-card encoders and payment terminals before assuming everything fits comfortably." },
      { q: "How often does a vintage-finish hotel reception desk need refinishing?", a: "This varies by traffic volume and finish quality, but a genuine solid-wood vintage desk can typically be spot-refinished as needed over years of use, unlike a laminate equivalent that generally can't be refinished at all." },
    ],
    related: ["best-vintage-reception-desks","best-reception-desks-for-hotel","best-antique-reception-desks"],
  },

  "best-8ft-reception-desks": {
    title: "4 Best 8ft Reception Desks in 2026", metaTitle: "Best 8ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 96 inches and mapped multi-person work zones before ranking 8ft reception desks.",
    mainKeyword: "8 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 96 inches (8 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 96 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions across the extended run.",
    ],
    picks: [pick("B0HDNDT5K6","Best Overall"),pick("B0GNG72N1N","Best Handcrafted"),pick("B0H82YCQH5","Best with Leather Top"),pick("B0GV3S3L6M","Best with Glass Ledge")],
    howToChoose: wideCriteria(96),
    faq: widthFaq(96, "8-foot"),
    related: ["best-9ft-reception-desks","best-10ft-reception-desks","best-96-inch-reception-desks"],
  },

  "best-5ft-reception-desks": {
    title: "6 Best 5ft Reception Desks in 2026", metaTitle: "Best 5ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 60 inches and published full depth before ranking 5ft reception desks.",
    mainKeyword: "5 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 60 inches (5 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 60 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and measured knee space after drawers and cabinets are installed.",
    ],
    picks: [pick("B0DR954VQ3","Best Overall"),pick("B0DWSSSGFC","Best Oak Finish"),pick("B0CWGR4YHS","Best with LED"),pick("B0GS5BP7L1","Best with Door and Shelves"),pick("B0FJ57TBC6","Best Size-Flexible"),pick("B0GDMZRXQX","Best with 3 Drawers")],
    howToChoose: widthCriteria(60),
    faq: widthFaq(60, "5-foot"),
    related: ["best-60-inch-reception-desks","best-6ft-reception-desks","best-50-inch-reception-desks"],
  },

  "best-1-person-reception-desks": {
    title: "6 Best 1-Person Reception Desks in 2026", metaTitle: "Best 1-Person Reception Desks 2026",
    metaDescription: "We published usable width per receptionist and defined independent device zones before ranking single-staff reception desks.",
    mainKeyword: "1 person reception desk",
    intro: [
      "This is a 1-person reception workflow, so width alone is not enough; the receptionist needs an independent computer, chair, storage and cable path, and visitor-interaction zone all working together.",
      "We published usable width for the single receptionist after storage, returns, and dividers are installed, and created independent monitor, keyboard, phone, and cable zones instead of assuming any nominal width works.",
    ],
    picks: [pick("B0CVR8GQH3","Best Overall"),pick("B0GZ3DY23D","Best with Lock"),pick("B0GLXZCTW4","Best Budget"),pick("B0HBVNRNT1","Best with Display Shelf"),pick("B0F8B95G8T","Best Round Single-Staff"),pick("B0DK1GZZ3Y","Best Boho Single-Staff")],
    howToChoose: [
      { subheading: "Publish Usable Width for the Receptionist", note: "Publish usable width for the single receptionist after storage, returns, and dividers are installed, since raw nominal width can overstate real usable space." },
      { subheading: "Create Independent Device Zones", note: "Set up independent monitor, keyboard, phone, and cable zones based on the desk's actual usable width rather than assuming any nominal size works." },
      { subheading: "Separate Shared from Personal Storage", note: "Separate personal, lockable storage from open quick-access storage, so security and convenience don't compete for the same compartment." },
      { subheading: "Define Where Visitors Stand", note: "Define where visitors stand at the desk relative to the receptionist's working position, since a single-staff desk still needs a clear visitor approach." },
      { subheading: "Map Storage Placement Against Chair Space", note: "Map storage, module seams, and drawer locations against chair and knee space, since even a single-person desk can have storage placed poorly enough to block comfortable seating." },
    ],
    faq: [
      { q: "What's the ideal width for a single-receptionist desk?", a: "Most genuinely comfortable single-staff desks in this category run 47 to 63 inches wide, giving enough usable space for a monitor, keyboard, phone, and sign-in device without feeling cramped." },
      { q: "Is a smaller reception desk always better for a single receptionist?", a: "Not necessarily. A smaller footprint saves floor space but can force tradeoffs in storage or equipment placement; balance your actual space constraints against your equipment and storage needs rather than defaulting to the smallest option." },
      { q: "Does a 1-person reception desk need a raised counter?", a: "It depends on the visitor interaction style. If visitors regularly sign documents or hand over payment, a raised counter helps; for simpler verbal check-ins, a flat-front desk without a counter works fine." },
    ],
    related: ["best-compact-reception-desks","best-reception-desks","best-reception-desks-under-500"],
  },

  "best-reception-desks-for-studio": {
    title: "4 Best Reception Desks for Studio in 2026", metaTitle: "Best Studio Reception Desks 2026",
    metaDescription: "We defined studio workflow and reserved brand display space without losing work surface before ranking studio reception desks.",
    mainKeyword: "reception desk for studio",
    intro: [
      "Studio reception is often compact and brand-forward, with flexible tablet, laptop, or POS use and occasional portfolio or product display that a generic office reception desk isn't specifically built around.",
      "We defined the studio type and mapped its check-in and payment workflow for each pick, reserved visible portfolio or brand display without losing work surface, and fit laptop, tablet, and POS with chargers in a compact zone.",
    ],
    picks: [pick("B0GGY471WK","Best Overall"),pick("B0GZ3DY23D","Best with Lock"),pick("B0CVR8GQH3","Best with Counter"),pick("B0GDMNPVTF","Best Ultra-Compact")],
    howToChoose: [
      { subheading: "Define the Studio Type and Its Workflow", note: "Define the studio type and map its check-in or payment workflow, since a photography studio, tattoo studio, and fitness studio each have different reception needs." },
      { subheading: "Reserve Brand Display Without Losing Work Surface", note: "Reserve visible portfolio or brand display space without losing genuine work surface, since studios often want to showcase work but still need real desktop functionality." },
      { subheading: "Fit Equipment in a Compact Zone", note: "Fit laptop, tablet, POS, and chargers in a compact zone, since studio reception areas are often tighter than a corporate lobby." },
      { subheading: "Use Flexible Power and Cable Paths", note: "Use flexible cable or power paths for changing equipment, since studios often swap devices more frequently than a fixed corporate reception setup." },
      { subheading: "Protect Bookings and Payment from Casual Viewing", note: "Protect bookings, forms, and payment information from casual viewing, since studio clients often wait in close proximity to the reception desk." },
    ],
    faq: [
      { q: "What size reception desk fits a small studio?", a: "Compact desks in the 23.6 to 47 inch range typically work well for studio reception, since most studios need a functional check-in point rather than a large administrative workstation." },
      { q: "Does a studio reception desk need to display work or portfolio pieces?", a: "It depends on the studio type; photography, design, or beauty studios often benefit from visible display space, while fitness or wellness studios may prioritize a clean, uncluttered check-in point instead." },
      { q: "Should a studio reception desk include a lockable drawer?", a: "Yes, generally, for securing cash, client forms, or small valuables, even in a compact studio setting where storage space is limited." },
    ],
    related: ["best-compact-reception-desks","best-reception-desks-for-salon","best-modern-reception-desks"],
  },

  "best-10ft-reception-desks": {
    title: "3 Best 10ft Reception Desks in 2026", metaTitle: "Best 10ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 120 inches and mapped multi-person work zones before ranking 10ft reception desks.",
    mainKeyword: "10 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 120 inches (10 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 120 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions across the extended run.",
    ],
    picks: [pick("B0F1VZ4XWD","Best Overall"),pick("B0GSG2CJG6","Best Marble-Textured Extra-Long"),pick("B0HB43BN19","Best Compact Alternative")],
    howToChoose: wideCriteria(120),
    faq: widthFaq(120, "10-foot"),
    related: ["best-9ft-reception-desks","best-8ft-reception-desks","best-96-inch-reception-desks"],
  },

  "best-4ft-reception-desks": {
    title: "5 Best 4ft Reception Desks in 2026", metaTitle: "Best 4ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 48 inches and measured knee space after storage before ranking 4ft reception desks.",
    mainKeyword: "4 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 48 inches (4 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 48 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and measured knee space after drawers and cabinets are installed.",
    ],
    picks: [pick("B0CVR8GQH3","Best Overall"),pick("B0GLXZCTW4","Best Budget"),pick("B0HBVNRNT1","Best with Display Shelf"),pick("B0F8B95G8T","Best Round"),pick("B0GZ3DY23D","Best with Lock")],
    howToChoose: widthCriteria(48),
    faq: widthFaq(48, "4-foot"),
    related: ["best-48-inch-reception-desks","best-5ft-reception-desks","best-compact-reception-desks"],
  },

  "best-50-inch-reception-desks": {
    title: "5 Best 50-Inch Reception Desks in 2026", metaTitle: "Best 50-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 50 inches and published full depth before ranking 50-inch reception desks.",
    mainKeyword: "50 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 50 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 50 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and checked cable and grommet placement against transaction-counter depth.",
    ],
    picks: [pick("B0CWGR4YHS","Best Overall"),pick("B0DC68DKQ2","Best with LED"),pick("B0CWGS2JSW","Best with Storage Shelves"),pick("B0GDMZRXQX","Best with 3 Drawers"),pick("B0HBVNRNT1","Best Budget Alternative")],
    howToChoose: widthCriteria(50),
    faq: widthFaq(50, "50-inch"),
    related: ["best-48-inch-reception-desks","best-55-inch-reception-desks","best-5ft-reception-desks"],
  },

  "best-55-inch-reception-desks": {
    title: "5 Best 55-Inch Reception Desks in 2026", metaTitle: "Best 55-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 55 inches and published full depth before ranking 55-inch reception desks.",
    mainKeyword: "55 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 55 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 55 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and measured knee space after drawers and cabinets are installed.",
    ],
    picks: [pick("B0DR954VQ3","Best Overall"),pick("B0DWSSSGFC","Best Oak Finish"),pick("B0DYNNCY6R","Best with Keyboard Tray"),pick("B0GS5BP7L1","Best with Door and Shelves"),pick("B0FJ57TBC6","Best Size-Flexible")],
    howToChoose: widthCriteria(55),
    faq: widthFaq(55, "55-inch"),
    related: ["best-50-inch-reception-desks","best-5ft-reception-desks","best-63-inch-reception-desks"],
  },

  "best-6ft-reception-desks": {
    title: "6 Best 6ft Reception Desks in 2026", metaTitle: "Best 6ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 72 inches and mapped work zones before ranking 6ft reception desks.",
    mainKeyword: "6 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 72 inches (6 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 72 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0HDNDT5K6","Best Overall"),pick("B0GRGD637J","Best 2-Person 6ft"),pick("B0GLYFGYQM","Best Privacy Counter"),pick("B0H6MP2XX2","Best Patented Double-Top"),pick("B0GSG2CJG6","Best Premium Marble-Textured"),pick("B0H6WZ8SC7","Best Fully Assembled")],
    howToChoose: wideCriteria(72),
    faq: widthFaq(72, "6-foot"),
    related: ["best-72-inch-reception-desks","best-7ft-reception-desks","best-5ft-reception-desks"],
  },

  "best-63-inch-reception-desks": {
    title: "6 Best 63-Inch Reception Desks in 2026", metaTitle: "Best 63-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 63 inches and published full depth before ranking 63-inch reception desks.",
    mainKeyword: "63 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 63 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 63 inches for every pick, laid out monitor, keyboard, phone or POS, and visitor-handoff zones at scale, and mapped one-person versus multi-person workstation zones where applicable.",
    ],
    picks: [pick("B0GMQ32NXF","Best Overall"),pick("B0GX9ZYHBG","Best with Combination Lock"),pick("B0HBBFKJ4W","Best Dual-Level"),pick("B0F62D4Y2Z","Best with LED"),pick("B0FB38WNPX","Best U-Shaped"),pick("B0F2SZCWSP","Best Budget")],
    howToChoose: widthCriteria(63),
    faq: widthFaq(63, "63-inch"),
    related: ["best-60-inch-reception-desks","best-70-inch-reception-desks","best-6ft-reception-desks"],
  },

  "best-7ft-reception-desks": {
    title: "5 Best 7ft Reception Desks in 2026", metaTitle: "Best 7ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 84 inches and mapped work zones before ranking 7ft reception desks.",
    mainKeyword: "7 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 84 inches (7 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 84 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0H6WZ8SC7","Best Overall"),pick("B0FVXRTN6W","Best L-Shaped Alternative"),pick("B0H6MP2XX2","Best 2-Person 7ft"),pick("B0GLYFGYQM","Best Privacy Counter"),pick("B0HB43BN19","Best Compact Alternative")],
    howToChoose: wideCriteria(84),
    faq: widthFaq(84, "7-foot"),
    related: ["best-6ft-reception-desks","best-8ft-reception-desks","best-72-inch-reception-desks"],
  },

  "best-70-inch-reception-desks": {
    title: "5 Best 70-Inch Reception Desks in 2026", metaTitle: "Best 70-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 70 inches and mapped multi-person work zones before ranking 70-inch reception desks.",
    mainKeyword: "70 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 70 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 70 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0FH65V64R","Best Overall"),pick("B0H3PMZT37","Best Fully Assembled Curved"),pick("B0GDQCBKDW","Best L-Shaped with File Cabinet"),pick("B0FHKW7JNB","Best L-Shaped Storage"),pick("B0H6WZ8SC7","Best Commercial Curved")],
    howToChoose: wideCriteria(70),
    faq: widthFaq(70, "70-inch"),
    related: ["best-72-inch-reception-desks","best-63-inch-reception-desks","best-7ft-reception-desks"],
  },

  "best-72-inch-reception-desks": {
    title: "6 Best 72-Inch Reception Desks in 2026", metaTitle: "Best 72-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 72 inches and mapped multi-person work zones before ranking 72-inch reception desks.",
    mainKeyword: "72 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 72 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 72 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0C74V1KLW","Best Overall"),pick("B0GLYFGYQM","Best Privacy Counter"),pick("B0FJLR52LF","Best Patented L-Shaped"),pick("B0H6WZ8SC7","Best Fully Assembled"),pick("B0FHKW7JNB","Best L-Shaped Storage"),pick("B0GDQCBKDW","Best with File Cabinet")],
    howToChoose: wideCriteria(72),
    faq: widthFaq(72, "72-inch"),
    related: ["best-6ft-reception-desks","best-70-inch-reception-desks","best-63-inch-reception-desks"],
  },

  "best-80-inch-reception-desks": {
    title: "5 Best 80-Inch Reception Desks in 2026", metaTitle: "Best 80-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 80 inches and mapped multi-person work zones before ranking 80-inch reception desks.",
    mainKeyword: "80 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 80 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 80 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0GRGD637J","Best Overall"),pick("B0H6MP2XX2","Best Patented Double-Top"),pick("B0FJLR52LF","Best Patented L-Shaped"),pick("B0GLYFGYQM","Best Privacy Counter"),pick("B0H6WZ8SC7","Best Fully Assembled")],
    howToChoose: wideCriteria(80),
    faq: widthFaq(80, "80-inch"),
    related: ["best-7ft-reception-desks","best-84-inch-reception-desks","best-72-inch-reception-desks"],
  },

  "best-84-inch-reception-desks": {
    title: "5 Best 84-Inch Reception Desks in 2026", metaTitle: "Best 84-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 84 inches and mapped multi-person work zones before ranking 84-inch reception desks.",
    mainKeyword: "84 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 84 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 84 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0H6MP2XX2","Best Overall"),pick("B0FJLR52LF","Best Patented L-Shaped"),pick("B0GLYFGYQM","Best Privacy Counter"),pick("B0HB43BN19","Best Compact Alternative"),pick("B0H6WZ8SC7","Best Fully Assembled")],
    howToChoose: wideCriteria(84),
    faq: widthFaq(84, "84-inch"),
    related: ["best-7ft-reception-desks","best-80-inch-reception-desks","best-90-inch-reception-desks"],
  },

  "best-9ft-reception-desks": {
    title: "5 Best 9ft Reception Desks in 2026", metaTitle: "Best 9ft Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 108 inches and mapped multi-person work zones before ranking 9ft reception desks.",
    mainKeyword: "9 ft reception desk",
    intro: [
      "This article targets an exact nominal width of 108 inches (9 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 108 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions across the extended run.",
    ],
    picks: [pick("B0F1VZ4XWD","Best Overall"),pick("B0HB43BN19","Best Compact Alternative"),pick("B0GSG2CJG6","Best Marble-Textured Extra-Long"),pick("B0H6WZ8SC7","Best Fully Assembled"),pick("B0GLYFGYQM","Best 2-Person Alternative")],
    howToChoose: wideCriteria(108),
    faq: widthFaq(108, "9-foot"),
    related: ["best-8ft-reception-desks","best-10ft-reception-desks","best-90-inch-reception-desks"],
  },

  "best-90-inch-reception-desks": {
    title: "5 Best 90-Inch Reception Desks in 2026", metaTitle: "Best 90-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 90 inches and mapped multi-person work zones before ranking 90-inch reception desks.",
    mainKeyword: "90 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 90 inches, and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 90 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions.",
    ],
    picks: [pick("B0F1VZ4XWD","Best Overall"),pick("B0HB43BN19","Best Compact Alternative"),pick("B0GSG2CJG6","Best Marble-Textured Extra-Long"),pick("B0H6WZ8SC7","Best Fully Assembled"),pick("B0GLYFGYQM","Best 2-Person Alternative")],
    howToChoose: wideCriteria(90),
    faq: widthFaq(90, "90-inch"),
    related: ["best-9ft-reception-desks","best-96-inch-reception-desks","best-84-inch-reception-desks"],
  },

  "best-96-inch-reception-desks": {
    title: "5 Best 96-Inch Reception Desks in 2026", metaTitle: "Best 96-Inch Reception Desks 2026",
    metaDescription: "We required actual assembled width close to 96 inches and mapped multi-person work zones before ranking 96-inch reception desks.",
    mainKeyword: "96 inch reception desk",
    intro: [
      "This article targets an exact nominal width of 96 inches (8 ft), and the central gap is verifying actual assembled width and usable work area after end panels, counters, storage, and supports.",
      "We required an actual assembled width close to 96 inches for every pick, mapped one-person versus multi-person workstation zones, and planned separate power, data, storage, and visitor positions across the extended run.",
    ],
    picks: [pick("B0F1VZ4XWD","Best Overall"),pick("B0HB43BN19","Best Compact Alternative"),pick("B0GSG2CJG6","Best Marble-Textured Extra-Long"),pick("B0H6WZ8SC7","Best Fully Assembled"),pick("B0HDNDT5K6","Best Pine Wood Alternative")],
    howToChoose: wideCriteria(96),
    faq: widthFaq(96, "96-inch"),
    related: ["best-8ft-reception-desks","best-90-inch-reception-desks","best-9ft-reception-desks"],
  },
};

const pending = [];
for (const [slug, meta] of Object.entries(articleMeta)) {
  const picks = meta.picks.filter(Boolean);
  picks.forEach((p, i) => { if (!p.badge) p.badge = badge(i, picks.length); p.bestFor = `buyers prioritizing ${(p.specs[0] || "this pick's strengths").toLowerCase()}`; });
  pending.push([slug, { ...meta, picks }]);
}

function writeAll() {
  const titleMap = {};
  for (const [slug, meta] of pending) titleMap[slug] = meta.title;
  for (const [slug, meta] of pending) writeOne(slug, meta, titleMap);
}

function writeOne(slug, meta, titleMap) {
  const { title, metaTitle, metaDescription, mainKeyword, intro, picks, howToChoose, faq, related } = meta;
  if (picks.length === 0) { console.log("NO VALID PICKS FOR", slug); return; }

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
export const lastUpdated = "2026-08-15";
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

export const faq = ${JSON.stringify(fillFaq(faq, 5).map(f => ({ q: f.q, a: f.a })), null, 2)};

export const relatedGuides: { href: string; title: string }[] = ${JSON.stringify(related.map((s) => ({ href: `/guide/${s}`, title: titleMap[s] || s })))};
`;
  fs.writeFileSync(`data/guides/${slug}.ts`, content);
  console.log("wrote", slug, `(${picks.length} picks)`);
}

writeAll();
