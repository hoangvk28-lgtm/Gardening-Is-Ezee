import fs from "fs";
import { P } from "./srack-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-srack.json", "utf8"));
const raw = fs.readFileSync("scripts/_srack_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Rail Depth Checked Against Nominal U-Height", description: "Verified adjustable or fixed mounting depth separately from rack height, since a tall rack with shallow rails won't fit a deep server chassis." },
  { title: "Mount Type and Load Rating Cross-Checked", description: "Confirmed whether a weight rating applied to stationary, rolling, or wall-mounted installation, since these are documented separately and aren't interchangeable." },
  { title: "Post Configuration Matched to Equipment Class", description: "Checked whether a 2-post or 4-post frame actually supports the equipment class in question, not just the U-height." },
  { title: "Cooling Method Verified Against Enclosure Type", description: "Distinguished passive open-frame airflow from active fan cooling from sealed-cabinet thermal management before assuming any rack could handle a dense equipment load." },
  { title: "Real Accessory and Hardware Inclusion Checked", description: "Verified which shelves, PDUs, casters, and mounting hardware actually ship in the box versus what's sold separately." },
];

const sharedFaqPool = [
  { key: "rail-depth-nominal-height", q: "Does a rack's U-height tell me whether my server will actually fit?", a: "No. U-height only measures vertical rack space. Whether a server physically fits also depends on the rail-to-rail mounting depth and the clearance behind the rack for cables and rear panel access, so check adjustable depth range separately from U-height before buying." },
  { key: "stationary-rolling-wall-load", q: "Is a rack's weight capacity the same whether it's on wheels, on the floor, or on a wall?", a: "No. Manufacturers document these as separate ratings, and they can differ substantially, a rack rated for 500 lbs stationary might drop to 300-400 lbs on casters, and a wall-mount rating is typically far lower than either floor option since it depends on the wall structure, not just the rack." },
  { key: "wall-anchor-limits", q: "If a wall-mount rack is rated for 130 lbs, can I always mount it at that weight?", a: "Only if the wall itself can support it. The rack's rating assumes a solid structural mounting point like wall studs; drywall alone typically can't support a fully loaded network cabinet, so the wall's actual construction, not just the rack's spec sheet, sets the real limit." },
  { key: "2post-vs-4post", q: "What's the practical difference between a 2-post and 4-post rack?", a: "A 4-post rack supports equipment along its full depth with front and rear rails, making it suitable for heavier servers and full-depth chassis, while a 2-post rack only supports the front mounting points, which works fine for lighter switches and patch panels but isn't rated for deep, heavy server hardware." },
  { key: "rack-fan-sealed-room", q: "Will adding fans to my server rack cool down a small closet or sealed room?", a: "Not by itself. Rack fans move air within or around the enclosure, but if the room itself has no way to exhaust heat, the fans are just recirculating warm air. A genuinely sealed space needs either room-level ventilation or a dedicated cooling unit, not just rack-mounted fans." },
  { key: "pdu-branch-circuit", q: "Do I need to think about my home's electrical circuit before adding a rack PDU?", a: "Yes, especially for a dense home lab. A PDU distributes outlets but doesn't increase how much power your branch circuit can actually deliver, so total continuous load across all rack equipment should stay well under the circuit's rated capacity to avoid nuisance trips or, worse, an overloaded circuit." },
  { key: "home-rack-noise-heat", q: "Why do server racks marketed for home use specifically mention noise levels?", a: "Because a rack living in a bedroom, office, or shared living space needs to be judged on more than raw performance. Fan noise and heat output that would be unremarkable in a dedicated server room can be genuinely disruptive in a home, so noise dBA ratings and passive cooling options matter more for home lab buyers than for commercial installs." },
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
    asin, badge: badgeText, name: info.name, price: meta.price || "Check price",
    rating: meta.rating, reviews: meta.reviewCount, imageUrl: meta.image,
    amazonUrl: `https://www.amazon.com/dp/${asin}?tag=theofficejournal-20`,
    description: info.p1 + (info.p2 ? "\n\n" + info.p2 : ""), specs: info.specs, pros: info.pros, cons: info.cons || [],
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

function classify(t0) {
  const t = t0.toLowerCase();
  if (/startech/.test(t)) return "startech";
  if (/navepoint/.test(t)) return "navepoint";
  if (/tecmojo/.test(t)) return "tecmojo";
  if (/vevor/.test(t)) return "vevor";
  if (/sysracks/.test(t)) return "sysracks";
  if (/tripp lite/.test(t)) return "tripplite";
  if (/soundproof|quiet/.test(t)) return "quiet";
  if (/outdoor/.test(t)) return "outdoor";
  if (/air-conditioned/.test(t)) return "aircon";
  if (/fans?\b/.test(t) && !/cooling/.test(t)) return "fans";
  if (/cooling/.test(t)) return "cooling";
  if (/wood/.test(t)) return "wood";
  if (/white/.test(t)) return "white";
  if (/keyboard tray/.test(t)) return "keyboardtray";
  if (/drawers?/.test(t)) return "drawers";
  if (/cable management/.test(t)) return "cablemgmt";
  if (/shelves/.test(t)) return "shelves";
  if (/rails/.test(t)) return "rails";
  if (/pdus?\b/.test(t)) return "pdu";
  if (/power strips?/.test(t)) return "powerstrip";
  if (/wall.?mount/.test(t)) return "wallmount";
  if (/vertical/.test(t)) return "vertical";
  if (/desktop/.test(t)) return "desktop";
  if (/mini|10-inch/.test(t)) return "mini";
  if (/two post|2 post/.test(t)) return "2post";
  if (/4 post/.test(t)) return "4post";
  if (/open-frame/.test(t)) return "openframe";
  if (/enclosed|cabinet/.test(t)) return "cabinet";
  if (/rolling|wheels|mobile|portable/.test(t)) return "mobile";
  if (/lockable|locking/.test(t)) return "locking";
  if (/homelab|home lab/.test(t)) return "homelab";
  if (/for home\b/.test(t)) return "home";
  if (/office/.test(t)) return "office";
  if (/budget/.test(t)) return "budget";
  if (/deep\b/.test(t)) return "deep";
  if (/floor standing/.test(t)) return "floorstanding";
  if (/nas\b/.test(t)) return "nas";
  if (/network\b/.test(t)) return "network";
  if (/half\b/.test(t)) return "half";
  if (/\d+u\b/.test(t)) return "sizeclass";
  return "generic";
}

const brandAngle = (brand) => [
  `verifying which ${brand} models are actually current rather than assuming an older listing reflects today's lineup`,
  `checking ${brand}'s documented weight rating by mount type, since stationary, rolling, and wall figures differ`,
  `matching ${brand}'s rail depth to real equipment length rather than trusting U-height alone`,
];

const ANGLE_BY_CAT = {
  sizeclass: [
    "matching rail depth and post configuration to the U-height, not just counting rack units",
    "checking whether the frame is 2-post or 4-post before assuming the U-height alone decides fit",
    "confirming the stationary weight rating actually applies to the equipment planned for this height",
    "verifying adjustable depth range covers real server length rather than trusting the nominal size",
    "leaving enough rear clearance for cabling instead of measuring only the equipment's raw depth",
    "separating what ships fully assembled from what needs a genuine flat-pack build session",
  ],
  startech: brandAngle("StarTech"), navepoint: brandAngle("NavePoint"), tecmojo: brandAngle("Tecmojo"),
  vevor: brandAngle("VEVOR"), sysracks: brandAngle("Sysracks"), tripplite: brandAngle("Tripp Lite"),
  quiet: "weighing documented noise reduction and fan behavior instead of trusting a marketing percentage",
  outdoor: "verifying real IP-rated weatherproofing rather than assuming any enclosed cabinet handles outdoor exposure",
  aircon: "distinguishing an actual rack-mount A/C unit from passive fans that only recirculate existing heat",
  fans: "checking documented CFM and dBA at actual operating speed, not just a peak airflow number",
  cooling: "separating active fan-driven cooling from passive open-frame airflow before trusting a cooling claim",
  wood: "weighing furniture-grade build against the equipment protection a steel rack provides",
  white: "confirming the same weight rating and hardware apply regardless of finish color",
  keyboardtray: "checking pull-out depth and reinforcement against the rack's actual clearance",
  drawers: "verifying documented weight rating and lock type rather than assuming all drawers are equal",
  cablemgmt: "matching cable management capacity to the number of runs a rack will actually carry",
  shelves: "checking shelf depth and weight rating against the specific non-rack gear being stored",
  rails: "verifying adjustable depth range and weight rating rather than assuming one rail fits all racks",
  pdu: "confirming outlet count and continuous amperage against the home circuit actually feeding the rack",
  powerstrip: "confirming outlet count and continuous amperage against the home circuit actually feeding the rack",
  wallmount: "checking both the rack's wall-rated capacity and whether the wall itself can support that load",
  vertical: "confirming vertical orientation actually fits the equipment shape being mounted",
  desktop: "checking desktop rack stability and footprint against a genuinely small workspace",
  mini: "confirming 10-inch mini rack compatibility rather than assuming standard 19-inch gear will fit",
  "2post": "checking whether 2-post support actually suits the equipment class before assuming it's interchangeable with 4-post",
  "4post": "verifying front-and-rear rail support matches the depth of the actual server chassis",
  openframe: "weighing open-frame airflow against the lack of dust and access control versus an enclosed cabinet",
  cabinet: "checking documented static load capacity and door type against the equipment actually being housed",
  mobile: "checking how much weight capacity drops once a rack is actually rolling on its casters",
  locking: "verifying which panels actually lock versus which are simply removable",
  homelab: "planning noise, heat, and branch circuit load like a real home installation, not a data center",
  home: "planning noise, heat, and branch circuit load like a real home installation, not a data center",
  office: "balancing appearance and noise against genuine equipment capacity for a shared workspace",
  budget: "verifying real weight rating and steel gauge before assuming a lower price means a lesser rack",
  deep: "confirming actual usable mounting depth against real server chassis length, not just cabinet depth",
  floorstanding: "checking stationary weight rating and footprint against the actual room the rack will occupy",
  nas: "matching rail depth and shelf support to the specific NAS or DAS chassis dimensions",
  network: "matching rail depth and post support to switches and patch panels rather than full servers",
  half: "confirming a half-height rack still leaves enough usable depth for the intended equipment",
  generic: "matching rail depth and post configuration to the U-height, not just counting rack units",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves fit-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a single U-height number.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} vary enough that ${angle} matters more than the price tag alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than star rating alone.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between racks is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to price, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on documented weight rating and mounting depth plus ${angle}, since a rack's nominal size alone regularly overstates what actually fits.`,
  (angle) => `Our ranking weighs documented weight rating and mounting depth plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on documented weight rating and mounting depth plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized documented weight rating and mounting depth plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust listing photos, we checked documented weight rating and mounting depth plus ${angle} for every rack on this list.`,
  (angle) => `The picks below were sorted by documented weight rating and mounting depth plus ${angle}, the details that actually decide real fit.`,
  (angle) => `What separates these picks is documented weight rating and mounting depth plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for documented weight rating and mounting depth plus ${angle} before anything else was weighed.`,
  (angle) => `Documented weight rating and mounting depth plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on documented weight rating and mounting depth plus ${angle} to separate genuinely capable racks from well-photographed ones.`,
];

