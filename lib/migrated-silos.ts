import { guideDataLoaders, legacyLiteralRouteSlugs } from "@/data/guides-index.generated";

// Maps guide categorySlug/subcategorySlug values, and legacy /categories/<slug>
// pages, to their new topic-first silo route once that silo's content has been
// migrated. Only entries here get a 301/308 redirect from the old URL — every
// other /guide, /reviews, /categories URL is left untouched (KEEP) until it is
// explicitly migrated, merged, or retired. Never treat this as a blanket map;
// add to it only when the new destination covers the same search intent.
//
// The old category taxonomy (data/categories.ts) does not map 1:1 onto the
// six new silos (data/silos.ts) — most old categorySlug/subcategorySlug values
// (audio-gear, projectors, 3d-printers, networking, home-comfort, filing-
// cabinets, safes, etc.) have no equivalent silo yet and must stay KEEP.

// guide categorySlug OR subcategorySlug -> new silo slug
export const MIGRATED_GUIDE_SLUGS_TO_SILO: Record<string, string> = {
  "lawn-care": "lawn-care",
  "garden-tools": "garden-tools",
  "watering": "watering",
  "growing": "growing",
  "yard-cleanup": "yard-cleanup",
  "outdoor-living": "outdoor-living",
};

// No legacy /categories/<slug> hubs are migrated on this site.
export const MIGRATED_CATEGORY_TO_SILO: Record<string, string> = {};

export function siloForGuide(categorySlug: string, subcategorySlug: string): string | undefined {
  return MIGRATED_GUIDE_SLUGS_TO_SILO[subcategorySlug] ?? MIGRATED_GUIDE_SLUGS_TO_SILO[categorySlug];
}

// The URL a guide link should point to right now — its migrated silo path if
// its category/subcategory has one, otherwise the legacy /guide/<slug> path.
// Listing components (category hubs, silo hubs, related-guides, etc.) should
// build hrefs from this instead of hardcoding `/guide/${slug}`, so links don't
// force visitors through an extra redirect hop to a URL that's about to move
// out from under them.
export function canonicalGuideHref(guide: { slug: string; categorySlug: string; subcategorySlug: string }): string {
  const silo = siloForGuide(guide.categorySlug, guide.subcategorySlug);
  return silo ? `/${silo}/${guide.slug}` : `/guide/${guide.slug}`;
}

// Slugs that have a hand-authored static route at app/(site)/guide/<slug>/page.tsx
// AND are not covered by guideDataLoaders (i.e. their data/guides/<slug>.ts uses a
// legacy custom schema RichGuidePage can't render). For these, the literal route is
// the ONLY place their full content exists — GuideDetail only has thin registry
// stub fields for them. A silo detail page must redirect back to /guide/<slug>
// rather than render GuideDetail, or it silently serves an emptied-out page.
//
// This used to be computed at request time via fs.readdirSync(app/(site)/guide) in
// this Server Component module. That scanned whatever the serverless function's
// deployed filesystem happened to contain, which isn't guaranteed to match the real
// build output one-to-one on Vercel — for a couple of guides this produced a false
// positive in production (not reproducible locally), which combined with /guide/
// [slug]'s unconditional silo redirect to create an infinite redirect loop between
// a silo URL and /guide/<slug>. Importing the list generated at build time instead
// (scripts/generate-guides-index.mjs, alongside guideDataLoaders) makes this
// deterministic and identical between build and every runtime.
let legacyLiteralRouteSlugSet: Set<string> | undefined;

export function hasLegacyLiteralRoute(slug: string): boolean {
  if (!legacyLiteralRouteSlugSet) {
    legacyLiteralRouteSlugSet = new Set(legacyLiteralRouteSlugs);
  }
  return legacyLiteralRouteSlugSet.has(slug);
}

// All categorySlug/subcategorySlug values migrated into a given silo — the
// single source of truth for that silo's generateStaticParams/matching guard,
// so it can never drift from the redirect map above.
export function matchSlugsForSilo(siloSlug: string): string[] {
  return Object.entries(MIGRATED_GUIDE_SLUGS_TO_SILO)
    .filter(([, silo]) => silo === siloSlug)
    .map(([slug]) => slug);
}

// The URL a guide is actually served (200) at — i.e. its canonical URL. Same as
// canonicalGuideHref, except guides whose only full page is the hand-authored
// /guide/<slug> route (no rich data), which the silo route redirects back to.
export function canonicalGuidePath(guide: { slug: string; categorySlug: string; subcategorySlug: string }): string {
  const silo = siloForGuide(guide.categorySlug, guide.subcategorySlug);
  if (!silo) return `/guide/${guide.slug}`;
  if (!guideDataLoaders[guide.slug] && hasLegacyLiteralRoute(guide.slug)) return `/guide/${guide.slug}`;
  return `/${silo}/${guide.slug}`;
}
