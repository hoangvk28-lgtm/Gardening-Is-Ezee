import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const research = JSON.parse(readFileSync("/tmp/gardening-budget-complete.json", "utf8"));
const updated = "2026-09-30";

const clusters = [
  {
    key: "garden-hoses", noun: "Garden Hoses", silo: "watering", limits: [25, 50, 100],
    parent: "best-garden-hoses", related: ["best-kink-resistant-garden-hoses", "best-lightweight-garden-hoses", "/watering/how-to-choose-a-garden-hose"],
    required: /garden hose|water hose/i, excluded: /reel|holder|repair|connector|nozzle only|adapter/i,
    factors: ["usable length and inside diameter", "fitting material and leak resistance", "filled weight and drag", "kink behavior and storage", "included nozzle and repairability"],
    specLabels: ["Length", "Material", "Weight"],
  },
  {
    key: "retractable-hose-reels", noun: "Retractable Garden Hose Reels", silo: "watering", limits: [100, 150, 200, 300],
    parent: "best-retractable-garden-hose-reels", related: ["best-wall-mounted-garden-hose-reels", "best-portable-garden-hose-reels", "/watering/choose-hose-reel"],
    required: /retractable.*hose reel|hose reel.*retractable/i, excluded: /cover|replacement|bracket only|leader hose|repair|swivel only/i,
    factors: ["hose length and diameter", "rewind control and locking positions", "mounting hardware and wall strength", "swivel range and coverage", "serviceable hose and fittings"],
    specLabels: ["Hose size", "Housing size", "Mounting"],
  },
  {
    key: "leaf-blowers", noun: "Leaf Blowers", silo: "yard-cleanup", limits: [50, 150, 200, 300],
    parent: "best-leaf-blowers", related: ["best-cordless-leaf-blowers", "best-leaf-blowers-for-wet-leaves", "/yard-cleanup/leaf-blower-cfm-vs-mph"],
    required: /leaf blower/i, excluded: /attachment|gutter kit|replacement|battery only|charger only|bag only|vacuum bag/i,
    factors: ["air volume and air speed", "battery and charger inclusion", "working weight and balance", "speed control and nozzle design", "noise, storage and platform compatibility"],
    specLabels: ["Power source", "Air output", "Weight"],
  },
  {
    key: "raised-garden-beds", noun: "Raised Garden Beds", silo: "growing", limits: [100, 150, 200, 300],
    parent: "best-metal-raised-garden-beds", related: ["best-galvanized-raised-garden-beds", "best-tall-raised-garden-beds", "/growing/how-deep-should-a-raised-garden-bed-be"],
    required: /raised garden bed|raised bed/i, excluded: /cover only|liner only|corner bracket|connector|soil|trellis only|irrigation/i,
    factors: ["usable planting volume", "panel material and bracing", "height and reach", "drainage and open-bottom design", "assembly hardware and safe edges"],
    specLabels: ["Bed size", "Material", "Height"],
  },
  {
    key: "compost-bins", noun: "Outdoor Compost Bins", silo: "growing", limits: [50, 100, 150, 200],
    parent: "best-outdoor-compost-bins", related: ["best-compost-tumblers", "best-large-compost-bins", "compost-tumbler-vs-compost-bin"],
    required: /compost/i, excluded: /filter|bag only|liner|countertop|kitchen|charcoal|thermometer|starter/i,
    factors: ["working capacity and footprint", "aeration and drainage", "loading and finished-compost access", "pest resistance and lid fit", "turning method and assembly"],
    specLabels: ["Capacity", "Design", "Footprint"],
  },
  {
    key: "electric-pruning-shears", noun: "Electric Pruning Shears", silo: "garden-tools", limits: [100, 150, 200],
    parent: "best-electric-pruning-shears", related: ["best-cordless-electric-pruning-shears", "best-professional-electric-pruning-shears", "electric-pruning-shears-vs-manual-pruners"],
    required: /electric.*prun|cordless.*prun|prun.*electric/i, excluded: /replacement|blade only|manual prun|sheath|sharpener|battery only|charger only/i,
    factors: ["rated cutting diameter", "battery capacity and spare-pack inclusion", "trigger control and blade response", "working weight and hand fit", "safety lock and replacement-blade support"],
    specLabels: ["Cut capacity", "Battery", "Weight"],
  },
  {
    key: "electric-tillers", noun: "Electric Tillers", silo: "yard-cleanup", limits: [100, 200, 300, 500],
    parent: "best-electric-tillers", related: ["best-cordless-electric-tillers", "best-corded-electric-tillers", "lawn-aerator-vs-tiller"],
    required: /tiller|cultivator/i, excluded: /attachment|replacement|blade only|tine only|wheel only|battery only|charger only|manual hand/i,
    factors: ["tilling width and depth", "corded or battery power system", "tine layout and soil type", "working weight and transport", "handle controls and storage"],
    specLabels: ["Tilling width", "Power", "Weight"],
  },
  {
    key: "watering-cans", noun: "Watering Cans", silo: "watering", limits: [25, 50, 100],
    parent: "best-watering-cans", related: ["best-garden-watering-cans", "best-metal-watering-cans", "best-watering-cans-with-removable-roses"],
    required: /watering can/i, excluded: /toy|miniature|ornament|replacement|spout only|rose only|nozzle only/i,
    factors: ["usable capacity and filled weight", "spout reach and pour control", "handle position and grip", "body material and seam quality", "removable rose and storage footprint"],
    specLabels: ["Capacity", "Material", "Size"],
  },
  {
    key: "smart-sprinkler-controllers", noun: "Smart Sprinkler Controllers", silo: "watering", limits: [100, 150, 200, 300],
    parent: "best-smart-sprinkler-controllers", related: ["best-weather-based-smart-sprinkler-controllers", "best-smart-sprinkler-controllers-without-subscriptions", "best-orbit-b-hyve-smart-sprinkler-controllers"],
    required: /sprinkler controller|irrigation controller/i, excluded: /sensor|module|replacement|valve|transformer|enclosure|remote|water timer|gateway/i,
    factors: ["supported zone count", "weather adjustment and scheduling", "app and local control", "indoor or outdoor installation", "wiring compatibility and expansion"],
    specLabels: ["Zones", "Installation", "Connectivity"],
  },
  {
    key: "garden-tool-sets", noun: "Garden Tool Sets", silo: "garden-tools", limits: [50, 100, 150],
    parent: "best-garden-tool-sets", related: ["best-heavy-duty-garden-tool-sets", "best-garden-tool-sets-for-women", "best-garden-tool-storage-racks"],
    required: /garden(?:ing)? tools? set|garden hand tools|gardening kit/i, excluded: /kids|children|toy|miniature|replacement|organizer only|bag only/i,
    factors: ["useful tool mix", "head material and tang construction", "handle shape and grip", "storage bag or rack", "soil tasks covered without filler pieces"],
    specLabels: ["Piece count", "Material", "Storage"],
  },
  {
    key: "pruning-shears", noun: "Manual Pruning Shears", silo: "garden-tools", limits: [25, 50, 100],
    parent: "electric-pruning-shears-vs-manual-pruners", related: ["best-electric-pruning-shears", "best-electric-pruning-shears-for-roses", "are-electric-pruning-shears-worth-it"],
    required: /pruning shear|hand pruner|garden pruner|pruning scissors/i, excluded: /electric|cordless|battery|replacement|blade only|holster only|sheath only|sharpener only|pole/i,
    factors: ["rated cutting capacity", "bypass or anvil blade action", "blade steel and coating", "handle span and spring", "lock placement and serviceability"],
    specLabels: ["Cut capacity", "Blade", "Length"],
  },
  {
    key: "garden-carts", noun: "Garden Carts", silo: "garden-tools", limits: [150, 200, 300],
    parent: "best-garden-carts", related: ["best-steel-garden-carts", "best-garden-carts-for-uneven-terrain", "garden-cart-vs-wheelbarrow"],
    required: /garden cart|utility cart|garden wagon|yard cart/i, excluded: /cover|replacement|wheel only|tire only|liner|hitch|kids|toy|folding wagon|workseat|work seat|stool|scooter/i,
    factors: ["rated load and bed volume", "dumping or removable-side design", "wheel count and tire type", "handle geometry and turning radius", "frame material and stored size"],
    specLabels: ["Capacity", "Bed", "Wheels"],
  },
  {
    key: "weed-pullers", noun: "Weed Pullers", silo: "garden-tools", limits: [50, 100],
    parent: "best-weed-pullers", related: ["best-stand-up-weed-pullers", "best-weed-pullers-for-garden-beds", "best-weed-pullers-for-seniors"],
    required: /weed puller|weeder|weed remover/i, excluded: /electric|cordless|replacement|brush|trimmer|sprayer|herbicide|weed torch|toy/i,
    factors: ["root-gripping head design", "standing or hand-tool reach", "ejection mechanism", "shaft and foot-platform strength", "fit for taproots or shallow weeds"],
    specLabels: ["Tool length", "Head", "Material"],
  },
  {
    key: "leaf-vacuums", noun: "Leaf Vacuums", silo: "yard-cleanup", limits: [100, 200, 300],
    parent: "best-leaf-vacuums", related: ["best-cordless-leaf-vacuums", "best-leaf-vacuums-for-wet-leaves", "best-leaf-vacuums-with-bags"],
    required: /leaf vacuum|blower.{0,12}vacuum|vacuum.{0,12}mulcher|lawn vacuum/i, excluded: /bag only|attachment|replacement|tube only|hose only|wheel only|battery only|charger only|sweeper/i,
    factors: ["vacuum airflow and suction path", "mulching ratio and impeller", "collection bag capacity", "corded, battery or gas power", "conversion controls and working weight"],
    specLabels: ["Power", "Air output", "Bag"],
  },
  {
    key: "hose-reel-carts", noun: "Hose Reel Carts", silo: "watering", limits: [100, 150, 200],
    parent: "best-portable-garden-hose-reels", related: ["best-garden-hoses-with-reels", "best-wall-mounted-garden-hose-reels", "best-retractable-garden-hose-reels"],
    required: /hose reel cart|hose cart|cart.{0,20}hose reel/i, excluded: /cover only|replacement|wheel only|tire only|leader hose only|connector only|decorative/i,
    factors: ["rated hose capacity", "frame and reel material", "wheel layout and mobility", "crank, guide and swivel design", "leader hose and fitting quality"],
    specLabels: ["Hose capacity", "Frame", "Wheels"],
  },
  {
    key: "outdoor-storage-boxes", noun: "Outdoor Storage Boxes", silo: "outdoor-living", limits: [100, 200, 300],
    parent: "best-outdoor-storage-sheds", related: ["best-small-outdoor-storage-sheds", "best-waterproof-outdoor-storage-sheds", "best-garden-tool-storage-cabinets"],
    required: /outdoor storage box|deck box|patio storage box/i, excluded: /cover only|cushion|replacement|lock only|organizer only|indoor|package box|delivery box/i,
    factors: ["usable storage capacity", "weather-resistant panel design", "lid support and opening clearance", "lock provision and floor strength", "assembly and patio footprint"],
    specLabels: ["Capacity", "Material", "Footprint"],
  },
  {
    key: "wheelbarrows", noun: "Wheelbarrows", silo: "garden-tools", limits: [100, 150, 200],
    parent: "garden-cart-vs-wheelbarrow", related: ["best-power-wheelbarrows", "best-power-assisted-wheelbarrows", "best-garden-carts"],
    required: /wheelbarrow/i, excluded: /power|electric|gas|motorized|replacement|wheel only|tire only|tray only|handle only|toy|planter|flower pot|dump cart|wagon|4 wheel/i,
    factors: ["tray volume and load rating", "one- or two-wheel balance", "tire type and axle support", "handle reach and dumping control", "tray and frame material"],
    specLabels: ["Capacity", "Tray", "Wheels"],
  },
];

