import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/ergonomic-desk-setup";
const srcDir = join(__dirname, "../design/blog image/Ergonomic Desk Setup");
const images = [
  "01-monitor-riser-with-storage-shelf.webp",
  "02-dual-monitor-articulating-arm.webp",
  "03-foldable-aluminum-laptop-stand.webp",
  "04-memory-foam-footrest.webp",
  "05-desk-mat-35x17.webp",
  "06-monitor-light-bar.webp",
  "07-wide-angle-desk-lamp-auto-dimming.webp",
];
for (const f of images) {
  const res = await fetch(`${SB}/storage/v1/object/${BUCKET}/${FOLDER}/${f}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: readFileSync(join(srcDir, f)),
  });
  console.log(res.ok ? `OK  ${f}` : `FAIL ${f}: ${await res.text()}`);
}
console.log("Done.");
