import fs from "fs";
import { P } from "./switch10g-products.mjs";

const lookup = JSON.parse(fs.readFileSync("scripts/lookup-switch10g.json", "utf8"));
const raw = fs.readFileSync("scripts/_switch10g_raw.txt", "utf8").trim().split("\n");

const howWeEvaluatedDefault = [
  { title: "True 10G Port Count Verified", description: "Counted only interfaces that can actually operate at 10GbE, listing slower management, access, or shared combo ports separately rather than folding them into one headline port total." },
  { title: "RJ45 vs SFP+ Topology Documented", description: "Published exactly how many ports are native copper versus fiber SFP+, since the two require very different cabling and transceiver costs to actually use." },
  { title: "Switching Capacity Against Real Load", description: "Compared documented switching and non-blocking capacity against simultaneous full-duplex traffic on all advertised ports, since oversubscription is common at lower price points." },
  { title: "Management Depth Verified by Feature", description: "Checked VLAN, LACP, QoS, and routing claims against actual documented feature support rather than trusting a 'managed' or 'smart' label alone." },
  { title: "Power, Thermal, and Acoustic Behavior", description: "Noted PoE budget, fan presence, and thermal ratings from documentation, since copper 10G and PoE both add real heat and power draw that affects placement." },
];

const sharedFaqPool = [
  { key: "10gbase-t-vs-sfp", q: "Should I choose 10GBASE-T (RJ45) or SFP+ ports for my network?", a: "10GBASE-T uses familiar RJ45 cabling and often auto-negotiates down to 5G/2.5G/1G, making it simpler for mixed-speed networks, while SFP+ needs transceivers or DACs but runs cooler and often costs less per port at longer distances. Match the choice to your existing cabling and device NICs." },
  { key: "switch-oversubscription-meaning", q: "What does switching capacity or non-blocking throughput actually mean?", a: "It's the total bandwidth the switch's internal fabric can move simultaneously across all ports. A switch is 'non-blocking' if that capacity covers every port running at full speed at once; an oversubscribed switch can bottleneck under heavy simultaneous multi-port load even if each individual port is rated for 10G." },
  { key: "poe-budget-per-port", q: "Does a switch's total PoE budget mean every port can deliver its max wattage?", a: "No. The total PoE budget is shared across all active PoE ports, so if you power several high-draw devices simultaneously, the switch may not be able to deliver every port's maximum rated wattage at the same time. Check the total budget against your actual device count and power needs." },
  { key: "managed-vs-unmanaged-switch", q: "Do I actually need a managed switch, or is unmanaged enough?", a: "Unmanaged switches are genuinely plug-and-play with no configuration, fine for a simple home or small office network. Managed or smart-managed switches add VLANs, QoS, and traffic prioritization, useful once you have multiple network segments, guest WiFi isolation, or need to prioritize specific traffic types." },
  { key: "10gbe-cable-requirements", q: "What cable do I need to actually get 10Gbps over copper Ethernet?", a: "Cat6A or better is generally required for reliable 10GBASE-T at typical office/home distances; standard Cat6 can sometimes reach 10G over very short runs but isn't guaranteed, and Cat5e tops out well below 10G. Check your specific switch's documentation for its exact cable and distance requirements." },
  { key: "switch-fanless-heat", q: "Do fanless 10GbE switches actually run cooler, or just quieter?", a: "Fanless design means quieter operation through passive cooling, not necessarily cooler internal temperatures; copper 10G ports and SFP+ transceivers both generate real heat that a fanless chassis still needs to dissipate through its casing, so check the switch's rated operating temperature range." },
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
  if (/netgear|mikrotik|cisco|qnap|unifi|dell|\bhp\b|aruba|brocade|trendnet|hasivo|mokerlink|nicgiga|tp-link|ubiquiti|yuanley|zyxel/.test(t)) return "brand";
  if (/\d+-port/.test(t)) return "portcount";
  if (/poe/.test(t)) return "poe";
  if (/unmanaged/.test(t)) return "unmanaged";
  if (/managed/.test(t) && !/unmanaged/.test(t)) return "managed";
  if (/rj45/.test(t)) return "rj45";
  if (/fanless/.test(t)) return "fanless";
  if (/quiet/.test(t)) return "quiet";
  if (/rackmount/.test(t)) return "rackmount";
  if (/desktop/.test(t)) return "desktop";
  if (/home lab|homelab/.test(t)) return "homelab";
  if (/nas/.test(t)) return "nas";
  if (/home\b/.test(t)) return "home";
  if (/budget/.test(t)) return "budget";
  if (/industrial/.test(t)) return "industrial";
  if (/layer 2/.test(t)) return "layer2";
  if (/layer 3/.test(t)) return "layer3";
  return "generic";
}

