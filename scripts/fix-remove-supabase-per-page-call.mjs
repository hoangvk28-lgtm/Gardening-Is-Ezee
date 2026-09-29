import fs from "fs";
import { execSync } from "child_process";

const files = execSync('grep -rl "getPublicGuideBySlug" "app/(site)/guide"', { encoding: "utf8", maxBuffer: 1024 * 1024 * 50 })
  .trim()
  .split("\n")
  .filter(Boolean);

let fixed = 0;
let skipped = [];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const hadCRLF = content.includes("\r\n");
  if (hadCRLF) content = content.replace(/\r\n/g, "\n");

  const before = content;

  // Remove the import line
  content = content.replace(/import \{ getPublicGuideBySlug \} from "@\/lib\/public-guides";\n/, "");

  // Replace `const <var> = await getPublicGuideBySlug("...");\n  const <heroVar> =\n?  <var>?.thumbnailImage ?? ...;`
  // Handles both `??` and `||` chains, single-line or wrapped across two lines.
  content = content.replace(
    /const (\w+) = await getPublicGuideBySlug\("[^"]*"\);\n\s*const (\w+) =\n?\s*\1\?\.[^;]*;\n/,
    (match, guideVar, heroVar) => `const ${heroVar} = fallbackHeroImage;\n`
  );

  if (content === before) {
    skipped.push(file);
    continue;
  }

  if (hadCRLF) content = content.replace(/\n/g, "\r\n");
  fs.writeFileSync(file, content);
  fixed++;
}

console.log(`Fixed ${fixed}/${files.length} files.`);
if (skipped.length) {
  console.log("SKIPPED (needs manual check):", skipped.length);
  console.log(skipped.join("\n"));
}
