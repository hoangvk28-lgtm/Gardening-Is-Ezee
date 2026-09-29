import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-charging-stations-for-desk";
const srcDir = join(__dirname, "../design/blog image/charging-hub-product-images-webp");
const images = [
  "best-charging-stations-for-desk-hero.webp",
  "01-anker-prime-200w-6-port-gan.webp",
  "02-ugreen-nexode-200w-6-port.webp",
  "03-anker-magsafe-3-in-1-qi2-15w.webp",
  "04-baseus-nomos-5-in-1-140w.webp",
  "05-anker-nano-6-in-1-67w.webp",
  "06-bestek-organizer-10-port.webp",
  "07-anker-5-port-usb-charging-hub.webp",
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