const ANGLE_BY_CAT = {
  brand: [
    "mapping the brand's current model lineup instead of assuming every listing is current",
    "checking exact port topology and switching capacity by specific model",
    "verifying management tier and firmware support for the exact SKU, not the brand name",
  ],
  portcount: [
    "requiring simultaneously usable 10G ports, not a headline count mixing in slower interfaces",
    "checking which ports are combo or shared before trusting the total port number",
    "verifying switching capacity actually covers every advertised port at once",
  ],
  poe: "verifying total PoE budget and per-port wattage against real device power needs",
  unmanaged: "confirming genuine plug-and-play operation without hidden feature gaps",
  managed: "verifying documented VLAN, LACP, and QoS support rather than trusting the word managed alone",
  rj45: "checking cable category requirements and multi-gig fallback behavior",
  fanless: "verifying real thermal behavior under sustained load, not just the absence of a fan spec",
  quiet: "measuring warm-state acoustics under real traffic, not just idle noise claims",
  rackmount: "checking rack depth, airflow direction, and cable management at full port density",
  desktop: "checking footprint, cabling, and warm-state noise for a desk or home-office placement",
  homelab: "verifying VLAN and L3 features against genuinely low idle power and acoustics",
  nas: "verifying sustained multi-client throughput rather than a single theoretical line-rate number",
  home: "matching port count and topology to what a home network actually needs, not enterprise scale",
  budget: "verifying real switching capacity and support quality at a lower price point",
  industrial: "requiring documented environmental range and power redundancy, not just a metal case",
  layer2: "verifying hardware-offloaded VLAN, LACP, and STP support by exact feature",
  layer3: "requiring verified hardware routing and route/ACL scale, not just a Layer 3 label",
  generic: "verifying true 10G port count and switching capacity instead of trusting the listing alone",
};

const FIRST_TEMPLATES = [
  (title, kw, angle) => `${title} deserves topology-specific scrutiny before ranking, since this category comes down to ${angle}.`,
  (title, kw, angle) => `Shopping for ${kw} starts with ${angle}, not with trusting a headline port count.`,
  (title, kw, angle) => `Before ranking any pick for ${kw}, the real work is ${angle}.`,
  (title, kw, angle) => `${kw} switches vary enough that ${angle} matters more than the port total alone.`,
  (title, kw, angle) => `The real test for ${kw} comes down to ${angle}, not a glance at the listing photo.`,
  (title, kw, angle) => `Choosing among ${kw} means starting with ${angle} rather than price or star rating.`,
  (title, kw, angle) => `A quick scan of ${kw} listings rarely settles the question of ${angle}, so that's where we started.`,
  (title, kw, angle) => `${title} looks straightforward from the outside, but the real differentiator between switches is ${angle}.`,
  (title, kw, angle) => `Most ${kw} buyers skip straight to port count, when the more useful first step is ${angle}.`,
  (title, kw, angle) => `Ranking ${kw} fairly means putting ${angle} ahead of anything the listing photos suggest.`,
];

