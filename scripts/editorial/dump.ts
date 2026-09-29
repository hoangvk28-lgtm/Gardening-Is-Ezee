/* eslint-disable @typescript-eslint/no-explicit-any */
/** Compact editorial view of a rich guide: npx tsx ... dump.ts <slug> */
import path from "node:path";
import { pathToFileURL } from "node:url";
async function main() {
  const slug = process.argv[2];
  const m = (await import(pathToFileURL(path.resolve("data/guides", `${slug}.ts`)).href)) as Record<string, any>;
  const L: string[] = [];
  L.push(`TITLE: ${m.guideTitle}\nMETA: ${m.metaTitle} | ${m.metaDescription}\nKW: ${m.mainKeyword ?? ""}`);
  (m.introParagraphs ?? []).forEach((p: string) => L.push(`INTRO: ${p}`));
  for (const p of m.products) {
    L.push(`\n#${p.rank} [${p.id}] ${p.name} | ${p.badge} | ${p.price}`);
    L.push(`  DESC: ${p.description}`);
    L.push(`  SPECS: ${p.specs.join(" ; ")}`);
    L.push(`  PROS: ${p.pros.join(" ; ")}`);
    L.push(`  CONS: ${p.cons.join(" ; ")}`);
    L.push(`  BEST: ${p.bestFor}`);
  }
  (m.buyingCriteria ?? []).forEach((c: any) => L.push(`CRIT: ${c.criterion} :: ${c.explanation.replace(/\n+/g, " ")}`));
  (m.howWeEvaluated ?? []).forEach((c: any) => L.push(`EVAL: ${c.title} :: ${c.description}`));
  (m.howToChoose ?? []).forEach((c: any) => L.push(`CHOOSE: ${JSON.stringify(c)}`));
  (m.faq ?? []).forEach((c: any) => L.push(`FAQ: ${c.q} :: ${c.a}`));
  console.log(L.join("\n"));
}
main();
