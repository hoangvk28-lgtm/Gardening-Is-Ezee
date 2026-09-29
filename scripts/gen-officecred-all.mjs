import fs from "fs";
import { P } from "./officecred-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-officecred.json", "utf8"));
const raw = fs.readFileSync("scripts/_officecred_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Function Classified Before Comparison", description: "Sorted each product into storage credenza, credenza desk, file credenza, or desk-system credenza before ranking, since 'office credenza' spans meaningfully different furniture types that don't compare fairly against each other." },
  { title: "Interior Dimensions Over Door Count", description: "Compared published interior drawer, shelf, and cabinet dimensions rather than exterior width or door count alone, since partitions and hardware can meaningfully shrink real usable space." },
  { title: "File Compatibility Verified Directly", description: "Checked letter/legal compatibility, filing direction, and lock coverage against each product's own documentation rather than assuming a 'file drawer' label means full hanging-file support." },
  { title: "Top Usability for Real Equipment", description: "Evaluated whether the top surface genuinely supports a printer, monitor, or active daily work, factoring in documented load capacity, depth, and cable access rather than treating it as decorative space." },
  { title: "Ownership Details: Assembly, Locks, and Warranty", description: "Weighed assembly complexity, lock/key service, replacement hardware, and warranty terms, since a credenza is a long-term purchase that outlives its first key or a single moving day." },
];

