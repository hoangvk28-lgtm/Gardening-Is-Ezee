import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { guides as staticGuides } from "@/data/guides";
import { products as staticProducts } from "@/data/products";
import { categories } from "@/data/categories";

export const dynamic = "force-dynamic";

// No fallback key — that would silently ping using another site's IndexNow
// key. Generate a Gardening Is Ezee-specific key and set INDEXNOW_KEY + a matching
// public/<key>.txt verification file before this route is expected to work.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

// VS compare slugs (static — not in data files)
const VS_SLUGS = [
  "monitor-stand-vs-monitor-arm",
  "usb-c-hub-vs-docking-station",
  "lap-desk-vs-standing-desk-converter",
  "desk-mat-vs-mouse-pad",
];

function buildUrlList(): string[] {
  const urls: string[] = [
    SITE_URL,
    `${SITE_URL}/guide`,
    `${SITE_URL}/compare`,
    `${SITE_URL}/deals`,
  ];

  for (const g of staticGuides) {
    urls.push(`${SITE_URL}/guide/${g.slug}`);
  }

  for (const p of staticProducts) {
    if (p.slug) urls.push(`${SITE_URL}/reviews/${p.slug}`);
  }

  for (const c of categories) {
    urls.push(`${SITE_URL}/categories/${c.slug}`);
  }

  for (const slug of VS_SLUGS) {
    urls.push(`${SITE_URL}/compare/${slug}`);
  }

  return [...new Set(urls)];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlList = buildUrlList();
  const host = new URL(SITE_URL).hostname;

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    const indexNowStatus = res.status;

    if (res.status >= 500) {
      return NextResponse.json(
        { ok: false, indexNowStatus, urls: urlList.length },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, indexNowStatus, submitted: urlList.length, pingAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
