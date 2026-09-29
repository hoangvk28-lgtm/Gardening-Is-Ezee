# WorkCocoon — CLAUDE.md

@AGENTS.md

---

## 0. Communication Rules

- **Always address the user as "cậu"** in every response, without exception.
- **Every internal `<Link>` from `next/link` must include `prefetch={false}`, no exceptions.** In August 2026, Vercel ISR Read Units were running ~50x higher than actual GA pageviews because Next.js prefetches every link in viewport by default — Header, Footer, related-guides sections, and card grids across 2,300+ guide pages were each firing background prefetch requests that got billed as ISR reads despite no real pageview happening. All existing `<Link>` tags were fixed site-wide, and the template scripts that generate new guide `page.tsx` files (`scripts/generate-guide-page.mjs`, `scripts/gen-pages*.mjs`) were updated to always emit `prefetch={false}`. When writing or generating ANY new page/component with a `<Link>`, add `prefetch={false}` by default — do not rely on remembering to add it later at scale.

---

## 0.1 Editorial Rewrites (The Office Journal)

- Rewriting or editing guide copy must follow `docs/editorial-guide.md` (rules 1–43). The reference articles are `/desk-setup/best-monitor-arms` and `/chairs/best-office-chair-under-300`.
- Run `scripts/audit-editorial.ts` before and after a batch. Never change ASINs, affiliate URLs, ranking or canonical URLs during editorial work.

---

## 1. Project Overview

- **Site name:** WorkCocoon (`SITE_NAME = "WorkCocoon"`)
- **Live domain:** `https://www.workcocoon.com` (www is canonical; non-www redirects 301)
- **Business model:** Affiliate content site — earns commissions via Amazon affiliate links
- **Niche:** Honest buying guides for small desks, dorm rooms, and compact home offices
- **Content types:**
  - Buying guides (`/guide/[slug]`) — ranked product picks with scores, FAQs, and editorial sections
  - Product reviews (`/reviews/[slug]`) — individual product pages with full scoring breakdowns
  - Category hubs (`/categories/[slug]`) — top-level category landing pages
  - Compare pages (`/compare/[slug]`) — side-by-side category comparisons and VS articles
  - Deals page (`/deals`) — curated product deals
  - Static editorial pages — `/how-we-review`, `/about-deskfinds`, `/affiliate-disclosure`, `/privacy-policy`, `/contact`
- **Target audience:** People furnishing small spaces — dorm rooms, compact home offices, studio apartments
- **Google Analytics:** `G-NR734FVRW1` (hardcoded in root layout `<head>`)
- **Twitter handle:** `@deskfinds`

---

## 2. Tech Stack & Architecture

### Framework & Language
- **Next.js:** `16.2.6` — this is NOT the standard Next.js 14/15 you know; read `node_modules/next/dist/docs/` before writing framework code
- **React:** `19.2.4`
- **TypeScript:** `^5` — all source files use `.ts` / `.tsx`
- **Styling:** Tailwind CSS `^4` with `@tailwindcss/postcss` — v4 has breaking changes vs v3
- **Rich text editor:** Tiptap `^3.23.6` (used in admin)

### App Router & File Structure
```
workcocoon/
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout — Inter font, GTM, global metadata
│   ├── globals.css
│   ├── robots.ts               # Dynamic robots.txt
│   ├── sitemap.ts              # Dynamic sitemap (Supabase + static fallback)
│   ├── guide/[slug]/page.tsx   # Buying guide pages (ISR, revalidate=86400)
│   ├── reviews/[slug]/page.tsx # Product review pages
│   ├── categories/[slug]/page.tsx
│   ├── compare/[slug]/page.tsx
│   ├── deals/page.tsx
│   ├── admin/                  # Admin panel (blocked in robots.txt)
│   └── api/                    # API routes (blocked in robots.txt)
├── components/
│   ├── layout/                 # Container, Breadcrumbs, etc.
│   ├── product/                # ProductPick, GuideRecommendationBox, GuideComparisonTable
│   ├── affiliate/              # AffiliateDisclosureBar
│   ├── sections/               # MobileStickyPicksCTA, etc.
│   └── ui/                     # Badge, RichContent, etc.
├── lib/
│   ├── seo.ts                  # buildMetadata(), SITE_URL, SITE_NAME, SITE_DESCRIPTION
│   ├── supabase/server.ts      # createAdminClient(), isSupabaseConfigured()
│   ├── public-guides.ts        # getPublicGuideBySlug(), getPublicGuideSlugs(), etc.
│   ├── public-products.ts      # getPublicProducts()
│   ├── utils.ts                # formatDate(), scoreToColor()
│   └── amazon-links.ts         # amazonSearchLinks map (slug → Amazon search URL)
├── data/
│   ├── products.ts             # Static product seed data
│   ├── guides.ts               # Static guide seed data
│   ├── categories.ts           # categories[], getCategoryBySlug()
│   └── authors.ts              # authorToSlug(), getAuthorByName()
├── scripts/
│   ├── seed-products.ts
│   ├── seed-guides.ts
│   ├── seed-deals.ts
│   └── seed-site-settings.ts
├── public/
│   ├── logo-deskfinds.png / .svg / logo-deskfinds-official.png
│   ├── icon.webp
│   ├── hero-banner.jpg
│   ├── og-default.png          # Default OG image (1200×630)
│   ├── llms.txt / llms-full.txt
│   └── images/icons/           # Webp icons for homepage stats
├── next.config.ts
├── CLAUDE.md                   # This file
└── AGENTS.md                   # Next.js agent rules (referenced by CLAUDE.md via @AGENTS.md)
```

### Data Sources
- **Supabase:** Primary CMS for published products, guides, and deals. Uses `@supabase/supabase-js ^2.106.1`. Client created via `createAdminClient()` in `lib/supabase/server.ts`.
- **Static data files:** `data/products.ts`, `data/guides.ts`, `data/categories.ts` — used as fallback when Supabase is not configured or returns no results.
- **Sitemap strategy:** Supabase slugs take precedence; static data fills gaps. See `app/sitemap.ts`.

### Authentication
- **Admin login:** `iron-session ^8.0.4` with `SESSION_SECRET` env var
- Admin routes live under `/admin/` — fully blocked from crawlers

### ISR (Incremental Static Regeneration)
- Guide pages: `export const revalidate = 86400` (24 hours)
- `generateStaticParams()` pre-renders all known guide and category slugs at build time

---

## 3. Canonical Domain Rules

- **Canonical domain is always:** `https://www.workcocoon.com` (www, no bare `workcocoon.com`)
- **Non-www redirect** is handled in `next.config.ts`:
  ```ts
  // Matches host: workcocoon.com → redirects to https://www.workcocoon.com/:path*
  // permanent: true → HTTP 301
  ```
- **NEXT_PUBLIC_SITE_URL** must be set to `https://www.workcocoon.com` in production — `lib/seo.ts` strips trailing slashes: `process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")`
- **Homepage canonical** should match the final live URL used by the app — do not assume `/` vs no slash without checking
- **Internal page canonicals** should avoid trailing slashes unless the app intentionally uses `trailingSlash: true` in `next.config.ts`
- **All schema, sitemap, and OG URLs** must use the `www.workcocoon.com` domain
- **Legacy redirect:** `/about` → `/about-deskfinds` (301, in `next.config.ts`)
- All canonical URLs are built via `buildMetadata({ path })` — never construct them manually
- The `alternates.canonical` field is always set in `buildMetadata()`

---

## 4. SEO Metadata Rules

### buildMetadata() — always use this function

Located at `lib/seo.ts`. Required fields:

```ts
buildMetadata({
  title: string,        // Do NOT append "| WorkCocoon" — the function does it
  description: string,  // Unique per page, 120–160 chars
  path: string,         // e.g. "/guide/best-monitor-stands"
  image?: string,       // Absolute Supabase URL or relative /path — function handles both
  noIndex?: boolean,    // true for admin/draft pages
  type?: "website" | "article",  // "article" for guides and reviews
})
```

### Title Rules
- **Never** manually append `| WorkCocoon` — `buildMetadata()` appends it automatically
- The root layout uses `template: "%s | WorkCocoon"` — `buildMetadata()` uses `{ absolute: fullTitle }` to prevent double-suffix
- Guide/review titles should be descriptive: `"Best Monitor Stands for Small Desks"` not just `"Monitor Stands"`
- **Hard character budget — check before writing, not after:** `metaTitle` (the `data/guides/<slug>.ts` export) must be **≤48 characters**, because the site auto-appends `" | WorkCocoon"` (12 chars) on render, and the combined title must stay **≤60 characters** total or it gets flagged/truncated in search results and SEO tooling. Count the actual string length — `"Best Ryzen Mini PCs, Honestly Reviewed (2026)"` is already 46 chars before the suffix, so anything with a longer product name or an added qualifier will blow the budget. Prefer a plain `"Best X in 2026"` or `"Best X, Reviewed (2026)"` pattern over `"Best X, Honestly Reviewed (2026)"` when the product name itself is long.
- Before finalizing any `metaTitle`, run the actual string length check (`metaTitle.length + 12 <= 60`) — do not eyeball it. This was a recurring, systemic error across a prior 87-guide batch (most titles landed in the 65–80 char range) and must not recur.