function buildIntro(cat, kw, title, num) {
  let angleEntry = ANGLE_BY_CAT[cat] || ANGLE_BY_CAT.generic;
  const angle = Array.isArray(angleEntry) ? angleEntry[num % angleEntry.length] : angleEntry;
  const firstIdx = num % FIRST_TEMPLATES.length;
  const secondIdx = (num * 3 + 2) % SECOND_TEMPLATES.length;
  return [FIRST_TEMPLATES[firstIdx](title, kw, angle), SECOND_TEMPLATES[secondIdx](angle)];
}

const brandHowTo = (brand) => [
  { subheading: "Build a Current Model Map First", note: `Confirm which ${brand} rack models are currently sold rather than assuming an older listing reflects the current lineup, since weight ratings and depth ranges change between generations.` },
  { subheading: "Publish Weight Rating by Mount Type", note: "Verify stationary, rolling, and wall-mounted weight ratings separately for the exact model, not the brand's range in general." },
  { subheading: "Verify Rail Depth Against Your Equipment", note: "Check documented mounting depth or adjustable depth range before assuming standard rack gear will fit." },
  { subheading: "Compare Warranty and Included Hardware", note: "Compare warranty length and which cage nuts, casters, or shelves actually ship in the box by exact model." },
  { subheading: "Check Post Configuration for Your Load", note: "Confirm whether the specific model is 2-post or 4-post, since that determines what equipment class it can safely support." },
];

