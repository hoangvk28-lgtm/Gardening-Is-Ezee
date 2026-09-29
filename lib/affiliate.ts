export const AMAZON_TAG = "gardeningisezee-20";

/**
 * Central URL builder - swap out AMAZON_TAG once your Associates account is approved.
 * ASIN is the 10-character Amazon product identifier (e.g. "B076HCCQZQ").
 */
export function buildAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

/**
 * Render-time guard for any Amazon URL that was stored (DB, seed data, admin
 * input) rather than built fresh via buildAmazonUrl(). Sets the `tag` query
 * param to the current AMAZON_TAG, replacing whatever tag (or none) was
 * already on the URL — never appending a second `tag=` param. Use this at
 * the point a stored amazonUrl/affiliateUrl is actually rendered as `href`,
 * so a stale or legacy tracking tag in stored data can never reach a live
 * link, and switching AMAZON_TAG only ever requires editing this file.
 *
 * Non-Amazon or unparseable URLs are returned unchanged.
 */
export function withAmazonTag(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (!/(^|\.)amazon\.[a-z.]+$/i.test(parsed.hostname)) return url;
    parsed.searchParams.set("tag", AMAZON_TAG);
    return parsed.toString();
  } catch {
    return url;
  }
}

export const DISCLOSURE_SHORT =
  "Gardening Is Ezee earns a small commission on qualifying Amazon purchases at no extra cost to you.";

export const DISCLOSURE_FULL =
  "Gardening Is Ezee is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. Our editorial opinions are independent and are never influenced by affiliate relationships.";
