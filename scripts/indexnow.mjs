/**
 * Reusable IndexNow submitter. Notifies Bing + Yandex about new/changed URLs.
 *
 * Usage:
 *   node scripts/indexnow.mjs <slug1> <slug2> ...        # submit specific guide slugs
 *   node scripts/indexnow.mjs --auto                      # auto-detect from the last git commit
 *   node scripts/indexnow.mjs --auto --since=HEAD~5        # auto-detect since a specific ref
 *
 * Rate limit: 10,000 URLs/day (well above this site's publishing volume).
 */
import { execSync } from "child_process";

const HOST = "www.deskfinds.com";
const KEY = "a7c91f60c6ae407994153f996878409e";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

function slugsFromGitDiff(sinceRef) {
  const range = sinceRef ?? "HEAD~1";
  let diffOutput;
  try {
    diffOutput = execSync(`git diff --name-status ${range} HEAD`, { encoding: "utf-8" });
  } catch (e) {
    console.error(`Could not diff against ${range}, falling back to last commit only.`);
    diffOutput = execSync(`git show --name-status --format="" HEAD`, { encoding: "utf-8" });
  }

  const slugs = new Set();
  for (const line of diffOutput.split("\n")) {
    const match = line.match(/^[AM]\s+data\/guides\/(.+)\.ts$/);
    if (match) slugs.add(match[1]);
    const pageMatch = line.match(/^[AM]\s+app\/\(site\)\/guide\/(.+)\/page\.tsx$/);
    if (pageMatch) slugs.add(pageMatch[1]);
  }
  return [...slugs];
}

const args = process.argv.slice(2);
const isAuto = args.includes("--auto");
const sinceArg = args.find((a) => a.startsWith("--since="));
const sinceRef = sinceArg ? sinceArg.split("=")[1] : undefined;

let guideSlugs;
if (isAuto) {
  guideSlugs = slugsFromGitDiff(sinceRef);
  console.log(`Auto-detected ${guideSlugs.length} changed guide(s) from git diff.`);
} else {
  guideSlugs = args.filter((a) => !a.startsWith("--"));
}

if (guideSlugs.length === 0) {
  console.log("No guide URLs to submit. Exiting without pinging IndexNow.");
  process.exit(0);
}

const urlList = guideSlugs.map((s) => `https://${HOST}/guide/${s}`);

console.log(`Pinging IndexNow with ${urlList.length} URL(s):`);
for (const u of urlList) console.log(`  ${u}`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

if (res.ok) {
  console.log(`OK IndexNow accepted -- HTTP ${res.status}`);
  console.log(`  ${urlList.length} URL(s) submitted to Bing + Yandex`);
} else {
  const body = await res.text();
  console.error(`FAILED IndexNow rejected -- HTTP ${res.status}: ${body}`);
  process.exit(1);
}
