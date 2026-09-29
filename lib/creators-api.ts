// Amazon Creators API client (OAuth2 / v3.x credentials, NA region)
// Docs: Creators API "Using cURL" — token via Login with Amazon, catalog via https://creatorsapi.amazon

// Use `||` — an env var Vercel auto-detected from .env.example but left
// blank is a set-but-empty string, which `??` alone won't fall through on.
const TOKEN_ENDPOINT = process.env.AMAZON_PAAPI_TOKEN_ENDPOINT || "https://api.amazon.com/auth/o2/token";
const API_BASE = "https://creatorsapi.amazon";
const MARKETPLACE = process.env.AMAZON_PAAPI_MARKETPLACE || "www.amazon.com";

interface TokenCache {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cachedToken: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.AMAZON_PAAPI_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_PAAPI_SECRET_KEY;
  if (!clientId || !clientSecret) {
    throw new Error("AMAZON_PAAPI_ACCESS_KEY / AMAZON_PAAPI_SECRET_KEY not set");
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Creators API token request failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

export interface CreatorsApiItem {
  asin: string;
  detailPageURL: string | null;
  images: {
    primary?: {
      small?: { url: string } | null;
      medium?: { url: string } | null;
      large?: { url: string } | null;
    } | null;
  } | null;
  itemInfo: {
    title?: { displayValue: string } | null;
  } | null;
  offersV2?: {
    listings?: Array<{
      price?: { money?: { amount: number; currency: string; displayAmount: string } };
    }>;
  } | null;
  customerReviews?: {
    starRating?: { value: number } | null;
    count?: number | null;
  } | null;
}

interface GetItemsResponse {
  itemsResult?: {
    items: CreatorsApiItem[];
  };
  errors?: Array<{ code: string; message: string }>;
}

// No safe fallback here — silently defaulting to another site's Associates
// tag would misattribute affiliate revenue. Fail loudly instead.
const PARTNER_TAG = process.env.AMAZON_PAAPI_PARTNER_TAG || "";
if (!PARTNER_TAG && process.env.NODE_ENV !== "test") {
  console.warn("[creators-api] AMAZON_PAAPI_PARTNER_TAG is not set — PA-API calls will fail until a Gardening Is Ezee-specific Associates tag is configured.");
}

// GetItems accepts at most 10 ASINs per request.
export async function getItems(asins: string[]): Promise<CreatorsApiItem[]> {
  if (asins.length === 0) return [];
  if (asins.length > 10) {
    throw new Error("getItems: max 10 ASINs per request — batch the calls yourself");
  }

  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/catalog/v1/getItems`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: "ASIN",
      marketplace: MARKETPLACE,
      partnerTag: PARTNER_TAG,
      resources: [
        "images.primary.large",
        "itemInfo.title",
        "offersV2.listings.price",
        "customerReviews.starRating",
        "customerReviews.count",
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Creators API getItems failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as GetItemsResponse;
  if (json.errors?.length) {
    throw new Error(`Creators API returned errors: ${JSON.stringify(json.errors)}`);
  }
  return json.itemsResult?.items ?? [];
}

// Batches an arbitrary list of ASINs into <=10-item GetItems calls.
export async function getItemsBatched(asins: string[]): Promise<CreatorsApiItem[]> {
  const results: CreatorsApiItem[] = [];
  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);
    const items = await getItems(batch);
    results.push(...items);
    // be polite to the token/rate limiter between batches
    if (i + 10 < asins.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  return results;
}

export function extractAsinFromAmazonUrl(amazonUrl: string): string | null {
  const match = amazonUrl.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}
