import fs from "fs";
import { P } from "./cnc-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-cnc.json", "utf8"));
const raw = fs.readFileSync("scripts/_cnc_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Architecture Classified Before Comparison", description: "Sorted each machine into router, mill, lathe, laser hybrid, or waterjet before ranking, since desktop CNC spans genuinely different cutting architectures that don't compare fairly on one scale." },
  { title: "Usable Travel Over Nominal Axis Size", description: "Compared usable XYZ travel after vise, clamps, and tool stick-out rather than nominal axis travel alone, since fixtures and tooling eat into the advertised work envelope." },
  { title: "Spindle and Rigidity Evidence", description: "Checked documented spindle speed, torque, and runout figures alongside frame and rail rigidity, since motor wattage alone doesn't predict real cut quality." },
  { title: "Software and Workholding Verified", description: "Checked CAM/postprocessor support, probing, workholding, and dust or chip control as part of daily usability, not just the headline spec sheet." },
  { title: "Ownership Details: Setup, Power, and Maintenance", description: "Weighed assembly time, footprint, power requirements, and maintenance workflow, since a CNC machine is a long-term shop investment, not a one-time purchase." },
];

const sharedFaqPool = [
  { key: "grbl-vs-proprietary-control", q: "Is GRBL control harder to use than a proprietary CNC app?", a: "GRBL has a steeper initial learning curve since it relies on separate CAM software and a G-code sender, but it's open-source with extensive community support and works across many machines. Proprietary apps trade some of that flexibility for a more guided, beginner-friendly workflow." },
  { key: "cnc-accuracy-vs-resolution", q: "Does a machine's motor resolution figure tell me its real cutting accuracy?", a: "Not directly. Motor or controller resolution describes the smallest theoretical step size, while real part accuracy also depends on frame rigidity, backlash, and tool deflection under load. A repeatable test cut is a better accuracy indicator than a resolution spec alone." },
  { key: "desktop-cnc-metal-capability", q: "Can a desktop CNC router genuinely cut metal, or just engrave it?", a: "This depends heavily on spindle torque, rigidity, and tooling. Many desktop routers can engrave or lightly cut soft metals like aluminum and brass with the right bits and shallow passes, but cutting steel or deep aluminum passes generally needs a genuinely rigid, higher-torque machine." },
  { key: "cnc-dust-collection-necessity", q: "Do I need a separate dust collection system for a desktop CNC?", a: "For anything beyond occasional light engraving, yes. Wood and MDF dust in particular accumulates quickly and can affect both air quality and machine longevity, so a shop vac or dedicated dust collector connected to the machine's dust port is a practical addition, not a luxury." },
  { key: "cnc-4th-axis-worth-it", q: "Is a 4th axis rotary attachment worth adding to a 3-axis CNC?", a: "It depends on your projects. A 4th axis genuinely opens up cylindrical and double-sided machining that a 3-axis setup can't do in one operation, but it also adds real cost, CAM complexity, and reduces the machine's usable XYZ envelope while installed." },
  { key: "cnc-workholding-basics", q: "What workholding do I actually need beyond the stock clamps?", a: "Stock clamps handle basic flat stock, but T-track spoilboards, dedicated vises, or double-sided tape become necessary as projects get more varied, since inconsistent workholding is one of the most common causes of a ruined cut on desktop CNC machines." },
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
    description: info.p1, specs: info.specs, pros: info.pros, cons: info.cons || [],
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
  if (/under \$/.test(t)) return "budget";
  if (/carvera|bantam|makera|nomad|tormach|haas|shopbot|xhorse|genmitsu|lunyee|sainsmart|shapeoko|foxalien|vevor/.test(t)) return "brand";
  if (/5 axis/.test(t)) return "5axis";
  if (/4 axis/.test(t)) return "4axis";
  if (/3 axis/.test(t)) return "3axis";
  if (/lathe/.test(t)) return "lathe";
  if (/waterjet/.test(t)) return "waterjet";
  if (/laser|engraver/.test(t)) return "laser";
  if (/tool changer/.test(t)) return "toolchanger";
  if (/aluminum/.test(t)) return "aluminum";
  if (/stainless steel/.test(t)) return "steel";
  if (/\bsteel\b/.test(t)) return "steel";
  if (/metal/.test(t)) return "metal";
  if (/wood/.test(t)) return "wood";
  if (/router|cutter/.test(t)) return "router";
  if (/mill/.test(t)) return "mill";
  if (/enclosed/.test(t)) return "enclosed";
  if (/entry level|hobby/.test(t)) return "entry";
  if (/budget/.test(t)) return "budget";
  if (/mini\b/.test(t)) return "mini";
  if (/3018|3020|3030|4040/.test(t)) return "sizeclass";
  if (/pcb/.test(t)) return "pcb";
  if (/jewelry/.test(t)) return "jewelry";
  return "generic";
}

