// patch-pages-v3.mjs — adds buying criteria section + fixes Bottom Line in 9 page.tsx files
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(__dirname, "../app/(site)/guide");

// buying criteria JSX block to insert (uses {buyingCriteria} from import)
const BC_SECTION = `
        {buyingCriteria.length > 0 && (
          <section className="mb-12 p-6 rounded-2xl border border-border bg-white">
            <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">How to Choose the Right One</h2>
            <p className="text-sm text-ink-muted mb-5">Key buying criteria so you get the right fit the first time.</p>
            <div className="divide-y divide-border">
              {buyingCriteria.map((item, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-bold text-ink mb-1">{item.criterion}</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

`;

// per-guide patches: slug, old bottom-line anchor/name, new anchor/name/verdict
const patches = [
  {
    slug: "best-under-desk-footrests",
    oldAnchor: "everlasting-comfort",
    oldName: "Everlasting Comfort Foot Rest Cushion",
    oldVerdict: " - 22,247 reviews at 4.5 stars, most reviewed under-desk footrest in the category.",
    newAnchor: "everlasting-comfort",
    newName: "Everlasting Comfort Foot Rest Cushion",
    newVerdict: " - 4.6 stars, dual-mode stationary and rocking memory foam footrest.",
  },
  {
    slug: "best-vertical-laptop-stands",
    oldAnchor: "soundance-main",
    oldName: "Soundance Aluminum Vertical Laptop Stand",
    oldVerdict: " - 14,892 reviews at 4.5 stars, most reviewed vertical laptop stand.",
    newAnchor: "omoton-single",
    newName: "OMOTON Aluminum Vertical Laptop Stand",
    newVerdict: " - 4.8 stars, lifetime warranty and widest adjustment range in this roundup.",
  },
  {
    slug: "best-vertical-macbook-stands",
    oldAnchor: "twelve-south-bookarc",
    oldName: "Twelve South BookArc for MacBook",
    oldVerdict: " - 3,241 reviews at 4.6 stars, highest-rated vertical MacBook stand.",
    newAnchor: "omoton-single",
    newName: "OMOTON Aluminum Vertical Laptop Stand",
    newVerdict: " - 4.8 stars, lifetime warranty and universal fit for all MacBook models.",
  },
  {
    slug: "best-dual-vertical-laptop-stands",
    oldAnchor: "omoton-dual",
    oldName: "OMOTON Dual Vertical Laptop Stand",
    oldVerdict: " - 9,341 reviews at 4.4 stars, most reviewed dual vertical stand.",
    newAnchor: "omoton-double",
    newName: "OMOTON Dual Aluminum Vertical Laptop Stand",
    newVerdict: " - 4.8 stars, two independent adjustable slots and lifetime warranty.",
  },
  {
    slug: "best-adjustable-vertical-laptop-stands",
    oldAnchor: "soundance-adjustable",
    oldName: "Soundance Adjustable Vertical Laptop Stand",
    oldVerdict: " - 14,892 reviews at 4.5 stars, most reviewed adjustable vertical stand.",
    newAnchor: "omoton-single",
    newName: "OMOTON Aluminum Vertical Laptop Stand",
    newVerdict: " - 4.8 stars, 0.55 to 2.71 inch adjustment range covering all consumer laptop thicknesses.",
  },
  {
    slug: "best-vertical-laptop-stands-for-desk-setup",
    oldAnchor: "soundance-desk-setup",
    oldName: "Soundance Aluminum Vertical Laptop Stand",
    oldVerdict: " - 14,892 reviews at 4.5 stars, most reviewed aluminum vertical stand.",
    newAnchor: "omoton-single",
    newName: "OMOTON Aluminum Vertical Laptop Stand",
    newVerdict: " - 4.8 stars, lifetime warranty and the cleanest aluminum profile for minimal desk setups.",
  },
  {
    slug: "best-lap-desks-for-bed",
    oldAnchor: "lapgear-home-office",
    oldName: "LapGear Home Office Lap Desk",
    oldVerdict: " - 18,432 reviews at 4.5 stars, most reviewed lap desk for bed use.",
    newAnchor: "saiji-xl",
    newName: "SAIJI X-Large Adjustable Lap Desk",
    newVerdict: " - 4.7 stars, five heights plus four angles for every in-bed working position.",
  },
  {
    slug: "best-lap-desks-with-cushion",
    oldAnchor: "lapgear-home-office-cushion",
    oldName: "LapGear Home Office Lap Desk with Cushion",
    oldVerdict: " - 18,432 reviews at 4.5 stars, most reviewed cushion lap desk.",
    newAnchor: "lapgear-home-office-pro",
    newName: "LapGear Home Office Pro Lap Desk",
    newVerdict: " - 4.7 stars, integrated mouse pad and dual bolster cushion base.",
  },
  {
    slug: "best-lap-desks-for-laptops",
    oldAnchor: "lapgear-home-office-laptop",
    oldName: "LapGear Home Office Lap Desk",
    oldVerdict: " - 18,432 reviews at 4.5 stars, most reviewed lap desk for laptop use.",
    newAnchor: "lapgear-home-office-pro",
    newName: "LapGear Home Office Pro Lap Desk",
    newVerdict: " - 4.7 stars, hard surface with integrated mouse pad and dual bolster cushion.",
  },
];

