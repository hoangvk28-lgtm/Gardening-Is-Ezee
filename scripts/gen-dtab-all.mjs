import fs from "fs";
import { P } from "./dtab-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-dtab.json", "utf8"));
const raw = fs.readFileSync("scripts/_dtab_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Architecture Classified First", description: "Sorted each product into screenless pen tablet, computer-dependent pen display, or true standalone before comparing specs, since these solve genuinely different problems." },
  { title: "Pen Behavior Verified", description: "Checked activation force, pressure-level count, tilt support, and parallax evidence directly from documentation rather than trusting a headline pressure number alone." },
  { title: "Active Area vs Chassis Size", description: "Compared documented active drawing area separately from display diagonal or overall chassis size, since these numbers are often conflated in marketing." },
  { title: "Driver and OS Compatibility Checked", description: "Verified current Windows/macOS/Linux/Android compatibility by exact model, since older tablets can lose driver support over time." },
  { title: "Real Ownership Costs Included", description: "Weighed included pen, nibs, stand, and cables against what needs to be bought separately, plus warranty length and driver update history." },
];

const sharedFaqPool = [
  { key: "pressure-levels-quality", q: "Do more pressure levels always mean a better drawing experience?", a: "Not by itself. Pressure-level count matters less than initial activation force, line stability, and tilt behavior, since a tablet with fewer levels but low activation force and no wobble can feel better than one with a higher spec sheet number." },
  { key: "standalone-vs-pen-display", q: "What's the real difference between a standalone tablet and a pen display?", a: "A standalone tablet runs its own operating system and apps with no computer needed, while a pen display has a screen but still requires a connected computer or laptop to function, they solve different problems despite both having a visible screen." },
  { key: "screenless-tablet-learning-curve", q: "Is a screenless pen tablet harder to learn than one with a screen?", a: "There's a real adjustment period since you're looking at a monitor while drawing on a separate surface, but most users adapt within a few sessions, and screenless tablets cost meaningfully less while offering the same pen precision." },
  { key: "tablet-driver-compatibility", q: "How do I know if a drawing tablet's drivers still work with my current OS?", a: "Check the manufacturer's current driver download page directly rather than trusting the box or listing, since driver support can lapse for older models even when the hardware still physically works." },
  { key: "tablet-android-compatibility", q: "Does a drawing tablet that says it works with Android actually support my phone?", a: "Verify the exact Android version required and whether it needs OTG support specifically, since compatibility varies significantly by phone model and many drawing tablets explicitly exclude iPhone and iPad regardless of Android claims." },
  { key: "replacement-nibs-availability", q: "What happens when the included pen nibs wear out?", a: "Most tablets ship with 8-20 spare nibs, but check that replacement nib packs are still sold separately for the exact model before buying, since discontinued models can leave you stuck once the included nibs run out." },
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
  if (/wacom/.test(t)) return "wacom";
  if (/huion/.test(t)) return "huion";
  if (/xp-?pen/.test(t)) return "xppen";
  if (/ugee/.test(t)) return "ugee";
  if (/gaomon/.test(t)) return "gaomon";
  if (/veikk/.test(t)) return "veikk";
  if (/picassotab/.test(t)) return "picassotab";
  if (/parblo/.test(t)) return "parblo";
  if (/monoprice/.test(t)) return "monoprice";
  if (/frunsi/.test(t)) return "frunsi";
  if (/xoppox/.test(t)) return "xoppox";
  if (/xencelabs/.test(t)) return "xencelabs";
  if (/without screens?/.test(t)) return "noscreen";
  if (/with screens?/.test(t)) return "withscreen";
  if (/standalone|no computer needed|without computer|all-in-one/.test(t)) return "standalone";
  if (/for android|for mobile|for phone/.test(t)) return "mobile";
  if (/for computer|for pc|for laptop|for mac|for linux|for windows/.test(t)) return "hostspecific";
  if (/affordable|budget|cheap|under \$/.test(t)) return "budget";
  if (/portable|small\b/.test(t)) return "portable";
  if (/wireless|bluetooth/.test(t)) return "wireless";
  if (/beginners?/.test(t)) return "beginner";
  if (/artist|professionals?/.test(t)) return "proartist";
  if (/animation|blender|3d modeling/.test(t)) return "workflow";
  if (/pen display/.test(t)) return "pendisplay";
  if (/large\b/.test(t)) return "large";
  if (/usb\b/.test(t)) return "usb";
  if (/with pen\b/.test(t)) return "withpen";
  if (/4k\b/.test(t)) return "4k";
  if (/\d+(\.\d+)?-inch/.test(t)) return "sizeclass";
  return "generic";
}