function buildHowToChoose(cat, kw) {
  const K = kw;
  const brandCats = ["startech","navepoint","tecmojo","vevor","sysracks","tripplite"];
  if (brandCats.includes(cat)) return brandHowTo(K.split(" ")[0] === "server" ? kw.split(" ")[0] : kw.split(" ")[0]);
  switch (cat) {
    case "sizeclass":
      return [
        { subheading: "Separate U-Height From Rail Depth", note: `Confirm ${K}'s mounting depth or adjustable depth range independently of its U-height, since two racks at the same height can fit very different equipment lengths.` },
        { subheading: "Match Weight Rating to Mount Type", note: "Check the stationary weight rating specifically, then confirm the separate rolling or wall-mounted rating if that's how the rack will actually be installed." },
        { subheading: "Confirm Post Configuration Suits the Load", note: "Verify whether the frame is 2-post or 4-post, since 4-post designs generally support heavier and deeper equipment than 2-post frames rated at the same height." },
        { subheading: "Plan Rear Clearance for Cabling", note: "Leave enough rear clearance behind the rack for cable bend radius and rear panel access, not just the equipment's raw depth." },
        { subheading: "Check Ceiling and Doorway Clearance", note: "Measure actual room ceiling height and doorway width against the rack's assembled dimensions before ordering." },
      ];
    case "wallmount":
      return [
        { subheading: "Check the Wall, Not Just the Rack", note: `Confirm the wall structure behind ${K} can actually support the rated weight, since drywall alone typically can't hold a fully loaded network cabinet.` },
        { subheading: "Compare Overall Depth vs Usable Depth", note: "Distinguish the cabinet's overall depth from its usable mounting depth, since the difference determines what equipment actually fits inside." },
        { subheading: "Verify Stud Spacing Before Ordering", note: "Measure the mounting hole spacing against actual wall stud spacing rather than assuming a standard 16-inch pattern applies." },
        { subheading: "Confirm Door Swing Clearance", note: "Check whether the door swing direction is reversible and whether there's enough clearance in front of the wall for it to open fully." },
        { subheading: "Separate Wall Rating From Floor Rating", note: "Note that many wall cabinets list a separate, higher weight rating for ground-mounted installation if you're unsure the wall can bear the full load." },
      ];
    case "2post":
      return [
        { subheading: "Match Post Count to Equipment Class", note: `Confirm ${K} actually suits your equipment, since 2-post frames work well for switches and patch panels but aren't rated for full-depth, heavy server chassis.` },
        { subheading: "Verify Front-Only Support Is Enough", note: "Check that a 2-post rack's front-only rail support matches the depth and weight of what you're mounting, since there's no rear support point." },
        { subheading: "Confirm Self-Squaring or Bolt-Down Stability", note: "Look for a self-squaring structure or bolt-down provisions, since 2-post racks depend more on base stability than 4-post designs." },
        { subheading: "Check Cable Management Provisions", note: "Verify included cable hooks or management options, since open 2-post frames can get messy fast without them." },
        { subheading: "Weigh Floor Space Savings vs Capacity", note: "Confirm the floor space savings of a 2-post design are worth the lower weight rating compared to an equivalent 4-post rack." },
      ];
    case "4post":
      return [
        { subheading: "Verify Rear Rail Support Matches Chassis Depth", note: `Confirm ${K}'s front and rear rails both support the actual server chassis depth, not just the frame's overall footprint.` },
        { subheading: "Check Adjustable Depth Range", note: "Verify the adjustable depth range covers your specific equipment length, since 4-post racks often ship with a fixed range rather than infinite adjustment." },
        { subheading: "Compare Static Weight Rating by Model", note: "Compare documented static weight capacity across finalists, since 4-post frames vary widely from around 500 lbs to over 1900 lbs." },
        { subheading: "Confirm Cage Nut and Screw Compatibility", note: "Check that included cage nuts and screw types match your equipment's mounting hardware requirements." },
        { subheading: "Plan for Casters or Leveling Feet", note: "Decide whether casters for mobility or leveling feet for stability suit the install, since capacity often differs between the two." },
      ];
    case "openframe":
      return [
        { subheading: "Weigh Airflow Against Access Control", note: `Confirm ${K}'s open-frame design fits a space where dust and physical access aren't major concerns, since there's no door or side panel protection.` },
        { subheading: "Verify Passive Cooling Is Actually Enough", note: "Check whether the equipment load genuinely benefits from open-frame passive airflow, or whether it needs active fan cooling regardless." },
        { subheading: "Confirm Depth Adjustment Range", note: "Verify the adjustable depth range matches your equipment rather than assuming an open frame automatically fits any server length." },
        { subheading: "Check Included Cable Management", note: "Look for included cable hooks or rings, since an open frame with no cable management quickly becomes visually and functionally messy." },
        { subheading: "Confirm Floor or Wall Anchoring Options", note: "Check whether the frame includes floor-anchoring holes or leveling feet for stability, especially in a home with pets or foot traffic nearby." },
      ];
    case "cabinet":
      return [
        { subheading: "Verify Static Load Capacity for the Full Stack", note: `Confirm ${K}'s documented static load capacity covers the combined weight of every device planned for the cabinet, not just the heaviest single item.` },
        { subheading: "Check Door Type for Airflow vs Security", note: "Weigh a mesh or perforated door against a solid or glass door, since more airflow generally means less dust and theft protection." },
        { subheading: "Confirm Cooling Fans Match the Enclosure", note: "Verify a sealed cabinet includes active cooling fans, since an enclosed design without them traps heat far more than an open frame would." },
        { subheading: "Check PDU and Shelf Inclusion", note: "Confirm whether a PDU, fixed shelf, and cable brush panels are included, since some cabinets require buying these separately." },
        { subheading: "Plan Removable Side Panel Access", note: "Verify side panels are removable for cable routing and maintenance, not just the front door." },
      ];
    case "mobile":
      return [
        { subheading: "Check the Rolling Weight Rating, Not Stationary", note: `Confirm ${K}'s weight rating specifically for caster-mounted use, since rolling capacity is documented separately and typically lower than the stationary rating.` },
        { subheading: "Verify Casters Lock in Place", note: "Look for locking casters, not just wheels, so the rack stays put once positioned rather than drifting during use." },
        { subheading: "Confirm Floor Surface Compatibility", note: "Check caster type against your actual floor surface, since hard casters can mark hardwood while soft casters wear faster on rough concrete." },
        { subheading: "Plan Cable Slack for Movement", note: "Leave enough cable slack for the rack to move its intended distance without straining connections at the wall or PDU." },
        { subheading: "Weigh Portability Against Overall Stability", note: "Confirm the rack still feels stable when loaded and rolling, since a taller, lighter frame can tip more easily than a heavier stationary design." },
      ];
    case "quiet":
      return [
        { subheading: "Check the Noise Reduction Claim's Baseline", note: `Verify what baseline ${K}'s noise reduction percentage is actually measured against, since a claimed reduction without a reference point is hard to compare across brands.` },
        { subheading: "Confirm Active Cooling Still Works Sealed", note: "Check that sound-dampening foam and a sealed enclosure don't trap more heat than the built-in fans can remove." },
        { subheading: "Verify Fan Noise at Actual Load", note: "Look for documented dBA specifically under load, not just at idle, since fan noise typically rises as equipment runs hotter." },
        { subheading: "Check Cable Entry Sealing", note: "Confirm brush-style cable entry points that block noise leakage without preventing normal cable routing." },
        { subheading: "Weigh Soundproofing Against Ventilation", note: "Recognize that heavier acoustic dampening trades off against airflow, so a sealed quiet cabinet often needs a stronger internal cooling system than an open equivalent." },
      ];
    case "outdoor":
      return [
        { subheading: "Verify a Real IP Rating, Not Just 'Weatherproof'", note: `Confirm ${K} lists a specific IP rating like IP55 or IP66 rather than a generic weatherproof claim with no documented standard behind it.` },
        { subheading: "Check Active Cooling for Sealed Outdoor Enclosures", note: "Verify whether the enclosure includes fans or air conditioning, since a sealed outdoor cabinet in direct sun can overheat without active cooling." },
        { subheading: "Confirm Corrosion-Resistant Construction", note: "Look for corrosion-resistant coating and sealed cable entry points designed specifically for prolonged outdoor exposure." },
        { subheading: "Verify Mounting Method for the Install Site", note: "Check whether the cabinet is rated for wall, pole, or ground mounting matching your actual outdoor location." },
        { subheading: "Check Lock and Access Weatherproofing", note: "Confirm the locking mechanism and door seals are also rated for outdoor use, not just the main enclosure body." },
      ];
    case "aircon":
      return [
        { subheading: "Confirm It's Active Cooling, Not Just Fans", note: `Verify ${K} is a genuine air conditioning unit with a BTU rating, since fans alone only recirculate air and can't remove heat from a sealed enclosure the way active cooling does.` },
        { subheading: "Check BTU Rating Against Equipment Heat Load", note: "Match the documented BTU rating to your equipment's actual heat output rather than assuming any rack-mount A/C unit is sufficient." },
        { subheading: "Verify Rack Space the Unit Consumes", note: "Confirm how many U of rack space the air conditioning unit itself takes up, since that's space unavailable for actual equipment." },
        { subheading: "Check Refrigerant Type and Warranty", note: "Look for the documented refrigerant type and manufacturer warranty length, since rack-mount A/C units are a bigger investment than fan kits." },
        { subheading: "Confirm Remote Monitoring if Needed", note: "Check whether remote management or monitoring is available if the rack lives somewhere you can't easily check in person." },
      ];
    case "fans": case "cooling":
      return [
        { subheading: "Check CFM at Actual Operating Speed", note: `Verify ${K}'s documented CFM airflow at the speed it will actually run, not just the maximum rated output.` },
        { subheading: "Compare dBA, Not Just Airflow", note: "Compare noise level in dBA alongside CFM, since higher airflow often comes with more noise unless the fan uses a quieter design." },
        { subheading: "Verify Rack Fans Aren't a Room-Cooling Substitute", note: "Recognize that rack fans move air within or around the cabinet, they don't remove heat from a sealed room without separate ventilation or A/C." },
        { subheading: "Check Thermostat or Programmable Control", note: "Look for a programmable thermostat that adjusts fan speed automatically rather than running fans constantly at one speed." },
        { subheading: "Confirm Mounting Position for Best Airflow", note: "Verify whether the fan is designed for roof, rear, or front exhaust, since mounting position affects how effectively it clears hot air." },
      ];
    case "pdu": case "powerstrip":
      return [
        { subheading: "Check Continuous Amperage Against Your Circuit", note: `Confirm ${K}'s continuous amperage rating stays well under your home's branch circuit capacity, since a PDU distributes outlets but doesn't increase available circuit power.` },
        { subheading: "Count Outlets Against Real Equipment", note: "Count actual devices needing power, including PDU-fed fans and accessories, against the outlet count rather than assuming extra room exists." },
        { subheading: "Verify Surge Protection if Needed", note: "Check whether the PDU includes surge protection with a joule rating, since basic power strips often skip this." },
        { subheading: "Confirm Mounting Orientation Fits the Rack", note: "Verify horizontal 1U mounting versus vertical 0U mounting matches how much rack space you want to dedicate to power distribution." },
        { subheading: "Check Cord Length for Your Outlet Location", note: "Confirm the included cord length reaches your actual wall outlet without a separate extension cord bridging the gap." },
      ];
    case "shelves": case "rails":
      return [
        { subheading: "Match Shelf Depth to the Actual Device", note: `Confirm ${K}'s depth and weight rating fit the specific non-rack-mountable device being stored, not just a general estimate.` },
        { subheading: "Check Vented vs Solid Shelf Design", note: "Verify whether the shelf is vented for airflow or solid, since vented designs help dissipate heat from anything running warm." },
        { subheading: "Confirm Cantilever vs 4-Post Support", note: "Check whether the shelf is cantilever-mounted or requires 4-post support, since cantilever shelves generally hold less weight." },
        { subheading: "Verify Cage Nut vs Screw Hole Compatibility", note: "Confirm the shelf's mounting hardware matches your rack's hole pattern, whether square, round, or threaded." },
        { subheading: "Check Flip-Lip or Reversible Options", note: "Look for a flip-lip or reversible lip design if you need the shelf to handle devices of varying heights." },
      ];
    case "vertical":
      return [
        { subheading: "Confirm Vertical Orientation Fits the Space", note: `Verify ${K}'s vertical mounting genuinely fits a narrow hallway or tight space, since not every device works well oriented vertically.` },
        { subheading: "Check Adjustable Depth for Your Equipment", note: "Confirm the adjustable depth range matches your specific device length rather than assuming a vertical enclosure fits everything." },
        { subheading: "Verify Weight Rating Stays Consistent", note: "Check that the weight rating doesn't drop simply because the mount is vertical rather than horizontal." },
        { subheading: "Confirm Cable Access Points", note: "Verify top and bottom cable access ports exist, since vertical mounts can make cable routing trickier without them." },
        { subheading: "Check Stud Spacing for Wall Installs", note: "Confirm mounting hole spacing matches actual wall stud spacing before ordering a vertical wall enclosure." },
      ];
    case "desktop":
      return [
        { subheading: "Confirm Footprint Fits the Desk or Shelf", note: `Verify ${K}'s footprint and height genuinely fit a desktop or shelf space, not just a small floor area.` },
        { subheading: "Check Stability at Full Load", note: "Confirm rubber footing or a wide base keeps the rack stable once loaded, since desktop racks have less mass than floor-standing models." },
        { subheading: "Verify Weight Rating Fits Real Devices", note: "Check the documented weight rating against the actual switches, patch panels, or small servers planned for the setup." },
        { subheading: "Confirm Open-Frame Cable Access", note: "Verify open-frame access makes cable management workable at a desk-height install, not just from the floor." },
        { subheading: "Check Noise for a Shared Desk Environment", note: "Confirm equipment fan noise is acceptable for a desk-adjacent install, since desktop racks sit much closer to people than floor racks." },
      ];
    case "mini":
      return [
        { subheading: "Confirm 10-Inch Compatibility, Not 19-Inch", note: `Verify ${K} only fits 10-inch mini rack equipment, since standard 19-inch servers and switches won't mount in this format.` },
        { subheading: "Check U-Height for the Actual Cluster Size", note: "Count the actual boards or devices planned for the cluster against the U-height rather than assuming any mini rack size works." },
        { subheading: "Verify Included Shelves and Adapter Boards", note: "Check which shelves, blank panels, and adapter boards are actually included, since this varies notably between mini rack sizes." },
        { subheading: "Confirm Depth Fits Your SBC or Mini-ITX Build", note: "Verify the rack's depth accommodates your specific single-board computer or mini-ITX case dimensions." },
        { subheading: "Check Ventilation for Passive Cooling", note: "Confirm the frame's open or translucent-panel design provides enough passive airflow for a small cluster generating real heat." },
      ];
    case "keyboardtray": case "drawers":
      return [
        { subheading: "Confirm Pull-Out Depth Fits the Rack", note: `Verify ${K}'s extension depth fits the actual clearance behind the rack before it hits a wall or another piece of equipment.` },
        { subheading: "Check Reinforcement Against Wobble", note: "Look for a reinforced crossbar or rail system, since basic slides can wobble noticeably when fully extended." },
        { subheading: "Verify Weight Rating for Contents", note: "Confirm the documented weight rating matches what's actually being stored, whether that's a keyboard or heavier drawer contents." },
        { subheading: "Confirm Lock Type if Security Matters", note: "Check whether the drawer uses a key lock or combination lock, and whether that fits how the rack is shared or accessed." },
        { subheading: "Check U-Height Impact on Rack Space", note: "Confirm how much U-height the tray or drawer consumes, since that's space unavailable for active equipment." },
      ];
    case "cablemgmt":
      return [
        { subheading: "Match Slot Count to Real Cable Volume", note: `Confirm ${K}'s slot or channel count actually covers your real number of cable runs, not just a rough estimate.` },
        { subheading: "Check Metal vs Plastic Construction", note: "Verify metal construction over plastic finger ducts, since metal holds up better under repeated cable adjustments." },
        { subheading: "Confirm Rounded Edges Protect Cable Jackets", note: "Look for rounded or smoothed edges specifically, since sharp metal edges can nick cable insulation over time." },
        { subheading: "Verify Mounting Compatibility With Your Rack", note: "Check that the cable manager's screw pattern matches your rack's hole spacing before ordering." },
        { subheading: "Check Whether It Also Blocks Dust", note: "Confirm brush-style panels also reduce dust intake through unused rack slots, not just organize visible cables." },
      ];
    case "budget":
      return [
        { subheading: "Verify Real Steel Gauge, Not Just Price", note: `Confirm ${K}'s actual steel thickness and weld quality rather than assuming a lower price automatically means a lesser structural rack.` },
        { subheading: "Check the Actual Weight Rating", note: "Verify the documented weight rating directly rather than assuming all racks at a similar size hold similar loads." },
        { subheading: "Confirm Included Hardware Covers Setup", note: "Check whether cage nuts, screws, and casters are included, since a cheaper rack that requires separate hardware purchases may cost more in total." },
        { subheading: "Look for a Real Warranty", note: "Confirm whether a warranty exists at all, since budget racks sometimes skip this while competitively priced racks from established brands still include one." },
        { subheading: "Weigh Assembly Time Against Savings", note: "Factor in assembly time and instructions quality, since a genuinely difficult flat-pack build can offset the price savings." },
      ];
    case "homelab": case "home": case "office":
      return [
        { subheading: "Plan Around Home Circuit Capacity", note: `Confirm ${K} won't push the total connected load past your home's branch circuit rating, since a PDU distributes outlets but not extra circuit capacity.` },
        { subheading: "Weigh Noise for a Shared Living Space", note: "Check documented noise levels specifically, since a rack living near living or working space needs to be judged on more than raw performance." },
        { subheading: "Verify Room Ventilation, Not Just Rack Fans", note: "Recognize that rack fans alone can't cool a sealed closet or small room, so plan actual room ventilation for a dense equipment load." },
        { subheading: "Confirm Floor Load if Installing Upstairs", note: "Check the combined weight of a loaded rack against floor load capacity if installing above ground level." },
        { subheading: "Plan for Future Expansion Space", note: "Leave some spare U-height and depth room for equipment additions rather than filling a rack to its exact current needs." },
      ];
    case "deep": case "floorstanding":
      return [
        { subheading: "Confirm Usable Depth, Not Cabinet Depth", note: `Verify ${K}'s usable mounting depth specifically, since overall cabinet depth includes wall thickness and door clearance that isn't available for equipment.` },
        { subheading: "Check Rear Clearance for Cable Bend Radius", note: "Leave room behind the rack for cable bend radius and rear panel access, not just the raw equipment depth." },
        { subheading: "Verify Stationary Weight Rating for Deep Gear", note: "Confirm the stationary weight rating accounts for genuinely deep, heavy server chassis rather than lighter networking equipment." },
        { subheading: "Check Room Depth Before Ordering", note: "Measure actual room depth including doorway clearance for moving the assembled or flat-packed rack into place." },
        { subheading: "Confirm Cooling Scales With Depth", note: "Verify cooling fans or ventilation scale appropriately for the larger internal air volume a deep cabinet creates." },
      ];
    case "nas":
      return [
        { subheading: "Match Rail Depth to Your NAS Chassis", note: `Confirm ${K}'s rail or shelf depth matches your specific NAS or DAS chassis dimensions, since these are often shorter than full server depth.` },
        { subheading: "Check Shelf Weight Rating for Drive Bays", note: "Verify the shelf or rail weight rating accounts for a fully populated multi-bay NAS, not an empty chassis." },
        { subheading: "Confirm Ventilation for Drive Heat", note: "Check that airflow around the NAS is sufficient, since hard drives generate meaningful heat during sustained read/write activity." },
        { subheading: "Verify Cable Routing for Network and Power", note: "Confirm cable management supports both network and power cabling without straining connections during any rack movement." },
        { subheading: "Check Depth for Handle Clearance", note: "Verify rack depth includes clearance for any handles or cable management arms that extend beyond the NAS chassis itself." },
      ];
    case "network":
      return [
        { subheading: "Confirm Rail Support for Switches and Patch Panels", note: `Verify ${K}'s rail depth and post configuration suit switches and patch panels specifically, which are typically shallower and lighter than full servers.` },
        { subheading: "Check Cable Management Density", note: "Confirm enough cable management capacity for a dense patch panel setup, since network racks often carry more individual cable runs than server racks." },
        { subheading: "Verify Open Frame vs Enclosed for Access", note: "Weigh open-frame access for frequent patching against enclosed protection if the rack lives in a shared or public-facing space." },
        { subheading: "Check PoE Heat if Running Powered Switches", note: "Account for extra heat from PoE switches powering cameras or access points, which can run warmer than standard switches." },
        { subheading: "Confirm Grounding Provisions", note: "Verify a grounding wire or point is included, since networking equipment benefits from proper grounding in a metal rack." },
      ];
    case "half":
      return [
        { subheading: "Confirm Half-Height Still Fits Equipment Depth", note: `Verify ${K}'s shorter height doesn't come with a reduced depth that no longer fits your equipment.` },
        { subheading: "Check Weight Rating Relative to Full-Height Models", note: "Compare the half-height rack's weight rating against full-height models in the same line, since it's not always proportionally lower." },
        { subheading: "Verify Room Clearance Advantage", note: "Confirm the shorter height genuinely solves a real ceiling or doorway clearance issue rather than just looking more compact." },
        { subheading: "Check Expansion Headroom", note: "Consider whether a half-height rack leaves enough room for equipment growth before needing to replace it entirely." },
        { subheading: "Confirm Casters or Feet Suit the Shorter Frame", note: "Verify the mounting hardware included is appropriately sized for a shorter, sometimes more top-heavy relative frame." },
      ];
    default:
      return [
        { subheading: "Separate U-Height From Rail Depth", note: `Confirm ${K}'s mounting depth independently of its U-height, since two racks at the same height can fit very different equipment lengths.` },
        { subheading: "Match Weight Rating to Mount Type", note: "Check the stationary, rolling, or wall-mounted weight rating specifically for how the rack will actually be installed." },
        { subheading: "Confirm Post Configuration Suits the Load", note: "Verify whether the frame is 2-post or 4-post, since that determines what equipment class it can safely support." },
        { subheading: "Plan Rear Clearance for Cabling", note: "Leave enough rear clearance behind the rack for cable bend radius and rear panel access." },
        { subheading: "Check Cooling Method Fits the Enclosure", note: "Confirm passive airflow, active fans, or a sealed cabinet's cooling matches the actual equipment heat load." },
      ];
  }
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  const brandCats = ["startech","navepoint","tecmojo","vevor","sysracks","tripplite"];
  if (brandCats.includes(cat)) {
    const brand = kw.split(" ")[0];
    return [
      { q: `Are all ${brand} rack models currently sold, or does the lineup include discontinued products?`, a: "Check current first-party store pages directly, since older server rack listings often stay heavily indexed in search results long after being succeeded by newer models with different specs." },
      { q: `Does buying ${brand} guarantee the same weight rating across every model?`, a: "No. A brand's lineup can span very different weight ratings and post configurations, so verify the exact model's documented capacity rather than assuming brand consistency across their whole catalog." },
    ];
  }
  switch (cat) {
    case "sizeclass":
      return [
        { q: `Does U-height alone tell me whether ${K} will fit my server?`, a: "No. U-height only measures vertical space. Whether a server physically fits also depends on rail-to-rail mounting depth and rear clearance for cables, so check the adjustable depth range separately from the U-height figure." },
        { q: "Is a taller rack always better if I have the ceiling clearance?", a: "Not necessarily. A taller rack costs more, takes longer to assemble, and can be harder to secure against tipping if it's not anchored, so match the height to genuine current and near-future equipment needs rather than maximizing size." },
      ];
    case "wallmount":
      return [
        { q: `Can I mount ${K} on any interior wall?`, a: "Only if the wall has solid structural support like studs at the mounting points. Drywall alone typically can't support a fully loaded network cabinet, so confirm stud spacing and consider a plywood backer board for heavier installs." },
        { q: "Why do wall cabinets list a lower weight rating than floor cabinets of the same size?", a: "Because wall-mounted capacity is limited by what the wall structure itself can bear, not just what the cabinet frame could theoretically hold. The same cabinet often has a meaningfully higher rating when installed on the floor instead." },
      ];
    case "2post": case "4post":
      return [
        { q: "Can I use a 2-post rack for a full-depth server?", a: "Generally not recommended. A 2-post rack only supports equipment at the front mounting points, so a long, heavy server chassis can sag or become unstable without rear support, which is exactly what a 4-post design provides." },
        { q: "Is 4-post always the safer choice regardless of equipment?", a: "For lighter gear like switches or patch panels, a 2-post rack is often perfectly adequate and saves floor space. Reserve 4-post frames for equipment where the manufacturer specifically documents a need for rear support or higher weight capacity." },
      ];
    case "pdu": case "powerstrip":
      return [
        { q: `Does adding ${K} increase how much power my home circuit can deliver?`, a: "No. A PDU distributes outlets across a rack but draws from the same branch circuit as everything else plugged into it. Keep total continuous load across all connected equipment well under the circuit's rated capacity." },
        { q: "How many outlets do I actually need for a home lab rack?", a: "Count every powered device individually, including small accessories like fans and USB hubs, not just the major equipment. A rack that looks like it needs 4 outlets often needs 8 once fans, PDUs for accessories, and future additions are counted." },
      ];
    case "fans": case "cooling": case "aircon":
      return [
        { q: `Will ${K} cool down a small, sealed server closet by itself?`, a: "Not reliably. Rack fans move air within or around the equipment, but if the room itself has no way to exhaust heat, they're mostly recirculating warm air. A genuinely sealed space needs either room-level ventilation or an actual air conditioning unit." },
        { q: "How do I know if my rack needs active cooling versus passive airflow?", a: "Check the documented heat output of your equipment against the enclosure type. An open frame with light networking gear often does fine passively, while a sealed cabinet with multiple servers running continuously typically needs active fans or, in dense setups, dedicated cooling." },
      ];
    case "quiet": case "homelab": case "home":
      return [
        { q: `Is a soundproof or quiet-rated rack always the right choice for home use?`, a: "It depends on where the rack lives and how much heat your equipment generates. Sound dampening trades off against airflow, so a sealed quiet cabinet needs a genuinely capable internal cooling system, otherwise trapped heat can become a bigger problem than the original noise." },
        { q: "Does a rack's noise rating account for fan speed under load?", a: "Not always. Some noise reduction claims are measured at idle or a fixed low speed, so check whether the documented dBA figure applies specifically under real operating load, since fans typically get louder as equipment runs hotter." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Trusting U-height as the only fit measurement without checking mounting depth, rear clearance, and which weight rating (stationary, rolling, or wall) actually applies to their planned installation." },
        { q: `Should I prioritize weight capacity or included accessories for ${K}?`, a: "Weight capacity first, since it's the harder spec to work around after purchase. Accessories like shelves, PDUs, and cable managers can usually be added separately, but an undersized weight rating means buying an entirely different rack." },
      ];
  }
}

const articleMeta = {};
const slugTitleMap = {};
const SEEN_SLUGS = new Set();
for (const a of articles) {
  const slug = slugify(a.title);
  if (!slugTitleMap[slug]) slugTitleMap[slug] = a.title;
}

for (const a of articles) {
  const slug = slugify(a.title);
  if (SEEN_SLUGS.has(slug)) continue;
  SEEN_SLUGS.add(slug);
  const kw = mainKeywordFor(a.title);
  const cat = classify(a.title);
  const count = a.asins.length;
  const badges = a.asins.map((_, i) => badgeFor(i, count));
  const picksRaw = a.asins.map((asin, i) => pick(asin, badges[i]));
  const picks = picksRaw.filter(Boolean);
  picks.forEach((p, i) => { p.badge = badgeFor(i, picks.length); });

  if (picks.length === 0) continue;

  const intro = buildIntro(cat, kw, a.title, a.num);
  const howToChoose = buildHowToChoose(cat, kw);
  const bespoke = buildBespokeFaq(cat, kw);
  const faq = fillFaq(bespoke, 5);

  const metaTitle = `${a.title} 2026`;
  const metaDescription = `We compared ${kw} by documented weight rating, mounting depth, and post configuration rather than ranking by U-height alone.`;

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
export const lastUpdated = "2026-08-20";
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

fs.writeFileSync("scripts/_srack_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