for (const p of patches) {
  const filePath = join(PAGES_DIR, p.slug, "page.tsx");
  let src = readFileSync(filePath, "utf8");

  // 1. Add buyingCriteria to import (after "relatedGuides,")
  if (!src.includes("buyingCriteria,")) {
    src = src.replace(
      /  relatedGuides,\n  type GuideProduct,/,
      "  relatedGuides,\n  buyingCriteria,\n  type GuideProduct,"
    );
    console.log(`  [${p.slug}] added buyingCriteria import`);
  } else {
    console.log(`  [${p.slug}] buyingCriteria import already present`);
  }

  // 2. Insert buying criteria section before the jump-to-pick nav
  const NAV_MARKER = '\n        <nav className="mb-12 p-4 rounded-xl bg-bg border border-border">';
  if (!src.includes("How to Choose the Right One")) {
    if (src.includes(NAV_MARKER)) {
      src = src.replace(NAV_MARKER, BC_SECTION + NAV_MARKER);
      console.log(`  [${p.slug}] inserted buying criteria section`);
    } else {
      console.warn(`  [${p.slug}] WARNING: nav marker not found, skipping buying criteria insert`);
    }
  } else {
    console.log(`  [${p.slug}] buying criteria section already present`);
  }

  // 3. Fix Bottom Line anchor + product name + verdict
  const OLD_LINK = `href="#${p.oldAnchor}" className="font-bold text-ink hover:text-brand transition-colors">${p.oldName}</a>${p.oldVerdict}`;
  const NEW_LINK = `href="#${p.newAnchor}" className="font-bold text-ink hover:text-brand transition-colors">${p.newName}</a>${p.newVerdict}`;
  if (src.includes(OLD_LINK)) {
    src = src.replace(OLD_LINK, NEW_LINK);
    console.log(`  [${p.slug}] fixed Bottom Line product reference`);
  } else if (src.includes(`href="#${p.newAnchor}"`)) {
    console.log(`  [${p.slug}] Bottom Line already updated`);
  } else {
    console.warn(`  [${p.slug}] WARNING: Bottom Line old link not found — may need manual fix`);
    // Try partial match on anchor only
    const OLD_ANCHOR_ONLY = `href="#${p.oldAnchor}"`;
    if (src.includes(OLD_ANCHOR_ONLY)) {
      src = src.replace(OLD_ANCHOR_ONLY, `href="#${p.newAnchor}"`);
      console.log(`    partial fix: replaced anchor only`);
    }
  }

  writeFileSync(filePath, src, "utf8");
  console.log(`[${p.slug}] done`);
}

console.log("\nAll patches applied.");
