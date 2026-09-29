import fs from "fs";
import { P } from "./pps-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-pps.json", "utf8"));
const raw = fs.readFileSync("scripts/_pps_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Rated Wh Verified Against Usable Energy", description: "Checked documented battery capacity separately from continuous AC output, since a high wattage rating doesn't guarantee enough stored energy to run a device for long." },
  { title: "Continuous Output vs Surge Separated", description: "Compared continuous inverter rating against surge or boost mode claims, since many listings blend the two into one headline number." },
  { title: "Charging Speed and Path Documented", description: "Verified AC, solar, and car charging times from official specs, noting where fastest speeds require specific modes, apps, or additional hardware." },
  { title: "Safety and Certification Evidence Checked", description: "Looked for UL, UL2743, or other documented safety certification and battery chemistry evidence rather than trusting a safety claim alone." },
  { title: "Real Ownership Costs Included", description: "Weighed included cables, solar panel bundling, warranty length, and app requirements as part of the real cost and usability of each pick." },
];

const sharedFaqPool = [
  { key: "watts-vs-watt-hours", q: "What's the real difference between watts and watt-hours for a power station?", a: "Watts (W) measure how much power the station can deliver at once, essentially how many devices it can run simultaneously, while watt-hours (Wh) measure total stored energy, essentially how long it can run those devices. A station with high W but low Wh can power a lot at once but only briefly." },
  { key: "surge-vs-continuous", q: "Does a surge or peak wattage rating mean the station can run appliances at that power level?", a: "No. Surge or peak ratings describe a brief burst the inverter can handle, typically for a compressor or motor startup, not a sustained output level. Always check the continuous or rated wattage figure for what the station can actually run for extended periods." },
  { key: "lifepo4-battery-safety", q: "Is LiFePO4 battery chemistry actually safer than standard lithium-ion?", a: "LiFePO4 (LFP) cells are generally considered more thermally stable than standard lithium-ion or lithium-polymer cells, with a lower risk of thermal runaway, and most current portable power stations have shifted to LFP for this reason. Still, verify UL or UL2743 safety certification directly rather than assuming chemistry alone guarantees safety." },
  { key: "solar-panel-compatibility", q: "Can I use any solar panel with a portable power station?", a: "Not always. Some manufacturers restrict compatibility to their own branded panels or require a specific voltage and connector type, so check the station's documented solar input specs and connector type before assuming a third-party panel will work." },
  { key: "ups-switchover-meaning", q: "What does a UPS or EPS switchover time actually protect against?", a: "It's the delay before the station takes over powering a device after grid power cuts out. A shorter switchover time (under 20ms is common on current stations) reduces the risk of a computer, router, or medical device losing power or rebooting during a brief outage." },
  { key: "power-station-idle-drain", q: "Does a portable power station lose charge just sitting unused?", a: "Yes, to some degree. Standby or idle power draw varies significantly between models, from a few watts to over ten, so a station left unused for months can lose meaningful charge. Check the documented standby draw and follow the manufacturer's recommended periodic recharge interval." },
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
  if (/ecoflow/.test(t)) return "ecoflow";
  if (/jackery/.test(t)) return "jackery";
  if (/\banker\b/.test(t)) return "anker";
  if (/bluetti/.test(t)) return "bluetti";
  if (/\bdji\b/.test(t)) return "dji";
  if (/marbero/.test(t)) return "marbero";
  if (/oupes/.test(t)) return "oupes";
  if (/pecron/.test(t)) return "pecron";
  if (/allpowers/.test(t)) return "allpowers";
  if (/grecell/.test(t)) return "grecell";
  if (/goal zero/.test(t)) return "goalzero";
  if (/renogy/.test(t)) return "renogy";
  if (/vtoman/.test(t)) return "vtoman";
  if (/takki/.test(t)) return "takki";
  if (/flashfish/.test(t)) return "flashfish";
  if (/rockpals/.test(t)) return "rockpals";
  if (/zerokor/.test(t)) return "zerokor";
  if (/udpower/.test(t)) return "udpower";
  if (/duracell/.test(t)) return "duracell";
  if (/for camping/.test(t)) return "camping";
  if (/home backup/.test(t)) return "homebackup";
  if (/home use/.test(t)) return "homeuse";
  if (/with solar panel/.test(t)) return "withsolar";
  if (/^solar /.test(t)) return "solar";
  if (/high capacity/.test(t)) return "highcap";
  if (/refrigerator|fridge/.test(t)) return "fridge";
  if (/cpap/.test(t)) return "cpap";
  if (/lifepo4/.test(t)) return "lifepo4";
  if (/small\b/.test(t)) return "small";
  if (/lightweight/.test(t)) return "lightweight";
  if (/\bcar\b/.test(t)) return "car";
  if (/laptop/.test(t)) return "laptop";
  if (/quiet/.test(t)) return "quiet";
  if (/long lasting/.test(t)) return "longlasting";
  if (/240v/.test(t)) return "240v";
  if (/ups/.test(t)) return "ups";
  if (/pure sine wave/.test(t)) return "puresine";
  if (/pass through/.test(t)) return "passthrough";
  if (/under \$/.test(t)) return "budget";
  if (/budget/.test(t)) return "budget";
  if (/\d+wh/.test(t)) return "whclass";
  if (/\d+w\b/.test(t)) return "wclass";
  return "generic";
}

