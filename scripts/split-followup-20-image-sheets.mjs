import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const generated = "/home/admin1/.codex/generated_images/01a0ebff-4a68-7ff3-ab19-653a01da4189";
const output = path.join(process.cwd(), "public/images/informational/followup-20");
await mkdir(output, { recursive: true });

const sheets = {
  "lawn-mower-wont-start-after-winter": "exec-90a4f1d7-2177-434c-b439-3725aa8a8f81.png",
  "lawn-mower-battery-not-charging": "exec-d0280d62-5184-418c-8a09-84aaf0489f49.png",
  "grass-clogging-lawn-mower-deck": "exec-4f959108-95a4-4d14-bd6f-3b7bb92cff8d.png",
  "right-mowing-height-for-lawn": "exec-47c2129b-c74e-48c1-b589-67bda7660a29.png",
  "mow-uneven-lawn-without-scalping": "exec-30b0ca48-b827-4929-8370-53b170bbc2d7.png",
  "overseed-before-or-after-aerating": "exec-27300a56-dccd-4612-88a8-420793c2b907.png",
  "when-to-aerate-lawn": "exec-9a515e71-0e97-4487-9efa-cb2ac42052ca.png",
  "clean-maintain-pruning-saw": "exec-90fad5f0-669f-47f4-97b5-3576fa7410f4.png",
  "hedge-trimmer-keeps-jamming": "exec-88fde376-fcc8-4e08-8e8f-2b1681e34861.png",
  "string-trimmer-without-damaging-trees": "exec-52b1b577-7307-4d5d-be03-81d8a39ad4cb.png",
  "where-to-cut-tree-branch": "exec-6212a7fc-ea1c-4ba8-8d74-33bdf2bb223d.png",
  "three-cut-method-pruning-branches": "exec-4711d9c6-04cf-4939-8a75-84c561ce03a7.png",
  "thinning-cuts-vs-heading-cuts": "exec-750eeb88-4817-457e-8c18-07a62fc70ab5.png",
  "when-to-replace-pruning-shear-blade": "exec-a1d0b770-5996-47e2-95a0-7813d27ccf40.png",
  "compost-too-wet": "exec-e8c7b821-d232-4aab-8a9b-f59e038c088c.png",
  "flies-in-compost-bin": "exec-eeefd80b-00fa-4e18-9c1f-347aaf1f14f4.png",
  "compost-grass-clippings": "exec-bcec95b2-5d0c-477c-a589-f9b86aa998f5.png",
  "how-to-compost-leaves-faster": "exec-31fd2aa3-07e2-440e-b5d2-e0a8f7a31bf9.png",
  "mulch-leaves-or-rake-them": "exec-888dfce4-782e-43f6-a652-eecab6ed0c7a.png",
  "how-to-use-leaf-blower-safely": "exec-039c8d2e-df05-40d5-b954-ea23d8650ffb.png",
};

for (const [slug, filename] of Object.entries(sheets)) {
  for (let index = 0; index < 5; index += 1) {
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(generated, filename), "-vf", `crop=iw/5:ih:${index}*iw/5:0,scale=870:-2`, "-quality", "82", path.join(output, `${slug}-0${index + 1}.webp`)]);
  }
}

console.log(`Created ${Object.keys(sheets).length * 5} article images in ${output}`);
