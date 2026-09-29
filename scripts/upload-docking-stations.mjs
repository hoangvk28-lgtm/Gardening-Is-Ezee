import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-docking-stations-for-desk-setup";
const srcDir = join(__dirname, "../design/blog image/bai-6-best-docking-stations-for-desk-setup-7-webp-images");
const images = [
  "07-hero-bai-6-best-docking-stations-for-desk-setup.webp",
  "01-anker-777-thunderbolt-4-12-in-1.webp",
  "02-caldigit-ts4-thunderbolt-4.webp",
  "03-wavlink-tb4-triple-display-96w.webp",
  "04-plugable-usb4-dual-hdmi-100w.webp",
  "05-anker-8-in-1-usb-c-hub-85w.webp",
  "06-caldigit-ts5-plus-thunderbolt-5.webp",
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
