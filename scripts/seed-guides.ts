import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { guides } from "../data/guides";

function loadDotEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx <= 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const raw = trimmed.slice(eqIdx + 1).trim();
      const val = raw.replace(/^["'](.*)["']$/, "$1");
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // rely on existing environment variables
  }
}

loadDotEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("\n❌  Supabase env vars missing.\n    Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const rows = guides.map((g) => ({
  id: g.slug, // use slug as id for static guides
  title: g.title,
  slug: g.slug,
  category_slug: g.categorySlug,
  subcategory_slug: g.subcategorySlug,
  description: g.description,
  hero_image: g.heroImage,
  hero_image_alt: "",
  meta_title: g.title,
  meta_description: g.description,
  main_keyword: g.mainKeyword,
  sub_keywords: g.subKeywords,
  intro: "",
  recommended_product_ids: g.recommendedProductIds,
  comparison_order: g.recommendedProductIds,
  sections: g.sections,
  faq: g.faq,
  related_guide_slugs: g.relatedGuideSlugs,
  author: g.author,
  read_time: g.readTime,
  last_updated: g.lastUpdated,
  status: "published",
  archived: false,
}));

async function seed() {
  console.log(`\n🌱  Seeding ${rows.length} guides into Supabase…`);
  console.log(`    Project URL: ${url!.replace(/supabase\.co.*/, "supabase.co/…")}\n`);

  const { data, error } = await db
    .from("guides")
    .upsert(rows, { onConflict: "id" })
    .select("id, title");

  if (error) {
    console.error("❌  Seed failed:", error.message);
    if (error.message.includes("does not exist")) {
      console.error("\n    ℹ  The guides table may not exist yet.\n    Run supabase/migrations/002_create_guides.sql in the Supabase SQL Editor first.\n");
    }
    process.exit(1);
  }

  console.log(`✅  Upserted ${data?.length ?? 0} guides:\n`);
  for (const row of data ?? []) {
    console.log(`   • ${row.id} - ${row.title}`);
  }
  console.log(`\n✓  Done. Visit /admin/guides to verify.\n`);
}

seed();
