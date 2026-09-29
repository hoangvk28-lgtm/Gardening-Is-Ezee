import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/small-desk-setup";
const srcDir = join(__dirname, "../design/blog image/Small Desk Setup Ideas");
const images = [
  "01-clamp-desk-lamp.webp",
  "02-monitor-light-bar.webp",
  "03-monitor-stand.webp",
  "04-laptop-stand.webp",
  "05-desk-mat.webp",
  "06-cable-tray.webp",
  "07-cable-clips.webp",
  "08-desk-organizer.webp",
  "09-usb-hub.webp",
  "10-footrest.webp",
  "11-headphone-hook.webp",
  "12-artificial-succulents.webp",
  "13-rolling-cart.webp",
  "14-pegboard.webp",
  "15-desktop-shelf.webp",
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
