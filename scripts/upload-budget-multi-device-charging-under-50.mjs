import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-budget-multi-device-charging-station-under-50";
const srcDir = join(__dirname, "../design/blog image/deskfinds-multi-device-charging-stations-6-images-webp");
const images = [
  "6-hero-best-budget-multi-device-charging-stations-under-50-2026.webp",
  "1-ugreen-nexode-65w-4-port-gan.webp",
  "2-anker-premium-5-port-pd-60w.webp",
  "3-soopii-premium-6-port-watch-arm.webp",
  "4-orico-10-port-120w.webp",
  "5-sabrent-10-port-usb-3-hub-hb-b7c3.webp",
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