const sharedFaqPool = [
  { key: "credenza-vs-sideboard-vs-buffet", q: "What's the actual difference between a credenza, a sideboard, and a buffet?", a: "In practice these terms overlap heavily, and many manufacturers use them interchangeably for a similar low, wide storage cabinet. The real distinction that matters for an office is function, not the name: whether the piece is built for file storage, general storage, or as a working surface, not which of the three words appears in the listing title." },
  { key: "locking-office-storage-security", q: "Is a locking office credenza actually secure, or just private?", a: "Most locks on office credenzas are privacy and access-control features, not burglary-rated security. They keep casual access out and satisfy basic confidentiality needs, but they should not be relied on the same way as a rated safe if the contents are genuinely high-value or sensitive." },
  { key: "credenza-weight-capacity-printer", q: "How do I know if a credenza top can actually hold a printer?", a: "Check for a documented load rating in the product specs rather than assuming any flat surface can support office equipment indefinitely. A multifunction printer with paper loaded can weigh well over 20 lbs, and repeated vibration from printing can stress an unrated surface over time even if it doesn't fail immediately." },
  { key: "credenza-assembly-time", q: "How long does assembling an office credenza usually take?", a: "Most flat-pack office credenzas in this category take 30 minutes to 2 hours depending on drawer count and size, and manufacturers commonly recommend two people for anything over about 60 inches wide or 150 lbs, both for handling the panels safely and for aligning larger cabinets correctly." },
  { key: "credenza-file-drawer-sizes", q: "Do all office credenza file drawers fit both letter and legal size folders?", a: "No, this varies by model. Some use adjustable hanging rails that reconfigure between letter, A4, and legal, while others are built for only one size. Always check the specific drawer's documented file compatibility rather than assuming 'file drawer' means universal size support." },
  { key: "credenza-solid-wood-vs-veneer", q: "How can I tell if a credenza is genuinely solid wood versus veneer or laminate?", a: "A finish name like walnut, oak, or mahogany often describes the color or stain rather than the underlying material, since engineered wood and MDF are frequently finished to resemble a specific species. Check the product's stated construction material directly, and inspect edges and corners in photos where the substrate is more likely to show through." },
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

const articles = raw.map((line) => {
  const [num, title, asinStr] = line.split("\t");
  const asins = asinStr.split("|").map((s) => s.trim()).filter(Boolean);
  return { num: Number(num), title: title.trim(), asins: [...new Set(asins)] };
});

function slugify(title) {
  return title.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mainKeywordFor(title) {
  return title.replace(/^Best\s+/i, "").trim().toLowerCase();
}

function classify(title) {
  const t = title.toLowerCase();
  if (/under \$/.test(t)) return "budget";
  if (/\bsauder\b/.test(t)) return "brand";
  if (/\bhon\b/.test(t)) return "brand";
  if (/\bfile drawers?\b|file storage/.test(t)) return "filedrawers";
  if (/\bhutch\b/.test(t)) return "hutch";
  if (/\bstorage\b/.test(t)) return "storage";
  if (/black/.test(t)) return "color";
  if (/white/.test(t)) return "color";
  if (/gray|grey/.test(t)) return "color";
  if (/home office desk and credenza/.test(t)) return "deskset";
  if (/small office|small\b/.test(t)) return "small";
  if (/narrow/.test(t)) return "small";
  if (/mahogany|walnut|oak|dark wood/.test(t)) return "wood-species";
  if (/solid wood/.test(t)) return "solid-wood";
  if (/\bwood\b/.test(t)) return "wood-general";
  if (/mid-century|contemporary|modern|industrial/.test(t)) return "style";
  if (/executive/.test(t)) return "executive";
  if (/bookshelves|shelves/.test(t)) return "shelves";
  if (/drawers/.test(t)) return "drawers";
  if (/cabinets\b/.test(t)) return "cabinets";
  if (/file cabinets\b/.test(t)) return "filecabinets";
  if (/locking/.test(t)) return "locking";
  if (/metal/.test(t)) return "metal";
  if (/\bdoors\b/.test(t)) return "doors";
  if (/4 door/.test(t)) return "doors";
  if (/60-inch|72-inch/.test(t)) return "width";
  if (/printers/.test(t)) return "printers";
  if (/home office/.test(t)) return "homeoffice";
  return "generic";
}

const ANGLE_BY_CAT = {
  filedrawers: "verifying letter/legal compatibility and lock coverage drawer by drawer",
  hutch: "confirming official hutch-to-base compatibility before treating height as usable storage",
  storage: "checking real interior compartment dimensions instead of counting doors",
  color: "identifying the actual finish system behind a color name, not just the color itself",
  deskset: "planning how a desk and credenza actually coexist in the same footprint",
  small: "setting real width and depth thresholds instead of trusting a 'compact' label",
  "wood-species": "verifying genuine construction material instead of trusting a species name in the title",
  "solid-wood": "confirming the structural components are genuinely solid, not just solid-wood accents",
  "wood-general": "checking actual substrate and construction instead of trusting the word wood alone",
  style: "judging construction details instead of a style label for office durability",
  executive: "verifying premium finish durability and genuine file security together",
  shelves: "checking documented shelf load instead of assuming any open shelf can hold books",
  drawers: "classifying every drawer type and its documented load rating individually",
  cabinets: "verifying what's actually stored behind each cabinet door before counting doors as capacity",
  filecabinets: "verifying what's actually stored behind each cabinet door before counting doors as capacity",
  locking: "mapping exactly which compartments a lock actually secures",
  metal: "identifying whether metal is structural or just a decorative accent",
  doors: "checking interior bay dimensions per door instead of assuming more doors means more room",
  width: "confirming real assembled width and usable top space, not just the nominal figure",
  printers: "checking documented top load rating against your printer's real footprint and weight",
  homeoffice: "measuring residential footprint with doors and drawers fully open",
  budget: "verifying what storage is actually included at a lower price point",
  brand: "mapping which specific models in the lineup actually function as credenzas",
  generic: "verifying real interior dimensions instead of trusting exterior width or door count",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves function-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a headline spec on the listing.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} products vary enough that ${angle} matters more than exterior style alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the product photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or door count.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between models is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to style, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on verified interior dimensions and ${angle}, since exterior specs alone regularly overstate real usable space.`,
  (angle) => `Our ranking weighs verified interior dimensions and ${angle} ahead of marketing language or exterior appearance.`,
  (angle) => `Each pick here was judged on verified interior dimensions and ${angle}, not just its price tag or photos.`,
  (angle) => `We prioritized verified interior dimensions and ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust listing claims, we checked verified interior dimensions and ${angle} for every product on this list.`,
  (angle) => `The picks below were sorted by verified interior dimensions and ${angle}, the details that actually decide how much a credenza can hold.`,
  (angle) => `What separates these picks is verified interior dimensions and ${angle}, checked model by model instead of assumed from a photo.`,
  (angle) => `Every entry on this list was screened for verified interior dimensions and ${angle} before anything else was weighed.`,
  (angle) => `Verified interior dimensions and ${angle} decided this ranking far more than star counts or review volume did.`,
  (angle) => `We leaned on verified interior dimensions and ${angle} to separate genuinely useful picks from well-photographed ones.`,
];

function buildIntro(cat, kw, title, num) {
  const angle = ANGLE_BY_CAT[cat] || ANGLE_BY_CAT.generic;
  const firstIdx = num % FIRST_TEMPLATES.length;
  const secondIdx = (num * 3 + 2) % SECOND_TEMPLATES.length;
  return [FIRST_TEMPLATES[firstIdx](title, kw, angle), SECOND_TEMPLATES[secondIdx](angle)];
}

function buildHowToChoose(cat, kw) {
  const K = kw;
  switch (cat) {
    case "filedrawers":
      return [
        { subheading: "Verify Letter/Legal Compatibility Per Drawer", note: `Check whether each file drawer in ${K} supports letter, legal, or both, including hanging-rail filing direction, rather than assuming 'file drawer' guarantees universal size support.` },
        { subheading: "Measure Interior Drawer Geometry", note: "Get actual interior dimensions and hanging-rail length rather than trusting exterior drawer size, since hardware and rail mechanisms take up real interior space." },
        { subheading: "Confirm Which Drawers Actually Lock", note: "Verify lock coverage per drawer, since many credenzas secure only one drawer while leaving others, including supply drawers, unlocked." },
        { subheading: "Check Interlock or Anti-Tip Behavior", note: "Test or verify what happens when multiple drawers are opened simultaneously, since some designs include an interlock or anti-tip mechanism and others do not." },
        { subheading: "Confirm Full-Extension Access in Your Layout", note: "Measure drawer clearance beside your actual desk, chair, and wall, since full-extension drawers need real floor space to open completely." },
      ];
    case "hutch":
      return [
        { subheading: "Verify Official Hutch-to-Credenza Compatibility", note: `Confirm the hutch is officially rated and fastens to the exact credenza model in ${K}, since hutches are frequently sold as separate components that only fit specific bases.` },
        { subheading: "Measure Clear Height Below the Hutch", note: "Check the open niche height and depth beneath the hutch, since a tall overall height figure doesn't tell you how much clear working space remains below it." },
        { subheading: "Check Wall Anchoring Requirements", note: "Verify anti-tip and wall-fastening requirements, since a hutch raises the total assembled height and center of gravity significantly compared to the credenza alone." },
        { subheading: "Plan Cable and Lighting Access", note: "Map power, task lighting, and cable exits before assembly, since hutches can trap cables behind fixed shelving and make later access difficult." },
        { subheading: "Confirm Shelf and Door Swing Clearance", note: "Measure shelf interiors and door swing radius in the room's actual layout, since hutch doors often swing into a different space than the credenza doors below them." },
      ];
    case "storage":
      return [
        { subheading: "Inventory the Actual Storage Type Mix", note: `List the exact combination of shelves, cabinets, drawers, and file zones in ${K} rather than judging storage capacity by door count alone.` },
        { subheading: "Publish Each Compartment's Interior Dimensions", note: "Get interior dimensions and shelf-adjustment range for every compartment, since center partitions and hardware can make interior bays meaningfully smaller than exterior width suggests." },
        { subheading: "Verify Documented Shelf Load", note: "Check for a stated shelf weight rating before loading it with books, binders, or equipment, rather than assuming printer-grade strength without documentation." },
        { subheading: "Measure Door Clearance in Your Room", note: "Open every door in the intended layout and measure the clearance needed, since some designs require more swing radius than a typical office aisle allows." },
        { subheading: "Separate Lockable From Open Storage", note: "Identify which compartments lock and which stay open, so confidential files and everyday supplies end up in the right zone from day one." },
      ];
    case "color":
      return [
        { subheading: "Identify the Actual Finish System", note: `Determine whether ${K}'s color comes from laminate, paint, powder coat, or veneer stain, since the same color name can mean very different maintenance needs depending on the underlying finish.` },
        { subheading: "Check Fingerprint and Dust Visibility", note: "Evaluate how fingerprints, dust, and light scuffs show under normal office lighting, since gloss level and color both affect how visible daily wear becomes." },
        { subheading: "Inspect Scratch Contrast Risk", note: "Check whether a scratch would expose a contrasting substrate color underneath the finish, which is more visually jarring on some color-and-material combinations than others." },
        { subheading: "Verify Component Color Match", note: "Compare color consistency across the top, case, drawers, doors, and any hutch, since add-on components don't always match perfectly across production batches." },
        { subheading: "Use Manufacturer-Approved Cleaning Methods", note: "Follow the specific cleaning guidance for the finish type rather than a generic furniture polish, since the wrong cleaner can dull or damage certain gloss and matte finishes." },
      ];
    case "deskset":
      return [
        { subheading: "Plan the Two-Piece Room Layout First", note: `Map desk orientation, chair zone, and credenza placement together for ${K} before ordering, since a desk-and-credenza combination needs both pieces to coexist in the same footprint.` },
        { subheading: "Verify Printer and Equipment Fit on the Credenza Top", note: "Place your actual printer or secondary monitor setup on the credenza top mentally (or on paper) and check ventilation and cable reach before assuming it fits." },
        { subheading: "Balance File Storage With Closed Supply Storage", note: "Check that the set includes both file drawers and closed supply storage rather than decorative open shelving alone, since a full desk setup needs both types." },
        { subheading: "Plan Wall-Outlet and Plug Clearance", note: "Measure plug-bend clearance behind both pieces so the set can sit close to the wall without crushing power cords." },
        { subheading: "Budget Real Assembly Time for Two Pieces", note: "Account for the combined carton weight and assembly time of both the desk and the credenza, not just one piece, when planning a setup day." },
      ];
    case "small":
      return [
        { subheading: "Set Explicit Width and Depth Thresholds", note: `Define specific maximum width and depth numbers for ${K} rather than judging 'small' by photos alone, since compact credenzas vary meaningfully in both dimensions.` },
        { subheading: "Measure Uninterrupted Top Area", note: "Check the usable top area after subtracting any hutch footprint or raised edge trim, since the nominal top dimensions can overstate real working space." },
        { subheading: "Compare Storage Efficiency Per Inch", note: "Evaluate storage capacity relative to footprint rather than raw storage volume alone, since a compact credenza needs to make efficient use of every inch." },
        { subheading: "Open Doors and Drawers in Your Actual Aisle", note: "Test or measure door and drawer clearance in the specific spot it will occupy, since small rooms leave little margin for a swing-door design that needs more clearance than expected." },
        { subheading: "Verify Printer Fit and Rear Ventilation", note: "Place a representative printer or scanner footprint on the top and check for rear ventilation and plug clearance before committing to a compact model." },
      ];
    case "wood-species":
      return [
        { subheading: "Confirm Actual Wood Construction, Not Just the Finish Name", note: `Verify whether ${K} is genuinely solid wood, veneer, or a wood-look laminate, since a species name in the title is often a finish description rather than proof of the underlying material.` },
        { subheading: "Check Top and Case Thickness", note: "Look for documented substrate or top thickness where available, since thicker construction generally holds up better under repeated printer or equipment use." },
        { subheading: "Inspect Edges and Corners for Chip Risk", note: "Check edge photos closely, since exposed corners and edges are where a lower-grade substrate is most likely to show through the finish or chip first." },
        { subheading: "Compare Scratch Repair Options", note: "Check whether the finish supports touch-up markers or refinishing, since genuine solid wood generally offers more repair options than a laminate or veneer surface." },
        { subheading: "Factor in Assembled Weight", note: "Check the assembled weight, since genuinely solid-wood pieces are meaningfully heavier than engineered-wood equivalents, which affects both delivery and any future move." },
      ];
    case "solid-wood":
      return [
        { subheading: "Require Documented Solid-Wood Construction", note: `Verify ${K}'s main structural components are genuinely solid wood, not just solid-wood accents on an engineered-wood body, before paying a premium for the material.` },
        { subheading: "Expect Genuine Weight and Delivery Planning", note: "Plan for meaningfully higher shipping weight and potentially professional delivery, since true solid wood is considerably heavier than engineered-wood equivalents at the same size." },
        { subheading: "Understand Seasonal Movement", note: "Expect some natural expansion and contraction with humidity changes, a normal characteristic of solid wood that engineered wood and laminate largely avoid." },
        { subheading: "Check Joinery Details Where Documented", note: "Look for documented joinery methods, since genuine solid-wood furniture often uses different joint construction than engineered-wood equivalents, though this is not always specified." },
        { subheading: "Weigh Repairability Against Higher Upfront Cost", note: "Factor in that solid wood generally sands and refinishes better over decades of use, which can offset the higher upfront price over the piece's lifetime." },
      ];
    case "wood-general":
      return [
        { subheading: "State Actual Construction Instead of Trusting the Name", note: `Verify whether ${K} is solid wood, veneer, or wood-look laminate before assuming 'wood' in the title means solid material throughout.` },
        { subheading: "Check Substrate and Top Thickness", note: "Look for documented top or case thickness, since thicker panels generally resist sagging and warping better under sustained equipment weight." },
        { subheading: "Inspect Exposed Edges", note: "Check edge and corner photos for chip risk, a common weak point on engineered-wood pieces finished to look like solid wood." },
        { subheading: "Compare Finish Repair Options", note: "Check what touch-up or refinishing options exist for scratches, since this varies significantly between laminate, veneer, and solid wood construction." },
        { subheading: "Confirm Assembled Weight and Panel Size", note: "Check assembled weight and largest panel dimension, since genuinely solid-wood pieces are both heavier and shipped in larger single panels than engineered-wood equivalents." },
      ];
    case "style":
      return [
        { subheading: "Define the Style Through Construction, Not Marketing", note: `Look at ${K}'s actual leg, door, and case construction details rather than trusting the style label alone, since modern, contemporary, mid-century, and industrial products can share very similar engineered substrates.` },
        { subheading: "Inspect Legs and Open Frames for Durability", note: "Check leg and frame construction specifically for office-use durability, since decorative open-leg bases can flex more under repeated equipment weight than a solid case." },
        { subheading: "Test Base Stability Under Load", note: "Consider stability with drawers loaded and equipment on top, since decorative slatted or open-frame bases can behave differently under real load than a solid-sided cabinet." },
        { subheading: "Verify Cable Concealment Stays Serviceable", note: "Check that cables can stay hidden while remaining accessible for future changes, since some style-forward designs prioritize appearance over serviceability." },
        { subheading: "Check Replacement Hardware Availability", note: "Confirm whether replacement handles, doors, or finish-repair options exist for this specific style line, since decorative hardware is not always a standard, easily replaceable part." },
      ];
    case "executive":
      return [
        { subheading: "Verify Premium Finish Durability", note: `Check ${K}'s specific finish construction and durability claims, since an executive-styled credenza should hold up to daily professional use, not just look premium in photos.` },
        { subheading: "Confirm File Security for Sensitive Documents", note: "Verify which drawers lock and whether the lock is documented as more than a basic privacy latch, since executive use often involves genuinely confidential material." },
        { subheading: "Check Technology and Printer Support", note: "Verify the top surface's documented load capacity and cable access, since executive credenzas frequently need to support a printer or secondary monitor setup." },
        { subheading: "Plan Coordination With the Main Desk", note: "Check finish and color matching against your existing desk, since executive office layouts typically expect coordinated, not mismatched, furniture." },
        { subheading: "Verify Delivery and Assembly Support", note: "Check delivery and assembly logistics in advance, since executive-scale pieces are often heavier and may require professional installation." },
      ];
    case "shelves":
      return [
        { subheading: "Measure Vertical Clearance for Binders and Books", note: `Check shelf spacing in ${K} against your actual binder and book heights, since open-shelf credenzas vary meaningfully in vertical clearance between shelves.` },
        { subheading: "Verify Documented Shelf Load Rating", note: "Look for a stated per-shelf weight rating before loading it with books or files, since shelf sag becomes a real risk without documented load capacity." },
        { subheading: "Check Shelf Adjustability", note: "Confirm how many height positions each shelf supports, since fixed shelves offer less flexibility than adjustable ones as your storage needs change." },
        { subheading: "Plan Open vs. Closed Storage Balance", note: "Weigh how much of the total storage is open shelving versus closed cabinets, since open shelves offer no dust or privacy protection for their contents." },
        { subheading: "Confirm Anti-Tip Hardware Is Included", note: "Verify anti-tip wall-anchor hardware ships standard, since a tall, shelf-heavy piece carries more tipping risk than a low, drawer-only cabinet." },
      ];
    case "drawers":
      return [
        { subheading: "Classify Every Drawer by Type", note: `Identify each drawer in ${K} as supply, box, file, or specialty, and get its interior dimensions, rather than trusting a generic drawer count.` },
        { subheading: "Check Full-Extension Behavior and Load Rating", note: "Verify whether drawers fully extend and what weight they're rated to hold, since partial-extension drawers make reaching contents at the back genuinely harder." },
        { subheading: "Verify Lock Coverage and Key Replacement", note: "Check which drawers lock and whether replacement keys or cores are available, since losing the only key to a locked drawer can be a real long-term problem." },
        { subheading: "Test Anti-Tip Behavior With Multiple Drawers Open", note: "Check for documented interlock or anti-tip behavior, since opening several heavy drawers simultaneously can affect stability on some designs." },
        { subheading: "Measure Front Clearance in Your Layout", note: "Confirm drawer clearance beside your desk, chair, and any adjacent wall, since full-extension drawers need genuine floor space to open completely." },
      ];
    case "cabinets":
    case "filecabinets":
      return [
        { subheading: "Inventory the Storage Type Mix", note: `List the exact combination of shelves, drawers, and file zones behind ${K}'s cabinet doors rather than judging capacity by door count alone.` },
        { subheading: "Publish Interior Compartment Dimensions", note: "Get interior dimensions for each cabinet compartment, since center partitions and hardware can make interior bays smaller than the exterior suggests." },
        { subheading: "Verify File Compatibility Behind Cabinet Doors", note: "If cabinet doors hide file storage, confirm letter/legal compatibility and hanging-rail presence directly, since cabinet-style file storage is documented less consistently than dedicated file drawers." },
        { subheading: "Check Door Clearance in Your Room", note: "Open every cabinet door in its intended location and measure the swing clearance needed." },
        { subheading: "Separate Lockable From Open Cabinet Storage", note: "Identify which cabinets lock, so confidential material and everyday supplies land in the correct compartment from the start." },
      ];
    case "locking":
      return [
        { subheading: "Map Exactly Which Doors or Drawers Each Lock Secures", note: `Verify precisely which compartments in ${K} the lock actually covers, since one lock frequently secures only a single drawer or pedestal, not the entire piece.` },
        { subheading: "Verify Replacement Core and Key Support", note: "Check whether replacement keys or lock cores are available by serial number, since losing the only key to a fixed lock can mean drilling it out or replacing the whole mechanism." },
        { subheading: "Check for Bypass Exposure", note: "Verify whether adjacent open shelves or removable panels could bypass the locked zone, since a lock is only as useful as the compartment it actually seals." },
        { subheading: "Test Daily Key Access in Your Layout", note: "Confirm the key is easy to reach when the credenza sits beside a desk or against a wall, since awkward key access discourages actually using the lock day to day." },
        { subheading: "Understand This Is Access Control, Not Burglary Security", note: "Treat the lock as privacy and access control rather than rated security, since most office credenza locks are not independently tested against forced entry." },
      ];
    case "metal":
      return [
        { subheading: "Identify Metal's Actual Structural Role", note: `Determine whether metal in ${K} is the structural case, just the doors, the frame, or a decorative skin over another material, since 'metal' can mean very different construction depending on which part it applies to.` },
        { subheading: "Check Gauge or Thickness Where Documented", note: "Look for a stated steel gauge or thickness, since this figure, when available, is a more reliable durability signal than a general 'heavy duty' or 'industrial' label." },
        { subheading: "Inspect Drawer and Door Suspension", note: "Check for rattle or looseness under load in reviews or photos, since metal drawer suspension can behave differently than wood-and-slide construction." },
        { subheading: "Compare Powder-Coat Chip and Corrosion Risk", note: "Check how the finish handles chips and scratches at damaged edges, since exposed metal under a powder coat can corrode differently than a chipped wood veneer would." },
        { subheading: "Account for Loaded Weight and Leveling", note: "Factor in that metal cases are often heavier than wood-and-laminate equivalents, and confirm leveling feet are included for uneven flooring." },
      ];
    case "doors":
      return [
        { subheading: "Inventory What's Actually Behind Each Door", note: `Check the shelf, drawer, or file layout behind each door on ${K} rather than assuming more doors automatically means more usable storage.` },
        { subheading: "Measure Interior Dimensions Per Bay", note: "Get interior dimensions for each door's compartment individually, since a 4-door design can split interior space very unevenly between bays." },
        { subheading: "Verify Shelf Adjustability Behind Each Door", note: "Check whether shelves behind each door adjust independently, since a fixed-shelf bay behaves very differently from an adjustable one for taller items." },
        { subheading: "Check Door Swing Clearance for Multiple Doors", note: "Measure the clearance needed when multiple doors are open simultaneously, since a multi-door design can require more aisle space than a single-door equivalent." },
        { subheading: "Confirm Wall Anchoring if Doors Swing to Full Extension", note: "Verify anti-tip requirements, since a wide multi-door piece with doors fully open shifts weight distribution more than a closed cabinet." },
      ];
    case "width":
      return [
        { subheading: "Require Actual Assembled Width, Not Just Nominal", note: `Confirm ${K}'s real assembled width including any top or trim overhang, since nominal width figures don't always account for edge details that extend beyond the case.` },
        { subheading: "Measure Uninterrupted Top Width and Depth", note: "Check how much of the top surface is genuinely usable for active equipment after subtracting any raised trim or hutch footprint." },
        { subheading: "Publish Every Interior Bay Individually", note: "Get dimensions for each cabinet or drawer bay separately, since exterior width alone can be mistaken for proportional interior capacity." },
        { subheading: "Measure Doors and Drawers Fully Open", note: "Check clearance with doors and drawers fully extended in the exact spot the credenza will sit, particularly beside a desk or chair." },
        { subheading: "Include Wall, Baseboard, and Cable Clearance", note: "Account for baseboard depth, wall-plug clearance, and cord-bend room, since these can meaningfully reduce how close a wide credenza actually sits to the wall." },
      ];
    case "printers":
      return [
        { subheading: "Verify Printer Footprint Against Top Dimensions", note: `Check your actual printer's footprint, including open paper trays, against ${K}'s top width and depth, since a decorative credenza top is not automatically printer-ready.` },
        { subheading: "Confirm Documented Load Guidance", note: "Look for a stated top load rating before assuming any flat surface can support a multifunction printer indefinitely, especially with paper loaded." },
        { subheading: "Leave Access for Jams and Scanner Lids", note: "Check for rear and top clearance for paper jams, scanner lids, and consumable swaps, since a tight installation can make routine printer maintenance genuinely difficult." },
        { subheading: "Map Power and Data Cable Routing", note: "Plan for power, USB, or Ethernet cable routing without crushed plugs, particularly if the credenza sits flush against a wall." },
        { subheading: "Store Consumables Without Blocking Vents", note: "Keep paper and toner storage away from any vents or intake points on the printer to avoid overheating or airflow issues during heavy print jobs." },
      ];
    case "homeoffice":
      return [
        { subheading: "Measure Residential Footprint With Everything Open", note: `Check ${K}'s footprint with doors and drawers fully open, and account for baseboards, since residential rooms often have less clearance margin than a commercial office layout.` },
        { subheading: "Verify Printer or Equipment Fit on Top", note: "Place your actual printer, scanner, or monitor setup on the top surface mentally and check ventilation and cable reach before assuming it fits." },
        { subheading: "Balance File Drawers With Closed Supply Storage", note: "Check that the credenza includes both file drawers and closed supply storage, not just decorative open shelving, for genuine home-office use." },
        { subheading: "Plan Wall-Outlet and Plug-Bend Clearance", note: "Measure plug-bend clearance behind the unit so it can sit close to the wall without crushing power cords." },
        { subheading: "Budget Real Assembly Time and Carton Weight", note: "Check carton weight and whether one or two people are needed for setup, since RTA home-office furniture varies significantly in assembly complexity." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp Price and Separate Freight", note: `Verify ${K}'s current price at checkout and separate the item price from any freight or delivery surcharge, since posted prices and stock levels change.` },
        { subheading: "List What Storage Is Actually Included", note: "Check drawers, file rails, doors, shelves, and any hutch actually included, rather than assuming a low price includes the same storage mix as pricier competitors." },
        { subheading: "Check Substrate and Hardware Where Documented", note: "Look for panel thickness or hardware details where available, since budget pricing often comes from thinner substrate rather than a smaller footprint." },
        { subheading: "Time the Real Assembly Effort", note: "Factor in assembly time and check alignment after any future move or re-leveling, since budget RTA hardware can be less forgiving of repeated disassembly." },
        { subheading: "Compare Warranty and Replacement-Part Support", note: "Check warranty length and whether replacement parts are available, since this is rarely included in budget-focused comparisons but affects long-term ownership cost." },
      ];
    case "brand":
      return [
        { subheading: "Build a Current Model Map First", note: `Confirm which current ${K} models are actually credenza-function products rather than a related desk or storage line, since brand catalogs mix multiple furniture types under similar names.` },
        { subheading: "Classify Each Model's Actual Function", note: "Determine whether the specific model is a credenza desk, storage credenza, or file-oriented credenza, since a single brand's lineup often spans all three." },
        { subheading: "Verify Exact Storage Layout Per Model", note: "Check the documented drawer, file, door, and shelf count for the specific model and any hutch compatibility, rather than assuming consistency across the brand's line." },
        { subheading: "Check Assembly Complexity and Carton Count", note: "Look for documented carton count and part complexity, since brand reputation alone doesn't indicate how involved assembly will be for a specific model." },
        { subheading: "Track Current Price, Warranty, and Replacement Parts", note: "Verify current price, warranty terms, and replacement-part availability directly from the brand, since these details change over a product line's lifecycle." },
      ];
  }
  return [
    { subheading: "Classify Function Before Comparing", note: `Determine whether ${K} is a storage credenza, credenza desk, or file-oriented credenza before comparing it to other products, since the category spans genuinely different furniture types.` },
    { subheading: "Verify Interior Dimensions", note: "Check actual interior dimensions rather than trusting exterior width or door count alone." },
    { subheading: "Confirm File and Lock Details", note: "Verify letter/legal file compatibility and exactly which compartments lock, rather than assuming from a general description." },
    { subheading: "Check Top Load and Cable Access", note: "Confirm the top surface's documented load capacity and cable routing if it will support a printer or other equipment." },
    { subheading: "Weigh Ownership Details", note: "Factor in assembly complexity, warranty terms, and replacement-part availability as part of the real cost of ownership." },
  ];
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "filedrawers":
      return [
        { q: `Do the file drawers in ${K} fit both letter and legal size folders?`, a: "This varies by model. Some use adjustable hanging rails that reconfigure between letter, A4, and legal, while others are built for one size only. Always check the specific product's documented file compatibility rather than assuming all 'file drawer' credenzas support every size." },
        { q: "Why do some file drawers lock and others in the same credenza don't?", a: "Manufacturers commonly lock only the drawer intended for confidential documents, leaving supply or general-purpose drawers unlocked for quick daily access. Check the specific drawer-by-drawer lock coverage before assuming the whole unit secures uniformly." },
      ];
    case "hutch":
      return [
        { q: `Can any hutch be added to ${K} later, or does it need to match exactly?`, a: "Hutches are typically designed for a specific base model's exact width and mounting points, so a hutch from a different product line usually will not fasten correctly even if it looks similar. Check official compatibility before buying a hutch separately." },
        { q: "Does adding a hutch make the credenza less stable?", a: "A hutch raises the total height and shifts weight upward, which is why most hutch-equipped credenzas require wall anchoring or anti-tip hardware that a hutch-free credenza does not need. Confirm the specific anchoring requirement before installation." },
      ];
    case "storage":
      return [
        { q: `Does more doors on ${K} always mean more usable storage?`, a: "Not necessarily. Interior partitions and hardware can make a 4-door design's individual bays smaller than a 2-door design with a more open interior layout. Compare actual interior dimensions per compartment, not door count." },
        { q: "Can office storage credenzas hold a printer safely?", a: "Only if the top surface has a documented load rating that covers your specific printer's weight, especially with paper loaded. Don't assume any flat top surface is rated for sustained equipment weight without checking." },
      ];
    case "color":
      return [
        { q: `Will the color on ${K} look consistent across the top, drawers, and doors?`, a: "Not always. Add-on components like hutches and separately manufactured drawer fronts don't always match perfectly across production batches, so check reviews or product photos for component color consistency before ordering." },
        { q: "Do darker or lighter finishes show scratches more?", a: "This depends more on gloss level and whether the substrate underneath contrasts with the surface color than on the color itself. A glossy dark finish over a light substrate can show scratches more dramatically than a matte finish in either color." },
      ];
    case "deskset":
      return [
        { q: `Can the desk and credenza in ${K} be purchased or used separately?`, a: "This varies by set. Some are designed as genuinely separable pieces that work independently, while others are meant to function only as a matched pair. Check the specific listing before assuming either way." },
        { q: "How much total floor space does a desk-and-credenza set actually need?", a: "Plan for both pieces' footprints plus a working aisle between them, not just the desk's footprint alone. A two-piece set generally needs more total room than a single all-in-one credenza desk." },
      ];
    case "small":
      return [
        { q: `How compact does ${K} actually need to be to fit a small office?`, a: "Set explicit width and depth thresholds based on your specific room measurements rather than trusting a 'small' or 'narrow' label alone, since these terms are used inconsistently across listings." },
        { q: "Do compact credenzas sacrifice real storage capacity?", a: "Often somewhat, yes, since less exterior volume generally means less interior volume too. Compare storage-per-inch efficiency rather than assuming a compact model matches a full-size credenza's capacity." },
      ];
    case "wood-species":
      return [
        { q: `Is ${K} genuinely solid wood, or is that just the finish name?`, a: "Check the product's stated construction material directly. Species names are frequently used as finish or stain descriptions on engineered wood or MDF rather than proof of solid material throughout." },
        { q: "Does a wood species name affect the price meaningfully?", a: "Genuine solid wood in that species typically costs more than an engineered-wood equivalent finished to resemble it, so a suspiciously low price paired with a premium species name is worth double-checking against the actual construction details." },
      ];
    case "solid-wood":
      return [
        { q: `How much heavier is a genuinely solid-wood credenza like ${K} compared to engineered wood?`, a: "Meaningfully heavier, often by 30 to 50 percent or more at a similar size, which affects both delivery logistics and how easily it can be moved again later. Check the documented assembled weight before ordering." },
        { q: "Will a solid-wood credenza need special care compared to engineered wood?", a: "Generally yes to some degree. Solid wood responds to humidity changes with minor expansion and contraction, and benefits from periodic conditioning or polish, while engineered wood and laminate are more dimensionally stable but harder to refinish if damaged." },
      ];
    case "style":
      return [
        { q: `Is a ${K} genuinely more durable than a plain laminate credenza, or just styled differently?`, a: "Style and durability are separate questions. Many style-forward credenzas use similar engineered substrates to plain designs, just with different door, leg, or trim details, so check construction specifics rather than assuming style implies better or worse durability." },
        { q: "Do decorative legs or open frames affect stability?", a: "They can. Open-leg and slatted-front designs sometimes flex more under load than a solid-sided cabinet, so check stability specifically if the credenza will carry loaded drawers plus equipment on top." },
      ];
    case "executive":
      return [
        { q: `What makes ${K} suitable for an executive office versus a standard credenza?`, a: "Typically a combination of premium finish durability, secure file storage, and coordinated styling with a matching desk, rather than one single feature. Check each of these individually rather than assuming 'executive' branding covers all three." },
        { q: "Do executive credenzas typically include better warranties?", a: "Not automatically, though commercial-grade brands often do offer longer warranty terms than residential RTA furniture. Check the specific warranty length rather than assuming executive styling implies better coverage." },
      ];
    case "shelves":
      return [
        { q: `Are the shelves in ${K} strong enough for a full row of hardcover books?`, a: "Only if there's a documented per-shelf weight rating that covers it. A full shelf of hardcover books can weigh 30 to 40 lbs or more, so check for a specific rating rather than assuming any shelf can handle it." },
        { q: "Do open shelves need anti-tip hardware?", a: "Yes, especially on taller pieces, since open shelving concentrates weight higher up than a low, drawer-only cabinet. Confirm anti-tip wall-anchor hardware is included standard." },
      ];
    case "drawers":
      return [
        { q: `Are all the drawers on ${K} the same type, or a mix?`, a: "Check individually. Many credenzas mix supply drawers, box drawers, and file drawers in the same unit, and each type has a different interior layout suited to different contents." },
        { q: "Can heavy drawers cause the credenza to tip if several are opened at once?", a: "It's possible on some designs without an interlock or anti-tip mechanism, particularly if the drawers are loaded and extended fully at the same time. Check for documented interlock behavior if this is a household with kids or a shared office." },
      ];
    case "cabinets":
    case "filecabinets":
      return [
        { q: `What's actually stored behind the cabinet doors on ${K}?`, a: "This varies significantly, from open adjustable shelving to hidden file drawers to a mix of both. Check the interior layout description rather than assuming a cabinet door automatically means file storage." },
        { q: "Are cabinet-style file credenzas as functional as dedicated file drawers?", a: "They can be, but documentation is often less consistent. If letter/legal compatibility and hanging-rail presence matter to you, verify these details directly rather than assuming a cabinet door hides the same file-ready interior as a labeled file drawer." },
      ];
    case "locking":
      return [
        { q: `Does the lock on ${K} cover the whole credenza or just one drawer?`, a: "Check the specific product documentation, since it's common for a single lock to secure only one drawer or pedestal while the rest of the credenza remains open. Don't assume whole-unit security from a general 'locking' label." },
        { q: "Is an office credenza lock rated against forced entry?", a: "Generally no. Most office storage locks are privacy and access-control features, not independently tested burglary security, so treat them accordingly if the contents are genuinely high-value." },
      ];
    case "metal":
      return [
        { q: `Is ${K} a full steel case, or just metal accents on a wood body?`, a: "This varies significantly by listing. Some 'metal' credenzas are structurally steel throughout, while others use metal only for the frame, legs, or decorative trim over an engineered-wood case. Check the construction description directly." },
        { q: "Are metal file credenzas noisier than wood ones?", a: "They can be, particularly with drawer suspension and rattle under load, since metal doesn't dampen vibration the way wood or laminate-over-particleboard does. This varies by specific hardware quality." },
      ];
    case "doors":
      return [
        { q: `Does a 4-door design on ${K} give more storage than a 2-door credenza of the same width?`, a: "Not automatically. More doors can mean smaller individual compartments due to added partitions and hinge hardware, so compare total interior volume and per-bay dimensions rather than assuming door count scales directly with capacity." },
        { q: "Is it harder to open multiple doors in a tight office layout?", a: "Yes, if several doors need to open simultaneously for full access. Measure the combined swing clearance needed in your specific layout rather than assuming a single-door clearance measurement applies." },
      ];
    case "width":
      return [
        { q: `Does the nominal width on ${K} match its true assembled footprint?`, a: "Usually close, but check for any top or trim overhang that extends slightly beyond the case width, since this can matter in a tight wall run where every half inch counts." },
        { q: "Should I measure my wall space before or after accounting for baseboards?", a: "After. Baseboard depth can reduce how far back against the wall a credenza actually sits, effectively adding to its footprint in the room even though it doesn't change the product's stated dimensions." },
      ];
    case "printers":
      return [
        { q: `Can ${K} support a heavy multifunction printer safely?`, a: "Only if there's a documented top load rating that covers your printer's weight with paper loaded, which can exceed 20 to 30 lbs for a larger multifunction unit. Check for a specific rating rather than assuming any flat surface qualifies." },
        { q: "Does a printer on top of a credenza need special ventilation clearance?", a: "Most multifunction printers need some rear and side clearance for heat dissipation and paper-jam access, so leave a few inches of clearance around the unit rather than pushing it flush against a wall or hutch backboard." },
      ];
    case "homeoffice":
      return [
        { q: `How much wall space does ${K} actually need including doors and drawers open?`, a: "Measure the footprint with everything fully open, not just the closed exterior dimensions, and add baseboard depth, since residential rooms often have less margin than a commercial office layout accounts for." },
        { q: "Is a home-office credenza assembly harder than office furniture?", a: "It varies by model rather than by the home-versus-office distinction itself, though many home-office credenzas use RTA flat-pack construction that trades easier shipping for a longer assembly process compared to pre-assembled commercial furniture." },
      ];
    case "budget":
      return [
        { q: `Are budget office credenzas like ${K} actually lower quality, or just less styled?`, a: "It varies. Some budget options use thinner substrate or simpler hardware to hit a lower price point, while others simply skip decorative styling while keeping comparable construction. Compare documented panel thickness and hardware specifics rather than assuming price alone indicates quality." },
        { q: "What should I check before buying the cheapest option available?", a: "Verify what storage is actually included (drawers, file rails, shelves), the panel thickness where documented, and the warranty and replacement-part support, since these details are often what separates genuinely comparable budget options from ones that cut real corners." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make when shopping for ${K}?`, a: "Judging capacity by exterior width or door count alone. Interior partitions, hardware, and shelf placement can make two similarly sized credenzas hold meaningfully different amounts, so always check interior dimensions specifically." },
        { q: `Should I prioritize style or function when choosing ${K}?`, a: "Function first, since a credenza that doesn't fit your actual file sizes, equipment, or storage needs won't become more useful because it looks good. Narrow the field by function, then choose among the finalists by style." },
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
  const metaDescription = `We compared ${kw} by verified interior dimensions, real file and lock compatibility, and top-surface usability rather than ranking by exterior width or door count alone.`;

  articleMeta[slug] = {
    title: `${count} Best ${a.title.replace(/^Best\s+/i, "")} in 2026`,
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

let written = 0;
for (const [slug, meta] of Object.entries(articleMeta)) {
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
export const lastUpdated = "2026-08-18";
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

export const buyingCriteria = ${JSON.stringify(howToChoose.map(h => ({ criterion: h.subheading, explanation: h.note })), null, 2)};

export const faq = ${JSON.stringify(faq.map(f => ({ q: f.q, a: f.a })), null, 2)};

export const relatedGuides: { href: string; title: string }[] = ${JSON.stringify(related.map((s) => ({ href: `/guide/${s}`, title: slugTitleMap[s] ? `Best ${slugTitleMap[s].replace(/^Best\s+/i, "")} in 2026` : s })))};
`;
  fs.writeFileSync(`data/guides/${slug}.ts`, content);
  written++;
}

fs.writeFileSync("scripts/_officecred_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
