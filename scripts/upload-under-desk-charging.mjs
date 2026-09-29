import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/under-desk-charging-station";
const srcDir = join(__dirname, "../design/blog image/bai-8-under-desk-charging-7-webp-images");
const images = [
  "07-hero-bai-8-under-desk-charging.webp",
  "01-best-clamp-anker-nano-10-in-1-clamp-70w.webp",
  "02-best-budget-clamp-tessan-14-in-1-desk-clamp.webp",
  "03-best-through-desk-wireless-humanscale-neatcharge.webp",
  "04-best-grommet-i-valux-in-desk-wireless-15w.webp",
  "05-best-screw-mount-qba-8-in-1-desk-mount-strip.webp",
  "06-under-desk-charging-cable-management.webp",
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
