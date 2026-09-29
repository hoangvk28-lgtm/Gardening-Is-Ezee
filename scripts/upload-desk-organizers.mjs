import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-charging-station-desk-organizers";
const srcDir = join(__dirname, "../design/blog image/bai-5-best-charging-station-desk-organizers-7-webp-images");
const images = [
  "07-hero-best-charging-station-desk-organizers.webp",
  "01-satechi-7-port-plus-organizer.webp",
  "02-ladstag-15w-wireless-organizer.webp",
  "03-bestek-8-port-with-dividers.webp",
  "04-pout-h3-splitmax-charging-mat.webp",
  "05-topmade-4-slot-wireless-organizer.webp",
  "06-soopii-6-port-usb-organizer.webp",
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