### Description Rules
- Must be unique per page — never reuse the site-level `SITE_DESCRIPTION`
- **Hard character budget: 120–160 characters, no exceptions.** This is not a loose preference — SEO tooling flags anything outside this range as an error. A prior 87-guide batch shipped descriptions averaging 220–260 characters (some over 300) because they packed a full "content-gap" explainer sentence into the meta description instead of writing an actual concise summary; that pattern must not recur.
- Before finalizing any `metaDescription`, run the actual string length check (`120 <= metaDescription.length <= 160`) — do not eyeball it. If the natural sentence runs long, cut it — do not rely on the reader finishing a 250-character sentence in a search snippet that truncates around 155–160 characters anyway.
- For guides: describe what the guide covers and who it helps, in one tight sentence — save the deeper "content-gap" advisory angle for the in-body `introParagraphs` and `buyingCriteria`, not the meta description.
- For products: describe the product, its niche, and key differentiator

### OG Image Rules
- Default fallback: `/og-default.png` (must be 1200×630 px)
- Product/guide hero images: pass the absolute Supabase URL directly — `buildMetadata()` detects `startsWith("http")` and uses it as-is
- Do not use relative paths for OG images on Supabase-hosted content

### noIndex Pages
- All `/admin/**` pages must pass `noIndex: true`
- Draft content (status ≠ "published") must never be indexed
- `/api/**` routes are already blocked via `robots.ts`

---

## 5. Structured Data / Schema Rules

### Allowed Schemas

**Buying Guide pages** (`/guide/[slug]`):
```json
Article, BreadcrumbList, ItemList
```
- `Article`: headline, description, datePublished, dateModified, author (Person or Organization), publisher, mainEntityOfPage, image (only if real Supabase URL)
- `BreadcrumbList`: always 3 levels — Home → Buying Guides → Guide title
- `ItemList`: lists picks by name + URL only — **no prices, no ratings**

**Product Review pages** (`/reviews/[slug]`):
- Use `Article` schema + `BreadcrumbList` by default
- Do **not** add `Product` schema unless the page has verified product data that satisfies Google Product structured data requirements
- Do **not** add `Product` schema with only `name`/`description`/`url` — this can trigger Product rich result errors without fulfilling Google's required fields
- Do **not** add `Review`, `AggregateRating`, `Rating`, `Offer`, fake prices, fake `ratingCount`, or fake `reviewCount`

### Strictly Forbidden
- **`FAQPage` schema** on commercial/affiliate pages — low to no rich-result value for affiliate sites; keep schema conservative
- **`AggregateRating`** with values not sourced from real verified reviews (our scores are editorial, not crowd-sourced)
- **`Review` schema** claiming personal hands-on testing — we do not claim hands-on testing
- **Fake `priceRange` or `price`** in any schema — prices change; only use live affiliate links
- **`Organization` sameAs** with social profiles unless those profiles are actively maintained

### Author Schema
- Determined by `getAuthorByName()` from `data/authors.ts`
- If `author.isPerson === true` → use `"@type": "Person"` with `url: ${SITE_URL}/author/${slug}`
- If not a person → use `"@type": "Organization"`
- Never invent author URLs that don't have a real page

---

## 6. Affiliate Compliance Rules

### Link Attributes
All outbound affiliate links (Amazon, etc.) **must** include:
```html
rel="noopener noreferrer sponsored"
```
For Amazon browse links specifically (see `guide/[slug]/page.tsx`):
```html
rel="noopener noreferrer sponsored"
target="_blank"
```

### Disclosure Requirements
- Every page with affiliate links must show `<AffiliateDisclosureBar>` (from `components/affiliate/AffiliateDisclosureBar.tsx`)
- Required disclosure wording (exact): _"We may earn a commission when you buy through Amazon links. This guide is based on product specs, buyer feedback, use cases, and comparison criteria — not paid placement."_
- Disclosure must appear **above the fold** on buying guide pages — it is placed after the article header, before the picks box
- The `/affiliate-disclosure` page must remain accessible and linked from the footer

### What Is Forbidden
- Do not claim any brand partnership, sponsorship, or "best" designation based on payment
- Do not write "we tested" or "we tried" — use "we evaluated", "we researched", "based on product specs and buyer feedback"
- Do not create fake discount codes or coupon claims
- Do not use Amazon images directly in `<img>` tags unless compliant with Amazon's Product Advertising API terms — use Supabase-hosted images instead

### Allowed Image Domains (next.config.ts)
```
*.supabase.co/storage/v1/object/public/**
images.unsplash.com
images.pexels.com
m.media-amazon.com   ← only for compliant Amazon PA API usage
```

---

## 7. Content & Editorial Rules

### Honesty Policy — Non-Negotiable
- **Never write "we tested", "we tried", "in our lab", "we measured"** — we do not claim hands-on testing
- **Approved language:** "we evaluated", "we researched", "based on verified buyer feedback", "based on product specs", "our analysis"
- All scores are **editorial assessments** based on structured criteria — not measurements

### Required Sections for Buying Guides
Every `/guide/[slug]` page must include (in order). As of the 2026-07-18 template revision (see "Guide Page Template — Page Order & Mandatory Sections" below), the `data/guides/<slug>.ts` + `scripts/generate-guide-page.mjs` pipeline produces:
1. Breadcrumbs
2. Affiliate disclosure bar
3. Article header (title, description, meta row)
4. Hero image
5. **"Comparison Table"** — renamed from "Quick Picks", from `products[]`
6. Intro section
7. **"N Criteria to Look For Before Buying a [Product]"** — card grid, from `buyingCriteria[]`, heading dynamically includes the count and singular product noun, positioned before the reviews
8. Jump nav
9. Detailed product reviews (one section per product)
10. **"How We Evaluated These [Products]"** — methodology card grid, from `howWeEvaluated[]` (mandatory for guides created from 2026-07-18 onward), positioned after the reviews
11. **"How to Choose the Right [Products]"** — deep scenario-based advisory section, from `howToChoose[]` (mandatory for guides created from 2026-07-18 onward), positioned right after "How We Evaluated" and before the FAQ — this is the guide's primary content-gap section
12. FAQ section (if `faq.length > 0`)
13. "Bottom Line" section
14. Amazon browse CTA
15. Related guides

Legacy guides (predating 2026-07-18) built via the Supabase-backed `<GuideRecommendationBox>`/`<GuideComparisonTable>`/`<ProductPick>` component pipeline follow a similar but not identical structure — do not assume the two pipelines are interchangeable; check which pipeline a given guide actually uses (`app/guide/[slug]/page.tsx` dynamic route vs. a static `app/(site)/guide/<slug>/page.tsx` route) before editing.

### Scoring Criteria (Fixed — do not change weights)
| Criterion | Weight |
|---|---|
| Small-Space Fit | 25% |
| Build Quality | 20% |
| Ease of Use | 20% |
| Value for Money | 20% |
| Buyer Feedback | 15% |

### Advisory / Buying Criteria Section — MANDATORY in Every Guide

**This is the primary content-gap differentiator vs competitors. Do not skip it.**

Every buying guide (`/guide/[slug]`) must include a substantive "How to Choose" or "What to Look For" section containing **5 or more advisory headings**. This section must:

- Appear **before or immediately after the product list** — not buried at the bottom
- Contain **specific, actionable criteria** a buyer needs to evaluate — not generic filler
- Cover **tradeoffs competitors never explain** (e.g., "Why a 40dB motor matters for video calls", "Why weight capacity matters even if you're under 200 lbs", "The hidden cost of a narrow belt at 2 mph")
- Each criterion must have a **clear recommendation or rule of thumb** — not just a definition
- Be written from the angle of **"what would trip a first-time buyer"** — surface non-obvious gotchas

**In `data/guides/[slug].ts`:** Populate `buyingCriteria[]` with 5+ entries. Each entry:
```ts
{ criterion: "Short label (3-6 words)", explanation: "2-3 sentence advisory with specific numbers or thresholds." }
```

**In `page.tsx`:** The `buyingCriteria` section renders as a card with heading "How to Choose the Right One" above the product list. Do NOT omit this section if `buyingCriteria.length > 0`.

**Quality bar:** If a competitor article for the same keyword has a buying criteria section, ours must cover at least 2 points theirs does not. If competitors have none, ours becomes the strongest signal for topical authority.

