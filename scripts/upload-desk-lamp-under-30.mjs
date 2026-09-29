import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-desk-lamp-under-30";
const srcDir = join(__dirname, "../design/blog image/best-desk-lamp-under-30-6-webp-images");
const images = [
  "06-hero-best-desk-lamp-under-30.webp",
  "01-best-overall-lepro-led-desk-lamp.webp",
  "02-best-clamp-ivict-56-led-clip-desk-light.webp",
  "03-best-with-usb-charging-led-desk-lamp-dual-usb-hub.webp",
  "04-best-for-dorm-ivict-gooseneck-clamp-27-mode.webp",
  "05-best-budget-under-20-le-dimmable-7-level-led.webp",
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
