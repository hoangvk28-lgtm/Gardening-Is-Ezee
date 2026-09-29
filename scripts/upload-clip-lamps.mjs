import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://xlipolezpdkfmneqkncd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-clip-on-desk-lamp";

const images = [
  "voncerus-led-clamp-best-overall.webp",
  "dpower-48-led-best-budget.webp",
  "deeplite-battery-powered-best-cordless.webp",
  "10w-swing-arm-best-for-reading.webp",
  "360-rotation-best-for-bunk-beds.webp",
  "led-flexible-gooseneck-ultra-compact.webp",
  "eye-caring-gooseneck-eye-strain.webp",
  "eazyclips-led-entry-level.webp",
];

const srcDir = join(__dirname, "../design/blog image/deskfinds-clip-lamps-webp");

for (const filename of images) {
  const filePath = join(srcDir, filename);
  const fileBuffer = readFileSync(filePath);
  const storagePath = `${FOLDER}/${filename}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error(`FAILED ${filename}: ${res.status} ${txt}`);
  } else {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
    console.log(`OK  ${filename}`);
    console.log(`    ${publicUrl}`);
  }
}

console.log("\nDone.");
