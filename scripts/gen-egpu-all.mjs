import fs from "fs";
import { P } from "./egpu-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-egpu.json", "utf8"));
const raw = fs.readFileSync("scripts/_egpu_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "Host-Link Architecture Verified", description: "Checked the exact host port type, controller generation, and effective PCIe path rather than trusting a USB-C connector alone as proof of eGPU support." },
  { title: "GPU Physical Fit Documented", description: "Compared maximum supported GPU length, height, slot width, and power-connector clearance against real current graphics cards." },
  { title: "Power Supply and Charging Verified Separately", description: "Checked PSU wattage and format separately from any laptop charging (Power Delivery) figure, since these are two different specifications often blended in marketing." },
  { title: "Host and OS Compatibility Confirmed", description: "Verified documented compatibility across Windows, macOS, and Linux hosts, noting where support is limited to specific chip generations or OS versions." },
  { title: "Ownership Details: Cables, Noise, and Support", description: "Weighed included cables, fan noise, warranty length, and driver support quality as part of the real cost of eGPU ownership, not just the enclosure price." },
];

const sharedFaqPool = [
  { key: "egpu-performance-loss", q: "How much GPU performance do I lose running it externally versus internally?", a: "Some loss is normal since even Thunderbolt 5's 80Gbps trails a native PCIe x16 slot's bandwidth, but the real-world impact varies by workload: GPU-bound gaming and rendering see a smaller hit than bandwidth-sensitive tasks. Check for real benchmark comparisons on your specific host and GPU pairing rather than assuming a fixed percentage." },
  { key: "egpu-macbook-compatibility", q: "Do all Thunderbolt-equipped Macs support eGPUs?", a: "No. Apple's official eGPU support is specific to Intel-based Thunderbolt 3 Macs; Apple Silicon Macs (M1 and later) do not officially support external GPUs for graphics acceleration, regardless of port type. Check Apple's current documentation for your specific Mac before assuming compatibility." },
  { key: "egpu-vs-oculink-tradeoff", q: "Should I choose a Thunderbolt/USB4 enclosure or an OCuLink one?", a: "Thunderbolt and USB4 tunnel PCIe over a general-purpose port shared with other data, while OCuLink provides a more direct PCIe connection with typically lower overhead, but neither hot-plugs as easily and OCuLink support is far less common on laptops. Match the choice to what your specific host actually exposes." },
  { key: "egpu-power-supply-sizing", q: "How do I know what wattage power supply my eGPU setup needs?", a: "Size the PSU to your specific GPU's rated power draw plus reasonable headroom, not the enclosure's maximum rated capacity, since an oversized PSU wastes money while an undersized one causes instability under load. Check your GPU manufacturer's recommended PSU wattage directly." },
  { key: "egpu-hot-plug-safety", q: "Is it safe to plug or unplug an eGPU while the computer is running?", a: "This depends entirely on the connection type: most Thunderbolt and USB4 enclosures support hot-plugging safely, while OCuLink connections generally do not and require a full shutdown first. Always check your specific enclosure's documentation rather than assuming hot-plug support." },
  { key: "egpu-laptop-charging-tradeoff", q: "Can an eGPU enclosure charge my laptop while running the external GPU?", a: "Many Thunderbolt/USB4 enclosures include Power Delivery charging through the same cable, but the wattage varies significantly by model (commonly 15W to 140W), and it's a separate specification from the GPU's own power supply, so check both figures independently before assuming your laptop charges at full speed." },
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
  if (/razer|sonnet|minisforum|trebleet|gigabyte|owc|akitio|asus|cooler master/.test(t)) return "brand";
  if (/thunderbolt 3\b/.test(t)) return "tb3";
  if (/thunderbolt 4\b/.test(t)) return "tb4";
  if (/thunderbolt 5\b/.test(t)) return "tb5";
  if (/oculink/.test(t)) return "oculink";
  if (/usb ?4/.test(t)) return "usb4";
  if (/legion go/.test(t)) return "legiongo";
  if (/rog ally x/.test(t)) return "rogallyx";
  if (/rog ally/.test(t)) return "rogally";
  if (/laptop/.test(t)) return "laptop";
  if (/mini pc/.test(t)) return "minipc";
  if (/budget/.test(t)) return "budget";
  if (/power supply/.test(t)) return "psu";
  if (/compact/.test(t)) return "compact";
  if (/portable/.test(t)) return "portable";
  if (/dock\b/.test(t)) return "dock";
  if (/mac mini/.test(t)) return "macmini";
  if (/\bmac\b/.test(t)) return "mac";
  if (/rtx \d/.test(t)) return "rtx";
  if (/pcie/.test(t)) return "pcie";
  return "generic";
}

