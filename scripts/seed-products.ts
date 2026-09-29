/**
 * Seed script: upserts all 14 products from data/products.ts into Supabase.
 *
 * Usage:
 *   npm run seed:products
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { products } from "../data/products";

// ── Load .env.local without any external deps ─────────────────────────────────
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
      // Strip surrounding quotes if present
      const val = raw.replace(/^["'](.*)["']$/, "$1");
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local not found - rely on existing environment variables
  }
}

loadDotEnvLocal();

// ── Connect ───────────────────────────────────────────────────────────────────
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "\n❌  Supabase env vars missing.\n" +
      "    Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n"
  );
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Map products → DB rows ────────────────────────────────────────────────────
const rows = products.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category_slug: p.categorySlug,
  subcategory_slug: p.subcategorySlug,
  badge: p.badge ?? null,
  short_description: p.shortDescription,
  review_summary: p.reviewSummary,
  amazon_url: p.amazonUrl,
  price_range: p.priceRange,
  image: p.image,
  best_for: p.bestFor,
  not_ideal_for: p.notIdealFor,
  specs: p.specs,
  pros: p.pros,
  cons: p.cons,
  scores: p.scores,
  alternatives: p.alternatives,
  related_guide_slugs: p.relatedGuideSlugs,
  status: "published",
  archived: false,
}));

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱  Seeding ${rows.length} products into Supabase…`);
  console.log(`    Project URL: ${url!.replace(/supabase\.co.*/, "supabase.co/…")}\n`);

  const { data, error } = await db
    .from("products")
    .upsert(rows, { onConflict: "id" })
    .select("id, name");

  if (error) {
    console.error("❌  Seed failed:", error.message);
    if (error.message.includes("does not exist")) {
      console.error(
        "\n    ℹ  The products table may not exist yet.\n" +
          "    Run supabase/migrations/001_create_products.sql in the Supabase SQL Editor first.\n"
      );
    }
    process.exit(1);
  }

  console.log(`✅  Upserted ${data?.length ?? 0} products:\n`);
  for (const row of data ?? []) {
    console.log(`   • ${row.id}`);
  }

  console.log(`\n✓  Done. Visit /admin/products to verify.\n`);
}

seed();
