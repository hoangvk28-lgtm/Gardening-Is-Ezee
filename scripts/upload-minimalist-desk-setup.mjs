import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/minimalist-desk-setup";
const srcDir = join(__dirname, "../design/blog image/Minimalist Desk Setup");
const images = [
  "01-desk-mat.webp",
  "02-minimal-organizer.webp",
  "03-cable-tray.webp",
  "04-wireless-charger.webp",
  "05-slim-keyboard.webp",
  "06-compact-mouse.webp",
  "07-monitor-stand.webp",
  "08-monitor-light-bar.webp",
  "09-headphone-hook.webp",
  "10-minimal-decor.webp",
  "11-hero-image.webp",
  "12-product-essentials-flat-lay.webp",
  "13-cable-management-editorial.webp",
  "14-small-desk-minimalist-setup.webp",
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
