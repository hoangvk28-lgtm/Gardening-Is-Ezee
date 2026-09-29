/**
 * Editorial audit for The Office Journal guides.
 *
 * Scans every guide (rich data files, hand-authored /guide/<slug> pages and
 * registry-only guides) for the machine-checkable rules in the editorial
 * guide: internal/AI language, invented testing, promo language, template
 * phrases, star ratings in prose, usage thresholds, population claims,
 * a/an grammar, SEO-style metadata, sister-site title duplication,
 * badge/price conflicts and non-Office-Journal affiliate tags.
 *
 * Read-only. Writes reports/editorial-audit.{csv,md}.
 *
 *   NODE_OPTIONS=--max-old-space-size=8192 npx tsx --tsconfig tsconfig.json scripts/audit-editorial.ts
 */
import fs from "node:fs";
import path from "node:path";
import { guides } from "@/data/guides";
import { guideDataLoaders, legacyLiteralRouteSlugs } from "@/data/guides-index.generated";
import { canonicalGuidePath } from "@/lib/migrated-silos";
import { homepageEditorial } from "@/data/homepage-editorial";

type Severity = "high" | "medium" | "low";
interface Finding { rule: string; severity: Severity; detail: string }

const ROOT = process.cwd();
const TAG = "theofficejournal-20";
const SISTER_SITES = ["../smartspace-picks", "../workcocoon"];

