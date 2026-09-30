import fs from "node:fs/promises";
import path from "node:path";

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error("Pass the extracted package directory.");

const contentDir = path.join(process.cwd(), "public/content/informational");
const imageDir = path.join(process.cwd(), "public/images/informational/additional");
await fs.mkdir(contentDir, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });

const articles = [
  [11, "11-garden-hose-water-pressure-low.md", "garden-hose-water-pressure-low", ["garden hose", "outdoor faucet", "watering hose"]],
  [12, "12-water-outdoor-potted-plants-vacation.md", "water-outdoor-potted-plants-vacation", ["container garden", "watering potted plants", "flower pots"]],
  [13, "13-fix-leaking-garden-hose-connection.md", "fix-leaking-garden-hose-connection", ["garden hose connector", "outdoor faucet", "hose coupling"]],
  [14, "14-choose-hose-reel.md", "choose-hose-reel", ["garden hose reel", "hose cart", "coiled garden hose"]],
  [15, "15-metal-vs-wood-raised-garden-beds.md", "metal-vs-wood-raised-garden-beds", ["raised garden bed", "wooden raised bed", "metal raised bed"]],
  [16, "16-raised-bed-vs-elevated-planter.md", "raised-bed-vs-elevated-planter", ["elevated planter", "raised vegetable bed", "planter box"]],
  [17, "17-raised-bed-dries-out-fast.md", "raised-bed-dries-out-fast", ["raised garden bed", "garden mulch", "watering vegetable garden"]],
  [18, "18-grow-bags-vs-plastic-pots.md", "grow-bags-vs-plastic-pots", ["grow bag gardening", "container garden", "plant pots"]],
  [19, "19-why-does-my-compost-smell.md", "why-does-my-compost-smell", ["garden compost bin", "compost pile", "home composting"]],
  [20, "20-single-vs-dual-chamber-compost-tumbler.md", "single-vs-dual-chamber-compost-tumbler", ["compost tumbler", "compost bin", "garden compost"]],
  [21, "21-bypass-vs-anvil-pruners.md", "bypass-vs-anvil-pruners", ["pruning shears", "secateurs", "garden pruner"]],
  [22, "22-loppers-vs-pruning-saw.md", "loppers-vs-pruning-saw", ["loppers", "pruning saw", "tree pruning tools"]],
  [23, "23-clean-sharpen-pruning-shears.md", "clean-sharpen-pruning-shears", ["pruning shears", "sharpening garden tools", "secateurs"]],
  [24, "24-wheelbarrow-vs-garden-cart.md", "wheelbarrow-vs-garden-cart", ["wheelbarrow", "garden cart", "garden wagon"]],
  [25, "25-choose-battery-lawn-tool-system.md", "choose-battery-lawn-tool-system", ["cordless garden tools", "battery lawn mower", "string trimmer"]],
];

const creditCsv = await fs.readFile(path.join(sourceRoot, "image-credits.csv"), "utf8");
const creditLines = creditCsv.replace(/^\uFEFF/, "").split(/\r?\n/).slice(1).filter(Boolean);

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { value += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { values.push(value); value = ""; }
    else value += char;
  }
  values.push(value);
  return values;
}

const suppliedCredits = new Map(creditLines.map((line) => {
  const [article, imageUrl, caption, creator, license, licenseUrl, sourcePage] = parseCsvLine(line);
  return [Number(article), { imageUrl, caption, creator, license, licenseUrl, sourcePage }];
}));

const allowedLicense = /^(CC0|Public domain|CC BY(?:-SA)?(?: |$))/i;
const usedTitles = new Set();
const allCredits = [];

