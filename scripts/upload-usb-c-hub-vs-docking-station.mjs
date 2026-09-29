import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/usb-c-hub-vs-docking-station";
const srcDir = join(__dirname, "../design/blog image/usb-c-hub-vs-docking-station-webp");
const images = [
  "06-usb-c-hub-vs-docking-station-hero.webp",
  "01-anker-341-hub-7-in-1.webp",
  "02-anker-555-hub-8-in-1.webp",
  "03-anker-575-dock-13-in-1.webp",
  "04-anker-575-hub-12-in-1-triple-display.webp",
  "05-anker-7-in-1-travel-hub.webp",
];
for (const f of images) {
  const res = await fetch(`${SB}/storage/v1/object/${BUCKET}/${FOLDER}/${f}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: readFileSync(join(srcDir, f)),
  });
  console.log(res.ok ? `OK  ${f}` : `FAIL ${f}: ${await res.text()}`);
}
