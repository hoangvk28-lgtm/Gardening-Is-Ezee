import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "affiliate-media";
const FOLDER = "guides/best-office-chair-under-100";
const srcDir = join(__dirname, "../design/blog image/best-office-chair-under-100-7-webp-images");
const images = [
  "07-hero-best-office-chair-under-100.webp",
  "01-best-overall-clatina-ergonomic-high-back.webp",
  "02-best-mesh-flysky-ergonomic-mesh-chair.webp",
  "03-best-ergonomic-sytas-home-office-chair.webp",
  "04-best-for-dorms-amazon-basics-office-task-chair.webp",
  "05-best-leather-look-sweetcrispy-heavy-duty-task.webp",
  "06-best-budget-fdw-high-back-office-chair.webp",
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
