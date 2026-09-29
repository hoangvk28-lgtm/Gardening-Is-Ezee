import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = "https://xlipolezpdkfmneqkncd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/20-genius-small-space-hacks";
const srcDir = join(__dirname, "../design/blog image/deskfinds-storage-20-images-webp");

const images = [
  "01-onlyeasy-2-pack-under-bed-shoe-storage-linen.webp",
  "02-under-bed-storage-600d-heavy-duty.webp",
  "03-storageworks-2-pack-under-bed-adjustable-dividers.webp",
  "04-bayka-set-of-3-floating-wall-shelves.webp",
  "05-mount-it-4-compartment-under-desk-drawer.webp",
  "06-hefty-6-medium-bags-vacuum-compress-everyday-clothes.webp",
  "07-hefty-4-large-bags-vacuum-compress-comforters.webp",
  "08-hefty-3-extra-large-vacuum-compress-winter-coats.webp",
  "09-hefty-3-large-hanging-vacuum-hanging-closet-items.webp",
  "10-cozy-essential-20-pack-full-wardrobe-vacuum-kit.webp",
  "11-amazon-basics-50-pack-slim-velvet-hangers.webp",
  "12-whitmor-double-rod-second-closet-hanging-rod.webp",
  "13-closet-doubler-hanger-cascading-closet-doubler.webp",
  "14-humancentric-shelf-under-desk-open-shelf.webp",
  "15-homyfort-2-pack-under-bed-storage-stiffer.webp",
  "16-eureka-ergonomic-black-rolling-2-drawer-cabinet.webp",
  "17-eureka-ergonomic-brown-rolling-2-drawer-cabinet.webp",
  "18-olixis-5-drawer-rolling-cabinet.webp",
  "19-roomimaster-10-small-travel-vacuum-compression.webp",
  "20-d-line-large-black-cord-management-box-large.webp",
];

for (const filename of images) {
  const buf = readFileSync(join(srcDir, filename));
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${FOLDER}/${filename}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: buf,
  });
  console.log(res.ok ? `OK  ${filename}` : `FAIL ${filename}: ${await res.text()}`);
}
console.log("Done.");