### MANDATORY: "Criteria to Look For Before Buying a [Product]" must be substantive paragraphs, not one-liners (added 2026-08-21)

**This supersedes the "2-3 sentence" shape shown above** — that guidance produced criteria that were a label plus a thin, generic "verify this on the listing" filler sentence. Every `buyingCriteria[]` entry's `explanation` must now be a **3-4+ sentence paragraph** structured as:

1. **What it is** — explain the spec or feature in plain terms, in-line, as if the reader doesn't already know the jargon. Don't assume they know what the term means.
2. **Why it concretely matters** — a specific consequence or scenario, not an abstract claim. `"a coin-cell battery costs a couple of dollars to replace and lasts about a year, while a sealed rechargeable battery can't be swapped and eventually forces you to replace the whole unit"` is the bar; `"battery type matters"` is not.
3. **How to check it** — a concrete tip for verifying this spec from the actual product listing or spec sheet, so the reader can act on it immediately (e.g. "look for the exact number in the product title or bullet points, not just a marketing phrase like 'long battery life'").

**Still 5 criteria minimum per guide**, and each of the 5 must cover a genuinely distinct axis — don't let two criteria both boil down to "check the price" or "check the size" from slightly different angles. Do not invent numbers, standards, or claims not grounded in real, checkable specs; density should come from real reasoning, not padded filler sentences repeated across criteria with the nouns swapped.

This is the standard for every guide's "Criteria to Look For" section going forward, replacing the older one-line-explanation template shown above.

---

### Content-Gap Research Step — MANDATORY, Never Skip (added 2026-07-18)

**Every new guide must include a competitor content-gap research pass before the copy is written.** Skipping this step is the single most common quality failure in this project's guide pipeline — do not skip it to save time or tokens, even under token/time pressure.

