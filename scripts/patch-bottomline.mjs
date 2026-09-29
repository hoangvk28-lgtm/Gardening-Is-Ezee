// patch-bottomline.mjs — fixes product name + verdict text in Bottom Line sections
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(__dirname, "../app/(site)/guide");

// Each entry: slug, newAnchor (already set), oldName (wrong name currently in file), newName, oldVerdict, newVerdict
const fixes = [
  {
    slug: "best-vertical-laptop-stands",
    anchor: "omoton-single",
    oldNameVerdict: `>Soundance Aluminum Vertical Laptop Stand</a>\n                 - 14,892 reviews at 4.5 stars, most reviewed vertical laptop stand.`,
    newNameVerdict: `>OMOTON Aluminum Vertical Laptop Stand</a>\n                 - 4.8 stars, lifetime warranty and widest adjustment range in this roundup.`,
  },
  {
    slug: "best-vertical-macbook-stands",
    anchor: "omoton-single",
    oldNameVerdict: `>Twelve South BookArc for MacBook</a>\n                 - 3,241 reviews at 4.6 stars, highest-rated vertical MacBook stand.`,
    newNameVerdict: `>OMOTON Aluminum Vertical Laptop Stand</a>\n                 - 4.8 stars, lifetime warranty and universal fit for all MacBook models.`,
  },
  {
    slug: "best-dual-vertical-laptop-stands",
    anchor: "omoton-double",
    oldNameVerdict: `>OMOTON Dual Vertical Laptop Stand</a>\n                 - 9,341 reviews at 4.4 stars, most reviewed dual vertical stand.`,
    newNameVerdict: `>OMOTON Dual Aluminum Vertical Laptop Stand</a>\n                 - 4.8 stars, two independent adjustable slots and lifetime warranty.`,
  },
  {
    slug: "best-adjustable-vertical-laptop-stands",
    anchor: "omoton-single",
    oldNameVerdict: `>Soundance Adjustable Vertical Laptop Stand</a>\n                 - 14,892 reviews at 4.5 stars, most reviewed adjustable vertical stand.`,
    newNameVerdict: `>OMOTON Aluminum Vertical Laptop Stand</a>\n                 - 4.8 stars, 0.55 to 2.71 inch adjustment range covering all consumer laptop thicknesses.`,
  },
  {
    slug: "best-vertical-laptop-stands-for-desk-setup",
    anchor: "omoton-single",
    oldNameVerdict: `>Soundance Aluminum Vertical Laptop Stand</a>\n                 - 14,892 reviews at 4.5 stars, most reviewed aluminum vertical stand.`,
    newNameVerdict: `>OMOTON Aluminum Vertical Laptop Stand</a>\n                 - 4.8 stars, lifetime warranty and the cleanest aluminum profile for minimal desk setups.`,
  },
  {
    slug: "best-lap-desks-for-bed",
    anchor: "saiji-xl",
    oldNameVerdict: `>LapGear Home Office Lap Desk</a>\n                 - 18,432 reviews at 4.5 stars, most reviewed lap desk for bed use.`,
    newNameVerdict: `>SAIJI X-Large Adjustable Lap Desk</a>\n                 - 4.7 stars, five heights plus four angles for every in-bed working position.`,
  },
  {
    slug: "best-lap-desks-with-cushion",
    anchor: "lapgear-home-office-pro",
    oldNameVerdict: `>LapGear Home Office Lap Desk with Cushion</a>\n                 - 18,432 reviews at 4.5 stars, most reviewed cushion lap desk.`,
    newNameVerdict: `>LapGear Home Office Pro Lap Desk</a>\n                 - 4.7 stars, integrated mouse pad and dual bolster cushion base.`,
  },
  {
    slug: "best-lap-desks-for-laptops",
    anchor: "lapgear-home-office-pro",
    oldNameVerdict: `>LapGear Home Office Lap Desk</a>\n                 - 18,432 reviews at 4.5 stars, most reviewed lap desk for laptop use.`,
    newNameVerdict: `>LapGear Home Office Pro Lap Desk</a>\n                 - 4.7 stars, hard surface with integrated mouse pad and dual bolster cushion.`,
  },
];

for (const f of fixes) {
  const filePath = join(PAGES_DIR, f.slug, "page.tsx");
  let src = readFileSync(filePath, "utf8");

  if (src.includes(f.oldNameVerdict)) {
    src = src.replace(f.oldNameVerdict, f.newNameVerdict);
    console.log(`[${f.slug}] fixed name+verdict`);
  } else if (src.includes(f.newNameVerdict)) {
    console.log(`[${f.slug}] already fixed`);
  } else {
    // Try a looser match: find anything between the anchor href and </a>
    const anchorPrefix = `href="#${f.anchor}" className="font-bold text-ink hover:text-brand transition-colors">`;
    const oldIdx = src.indexOf(anchorPrefix);
    if (oldIdx !== -1) {
      const closeIdx = src.indexOf("</a>", oldIdx);
      const lineEndIdx = src.indexOf("\n", closeIdx);
      const oldFull = src.substring(oldIdx + anchorPrefix.length, lineEndIdx);
      console.log(`[${f.slug}] loose match found: "${oldFull.substring(0, 100)}"`);
      // Replace from name start to end of verdict line
      const namePart = src.substring(oldIdx + anchorPrefix.length, closeIdx);
      const afterClose = src.substring(closeIdx, lineEndIdx);
      const oldSection = namePart + afterClose;
      // Extract new name and verdict from newNameVerdict
      const newNameEnd = f.newNameVerdict.indexOf("</a>");
      const newName = f.newNameVerdict.substring(1, newNameEnd); // skip leading >
      const newVerdict = f.newNameVerdict.substring(newNameEnd + 4); // after </a>
      const newSection = newName + "</a>" + newVerdict;
      src = src.substring(0, oldIdx + anchorPrefix.length) + newSection + src.substring(lineEndIdx);
      console.log(`  -> replaced with: "${newSection.substring(0, 80)}"`);
    } else {
      console.warn(`[${f.slug}] WARNING: could not find anchor #${f.anchor}`);
    }
  }

  writeFileSync(filePath, src, "utf8");
}

console.log("done");