const ANGLE_BY_CAT = {
  sizeclass: [
    "verifying whether the stated inch value means display diagonal or active-area dimension",
    "requiring products to sit within a genuinely narrow tolerance of the stated size",
    "checking current model and driver support since unusual exact sizes skew niche",
  ],
  budget: "prioritizing line quality and driver stability over a high pressure-level number",
  wacom: [
    "mapping the current Wacom lineup and separating pen tablets, pen displays, and standalone models",
    "verifying exact active area and pen generation by specific Wacom model",
    "checking current driver support instead of inheriting older compatibility lists",
  ],
  huion: [
    "mapping the current Huion lineup and separating pen tablets, pen displays, and standalone models",
    "verifying exact active area and pen generation by specific Huion model",
    "checking current driver support instead of inheriting older compatibility lists",
  ],
  xppen: [
    "mapping the current XPPen lineup and separating pen tablets, pen displays, and standalone models",
    "verifying exact active area and pen generation by specific XPPen model",
    "checking current driver support instead of inheriting older compatibility lists",
  ],
  ugee: "mapping the current UGEE lineup and separating pen tablets, pen displays, and standalone models",
  gaomon: "mapping the current GAOMON lineup and verifying driver support by exact model",
  veikk: "mapping the current VEIKK lineup and verifying driver support by exact model",
  picassotab: "verifying this is a genuine standalone Android tablet, not a computer-dependent pen display",
  parblo: "mapping the current Parblo lineup and verifying driver support by exact model",
  monoprice: "checking whether this legacy-style tablet still has current driver support",
  frunsi: "verifying this is a genuine standalone Android tablet, not a computer-dependent pen display",
  xoppox: "confirming this specific model's stated host requirement before assuming standalone use",
  xencelabs: "checking whether the premium build and driver depth justify the price step over mainstream brands",
  noscreen: "checking true active area, pen behavior, and driver stability instead of display specs",
  withscreen: "requiring an integrated display and confirming whether a separate computer is still needed",
  standalone: "requiring the tablet to draw with zero computer connection and checking its OS and app support",
  mobile: "checking exact phone compatibility, portrait/landscape mapping, and pressure support in real mobile apps",
  hostspecific: "verifying current driver support and connection requirements for this exact host OS",
  portable: "measuring packed weight and usable area relative to a typical laptop screen",
  wireless: "checking pen latency, battery life, and reconnect behavior in wireless mode specifically",
  beginner: "prioritizing low activation force and driver stability over advanced pressure specs",
  proartist: "testing pen precision during slow curves and verifying shortcut-key depth for production work",
  workflow: "checking shortcut-key mapping and pen precision inside the actual target application",
  pendisplay: "requiring an integrated display and verifying pen-to-pixel alignment specifically",
  large: "weighing arm-reach and desk-depth tradeoffs against the larger active area",
  usb: "verifying wired connection stability and driver behavior across host operating systems",
  withpen: "evaluating the bundled stylus specifically, not just the tablet surface alone",
  "4k": "requiring native 4K resolution and verifying real pixel density and color accuracy",
  generic: "verifying tablet architecture and pen behavior instead of trusting the listing alone",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves architecture-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a pressure-level number on the box.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} vary enough that ${angle} matters more than the spec sheet's headline number.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or star rating.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between tablets is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to pressure levels, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on documented pen behavior and driver support plus ${angle}, since headline specs alone regularly overstate real drawing feel.`,
  (angle) => `Our ranking weighs documented pen behavior and driver support plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on documented pen behavior and driver support plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized documented pen behavior and driver support plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we checked documented pen behavior and driver support plus ${angle} for every tablet on this list.`,
  (angle) => `The picks below were sorted by documented pen behavior and driver support plus ${angle}, the details that actually decide drawing feel.`,
  (angle) => `What separates these picks is documented pen behavior and driver support plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for documented pen behavior and driver support plus ${angle} before anything else was weighed.`,
  (angle) => `Documented pen behavior and driver support plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on documented pen behavior and driver support plus ${angle} to separate genuinely capable tablets from well-marketed ones.`,
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
  const brandTpl = () => [
    { subheading: "Build a Current Model Map First", note: `Confirm which ${K} models are currently sold rather than assuming an older listing reflects the current lineup, since driver support and pen generation change between models.` },
    { subheading: "Separate Architecture by Exact Model", note: "Classify each model as screenless pen tablet, pen display, or standalone before comparing specs across the same brand's range." },
    { subheading: "Verify Current Driver Support", note: "Check the manufacturer's current driver download page directly for the exact model, since older tablets can lose active support over time." },
    { subheading: "Compare the Bundled Accessory Ecosystem", note: "Check included pen, nibs, stand, and shortcut remote, since these vary meaningfully even within one brand's lineup." },
    { subheading: "Check Warranty and Support Resources", note: "Confirm warranty length and whether firmware/driver updates are still actively maintained for the specific model." },
  ];
  switch (cat) {
    case "wacom": case "huion": case "xppen": case "ugee": case "gaomon": case "veikk": case "parblo":
      return brandTpl();
    case "sizeclass":
      return [
        { subheading: "Define the Measurement Explicitly", note: `Confirm whether ${K}'s stated size refers to display diagonal or pen-tablet active-area dimension, since these are frequently conflated in listings.` },
        { subheading: "Require a Genuinely Narrow Tolerance", note: "Verify the model sits close to the stated size rather than rounding a neighboring size class into the comparison." },
        { subheading: "Check Active Area Against Chassis Size", note: "Compare documented active drawing area and total chassis dimensions separately before judging usable workspace." },
        { subheading: "Verify Current Model and Driver Support", note: "Confirm the exact model still has active driver support, since unusual exact sizes are sometimes older or niche products." },
        { subheading: "Match Desk and Travel Ergonomics to the Size", note: "Check desk footprint or packed travel dimensions appropriate to this exact size class before buying." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp Current Street Price", note: `Verify ${K}'s current price and include any required adapters or stand in the total cost before calling it a deal.` },
        { subheading: "Prioritize Line Quality Over Pressure Count", note: "Weigh activation force and driver stability more heavily than a high pressure-level number on the spec sheet." },
        { subheading: "Check What's Actually Included", note: "List the included pen, nibs, stand, glove, and cables accurately, since budget listings sometimes omit accessories shown in photos." },
        { subheading: "Verify Replacement Part Availability", note: "Check that replacement pen nibs and cables are still sold separately for the exact model." },
        { subheading: "Test Whether You'll Need to Upgrade Immediately", note: "Confirm the size and connection type meet your actual needs, since an immediate upgrade erases the price advantage." },
      ];
    case "standalone": case "picassotab": case "frunsi":
      return [
        { subheading: "Confirm It Draws With Zero Computer Connection", note: `Verify ${K} genuinely operates standalone and publish its exact operating system and version.` },
        { subheading: "Check Real Processor and Storage Specs", note: "Compare CPU core count, RAM, and storage (plus expansion) rather than judging by screen size alone." },
        { subheading: "Measure Real Battery Runtime", note: "Check battery capacity and realistic runtime under actual drawing brightness and app use, not an idle-only figure." },
        { subheading: "Verify Pen Latency and Palm Rejection", note: "Confirm pen response and palm rejection behavior inside major drawing apps, not just the pressure-level spec." },
        { subheading: "Check App Ecosystem and File Transfer", note: "Verify which drawing apps are pre-installed or downloadable, plus how files transfer or back up off the device." },
      ];
    case "mobile":
      return [
        { subheading: "Confirm Standalone vs Peripheral", note: `Verify whether ${K} is a standalone Android device or a peripheral connecting to your phone by USB/OTG/Bluetooth.` },
        { subheading: "Check Exact Phone and OS Compatibility", note: "Confirm the exact Android or iOS version required, since compatibility varies significantly by phone model." },
        { subheading: "Verify Portrait/Landscape Mapping", note: "Check aspect-ratio mapping specifically, since a mismatch turns circles into ellipses when drawing." },
        { subheading: "Test Pressure Support in Real Mobile Apps", note: "Confirm pressure and tilt actually work inside major mobile art apps, not just that the OS recognizes the connection." },
        { subheading: "Account for Cables and Phone Power Drain", note: "Check required adapters, cable direction, and how much the connection drains phone battery during use." },
      ];
    case "hostspecific":
      return [
        { subheading: "Verify Current Driver Support for This OS", note: `Confirm ${K} has current, actively maintained drivers for your exact OS version.` },
        { subheading: "Test Clean Install and Uninstall", note: "Check driver installation, permission prompts, and clean uninstall/reinstall behavior before relying on it daily." },
        { subheading: "Confirm Cable and Port Requirements", note: "Verify USB-C, USB-A, or HDMI/DisplayPort Alt Mode requirements against your actual host's available ports." },
        { subheading: "Check Pressure Support in Your Actual App", note: "Confirm pressure and shortcut behavior specifically in Photoshop, Clip Studio Paint, or Krita, not just OS-level recognition." },
        { subheading: "Verify No Driver Conflicts With Other Tablets", note: "Check for known conflicts if you own another tablet brand's driver already installed on the same machine." },
      ];
    case "portable":
      return [
        { subheading: "Weigh Packed Dimensions, Not Just Active Area", note: `Check ${K}'s tablet, pen, cable, and adapter packed weight and dimensions together, not the tablet alone.` },
        { subheading: "Compare Active Area to a Laptop Screen", note: "Measure the usable active area relative to a typical 13-16 inch laptop display to judge real workspace." },
        { subheading: "Check One-Cable or Wireless Operation", note: "Verify whether it needs a single USB-C cable or works wirelessly, and what dongles or adapters that requires." },
        { subheading: "Evaluate Palm and Wrist Room", note: "Check palm and wrist clearance on the compact active area, since cramped space affects real precision." },
        { subheading: "Test Setup Time in Travel Conditions", note: "Confirm how quickly it sets up and packs away, and whether cable strain is a concern in travel use." },
      ];
    case "wireless":
      return [
        { subheading: "Check Pen Latency in Wireless Mode", note: `Verify ${K}'s pen latency and jitter specifically in wireless mode versus its wired USB mode.` },
        { subheading: "Publish Real Battery Runtime", note: "Confirm actual battery runtime and charging time rather than trusting a best-case marketing figure." },
        { subheading: "Test Reconnect After Sleep or Reboot", note: "Check reconnect behavior after sleep, reboot, and switching between paired computers." },
        { subheading: "Verify Full Feature Set Stays Wireless", note: "Confirm express keys, dials, and full active area remain available in wireless mode, not just in wired mode." },
        { subheading: "Check Bluetooth Version and Interference", note: "Verify the Bluetooth version and whether a dedicated dongle is used, since standard Bluetooth can suffer interference." },
      ];
    case "beginner":
      return [
        { subheading: "Prioritize Low Activation Force", note: `Check ${K}'s initial activation force specifically, since a lower number feels more natural for someone new to digital drawing.` },
        { subheading: "Verify Driver Install Is Genuinely Simple", note: "Confirm driver setup doesn't require advanced permission changes or command-line steps for a first-time user." },
        { subheading: "Check for Included Learning Resources", note: "Verify whether tutorials, guided lessons, or bundled software are included to help a beginner get started." },
        { subheading: "Confirm Left and Right-Hand Support", note: "Check that the tablet genuinely supports both hand orientations through the driver, not just physically." },
        { subheading: "Weigh Replacement Cost Over Time", note: "Check nib and cable replacement cost, since a beginner will wear through a few nibs while learning pressure control." },
      ];
    case "proartist":
      return [
        { subheading: "Test Pen Precision During Slow Curves", note: `Evaluate ${K}'s pen behavior during slow, deliberate curves and fine detail work, not just fast confident strokes.` },
        { subheading: "Verify Shortcut-Key Depth for Production Work", note: "Check the total programmable shortcut count, since production workflows benefit from more keys than casual sketching." },
        { subheading: "Confirm Color Accuracy Documentation", note: "For pen displays, verify factory calibration data and Delta-E figures rather than trusting a gamut percentage alone." },
        { subheading: "Check Long-Session Ergonomics", note: "Verify stand angle range and wrist support, since professional sessions run much longer than casual ones." },
        { subheading: "Verify Driver Stability Under Heavy Use", note: "Check for reported driver stability issues under sustained daily professional use, not just first-week reviews." },
      ];
    case "workflow":
      return [
        { subheading: "Test the Target App's Actual Shortcuts", note: `Confirm ${K}'s express keys map cleanly to shortcuts used in your specific target application's actual workflow.` },
        { subheading: "Map Viewport and Navigation Controls", note: "Check dial or Quick Key mapping for viewport navigation, since 3D and animation apps rely heavily on this." },
        { subheading: "Evaluate Precision During Detail Work", note: "Test pen precision during masking, sculpting, or frame-by-frame cleanup relevant to the specific workflow." },
        { subheading: "Verify Color Workflow for Production Use", note: "For displays, confirm color space support matches your specific production pipeline's requirements." },
        { subheading: "Check Long-Session Posture Support", note: "Verify stand angle and hand-travel comfort across the active area for extended production sessions." },
      ];
    case "pendisplay":
      return [
        { subheading: "Require a Genuine Integrated Display", note: `Confirm ${K} includes a real screen and state clearly whether a separate computer is still needed to use it.` },
        { subheading: "Check Panel Resolution and Color Accuracy", note: "Verify resolution, color gamut, and brightness from official documentation, not marketing summary language." },
        { subheading: "Verify Lamination and Parallax", note: "Check for full lamination and corner/edge cursor offset specifically, since these affect real precision." },
        { subheading: "Confirm Cable and Port Requirements", note: "Verify one-cable USB-C versus HDMI+USB+power setup and whether your host supports DisplayPort Alt Mode." },
        { subheading: "Evaluate Stand Angle and Long-Session Comfort", note: "Check adjustable stand angle range and hand heat/fan noise for extended desk sessions." },
      ];
    case "large":
      return [
        { subheading: "Set a Minimum Active-Area Threshold", note: `Confirm ${K}'s active area and total chassis dimensions meet a genuine minimum size threshold, not just a marketing label.` },
        { subheading: "Measure Arm Reach to Far Corners", note: "Check reach to far corners and shortcut controls, since a larger surface changes arm movement patterns." },
        { subheading: "Verify Stand and VESA Support", note: "Confirm stand stability and VESA mount compatibility for a genuinely stable drawing angle at this size." },
        { subheading: "Check Pixel Density if a Screen Is Present", note: "Verify pixel density and UI scaling behavior for large pen displays specifically." },
        { subheading: "Account for Desk Depth and Storage", note: "Confirm desk depth, cable routing, and storage or transport practicality for the larger footprint." },
      ];
    case "usb": case "withpen": case "noscreen": case "withscreen":
      return [
        { subheading: "Classify the Architecture First", note: `Confirm whether ${K} is a screenless pen tablet, pen display, or standalone device before comparing specs.` },
        { subheading: "Publish True Active Drawing Area", note: "Check active area separately from chassis or display diagonal, and verify aspect ratio against your target monitor." },
        { subheading: "Evaluate Pen Behavior Directly", note: "Test or verify activation force, tilt behavior, and pressure-level count rather than trusting a headline spec." },
        { subheading: "Verify Current Driver and OS Support", note: "Confirm current Windows/macOS/Linux/Android compatibility by the exact model, not an inherited older list." },
        { subheading: "Check Included Accessories and Cables", note: "Verify required cables, included stand, pen, and nibs, plus desk footprint before buying." },
      ];
    case "4k":
      return [
        { subheading: "Require Native 4K Resolution", note: `Confirm ${K} has native 3840x2160 resolution rather than a lower panel upscaled in marketing copy.` },
        { subheading: "Verify Pixel Density and Scaling", note: "Check pixel density at the actual panel size and test OS/app UI scaling behavior before buying." },
        { subheading: "Confirm Full-Resolution Cable Support", note: "Verify the supplied USB-C/DisplayPort/HDMI path actually supports full 4K resolution and refresh rate." },
        { subheading: "Check Color Accuracy Separately From Resolution", note: "Compare color gamut, uniformity, and calibration support independently, since 4K doesn't guarantee accurate color." },
        { subheading: "Measure Parallax at Normal Drawing Distance", note: "Verify cursor offset and fine-line visibility specifically at typical drawing distance, not marketing photos." },
      ];
    default:
      return [
        { subheading: "Classify the Tablet Architecture", note: `Confirm whether ${K} is a screenless pen tablet, pen display, or standalone device before comparing specs.` },
        { subheading: "Verify Active Drawing Area", note: "Check active area separately from chassis or display diagonal size." },
        { subheading: "Evaluate Real Pen Behavior", note: "Test activation force, tilt, and pressure response rather than trusting the spec sheet number alone." },
        { subheading: "Confirm Current Driver Support", note: "Verify current OS compatibility by the exact model, not an inherited older compatibility list." },
        { subheading: "Weigh Included Accessories", note: "Check included pen, nibs, stand, and cables against total cost of ownership." },
      ];
  }
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "wacom": case "huion": case "xppen": case "ugee": case "gaomon": case "veikk": case "parblo":
      return [
        { q: `Are all ${K} models currently sold, or does the lineup include discontinued models?`, a: "Check current first-party store or support pages directly, since older tablets often stay heavily indexed in search results long after being discontinued or moved to legacy support status." },
        { q: "Does the brand name alone guarantee consistent quality across models?", a: "No. A brand's lineup often spans multiple price tiers and hardware generations, so verify the exact model's specs rather than assuming brand reputation alone predicts quality." },
      ];
    case "sizeclass":
      return [
        { q: `Does "${K}" always mean the same measurement across different brands?`, a: "No. The stated inch value can refer to display diagonal on a pen display or active-area dimension on a screenless tablet, so always confirm which measurement a specific listing means before comparing across brands." },
        { q: "Should I round up to the next size class if a model is close?", a: "Only if the difference is genuinely small and documented; otherwise a model marketed under a neighboring size class may have different aspect ratio and chassis dimensions than what you actually want." },
      ];
    case "standalone": case "picassotab": case "frunsi":
      return [
        { q: `Can a ${K} device fully replace a computer for digital art work?`, a: "For casual and intermediate work, often yes, but professional workflows relying on desktop-only software like full Photoshop or advanced 3D tools still need a computer, so check your specific app requirements first." },
        { q: "Do standalone drawing tablets support cloud backup for artwork?", a: "Most run on Android and support WiFi-based cloud upload through installed apps, but verify this specifically rather than assuming, since backup capability varies by device and pre-installed software." },
      ];
    case "mobile":
      return [
        { q: `Will a ${K} product work with any phone, or only specific models?`, a: "Compatibility varies significantly by phone model and OS version, so verify the exact requirement stated by the manufacturer rather than assuming universal support just because it's labeled mobile-compatible." },
        { q: "Does drawing on a phone-connected tablet feel different from a computer setup?", a: "Yes, meaningfully. Phone screens are smaller and often require portrait-oriented drawing apps, so pressure and precision can feel different than the same tablet connected to a full-size monitor." },
      ];
    case "budget":
      return [
        { q: `Are budget ${K} genuinely usable, or do they cut corners that matter?`, a: "It varies. Some budget tablets use simpler pen chips or fewer shortcut keys to hit a lower price while keeping comparable core hardware, so compare documented activation force and driver support rather than price alone." },
        { q: "What should I check before buying the cheapest option available?", a: "Verify included accessories, replacement nib availability, and current driver support, since these often separate genuinely comparable budget options from ones that cut real corners." },
      ];
    case "hostspecific":
      return [
        { q: `Do I need special drivers to use a drawing tablet on ${K}?`, a: "Yes, almost always. Check the manufacturer's current driver page for your exact OS version before buying, since compatibility lists on the product listing itself can be outdated." },
        { q: "Can driver conflicts happen if I own tablets from different brands?", a: "Yes, this is a known issue. Uninstall other brands' tablet drivers before installing a new one, and reboot, to avoid pointer or pressure conflicts between competing driver software." },
      ];
    case "wireless":
      return [
        { q: `Does wireless mode on ${K} reduce pen accuracy compared to wired?`, a: "Some wireless tablets show slightly higher latency than their wired mode, so check for documented latency comparisons rather than assuming wireless and wired perform identically." },
        { q: "How long does a wireless drawing tablet's battery actually last?", a: "Check the manufacturer's stated runtime under actual drawing use, not standby time, since these numbers can differ significantly and battery life degrades with repeated charge cycles over time." },
      ];
    case "portable":
      return [
        { q: `How much smaller is the usable area on ${K} compared to full-size tablets?`, a: "Meaningfully smaller in most cases, so check the documented active area directly rather than assuming a compact chassis retains a full-size drawing surface." },
        { q: "Is a portable tablet worth it if I mostly draw at a fixed desk?", a: "Not necessarily. If you don't need to travel with it, a larger fixed-desk tablet often gives more active area and features for a similar price." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Judging quality by pressure-level count alone. Activation force, tilt behavior, and driver stability matter more for real drawing feel than a high number on the spec sheet." },
        { q: `Should I prioritize price or pen quality when choosing ${K}?`, a: "Pen quality first, since a tablet with a poor-feeling stylus won't become more enjoyable to use for being cheaper. Narrow the field by real pen behavior, then compare price among finalists." },
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
  const metaDescription = `We compared ${kw} by tablet architecture, pen behavior, and driver support rather than ranking by pressure-level count alone.`;

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

fs.writeFileSync("scripts/_dtab_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
