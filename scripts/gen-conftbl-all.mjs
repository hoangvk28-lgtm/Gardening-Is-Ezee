import fs from "fs";
import { P } from "./conftbl-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-conftbl.json", "utf8"));
const raw = fs.readFileSync("scripts/_conftbl_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Verified Seat Count Against Table Length", description: "Checked actual table length and depth against the advertised seat count, since a table marketed for a certain number of people does not always leave enough per-seat edge space once corners and end zones are excluded." },
  { title: "Base and Leg Interference", description: "Traced where legs, pedestals, and center supports fall relative to seat positions, since a base placed at the wrong point can block knee room for whoever sits closest to it." },
  { title: "Cable and Power Routing", description: "Followed the power and data path from grommet holes or built-in outlets through to where a laptop or phone would actually sit, rather than assuming a cable hole alone solves cable management." },
  { title: "Material and Surface Construction", description: "Compared documented substrate, edge construction, and finish care claims across MDF, particleboard, laminate, solid wood, veneer, and stone-look surfaces rather than judging durability from photography." },
  { title: "Installed Footprint and Assembly", description: "Weighed shipping weight, multi-box delivery, and assembly complexity against the table's stated dimensions before ranking, since larger conference tables often ship in more than one package." },
];

const sharedFaqPool = [
  { key: "seat-count-advertised", q: "Does the advertised seat count on a conference table match how many people actually fit?", a: "Not always. Manufacturers often count seats using minimal per-person edge space, so a table listed for 8 to 10 people may feel comfortable for 6 to 8 once laptops, notepads, and elbow room are accounted for. Check the table's actual length and depth against roughly 24 to 30 inches of edge space per seat before assuming the advertised count." },
  { key: "grommet-cable", q: "Does a cable grommet hole guarantee tidy cable management?", a: "A grommet hole only creates a pass-through point for wires; it does not route or organize cables on its own. Tables with a dedicated cable channel, in-leg routing, or a built-in power module keep cords genuinely tidy, while a bare grommet hole still requires the buyer to manage the run themselves." },
  { key: "assembly-package", q: "Why do some conference tables ship in more than one box?", a: "Larger conference tables, especially anything over roughly 6 feet, commonly ship in two or more packages to protect the tabletop and base during transit and to keep any single box within manageable shipping weight. The boxes can arrive on different days, so it is worth waiting for all of them before starting assembly." },
  { key: "mdf-particleboard-solid", q: "Is MDF or particle board construction a problem for a conference table?", a: "Not inherently. High-density MDF and particle board with a laminate or melamine finish are standard in this category and hold up well to daily commercial use. Solid wood, veneer over engineered wood, or steel-reinforced builds cost more and matter most where long-term durability or a premium look is the priority." },
  { key: "warranty-length", q: "What warranty should I expect on a conference table?", a: "Warranty terms vary widely in this category, from no stated warranty on some budget listings to a 1-year warranty on mid-range tables and multi-year coverage on commercial-grade systems from established office furniture brands. Check the specific listing rather than assuming a standard term." },
  { key: "power-outlet-source", q: "Do built-in power outlets on a conference table need a separate power source?", a: "Yes. A conference table's built-in AC outlets or USB ports still need to be wired into a wall circuit or floor power source; they are not battery powered. Confirm the table's power module can reach an outlet or your room's floor power box before installation, and check whether an electrician is needed for a hardwired connection." },
  { key: "weight-capacity", q: "How much weight can a typical conference table surface hold?", a: "Weight capacity varies by construction, with many MDF and particleboard tables in this category rated for normal laptop, monitor, and paperwork loads, while steel-reinforced or commercial-grade tables handle heavier daily use. Check the specific listing's stated capacity if you plan to place AV equipment or a large monitor array on the table." },
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

function bc(criterion, explanation) {
  return { criterion, explanation };
}

// ---------- parse raw articles ----------
const articles = raw.map((line) => {
  const [num, title, asinStr] = line.split("\t");
  const asins = asinStr.split("|").map((s) => s.trim()).filter(Boolean);
  return { num: Number(num), title: title.trim(), asins: [...new Set(asins)] };
});

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/’/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mainKeywordFor(title) {
  return title.replace(/^Best\s+/i, "").trim().toLowerCase();
}

// ---------- category classification ----------
function classify(title) {
  const t = title.toLowerCase();
  if (/with chairs/.test(t)) return "chairs";
  if (/collapsible|folding|flip top/.test(t)) return "folding";
  if (/on wheels|portable/.test(t)) return "mobility";
  if (/standing|adjustable/.test(t)) return "standing";
  if (/built-in power|with power outlets|with outlets|with cable management|modern conference tables with power|wood conference tables with power outlets/.test(t)) return "power";
  if (/expandable/.test(t)) return "expandable";
  if (/live-edge|live edge|solid wood|wood conference tables\b/.test(t) && !/power/.test(t)) return "material-wood";
  if (/walnut|mahogany|oak\b/.test(t)) return "material-wood";
  if (/glass|epoxy|marble|granite|quartz|concrete/.test(t)) return "material-stone";
  if (/steelcase|hon\b|herman miller|enwork|haworth|jsi|teknion|eames|tribesigns/.test(t)) return "brand";
  if (/\d+\s*(ft|-ft)\b/.test(t) || /\d+-inch/.test(t) || /\bfeet\b/.test(t)) return "length";
  if (/\d+[\s-]?(person|seater|seat)/.test(t)) return "seatcount";
  if (/rectangular|oval\b|boat shaped|square\b|racetrack|d shaped|trapezoid|round conference|u-shaped|u shaped/.test(t)) return "shape";
  if (/modern|black\b|white\b|gray\b|executive|industrial|luxury|rustic/.test(t)) return "style";
  if (/large|boardroom/.test(t)) return "large";
  if (/small/.test(t)) return "small";
  if (/for office/.test(t)) return "office";
  return "generic";
}

// ---------- howToChoose + faq template builders ----------
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function buildHowToChoose(cat, kw, title) {
  const K = kw;
  switch (cat) {
    case "generic":
    case "office":
      return [
        { subheading: "Count Usable Seating Zones, Not Just Length", note: `Measure how many people can actually sit at the table with roughly 24 to 30 inches of edge space each, rather than trusting a ${K}'s advertised seat count at face value.` },
        { subheading: "Check Base and Knee Clearance", note: "Confirm where legs, pedestals, or center supports fall relative to seat positions, since a base placed at the wrong point can block knee room for the people sitting closest to it." },
        { subheading: "Plan Room Circulation Around the Table", note: "Leave at least 36 inches of clearance between the table edge and the wall or nearest furniture so chairs can push back and people can walk around during a meeting." },
        { subheading: "Verify Power, Data, and AV Paths", note: "Check whether cable grommets, built-in outlets, or a dedicated AV path exist, and trace that path from the table surface to where power actually reaches the room." },
        { subheading: "Weigh Structural Build and Serviceability", note: "Compare substrate, base material, and stated weight capacity, and factor in assembly complexity and multi-box shipping before ranking a table on price alone." },
      ];
    case "chairs":
      return [
        { subheading: "Match Table Height to Chair Height", note: `Confirm the ${K} bundle pairs a standard 29 to 30 inch table height with chairs whose seat height and armrests actually clear the table's apron.` },
        { subheading: "Check Chair Width Against Seat Count", note: "Multiply chair width plus elbow room by the advertised seat count and compare that to the table's actual length, since a wide chair can reduce how many people realistically fit." },
        { subheading: "Measure the Occupied Footprint", note: "Account for chairs pulled out and swiveling, not just the table's static footprint, when planning room clearance." },
        { subheading: "Verify Chair Mobility and Floor Protection", note: "Check caster type against your flooring, since hard casters on hardwood or carpet casters on tile can both cause problems over time." },
        { subheading: "Confirm Bundle Service and Replacement Parts", note: "Check whether the table and chairs ship and are warrantied as one bundle or as separate items, since replacing a single damaged chair can be harder if the set isn't sold as individual components." },
      ];
    case "folding":
      return [
        { subheading: "Understand the Folding Mechanism", note: `Check whether the ${K}'s top folds flat, flips vertically, or nests, since each mechanism affects how much floor space it actually saves and how quickly it resets.` },
        { subheading: "Verify Nested Storage Footprint", note: "Measure the table's folded footprint, not just its open dimensions, against the closet or storage area where it will actually live between uses." },
        { subheading: "Check Locks and Casters", note: "Confirm the folding legs lock securely in both open and closed positions, and check whether casters lock independently to prevent the table from rolling during a meeting." },
        { subheading: "Test Alignment When Joining Multiple Units", note: "If multiple tables will be joined into a longer run or U-shape, check how cleanly the tops align and lock together at the seams." },
        { subheading: "Time the Reset Between Configurations", note: "Factor in how long it realistically takes one or two people to fold, move, and reconfigure the table, since a mechanism that looks quick in marketing photos can be slower with real hardware." },
      ];
    case "material-wood":
      return [
        { subheading: "Identify the Actual Construction Type", note: `Check whether the ${K} uses solid wood, wood veneer over engineered substrate, or a wood-look laminate, since these age and repair very differently over years of daily use.` },
        { subheading: "Check Top and Substrate Thickness", note: "Publish tabletop thickness and substrate material, since a thin veneer over particleboard performs differently under daily wear than a genuine solid-wood or thick engineered top." },
        { subheading: "Compare Repairability", note: "Solid wood can typically be sanded and refinished after years of scratches, while laminate and thin veneer generally cannot; factor this into the long-term cost of ownership." },
        { subheading: "Verify Cleaning and Moisture Guidance", note: "Check the manufacturer's specific cleaning guidance, since solid wood needs different care than a sealed laminate surface, particularly around spills and humidity." },
        { subheading: "Account for Shipping Weight", note: "Genuine solid wood tables weigh meaningfully more than engineered-wood equivalents, which affects delivery method, assembly labor, and whether the floor or base needs reinforcement." },
      ];
    case "material-stone":
      return [
        { subheading: "Verify Material Authenticity", note: `Confirm whether the ${K}'s surface is genuine stone, engineered stone, tempered glass, or a printed laminate look, since the label alone doesn't guarantee the material.` },
        { subheading: "Check Top and Substrate Thickness", note: "Publish surface thickness and supporting substrate, since a thin stone-pattern laminate behaves very differently than a genuine slab or engineered-stone top." },
        { subheading: "Compare Stain and Heat Behavior", note: "Check manufacturer care guidance for staining, etching, and heat tolerance, since genuine stone, engineered stone, glass, and laminate all react differently to daily office use." },
        { subheading: "Inspect Edge and Seam Repair Options", note: "Ask how a chipped edge or visible seam gets repaired, particularly on larger tables where a single continuous slab isn't practical." },
        { subheading: "Calculate Weight Against the Base and Floor", note: "Genuine stone and thick glass tops are significantly heavier than laminate equivalents and may need a reinforced base or careful floor-loading consideration." },
      ];
    case "brand": {
      const brand = title.match(/best\s+([a-z]+)/i)?.[1] || "this brand";
      return [
        { subheading: `Map ${brand}'s Current Series`, note: `Check which ${brand} conference table series is currently offered rather than assuming a discontinued model's specs still apply, since office furniture brands regularly refresh product lines.` },
        { subheading: "Compare Size and Shape Range", note: `Confirm the specific length, shape, and seat-count options ${brand} offers in this line, since brand names often cover multiple table families with different capabilities.` },
        { subheading: "Check Power and Cable Architecture", note: "Verify whether power and data modules are integrated into the base, routed through the top, or sold as an add-on accessory, since this varies by series." },
        { subheading: "Review Materials and Base Choices", note: "Compare laminate, veneer, and base finish options within the line, since brand-name tables often span a wide price range depending on material tier." },
        { subheading: "Confirm Planning and Warranty Support", note: `Check what design or space-planning support and warranty terms come with a ${brand} purchase, since commercial furniture brands often provide more of both than budget importers.` },
      ];
    }
    case "length":
      return [
        { subheading: "Verify Actual Length Against the Listing", note: `Measure the ${K}'s actual stated length rather than assuming round marketing numbers are exact, since "10 ft" and similar labels can be approximate.` },
        { subheading: "Check Top Depth, Not Just Length", note: "A long table with shallow depth still limits what can comfortably sit on the surface at once, so check width or depth alongside the headline length figure." },
        { subheading: "Map Seat Zones Along the Length", note: "Divide the table's length by roughly 24 to 30 inches per seat to estimate genuinely usable seating, rather than trusting an advertised capacity number alone." },
        { subheading: "Check Base and Seam Placement", note: "Longer tables often ship in sections; check where seams and center supports fall so they don't interrupt a seat position or block knee room." },
        { subheading: "Confirm the Occupied Footprint Fits the Room", note: "Account for chairs pulled out on both long sides plus at least 36 inches of walking clearance when checking this length against your actual room dimensions." },
      ];
    case "seatcount":
      return [
        { subheading: "Verify the Seat Count Against Real Dimensions", note: `Check the ${K}'s actual length and depth against roughly 24 to 30 inches of edge space per seat, since advertised capacity can assume tighter spacing than is comfortable in practice.` },
        { subheading: "Check Per-Seat Edge Space", note: "Divide the table's usable length by the advertised seat count to estimate real per-person space, rather than trusting the headline number alone." },
        { subheading: "Confirm Laptop and Notepad Depth", note: "Check the table's depth provides enough room for a laptop or notepad plus a water glass without crowding the next seat over." },
        { subheading: "Check Base Interference at End Seats", note: "Confirm pedestal or leg placement doesn't block knee room for whoever sits at the ends or corners closest to the base." },
        { subheading: "Measure the Occupied Footprint for the Room", note: "Account for chairs pulled out on every side, not just the table's static footprint, when confirming this seat count actually fits your meeting room." },
      ];
    case "power":
      return [
        { subheading: "Verify Genuine User Outlet Access", note: `Confirm the ${K} gives each seat real reach to an outlet, not just one power module at a single end of a long table.` },
        { subheading: "Check AC and USB-C Output", note: "Verify the specific mix of AC outlets and USB-A or USB-C ports, and confirm USB ports deliver enough wattage for laptop charging rather than just phone-level output." },
        { subheading: "Trace the Infeed Path", note: "Check how power reaches the table itself, whether through a floor box, wall outlet with a visible cord, or an in-leg raceway, since this affects how tidy the final installation looks." },
        { subheading: "Confirm the Data and AV Path", note: "If the room needs HDMI, Ethernet, or a video conferencing hub at the table, check whether the built-in module supports that or only handles basic power." },
        { subheading: "Check Module Replacement and Repair", note: "Ask whether a damaged or outdated power module can be swapped out on its own, since built-in electronics tend to need replacement before the table itself wears out." },
      ];
    case "standing":
      return [
        { subheading: "Confirm the Height-Adjustment Type", note: `Check whether the ${K} uses a manual crank, pneumatic lift, or electric motor, since these differ meaningfully in adjustment speed and long-term reliability.` },
        { subheading: "Check the Full Height Range", note: "Verify the table adjusts from a genuine seated height (around 28 to 30 inches) to a genuine standing height (around 42 to 46 inches), not just a narrow mid-range." },
        { subheading: "Test Stability Under a Loaded Top", note: "Check the table's rated weight capacity and wobble resistance at full height with monitors, laptops, and paperwork loaded, not just when empty." },
        { subheading: "Verify Cable Travel Through the Height Range", note: "Confirm cords have enough slack or a cable chain to move through the full height travel without pulling taut or disconnecting." },
        { subheading: "Check Chair or Stool Compatibility", note: "If the room mixes sitting and standing use, confirm chair height range works at the table's lowest setting and stool height works at its highest." },
      ];
    case "expandable":
      return [
        { subheading: "Check Collapsed and Expanded Dimensions", note: `Verify both the collapsed and fully expanded size of the ${K}, since the compact footprint matters as much as the maximum capacity for everyday use.` },
        { subheading: "Check Leaf Storage", note: "Confirm where any extension leaf stores when not in use, and whether it needs a separate closet or storage area away from the table itself." },
        { subheading: "Inspect Seam Alignment When Expanded", note: "Check how cleanly the surface aligns at the extension seam, since a mismatched seam is more noticeable on a conference table than a casual dining table." },
        { subheading: "Verify Base Movement During Expansion", note: "Confirm whether the base or legs need to be repositioned during expansion, since some mechanisms require moving the frame rather than sliding a self-contained leaf." },
        { subheading: "Confirm Power Continuity When Expanded", note: "If the table includes cable grommets or power modules, check whether they still function correctly once the table is extended to its full length." },
      ];
    case "shape":
      return [
        { subheading: "Understand the Shape's Actual Geometry", note: `Get the ${K}'s full footprint at its widest and narrowest points, not just a single headline dimension, since a shaped table's usable area varies more than a simple rectangle's.` },
        { subheading: "Map Seat Positions to the Shape", note: "Check where the shape naturally creates seat positions and where it creates dead space, since curves and angles don't distribute usable edge evenly." },
        { subheading: "Verify Sightlines Around the Shape", note: "Confirm the shape actually improves eye contact and sightlines between participants, which is the main reason to choose a non-rectangular table over a straight one." },
        { subheading: "Check Base Interference With the Shape", note: "Confirm pedestal or leg placement doesn't intrude into knee space at the shape's tightest points, particularly at curves or corners." },
        { subheading: "Confirm the Shape Fits the Room", note: "Measure the full bounding box the shape occupies, since curved or angled tables often need more total floor space than their headline length suggests." },
      ];
    case "mobility":
      return [
        { subheading: "Check Loaded Rolling Weight", note: `Confirm the ${K} still rolls smoothly once loaded with laptops and paperwork, not just when empty, since caster performance changes meaningfully under real weight.` },
        { subheading: "Verify Casters and Brakes", note: "Check caster type against your flooring and confirm each caster locks independently, since a table that rolls unexpectedly during a meeting is a real hazard." },
        { subheading: "Confirm Door and Threshold Clearance", note: "Measure doorway widths and any thresholds along the path the table will travel, since a mobile table is only useful if it can actually reach the rooms it needs to." },
        { subheading: "Check Cable Disconnect for Moves", note: "If the table includes any built-in power or data connections, confirm how quickly they can be disconnected before a move without damaging the cable or port." },
        { subheading: "Verify Parking Stability", note: "Once positioned and locked, confirm the table doesn't wobble or shift during normal meeting use, since a mobility-focused design can trade off some rigidity versus a fixed table." },
      ];
    case "large":
      return [
        { subheading: "Check Full Length and Depth", note: `Get the ${K}'s complete length and depth, not just a rounded marketing figure, since large conference tables often ship in sections that affect the true installed dimension.` },
        { subheading: "Check Section Seams", note: "Confirm how the tabletop's sections join together and how visible the seams are once assembled, since a large table is more likely to ship in multiple top pieces." },
        { subheading: "Verify Base Span and Support", note: "Check how many legs or pedestals support the table's length, since a long unsupported span can flex or wobble without enough base points." },
        { subheading: "Plan Room Circulation", note: "Leave at least 36 to 48 inches of clearance around a large table's perimeter so chairs can push back and people can walk around comfortably during a meeting." },
        { subheading: "Plan Delivery and Installation", note: "Factor in freight delivery, multi-person assembly, and doorway or elevator clearance for a table of this scale, not just the sticker price." },
      ];
    case "small":
      return [
        { subheading: "Verify Actual Usable Seating", note: `Measure how many people genuinely fit around the ${K} with real elbow room, since a small table's advertised capacity can assume tighter spacing than is comfortable.` },
        { subheading: "Check the Room Fit, Not Just the Table", note: "Confirm the table's footprint plus chair clearance actually fits your specific room, since small conference tables are often bought for genuinely tight spaces." },
        { subheading: "Check Base and Knee Clearance", note: "Confirm leg or pedestal placement doesn't block knee room, which matters more on a small table where there's less total space to work with." },
        { subheading: "Verify Cable Access at Close Range", note: "Check that any grommet or power access is reachable from every seat, since a small table puts everyone close to the center." },
        { subheading: "Weigh Multi-Purpose Use", note: "Many small conference tables double as a huddle table or home-office desk; confirm the height and surface size work for that secondary use if relevant." },
      ];
  }
  // default fallback (shouldn't hit)
  return [
    { subheading: "Count Usable Seating Zones", note: `Measure real per-seat edge space on the ${K} rather than trusting the advertised capacity alone.` },
    { subheading: "Check Base and Knee Clearance", note: "Confirm leg and pedestal placement doesn't block knee room for nearby seats." },
    { subheading: "Plan Room Circulation", note: "Leave enough clearance around the table for chairs to push back and people to walk around." },
    { subheading: "Verify Power and Cable Paths", note: "Trace cable grommets or built-in outlets from the table surface to an actual power source." },
    { subheading: "Weigh Structural Build", note: "Compare substrate, base material, and shipping weight before ranking on price alone." },
  ];
}

function buildBespokeFaq(cat, kw, title) {
  const K = kw;
  switch (cat) {
    case "chairs":
      return [
        { q: `Do ${K} sets include enough chairs for the table's advertised capacity?`, a: `Check the specific listing closely, since some sets include fewer chairs than the table's maximum rated seating (for example, room for 10 people but only 8 chairs included), leaving buyers to source extra chairs separately.` },
        { q: "Can I mix and match a different chair with a conference table and chairs set?", a: "Yes, nothing stops you from swapping in your own chairs, but check the table's height (typically 29 to 30 inches) against your preferred chair's seat height and armrest clearance first." },
      ];
    case "folding":
      return [
        { q: `How much floor space does a ${K} actually save when folded?`, a: "It depends on the mechanism. Flip-top designs that fold vertically save the most floor footprint, while simple leg-fold tables still occupy nearly their full length when stored, just at a lower profile." },
        { q: "Can folding conference tables be joined together for a larger meeting?", a: "Many can, especially models designed with modular splicing in mind, letting several units combine into a U-shape or long row, though check the specific listing for compatible connection points before assuming any two folding tables will align." },
      ];
    case "material-wood":
      return [
        { q: `Is a ${K} solid wood all the way through, or just a veneer?`, a: "Check the listing's material description closely. Some tables use genuine solid wood or a real wood veneer over engineered substrate, while others achieve a similar look with wood-grain laminate; the three age and repair very differently over years of use." },
        { q: "Can a scratched wood conference table be refinished?", a: "Solid wood and thick veneer can typically be sanded and refinished to remove scratches, while laminate and thin veneer generally cannot; factor this into long-term maintenance expectations before buying." },
      ];
    case "material-stone":
      return [
        { q: `Is a ${K} genuine stone or an engineered look-alike?`, a: "Many listings in this category use engineered stone, tempered glass, or a printed laminate finish designed to resemble natural stone at a fraction of the weight and cost; check the material description before assuming any table is a genuine slab." },
        { q: "Does a stone or glass conference table need special cleaning?", a: "Generally yes for genuine or engineered stone, which can require stone-safe cleaners to avoid etching, while laminate look-alike surfaces clean like any standard laminate table. Check the manufacturer's specific care guidance." },
      ];
    case "brand": {
      const brand = title.match(/best\s+([a-z]+)/i)?.[1] || "this brand";
      return [
        { q: `Are ${brand} conference tables sold new or mainly through resellers?`, a: `Both. Some listings are new-stock from authorized dealers while others are refurbished or open-box units sold through third-party sellers; check the specific listing's condition and seller before assuming it's new.` },
        { q: `Do ${brand} conference tables cost more than generic imported tables?`, a: `Generally yes, since established commercial furniture brands typically charge a premium for design support, warranty coverage, and consistent manufacturing versus budget imported tables, though the price gap varies by series and finish.` },
      ];
    }
    case "length":
      return [
        { q: `Is the length on a ${K} exact or a rounded marketing figure?`, a: "Check the listing's precise dimensions in inches rather than trusting a rounded foot measurement, since actual lengths often land a fraction of an inch off the marketed round number." },
        { q: "How much room clearance does this table length need around it?", a: "Plan for at least 36 inches of clearance beyond the table's edge on all sides so chairs can push back fully and people can walk around during a meeting." },
      ];
    case "seatcount":
      return [
        { q: `Does the advertised seat count on this ${K} match real comfortable seating?`, a: "Check the table's actual length against roughly 24 to 30 inches of edge space per seat, since some listings count seats using tighter spacing than most buyers would find comfortable for a full-length meeting." },
        { q: "What table length do I need for this many seats?", a: "As a rough guide, multiply your target seat count by 24 to 30 inches per seat, then add extra length for any seats at the table ends, to estimate the minimum usable table length." },
      ];
    case "power":
      return [
        { q: `Do the outlets on a ${K} work without being plugged into a wall?`, a: "No. Built-in AC outlets and USB ports still need to connect to a wall circuit or floor power box; they are not battery powered, so confirm the table's power cord or infeed can reach an actual outlet." },
        { q: "Can a damaged power module be replaced without buying a new table?", a: "On some tables yes, if the module is a self-contained, swappable unit; on others the electronics are integrated into the base and harder to service separately. Check the listing or manufacturer support before assuming either way." },
      ];
    case "standing":
      return [
        { q: `Does a ${K} adjust with a crank, a lever, or an electric motor?`, a: "This varies by listing. Manual crank and pneumatic lever mechanisms are common on budget standing conference tables, while electric motorized lift is more common on premium models and adjusts faster with less physical effort." },
        { q: "How stable is a standing conference table at full height with a monitor on it?", a: "Check the table's stated weight capacity and any anti-wobble or stability features, since a table that feels solid empty can flex noticeably once loaded with monitors and equipment at its tallest setting." },
      ];
    case "expandable":
      return [
        { q: `How much bigger does an ${K} get when fully extended?`, a: "Check the listing for both collapsed and expanded dimensions specifically, since the difference between the two varies significantly by model, from a modest leaf addition to nearly doubling the table's length." },
        { q: "Where does the extension leaf store when not in use?", a: "This depends on the design; some leaves store flat underneath the table itself, while others require separate storage space nearby. Check the listing for specifics before assuming built-in storage is included." },
      ];
    case "shape":
      return [
        { q: `Does a ${K} need more floor space than a straight rectangular table?`, a: "Usually yes at its widest point. Measure the shape's full bounding box, not just its headline length, against your available floor space before assuming it fits the same footprint as a rectangular table." },
        { q: "Does the shape actually improve sightlines during a meeting?", a: "Curved and angled shapes generally do improve eye contact by reducing the length everyone has to see across compared to a long rectangle, but the improvement depends on the specific curve or angle and total table size." },
      ];
    case "mobility":
      return [
        { q: `Can a ${K} be moved by one person?`, a: "It depends on the table's weight and caster quality; lighter folding tables with quality casters can often be moved solo, while larger or heavier mobile tables are easier and safer to move with two people." },
        { q: "Do the wheels on a mobile conference table scratch hardwood floors?", a: "It depends on the caster material; hard plastic or metal casters can mark softer flooring over time, so check whether the specific table uses floor-protective casters if it will be rolled across hardwood or laminate floors regularly." },
      ];
    case "large":
      return [
        { q: `Does a ${K} ship as one piece or in sections?`, a: "Large conference tables commonly ship with the tabletop in two or more sections that join on site, since a single oversized piece would be impractical to ship and maneuver into most rooms." },
        { q: "How many people does a large conference table actually seat comfortably?", a: "Divide the table's usable length by roughly 24 to 30 inches per seat to estimate real comfortable capacity, since a large table's marketed seat count can assume tighter spacing than most buyers prefer." },
      ];
    case "small":
      return [
        { q: `How many people can realistically sit at a ${K}?`, a: "Most small conference tables in this category comfortably seat 4 to 6 people once real elbow room is accounted for, even when some listings market a higher maximum count." },
        { q: "Can a small conference table double as an office desk?", a: "Many can, since small conference tables and desks share similar height and surface dimensions, though check whether the table's depth suits a monitor and keyboard setup if you plan to use it that way." },
      ];
    default:
      return [
        { q: `What size room does a ${K} need?`, a: "Plan for the table's full footprint plus at least 36 inches of clearance on all sides so chairs can push back and people can walk around comfortably during a meeting." },
        { q: `How many people does a ${K} actually seat?`, a: "Check the table's real length and depth against roughly 24 to 30 inches of edge space per seat rather than trusting the advertised capacity number alone, since some listings count seats more tightly than is comfortable in practice." },
      ];
  }
}

// ---------- assign badges based on position + shape/material hints in ASIN order ----------
function badgesForPicks(pickCount) {
  const arr = [];
  for (let i = 0; i < pickCount; i++) arr.push(badgeFor(i, pickCount));
  return arr;
}

// ---------- build articleMeta ----------
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
  const badges = badgesForPicks(count);
  const picksRaw = a.asins.map((asin, i) => pick(asin, badges[i]));
  const picks = picksRaw.filter(Boolean);
  // re-badge after filtering nulls so "Best Overall" / "Budget Pick" stay correct
  picks.forEach((p, i) => { p.badge = badgeFor(i, picks.length); });

  const introByCase = {
    generic: [
      `A conference table needs to work as real shared workspace for a group, not just as a large flat surface with a nice finish, and most listings only publish overall length and width.`,
      `We compared this cluster's current lineup on usable seating zones, base and knee clearance, and power or cable routing, since a long table doesn't guarantee a usable meeting surface once real seats and cables are accounted for.`,
    ],
    office: [
      `An office conference table needs to fit real meetings, real chairs, and real cable routing, not just look good in a listing photo.`,
      `We compared usable seating zones, base and knee clearance, and cable routing across this cluster's current office lineup before ranking, since generic dimensions don't guarantee a usable meeting surface.`,
    ],
    chairs: [
      `A conference table and chairs bundle needs the two pieces to actually work together, with enough per-seat width and chair clearance to match the table's advertised capacity.`,
      `We checked table and chair compatibility, occupied footprint once chairs are pulled out, and bundle service across this cluster before ranking, since a wide table with narrow chair spacing can still feel cramped.`,
    ],
    shape: [
      `A ${kw.includes("shape") || kw.includes("shaped") ? kw : kw + " table"}'s geometry changes seat positions, sightlines, and base interference more than a simple rectangular table, but most listings only publish a single headline dimension.`,
      `We measured full shape geometry, seat positions, and base interference across this cluster's current lineup, since a shape's usable area is rarely distributed the way a single length figure suggests.`,
    ],
    folding: [
      `A folding or flip-top conference table needs a mechanism that actually locks securely and resets quickly, not just a fold that looks smooth once in a showroom demo.`,
      `We compared mechanism type, nested storage footprint, and locks or casters across this cluster's current lineup, since a folding table's real value depends on how it performs after repeated daily setup and teardown.`,
    ],
    "material-wood": [
      `Wood construction on a conference table can mean solid wood, veneer, or wood-look laminate, and each ages and repairs very differently over years of daily use.`,
      `We verified construction type, top and substrate thickness, and repairability across this cluster's current lineup, since a wood-tone finish alone doesn't tell you what's actually underneath the surface.`,
    ],
    "material-stone": [
      `A stone or stone-look conference table surface needs material verification, since the same visual style can come from genuine stone, engineered stone, tempered glass, or a printed laminate finish.`,
      `We checked material authenticity, top and substrate thickness, and stain or heat behavior across this cluster's current lineup, since these surfaces react very differently to daily office use.`,
    ],
    brand: [
      `Brand-name conference tables need a current-series check, since office furniture manufacturers regularly update their lineups and a familiar name can span very different table families.`,
      `We mapped current series options, power and cable architecture, and material and base choices across this cluster before ranking, since brand recognition alone doesn't guarantee the specific table fits your room.`,
    ],
    length: [
      `An exact-length conference table needs its stated dimension verified, since round marketing figures like this one can be approximate rather than the table's precise measurement.`,
      `We checked actual length, top depth, and seat zones across this cluster's current lineup, since a headline length figure alone doesn't tell you how many people genuinely fit comfortably.`,
    ],
    seatcount: [
      `A conference table's advertised seat count needs verification against its actual length and depth, since manufacturers sometimes count seats using tighter per-person spacing than most buyers find comfortable.`,
      `We checked verified seat count, per-seat edge space, and base interference across this cluster's current lineup, since a table marketed for a certain number of people doesn't always leave enough room once real chairs are pulled up.`,
    ],
    power: [
      `A conference table with built-in power needs the outlets to actually be reachable from real seats, not just present somewhere on the table.`,
      `We checked user outlet access, AC and USB-C output, and the infeed path back to an actual power source across this cluster's current lineup, since a power module alone doesn't guarantee usable charging at every seat.`,
    ],
    standing: [
      `A standing or height-adjustable conference table needs a genuine, verified height range and stable mechanism, not just a marketing label suggesting adjustability.`,
      `We checked height type and range, loaded stability, and cable travel through the full height range across this cluster's current lineup before ranking.`,
    ],
    style: [
      `Style-driven conference tables should be evaluated through actual construction details and durability, since the same visual style label can be achieved with very different underlying materials.`,
      `We checked style construction, durability, and knee clearance across this cluster's current lineup, since a striking finish doesn't guarantee the table holds up to daily meeting-room use.`,
    ],
    mobility: [
      `A mobile conference table needs to roll smoothly and lock securely under real load, not just when empty in a showroom.`,
      `We checked loaded rolling weight, caster and brake quality, and parking stability across this cluster's current lineup before ranking.`,
    ],
    expandable: [
      `An expandable conference table needs both its collapsed and fully extended dimensions verified, since the everyday footprint matters as much as the maximum capacity.`,
      `We checked collapsed and expanded size, leaf storage, and seam alignment across this cluster's current lineup before ranking.`,
    ],
    large: [
      `A large or boardroom conference table needs its full length, section seams, and base span verified, since tables at this scale commonly ship in multiple pieces that assemble on site.`,
      `We checked length and depth, section seams, and base span across this cluster's current lineup, since a large table's real capacity depends on more than a single headline dimension.`,
    ],
    small: [
      `A small conference table needs genuinely usable seating verified, not just a compact footprint that looks efficient in a listing photo.`,
      `We checked actual usable seating, room fit, and base and knee clearance across this cluster's current lineup, since a small table's advertised capacity can assume tighter spacing than is comfortable.`,
    ],
  };

  const intro = introByCase[cat] || introByCase.generic;
  const howToChoose = buildHowToChoose(cat, kw, a.title);
  const bespoke = buildBespokeFaq(cat, kw, a.title);
  const faq = fillFaq(bespoke, 5);

  const metaTitle = `${a.title} 2026`;
  const metaDescription = `We compared ${kw} by usable seating zones, base and cable clearance, and material construction rather than ranking by appearance or price alone.`;

  articleMeta[slug] = {
    title: `${count >= 4 ? count : ""} Best ${a.title.replace(/^Best\s+/i, "")} in 2026`.replace(/^\s+/, ""),
    metaTitle, metaDescription, mainKeyword: kw,
    intro, picks, howToChoose, faq, related: [], _cat: cat, _num: a.num,
  };
}

// assign related slugs: pick 3 others sharing category, else generic fallback
const allSlugs = Object.keys(articleMeta);
for (const slug of allSlugs) {
  const meta = articleMeta[slug];
  const sameCat = allSlugs.filter((s) => s !== slug && articleMeta[s]._cat === meta._cat);
  const pool = sameCat.length >= 3 ? sameCat : [...sameCat, ...allSlugs.filter((s) => s !== slug && !sameCat.includes(s))];
  meta.related = pool.slice(0, 3);
}

// ---------- write files ----------
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

fs.writeFileSync("scripts/_conftbl_slug_list.txt", allSlugs.join(" "));
console.log("wrote", written, "guide files");
