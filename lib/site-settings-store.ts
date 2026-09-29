import { createAdminClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export type SettingsKey = "homepage" | "global" | "footer" | "affiliate" | "navigation";

export interface SiteSetting {
  id: string;
  key: SettingsKey;
  value: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

function fromRow(row: Record<string, unknown>): SiteSetting {
  return {
    id: row.id as string,
    key: row.key as SettingsKey,
    value: (row.value as Record<string, unknown>) ?? {},
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

export async function getSiteSetting(key: SettingsKey): Promise<SiteSetting | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("key", key).single();
  if (error) return undefined;
  return fromRow(data as Record<string, unknown>);
}

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*").order("key");
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function upsertSiteSetting(key: SettingsKey, value: Record<string, unknown>): Promise<SiteSetting> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: nanoid(), key, value }, { onConflict: "key" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const row = await getSiteSetting("homepage");
  return row ? (row.value as unknown as HomepageSettings) : null;
}

export async function updateHomepageSettings(value: HomepageSettings): Promise<void> {
  await upsertSiteSetting("homepage", value as unknown as Record<string, unknown>);
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  const row = await getSiteSetting("global");
  return row ? (row.value as unknown as GlobalSettings) : null;
}

export async function updateGlobalSettings(value: GlobalSettings): Promise<void> {
  await upsertSiteSetting("global", value as unknown as Record<string, unknown>);
}

export async function getAffiliateSettings(): Promise<AffiliateSettings | null> {
  const row = await getSiteSetting("affiliate");
  return row ? (row.value as unknown as AffiliateSettings) : null;
}

export async function updateAffiliateSettings(value: AffiliateSettings): Promise<void> {
  await upsertSiteSetting("affiliate", value as unknown as Record<string, unknown>);
}

export async function getFooterSettings(): Promise<FooterSettings | null> {
  const row = await getSiteSetting("footer");
  return row ? (row.value as unknown as FooterSettings) : null;
}

export async function updateFooterSettings(value: FooterSettings): Promise<void> {
  await upsertSiteSetting("footer", value as unknown as Record<string, unknown>);
}

// ── Type definitions ──────────────────────────────────────────────────────────

export interface HomepageSettings {
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    searchPlaceholder: string;
    badgeText: string;
    heroImageUrl: string;
    heroImageAlt: string;
    featuredProductSlugs: string[];
  };
  trustBar: {
    items: Array<{ number: string; unit: string; label: string; description: string }>;
  };
  featuredGuideSlug: string;
  sections: {
    guides: { title: string; description: string; limit: number; featuredSlugs?: string[] };
    deals: { title: string; description: string };
    categories: { title: string; description: string };
  };
  newsletter: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    description: string;
    inputPlaceholder: string;
    buttonText: string;
    disclaimer: string;
  };
}

export interface GlobalSettings {
  siteName: string;
  siteTagline: string;
  header: {
    logoText: string;
    showDealsButton: boolean;
    dealsButtonText: string;
  };
}

export interface AffiliateSettings {
  disclosureShort: string;
  disclosureFull: string;
  disclosureBannerText: string;
  amazonTag: string;
}

export interface FooterSettings {
  description: string;
  copyrightText: string;
  showAffiliateDisclosure: boolean;
}
