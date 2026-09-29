import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const deals = [
  {
    id: "deal-desk-lamp-value",
    product_id: "",
    product_slug: "lumiy-lightblade-1500s",
    title: "Lumiy Lightblade 1500S - Top-Rated Desk Lamp",
    slug: "lumiy-lightblade-1500s-deal",
    label: "Budget-friendly pick",
    description: "Highly rated LED desk lamp with adjustable color temperature. Great for long study sessions.",
    section: "lighting",
    placement: "deals",
    amazon_url_override: "",
    cta_text: "Check current price",
    price_range_override: "",
    image_override: "",
    image_alt: "Lumiy Lightblade 1500S desk lamp",
    featured: true,
    display_order: 1,
    status: "active",
    archived: false,
    starts_at: null,
    ends_at: null,
  },
  {
    id: "deal-laptop-stand-value",
    product_id: "",
    product_slug: "amazon-basics-laptop-stand",
    title: "Amazon Basics Laptop Stand - Compact & Affordable",
    slug: "amazon-basics-laptop-stand-deal",
    label: "Worth checking",
    description: "Lightweight aluminum laptop stand. Improves posture and frees up desk space.",
    section: "ergonomics",
    placement: "deals",
    amazon_url_override: "",
    cta_text: "Check current price",
    price_range_override: "",
    image_override: "",
    image_alt: "Amazon Basics laptop stand",
    featured: true,
    display_order: 2,
    status: "active",
    archived: false,
    starts_at: null,
    ends_at: null,
  },
  {
    id: "deal-monitor-arm-budget",
    product_id: "",
    product_slug: "huanuo-monitor-arm",
    title: "HUANUO Monitor Arm - Space-Saving Desk Mount",
    slug: "huanuo-monitor-arm-deal",
    label: "Budget-friendly pick",
    description: "Single monitor arm with full range of motion. Clears desk space instantly.",
    section: "monitors",
    placement: "deals",
    amazon_url_override: "",
    cta_text: "Check current price",
    price_range_override: "",
    image_override: "",
    image_alt: "HUANUO monitor arm",
    featured: false,
    display_order: 3,
    status: "active",
    archived: false,
    starts_at: null,
    ends_at: null,
  },
  {
    id: "deal-cable-mgmt",
    product_id: "",
    product_slug: "",
    title: "J Channel Cable Raceway - Clean Desk Cables",
    slug: "j-channel-cable-raceway-deal",
    label: "Worth checking",
    description: "Simple adhesive cable raceway to hide desk cables along walls and desk edges.",
    section: "accessories",
    placement: "deals",
    amazon_url_override: "",
    cta_text: "Check current price",
    price_range_override: "Under $15",
    image_override: "",
    image_alt: "Cable raceway for desk",
    featured: false,
    display_order: 4,
    status: "draft",
    archived: false,
    starts_at: null,
    ends_at: null,
  },
];

async function seed() {
  console.log(`Seeding ${deals.length} deals…`);
  const { error } = await supabase.from("deals").upsert(deals, { onConflict: "id" });
  if (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
  console.log("Done.");
}

seed();