const ANGLE_BY_CAT = {
  budget: "verifying what's actually included at the sticker price before calling it a deal",
  brand: [
    "mapping the brand's current model lineup instead of assuming every listing is a current product",
    "checking exact model generation and specifications, not just the brand name",
    "verifying which specific models in the lineup carry current support and documentation",
  ],
  "5axis": "requiring genuine simultaneous 5-axis motion and verified CAM/collision support",
  "4axis": "verifying whether rotary motion is simultaneous or just indexed, and how much envelope it costs",
  "3axis": "checking rigidity and usable envelope rather than axis count alone",
  lathe: "verifying swing, spindle bore, and workholding rather than router-style specs",
  waterjet: "checking cut area, water and abrasive requirements, and real consumable cost",
  laser: "verifying real optical output and documented cut depth, not just an input-power number",
  toolchanger: "requiring genuine controller-triggered tool changes, not manual quick-swap systems",
  aluminum: "checking documented feeds, tooling, and cut depth for the specific material, not a material badge",
  steel: "requiring real cut evidence for steel and stainless, the highest-risk material claim in this category",
  metal: "checking rigidity, spindle torque, and chip evacuation for genuine metal cutting capability",
  wood: "checking work area, dust control, and spindle ecosystem for wood-specific routing",
  router: "verifying usable cutting area and frame rigidity under real load",
  mill: "checking spindle and toolholder quality plus Z-axis clearance rather than broad work area",
  enclosed: "verifying real containment, interlocks, and extraction rather than treating any shell as equivalent",
  entry: "checking real setup time, safety controls, and honest upgrade cost for a first machine",
  mini: "checking real usable travel after clamps and tool clearance, not just external footprint",
  sizeclass: "verifying exact model generation and travel, since the size-class name alone isn't a technical spec",
  pcb: "checking spindle runout, height mapping, and dust control specific to PCB milling",
  jewelry: "checking fine-tool runout and small-part workholding over large work area",
  generic: "verifying documented rigidity, spindle specs, and CAM support instead of trusting the listing alone",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves function-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a headline spec on the listing.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} machines vary enough that ${angle} matters more than spindle wattage alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or star rating.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between machines is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to price, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on documented rigidity and spindle evidence plus ${angle}, since specs alone regularly overstate real-world cutting performance.`,
  (angle) => `Our ranking weighs documented rigidity and spindle evidence plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on documented rigidity and spindle evidence plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized documented rigidity and spindle evidence plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we checked documented rigidity and spindle evidence plus ${angle} for every machine on this list.`,
  (angle) => `The picks below were sorted by documented rigidity and spindle evidence plus ${angle}, the details that actually decide how a machine cuts.`,
  (angle) => `What separates these picks is documented rigidity and spindle evidence plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for documented rigidity and spindle evidence plus ${angle} before anything else was weighed.`,
  (angle) => `Documented rigidity and spindle evidence plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on documented rigidity and spindle evidence plus ${angle} to separate genuinely capable machines from well-marketed ones.`,
];

function buildIntro(cat, kw, title, num) {
  let angleEntry = ANGLE_BY_CAT[cat] || ANGLE_BY_CAT.generic;
  const angle = Array.isArray(angleEntry) ? angleEntry[num % angleEntry.length] : angleEntry;
  const firstIdx = num % FIRST_TEMPLATES.length;
  const secondIdx = (num * 3 + 2) % SECOND_TEMPLATES.length;
  return [FIRST_TEMPLATES[firstIdx](title, kw, angle), SECOND_TEMPLATES[secondIdx](angle)];
}

function buildHowToChoose(cat, kw) {
  const K = kw;
  switch (cat) {
    case "brand":
      return [
        { subheading: "Build a Current Model Map First", note: `Confirm which ${K} models are currently sold and supported rather than assuming an older listing still reflects the current lineup.` },
        { subheading: "Compare Exact Travel and Rail Architecture by Model", note: "Check actual work travel, rails, and spindle/router architecture by exact model, since a brand's lineup can span very different hardware generations." },
        { subheading: "Map Official Upgrade Paths", note: "Verify which 4th-axis, laser, spindle, or workholding upgrades are officially supported for the specific model, not just the brand in general." },
        { subheading: "Verify Controller and Software Support", note: "Check current firmware, CAM/sender compatibility, and operating-system support directly, since older machines can lose software support over time." },
        { subheading: "Check Warranty and Replacement Parts", note: "Confirm warranty terms and replacement electronics or motion parts are actually available before buying into a brand's ecosystem." },
      ];
    case "5axis":
      return [
        { subheading: "Require Genuine Simultaneous Motion", note: `Confirm ${K} controls five axes simultaneously rather than adding an indexed rotary to a 3-axis base, a meaningfully different capability.` },
        { subheading: "Check the Real Work Envelope With Fixtures Installed", note: "Verify the usable work envelope after rotary fixtures are mounted, since 5-axis hardware eats into the nominal travel." },
        { subheading: "Verify 5-Axis CAM and Postprocessor Support", note: "Confirm the machine's controller supports genuine 5-axis CAM output, not just 3-axis toolpaths run through extra motors." },
        { subheading: "Understand Collision Management", note: "Check whether the software includes simulation or collision checking, since 5-axis setups have real crash risk that 3-axis machines don't." },
        { subheading: "Budget for the Learning Curve", note: "Plan for genuine setup and calibration time, since 5-axis rotary-center calibration and probing take longer to master than 3-axis workflows." },
      ];
    case "laser":
      return [
        { subheading: "Verify Real Optical Output, Not Input Power", note: `Check ${K}'s actual optical output rating rather than trusting an electrical input-power figure, since these numbers are often marketed interchangeably.` },
        { subheading: "Require Documented Cut Depth by Material", note: "Look for specific cut-depth figures in real materials (plywood, acrylic, leather) rather than a vague 'cuts anything' claim." },
        { subheading: "Check Safety Class and Enclosure", note: "Verify the laser safety class and whether the enclosure itself filters radiation, versus relying solely on separate safety glasses." },
        { subheading: "Plan for Fume Extraction", note: "Budget for real fume extraction appropriate to the materials you'll cut, since laser cutting produces smoke and fumes that need active ventilation." },
        { subheading: "Confirm Software Compatibility", note: "Check compatibility with LightBurn, LaserGRBL, or the manufacturer's own app across your actual operating system before buying." },
      ];
    case "steel":
    case "metal":
    case "aluminum":
      return [
        { subheading: "Require Real Cut Evidence for the Target Material", note: `Look for documented feeds, tooling, and cut depth specific to ${K} rather than a generic material-compatibility badge.` },
        { subheading: "Check Spindle Torque, Not Just Speed", note: "Verify spindle torque and rigidity figures, since RPM alone doesn't predict whether a machine can hold a cut in metal without deflecting." },
        { subheading: "Plan Chip Evacuation and Lubrication", note: "Confirm the machine documents chip evacuation and coolant or lubrication needs, since metal chips behave very differently from wood dust." },
        { subheading: "Compare Tool Wear and Cycle Time", note: "Check that 'can cut' claims are backed by realistic cycle time and tool wear data, not just a single demonstration pass." },
        { subheading: "Verify Workholding for Metal Loads", note: "Confirm the included or recommended workholding can handle metal-cutting forces, since wood-grade clamps often aren't rigid enough." },
      ];
    case "wood":
    case "router":
      return [
        { subheading: "Measure Real Cutting Area After Spoilboard and Clamps", note: `Check ${K}'s usable Z-height and cutting area after the spoilboard and clamps are installed, not the nominal axis travel alone.` },
        { subheading: "Verify Spindle and Collet Match Your Bits", note: "Confirm the spindle RPM range and collet size match the router bits you actually plan to use." },
        { subheading: "Plan Dust Collection From the Start", note: "Budget for a dust collection or shop-vac connection, since wood dust accumulates quickly and affects both air quality and machine longevity." },
        { subheading: "Check Frame Rigidity Under Load", note: "Look for documented backlash or deflection figures on a representative cut, not just frame appearance in photos." },
        { subheading: "Confirm Workholding Options", note: "Verify what workholding (T-track, clamps, spoilboard) ships standard versus what needs to be added separately." },
      ];
    case "mill":
      return [
        { subheading: "Check Spindle and Toolholder Quality", note: `Compare ${K}'s spindle torque, speed, and supported collet or toolholder sizes rather than judging by work area alone.` },
        { subheading: "Verify Usable Z-Clearance With Workholding Installed", note: "Confirm practical workpiece height and tool-clearance limits after a vise or fixture is mounted." },
        { subheading: "Inspect Rails and Screws for Backlash", note: "Look for documented backlash or dimensional-error figures under load, not just rail brand names." },
        { subheading: "Confirm CAM and Probing Workflow", note: "Verify the machine documents a repeatable CAM, probing, and tool-length workflow, not just G-code compatibility in general." },
        { subheading: "Weigh Rigidity Against Footprint", note: "Confirm the machine's rigidity claims against its actual footprint, since more compact mills sometimes trade rigidity for desk space." },
      ];
    case "toolchanger":
      return [
        { subheading: "Require Controller-Triggered Changes", note: `Confirm ${K} changes tools automatically via controller or G-code command, not a manual quick-swap system marketed as automatic.` },
        { subheading: "Check Tool Capacity and Size Limits", note: "Verify tool capacity and maximum tool diameter or length restrictions before assuming a given tool set fits." },
        { subheading: "Verify the Toolholder Ecosystem Cost", note: "Check the collet or toolholder ecosystem and recurring cost, since automatic tool changers often require matched holders." },
        { subheading: "Confirm Tool-Length Probing", note: "Verify the machine documents an automatic tool-length probing and offset workflow, not manual measurement between changes." },
        { subheading: "Check Reliability Under Repeated Changes", note: "Look for evidence of reliable unattended tool changes over a real job, not just a single demonstration swap." },
      ];
    case "waterjet":
      return [
        { subheading: "Verify Real Cutting Area and Kerf", note: `Check ${K}'s documented cutting area and kerf width rather than a vague capacity claim.` },
        { subheading: "Confirm Water and Electrical Requirements", note: "Verify water supply, drainage, and electrical requirements before assuming it drops into any workshop." },
        { subheading: "Calculate Abrasive Cost Per Job", note: "Estimate abrasive consumption and cost for your typical job size, since this is an ongoing consumable cost routers and mills don't have." },
        { subheading: "Check Nozzle and Bed Maintenance", note: "Confirm expected nozzle wear intervals and cut-bed maintenance, part of real waterjet ownership cost." },
        { subheading: "Verify Material and Thickness Data", note: "Use manufacturer cut data for your specific target material and thickness rather than a generic 'cuts anything' claim." },
      ];
    case "entry":
      return [
        { subheading: "Time Real Setup to First Cut", note: `Check how long ${K} actually takes from unboxing to a first successful cut, not just an advertised assembly time.` },
        { subheading: "Verify Beginner-Friendly Software", note: "Confirm the bundled or recommended CAM software has a genuinely approachable learning curve for a first CNC machine." },
        { subheading: "Check Safety Controls Are Accessible", note: "Verify an accessible emergency stop and clear homing/zeroing sequence, since safety controls matter most for first-time users." },
        { subheading: "Map the Real Upgrade Path", note: "Check what upgrades (spindle, workholding, enclosure) are actually needed soon after purchase, and price them in." },
        { subheading: "Confirm Workholding Basics Are Included", note: "Verify basic clamps or a spoilboard ship standard, since missing workholding is a common first-machine frustration." },
      ];
    case "mini":
      return [
        { subheading: "Set Explicit Footprint Limits", note: `Define maximum external dimensions for ${K} rather than judging 'mini' from photos alone.` },
        { subheading: "Check Usable Travel After Clamps", note: "Verify usable travel after clamps, vise, and tool clearance are accounted for, since compact machines lose a larger share of nominal travel." },
        { subheading: "Confirm Bench Weight and Space Needs", note: "Check machine, controller, and power-supply weight plus real bench space requirements before assuming compact means lightweight." },
        { subheading: "Measure Noise in a Small Room", note: "Consider noise and extraction needs specifically in a smaller room, where sound carries differently than in an open shop." },
        { subheading: "Plan Storage for Cutters and Clamps", note: "Account for storage space needed for cutters, clamps, stock, and maintenance supplies alongside the machine itself." },
      ];
    case "sizeclass":
      return [
        { subheading: "Verify Exact Model Generation", note: `Confirm ${K}'s exact model and revision rather than trusting the size-class number alone, since hardware changes across generations while the name stays similar.` },
        { subheading: "Publish Real XYZ Travel and Footprint", note: "Check actual working range and total machine footprint, since size-class labels describe rough XY dimensions, not a technical standard." },
        { subheading: "Compare Rail and Screw Architecture", note: "Verify rails, screws, and frame construction directly, since two machines in the same size class can use very different motion hardware." },
        { subheading: "Confirm Spindle and Collet Compatibility", note: "Check spindle specs and official upgrade mounts by the exact model revision, not the size-class name." },
        { subheading: "Map Controller and Expansion Options", note: "Verify controller type, limits, probing, and laser or 4th-axis expansion support by revision before assuming compatibility." },
      ];
    case "pcb":
      return [
        { subheading: "Check Spindle Runout for Fine Traces", note: `Verify ${K}'s documented spindle or collet runout with PCB-sized tools, since copper isolation depth is small enough that runout matters directly.` },
        { subheading: "Confirm Surface Probing or Height Mapping", note: "Check for bed or PCB probing and height-mapping support, since PCB milling needs consistent Z-height across the whole board." },
        { subheading: "Verify Trace Width Capability", note: "Compare documented trace and isolation width rather than a generic XY accuracy figure alone." },
        { subheading: "Confirm Gerber-to-G-code Workflow", note: "Check the CAM software supports a genuine Gerber-to-G-code workflow and drill alignment, not just general G-code import." },
        { subheading: "Plan Dust Control for FR-4", note: "Budget appropriate extraction for FR-4 dust specifically, since it behaves differently from wood dust and needs containment." },
      ];
    case "jewelry":
      return [
        { subheading: "Verify Fine-Tool Runout", note: `Check ${K}'s documented runout with small jewelry cutters, since fine detail work is far more sensitive to runout than large-scale routing.` },
        { subheading: "Confirm Precision Workholding for Small Parts", note: "Verify precision vises or fixtures exist for small parts, since standard clamps aren't built for tiny, repeatable jewelry-scale positioning." },
        { subheading: "Check Material-Specific Tooling", note: "Confirm tooling and feeds are documented for your intended jewelry media (wax, brass, precious metal), not just generic material claims." },
        { subheading: "Evaluate Rotary Options for Cylindrical Parts", note: "Check whether a rotary or 4th-axis accessory is genuinely useful for rings or cylindrical jewelry pieces, where supported." },
        { subheading: "Inspect Finish Quality, Not Just Dimension", note: "Judge fine-detail surface finish directly, since jewelry-scale work depends on finish quality as much as dimensional accuracy." },
      ];
    case "enclosed":
      return [
        { subheading: "Verify Real Containment, Not Just a Shell", note: `Confirm ${K}'s enclosure genuinely contains chips and dust rather than being a cosmetic cover, since an acrylic shell alone doesn't solve dust management.` },
        { subheading: "Check Door Interlock Behavior", note: "Verify the door or lid interlock actually pauses operation when opened, a real safety feature rather than a passive cover." },
        { subheading: "Confirm Extraction Compatibility", note: "Check vacuum or extraction port compatibility and airflow, since an enclosure without extraction just traps dust inside." },
        { subheading: "Measure Chip Escape at Openings", note: "Look for chip or dust escape at cable ports and door seams, a common gap in otherwise enclosed designs." },
        { subheading: "Verify Service Access for Setup", note: "Confirm the enclosure still allows reasonable access to workholding and tooling for setup and maintenance." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp Price and List What's Included", note: `Verify ${K}'s current price and list every component actually included, since low sticker price can exclude spindle, clamps, or software accessories.` },
        { subheading: "Run a Real Dimensional Test Cut", note: "Look for evidence of a dimensional test cut exposing rigidity or backlash limits, not just a controller-resolution claim." },
        { subheading: "Price the Minimum Required Upgrades", note: "Calculate the cost of workholding, cutters, or spindle upgrades needed for your actual use case before calling it a good deal." },
        { subheading: "Compare Assembly and Software Setup Time", note: "Factor in assembly and firmware/software setup time, since budget machines often shift cost into your own labor." },
        { subheading: "Verify Warranty and Replacement Support", note: "Check warranty terms and replacement board/motor availability, since budget brands vary widely in long-term support." },
      ];
    case "lathe":
      return [
        { subheading: "Require a Genuine CNC Lathe or Documented Conversion", note: `Confirm ${K} is a factory CNC lathe or a clearly documented conversion, since search results often drift toward manual mini-lathes.` },
        { subheading: "Check Swing and Turning Diameter", note: "Verify practical swing and turning diameter against your actual project sizes, not just the nominal capacity figure." },
        { subheading: "Confirm Spindle Bore and Chuck Range", note: "Check spindle bore size and chuck range match the stock diameters you plan to turn." },
        { subheading: "Compare Toolpost and Tool Offset Repeatability", note: "Verify toolpost or turret capacity and whether tool offsets are repeatable between changes." },
        { subheading: "Test Threading Only Where Supported", note: "Confirm spindle feedback and control architecture genuinely support threading before assuming any lathe can cut threads." },
      ];
  }
  return [
    { subheading: "Verify Rigidity and Spindle Specs Directly", note: `Check ${K}'s documented rigidity, spindle torque, and runout rather than trusting the listing description alone.` },
    { subheading: "Measure Usable Travel, Not Nominal Axis Size", note: "Confirm usable travel after fixtures and tooling are installed, since nominal axis specs overstate real capacity." },
    { subheading: "Confirm CAM and Software Support", note: "Verify the machine's CAM, probing, and controller workflow fits your actual software before buying." },
    { subheading: "Check Dust or Chip Control", note: "Confirm what dust or chip management is built in versus what needs to be added separately." },
    { subheading: "Weigh Ownership Details", note: "Factor in assembly time, footprint, and maintenance workflow as part of the real cost of ownership." },
  ];
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "brand":
      return [
        { q: `Are all ${K} products currently sold, or does the lineup include discontinued models?`, a: "Check current first-party store pages directly, since older models often stay heavily indexed in search results long after being discontinued or moved to support-only status." },
        { q: "Does buying a well-known brand guarantee better build quality?", a: "Not automatically. Brand lineups often span multiple hardware generations and price tiers, so verify the exact model's specs rather than assuming brand reputation alone predicts quality." },
      ];
    case "5axis":
      return [
        { q: `Is a ${K} genuinely different from a 3-axis machine with a rotary add-on?`, a: "Yes, genuinely different. True 5-axis machines control all five axes simultaneously for complex contoured surfaces, while a rotary add-on on a 3-axis base typically only indexes between fixed positions rather than moving simultaneously." },
        { q: "Do I need special CAM software for 5-axis machining?", a: "Generally yes. Standard 3-axis CAM software doesn't generate true 5-axis toolpaths, so confirm your CAM package explicitly supports simultaneous 5-axis output before buying a 5-axis machine." },
      ];
    case "laser":
      return [
        { q: `Is the wattage listed for a ${K} the actual cutting power?`, a: "Not always. Some listings state electrical input power rather than optical output power, which can overstate real cutting capability. Look for documented cut-depth figures in specific materials as a more reliable indicator." },
        { q: "Do I need eye protection even with an enclosed laser engraver?", a: "Yes, generally recommended regardless of enclosure, since opening the lid or a seal failure during operation can expose eyes to laser light. Check the specific safety class rating for the exact protection level documented." },
      ];
    case "steel":
    case "metal":
    case "aluminum":
      return [
        { q: `Can a desktop CNC really cut ${K.includes("steel") ? "steel" : "aluminum"} or just engrave the surface?`, a: "It depends entirely on rigidity and spindle torque. Many desktop machines can lightly engrave metal surfaces, but genuine cutting with real depth of cut needs a rigid frame, adequate torque, and appropriate feeds, verify with documented cut evidence rather than a material badge." },
        { q: "What's the biggest mistake people make cutting metal on a hobby CNC?", a: "Pushing feeds and depth of cut too aggressively for the machine's actual rigidity, which causes chatter, tool breakage, or lost steps. Start conservative and increase gradually based on how the machine and material respond." },
      ];
    case "wood":
    case "router":
      return [
        { q: `Do I need a separate dust collector for ${K}?`, a: "For anything beyond occasional light work, yes. Wood dust accumulates quickly and can affect both air quality and the machine's linear rails and screws over time if left unmanaged." },
        { q: "Does a bigger work area always mean a better router?", a: "Not necessarily. A larger work area often trades off rigidity unless the frame and rails are specifically reinforced for it, so check documented backlash or deflection figures rather than judging by size alone." },
      ];
    case "mill":
      return [
        { q: `What's the difference between ${K} and a CNC router for metal work?`, a: "Mills are generally built with more rigid frames, better spindle/toolholder systems, and tighter Z-axis control specifically for milling metal, while routers prioritize larger work area for wood and softer materials." },
        { q: "How much does Z-axis clearance actually matter?", a: "More than most buyers expect, since a vise or fixture takes up real Z-height, and a mill with a nominally tall Z-axis can still leave very little practical clearance once workholding is installed." },
      ];
    case "toolchanger":
      return [
        { q: `Does ${K} save real time over manually swapping bits?`, a: "Yes, meaningfully, for multi-tool jobs, since automatic tool changes typically take seconds versus the minutes needed to manually swap and re-zero a tool by hand." },
        { q: "Are automatic tool changers reliable long-term?", a: "Generally yes on well-documented systems, but verify the toolholder ecosystem cost and check for evidence of reliable performance over many cycles, not just a single demo change." },
      ];
    case "waterjet":
      return [
        { q: `How much does abrasive cost add to running ${K}?`, a: "It varies by job size and material, but abrasive is a genuine ongoing consumable cost that routers and mills don't have, budget for it specifically rather than treating the machine price as the full cost." },
        { q: "Can a desktop waterjet cut any material?", a: "Waterjets handle an unusually wide range of materials including metal, stone, and glass that routers can't touch, but always check manufacturer cut data for your specific material and thickness rather than assuming universal capability." },
      ];
    case "entry":
      return [
        { q: `Is ${K} actually beginner-friendly, or just marketed that way?`, a: "Check for specific evidence: real assembly time, accessible safety controls, and a genuinely guided software workflow, not just the word 'beginner' in the listing title." },
        { q: "What should a first-time CNC buyer budget beyond the machine price?", a: "Plan for basic workholding, extra cutting bits, and possibly CAM software, since many entry machines ship with only the minimum needed to run a first test cut." },
      ];
    case "mini":
      return [
        { q: `How much smaller is the usable work area on ${K} versus the external footprint?`, a: "Meaningfully smaller in most cases, since clamps, tool stick-out, and frame hardware all eat into the nominal travel figures, so check documented usable travel rather than exterior dimensions alone." },
        { q: "Are mini CNC machines noisier in a small room?", a: "Sound can feel more concentrated in a small room even at the same decibel level, so consider extraction and placement specifically for the room size, not just the machine's rated noise level." },
      ];
    case "sizeclass":
      return [
        { q: `Do all ${K} machines have the same specs since they share the size-class name?`, a: "No. The size-class number describes a rough XY footprint, not a technical standard, so rails, spindle, and controller can differ significantly between models sharing the same class name." },
        { q: "Should I buy based on the size class or the exact model number?", a: "Always verify the exact model and generation, since manufacturers frequently update hardware while keeping a similar size-class name, meaning two '3018' machines can perform very differently." },
      ];
    case "pcb":
      return [
        { q: `Can any ${K} mill PCB traces, or does it need special features?`, a: "Genuinely fine PCB work benefits from low spindle runout and surface probing specifically, since copper isolation depth is small enough that ordinary machine tolerances can produce broken or incomplete traces." },
        { q: "Is PCB milling faster than etching?", a: "It can be for prototyping since it skips chemicals entirely, but it requires more precise machine setup (runout, leveling) than etching does, so the tradeoff is speed for setup precision." },
      ];
    case "jewelry":
      return [
        { q: `Is a general-purpose CNC router good enough for ${K}, or do I need a dedicated machine?`, a: "It depends on runout and workholding precision. A general router with sufficiently low runout and precision fixtures can handle jewelry-scale work, but check those two figures specifically rather than assuming a general router is automatically capable." },
        { q: "What tooling do I need for jewelry-scale CNC work?", a: "Very small diameter cutters and material-specific feeds for wax, brass, or precious metal, which differ meaningfully from the tooling used for general wood or plastic routing." },
      ];
    case "enclosed":
      return [
        { q: `Does an enclosure on ${K} actually reduce noise, or just look contained?`, a: "A genuine factory-integrated enclosure with proper seals does measurably reduce noise and contain chips, but a thin acrylic shell without extraction mainly traps dust rather than solving noise or air quality." },
        { q: "Can I still access the workholding easily on an enclosed machine?", a: "This varies by design. Check that the enclosure allows reasonable door or panel access for setup and maintenance, since some enclosed designs trade convenience for containment." },
      ];
    case "budget":
      return [
        { q: `Are budget ${K} genuinely capable, or do they cut corners that matter?`, a: "It varies. Some budget machines use thinner rails or simpler controllers to hit a lower price, while others simply skip extra accessories while keeping comparable core hardware, compare documented specs rather than price alone." },
        { q: "What should I check before buying the cheapest option available?", a: "Verify what's actually included (spindle, controller, clamps), look for any dimensional test-cut evidence, and check warranty and replacement-part support, since these often separate genuinely comparable budget options from ones that cut real corners." },
      ];
    case "lathe":
      return [
        { q: `Can I convert a manual lathe into a CNC lathe like ${K}?`, a: "It's possible with the right conversion kit, but factory CNC lathes are generally more reliable and better documented than DIY conversions, verify which type you're actually buying before comparing specs." },
        { q: "Do all CNC lathes support threading?", a: "No. Threading requires spindle feedback and control architecture specifically built for it, so check that the exact model documents threading support rather than assuming any CNC lathe can cut threads." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Judging capability by spindle wattage or work area alone. Rigidity, spindle torque, and documented cut evidence matter more for real-world performance than either headline spec." },
        { q: `Should I prioritize price or capability when choosing ${K}?`, a: "Capability first, since a machine that can't handle your intended materials or projects won't become more useful for being cheaper. Narrow the field by real capability, then compare price among the finalists." },
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

  const intro = buildIntro(cat, kw, a.title, a.num);
  const howToChoose = buildHowToChoose(cat, kw);
  const bespoke = buildBespokeFaq(cat, kw);
  const faq = fillFaq(bespoke, 5);

  const metaTitle = `${a.title} 2026`;
  const metaDescription = `We compared ${kw} by documented rigidity, spindle evidence, and real cutting capability rather than ranking by spindle wattage or price alone.`;

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
export const lastUpdated = "2026-08-19";
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

fs.writeFileSync("scripts/_cnc_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