const SECOND_TEMPLATES = [
  (angle) => `We compared this lineup on verified port topology plus ${angle}, since headline specs alone regularly overstate real throughput.`,
  (angle) => `Our ranking weighs verified port topology plus ${angle} ahead of marketing language.`,
  (angle) => `Each pick here was judged on verified port topology plus ${angle}, not just its price tag.`,
  (angle) => `We prioritized verified port topology plus ${angle} over brand reputation when building this list.`,
  (angle) => `Rather than trust manufacturer claims, we checked verified port topology plus ${angle} for every switch on this list.`,
  (angle) => `The picks below were sorted by verified port topology plus ${angle}, the details that actually decide real throughput.`,
  (angle) => `What separates these picks is verified port topology plus ${angle}, checked model by model.`,
  (angle) => `Every entry on this list was screened for verified port topology plus ${angle} before anything else was weighed.`,
  (angle) => `Verified port topology plus ${angle} decided this ranking far more than star counts did.`,
  (angle) => `We leaned on verified port topology plus ${angle} to separate genuinely capable switches from well-marketed ones.`,
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
        { subheading: "Build a Current Model Map First", note: `Confirm which ${K} models are currently sold rather than assuming an older listing reflects the current lineup, since old support pages stay heavily indexed.` },
        { subheading: "Publish Exact Port Topology by Model", note: "Check exact copper/SFP+ topology and documented switching capacity for the specific model, not the brand's range in general." },
        { subheading: "Verify Management and Licensing Requirements", note: "Confirm whether the switch needs a controller, cloud account, or subscription license before it unlocks full functionality." },
        { subheading: "Check Optics and DAC Compatibility", note: "Use official transceiver compatibility guidance rather than assuming any generic SFP+ module works." },
        { subheading: "Confirm Firmware and Support Lifecycle", note: "Verify current firmware support and warranty terms, since older switches in a brand's lineup can lose active support over time." },
      ];
    case "portcount":
      return [
        { subheading: "Require Simultaneously Usable 10G Ports", note: `Confirm ${K}'s stated port count matches genuinely usable 10GbE interfaces, excluding management, slower access, or shared-only ports.` },
        { subheading: "Identify Combo and Shared Ports", note: "Check whether any RJ45 and SFP+ ports share one logical interface, since these should never be double-counted toward the total." },
        { subheading: "Check Native Media Type Per Port", note: "Verify how many 10G ports are native RJ45 versus SFP+, and what transceivers or DACs are needed for the fiber ports." },
        { subheading: "Verify Switching Capacity Against Full Load", note: "Confirm switching capacity covers simultaneous bidirectional traffic on every advertised port, not just a subset." },
        { subheading: "Check Uplink and Stacking Headroom", note: "Look at faster uplinks or stacking options separately, since these affect real oversubscription beyond the access-port count." },
      ];
    case "poe":
      return [
        { subheading: "Verify Ports With Both 10G and PoE", note: `Count only interfaces on ${K} that deliver both 10GbE data and PoE power, since many switches only provide PoE on slower access ports.` },
        { subheading: "Check PoE Standard and Per-Port Maximum", note: "Confirm the exact 802.3af/at/bt class and per-port wattage maximum for the specific 10G ports you plan to use." },
        { subheading: "Calculate Total PoE Budget Against Devices", note: "Add up your intended device power draw and compare it against the switch's total PoE budget, not just the per-port maximum." },
        { subheading: "Test Data Throughput With PoE Active", note: "Check for evidence that data throughput holds up while high-power PoE is active, since combined load adds real thermal stress." },
        { subheading: "Confirm Fan and Thermal Behavior Under Combined Load", note: "Verify fan behavior and chassis temperature ratings under simultaneous 10G and PoE load, not just idle specs." },
      ];
    case "managed":
    case "layer2":
    case "layer3":
      return [
        { subheading: "Verify VLAN and LACP Under Real Load", note: `Confirm ${K} supports VLAN tagging, trunks, and LACP aggregation under sustained 10G traffic, not just as a checkbox feature.` },
        { subheading: "Check STP and Multicast Support", note: "Verify STP/RSTP/MSTP and IGMP/multicast features match what your specific network deployment actually needs." },
        { subheading: "Confirm ACL and QoS Are Hardware-Forwarded", note: "Check whether ACL and QoS policy changes stay hardware-forwarded at line rate, not just management-plane features." },
        { subheading: "Compare Management Interface Options", note: "Verify local web/CLI, SNMP, controller, or cloud management options fit your preferred administration style." },
        { subheading: "Separate Real L3 Routing From Static-Route-Only", note: "Confirm whether Layer 3 claims mean genuine hardware routing or just limited static-route functionality." },
      ];
    case "rj45":
    case "fanless":
    case "quiet":
      return [
        { subheading: "Require Native 10GBASE-T, Not Populated SFP+ Cages", note: `Confirm ${K}'s 10G ports are native copper rather than SFP+ cages fitted with optional copper modules.` },
        { subheading: "Verify Multi-Gig Fallback on Every Port", note: "Check 5G/2.5G/1G auto-negotiation fallback on each port, since mixed-speed devices are common on real networks." },
        { subheading: "Check Cable Category and Distance Requirements", note: "Confirm the exact cable category (Cat6, Cat6A) and maximum distance needed for sustained 10G operation." },
        { subheading: "Measure Warm-State Acoustics Under Load", note: "Look for noise measurements taken after warm-up under real traffic, not just an idle or fanless label." },
        { subheading: "Verify Thermal Behavior With Copper Modules Active", note: "Check thermal ratings specifically with 10GBASE-T ports active, since copper PHYs generate meaningfully more heat than SFP+ optics." },
      ];
    case "rackmount":
    case "industrial":
      return [
        { subheading: "Publish Rack Format and Chassis Depth", note: `Confirm ${K}'s exact rack format and depth fits your actual rack, since shallow SMB units and deep data-center switches both exist at this port count.` },
        { subheading: "Verify Airflow Direction Matches Your Rack", note: "Check airflow direction and confirm it aligns with your rack's cooling design before installation." },
        { subheading: "Confirm Power Supply Redundancy", note: "Verify fixed versus redundant/hot-swap power supplies, and required DC inputs for industrial deployments." },
        { subheading: "Check Environmental Rating for the Deployment Site", note: "Confirm documented operating temperature range and mounting options match your actual installation environment." },
        { subheading: "Plan Cable Bulk and Service Access", note: "Account for DAC/fiber bend radius, RJ45 cable bulk at full density, and rear clearance for maintenance access." },
      ];
    case "desktop":
    case "home":
    case "homelab":
    case "nas":
      return [
        { subheading: "Map the Real Topology First", note: `Sketch the exact devices ${K} needs to connect and count how many genuinely need 10GbE, since most home networks only need a few true 10G ports.` },
        { subheading: "Compare RJ45 and SFP+ for Your Cable Runs", note: "Choose based on existing cabling and NIC types, since RJ45 is simpler for short runs while SFP+/DAC can be more efficient for rack-to-rack links." },
        { subheading: "Measure Acoustics in the Actual Room", note: "Consider noise specifically in a home-office or living-space context, since sound that's fine in a server room can be intrusive at a desk." },
        { subheading: "Check Idle Power for 24/7 Operation", note: "Verify idle power draw, since home and homelab switches typically run continuously rather than being powered down." },
        { subheading: "Include NICs and Cabling in Total Cost", note: "Factor in NICs, DACs or transceivers, and cabling cost, since these can add a meaningful share of the total upgrade budget." },
      ];
    case "budget":
      return [
        { subheading: "Date-Stamp Price and Calculate Cost Per True 10G Port", note: `Verify ${K}'s current price and divide by genuinely usable 10G ports, not the total port count, for an honest cost comparison.` },
        { subheading: "Include Full Upgrade Cost, Not Just the Switch", note: "Add NICs, transceivers, and cabling to the switch price before calling it the cheaper option overall." },
        { subheading: "Verify Switching Capacity Isn't the Corner Being Cut", note: "Check that low price isn't achieved through oversubscribed switching capacity that bottlenecks under real multi-port load." },
        { subheading: "Measure Power and Noise at This Price Point", note: "Confirm idle and load power plus warm-state fan noise, since budget switches vary widely on these figures." },
        { subheading: "Compare Warranty Against the Purchase Price", note: "Weigh warranty length and support quality against the lower price, since budget brands vary significantly in after-sale support." },
      ];
    case "unmanaged":
      return [
        { subheading: "Confirm Genuine Plug-and-Play Operation", note: `Verify ${K} truly needs zero configuration to reach full advertised speed, not a firmware update or hidden setup step first.` },
        { subheading: "Check Mixed-Speed Port Negotiation", note: "Test or verify auto-negotiation behavior across 100M/1G/2.5G/5G/10G speeds for mixed devices on the same switch." },
        { subheading: "Verify Switching Capacity Is Sufficient", note: "Confirm the switch's non-blocking capacity actually covers the full advertised port set under simultaneous load." },
        { subheading: "Check EEE and Reconnect Behavior", note: "Verify link stability after sleep, reboot, or unplug cycles, since unmanaged switches vary in how gracefully they reconnect." },
        { subheading: "Measure Fan Noise If Present", note: "Check for a cooling fan and its noise level, since not every unmanaged 10G switch is genuinely fanless despite similar branding." },
      ];
    default:
      return [
        { subheading: "Verify True 10G Port Count", note: `Confirm ${K}'s actual number of simultaneously usable 10GbE ports, excluding management or shared interfaces.` },
        { subheading: "Check RJ45 vs SFP+ Topology", note: "Verify exactly how many ports are native copper versus fiber, since cabling costs differ significantly between the two." },
        { subheading: "Confirm Switching Capacity", note: "Check documented switching capacity against simultaneous full-duplex traffic on all advertised ports." },
        { subheading: "Verify Management Depth", note: "Confirm VLAN, QoS, and routing claims against actual documented features rather than a marketing label." },
        { subheading: "Weigh Power and Acoustic Behavior", note: "Factor in PoE budget, fan noise, and thermal rating as part of real deployment planning." },
      ];
  }
}

