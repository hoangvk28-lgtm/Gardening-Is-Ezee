import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/lap-desk-vs-standing-desk-converter";
const srcDir = join(__dirname, "../design/blog image/lap-desk-vs-standing-desk-converter-webp");
const images = [
  "06-lap-desk-vs-standing-desk-converter-hero.webp",
  "01-saiji-adjustable-bed-tray.webp",
  "02-lapgear-home-office-pro.webp",
  "03-nnewvante-bamboo-lap-desk.webp",
  "04-vivo-32-desk-converter.webp",
  "05-flexispot-31-converter.webp",
];
for (const f of images) {
  const res = await fetch(`${SB}/storage/v1/object/${BUCKET}/${FOLDER}/${f}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: readFileSync(join(srcDir, f)),
  });
  console.log(res.ok ? `OK  ${f}` : `FAIL ${f}: ${await res.text()}`);
}
