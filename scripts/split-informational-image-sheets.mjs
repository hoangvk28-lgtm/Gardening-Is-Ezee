import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const generated = "/home/admin1/.codex/generated_images/01a0ebff-4a68-7ff3-ab19-653a01da4189";
const output = path.join(process.cwd(), "public/images/informational/next-20");
await mkdir(output, { recursive: true });

const sheets = {
  "drip-irrigation-emitters-not-working": "exec-f35f0048-c88e-47f2-967a-fc9505c97118.png",
  "how-long-to-run-a-soaker-hose": "exec-09b4ff6b-a11d-45ba-8799-a5b91db775ae.png",
  "what-to-put-in-bottom-of-raised-bed": "exec-ae2f44ac-b3a3-40e7-8ed0-58e10aa555bd.png",
  "improve-raised-bed-drainage": "exec-39629dd0-e902-46c7-b421-e9ab3f832908.png",
  "how-to-tell-when-compost-is-finished": "exec-ddbde5e1-7471-4870-bbce-af2580efaea0.png",
  "lawn-mower-cutting-unevenly": "exec-b1142968-cd66-4bde-bbf1-7880ce8e6f25.png",
  "clean-under-lawn-mower-deck": "exec-ddc9f982-53a3-47b9-832f-f03a91a18d3a.png",
  "store-lawn-tool-batteries-winter": "exec-aded7ce8-60c8-4a14-b6b8-0613605e4d33.png",
  "string-trimmer-line-keeps-breaking": "exec-662d65bf-abbc-4e5c-a981-dc03f0843d7e.png",
  "remove-rust-from-garden-tools": "exec-10c1205a-2ad4-4855-97ac-a94f30bbb42a.png",
  "winterize-drip-irrigation-system": "exec-2624d192-b33e-4a1f-82b0-ba7b63965a18.png",
  "measure-garden-hose-flow-rate-pressure": "exec-08d2b0ce-c15a-48d8-9171-5c7542991574.png",
  "garden-hose-keeps-kinking": "exec-64e61569-99ca-4e0e-8de7-d6bce73025c6.png",
  "refresh-raised-bed-soil": "exec-f201183f-f4cc-4dab-a493-e99b0927b33c.png",
  "should-you-line-a-raised-garden-bed": "exec-c6e48342-ad31-4e76-a6bc-33354cef0337.png",
  "how-much-mulch-raised-bed": "exec-9094b656-d892-4699-9121-6d4f847cf8e6.png",
  "can-you-mow-wet-grass": "exec-b3af5b75-7cb7-49d0-977d-9ebad14794c5.png",
  "how-often-sharpen-lawn-mower-blade": "exec-5de5593c-cd6b-409b-a1dd-3e463b005431.png",
  "clean-hedge-trimmer-blades": "exec-2231c782-02cd-4e6f-8bb3-b5c19d13c374.png",
  "leaf-blower-losing-power": "exec-4b05eea1-6c19-40d0-af26-87136d8ef5dc.png",
};

for (const [slug, filename] of Object.entries(sheets)) {
  const source = path.join(generated, filename);
  for (let index = 0; index < 5; index += 1) {
    const destination = path.join(output, `${slug}-0${index + 1}.webp`);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", source, "-vf", `crop=iw/5:ih:${index}*iw/5:0,scale=870:-2`, "-quality", "82", destination]);
  }
}

console.log(`Created ${Object.keys(sheets).length * 5} article images in ${output}`);
