import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/desk-mat-vs-mouse-pad";
const srcDir = join(__dirname, "../design/blog image/desk-mat-vs-mouse-pad-webp");
const images = [
  "06-desk-mat-vs-mouse-pad-hero.webp",
  "01-k-knodel-large-desk-mat.webp",
  "02-aothia-leather-desk-pad.webp",
  "03-dawntrees-felt-desk-mat.webp",
  "04-logitech-studio-series-mouse-pad.webp",
  "05-ktrio-extended-gaming-mouse-pad.webp",
];
for (const f of images) {
  const res = await fetch(`${SB}/storage/v1/object/${BUCKET}/${FOLDER}/${f}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: readFileSync(join(srcDir, f)),
  });
  console.log(res.ok ? `OK  ${f}` : `FAIL ${f}: ${await res.text()}`);
}
