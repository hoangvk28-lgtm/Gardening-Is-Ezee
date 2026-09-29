import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-webcam-under-50";
const srcDir = join(__dirname, "../design/blog image/best-webcam-under-50-webp");
const images = [
  "06-best-webcam-under-50-hero.webp",
  "01-logitech-brio-100.webp",
  "02-logitech-brio-101.webp",
  "03-nexigo-n60-1080p.webp",
  "04-emeet-c960.webp",
  "05-emeet-c950.webp",
];
for (const f of images) {
  const res = await fetch(`${SB}/storage/v1/object/${BUCKET}/${FOLDER}/${f}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: readFileSync(join(srcDir, f)),
  });
  console.log(res.ok ? `OK  ${f}` : `FAIL ${f}: ${await res.text()}`);
}
