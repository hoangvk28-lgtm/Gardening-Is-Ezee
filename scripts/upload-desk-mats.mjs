import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-desk-mat-for-small-desk";
const srcDir = join(__dirname, "../design/blog image/deskfinds-desk-mats-8-images-webp");
const images = [
  "nordik-gray-leather-35x17-best-overall.webp",
  "nordik-cork-leather-35x17-best-eco-friendly.webp",
  "dawntrees-felt-36x12-best-felt.webp",
  "deskmatec-snow-leopard-best-for-gaming-office.webp",
  "small-desk-mat-10x12-best-ultra-compact.webp",
  "nordik-pebble-black-35x17-best-dark-aesthetic.webp",
  "nordik-tangerine-orange-35x17-best-colorful-setup.webp",
  "premium-leather-saddle-brown-best-vintage-look.webp",
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