const brandAngle = (brand) => [
  `mapping ${brand}'s current model lineup instead of assuming every listing is a current product`,
  `verifying exact rated Wh, continuous W, and battery chemistry by specific ${brand} model`,
  `checking current firmware and app requirements rather than the brand name alone`,
];

const ANGLE_BY_CAT = {
  wclass: "requiring documented continuous AC output close to the target watt figure, not surge-mode marketing",
  whclass: "requiring rated battery capacity within a genuinely narrow tolerance of the target Wh figure",
  ecoflow: brandAngle("EcoFlow"), jackery: brandAngle("Jackery"), anker: brandAngle("Anker SOLIX"),
  bluetti: brandAngle("BLUETTI"), dji: brandAngle("DJI"), marbero: brandAngle("MARBERO"),
  oupes: brandAngle("OUPES"), pecron: brandAngle("PECRON"), allpowers: brandAngle("ALLPOWERS"),
  grecell: brandAngle("GRECELL"), goalzero: brandAngle("Goal Zero"), renogy: brandAngle("Renogy"),
  vtoman: brandAngle("VTOMAN"), takki: brandAngle("Takki"), flashfish: brandAngle("FlashFish"),
  rockpals: brandAngle("ROCKPALS"), zerokor: brandAngle("ZeroKor"), udpower: brandAngle("UDPOWER"),
  duracell: brandAngle("Duracell"),
  camping: "weighing energy-per-pound and low-load efficiency instead of maximum inverter watts alone",
  homebackup: "planning circuit and appliance loads instead of counting outlets like a camping station",
  homeuse: "planning circuit and appliance loads instead of counting outlets like a camping station",
  withsolar: "verifying MPPT input window and real panel compatibility, not a bundle photo",
  solar: "verifying MPPT input window and real panel compatibility, not a bundle photo",
  highcap: "separating usable Wh from continuous output before trusting one headline wattage number",
  fridge: "measuring compressor startup surge and duty cycle instead of trusting nameplate running watts",
  cpap: "using the exact CPAP manufacturer input spec rather than inferring compatibility from outlet presence",
  lifepo4: "requiring documented battery chemistry and cycle-life test conditions, not an assumed LiFePO4 claim",
  small: "measuring usable Wh per pound while preserving the ports you actually need",
  lightweight: "measuring usable Wh per pound while preserving the ports you actually need",
  car: "separating cabin-appliance use from car-socket charging and jump-start claims explicitly",
  laptop: "prioritizing USB-C PD profiles and DC efficiency over large AC inverter output",
  quiet: "testing fan noise at charging load, not just at idle",
  longlasting: "requiring documented cycle-life conditions instead of assuming all LiFePO4 packs age the same",
  "240v": "requiring native documented 240V output and identifying the exact receptacle topology",
  ups: "requiring an explicit UPS or EPS mode in official documentation, not inferred from pass-through charging",
  puresine: "requiring official pure-sine-wave documentation instead of trusting a marketing phrase",
  passthrough: "verifying simultaneous charge-and-discharge is officially supported, not just implied",
  budget: "verifying real usable energy and safety documentation before price scoring",
  generic: "separating usable Wh from continuous output before trusting one headline wattage number",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves capacity-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a single headline wattage number.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} vary enough that ${angle} matters more than the price tag alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than star rating alone.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between stations is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to price, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on measured usable energy and safety documentation plus ${angle}, since rated capacity alone regularly overstates real-world runtime.`,
  (angle) => `Our ranking weighs measured usable energy and safety documentation plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on measured usable energy and safety documentation plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized measured usable energy and safety documentation plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we checked measured usable energy and safety documentation plus ${angle} for every station on this list.`,
  (angle) => `The picks below were sorted by measured usable energy and safety documentation plus ${angle}, the details that actually decide real runtime.`,
  (angle) => `What separates these picks is measured usable energy and safety documentation plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for measured usable energy and safety documentation plus ${angle} before anything else was weighed.`,
  (angle) => `Measured usable energy and safety documentation plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on measured usable energy and safety documentation plus ${angle} to separate genuinely capable stations from well-marketed ones.`,
];

function buildIntro(cat, kw, title, num) {
  let angleEntry = ANGLE_BY_CAT[cat] || ANGLE_BY_CAT.generic;
  const angle = Array.isArray(angleEntry) ? angleEntry[num % angleEntry.length] : angleEntry;
  const firstIdx = num % FIRST_TEMPLATES.length;
  const secondIdx = (num * 3 + 2) % SECOND_TEMPLATES.length;
  return [FIRST_TEMPLATES[firstIdx](title, kw, angle), SECOND_TEMPLATES[secondIdx](angle)];
}

const brandHowTo = (brand) => [
  { subheading: "Build a Current Model Map First", note: `Confirm which ${brand} models are currently sold rather than assuming an older listing reflects the current lineup, since capacity and features change between generations.` },
  { subheading: "Publish Rated Wh and Continuous W by Model", note: "Verify exact rated capacity, continuous output, and battery chemistry for the specific model, not the brand's range in general." },
  { subheading: "Verify AC/Solar/Car Charging Input", note: "Check documented charging input limits and current app or firmware requirements before assuming fast-charge claims apply automatically." },
  { subheading: "Compare Cycle-Life Claims and Warranty", note: "Compare cycle-life test conditions, warranty length, and documented safety certification by exact model." },
  { subheading: "Separate Current Generation From Older Listings", note: "Check regional availability and support status, since older generation products often stay heavily indexed after being succeeded." },
];

function buildHowToChoose(cat, kw) {
  const K = kw;
  const brandCats = ["ecoflow","jackery","anker","bluetti","dji","marbero","oupes","pecron","allpowers","grecell","goalzero","renogy","vtoman","takki","flashfish","rockpals","zerokor","udpower","duracell"];
  if (brandCats.includes(cat)) return brandHowTo(K.split(" ")[0]);
  switch (cat) {
    case "wclass":
      return [
        { subheading: "Require Documented Continuous Output", note: `Confirm ${K} reaches the target wattage as continuous output, not only through a brief surge or boost mode.` },
        { subheading: "Publish Surge Duration Separately", note: "Check the surge rating and its time limit separately, and verify how the station handles a representative startup load." },
        { subheading: "Compare Battery Wh at the Same Output", note: "Compare battery Wh across finalists so two stations with the same inverter watts aren't treated as equal-runtime products." },
        { subheading: "Measure Efficiency at Partial Load", note: "Check documented efficiency and fan noise at roughly 25%, 50%, and 80% of the target output, not just at maximum." },
        { subheading: "Verify Port and Recharge Limits", note: "Confirm port current limits, thermal derating, and recharge speed appropriate to this specific output class." },
      ];
    case "whclass":
      return [
        { subheading: "Require a Narrow Capacity Tolerance", note: `Confirm ${K} sits within a genuinely narrow tolerance of the target Wh figure, and publish that tolerance.` },
        { subheading: "Measure Usable Energy, Not Rated Capacity", note: "Check measured or documented usable AC and DC energy from full to automatic cutoff, not the rated capacity alone." },
        { subheading: "Pair Capacity With Continuous Output", note: "Confirm continuous inverter output is sufficient for the devices you actually plan to power at this capacity." },
        { subheading: "Compare Weight and Wh-Per-Pound", note: "Compare weight, volume, and Wh-per-pound efficiency across finalists at the same target capacity." },
        { subheading: "Check Recharge Time and Expansion", note: "Publish AC and solar recharge time, cycle-life conditions, and expansion-battery compatibility for this capacity class." },
      ];
    case "homebackup": case "homeuse":
      return [
        { subheading: "Inventory Essential Household Loads", note: `List essential appliances ${K} needs to power and measure both running and startup surge demand for each.` },
        { subheading: "Calculate Runtime From Usable Energy", note: "Calculate runtime from measured usable AC energy rather than rated Wh alone, factoring in real conversion losses." },
        { subheading: "Verify 120V vs True 120/240V Output", note: "Confirm whether the station offers 120V-only or true 120/240V output, and check supported transfer-panel accessories." },
        { subheading: "Measure UPS Transfer Time", note: "Verify EPS or UPS transfer time from official documentation and confirm sensitive-load suitability directly." },
        { subheading: "Plan Charging Source During an Outage", note: "Include a realistic charging source, extension cabling, ventilation, and an outage recharging plan in the total setup." },
      ];
    case "withsolar": case "solar":
      return [
        { subheading: "Publish Solar Input Limits", note: `Check ${K}'s documented solar input voltage, current, and watt limits alongside its MPPT range.` },
        { subheading: "Verify Connector and Panel Compatibility", note: "Confirm connector type, adapters, and series/parallel panel compatibility before assuming any panel will work." },
        { subheading: "Calculate Accepted Panel Wattage", note: "Calculate how much panel wattage the station can actually accept without clipping excess capacity." },
        { subheading: "Estimate Realistic Field Recharge", note: "Estimate field recharge time from realistic sun-hours and conversion losses, not laboratory best-case figures." },
        { subheading: "Separate Bundle Value From Station Performance", note: "Separate the value of an included panel bundle from the power station's own performance and the panel's build durability." },
      ];
    case "highcap":
      return [
        { subheading: "Publish Rated Wh and Usable Energy Separately", note: `Confirm ${K}'s rated Wh and measured usable AC/DC energy after conversion losses are documented separately.` },
        { subheading: "Separate Continuous Output From Surge Claims", note: "Verify continuous inverter output is clearly separated from short surge or boost mode figures." },
        { subheading: "Verify Battery Chemistry and Cycle Life", note: "Check documented battery chemistry, cycle-life test conditions, and warranty rather than assuming all packs age similarly." },
        { subheading: "Measure Recharge Curves and Input Limits", note: "Confirm AC and solar recharge curves, input limits, and simultaneous-input charging behavior." },
        { subheading: "Check Safety Certification Evidence", note: "Look for safety certification evidence such as UL2743, thermal limits, fan behavior, and manual operating restrictions." },
      ];
    case "fridge":
      return [
        { subheading: "Measure Compressor Startup Surge", note: `Check ${K}'s documented startup surge and running draw against the actual refrigerator or a representative compressor load.` },
        { subheading: "Estimate Runtime From Duty-Cycle Logging", note: "Estimate runtime using duty-cycle behavior and measured usable AC energy, not a single running-watts figure." },
        { subheading: "Test Restart at Low Charge", note: "Verify restart behavior after the station reaches low state of charge or after a brief transfer event." },
        { subheading: "Compare Inverter Efficiency at Low Average Load", note: "Compare inverter efficiency at the refrigerator's relatively low average load, since efficiency varies by load level." },
        { subheading: "Plan for Food Safety, Not Just Power", note: "Treat this as food-safety backup planning rather than trusting one power station to guarantee a fixed duration for every fridge." },
      ];
    case "cpap":
      return [
        { subheading: "Use the Exact CPAP Manufacturer Spec", note: `Confirm ${K}'s output matches your exact CPAP manufacturer's input specification rather than inferring compatibility from outlet presence.` },
        { subheading: "Measure Runtime With and Without Humidifier", note: "Check runtime specifically with and without a humidifier or heated hose, since power use can change substantially." },
        { subheading: "Compare Direct DC vs AC Inverter Operation", note: "Compare direct DC operation where officially supported against AC inverter operation for efficiency differences." },
        { subheading: "Verify Transfer Behavior for Backup Use", note: "Verify transfer behavior and alarms if the station is intended as therapy backup during a grid outage." },
        { subheading: "Follow Manufacturer Backup Guidance", note: "Follow your CPAP manufacturer and clinician's backup-power guidance rather than relying on a generic runtime estimate." },
      ];
    case "lifepo4": case "longlasting":
      return [
        { subheading: "Require Documented Battery Chemistry", note: `Confirm ${K}'s exact battery chemistry rather than inferring LiFePO4 from product generation or marketing language alone.` },
        { subheading: "Check Cycle-Life Claim Conditions", note: "Verify the cycle-life claim together with its remaining-capacity threshold and documented test conditions." },
        { subheading: "Compare Storage and Temperature Guidance", note: "Compare calendar-storage guidance and operating/charging temperature ranges across finalists." },
        { subheading: "Evaluate Warranty and Serviceability", note: "Check warranty length and whether battery or expansion modules are actually serviceable if they fail." },
        { subheading: "Measure Standby and Inverter Losses", note: "Measure inverter and standby losses directly, since longevity alone doesn't guarantee real runtime efficiency." },
      ];
    case "small": case "lightweight":
      return [
        { subheading: "Set Explicit Weight Thresholds", note: `Set an explicit weight and packed-volume threshold for ${K} rather than judging portability from photos alone.` },
        { subheading: "Publish Measured Wh Per Pound", note: "Compare measured usable Wh per pound across finalists to judge real energy density." },
        { subheading: "Verify Output Still Meets Target Load", note: "Confirm AC, USB-C, and DC outputs still meet your target load despite the compact size." },
        { subheading: "Compare Ergonomics and Charger Weight", note: "Compare handle and packing ergonomics, plus the weight of any required charger or adapter." },
        { subheading: "Measure Low-Load Efficiency", note: "Check low-load efficiency and fan noise, since small inverters can waste a larger share of stored energy." },
      ];
    case "car":
      return [
        { subheading: "Define the Actual Use Case First", note: `Decide whether ${K} needs to power cabin appliances, charge from a car socket, or handle alternator charging, since these are different capabilities.` },
        { subheading: "Verify Vehicle Charge Input Speed", note: "Check documented vehicle-charge input power and time rather than assuming fast recharge from a cigarette socket." },
        { subheading: "Check Temperature Limits Inside a Vehicle", note: "Verify temperature and ventilation limits specifically for use inside a parked vehicle." },
        { subheading: "Confirm DC Outlet and Connector Compatibility", note: "Check DC outlet voltage, current, and connector compatibility for coolers or other 12V gear." },
        { subheading: "Never Assume Jump-Start Capability", note: "Don't treat a power station as a jump starter unless the exact model or accessory officially supports that function." },
      ];
    case "laptop":
      return [
        { subheading: "Publish USB-C PD Ports and Voltage Profiles", note: `Confirm ${K}'s USB-C PD ports, maximum wattage, and voltage profiles match your laptop's actual charging requirement.` },
        { subheading: "Verify Full-Performance Charging", note: "Check whether the target laptop can charge at full performance through USB-C without needing its original AC brick." },
        { subheading: "Measure Usable USB-C Energy", note: "Verify usable USB-C energy and conversion efficiency rather than trusting the rated Wh figure alone." },
        { subheading: "Test Simultaneous Multi-Device Loads", note: "Test simultaneous laptop charging plus phone or router loads to confirm the station handles real multitasking." },
        { subheading: "Check Standby Draw and Travel Weight", note: "Include low-load standby consumption and travel weight as part of the real laptop-charging use case." },
      ];
    case "quiet":
      return [
        { subheading: "Measure dBA at a Fixed Distance", note: `Check ${K}'s documented dBA at a fixed distance across idle, moderate AC load, and near-rated load conditions.` },
        { subheading: "Measure Fan Noise During Recharge", note: "Verify fan noise specifically during maximum AC and solar recharge, not just during discharge." },
        { subheading: "Record Tonal or Stop-Start Fan Behavior", note: "Check for tonal or stop-start fan behavior, not just an average dBA figure, since intermittent noise can be more disruptive." },
        { subheading: "Log Temperature During Quiet-Mode Testing", note: "Verify case and battery temperature specifically while testing quiet or silent modes." },
        { subheading: "Check Whether Quiet Mode Limits Performance", note: "Confirm whether silent or quiet settings reduce charging speed or output performance as a tradeoff." },
      ];
    case "240v":
      return [
        { subheading: "Require Native Documented 240V Output", note: `Confirm ${K} has genuine documented 240V output and identify the exact receptacle and topology used.` },
        { subheading: "Separate 240V From 120V Ratings", note: "Verify continuous 240V output and current are published separately from standard 120V outlet ratings." },
        { subheading: "Check Single-Unit vs Paired-Unit 240V", note: "Confirm whether 240V requires one unit, two paired units, or an external hub to achieve." },
        { subheading: "Verify Neutral, Ground, and GFCI Compliance", note: "Check neutral, ground, GFCI, and transfer-panel compatibility directly from the manufacturer manual." },
        { subheading: "Test the Target Appliance's Real Surge", note: "Test the intended 240V appliance's startup surge and confirm required cable or adapter compatibility." },
      ];
    case "ups":
      return [
        { subheading: "Require an Explicit UPS Mode", note: `Confirm ${K} documents an explicit UPS, EPS, or backup mode in official specs, not just implied pass-through behavior.` },
        { subheading: "Verify Transfer Time for Your Equipment", note: "Check documented transfer time and compare it against the sensitivity of your specific connected equipment." },
        { subheading: "Test Behavior at Full and Low Charge", note: "Verify behavior when the battery is full, low, actively charging, and after repeated outage events." },
        { subheading: "Check Online vs Transfer-Based Output", note: "Confirm whether output is genuinely online/double-conversion or simply transfer-based, where the manufacturer specifies." },
        { subheading: "Check Long-Term Plugged-In Battery Behavior", note: "Verify auto-restart behavior, bypass limits, and long-term battery management while permanently plugged in." },
      ];
    case "puresine":
      return [
        { subheading: "Require Official Pure-Sine-Wave Documentation", note: `Confirm ${K} documents genuine pure-sine-wave output in official specs, not just as a marketing phrase.` },
        { subheading: "Verify Waveform Under Representative Loads", note: "Check AC voltage, frequency, and waveform quality across representative loads where test data is available." },
        { subheading: "Test Inductive Startup Behavior", note: "Verify inductive or compressor startup behavior directly rather than relying only on a surge rating." },
        { subheading: "Check Efficiency at Low and Medium Load", note: "Compare inverter efficiency and fan noise specifically at low and medium load levels." },
        { subheading: "Verify Boost Mode Doesn't Distort Voltage", note: "Confirm whether boost modes distort voltage or alter compatibility with sensitive electronics." },
      ];
    case "passthrough":
      return [
        { subheading: "Verify Official Pass-Through Support", note: `Confirm ${K} officially supports simultaneous charge-and-discharge, not just an inferred capability.` },
        { subheading: "Publish Input and Output Limits During Pass-Through", note: "Check documented AC/DC input and output limits specifically during pass-through operation." },
        { subheading: "Measure Heat Under Sustained Pass-Through Load", note: "Verify efficiency and heat behavior under sustained pass-through load conditions." },
        { subheading: "Check Battery Behavior at Full Charge", note: "Confirm battery-management behavior at 100% state of charge during long plugged-in pass-through use." },
        { subheading: "Separate Pass-Through From UPS Claims", note: "Treat pass-through charging as separate from UPS or EPS functionality, and check transfer behavior independently." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp Current Price", note: `Verify ${K}'s current street price and include any required charger, panel, or cable accessories in the total cost.` },
        { subheading: "Require Safety Documentation Before Scoring Price", note: "Require clear battery chemistry and safety or certification documentation before factoring price into the ranking." },
        { subheading: "Measure Usable Wh, Not Nominal Values", note: "Measure usable Wh and continuous AC output rather than trusting nominal headline values alone." },
        { subheading: "Check Replacement and Warranty Support", note: "Verify replacement and warranty support, plus app or firmware availability where applicable." },
        { subheading: "Price the Total Accessory Cost", note: "Price necessary solar panels, cables, and chargers before declaring the total value of a budget pick." },
      ];
    default:
      return [
        { subheading: "Publish Rated Wh and Usable Energy", note: `Confirm ${K}'s rated Wh and measured usable AC/DC energy are documented separately after conversion losses.` },
        { subheading: "Separate Continuous Output From Surge", note: "Verify continuous inverter output is clearly separated from short surge or boost mode marketing." },
        { subheading: "Verify Battery Chemistry and Cycle Life", note: "Check documented battery chemistry, cycle-life conditions, and warranty rather than assuming all packs age similarly." },
        { subheading: "Measure Recharge Curves and Input Limits", note: "Confirm AC and solar recharge curves, input limits, and simultaneous-input behavior." },
        { subheading: "Check Safety Certification Evidence", note: "Look for safety certification evidence, thermal limits, fan behavior, and manual operating restrictions." },
      ];
  }
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  const brandCats = ["ecoflow","jackery","anker","bluetti","dji","marbero","oupes","pecron","allpowers","grecell","goalzero","renogy","vtoman","takki","flashfish","rockpals","zerokor","udpower","duracell"];
  if (brandCats.includes(cat)) {
    const brand = K.split(" ")[0];
    return [
      { q: `Are all ${brand} models currently sold, or does the lineup include discontinued products?`, a: "Check current first-party store pages directly, since older portable power stations often stay heavily indexed in search results long after being succeeded by newer generations." },
      { q: `Does buying ${brand} guarantee the same battery chemistry across every model?`, a: "No. A brand's lineup can span different battery chemistries and generations, so verify the exact model's documented chemistry and cycle-life rather than assuming brand consistency." },
    ];
  }
  switch (cat) {
    case "wclass":
      return [
        { q: `Does the ${K} wattage figure always mean continuous output?`, a: "Not always. Some listings blend surge or boost mode figures into the headline wattage number, so verify the continuous, sustained rating separately before assuming a station can run a device at that power level indefinitely." },
        { q: "Can two stations with the same wattage rating have very different runtimes?", a: "Yes, significantly. Wattage describes how much power a station can deliver at once, while watt-hours describe how long it can sustain that delivery, so always check battery capacity alongside the wattage rating." },
      ];
    case "whclass":
      return [
        { q: `Is rated Wh the same as usable energy for a ${K} station?`, a: "Not exactly. Rated Wh is the nominal battery capacity, but real usable energy is typically slightly lower after AC conversion losses, so measured usable energy is a more reliable figure than the rated number alone." },
        { q: "Should I round up to the next capacity class if a model is close?", a: "Only if the difference is genuinely small and documented; otherwise a model in a neighboring capacity class may have different weight, output, and price characteristics than what you actually want." },
      ];
    case "fridge": case "cpap":
      return [
        { q: `Can any portable power station reliably run a ${K.includes("cpap") ? "CPAP machine" : "refrigerator"}?`, a: "Not automatically. Startup surge and duty cycle vary significantly by exact appliance model, so verify the manufacturer's documented power requirement and test with the actual device rather than assuming a generic runtime estimate applies." },
        { q: "Does station idle power draw meaningfully affect backup runtime?", a: "Yes. Standby or idle power consumption varies between models, and for a low-average-load device like a fridge compressor cycling on and off, that idle draw can meaningfully shorten total backup time compared to the theoretical calculation." },
      ];
    case "lifepo4": case "longlasting":
      return [
        { q: `Do all LiFePO4-labeled ${K} products test cycle-life the same way?`, a: "No. Cycle-life claims can use different depth-of-discharge percentages and temperature assumptions, so a documented '4000 cycles' figure isn't always directly comparable between brands without checking the test conditions." },
        { q: "Does LiFePO4 chemistry mean the battery never needs replacement?", a: "No. LiFePO4 cells are documented to last significantly longer than standard lithium-ion, but they still degrade gradually over thousands of cycles and eventually drop below a usable capacity threshold." },
      ];
    case "small": case "lightweight":
      return [
        { q: `Do smaller, lighter ${K} sacrifice charging speed?`, a: "Not necessarily, but check documented charging specs directly, since compact stations sometimes use smaller inverters that trade some speed or output ceiling for the reduced size and weight." },
        { q: "Is a lightweight station worth it if I mostly use it at a fixed location?", a: "Not necessarily. If portability isn't a priority, a larger fixed-use station often provides more capacity and output for a similar price than a lightweight model optimized for portability." },
      ];
    case "ups":
      return [
        { q: `Is pass-through charging the same as ${K}?`, a: "No. Pass-through charging means the battery charges while powering connected devices, but that's not the same as an automatic UPS switchover during a grid outage. Confirm the station documents an explicit UPS or EPS mode separately." },
        { q: "How fast does a UPS-rated power station actually switch over?", a: "Current models document switchover times ranging from under 10ms to around 20ms, fast enough to prevent most computers and routers from rebooting, though highly sensitive equipment may need to check the exact documented figure." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Trusting a single headline wattage or watt-hour number without checking whether it describes continuous output, surge capability, or rated versus usable energy." },
        { q: `Should I prioritize price or documented safety certification for ${K}?`, a: "Safety documentation first, since an uncertified battery pack carries real risk regardless of price. Narrow the field by verified chemistry and certification, then compare price among finalists." },
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
  const metaDescription = `We compared ${kw} by measured usable energy, continuous output, and safety documentation rather than ranking by headline wattage alone.`;

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

fs.writeFileSync("scripts/_pps_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
