import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const replacements = [
  ["12-water-outdoor-potted-plants-vacation.md", 2, "Outdoor potted plants grouped together for easier watering while the owner is away.", "Jules Verne Times Two", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Detail_of_potted_plants,_Port_of_Evdilos,_Ikaria,_Greece_julesvernex2-2.jpg"],
  ["12-water-outdoor-potted-plants-vacation.md", 3, "A close view of outdoor container plants with different pot sizes and exposures.", "Jules Verne Times Two", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Detail_of_potted_plants,_Port_of_Evdilos,_Ikaria,_Greece_julesvernex2.jpg"],
  ["16-raised-bed-vs-elevated-planter.md", 2, "A raised vegetable bed connected to the ground below.", "Kerstin Namuth", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Raised_vegetable_bed_1.jpg"],
  ["16-raised-bed-vs-elevated-planter.md", 3, "A raised vegetable bed showing the usable growing area and working height.", "Kerstin Namuth", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Raised_vegetable_bed_3.jpg"],
  ["18-grow-bags-vs-plastic-pots.md", 2, "Plants growing in portable containers during an agricultural demonstration.", "U.S. Department of Agriculture", "Public domain", "", "https://commons.wikimedia.org/wiki/File:20120824-DM-LSC-9004_(8827303164).jpg"],
  ["18-grow-bags-vs-plastic-pots.md", 3, "Outdoor container plants illustrate how pot size and material affect placement and watering.", "Jules Verne Times Two", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Detail_of_potted_plants,_Port_of_Evdilos,_Ikaria,_Greece_julesvernex2-2.jpg"],
  ["22-loppers-vs-pruning-saw.md", 3, "A pruning saw designed to cut branches that are too large or awkward for loppers.", "Simon A. Eugster", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "https://commons.wikimedia.org/wiki/File:Astsäge.jpg"],
  ["25-choose-battery-lawn-tool-system.md", 2, "A cordless lawn mower is one of the highest-demand tools in a shared battery platform.", "Famartin", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:2022-06-08_08_38_52_A_Greenworks_40V_21-Inch_Brushless_Self-Propelled_Mower_(6AH_Battery_and_Charger_Included,_M-210-SP)_along_Aquetong_Lane_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg"],
];

for (const [file, number, caption, creator, license, licenseUrl, sourcePage] of replacements) {
  const filePath = path.join(root, "public/content/informational", file);
  let markdown = await fs.readFile(filePath, "utf8");
  const slug = file.replace(/^\d+-|\.md$/g, "");
  const localName = `${slug}-0${number}.jpg`;
  const licenseLink = licenseUrl ? `[${license}](${licenseUrl})` : license;
  const block = `![${caption}](/images/informational/additional/${localName})\n\n*${caption} Photo: [${creator}](${sourcePage}), ${licenseLink} via Wikimedia Commons.*`;
  const expression = new RegExp(`!\\[[\\s\\S]*?\\]\\(/images/informational/additional/${slug}-0${number}\\.jpg\\)\\n\\n\\*[\\s\\S]*? via Wikimedia Commons\\.\\*`);
  if (!expression.test(markdown)) throw new Error(`Image block not found: ${file} #${number}`);
  markdown = markdown.replace(expression, block);
  await fs.writeFile(filePath, markdown);
}

const creditsPath = path.join(root, "public/images/informational/additional/credits.json");
const credits = JSON.parse(await fs.readFile(creditsPath, "utf8"));
for (const [file, number, caption, creator, license, licenseUrl, sourcePage] of replacements) {
  const slug = file.replace(/^\d+-|\.md$/g, "");
  const credit = credits.find((item) => item.localName === `${slug}-0${number}.jpg`);
  if (!credit) throw new Error(`Credit not found: ${slug} #${number}`);
  Object.assign(credit, { caption, creator, license, licenseUrl, sourcePage });
}
await fs.writeFile(creditsPath, `${JSON.stringify(credits, null, 2)}\n`);
