import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/desk-setup-essentials";
const srcDir = join(__dirname, "../design/blog image/Desk Setup Essentials — 15 Sản Phẩm");
const images = [
  "01-voncerus-led-clamp-desk-lamp.webp",
  "02-quntis-monitor-light-bar.webp",
  "03-bamboo-monitor-riser-with-drawer.webp",
  "04-lamicall-foldable-laptop-stand.webp",
  "05-nordik-felt-leather-desk-mat.webp",
  "06-cinati-under-desk-cable-tray.webp",
  "07-austor-adhesive-cable-clips.webp",
  "08-comix-mesh-desk-organizer.webp",
  "09-mdesign-bamboo-drawer-organizer.webp",
  "10-anker-7-port-powered-usb-hub.webp",
  "11-anker-powerport-6-desktop-charger.webp",
  "12-elevation-lab-under-desk-headphone-hook.webp",
  "13-comfilife-memory-foam-footrest.webp",
  "14-funarty-artificial-succulents.webp",
  "15-kadams-pomodoro-cube-timer.webp",
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