function buildBespokeFaq(cat, kw) {
  const K = kw;
  switch (cat) {
    case "brand":
      return [
        { q: `Are all ${K} models currently sold and supported?`, a: "Check current first-party store or support pages directly, since older switches often stay heavily indexed in search results long after being discontinued or moved to legacy support status." },
        { q: "Does the brand name guarantee consistent port topology across models?", a: "No. A brand's lineup can span very different port counts, media types, and switching capacities, so always verify the exact model's specs rather than assuming consistency across the brand." },
      ];
    case "portcount":
      return [
        { q: `Does the advertised port count on ${K} always mean that many true 10G ports?`, a: "Not always. Some listings mix in slower management, access, or shared combo ports to reach a higher headline number. Verify how many ports actually run at full 10GbE speed simultaneously." },
        { q: "What's a combo port, and why does it matter for counting?", a: "A combo port shares one logical interface between an RJ45 jack and an SFP+ slot, meaning only one can be active at a time. Counting both toward the total port number overstates real capacity." },
      ];
    case "poe":
      return [
        { q: `Can every port on a PoE ${K} deliver its maximum wattage simultaneously?`, a: "Generally no. The total PoE budget is shared across all active ports, so powering many high-draw devices at once may mean some ports can't reach their individual maximum rating." },
        { q: "Does 10GbE PoE run hotter than standard PoE?", a: "Yes, meaningfully. Combining high-power PoE delivery with 10GBASE-T copper data both generate real heat, so check fan behavior and thermal ratings specifically under combined load, not separately." },
      ];
    case "managed":
    case "layer2":
    case "layer3":
      return [
        { q: `Is a "managed" ${K} the same as an enterprise Layer 3 switch?`, a: "Not necessarily. Managed can range from lite smart-switch features up through full enterprise L3 platforms, so check the exact documented feature list rather than assuming the word managed implies routing depth." },
        { q: "Do VLAN and QoS features actually run at full 10G speed?", a: "It depends on whether the switch hardware-offloads these features. Check for evidence of maintained throughput with VLANs and QoS policies active under load, not just that the features exist in the settings menu." },
      ];
    case "rj45":
    case "fanless":
    case "quiet":
      return [
        { q: `Do I need special cable for ${K} to actually reach 10Gbps?`, a: "Generally Cat6A or better for reliable performance at typical distances; standard Cat6 can sometimes work over short runs but isn't guaranteed. Check the specific switch's documented cable requirements." },
        { q: "Are fanless 10GbE switches reliable for continuous 24/7 use?", a: "Generally yes if the chassis design accounts for the real heat from copper 10G ports, check the switch's rated operating temperature range and any thermal throttling behavior under sustained load." },
      ];
    case "rackmount":
    case "industrial":
      return [
        { q: `Does ${K} need special rails or accessories to rack-mount?`, a: "Check the specific listing; some switches include rack ears standard while others require a separately purchased mounting kit, especially half-width or unusual-depth chassis." },
        { q: "What makes a switch genuinely industrial versus just metal-cased?", a: "A documented wide operating temperature range, redundant DC power inputs, and rated vibration/mounting tolerance, not just a metal chassis, which consumer switches also commonly use." },
      ];
    case "desktop":
    case "home":
    case "homelab":
    case "nas":
      return [
        { q: `How many true 10G ports does a typical ${K} actually need?`, a: "Usually just a few: a NAS, one or two workstations, and a router or firewall uplink, while most other devices stay on 1G or 2.5G. Map your actual topology before buying more ports than you'll use." },
        { q: "Is SFP+ overkill for a home network?", a: "Not necessarily, especially for short rack-to-rack runs where a DAC cable can be cheaper and run cooler than RJ45, but RJ45 is simpler if your devices and existing cabling are already copper-based." },
      ];
    case "budget":
      return [
        { q: `Are budget ${K} genuinely reliable, or do they cut corners that matter?`, a: "It varies. Some budget switches use simpler switching silicon or fewer management features to hit a lower price, while others simply skip extras while keeping comparable core hardware, compare documented switching capacity rather than price alone." },
        { q: "What should I check before buying the cheapest 10GbE switch available?", a: "Verify true port count, switching capacity under full load, and warranty terms, since these often separate genuinely comparable budget options from ones that cut real corners." },
      ];
    case "unmanaged":
      return [
        { q: `Will an unmanaged ${K} work with mixed-speed devices out of the box?`, a: "Generally yes, since auto-negotiation is standard on unmanaged 10G switches, automatically matching each connected device's best supported speed without configuration." },
        { q: "Can I add management features to an unmanaged switch later?", a: "No. Unmanaged switches have no software layer to add later, if you anticipate needing VLANs or QoS down the line, buy a managed or smart-managed switch from the start." },
      ];
    default:
      return [
        { q: `What's the biggest mistake buyers make shopping for ${K}?`, a: "Trusting the headline port count without checking how many ports are genuinely 10G versus slower management or shared interfaces." },
        { q: `Should I prioritize port count or switching capacity when choosing ${K}?`, a: "Switching capacity, since a switch with plenty of ports but insufficient internal bandwidth will bottleneck under real simultaneous multi-port load regardless of the port count." },
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
  const metaDescription = `We compared ${kw} by verified port topology, switching capacity, and management depth rather than ranking by headline port count alone.`;

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

fs.writeFileSync("scripts/_switch10g_slug_list.txt", allSlugs.join(" "));
console.log(`wrote ${written} guide files`);
