import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_AFFILIATE_SETTINGS,
  DEFAULT_FOOTER_SETTINGS,
} from "../lib/public-settings";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const settings = [
  { id: "settings-homepage", key: "homepage", value: DEFAULT_HOMEPAGE_SETTINGS },
  { id: "settings-global", key: "global", value: DEFAULT_GLOBAL_SETTINGS },
  { id: "settings-affiliate", key: "affiliate", value: DEFAULT_AFFILIATE_SETTINGS },
  { id: "settings-footer", key: "footer", value: DEFAULT_FOOTER_SETTINGS },
];

async function seed() {
  console.log(`Seeding ${settings.length} site settings…`);
  const { error } = await supabase.from("site_settings").upsert(settings, { onConflict: "key" });
  if (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
  console.log("Done.");
}

seed();