const ANGLE_BY_CAT = {
  brand: [
    "mapping the brand's current model lineup and generation instead of assuming every listing is current",
    "verifying exact controller generation and card support by specific model",
    "checking current firmware and driver support rather than the brand name alone",
  ],
  tb3: "verifying real Thunderbolt 3 PCIe tunneling and GPU dimension limits, not just the port name",
  tb4: "verifying controller generation and effective PCIe path, not just the Thunderbolt 4 headline bandwidth",
  tb5: "verifying genuine 80Gbps Thunderbolt 5 support and GPU power delivery together",
  oculink: "verifying a genuine direct PCIe connection and hot-plug limitations before buying",
  usb4: "verifying host-specific USB4 eGPU support, since connector presence alone isn't proof",
  legiongo: "matching the exact host generation's real external-PCIe-capable port",
  rogallyx: "verifying ROG Ally X's USB4 port and charging behavior specifically",
  rogally: "verifying the original ROG Ally's proprietary port, not assuming generic USB4 support",
  laptop: "matching host link architecture and charging needs to the exact laptop model",
  minipc: "verifying whether the mini PC exposes OCuLink, USB4, or both before choosing",
  budget: "verifying real host-link capability at a lower price, not just cable presence",
  psu: "verifying PSU wattage and native GPU power connectors separately from laptop charging",
  compact: "verifying complete setup size including PSU, cables, and power brick, not the shell alone",
  portable: "weighing packed weight and cable count against genuine portability claims",
  dock: "checking whether dock I/O shares the same upstream link as the GPU",
  macmini: "verifying Apple Silicon eGPU limitations against this specific Mac mini generation",
  mac: "verifying Intel-Mac-specific eGPU support rather than assuming all Macs qualify",
  rtx: "checking documented board dimensions and PSU connectors for the exact card, not the reference design",
  pcie: "verifying whether the connection is genuinely direct PCIe or tunneled through another protocol",
  generic: "verifying host-link architecture and GPU fit instead of trusting the listing alone",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves architecture-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a USB-C connector alone.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} enclosures vary enough that ${angle} matters more than bandwidth headlines alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or star rating.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between enclosures is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to bandwidth claims, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on documented host-link architecture plus ${angle}, since headline bandwidth alone regularly overstates real performance.`,
  (angle) => `Our ranking weighs documented host-link architecture plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on documented host-link architecture plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized documented host-link architecture plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we checked documented host-link architecture plus ${angle} for every enclosure on this list.`,
  (angle) => `The picks below were sorted by documented host-link architecture plus ${angle}, the details that actually decide real GPU performance.`,
  (angle) => `What separates these picks is documented host-link architecture plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for documented host-link architecture plus ${angle} before anything else was weighed.`,
  (angle) => `Documented host-link architecture plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on documented host-link architecture plus ${angle} to separate genuinely capable enclosures from well-marketed ones.`,
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
        { subheading: "Build a Current Model Map First", note: `Confirm which ${K} models are currently sold rather than assuming an older listing reflects the current lineup, since generations change bandwidth and card support significantly.` },
        { subheading: "Compare Controller Generation by Exact Model", note: "Check the specific Thunderbolt/USB4 controller generation and effective PCIe path for the exact model, not the brand's range in general." },
        { subheading: "Verify GPU Dimension Limits", note: "Confirm maximum supported GPU length, height, and slot width against your specific card before assuming any enclosure in the brand's lineup fits." },
        { subheading: "Check Current Firmware and Driver Support", note: "Verify current firmware and driver support status, since older models can lose active support over time." },
        { subheading: "Compare Warranty and Support Channels", note: "Check warranty length and support responsiveness, since this varies meaningfully even within the same brand's product line." },
      ];
    case "tb3":
    case "tb4":
    case "tb5":
      return [
        { subheading: "Verify the Exact Host and Enclosure Generation", note: `Confirm both your host port and ${K}'s controller generation match, since Thunderbolt generations aren't automatically backward-compatible at full bandwidth.` },
        { subheading: "Check Effective PCIe Path, Not Headline Bandwidth", note: "Verify documented controller chipset and effective PCIe lanes, since headline Thunderbolt bandwidth doesn't always translate directly to GPU performance." },
        { subheading: "Confirm Dock I/O Doesn't Bottleneck the GPU", note: "Check whether Ethernet, USB, or storage functions on the same enclosure share bandwidth with the GPU connection under load." },
        { subheading: "Separate Laptop Charging From GPU Power", note: "Confirm laptop charging wattage (Power Delivery) is documented separately from the GPU's own power supply wattage." },
        { subheading: "Test Fallback and Backward-Compatibility Modes", note: "Verify the enclosure's behavior when connected to an older-generation host, since fallback modes aren't guaranteed to work identically." },
      ];
    case "oculink":
    case "pcie":
      return [
        { subheading: "Confirm a Genuine Direct PCIe Connection", note: `Verify ${K} provides a real direct PCIe path rather than tunneling through another protocol, and check the documented PCIe generation and lane count.` },
        { subheading: "Verify Host-Side OCuLink or M.2 Wiring", note: "Confirm your host actually exposes the exact connector type (OCuLink, NVMe M.2) required, since this is far less standardized than Thunderbolt or USB4." },
        { subheading: "Check Hot-Plug Limitations", note: "Verify whether the connection supports hot-plugging or requires a full shutdown before connecting or disconnecting, a real workflow difference from Thunderbolt." },
        { subheading: "Confirm Power Supply Format and Sizing", note: "Check ATX/SFX power supply compatibility and size it to your specific GPU's power draw, since these connections still need a separate PSU." },
        { subheading: "Benchmark Against Thunderbolt Alternatives", note: "Compare real performance against a Thunderbolt/USB4 option using the same GPU where possible, to confirm the direct-PCIe advantage is worth the added setup complexity." },
      ];
    case "usb4":
      return [
        { subheading: "Verify Host-Specific eGPU Support", note: `Confirm your exact host's USB4 implementation supports external PCIe/eGPU functionality, since USB-C or USB4 branding alone doesn't guarantee it.` },
        { subheading: "Check the Documented Controller and Driver Requirements", note: "Verify which drivers (Intel Thunderbolt or AMD USB4) your host needs, since this differs by CPU platform." },
        { subheading: "Confirm Real Bandwidth, Not Just the USB4 Label", note: "Check the enclosure's documented actual bandwidth, since USB4 implementations can vary in real-world throughput." },
        { subheading: "Verify GPU Fit and Power Requirements", note: "Confirm maximum GPU dimensions and required power supply format separately from the connection type." },
        { subheading: "Test Hot-Plug and Sleep/Wake Behavior", note: "Check documented behavior connecting, disconnecting, and waking from sleep, since USB4 eGPU stability varies by host and driver version." },
      ];
    case "legiongo":
    case "rogallyx":
    case "rogally":
      return [
        { subheading: "Confirm the Exact Host Generation's Port", note: `Verify ${K}'s exact external-PCIe-capable port and generation, since handheld gaming devices vary significantly in eGPU support even within the same product line.` },
        { subheading: "Use Only the Officially Supported Link Architecture", note: "Confirm the enclosure matches the handheld's actual documented link type rather than assuming generic USB-C compatibility." },
        { subheading: "Check for a Second-Cable Power Problem", note: "Verify charging and power requirements together, since some eGPU setups on handhelds unexpectedly require a second power cable alongside the eGPU cable." },
        { subheading: "Benchmark Internal and External Display Paths Separately", note: "Check documented performance for both the handheld's built-in screen and an external monitor, since these paths can behave differently." },
        { subheading: "Record Firmware and Driver Versions That Work", note: "Note the specific BIOS, firmware, and driver versions confirmed compatible, since handheld eGPU support has evolved significantly across firmware updates." },
      ];
    case "laptop":
    case "minipc":
      return [
        { subheading: "Match Host Link Architecture Exactly", note: `Confirm ${K}'s host port generation and type precisely, since laptop and mini PC eGPU support varies significantly even within similar-looking USB-C ports.` },
        { subheading: "Check Charging and Power Requirements Together", note: "Verify laptop charging wattage and GPU power supply requirements together, since eGPU setups can unexpectedly need a second power cable." },
        { subheading: "Verify Display Path Behavior", note: "Check documented performance for both external monitor and internal display paths separately where the host supports both." },
        { subheading: "Confirm BIOS and Driver Requirements", note: "Verify BIOS, firmware, and driver versions needed for stable operation, since eGPU support can depend on specific software versions." },
        { subheading: "Check Dock-Peripheral Behavior Under GPU Load", note: "Confirm that any additional dock functionality (Ethernet, USB, storage) doesn't degrade meaningfully while the GPU is under load." },
      ];
    case "budget":
      return [
        { subheading: "Verify the Enclosure Actually Includes a Documented Host Link", note: `Confirm ${K}'s connection type and generation are clearly documented rather than choosing based on price alone.` },
        { subheading: "Include PSU and Cable Cost in Total Setup Price", note: "Add the cost of a power supply, cables, and any required dock/charger to the enclosure price before calling it the cheaper option." },
        { subheading: "Compare GPU Fit Before Assuming Compatibility", note: "Check documented GPU dimension limits, since budget enclosures sometimes have tighter clearance than pricier alternatives." },
        { subheading: "Benchmark a Midrange GPU for Real Overhead", note: "Look for a documented benchmark with a mid-range GPU to see real link overhead, not just a top-tier card's marketing numbers." },
        { subheading: "Check Firmware and Warranty Support", note: "Verify controller firmware updates and warranty terms, since budget enclosures vary widely in long-term support quality." },
      ];
    case "psu":
      return [
        { subheading: "State Whether the PSU Is Included and Replaceable", note: `Confirm whether ${K} includes a power supply out of the box and whether it can be swapped for a higher-wattage unit later.` },
        { subheading: "Size Wattage to the Exact GPU, Not the Enclosure Maximum", note: "Calculate continuous wattage from your specific GPU's documented requirement plus enclosure and dock overhead." },
        { subheading: "Verify Native GPU Power Connectors", note: "Check for the exact 12V-2x6/12VHPWR/8-pin connectors your GPU needs, since adapter cables add real failure points." },
        { subheading: "Check PSU Physical Format and Airflow", note: "Confirm PSU format (ATX/SFX/Flex) and intake/exhaust clearance fit inside the enclosure without cramping cable routing." },
        { subheading: "Separate Laptop Charging From GPU PSU Capacity", note: "Confirm laptop Power Delivery wattage is documented separately from the GPU power supply's own capacity." },
      ];
    case "compact":
    case "portable":
      return [
        { subheading: "Measure the Complete Setup, Not Just the Enclosure", note: `Check ${K}'s total footprint including GPU, PSU, power brick, and cables, not the empty shell dimensions alone.` },
        { subheading: "Calculate Packed Travel Weight", note: "Weigh the complete setup as you'd actually carry it, since enclosure-only weight figures understate real portable weight." },
        { subheading: "Count Required Cables and Setup Time", note: "Count how many cables a full teardown-and-reconnect cycle actually requires, and time it realistically." },
        { subheading: "Verify Compact GPU and PSU Fit Together", note: "Confirm your specific GPU and its power supply both physically fit the compact enclosure's documented clearance." },
        { subheading: "Check Thermals Under Sustained Load in the Smaller Chassis", note: "Verify sustained-load temperature and fan noise, since compact designs have less thermal headroom than full-size enclosures." },
      ];
    case "dock":
      return [
        { subheading: "Check Whether Dock I/O Shares the GPU's Upstream Link", note: `Verify ${K}'s Ethernet, USB, and storage ports don't compete for the same bandwidth as the GPU connection under simultaneous load.` },
        { subheading: "Confirm Host-Link Architecture First", note: "Verify the underlying Thunderbolt/USB4/OCuLink generation before evaluating the dock features layered on top." },
        { subheading: "Test Peripheral Performance While the GPU Is Active", note: "Check documented or tested behavior of dock peripherals specifically while a GPU workload is running." },
        { subheading: "Verify GPU Fit and Power Requirements", note: "Confirm maximum GPU dimensions and power supply requirements separately from the dock's other I/O features." },
        { subheading: "Check Firmware Updates Cover Both Dock and GPU Functions", note: "Verify firmware updates address both dock stability and GPU tunneling issues, not just one or the other." },
      ];
    case "macmini":
    case "mac":
      return [
        { subheading: "Verify Apple Silicon vs Intel Mac eGPU Support", note: `Confirm whether ${K} is compatible with your specific Mac chip generation, since Apple's official eGPU support is Intel-Mac specific and does not extend to Apple Silicon.` },
        { subheading: "Check for Non-Gaming AI/Compute Workarounds", note: "Note that some Apple Silicon Mac eGPU workflows exist for AI/ML development specifically (via tools like Tinygrad), not for gaming or general graphics acceleration." },
        { subheading: "Confirm Host Port Generation", note: "Verify your exact Mac model's Thunderbolt generation and whether it's officially documented as eGPU-capable." },
        { subheading: "Check macOS Version Requirements", note: "Confirm the specific macOS version required for eGPU support, since older or newer OS versions can both cause compatibility issues." },
        { subheading: "Verify GPU Driver Support on macOS", note: "Check that your intended GPU has current macOS driver support, since not every GPU with Windows drivers has equivalent macOS support." },
      ];
    case "rtx":
      return [
        { subheading: "Qualify Exact Board-Partner Dimensions", note: `Check the exact ${K} board-partner card's length, height, and width rather than assuming all cards in that GPU family match the reference design.` },
        { subheading: "Verify PSU Wattage and Native Connectors for This Exact Card", note: "Confirm PSU wattage and required 12V-2x6/12VHPWR/8-pin connectors match your specific card model's documented requirements." },
        { subheading: "Check Connector Clearance and Cable Bend Radius", note: "Verify side-panel or open-frame clearance for the power connector and cable bend radius with this specific card installed." },
        { subheading: "Benchmark Over Your Intended Host Link", note: "Look for benchmarks using the same GPU over the Thunderbolt, USB4, or OCuLink link you actually plan to use." },
        { subheading: "Measure Sustained Thermals in the Enclosure", note: "Check sustained-load temperature and noise data measured inside the enclosure, not open-bench GPU data that doesn't reflect enclosed airflow." },
      ];
    default:
      return [
        { subheading: "Verify Host-Link Architecture", note: `Confirm ${K}'s exact host port type, controller generation, and effective PCIe path before assuming compatibility.` },
        { subheading: "Check GPU Physical Fit", note: "Verify maximum GPU length, height, and slot width against your specific card's documented dimensions." },
        { subheading: "Confirm Power Supply Requirements", note: "Check PSU wattage and format separately from any laptop charging figure, since these are distinct specifications." },
        { subheading: "Verify Host and OS Compatibility", note: "Confirm documented support for your specific operating system and host chip generation." },
        { subheading: "Weigh Ownership Details", note: "Factor in included cables, fan noise, and warranty length as part of the real cost of ownership." },
      ];
  }
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "brand":
      return [
        { q: `Are all ${K} models currently sold, or does the lineup include discontinued generations?`, a: "Check current first-party store pages directly, since older eGPU enclosures often stay heavily indexed in search results long after being succeeded by newer, higher-bandwidth generations." },
        { q: "Does a well-known brand guarantee better GPU compatibility?", a: "Not automatically. Even within one brand's lineup, controller generation and documented GPU dimension limits vary significantly by model, so verify the exact specs rather than assuming brand reputation predicts compatibility." },
      ];
    case "tb3":
    case "tb4":
    case "tb5":
      return [
        { q: `Is ${K} backward compatible with older Thunderbolt hosts?`, a: "Generally yes at reduced bandwidth, but verify the specific enclosure documents fallback behavior, since not every newer-generation enclosure guarantees full functionality on an older host port." },
        { q: "Does a higher Thunderbolt generation always mean better GPU performance?", a: "It raises the bandwidth ceiling, but real performance also depends on the GPU itself, the controller implementation, and whether other dock functions compete for the same link, not bandwidth generation alone." },
      ];
    case "oculink":
    case "pcie":
      return [
        { q: `Can I hot-plug ${K} while my computer is running?`, a: "Generally no. Most OCuLink and direct-PCIe connections require a full shutdown before connecting or disconnecting, unlike most Thunderbolt or USB4 enclosures which support hot-plugging." },
        { q: "Is a direct PCIe connection always faster than Thunderbolt?", a: "It typically has lower protocol overhead, but the real-world difference depends on the specific controller and GPU, so check documented benchmarks comparing the same GPU across both connection types where available." },
      ];
    case "usb4":
      return [
        { q: `Does having a USB4 port guarantee ${K} will work?`, a: "No. USB4 eGPU support is host-specific, some USB4 implementations don't expose the external PCIe tunneling needed for a GPU even though the port itself is labeled USB4." },
        { q: "Do I need different drivers for USB4 versus Thunderbolt eGPU setups?", a: "Often yes. AMD-based USB4 hosts typically need AMD's USB4 drivers while Intel-based Thunderbolt hosts need Intel's Thunderbolt drivers, check your specific CPU platform's requirements." },
      ];
    case "legiongo":
    case "rogallyx":
    case "rogally":
      return [
        { q: `Does my ${K} generation support external GPUs?`, a: "This varies significantly even within the same handheld product line, since manufacturers sometimes change the port type or add USB4 support in a later model revision. Verify your exact device generation's documented specs." },
        { q: "Will using an eGPU with a handheld also charge the device?", a: "It depends on the specific enclosure and handheld combination; some support single-cable charging plus GPU connection, while others may require a separate charging cable, check documented behavior for your exact pairing." },
      ];
    case "laptop":
    case "minipc":
      return [
        { q: `How do I know if my ${K} actually supports external graphics?`, a: "Check your device manufacturer's documentation for explicit eGPU or external graphics (eGFX) support, since having a Thunderbolt or USB4 port doesn't automatically guarantee the manufacturer has enabled or validated eGPU functionality." },
        { q: "Will an eGPU work with my laptop's internal display, or only an external monitor?", a: "This varies by host; many modern setups support routing GPU output to the internal laptop display, but some older configurations only support external monitors connected directly to the eGPU enclosure." },
      ];
    case "budget":
      return [
        { q: `Are budget ${K} genuinely capable, or do they cut corners that matter?`, a: "It varies. Some budget enclosures use older or lower-bandwidth controllers to hit a lower price, while others simply skip extra dock features while keeping comparable core hardware, compare documented controller generation rather than price alone." },
        { q: "What should I check before buying the cheapest eGPU enclosure available?", a: "Verify the documented host-link generation, GPU dimension limits, and whether a power supply is included, since these often separate genuinely comparable budget options from ones that cut real corners." },
      ];
    case "psu":
      return [
        { q: `Do I need to buy a power supply separately for ${K}?`, a: "Check the specific listing carefully; some eGPU enclosures include a PSU while others require you to source and install your own ATX, SFX, or Flex power supply sized to your GPU." },
        { q: "Can I upgrade an enclosure's power supply for a more powerful GPU later?", a: "On enclosures with a replaceable PSU format (typically ATX or SFX), yes, but confirm the enclosure's power supply bay accepts a higher-wattage unit before assuming an easy upgrade." },
      ];
    case "compact":
    case "portable":
      return [
        { q: `How much does the complete ${K} setup actually weigh once packed?`, a: "Check for a documented total weight including the GPU, power supply, and cables, since enclosure-only weight figures significantly understate what you'd actually carry." },
        { q: "Do compact eGPU enclosures sacrifice cooling performance?", a: "Often somewhat, yes, since less internal volume generally means less thermal headroom under sustained load, check for documented sustained-load temperature or noise data specifically." },
      ];
    case "mac":
    case "macmini":
      return [
        { q: `Does ${K} work with Apple Silicon Macs?`, a: "Generally no for standard graphics acceleration; Apple's official eGPU support is specific to Intel-based Thunderbolt 3 Macs. Some niche AI/ML workflows exist for Apple Silicon via specific tools, but this doesn't extend to gaming or general graphics use." },
        { q: "Can I use an NVIDIA GPU with a Mac eGPU setup?", a: "Generally no on macOS, since NVIDIA driver support for Mac has been discontinued for recent macOS versions; AMD GPUs are the practical choice for Mac eGPU setups today." },
      ];
    case "rtx":
      return [
        { q: `Does every ${K} card fit the same eGPU enclosure?`, a: "No. Board partners produce cards with different lengths, coolers, and power connector placements even for the same GPU chip, so check the exact card's dimensions against the enclosure's documented clearance." },
        { q: "Do higher-end RTX cards need a different eGPU enclosure than mid-range cards?", a: "Often yes, since higher-power cards need a larger PSU, wider slot clearance, and sometimes triple-slot width support that budget or compact enclosures don't provide." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Assuming any USB-C port supports eGPU functionality. Host-link architecture, GPU fit, and power supply requirements all need independent verification, not just the presence of a compatible-looking port." },
        { q: `Should I prioritize bandwidth or GPU fit when choosing ${K}?`, a: "GPU fit and power supply compatibility first, since an enclosure with impressive bandwidth is useless if your specific graphics card doesn't physically fit or draw enough power inside it." },
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
  const metaDescription = `We compared ${kw} by documented host-link architecture, GPU fit, and power supply rather than ranking by bandwidth headlines alone.`;

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

fs.writeFileSync("scripts/_egpu_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
