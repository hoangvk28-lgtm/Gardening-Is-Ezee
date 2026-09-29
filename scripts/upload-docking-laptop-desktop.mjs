import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-docking-stations-for-laptop-and-desktop";
const srcDir = join(__dirname, "../design/blog image/bai-7-docking-stations-for-laptop-and-desktop-5-webp-images");
const images = [
  "05-hero-docking-stations-for-laptop-and-desktop.webp",
  "01-best-kvm-startech-usb-c-kvm-dock.webp",
  "02-best-usb4-plugable-usb4-11-in-1.webp",
  "03-best-tb4-anker-777-12-in-1.webp",
  "04-best-budget-amazon-basics-6-in-1-usb-c-3-2-10g-hub.webp",
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
