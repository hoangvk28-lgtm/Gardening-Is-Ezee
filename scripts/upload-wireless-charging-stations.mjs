import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-wireless-charging-stations-for-desk";
const srcDir = join(__dirname, "../design/blog image/bai3-best-wireless-charging-stations-7-webp-images");
const images = [
  "07-hero-best-wireless-charging-stations-for-desk.webp",
  "01-anker-magsafe-3in1-qi2-15w.webp",
  "02-belkin-boostcharge-pro-3in1-qi2.webp",
  "03-lisen-qi2-3in1.webp",
  "04-anker-maggo-qi2-pad-flat.webp",
  "05-journey-alti-qi2-desk-mat.webp",
  "06-anker-313-wireless-pad-budget.webp",
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
