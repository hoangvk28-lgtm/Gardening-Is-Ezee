import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-charging-stations-for-multiple-devices-desk";
const srcDir = join(__dirname, "../design/blog image/bai 4-charging-stations-for-multiple-devices-desk-7-webp-images");
const images = [
  "07-hero-charging-stations-for-multiple-devices-desk.webp",
  "01-anker-prime-200w-6-port-gan.webp",
  "02-baseus-nomos-245w-6-in-1.webp",
  "03-tessan-130w-8-in-1-gan.webp",
  "04-alxum-120w-10-port.webp",
  "05-bototek-60w-6-port.webp",
  "06-ugreen-nexode-200w.webp",
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