async function commonsSearch(query) {
  const params = new URLSearchParams({
    action: "query", format: "json", origin: "*", generator: "search",
    gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "20",
    prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1280",
  });
  let json;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "GardeningIsEzeeContentImporter/1.0 (https://www.gardeningisezee.com/contact)" },
    });
    if (response.ok) {
      json = await response.json();
      break;
    }
    if (response.status !== 429 || attempt === 5) throw new Error(`Commons search failed: ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 4000));
  }
  return Object.values(json.query?.pages ?? {}).filter((page) => {
    const info = page.imageinfo?.[0];
    const license = info?.extmetadata?.LicenseShortName?.value ?? "";
    return info?.thumburl && allowedLicense.test(license) && !usedTitles.has(page.title);
  });
}

function cleanHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();
}

async function download(url, destination) {
  try {
    const existing = await fs.stat(destination);
    if (existing.size > 1024) return;
  } catch {}
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "GardeningIsEzeeContentImporter/1.0 (https://www.gardeningisezee.com/contact)" },
    });
    if (response.ok) {
      await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (response.status !== 429 || attempt === 5) throw new Error(`Image download failed ${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
  }
}

for (const [number, filename, slug, queries] of articles) {
  let markdown = await fs.readFile(path.join(sourceRoot, filename), "utf8");
  markdown = markdown.replace(/https:\/\/www\.gardeningisezee\.com\//g, "/");
  const supplied = suppliedCredits.get(number);
  const selected = [];

  if (supplied) {
    const ext = ".jpg";
    const localName = `${slug}-01${ext}`;
    await download(supplied.imageUrl, path.join(imageDir, localName));
    selected.push({ ...supplied, localName });
  }

  for (const query of queries) {
    const candidates = await commonsSearch(query);
    for (const page of candidates) {
      if (selected.length >= 3) break;
      usedTitles.add(page.title);
      const info = page.imageinfo[0];
      const meta = info.extmetadata ?? {};
      const extension = /png/i.test(info.mime) ? ".png" : ".jpg";
      const localName = `${slug}-${String(selected.length + 1).padStart(2, "0")}${extension}`;
      await download(info.thumburl, path.join(imageDir, localName));
      selected.push({
        localName,
        caption: cleanHtml(meta.ImageDescription?.value) || page.title.replace(/^File:/, "").replace(/_/g, " "),
        creator: cleanHtml(meta.Artist?.value) || "Wikimedia Commons contributor",
        license: cleanHtml(meta.LicenseShortName?.value) || "See source",
        licenseUrl: meta.LicenseUrl?.value || "",
        sourcePage: meta.DescriptionUrl?.value || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
      });
    }
    if (selected.length >= 3) break;
  }
  if (selected.length < 3) throw new Error(`Only found ${selected.length} usable images for ${slug}`);

  markdown = markdown.replace(/^!\[[^\]]*\]\([^)]+\)\n(?:\n)?\*[^\n]*\*\n?/m, "");
  const headings = [...markdown.matchAll(/^## .+$/gm)];
  const placements = [Math.max(1, Math.floor(headings.length / 4)), Math.max(2, Math.floor(headings.length / 2)), Math.max(3, Math.floor(headings.length * 3 / 4))];
  const inserts = selected.map((image, index) => {
    const creditLink = image.licenseUrl ? `[${image.license}](${image.licenseUrl})` : image.license;
    return `\n![${image.caption}](/images/informational/additional/${image.localName})\n\n*${image.caption} Photo: [${image.creator}](${image.sourcePage}), ${creditLink} via Wikimedia Commons.*\n\n`;
  });
  for (let i = placements.length - 1; i >= 0; i--) {
    const point = headings[placements[i]]?.index ?? markdown.length;
    markdown = markdown.slice(0, point) + inserts[i] + markdown.slice(point);
  }
  await fs.writeFile(path.join(contentDir, filename), markdown);
  for (const image of selected) allCredits.push({ article: number, slug, ...image });
}

await fs.writeFile(path.join(imageDir, "credits.json"), JSON.stringify(allCredits, null, 2) + "\n");
console.log(`Imported ${articles.length} articles and ${allCredits.length} licensed images.`);