// ── Rule patterns ────────────────────────────────────────────────────────────
const RULES: { rule: string; severity: Severity; re: RegExp }[] = [
  { rule: "R4 internal language", severity: "high", re: /\b(source data|our dataset|the dataset|provided data|based on the data provided)\b/gi },
  { rule: "R3 possible hands-on claim (verify)", severity: "high", re: /\b(we tested|we've tested|we have tested|we used (it|this|them)|we measured|in our hands|our lab|during (our )?testing|after (weeks|months|years) of (use|testing)|hands-on (testing|test) (shows|showed|revealed))\b/gi },
  { rule: "R23 promo language", severity: "medium", re: /\b(must-have|grab (this|it|one)|buy now|shop now|don't miss|amazon finds?|top amazon pick|today's deal|limited time)\b/gi },
  { rule: "R31 template phrase", severity: "medium", re: /(that's a real strength|weigh it against the flip side|a genuine advantage here|strong value|both matter when comparing|neither should be a surprise|worth calling out specifically|set against that|at a budget-friendly price|at pricing is|at a competitive price\+?|one of the cheapest picks)/gi },
  { rule: "R32 marketing adjective", severity: "low", re: /\b(amazing|incredible|game[- ]chang(er|ing)|perfect|premium quality|excellent choice|great option|feature-packed|unbeatable|best-in-class)\b/gi },
  { rule: "Star rating in prose", severity: "high", re: /\b\d\.\d[- ]?stars?\b|\b\d\.\d out of 5\b/gi },
  { rule: "R41 usage threshold", severity: "medium", re: /\b(\d+(\.\d+)?(\+|-plus)?(\s*(to|-)\s*\d+)?[- ]hours?( a| per)? (day|daily|workday)|all[- ]day (use|comfort|sitting)|full[- ]day use|\d+-hour (work)?days?|(\d+|several|many)[- ]years? lifespan|lifespan of (\d+|several|many)|(last|lasts|lasting) (for )?(\d+|several|many) years)\b/gi },
  { rule: "R42 population claim", severity: "low", re: /\b(?<!best for )(most people|everyone (needs|agrees|loves|should)|every user|users love|customers (agree|love))\b/gi },
  // a/an by sound: skip "a u…" (usable, UL, UPS) and acronyms read letter by letter (an NVMe, an FDM).
  { rule: "R40 a/an grammar", severity: "medium", re: /\b(?:[Aa] (?![Uu]|[Ee][Uu]|[Oo]ne|[Oo]nce)[AEIOaeio][a-z]\w*|[Aa]n (?![A-Z][A-Z0-9])(?!(?:hour|honest|honor|herb)\b)[bcdfgjklmnpqrstvwxyzBCDGJKPQTVWYZ]\w+)\b/g },
  { rule: "R40 plural after a/an", severity: "medium", re: /\b(a|an) (\w+ ){0,2}(chairs|desks|arms|lamps|monitors|keyboards|mice|stands|trays|shelves|cabinets) (under|for|with)\b/gi },
];
const OTHER_TAG = /[?&]tag=([a-z0-9-]+)/gi;

// ── Helpers ──────────────────────────────────────────────────────────────────
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

function proseOf(mod: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(mod)) {
    if (k === "products" && Array.isArray(v)) {
      for (const p of v as Record<string, unknown>[]) {
        for (const [pk, pv] of Object.entries(p)) {
          if (["rating", "reviews", "imageUrl", "amazonUrl", "id", "price"].includes(pk)) continue;
          collectStrings(pv, parts);
        }
      }
    } else if (!["heroImage", "guideSlug", "relatedGuides", "lastUpdated", "readTime"].includes(k)) {
      collectStrings(v, parts);
    }
  }
  return parts.join("\n");
}

function scan(text: string, findings: Finding[]) {
  for (const { rule, severity, re } of RULES) {
    const hits = [...text.matchAll(re)].map((m) => m[0]);
    if (hits.length) {
      const uniq = [...new Set(hits.map((h) => h.toLowerCase()))].slice(0, 4);
      findings.push({ rule, severity, detail: `${hits.length}× ${uniq.join(" | ")}` });
    }
  }
}

function scanTags(text: string, findings: Finding[]) {
  const bad = [...text.matchAll(OTHER_TAG)].map((m) => m[1]).filter((t) => t !== TAG);
  if (bad.length) findings.push({ rule: "R29 other affiliate tag", severity: "high", detail: [...new Set(bad)].join(", ") });
}

function sisterTitle(slug: string): string | undefined {
  for (const dir of SISTER_SITES) {
    const f = path.join(ROOT, dir, "data/guides", `${slug}.ts`);
    if (fs.existsSync(f)) {
      const m = fs.readFileSync(f, "utf8").match(/export const guideTitle\s*=\s*"([^"]+)"/);
      if (m) return m[1];
    }
  }
  return undefined;
}

const csv = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

// ── Main ─────────────────────────────────────────────────────────────────────
interface Row {
  slug: string; url: string; kind: string; title: string; status: string;
  high: number; medium: number; low: number; priority: number; findings: Finding[];
}

async function main() {
  const literal = new Set(legacyLiteralRouteSlugs);
  const homepageSlugs = new Set<string>([
    ...homepageEditorial.featured.candidates,
    ...homepageEditorial.latest.map((r) => r.slug),
    ...homepageEditorial.mostRead.map((r) => r.slug),
    ...homepageEditorial.departments.flatMap((d) => d.articles.map((r) => r.slug)),
    ...homepageEditorial.workspaceIdeas.articles.map((r) => r.slug),
    ...homepageEditorial.workBetter.articles.map((r) => r.slug),
  ]);
  const rows: Row[] = [];

  for (const g of guides) {
    const findings: Finding[] = [];
    let kind: string;
    let title = g.title;
    let status = "not rewritten";
    let text: string;

    if (guideDataLoaders[g.slug]) {
      kind = "rich";
      const mod = (await guideDataLoaders[g.slug]()) as unknown as Record<string, unknown>;
      title = String(mod.guideTitle ?? g.title);
      text = proseOf(mod);
      scanTags(JSON.stringify(mod), findings);
      if (mod.bottomLine && mod.breadcrumbLabel) status = "rewritten";

      const products = (mod.products as Record<string, unknown>[] | undefined) ?? [];
      const missingSkip = products.filter((p) => !p.skipIf).length;
      if (products.length && missingSkip) findings.push({ rule: "R14 missing Skip if", severity: "low", detail: `${missingSkip}/${products.length} products` });
      for (const p of products) {
        const price = parseFloat(String(p.price ?? "").replace(/[^0-9.]/g, ""));
        const cap = String(p.badge ?? "").match(/under \$([\d,]+)/i);
        if (cap && price && price > Number(cap[1].replace(/,/g, ""))) findings.push({ rule: "Badge/price conflict", severity: "high", detail: `${p.name}: "${p.badge}" vs ${p.price}` });
        const inText = collectStrings([p.pros, p.cons, p.description]).join(" ").match(/\$\d+(\.\d\d)?/g) ?? [];
        const off = inText.filter((d) => price && Math.abs(parseFloat(d.slice(1)) - price) / price > 0.08 && parseFloat(d.slice(1)) > 20);
        if (off.length) findings.push({ rule: "Price in prose ≠ price field", severity: "medium", detail: `${p.name}: ${[...new Set(off)].join(", ")} vs ${p.price}` });
      }
      const meta = String(mod.metaDescription ?? "");
      if (/^\d+ best\b|\bin 20\d\d\.|\$\d/i.test(meta.replace(/under \$\d+/gi, ""))) findings.push({ rule: "R26 SEO-style meta description", severity: "medium", detail: meta.slice(0, 90) });
    } else if (literal.has(g.slug)) {
      kind = "hand-authored page";
      const file = path.join(ROOT, "app/(site)/guide", g.slug, "page.tsx");
      text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
      const dataFile = path.join(ROOT, "data/guides", `${g.slug}.ts`);
      if (fs.existsSync(dataFile)) text += "\n" + fs.readFileSync(dataFile, "utf8");
      scanTags(text, findings);
      if (/AmazonBountyBanner|New to Amazon Prime|Try Prime/i.test(text)) findings.push({ rule: "R23 Prime promo module", severity: "medium", detail: "Prime banner/copy on page" });
      if (/rounded-(xl|2xl)|shadow-card|#FF9900/.test(text)) findings.push({ rule: "Legacy affiliate-style layout", severity: "low", detail: "old card/orange styling in page markup" });
    } else {
      kind = "registry (GuideDetail)";
      text = collectStrings([g.description, g.sections, g.faq, g.buyingCriteria]).join("\n");
    }

    scan(text, findings);
    if (/^\d+\s+best\b/i.test(g.description) || /\bin 20\d\d\.\s/i.test(g.description)) {
      if (!findings.some((f) => f.rule.startsWith("R26"))) findings.push({ rule: "R26 SEO-style meta description", severity: "medium", detail: g.description.slice(0, 90) });
    }
    const sister = sisterTitle(g.slug);
    if (sister && sister === title) findings.push({ rule: "R5 title identical to sister site", severity: "medium", detail: title });
    if (/^\d+\s+Best\b.*\b20\d\d$/.test(title)) findings.push({ rule: "R6 formulaic title", severity: "low", detail: title });

    const high = findings.filter((f) => f.severity === "high").length;
    const medium = findings.filter((f) => f.severity === "medium").length;
    const low = findings.filter((f) => f.severity === "low").length;
    // Priority: severity, homepage exposure, and whether the page is on a topic silo.
    const url = canonicalGuidePath(g);
    const priority =
      high * 10 + medium * 3 + low +
      (homepageSlugs.has(g.slug) ? 25 : 0) +
      (url.startsWith("/guide/") ? 0 : 5);
    rows.push({ slug: g.slug, url, kind, title, status, high, medium, low, priority, findings });
  }

  rows.sort((a, b) => b.priority - a.priority);
  const outDir = path.join(ROOT, "reports");
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "editorial-audit.csv"),
    ["slug,url,kind,status,title,high,medium,low,priority,manual_review,findings"]
      .concat(rows.map((r) => [
        r.slug, r.url, r.kind, r.status, r.title, r.high, r.medium, r.low, r.priority,
        r.findings.some((f) => f.severity === "high") ? "yes" : "no",
        r.findings.map((f) => `[${f.severity}] ${f.rule}: ${f.detail}`).join(" ; "),
      ].map(csv).join(",")))
      .join("\n") + "\n"
  );

  // Markdown summary
  const byRule = new Map<string, { articles: number; severity: Severity }>();
  for (const r of rows) for (const f of r.findings) {
    const e = byRule.get(f.rule) ?? { articles: 0, severity: f.severity };
    e.articles++; byRule.set(f.rule, e);
  }
  const byKind = new Map<string, number>();
  rows.forEach((r) => byKind.set(r.kind, (byKind.get(r.kind) ?? 0) + 1));
  const manual = rows.filter((r) => r.high > 0);
  const lines = [
    "# Editorial audit — The Office Journal",
    "",
    `Guides scanned: ${rows.length} (${[...byKind].map(([k, n]) => `${k}: ${n}`).join(", ")})`,
    `Rewritten to the editorial standard: ${rows.filter((r) => r.status === "rewritten").length}`,
    `MANUAL_REVIEW (≥1 high-severity finding): ${manual.length}`,
    `Clean (no findings): ${rows.filter((r) => r.findings.length === 0).length}`,
    "",
    "## Findings by rule",
    "",
    "| Rule | Severity | Articles |",
    "|---|---|---|",
    ...[...byRule].sort((a, b) => b[1].articles - a[1].articles).map(([rule, e]) => `| ${rule} | ${e.severity} | ${e.articles} |`),
    "",
    "## Suggested first rewrite batch (top 25 by priority)",
    "",
    "| # | Slug | URL | Type | High | Med | Low |",
    "|---|---|---|---|---|---|---|",
    ...rows.filter((r) => r.status !== "rewritten").slice(0, 25).map((r, i) => `| ${i + 1} | ${r.slug} | ${r.url} | ${r.kind} | ${r.high} | ${r.medium} | ${r.low} |`),
    "",
    "Full per-article findings: reports/editorial-audit.csv",
  ];
  fs.writeFileSync(path.join(outDir, "editorial-audit.md"), lines.join("\n") + "\n");
  console.log(lines.slice(0, 40).join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
