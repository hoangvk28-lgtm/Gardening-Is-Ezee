# Gardening Is Ezee — Light Guide Duplication Audit

Date: 2026-09-29

## Scope

Compared all 1,179 shared gardening guide files against the matching files in
BestFindsReviews. Whitespace was normalized before exact-match comparison.

| Section | Exact matches | Rate |
| --- | ---: | ---: |
| Guide title | 1,050 / 1,179 | 89.1% |
| Meta title | 1,049 / 1,179 | 89.0% |
| Meta description | 883 / 1,179 | 74.9% |
| Intro paragraphs | 521 / 1,179 | 44.2% |
| Buying criteria | 181 / 1,179 | 15.4% |
| How we evaluated | 111 / 1,179 | 9.4% |
| FAQ | 359 / 1,179 | 30.4% |

## Light-touch changes

- Kept the full search topic in every H1, but reframed it as an editorial
  Gardening Is Ezee headline: “Our Guide to the Best …”.
- Renamed the generic Quick Picks and Our Picks sections to “The Practical
  Shortlist” and “Why Each Pick Made the Cut”.
- Reworked generated selection, buying-criteria and comparison H2s around the
  reader's garden, yard and actual job.
- Renamed the FAQ section to “Before You Bring One Home”.

## Deliberately unchanged

- Product names, published specifications, compatibility and warranty facts.
- Affiliate destinations and “Check price” calls to action.
- Slugs and search intent, to avoid unnecessary SEO and redirect risk.
- Detailed product prose, except for the prior Amazon price/rating/review cleanup.

## Recommended next pass

Rewrite intros and FAQs for the highest-traffic 30–50 guides first. That gives
the largest editorial differentiation without applying low-quality mechanical
rewrites across the full corpus.

## Second pass

- Found 15,178 neutral placeholders across 1,170 source files after removal of
  marketplace-derived price and review claims.
- Added renderer-level contextual fallbacks so placeholders no longer appear
  to readers, without risking a bulk rewrite of the source corpus.
- Added a per-guide “Garden Fit Check” derived from each guide's own first pick,
  distinguishing specifications and first documented trade-off.
- Removed placeholder bullets from visible pros and cons.