**What this means in practice, before drafting `buyingCriteria`, `faq`, or `howWeEvaluated`:**
1. Run a `WebSearch` (or a small batch of searches covering a niche's shared sub-topics, not one search per guide if guides share a parent category — e.g. all "bookshelf" guides can share one research pass) for the guide's `mainKeyword` plus terms like "buying guide", "how to choose", "vs", or a safety/regulatory angle relevant to the product category.
2. Identify genuinely useful buyer knowledge that is either (a) missing from typical top-ranking pages, or (b) present but vague/wrong on competitor pages — measurement pitfalls, material/spec trade-offs, safety standards and their actual scope (do not assume a cited standard/certification applies to this exact product category — verify), common buyer mistakes, or trade-offs competitors gloss over.
3. Write 2-4 new `buyingCriteria` entries per guide that encode this research as specific, actionable advice with real numbers/thresholds — not generic restatements of the product specs already in the pick descriptions.
3a. **`faq` must have 5-6 entries per guide, never fewer than 5 — mandatory, added 2026-08-14.** A 1-2 question FAQ was flagged as a real defect in a shipped batch (looks thin/unfinished to readers and under-uses a genuine SEO surface). Cover a spread of angles per guide, not 5 variations on the same question: at least one compatibility/requirements question, one common-mistake/gotcha question, one comparison-tier question ("is X worth it over Y"), one practical how-to/setup question, and one edge-case or maintenance question. Every answer must still be backed by real research or mined product facts — do not pad count with generic filler.
4. Cite findings naturally in the copy (state as established buying knowledge, the way the rest of the site's content already reads) — do not write "according to a study" or otherwise expose the research process in the visible copy.
5. Never fabricate a statistic, standard, or regulation. If a claim can't be backed by what the search actually returned, leave it out.

**Efficient execution for multi-guide batches:** research once per shared topic cluster (e.g. 4-6 targeted searches covering the whole niche), then apply the findings selectively per guide — each guide only gets the subset of findings actually relevant to its specific angle. Do not force irrelevant findings into a guide just to check a box.

**This applies going forward to every new guide from 2026-07-18 onward** — both single guides and batch launches. It does not require retrofitting already-published guides unless the user explicitly asks for a retrofit pass.

---

### Guide Page Template — Page Order & Mandatory Sections (added 2026-07-18, corrected 2026-07-18)

As of `scripts/generate-guide-page.mjs`, every generated guide page follows this section order top to bottom. **Do not hand-write `page.tsx` for a new guide; always run the generator** so these sections are never accidentally omitted or misplaced.

```
Breadcrumbs → header → affiliate note → hero image
→ Comparison Table (products[])
→ intro paragraphs
→ "N Criteria to Look For Before Buying a [Product]"  (buyingCriteria[], card grid)
→ jump nav
→ individual product review sections
→ "How We Evaluated These [Products]"  (howWeEvaluated[], methodology card grid)
→ "How to Choose the Right [Products]"  (howToChoose[], deep scenario tables)  ← this is the content-gap section
→ FAQ
→ Bottom Line
→ Amazon browse CTA
→ Related guides
```

**Do not merge "How We Evaluated" and "How to Choose" into one section — they are two separate sections, both positioned after the product reviews, in that order, both before the FAQ.** An earlier revision of this rule mistakenly collapsed them into one; both must render independently.

Three exports are involved, and they serve **different purposes at different depths** — do not merge them or treat them as interchangeable:

1. **`buyingCriteria[]`** (existing, unchanged shape) → renders as **"N Criteria to Look For Before Buying a [Product]"**, a 2-column card grid, positioned **before** the product reviews. This is the quick, top-level orientation a buyer needs before reading pick-by-pick detail — short criterion + explanation pairs.
   ```ts
   { criterion: "Short label (3-6 words)", explanation: "2-3 sentence advisory with specific numbers or thresholds." }
   ```

2. **`howWeEvaluated[]`** (required as of 2026-07-18) → renders as **"How We Evaluated These [Products]"**, a 2-column card grid, positioned **right after** the product reviews (before "How to Choose"). 4-5 entries describing the guide-specific scoring methodology — category-specific angles (e.g. Stability, Adjustability, Build quality, Device compatibility, Value for price for a tablet-stand guide), not the generic site-wide "WorkCocoon Fit Score" weights from the Scoring Criteria table above reused verbatim.
   ```ts
   { title: "Stability", description: "Tested with a standard iPad Pro 11\" and a heavy 13\" Android tablet. Scored on tipping resistance under tapping and drawing load." }
   ```

3. **`howToChoose[]`** (required as of 2026-07-18) → renders as **"How to Choose the Right [Products]"**, positioned **after "How We Evaluated"** and **before** the FAQ. This is the deep, scenario-based advisory section — the guide's primary content-gap / E-E-A-T asset — and should look like a mini reference tool a reader would bookmark, not a restatement of the buying criteria above it. Model it directly on this reference guide: **https://www.workcocoon.com/guide/best-small-keyboards** ("How to Choose an Office Chair Under $100" section — by sitting duration, by room type, a height-matching table, a small-desk-compatibility table, a "when to spend more" table, a warranty quick-reference table). Each entry is one subsection:
   ```ts
   export interface HowToChooseSection {
     subheading: string;              // e.g. "By Sitting Duration", "Chair Height vs Your Height"
     intro?: string;                  // optional 1-2 sentence framing before the table/cards
     table?: { headers: string[]; rows: string[][] };  // scenario -> named pick mapping
     cards?: { label: string; text: string }[];         // alternative to a table for 2-4 item breakdowns
     note?: string;                   // optional closing callout (a practical tip, a caveat)
   }
   export const howToChoose: HowToChooseSection[] = [ /* 4-6 subsections */ ];
   ```
   **The defining trait of a good `howToChoose` table:** every row maps a concrete buyer situation (a measurement, a use case, a budget threshold, a room type) directly to a **named pick from this guide's `products[]`** — not a generic tip. If a row doesn't end in "→ therefore buy [specific product name]" or an equally concrete recommendation, it's not deep enough yet. This is where the mandatory content-gap research (see above) actually gets applied — the research findings should surface as these scenario rows, not as generic prose.

### MANDATORY: Standing `howToChoose` structure — 6 required sub-sections (added 2026-08-21)

**This is the concrete template for the "defining trait" rule above** — use this exact 6-part structure for every guide's `howToChoose[]` going forward, instead of an ad hoc set of 4-6 subsections. Every recommendation in every sub-section must name an actual product from this guide's current `products[]` — never a generic placeholder like "the budget option" with no name attached.

1. **By [primary attribute]** — a `table` mapping scenario → recommended pick. The primary attribute is whatever matters most for this category (e.g. "By Sitting Duration" for chairs, "By Room Size" for space heaters, "By Server Depth" for racks).
2. **By Budget** — a `table` mapping price range → recommended pick, using this guide's actual price tiers, not generic "budget/mid/premium" labels with no dollar figures.
3. **[Option A] vs [Option B]** — a genuine binary tradeoff native to this category (not a manufactured one), using `cards` with exactly two entries. Each side must (a) explain the underlying mechanism or tradeoff in plain terms, and (b) list which specific products in this roundup fall into that group. Close with a one-line recommendation in `note` (e.g. "Most buyers should default to X unless Y specifically applies").
4. **[A secondary decision axis specific to the category]** — a second `table` mapping a different preference or constraint (distinct from #1) → recommended pick. This should surface a genuinely different buyer concern, not a rephrasing of the primary attribute in #1.
5. **For [common specific use case] Specifically** — use `cards` with two entries labeled "Look for" (the specific spec or feature to check) and "In this comparison" (which named model in this guide satisfies it, and why). Pick a use case that's common enough to matter but specific enough that generic advice doesn't already cover it (e.g. "For Apartment Renters Specifically", "For a Home Office Video Call Setup Specifically").
6. **When to Spend More** — `cards` with exactly two entries: "Spend more if" and "Save if". Each must give reasoning tied to specific named products from this guide, not abstract price-tier advice.

Every `table`/`cards` entry across all 6 sub-sections must resolve to a real product name from this guide's own `products[]`. If a sub-section's recommendation can't be tied to an actual pick in the current comparison, rewrite it until it can — this table is the guide's most bookmark-worthy asset and generic entries defeat its purpose.

**When editing an EXISTING guide's `buyingCriteria`/`faq` only** (a content-gap retrofit pass on an already-published guide), you do not need to add `howToChoose` or regenerate the page unless the user explicitly asks for a full template upgrade on that guide. But any **newly created** guide from 2026-07-18 onward must include a real `howToChoose[]` (not an empty array) and go through the generator.

---

### CHANGED 2026-08-15: New guides no longer get a literal `app/(site)/guide/<slug>/page.tsx` route — do not run `scripts/generate-guide-page.mjs` for new batches

**Why this changed:** every literal `app/(site)/guide/<slug>/page.tsx` file gets eagerly rebuilt on **every single deploy**, forever, regardless of whether that guide changed. At ~1750 guides this exceeded Vercel Hobby's 45-minute build timeout — confirmed across multiple real Vercel builds and local build attempts, even after fixing an unrelated per-page Supabase call and removing the unused admin panel. The project can't move to Vercel Pro right now and is planning several hundred more guides, so the fix is architectural: stop adding new guides to the eager-build set at all. New guides render on first request via the existing dynamic `app/(site)/guide/[slug]/page.tsx` route and are ISR-cached from then on (`revalidate = 604800`, unchanged) — this costs **zero** build time no matter how many guides exist.

**What this means for the batch pipeline, starting now:**
1. Write `data/guides/<slug>.ts` exactly as before (unchanged — same `guideTitle`/`metaTitle`/`metaDescription`/`products`/`howWeEvaluated`/`howToChoose`/`buyingCriteria`/`faq`/`relatedGuides`/`mainKeyword`/`introParagraphs`/`lastUpdated`/`readTime`/`heroImage` shape).
2. Register the guide in `data/guides.ts` exactly as before (unchanged — the existing `append-guides-registry-*.mjs` pattern).
3. **Do NOT run `scripts/generate-guide-page.mjs`.** No literal `app/(site)/guide/<slug>/page.tsx` file should be created for a new guide.
4. **Run `node scripts/generate-guides-index.mjs`** and commit the resulting `data/guides-index.generated.ts`. This regenerates the slug → dynamic-import map that `app/(site)/guide/[slug]/page.tsx` uses to find and render the guide's rich content via `components/guide/RichGuidePage.tsx`. Skipping this step means the new guide's URL 404s.

The rendering itself (`components/guide/RichGuidePage.tsx`) is a faithful extraction of the exact JSX `generate-guide-page.mjs` used to emit per-file — same breadcrumb/heading/Amazon-search-link derivation logic, same section order, same schema markup. A guide rendered this way is visually and structurally identical to one that would have gotten a literal route file; only the build-time cost differs.

`scripts/generate-guides-index.mjs` only includes files that export the modern `products`/`howWeEvaluated`/`howToChoose`/`buyingCriteria` shape (same compatibility check `generate-guide-page.mjs` already used to skip legacy files) — it silently skips anything older, so it's always safe to re-run across the whole `data/guides/` directory.

**Existing already-literal guide pages are untouched by this policy** — they keep working exactly as before. Only *new* guides skip the literal-route step. (Separately, a first batch of already-published guides — the Reception Desks cluster, 98 guides — has been retroactively demoted off the eager-build path the same way, as a build-time fix; more clusters may follow the same treatment over time. Demoting an existing guide means deleting only its `app/(site)/guide/<slug>/` directory — never touch `data/guides/<slug>.ts` or its `data/guides.ts` registry entry, and always re-run `generate-guides-index.mjs` first so the slug is actually resolvable before the literal route disappears.)

---

### Content Tone
- Direct, practical, space-conscious — written for people with limited desk/room space
- No marketing superlatives without specific backing ("the best" must be qualified)
- Use "WorkCocoon" as the brand name — never "Desk Finds" (two words) or "deskfinds" (all lowercase)

### Amazon Rating / Review Count Display — FORBIDDEN (added 2026-08-13)

**Never display Amazon's star rating or review count anywhere in guide page content.** This includes the product badge row under "About this pick" and the "Rating" column in the Comparison Table. Amazon's affiliate program terms prohibit republishing their customer rating/review data on third-party sites — doing so risks penalties against the affiliate account. `scripts/generate-guide-page.mjs` must not render `product.rating` or `product.reviews` anywhere in the generated `page.tsx`.

- The `rating` and `reviews` fields may still exist in `data/guides/<slug>.ts` product data (useful internally for ranking/picking which product to feature), but they must never be rendered in the page output.
- This applies to all guides going forward and required a retrofit pass across all existing guides on 2026-08-13 (regenerated via `scripts/generate-guide-page.mjs` after the template was stripped of rating/review markup).
- Do not reintroduce a rating/review display, an `AggregateRating`/`Review` schema populated with Amazon's numbers, or any UI element surfacing this data without explicit user sign-off.

### Pros / Cons List Length (GuideProduct.pros / GuideProduct.cons)
- **Every product needs at least 3-4 `pros` entries.** Two pros reads thin to a reader and undersells a pick even when the product is genuinely good — this was flagged as a real defect in a shipped batch. Cons can be fewer (2-3 is fine) since editorial judgment naturally surfaces fewer genuine drawbacks than strengths for a product that made the cut to begin with, but don't pad cons artificially just to hit a count.
- Every pro and con must still be a real, mined fact (a spec, a feature, a tradeoff) — never generic filler like "reliable" or "good value" with nothing backing it up. Padding to 4 pros with a vague line is worse than 3 sharp ones; mine the `features` data harder before inventing filler.

### MANDATORY: Pros/Cons must be short, scannable, and friendly — not full analytical sentences (added 2026-08-18)

**A real defect flagged live across the Fireproof Safes and Office Credenzas batches (109 articles, 2026-08-18).** Every pro/con was a real, mined fact in reviewer voice (satisfying the rules above), but each entry was written as a long, formal, comparative sentence — e.g. `"Lifetime after-fire replacement guarantee backs the rating directly, not just a general warranty"` — which reads like analytical prose copied out of a spec sheet, not a quick scannable pro/con a reader can absorb in one glance. The user's exact words: pros/cons should be **"ngắn gọn, thân thiện dễ hiểu"** (short, friendly, easy to understand).

**Required going forward for every `pros`/`cons` entry:**
1. **Target roughly 6-14 words.** A pro/con is a scannable bullet, not a sentence with a subordinate clause. If it needs a comma-separated qualifier ("..., not just a...", "..., a detail most competitors skip...") to make its point, cut the qualifier — state the plain fact instead and let the reader draw the comparison.
2. **Write it the way you'd say it out loud to a friend**, not the way you'd write it in a spec comparison. "Two keys included, so losing one isn't a crisis" beats "A lifetime after-fire replacement guarantee backs the fire rating directly, not just a general warranty."
3. Still must be a real mined fact (per the rule above) — short does not mean vague. Cut words, not substance.
4. Before marking a batch done, spot-check word counts on a handful of `pros`/`cons` entries across the batch — if several run past ~16 words, the batch is not done.

### MANDATORY: Pros/Cons/Specs must be real key points, not truncated sentences — and three concrete generator bugs to never repeat (added 2026-08-22)

**Three real defects flagged live in the budget-tier batch generators (2026-08-22), all from script-driven `pros`/`specs`/`howWeEvaluated`/`relatedGuides` construction:**

1. **`pros`/`cons`/`specs` must be actual key points (roughly 2-6 words each), not a truncated sentence.** A prior fix (2026-08-18, above) got word count down to ~6-14 words but the entries were still built by chopping a full mined sentence mid-clause (e.g. `"Transform any surface into a smart whiteboard: works on nearly any"` — cut off awkwardly, still reads like a clipped sentence). The fix: Amazon feature bullets are almost always structured as `"Label: full sentence"` or `"[Bracketed Label] full sentence"` — that leading label **is** the real key point (`"Interactive Pen"`, `"Automatic Calibration"`, `"Wide compatibility"`). Extract and use that label directly for `pros`/`specs` instead of truncating the sentence that follows it. Only fall back to a clamped clause when no such label exists. Never leave a `pros`/`specs` entry ending on a dangling preposition, article, or conjunction ("...for", "...that", "...and").
2. **Never reconstruct a `"Label: description"` string from markdown where the label itself already contains a trailing colon inside the bold markers** (e.g. source text `**Live price gate:**`) **and then append another `": "` separator.** This produces a doubled colon (`"Live price gate:: description"`), which after any `split(/:\s*/)` produces an empty first "rest" segment and renders as a description with a leading stray `": "` (visible live on `howWeEvaluated` cards — screenshot-caught bug). Fix at the source: strip any trailing colon already inside the captured label before appending your own separator. Also make the downstream split defensive — `.split(/:\s*/).filter(Boolean)` before reassigning title/description — so a similar upstream slip can't reproduce the same visible bug.
3. **`relatedGuides` must never be left as a hardcoded empty array in a batch generator.** A generator script must compute real sibling links (e.g. other price tiers or variants in the same cluster) and populate `relatedGuides` in every emitted `data/guides/<slug>.ts` file — an empty `relatedGuides: []` silently drops the "Related Guides" section from the live page with no build-time signal, exactly like the empty-`specs`-array bug documented above (Guide-Generation Script Pitfalls, point 4).

**Before marking any new batch-generator script done:** open one generated file and manually check (a) every `pros`/`specs` entry is a real short key point, not a clipped sentence, (b) no `howWeEvaluated` description starts with a stray `:`, `,`, or other leftover punctuation, and (c) `relatedGuides` is non-empty and points to real, existing (or about-to-exist) sibling slugs. Then load the actual rendered page and visually confirm, per the existing rule below — a passing `tsc --noEmit` catches none of these three.

### MANDATORY: Every guide's intro paragraphs (and any other templated prose) must be genuinely unique per article — never a fill-in-the-blank template (added 2026-08-18)

**A second real defect from the same batch.** Both the Fireproof Safes and Office Credenzas generator scripts (`scripts/gen-firesafe-all.mjs`, `scripts/gen-officecred-all.mjs`) built `introParagraphs` from a single fixed two-sentence template per cluster, only swapping in the article's own title/keyword — e.g. every one of the 62 Fireproof Safes articles used the identical second sentence verbatim: `"We compared this cluster's current lineup on independent fire evidence, usable interior capacity, and how water or security claims are documented separately, since a safe's nominal size and marketing language regularly overstate what's actually verified."` This is near-duplicate content across dozens of live URLs and is a real thin-content/doorway-page risk under Google's and Bing's duplicate-content and spam policies, not just a stylistic nitpick.

**Required going forward for any batch-generated prose that appears on every article in a cluster** (intro paragraphs, "how we evaluated" framing text, or any other boilerplate-adjacent section):
1. **Vary the template by the same category classification already used for `howToChoose`/`faq`** (the `classify(title)` pattern) — write 3-5 distinct phrasings per category, not one phrasing per cluster, and rotate/select among them so no two articles in the same category read identically either.
2. The unique, article-specific noun phrase (the exact product/keyword) is not enough variation on its own — the surrounding sentence structure and reasoning must differ meaningfully between articles, not just the subject swapped into an otherwise identical sentence.
3. Before marking a batch done, run a mechanical duplicate check: extract every article's `introParagraphs` (or equivalent) and diff/grep for repeated multi-word phrases (8+ consecutive words) appearing across more than 2-3 articles. Any hit means the template needs more variation, not a one-off fix.
4. This applies to any future cluster generator script, not just the two named above — check this before considering a batch-generation script done.

### "About this pick" Product Description Rules (GuideProduct.description)
- Do NOT mention review count, purchase volume, or popularity signals ("most reviewed", "ranked by reviews")
- Do NOT use em dash or en dash anywhere in descriptions
- The `description` field is rendered by splitting on `\n\n` — each segment becomes a separate `<p>` tag in the UI

### MANDATORY: Product descriptions must be 2-3 full paragraphs with real comparative reasoning (added 2026-08-21)

**This supersedes the "4-6 sentences total" shape used previously** — that produced descriptions too thin to carry genuine positioning or verdict content. Every `description` must be **2-3 full paragraphs** (split with `\n\n`, each its own `<p>` tag), structured as:

1. **Opening paragraph** — introduce the product and its role in this specific price tier/comparison (top pick, budget alternate, niche pick, etc.), weaving in 1-2 real named specs pulled from the actual listing data. Ground every claim in real data — never invent numbers you don't have (review counts, star ratings, capacities) if the data source didn't return them.
2. **Positioning paragraph** — explain concretely how this pick compares to its siblings in the same guide: why it ranks where it does, and the real tradeoff that separates it from the pick immediately above or below it. Not a vague "great value" line — name the actual mechanism (e.g. "trades the steel frame of the pick above for aluminum, cutting weight by 4 lbs but dropping the load rating from 250 lbs to 150 lbs").
3. **Verdict paragraph** — a specific, honest "best for" framing naming the exact type of buyer or use case this pick suits, plus any real caveat (price not confirmed, thinner spec sheet than competitors, no listed weight rating, etc.) rather than a generic disclaimer.

**Never fabricate** hands-on testing claims, lab results, or specific numbers the data source didn't provide — richness must come from genuine specificity about real specs, price, and comparative reasoning, never invention.

**Before generating descriptions at scale** (any script-driven batch), write and eyeball ONE full product description against this bar first, rather than running a thin template across dozens of products and discovering the problem after publishing.

### Guide-Generation Script Pitfalls (added 2026-08-13) — check before running any custom `gen-*-data.mjs` script

When writing a throwaway data-generation script for a batch of guides (the pattern used for e.g. laptop-locks and mini-UPS batches), verify all four of these before running `generate-guide-page.mjs`, not after — each one caused a real, shipped bug in this project:

1. **No em dash (`—`) or en dash (`–`) anywhere in generated text**, including `description`, `buyingCriteria`, `howToChoose`, `faq`, and intro paragraphs — not just the product description field. Run `grep -c "—\|–" scripts/your-gen-script.mjs` before generating, and again on the output `data/guides/*.ts` files after. This rule was violated across an entire 16-article batch because the mined-feature descriptions used dashes as a stylistic connector; a global `" — " → ", "` replace fixed it, but the check should happen before writing, not after a user catches it live.
2. **`introParagraphs` must serialize as a multi-line array ending in a bare `];` on its own line**, e.g. `JSON.stringify(intro, null, 2)`, never `JSON.stringify(intro)` (single-line). `scripts/generate-guide-page.mjs` extracts `introParagraphs` via the regex `/export const introParagraphs[^=]*=\s*\[([\s\S]*?)\n\];/` — if the array is single-line, this regex fails to close at the intro array and instead greedily matches all the way through to the *next* `\n];` in the file (typically the end of the `products` array), silently pulling every product field (id, badge, price, image URL, full description, pros, cons) into the rendered intro section as literal `<p>` tags. This produces a visibly broken page that still returns HTTP 200 and passes `tsc`, so it will not be caught by the standard verification steps — only by opening the page.
3. **FAQ entries must use `{ q: "...", a: "..." }` keys**, not `{ question: "...", answer: "..." }`. The generated `page.tsx` template renders `item.q` / `item.a` directly; the wrong key names produce an empty-looking FAQ section with no error anywhere in the build.
4. **Every product's `specs` array must be populated with 2-3 short, real spec highlights** (e.g. `"20,000mAh with AVR regulation"`, `"36W max, 12-month warranty"`), mined from the same feature data as the description — never leave `specs: []`. The UI renders these as visible chip badges directly under the price in both the product card and comparison view; an empty array silently drops that entire row from the page with no build-time signal.

None of these four bugs throw a build error or a TypeScript error — they only show up as visibly wrong output in the browser. **Always load the actual guide page in a browser (or `curl` it and grep for expected content) after running a new custom gen script, before telling the user a batch is done** — `tsc --noEmit` passing is not sufficient evidence the pages render correctly.

### MANDATORY: Sibling articles in the same keyword cluster must not end up reviewing the identical product set (added 2026-09-12)

**A real defect a live user caught by eye across a 152-article Halloween batch**: 106 of 152 articles (70%) had byte-identical `products[]` review content (same picks, same rank order, same generated descriptions/badges/pros/cons) as at least one sibling article. Root cause: the batch's `classify.mjs` mapped each row's title to PA-API search queries via keyword-pattern matching (e.g. `/laser/`, `/window/`, `/outdoor/`), but roughly 60% of titles in a large keyword-cluster batch (e.g. "Best 3D Halloween Projectors", "Best Animated Halloween Projectors", "Best Halloween Projectors for Kids" — all real, distinct SEO keywords) matched **none** of the patterns and silently fell through to the same 2 generic base queries as every other row in that category. Since the whole downstream pipeline (candidate interleaving → name-dedup → rank/badge assignment → description generation) is fully deterministic given the same input ASINs, an identical query set produced byte-identical output — this is invisible to every existing verification step (`check_all.mjs`, `scan_artifacts.mjs`, `scan_truncation.mjs`, `tsc --noEmit`) since none of them compare *across* articles, only within one.

A closely related variant hit the same batch's price-tier ("Under $X") articles: candidate selection took the pool's first N eligible (price ≤ ceiling) items in arbitrary search-result order, so once a low ceiling's top-8 already satisfied every higher ceiling too, **every higher-priced tier kept re-picking the identical cheap top-8** instead of surfacing the newly-affordable pricier options a higher ceiling should unlock.

**Required for every future keyword-cluster batch (any batch producing 10+ articles sharing a category), before registering/pushing:**
1. **After generating queries per row, audit the actual query-assignment coverage**: count how many rows fall through to only the base/generic query set with zero distinguishing terms. A keyword pattern in the title (an adjective, a material, a size, a use-case, a numeric spec) that matches no regex branch is a signal the classifier needs another branch — expand keyword-pattern coverage aggressively rather than accepting a large "no extra query" bucket.
2. **A numeric claim in a title (a size like "12 ft", a spec like "400W", a length like "50 ft") is a real, checkable fact, not just a search term** — filter candidates by whether their own title actually contains a matching (or close-tolerance) number, so a "12 ft Skeleton" article doesn't end up reviewing arbitrary-sized skeletons. If no real product exists at the claimed size/spec (verify against the actual sourced pool, not assumption), exclude the row via `EXCLUDE_SLUGS` rather than force a mismatch.
3. **Before marking any keyword-cluster batch done, run a mechanical cross-article duplicate check**: extract every article's `products[].name` list (or ASIN list) and group articles by identical (or near-identical, e.g. same first 3 names) product sets. Any group of 2+ is a real defect requiring a fix, not a rounding error — this exact check is what caught the 106/152 instance and takes under a minute to run (`Object.values(groupedByProductNames).filter(g => g.length >= 2)`), but nothing in the existing verification suite does this automatically, so it must be run as an explicit extra step for cluster batches.
4. **For price-tier ("Under $X") articles specifically**: sort eligible candidates by price and take an evenly-spaced spread across the full 0..ceiling range, not just the first N in pool order — this both fixes the duplicate-tier problem and produces a more honest article (showing the real price range available under that ceiling, not just the cheapest handful repeated at every tier).
5. **Even after steps 1-4, keep a deterministic per-slug rotation of the final candidate list as a last-resort safety net** (rotate the candidate array by a hash-of-slug-derived offset before the name-dedup/selection loop) for the residual cases where two article titles are genuine synonyms with no real distinguishing sub-market (e.g. "Halloween Projector Lights" vs "Halloween Projectors" at the same price ceiling) — this still draws only from the real, on-topic, price-eligible pool, it just avoids two synonymous titles rendering byte-identical review content.

This is a distinct failure mode from the existing "duplicate intro paragraphs" pitfall (see the mandatory intro-uniqueness rule elsewhere in this file) — that rule covers templated *prose* reuse; this one covers the *underlying product selection* reuse, which is a more serious defect since it means two different keyword-targeted URLs serve literally the same comparison and verdict, not just similar wording.

### FORBIDDEN: Never call `getPublicGuideBySlug()` (or any Supabase query) inside a static guide page's own component (added 2026-08-15)

`scripts/generate-guide-page.mjs` must **never** emit `import { getPublicGuideBySlug } from "@/lib/public-guides"` or `const guide = await getPublicGuideBySlug(...)` inside a generated `app/(site)/guide/<slug>/page.tsx`. Use `fallbackHeroImage` (the `heroImage` export from the guide's data file) directly — never fetch a DB override for it.

**Why this is forbidden:** every static guide page under `app/(site)/guide/<slug>/page.tsx` already gets its full content from a literal `data/guides/<slug>.ts` import — it needs nothing from Supabase. An earlier version of the generator template called `getPublicGuideBySlug()` anyway, purely to optionally override the hero image with a DB value that almost never differs from the static one. This meant every static page issued a real Supabase network call during Next.js's "Collecting page data" build phase. That cost is invisible at low guide counts but scales linearly — at ~1750 static guides it caused Vercel builds to hang and time out at 45+ minutes with no error message, just a hang at "Collecting page data using 1 worker ...". This was misdiagnosed twice as a TypeScript-check timeout before the real cause (per-page Supabase calls) was found. Fixed by removing the call entirely and pointing `heroImg` straight at `fallbackHeroImage`; a full codemod pass (`scripts/fix-remove-supabase-per-page-call.mjs`) fixed all ~1788 already-shipped static pages retroactively.

**This does not apply to the dynamic `app/(site)/guide/[slug]/page.tsx` route** — that route legitimately serves DB-only (non-statically-routed) guides and must keep its Supabase call.

**Before shipping any new custom `gen-*-data.mjs` batch or touching `generate-guide-page.mjs`:** run `grep -rln "getPublicGuideBySlug" "app/(site)/guide" | grep -v '\[slug\]'` — it must return nothing. If it returns any static-route file, the generator template has regressed and needs the same fix applied again.

### MANDATORY: Mine the real `features` data before writing any description — never write generic filler

**This is a recurring, systemic failure mode — do not repeat it.** A batch of 17 guides (carts cluster, 2026-08-09) shipped with product descriptions that were pure filler: paraphrased rating/price/capacity with no real product-specific detail (e.g. "A proven, well-documented choice... strong review base... reasonable option"). This reads as templated and provides zero buyer value, even though the *data* to do better was already sitting in the fetch script's cached JSON (`scripts/lookup-*.json`, `data-*.json`) the whole time — the API's `itemInfo.features` bullet points contain genuinely specific details (exact dimensions, bolt/hinge specs, wattage per port, included accessories, unique mechanisms) that were simply never read before writing.

**Required workflow for every product description, no exceptions:**
1. Before writing a single description, dump the full `features` array for every ASIN in the batch (e.g. `node -e "..."` printing `lookup[asin].features.join('\n')` per ASIN) and actually read it.
2. Pull out 2-4 concrete, specific facts per product — exact measurements, a named mechanism (e.g. "18mm locking bolts", "magnetic auto-lock door", "one-point lock with 2 cable grommet holes"), a wattage/port spec, an included-accessory list, a distinguishing behavior no other pick in the same article has.
3. Build the description around those specifics, explaining *why* the detail matters to the buyer's actual use case — not just restating the spec sheet as a list.
4. **A description is not acceptable if it could be reused verbatim for a different product in the same category by swapping the name.** If you can't point to a sentence that only makes sense for *this exact ASIN*, go back to the features data.
5. This applies per-article even when the same ASIN reappears across sibling guides (e.g. the same cart shows up in both "best laptop charging carts" and "best laptop charging carts for schools") — reframe the same real facts around that article's specific angle (a district-procurement angle vs. a home-office angle) rather than copy-pasting the paragraph. Do not, however, re-fetch data you already have cached for that ASIN.
6. Before marking a batch done, spot-check: pick 3 random product descriptions and ask "does this sentence exist because of a real feature, or because it sounds plausible?" If any answer is the latter, the batch is not done.

### MANDATORY: Mining ≠ copy-pasting — reading real features is only step one, the description must be *rewritten* in reviewer voice

**A second, distinct failure mode on top of #7 above — do not repeat it either.** The Conference Tables cluster (93 articles, 2026-08-16) shipped with `description`/`pros`/`cons` that *did* pull from real `itemInfo.features` text (satisfying the "no generic filler" rule) but left it almost verbatim: raw Amazon bullet headers (e.g. `"Robust Build & Versatile Layout Options: The tabletop is assembled from two pieces of premium MDF, with a."`) were left in as if they were prose, sometimes truncated mid-sentence where the source bullet had been cut off. The user caught this live on the rendered page — a `specs` pill and a `pros` line reading as an unfinished, copy-pasted product-listing fragment, not an original sentence a reviewer would write.

**The fix, required for every mined field going forward:**
1. Read the real feature text first (per the workflow above) — this step was never the problem.
2. Then **close the source text and write the description from what you learned**, in your own sentences, the way `scripts/recd-products.mjs` does it (the approved gold-standard reference — study it before writing a new product dictionary). Never paste an Amazon bullet's header phrase (the `【...】` / `ALL CAPS:` / `Title Case:` lead-in) into `description`, `pros`, or `cons` as if it were your own sentence.
3. `specs` entries must be short factual phrases (roughly 5–12 words, e.g. `"46.46\"L x 19.69\"W desktop, 30\" height"`), never a full sentence and never a truncated fragment — if a spec doesn't fit in a short phrase, it belongs in `description` instead.
4. `pros`/`cons` must each be a complete, original evaluative sentence making a comparative or evaluative claim, not a restated marketing bullet.
5. Before marking a batch done, grep the generated `data/guides/*.ts` files for tell-tale copy-paste artifacts: bullet-header punctuation left mid-string (`":"` immediately after a short capitalized phrase inside a `description`/`pros`/`cons` array value), and sentences that end mid-clause (no closing punctuation, or trailing on a dangling preposition/article like `"...with a."`). Either is a sign the source bullet was pasted, not rewritten.

---

## 8. Scoring Rules

### Score Label
- The editorial score is called the **"WorkCocoon Fit Score"** — use this exact label in UI and content
- Scores are on a **0–10 scale** (e.g., `8.4`)
- `scoreToColor()` from `lib/utils.ts` maps score ranges to Tailwind color classes — always use this function for score display, never hardcode colors

### Schema Restrictions
- **Do not** emit `AggregateRating` schema for WorkCocoon Fit Scores — they are editorial, not crowd-sourced ratings
- If a product has real Amazon review data (count + rating from the PA API), a `Review` or `AggregateRating` schema may be considered — but only with real, sourced values
- Do not invent `ratingCount`, `bestRating`, or `worstRating` values

### Score Display
- Show scores with one decimal place: `alt.scores.overall.toFixed(1)`
- Use `scoreToColor(score)` for the CSS class — do not hardcode color classes on score elements

---

## 9. Image Rules

### Alt Text
- All `<Image>` components must have descriptive `alt` text — never empty string `alt=""` except for purely decorative SVG icons with `aria-hidden="true"`
- Product images: `alt={product.name}` — include product name
- Guide hero images: `alt={guide.title}`
- Logo: `alt="WorkCocoon logo"`

### File Naming
- Use kebab-case: `best-monitor-stand-review.jpg` not `BestMonitorStand.jpg`
- Product images stored in Supabase Storage — path: `/storage/v1/object/public/**`
- Static public assets in `public/` — referenced as `/filename.ext`

### OG Images
- Required size: **1200 × 630 px**
- Default OG image: `public/og-default.png` — must always exist
- Guide/product OG: pass absolute Supabase URL to `buildMetadata({ image: "https://..." })`

### next/image Usage
- Always use `<Image>` from `next/image` for content images — never raw `<img>` tags for above-the-fold content
- Use `fill` + `sizes` prop for responsive images in card grids:
  ```tsx
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  ```
- Use `priority` prop on hero/LCP images

### Amazon Images
- `m.media-amazon.com` is in `remotePatterns` — only use for PA API compliant image serving
- Do not hotlink Amazon product images outside of PA API terms

---

## 10. URL & Content Architecture

### Route Patterns
| Route | Purpose |
|---|---|
| `/guide` | All buying guides index |
| `/guide/[slug]` | Individual guide OR category listing page |
| `/reviews` | All product reviews index |
| `/reviews/[slug]` | Individual product review page |
| `/categories/[slug]` | Category hub page |
| `/compare` | Compare index |
| `/compare/[slug]` | Category comparison OR VS article |
| `/deals` | Deals/offers page |
| `/author/[slug]` | Author bio page |
| `/admin/**` | Admin panel (no-index, robots blocked) |
| `/api/**` | API routes (robots blocked) |

### Slug Rules
- All slugs are **lowercase kebab-case**: `best-monitor-stands-for-small-desks`
- Guide slugs and category slugs can overlap — `guide/[slug]/page.tsx` checks `getCategoryBySlug(slug)` first; if matched, renders category listing instead of individual guide
- **Never change an existing slug** without adding a 301 redirect in `next.config.ts`

### VS Compare Articles
- Static VS articles live at `/compare/[vs-slug]`
- Existing: `/compare/monitor-stand-vs-monitor-arm` (priority 0.8 in sitemap)
- These are not category-based — they are manually added to the sitemap in `app/sitemap.ts`

### Sitemap Structure
- Generated dynamically in `app/sitemap.ts`
- Static pages, guide pages, review pages, category pages, compare pages, VS pages
- Supabase data takes precedence; static fallback fills gaps
- Sitemap URL: `https://www.workcocoon.com/sitemap.xml`

---

## 11. Internal Linking Rules

### Required Links
- Every buying guide must link to at least one related guide via `relatedGuideSlugs`
- Every product pick in a guide links to its full review page at `/reviews/[slug]`
- The "How We Picked" section links to `/how-we-review`
- The affiliate disclosure bar links to `/affiliate-disclosure`
- Category tags in guide headers link to `/categories/[categorySlug]`
- Author bylines link to `/author/[authorSlug]` via `authorToSlug()` from `data/authors.ts`

### Hub Links
- `/guide` index links to all buying guides
- `/categories/[slug]` links to all guides in that category
- Each guide links back to `/guide` via breadcrumbs

### Broken Link Prevention
- Before adding `relatedGuideSlugs` to a guide, verify the target slug exists in `data/guides.ts` or is published in Supabase
- Before adding `recommendedProductIds`, verify the product ID exists in `data/products.ts` or Supabase
- The `alternatives` array on a product uses product IDs — validate they exist before publishing
- Run `npm run build` to catch any `notFound()` calls that indicate broken references

---

## 12. Known SEO Fixes Already Completed

Do not undo these:

- **Non-www → www redirect** added to `next.config.ts` with `permanent: true` (301)
- **`/about` → `/about-deskfinds` redirect** added to `next.config.ts` with `permanent: true`
- **Double title suffix bug fixed** — `buildMetadata()` uses `{ absolute: fullTitle }` to prevent `"Title | WorkCocoon | WorkCocoon"`
- **`FAQPage` schema removed from commercial pages** — low/no rich-result value for affiliate pages; avoided to keep schema conservative
- **Canonical URLs** always set via `buildMetadata()` `alternates.canonical` field
- **Security headers** set globally in `next.config.ts`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- **AI crawler allowlist** in `robots.ts` — GPTBot, ClaudeBot, PerplexityBot, etc. are explicitly allowed
- **IndexNow auto-ping on publish** — `.github/workflows/indexnow.yml` runs on every push to `main` that touches `data/guides/**` or `app/(site)/guide/**`, waits 90s for the Vercel deploy to go live, then runs `node scripts/indexnow.mjs --auto` which diffs the pushed commit for new/changed guide slugs and submits them to Bing + Yandex via the IndexNow API. Current key file: `public/a7c91f60c6ae407994153f996878409e.txt` (must match the `KEY` constant in `scripts/indexnow.mjs`). To manually ping specific slugs: `node scripts/indexnow.mjs <slug1> <slug2> ...`. Do not delete the key `.txt` file from `public/` or IndexNow submissions will fail verification. `scripts/ping-indexnow.mjs` is a legacy one-off script (older key, hardcoded slug list) kept for historical reference — use `scripts/indexnow.mjs` going forward.
- **`/admin` and `/api/` blocked** in `robots.ts`
- **Supabase + static fallback** in sitemap — site doesn't break if DB is unreachable
- **OG image handling** — `buildMetadata()` correctly handles both absolute Supabase URLs and relative paths
- **`revalidate = 86400`** on guide pages — prevents stale ISR cache issues
- **`generateStaticParams()`** on guide pages — pre-renders all known slugs at build time
- **`ItemList` schema** on guide pages uses only `name` + `url` — no fake prices or ratings
- **Author schema** conditionally uses `Person` vs `Organization` based on `isPerson` flag in `data/authors.ts`
- **Amazon browse CTA** uses `rel="noopener noreferrer sponsored"` and `target="_blank"`

---

## 13. Current SEO Caution Areas

Handle these carefully going forward:

- **Slug changes:** Any existing `/guide/[slug]` or `/reviews/[slug]` URL change requires a 301 redirect in `next.config.ts` — Google has indexed these pages
- **`revalidate` value:** Currently 86400 (24h). Do not lower this without understanding CDN cache costs; do not raise it above 604800 (7 days) for guide pages that update frequently
- **Static vs Supabase data sync:** If a guide is published in Supabase with a slug that differs from `data/guides.ts`, both may appear in the sitemap. Audit `app/sitemap.ts` merge logic before bulk-publishing
- **`m.media-amazon.com` images:** In `remotePatterns` but Amazon ToS restricts image hotlinking outside PA API — verify compliance before using
- **Google Analytics ID `G-NR734FVRW1`** is hardcoded in `app/layout.tsx` — do not change without confirming the correct GA4 property
- **`/compare/[slug]`** dual-purpose route (category compare + VS articles) — ensure new VS articles don't accidentally match a category slug
- **Author pages `/author/[slug]`** — linked from guide bylines; if the route doesn't exist or returns 404, it creates broken internal links. Verify author slugs in `data/authors.ts` match existing pages
- **`llms.txt` and `llms-full.txt`** in `public/` — AI-readable site description files. Keep these updated when site structure or content scope changes significantly

---

## 14. Build, Lint & QA Commands

All commands run from the `workcocoon/` directory.

### Development
```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
```

### Production Build
```bash
npm run build        # Full Next.js production build — runs type-check, catches broken routes
npm run start        # Serve production build locally
```

### Linting
```bash
npm run lint         # ESLint (eslint-config-next 16.2.6)
```

### Database Seeding
```bash
npm run seed:products   # npx tsx scripts/seed-products.ts
npm run seed:guides     # npx tsx scripts/seed-guides.ts
npm run seed:deals      # npx tsx scripts/seed-deals.ts
npm run seed:settings   # npx tsx scripts/seed-site-settings.ts
```

Run seed scripts in order: `seed:products` → `seed:guides` → `seed:deals` → `seed:settings` (guides reference product IDs).

### TypeScript Check (no emit)
```bash
npx tsc --noEmit
```

### Pre-commit Gate
Before committing any change that touches routes, metadata, or schema:
1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run lint` — zero ESLint errors
3. `npm run build` — successful build with no `notFound()` warnings
4. Manually verify the changed page's `<title>` tag does not contain `| WorkCocoon | WorkCocoon`
5. Verify canonical URL is correct (`/guide/slug` not `/guide/slug/`)

---

## 15. Deployment & Environment

### Platform
- **Vercel** (inferred from `vercel.svg` in `public/` and standard Next.js deployment)
- The `next.config.ts` domain redirect handles non-www → www at the application layer (works on Vercel)

### Required Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `ADMIN_EMAIL` | Admin login email | `admin@workcocoon.com` |
| `ADMIN_PASSWORD` | Admin login password | (strong password, min 16 chars) |
| `SESSION_SECRET` | iron-session encryption key | min 32 characters |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role JWT | (long JWT string) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://www.workcocoon.com` |

### Secrets Policy — Critical
- **Never commit `.env.local`** — it contains live Supabase service role keys and admin credentials
- `.env.example` in `workcocoon/` is the template — keep it updated but with placeholder values only
- `SUPABASE_SERVICE_ROLE_KEY` has full database access — treat as a root credential
- `SESSION_SECRET` must be at least 32 characters; use a cryptographically random string in production
- Rotate `ADMIN_PASSWORD` before any public launch — the dev default `admin123` must never reach production
- Set all env vars in Vercel dashboard under Project Settings → Environment Variables

### isSupabaseConfigured()
- `lib/supabase/server.ts` exports `isSupabaseConfigured()` — all Supabase calls are gated behind this check
- If env vars are missing, the app silently falls back to static data — it does not crash
- This means a build without Supabase env vars will succeed but serve static data only

### Server Actions
- Max body size: `10mb` (set in `next.config.ts` `experimental.serverActions.bodySizeLimit`)
- Do not increase this without confirming Vercel plan limits

---

## 16. Agent Workflow Rules

### Before Writing Any Code

1. **Read this file (`CLAUDE.md`) first** — understand the project before touching anything
2. **Read `AGENTS.md`** — contains critical Next.js version-specific rules
3. **Read the relevant source file** before editing it — never edit blind
4. **Check `lib/seo.ts`** before adding any metadata — use `buildMetadata()`, never construct metadata objects manually
5. **Check `next.config.ts`** before adding redirects — follow the existing pattern exactly

### Before Touching Routes or Pages
- Verify the slug does not already exist in `data/guides.ts` or `data/categories.ts`
- Check `app/sitemap.ts` to understand how the new page will be indexed
- Confirm `generateStaticParams()` will include the new page if it needs SSG

### Before Adding Schema / JSON-LD
- Re-read Section 5 of this file
- Never add `AggregateRating`, `Review` claiming personal testing, or `FAQPage` on commercial pages

### Before Adding Affiliate Links
- Use `rel="noopener noreferrer sponsored"` — not just `nofollow`
- Verify `<AffiliateDisclosureBar>` is present on the page

### Reporting Format
When completing a task, report:
```
Files changed: [list absolute paths]
SEO impact: [none | low | medium | high — with brief reason]
Redirects added: [none | list]
Schema changes: [none | describe]
Build status: [passed | not verified]
```

### What Agents Must Not Do
- Do not change the canonical domain from `www.workcocoon.com` to anything else
- Do not remove the non-www redirect from `next.config.ts`
- Do not add `AggregateRating` schema with editorial scores
- Do not write "we tested" or "we tried" in any content
- Do not remove the `revalidate = 86400` from guide pages without explicit instruction
- Do not commit `.env.local` or any file containing real secrets
- Do not change the Google Analytics ID without explicit confirmation
- Do not rename slugs of published pages without adding a 301 redirect

---

## 17. Recommended Sprint Order

Prioritized next steps based on current architecture:

1. **Author pages** (`/author/[slug]`) — guide bylines link to these; 404s hurt internal linking and E-E-A-T signals. Create author profile pages using `data/authors.ts`.

2. **`llms.txt` / `llms-full.txt` update** — ensure `public/llms.txt` accurately describes current site structure, content categories, and affiliate disclosure. AI crawlers read this.

3. **Category hub content** (`/categories/[slug]`) — add editorial descriptions and featured guide links to each category page. Currently these may be thin.

4. **Compare pages content** (`/compare/[slug]`) — ensure each category compare page has substantive content, not just a product table. Thin compare pages are low-quality signals.

5. **Deals page freshness** (`/deals`) — affiliate deal pages with stale prices are a trust issue. Add a "prices last checked" date and consider a shorter `revalidate` interval.

6. **`og-default.png` audit** — confirm the file exists at `public/og-default.png` at exactly 1200×630 px. Missing default OG image causes social share failures.

7. **Footer internal links audit** — confirm `/affiliate-disclosure`, `/privacy-policy`, `/how-we-review`, and `/contact` are all linked from the footer and that those pages exist and are not 404.

8. **Seed script idempotency** — review `scripts/seed-products.ts` and `scripts/seed-guides.ts` to ensure re-running them does not create duplicate records in Supabase (upsert, not insert).

9. **Static data sync** — periodically reconcile `data/products.ts` and `data/guides.ts` with Supabase — remove products/guides from static files once they are stable in the database.

10. **Performance: LCP images** — audit guide hero images; add `priority` prop to the first `<Image>` on guide pages to improve Core Web Vitals.

---

## 18. Final QA Checklist

Run this checklist before every commit that touches pages, metadata, content, or schema.

### TypeScript & Build
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` completes successfully

### Metadata
- [ ] Page `<title>` does not contain `| WorkCocoon | WorkCocoon` (double suffix)
- [ ] `description` is unique, 120–160 chars, not the default `SITE_DESCRIPTION`
- [ ] `buildMetadata()` used — no manual `Metadata` object construction
- [ ] Canonical URL matches the page's actual URL, no trailing slash

### Structured Data
- [ ] No `AggregateRating` with editorial/invented values
- [ ] No `FAQPage` schema on pages with affiliate links
- [ ] No `Review` schema claiming personal hands-on testing
- [ ] `ItemList` contains only `name` and `url` — no prices, no ratings
- [ ] Author schema uses `Person` or `Organization` correctly per `data/authors.ts`

### Affiliate & Compliance
- [ ] All outbound affiliate links have `rel="noopener noreferrer sponsored"`
- [ ] `<AffiliateDisclosureBar>` present on every page with affiliate links
- [ ] No "we tested" / "we tried" language in any content
- [ ] No fake discount codes, partnerships, or sponsorship claims

### URLs & Redirects
- [ ] No slug was renamed without a 301 redirect added to `next.config.ts`
- [ ] No trailing slashes on internal `href` values
- [ ] All `relatedGuideSlugs` reference slugs that actually exist
- [ ] All `recommendedProductIds` reference IDs that actually exist

### Images
- [ ] All `<Image>` components have non-empty `alt` text
- [ ] Hero/LCP images have `priority` prop
- [ ] OG image is 1200×630 px or an absolute Supabase URL
- [ ] No raw `<img>` tags for content images

### Security
- [ ] No secrets in staged files (`.env.local`, JWT tokens, passwords)
- [ ] Admin routes have `noIndex: true` in metadata
- [ ] `robots.ts` still blocks `/admin`, `/api/`, `/_next/`
