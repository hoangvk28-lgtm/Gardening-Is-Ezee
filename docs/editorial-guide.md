# Gardening Is Ezee — Editorial Guide

Rules for rewriting migrated DeskFinds/WorkCocoon guides into Gardening Is Ezee's voice.
Reference articles: `/desk-setup/best-monitor-arms`, `/chairs/best-office-chair-under-300`.
Machine-checkable rules are enforced by `scripts/audit-editorial.ts` (see bottom).

## Positioning and voice
- **Publication:** Gardening Is Ezee. Independent ideas, guides and recommendations for better workspaces.
- **Voice:** calm, informed, precise, practical, design-aware, skeptical of marketing claims, confident without promotion.
- **Principle:** reader problem → context → evidence → trade-off → recommendation (never keyword → features → praise → CTA).
- **Lens:** practical fit, compatibility and trade-offs. DeskFinds is price/deal-led; WorkCocoon is lifestyle/comfort-led.

## Facts and sourcing
1. Preserve supported product names, ASINs, specs, prices, ranking, URLs, affiliate URLs, internal links and useful FAQ topics.
2. Never invent facts. If sources conflict, flag them and do not guess.
3. **Never invent hands-on experience.** No "we tested / used / measured / after months of use / our lab" unless documented. One methodology sentence per roundup intro is enough: "Our comparison is based on published specifications, included hardware, compatibility and price position, not hands-on testing."
4. **No internal/AI language.** Never "the source data", "dataset", "provided data". Use "the manufacturer lists", "the published specifications", "the listing does not specify".
5. Fact-check every statement: A = supported (keep), B = reasonable interpretation (use cautious wording), C = unsupported (remove or flag).
6. Buyer feedback: "Buyer feedback frequently mentions…", never "users love…", and only when the source supports it. **No star ratings in prose.**
7. Prices: never a permanent attribute. Use "at the time of writing", "typically" or relative position.

## Titles, dek, metadata
8. Do not keep the sister-site title. SEO title: `Best [Product] for [Context] (2026)`. H1: `The Best [Product] for [Editorial Outcome]`. The year is optional in the H1.
9. The dek says what was compared and what decision the guide supports. Put it in `data/guide-deks.ts`. It is not the meta description.
10. Rewrite the meta description to the new angle, with no price or count stuffing ("under $300" is fine when it is the search intent).
11. Keep structured data consistent: Article headline/description, ItemList name/description, OG and Twitter. Update both the rich file and the `data/guides.ts` registry (`title`, `metaTitle`, `description`).
12. Never change canonical URLs, routes, ASINs or affiliate URLs. Tag = `theofficejournal-20`; flag any other.

## Structure
13. **Intro:** 2–4 paragraphs that open on the real buying constraint. No SEO filler.
14. **Roundups:** every pick earns a distinct use case. No artificial badges. Flag redundant picks or move them to "Also Considered". Curated beats exhaustive.
15. **Quick Picks:** label, name, `summary` (why it's here, one sentence), `bestFor` (one specific sentence).
16. **Product section:** label → name → verdict (1–2 sentences, first sentence of `description`) → Best for → Skip if (`skipIf`, a real limitation) → Why we like it (meaning, who benefits, trade-off, comparison, not the spec sheet restated) → decision-relevant specs → pros/cons that add information → existing CTA.
17. **How We Chose:** transparent criteria and source types. No "rigorous testing".
18. **Informational guides:** direct answer → why it matters → how to apply → exceptions → common mistakes → examples → products only where useful → FAQ.
19. **Bottom line** (`bottomLine`): summarize the decision landscape across 2–3 use cases. No "Best overall: X — best overall pick", and no "Browse all on Amazon" link.
20. No Amazon Prime promo modules. No "buy now / shop now / grab / don't miss / must-have / Amazon Finds".
21. Affiliate disclosure stays short: "We may earn a commission from purchases made through links in this guide. Learn more."

## Language
22. Prefer: "the better fit", "worth paying more for", "more product than most people need", "a sensible choice if…", "the practical advantage is…".
23. Avoid: amazing, incredible, game-changing, perfect, premium quality, excellent choice, great option, must-have, feature-packed, unbeatable, best-in-class.
24. Anti-repetition pass: no mechanical "Buyers who want…", "The trade-off is…", "That's a real strength…", "A genuine advantage…", "Strong value…", "Both matter…", "On this list…". Vary openings and rhythm.
25. Cautious inference: "likely", "should", "may", "on paper", "better suited to". Do not claim "safer", "more durable" or "built to last" without evidence.
26. Keep useful specificity (VESA patterns, weight limits, dimensions, exceptions). Be more useful than the source, not just more elegant.

## 40. Template grammar QA
Scan generated headings and sentences for a/an, singular/plural, category plurality, duplicated nouns and awkward generated headings. Bad: "5 Criteria to Look For Before Buying a Office Chairs Under $300". Prefer "What to Look for in an Office Chair Under $300". Section headings are generated by `lib/guide-headings.ts`; override per guide with `sectionHeadings`.

## 41. Do not invent usage thresholds
No hour-based, body-size, lifespan or usage thresholds unless the source supports them ("if you sit six hours a day…", "suitable for eight-hour workdays", "should last several years"). Tie recommendations to supported product differences instead.

## 42. Distinguish editorial judgment from fact
Avoid "Most people do", "You need…", "This will…", "This is always better…". Prefer "For most setups in this guide…", "We would prioritize…", "This is the better fit if…", "Based on the listed specifications…", "May be more suitable for…".

## 43. Final language QA
Last pass for unsupported behavioral, comfort or durability claims, invented usage-duration advice, vague population claims ("most people"), medical or posture claims stated too absolutely, and awkward template grammar. If uncertain, soften the wording or flag for MANUAL_REVIEW.

## Process
- Work in batches. For each article: inspect → rewrite → fact-check → anti-repetition → metadata consistency → save → rewrite report.
- Rewrite report fields: article, old title, new SEO title, new H1, editorial angle, sections rewritten, template phrases removed, unsupported claims removed, facts needing verification, redundant products/badges, metadata updated, structured data updated, affiliate tag issue, manual review required.
- Keep `id`, `rank`, `price`, `imageUrl` and `amazonUrl` byte-identical. Diff them against the original before saving.

## Audit
```
NODE_OPTIONS=--max-old-space-size=8192 npx tsx --tsconfig tsconfig.json scripts/audit-editorial.ts
```
Writes `reports/editorial-audit.md` (summary and next batch) and `reports/editorial-audit.csv` (per-article findings). An article counts as rewritten when its data file exports `bottomLine` and `breadcrumbLabel`. The "R3 possible hands-on claim" rule has false positives, so verify each hit manually.
