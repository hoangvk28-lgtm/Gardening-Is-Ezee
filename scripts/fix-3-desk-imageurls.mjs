import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_PATH = "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\data\\guides";

// Map CDN image code → local filename (without .jpg)
const replacements = {
  "best-corner-standing-desk": {
    "71vlFqe7+iL": "fezibo-l-shaped-corner",
    "719-sAd25AL": "vivo-corner-standing-desk",
    "61ve8iAp3kL": "flexispot-e7l-corner",
    "81hRNILWT4L": "flexispot-ek5l-corner",
    "71tE4RDzEzL": "siago-corner-standing-desk",
    "81-6StF8zYL": "offico-corner-standing-desk",
    "81JQN0EnNgL": "acrolix-corner-standing-desk",
    "81UoYyaTcNL": "fezibo-triple-motor-corner",
  },
  "best-standing-desk-for-dual-monitors": {
    "71ZMU5EPuZL": "desktronic-dual-monitor",
    "819pj+V8QcL": "shw-dual-monitor",
    "71KwCPJpoAL": "flexispot-en1-maple",
    "61u2kVQis8L": "vivo-dual-monitor-desk",
    "71jwqC-hN5L": "fezibo-dual-monitor",
    "71G57ucOZtL": "flexispot-e6-bamboo-dual",
    "71DIMqM35kL": "uplift-v3-dual-monitor",
    "718Z9N7RgML": "shw-62-dual-monitor",
  },
  "best-standing-desk-48-inch": {
    "718KkXOCktL": "ergear-48-inch",
    "61qYqlizh2L": "flexispot-en1-48",
    // 71KwCPJpoAL already used above but that's different guide
    "71GjWLqbuUL": "flexispot-en2-48",
    "71MTvT27CuL": "flexispot-comhar-48",
    "617iLezWHYL": "vivo-48-inch",
    "71smFjr2QgL": "fezibo-48-inch",
    "71CfxsqVXmL": "huanuo-48-inch",
  },
};

// For 48-inch, the flexispot-en1-maple-48 has same CDN code as dual-monitors (71KwCPJpoAL)
// Handle it separately
const extra48 = {
  "71KwCPJpoAL": "flexispot-en1-maple-48",
};

for (const [slug, map] of Object.entries(replacements)) {
  const filePath = resolve(BASE_PATH, `${slug}.ts`);
  let content = readFileSync(filePath, "utf8");
  let count = 0;

  const useMap = slug === "best-standing-desk-48-inch" ? { ...map, ...extra48 } : map;

  for (const [code, localName] of Object.entries(useMap)) {
    // Match the full CDN URL containing this image code
    const regex = new RegExp(`imageUrl: "https://m\\.media-amazon\\.com/images/I/${code.replace(/[+]/g, "\\+")}\\._AC_[^"]*"`, "g");
    const replacement = "imageUrl: `${BASE}/" + localName + ".jpg`";
    const before = content;
    content = content.replace(regex, replacement);
    if (content !== before) count++;
  }

  writeFileSync(filePath, content, "utf8");
  console.log(`✓ ${slug}: ${count} imageUrls updated to local paths`);
}

console.log("\nDone.");
