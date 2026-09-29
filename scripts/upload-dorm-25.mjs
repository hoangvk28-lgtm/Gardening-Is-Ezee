import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/25-best-dorm-items-under-25";
const srcDir = join(__dirname, "../design/blog image/deskfinds-25-images-webp");
const images = [
  "1-anker-power-strip-6ac-4usb.webp","2-nuozhi-wall-outlet-extender.webp",
  "3-addtam-led-lamp-power-strip.webp","4-d-line-cable-box-small-black.webp",
  "5-waterproof-twin-xl-mattress-protector.webp","6-ginimax-bedside-caddy-23x12.webp",
  "7-room-essentials-organizer-tote.webp","8-ciieeo-bunk-bed-shelf-hooks-2-pack.webp",
  "9-magicteam-white-noise-machine.webp","10-command-shower-caddy.webp",
  "11-command-bath-multi-hook.webp","12-command-caddy-hanger-7.5lb.webp",
  "13-amazon-basics-velvet-hangers-50-pack.webp","14-zober-velvet-hangers-50-pack.webp",
  "15-onlyeasy-under-bed-shoe-storage-2-pack.webp","16-under-bed-shoe-storage-600d-16-pair.webp",
  "17-dpower-48-led-clip-on-desk-lamp.webp","18-small-desk-mat-10x12.webp",
  "19-one-beat-led-lamp-power-strip.webp","20-d-line-cable-box-white.webp",
  "21-laopao-desk-lamp-charger-clock.webp","22-house-day-velvet-hangers-60-pack.webp",
  "23-homyfort-under-bed-shoe-storage-2-pack.webp","24-d-line-cable-box-large-black.webp",
  "25-utopia-home-velvet-hangers-50-pack.webp",
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
