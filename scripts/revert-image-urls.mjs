import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const BASE_PATH = "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\data\\guides";
const PUBLIC_PATH = "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\public\\images\\guides";

// Guides that have local product images downloaded
const guidesWithLocalImages = [
  "best-glass-standing-desk",
  "best-standing-desk-under-1000",
];

for (const slug of guidesWithLocalImages) {
  const filePath = resolve(BASE_PATH, `${slug}.ts`);
  let content = readFileSync(filePath, "utf8");

  // Find all product id values and replace the next imageUrl with local path
  // Pattern: id: "some-id", then later imageUrl: "https://..."
  // We'll match each product block and replace imageUrl based on id

  let updatedCount = 0;

  // Match each product entry: find id then imageUrl
  content = content.replace(
    /id:\s*"([^"]+)",[\s\S]*?imageUrl:\s*"https:\/\/m\.media-amazon\.com\/[^"]+"/g,
    (match, id) => {
      const localPath = `/images/guides/${slug}/${id}.jpg`;
      const diskPath = resolve(PUBLIC_PATH, slug, `${id}.jpg`);
      if (!existsSync(diskPath)) {
        console.log(`  MISSING: ${diskPath}`);
        return match; // don't replace if file doesn't exist
      }
      updatedCount++;
      return match.replace(
        /imageUrl:\s*"https:\/\/m\.media-amazon\.com\/[^"]+"/,
        `imageUrl: \`\${BASE}/${id}.jpg\``
      );
    }
  );

  writeFileSync(filePath, content, "utf8");
  console.log(`✓ ${slug}: ${updatedCount} images reverted to local paths`);
}

console.log("\nDone.");