const knownBrands = /flexzilla|zero-g|bionic|pocket hose|giraffe|gardena|glahoden|vevor|ego|dewalt|black\+decker|craftsman|greenworks|worx|land guard|best choice|vivosun|geobin|miracle-gro|ejwox/i;
const forbidden = /review|rating|star|customer feedback|price|cost|cheapest|least expensive|amazon's choice/i;

function clean(value, max = 210) {
  const normalized = String(value ?? "")
    .replace(/【[^】]+】/g, "")
    .replace(/^\s*\[[^\]]+\]\s*/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b(?:best seller|amazon's choice)\b/gi, "")
    .trim();
  const shortened = normalized.length > max ? normalized.slice(0, max).replace(/\s+\S*$/, "") : normalized;
  return shortened.replace(/[,;:\s]+$/, "");
}

function nameFor(item) {
  const title = clean(item.title, 118);
  const segments = title.split(/,\s+/);
  return segments.slice(0, Math.min(3, segments.length)).join(", ");
}

function baseKey(item) {
  return item.title.toLowerCase().replace(/\b\d+(?:\.\d+)?\s*(?:ft|feet|foot|inch|in|gal|gallon|v|volt|ah)\b/g, "").replace(/[^a-z]+/g, " ").trim().slice(0, 70);
}

function relevant(item, cluster) {
  return item.image && Number.isFinite(item.price) && cluster.required.test(item.title) && !cluster.excluded.test(item.title);
}

function score(item, limit) {
  let result = (item.price / limit) * 10;
  if (knownBrands.test(`${item.brand} ${item.title}`)) result += 5;
  if (item.features?.length >= 3) result += 2;
  if (item.productInfo?.size?.displayValue) result += 1;
  return result;
}

function select(cluster, limit, used) {
  const unique = new Map();
  for (const item of research.pools[cluster.key].filter((entry) => relevant(entry, cluster) && entry.price <= limit)) {
    const key = baseKey(item);
    if (!unique.has(key) || score(item, limit) > score(unique.get(key), limit)) unique.set(key, item);
  }
  const ranked = [...unique.values()].sort((a, b) => score(b, limit) - score(a, limit));
  const fresh = ranked.filter((item) => !used.has(item.asin));
  const shared = ranked.filter((item) => used.has(item.asin));
  const selected = [...fresh.slice(0, 4), ...shared.slice(0, 2)];
  for (const item of ranked) if (selected.length < 6 && !selected.some((pick) => pick.asin === item.asin)) selected.push(item);
  if (selected.length < 6) throw new Error(`${cluster.key} under ${limit} has only ${selected.length} usable products`);
  selected.slice(0, 6).forEach((item) => used.add(item.asin));
  return selected.slice(0, 6);
}

function infoValue(item, key) {
  const value = item.productInfo?.[key];
  if (!value) return "";
  if (value.displayValue !== undefined) return `${value.displayValue}${value.unit ? ` ${value.unit}` : ""}`;
  return "";
}

function firstMatch(title, expressions) {
  for (const expression of expressions) {
    const match = title.match(expression);
    if (match) return match[0];
  }
  return "";
}

function specsFor(item, cluster) {
  const size = infoValue(item, "size") || firstMatch(item.title, [/\b\d+(?:\.\d+)?\s*(?:ft|feet|foot)\b/i, /\b\d+(?:\.\d+)?\s*(?:gal|gallon)\b/i, /\b\d+x\d+(?:x\d+)?\s*(?:ft|feet|inch|in)?\b/i]);
  const weight = item.productInfo?.itemDimensions?.weight;
  const material = firstMatch(item.title, [/galvanized steel/i, /stainless steel/i, /hybrid polymer/i, /rubber/i, /metal/i, /plastic/i]);
  const power = firstMatch(item.title, [/\b\d+v\b/i, /corded electric/i, /cordless/i, /gas-powered/i]);
  const output = firstMatch(item.title, [/\b\d+\s*cfm\b/i, /\b\d+\s*mph\b/i]);
  return [size, material || power, output || (weight ? `${weight.displayValue} ${weight.unit}` : "")].filter(Boolean).slice(0, 3);
}

function featureFor(item, index, fallback) {
  const candidate = clean(item.features?.[index], 220);
  if (!candidate || forbidden.test(candidate)) return fallback;
  const sentence = candidate.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? candidate;
  const cleaned = clean(sentence, 190);
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function descriptionFor(item, cluster, limit, rank) {
  const name = nameFor(item);
  const specs = specsFor(item, cluster);
  const factorA = cluster.factors[rank % cluster.factors.length];
  const factorB = cluster.factors[(rank + 2) % cluster.factors.length];
  const f1 = featureFor(item, 0, `The documented configuration gives shoppers a concrete basis for comparing ${factorA}.`);
  const f2 = featureFor(item, 1, `Its listed dimensions and included components help clarify the space and setup it requires.`);
  const openings = [
    `${name} earns the lead position because its documented setup balances ${factorA} with ${factorB}. ${f1}`,
    `The case for ${name} begins with ${factorA}, an area where budget models can differ substantially. ${f1}`,
    `${name} is the practical alternative in this shortlist, particularly when ${factorB} matters more than extra accessories. ${f1}`,
    `For a more specialized setup, ${name} brings a different mix of ${factorA} and ${factorB}. ${f1}`,
    `${name} makes sense where storage and everyday handling carry as much weight as headline capacity. ${f1}`,
    `${name} rounds out the shortlist with a configuration that serves a narrower but useful garden scenario. ${f1}`,
  ];
  const middles = [
    `Its place in an under-$${limit} comparison depends on usable capability, not the size of the claims in the listing. ${f2}`,
    `Within this under-$${limit} group, that configuration gives it a clear job instead of making it a duplicate of the lead pick. ${f2}`,
    `The under-$${limit} trade-off is deliberate: it emphasizes ${factorA} while leaving buyers to verify ${factorB} for their own setup. ${f2}`,
    `At this under-$${limit} tier, it is the pick to compare when the ordinary garden routine matters more than collecting every available feature. ${f2}`,
    `Inside the $${limit} ceiling, the design is most convincing when its smaller operational footprint solves a real storage or handling constraint. ${f2}`,
    `It belongs in this under-$${limit} shortlist as a credible final option, but only for shoppers whose workload matches the documented configuration. ${f2}`,
  ];
  const endings = [
    `Confirm the included components and compare ${specs.length ? specs.join(", ") : factorA} with the area you actually maintain. Recheck that the exact variation still qualifies for this guide before ordering.`,
    `Measure the route or work area first, then verify ${specs.length ? specs.join(", ") : factorB} on the selected variation. A similar product-family photo is not enough evidence that every configuration includes the same parts.`,
    `Pay particular attention to ${factorB}, because that is where this alternative may fit differently from the lead model. The current offer and variation should be confirmed through the Check price link.`,
    `Match ${factorA} to the hardest part of the intended job, not merely the easiest weekly task. If an essential component is absent, moving to another pick is more sensible than planning an immediate upgrade.`,
    `Check the stored dimensions as carefully as the working specifications. The right budget pick should fit both the garden task and the place where it will live between uses.`,
    `Use this option as a cross-check against the first five rather than an automatic fallback. Its value depends on the exact model, included hardware and compatibility remaining aligned with your setup.`,
  ];
  return `${openings[rank]}\n\n${middles[rank]}\n\n${endings[rank]}`;
}

function productFor(item, cluster, limit, rank) {
  const name = nameFor(item);
  const specs = specsFor(item, cluster);
  const badges = ["Best Overall", "Best for Everyday Use", "Best Alternative", "Best for Larger Jobs", "Best Compact Pick", "Also Consider"];
  const factorA = cluster.factors[rank % cluster.factors.length];
  const factorB = cluster.factors[(rank + 1) % cluster.factors.length];
  return {
    id: `${item.asin.toLowerCase()}-${cluster.key.slice(0, 10)}`,
    rank: rank + 1,
    badge: badges[rank],
    name,
    amazonUrl: item.detailPageURL,
    imageUrl: item.image,
    specs: specs.length ? specs : ["Confirm current configuration"],
    description: descriptionFor(item, cluster, limit, rank),
    bestFor: `buyers who prioritize ${factorA} while staying within the stated budget ceiling`,
    pros: [
      `${clean(featureFor(item, 0, `Documented design addresses ${factorA}.`), 145)}`,
      `${clean(featureFor(item, 1, `Configuration makes ${factorB} easier to compare.`), 145)}`,
      `Current listing provides an identifiable model and included-component set`,
    ],
    cons: [
      `Confirm ${factorB} for the exact model before ordering`,
      `Availability within the budget ceiling can change`,
    ],
  };
}

function guideSource(cluster, limit, selected) {
  const slug = `best-${cluster.key}-under-${limit}`;
  const title = `Best ${cluster.noun} Under $${limit} (2026)`;
  const products = selected.map((item, index) => productFor(item, cluster, limit, index));
  const description = `We compare six current ${cluster.noun.toLowerCase()} that qualified for an under-$${limit} shortlist, focusing on ${cluster.factors.slice(0, 3).join(", ")}.`;
  const intro = [
    `An under-$${limit} label is useful only when the products still meet the basic demands of the job. We screened current US listings for complete, identifiable products, then compared the details that change daily use: ${cluster.factors.slice(0, 3).join(", ")}.`,
    `Prices can move after publication, so this guide does not display a fixed checkout figure. Each pick qualified when researched; use the Check price button to confirm that the exact model remains within the budget ceiling and that the included components have not changed.`,
  ];
  const buyingCriteria = cluster.factors.map((factor, index) => ({
    criterion: factor[0].toUpperCase() + factor.slice(1),
    explanation: [
      `We compared ${factor} using the current title, feature documentation, dimensions and included-component list for every shortlisted model.`,
      index === 0 ? `A low purchase ceiling does not make a product useful if its core capacity is too small for the intended garden job.` : `Confirm this point for the exact variation because size, battery, hose length or included hardware can change within one listing.`,
    ].join(" "),
  }));
  const howWeEvaluated = [
    { title: "Budget eligibility at research time", description: `Every ${cluster.noun.toLowerCase()} pick had a current offer no higher than the $${limit} ceiling when this research set was collected. We use that condition only as an eligibility check and direct readers to verify the current listing.` },
    { title: "Complete product, not an accessory", description: `We excluded replacement parts, covers, brackets and other accessories that can appear in low-to-high searches without doing the full job implied by ${cluster.noun.toLowerCase()}.` },
    { title: "Documented garden fit", description: `For this under-$${limit} shortlist, we compared ${cluster.factors.join(", ")} and kept the assessment tied to verifiable catalog details.` },
    { title: "Trade-offs inside the ceiling", description: `The shortlist includes different capacities and configurations so buyers can match the product to the space instead of treating every option under the same ceiling as interchangeable.` },
  ];
  const howToChoose = [
    {
      subheading: `What an under-$${limit} budget can realistically buy`,
      intro: `The ceiling narrows the feature set, but it should not remove the basic capacity, safe setup or included parts required for normal use. Decide which one of the following compromises is acceptable before comparing brands.`,
      cards: cluster.factors.slice(0, 3).map((factor, index) => ({ label: index === 0 ? "Protect the core job" : index === 1 ? "Check the full kit" : "Plan for storage", text: `Compare ${factor} on the exact variation shown; do not infer it from a family photo or a different size.` })),
    },
    {
      subheading: "Shortlist comparison",
      table: { headers: ["Model", ...cluster.specLabels], rows: products.map((product) => [product.name, product.specs[0] ?? "Confirm", product.specs[1] ?? "Confirm", product.specs[2] ?? "Confirm"]) },
      note: "Specifications are taken from current product documentation and should be confirmed on the exact listing before ordering.",
    },
    {
      subheading: "When moving to the next budget tier makes sense",
      cards: [
        { label: "Stay within this ceiling if", text: `One of these configurations already meets your capacity, compatibility and storage needs without relying on an upgrade later.` },
        { label: "Move up if", text: `You would otherwise sacrifice a required battery, usable length, structural support, capacity or mounting component merely to remain under the headline ceiling.` },
      ],
    },
  ];
  const faq = [
    { q: `Are these ${cluster.noun.toLowerCase()} guaranteed to remain under $${limit}?`, a: "No. Online offers change. Every pick qualified when researched, but readers should use Check price to confirm the current offer and exact variation before ordering." },
    { q: "How were products compared without relying on marketplace popularity?", a: `Selection is based on current catalog data, documented specifications, included components, compatibility and practical trade-offs for the garden job.` },
    { q: "Why can two variations of the same product fall into different budget tiers?", a: "Length, capacity, battery inclusion, material and multipack quantity can change the offer substantially. Confirm the selected variation rather than relying on the family title alone." },
    { q: `How many ${cluster.noun.toLowerCase()} were selected?`, a: `Six complete products were selected from a broader current product pool after filtering out accessories, missing offers and configurations above the ceiling.` },
  ];
  const related = [cluster.parent, ...cluster.related].map((relatedSlug) => {
    const href = relatedSlug.startsWith("/") ? relatedSlug : `/guide/${relatedSlug}`;
    const label = relatedSlug.split("/").filter(Boolean).at(-1);
    return { title: label.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()), href };
  });
  return `export const guideSlug = ${JSON.stringify(slug)};\nexport const guideTitle = ${JSON.stringify(title)};\nexport const metaTitle = ${JSON.stringify(title)};\nexport const metaDescription = ${JSON.stringify(description)};\nexport const mainKeyword = ${JSON.stringify(`${cluster.noun} Under $${limit}`)};\nexport const categorySlug = "garden";\nexport const lastUpdated = ${JSON.stringify(updated)};\nexport const readTime = "12 min";\nexport const heroImage = ${JSON.stringify(products[0].imageUrl)};\nexport const introParagraphs = ${JSON.stringify(intro, null, 2)};\nexport interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; specs: string[]; description: string; bestFor: string; pros: string[]; cons: string[]; }\nexport const products: GuideProduct[] = ${JSON.stringify(products, null, 2)};\nexport const buyingCriteria = ${JSON.stringify(buyingCriteria, null, 2)};\nexport const howWeEvaluated = ${JSON.stringify(howWeEvaluated, null, 2)};\nexport interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }\nexport const howToChoose: HowToChooseSection[] = ${JSON.stringify(howToChoose, null, 2)};\nexport const faq = ${JSON.stringify(faq, null, 2)};\nexport const relatedGuides: { title: string; href: string }[] = ${JSON.stringify(related, null, 2)};\n`;
}

const manifest = [];
for (const cluster of clusters) {
  const used = new Set();
  for (const limit of cluster.limits) {
    const selected = select(cluster, limit, used);
    const slug = `best-${cluster.key}-under-${limit}`;
    const file = resolve(root, "data", "guides", `${slug}.ts`);
    writeFileSync(file, guideSource(cluster, limit, selected), "utf8");
    manifest.push({ slug, cluster: cluster.key, silo: cluster.silo, limit, asins: selected.map((item) => item.asin), heroImage: selected[0].image, title: `Best ${cluster.noun} Under $${limit} (2026)` });
  }
}

let registry = readFileSync(resolve(root, "data", "guides.ts"), "utf8");
const additions = [];
for (const item of manifest) {
  if (new RegExp(`slug:\\s*["']${item.slug}["']`).test(registry)) continue;
  additions.push(`  {\n    title: ${JSON.stringify(item.title)},\n    slug: ${JSON.stringify(item.slug)},\n    categorySlug: "garden",\n    subcategorySlug: ${JSON.stringify(item.silo)},\n    description: ${JSON.stringify(`Six current products compared by documented specifications, included components and practical trade-offs within the stated budget ceiling.`)},\n    mainKeyword: ${JSON.stringify(item.title.replace(/ \(2026\)$/, ""))},\n    subKeywords: ${JSON.stringify([item.slug.replace(/-/g, " "), `${item.cluster.replace(/-/g, " ")} budget guide`])},\n    heroImage: ${JSON.stringify(item.heroImage)},\n    lastUpdated: ${JSON.stringify(updated)},\n    author: "Gardening Is Ezee Editors",\n    readTime: "12 min",\n    recommendedProductIds: ${JSON.stringify(item.asins.map((asin) => asin.toLowerCase()))},\n    sections: [],\n    faq: [],\n    relatedGuideSlugs: [],\n    buyingCriteria: []\n  }`);
}
if (additions.length > 0) {
  registry = registry.replace(/,?\s*\n\];\s*$/, `,\n${additions.join(",\n")}\n];\n`);
  writeFileSync(resolve(root, "data", "guides.ts"), registry, "utf8");
}
writeFileSync("/tmp/gardening-budget-batch-1-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
console.log(`Generated ${manifest.length} budget guides and registered their silo routes.`);
