import Link from "next/link";
import Image from "next/image";
import { getPublicHomepageSettings } from "@/lib/public-settings";
import type { HomepageSettings } from "@/lib/site-settings-store";

interface Props {
  settings?: HomepageSettings;
}

export async function HeroSection({ settings: propSettings }: Props = {}) {
  const settings = propSettings ?? await getPublicHomepageSettings();
  const hero = settings.hero;

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_460px] gap-10 lg:gap-14 items-center">

          {/* ── Left column ── */}
          <div>
            <span
              className="block text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--color-cta)" }}
            >
              Better spaces. Better workdays.
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight mb-5"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {hero.headline}{" "}
              <span style={{ color: "var(--color-cta)" }}>{hero.headlineAccent}</span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "var(--color-ink-secondary)" }}>
              {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-2">
              <Link prefetch={false}
                href={hero.primaryCtaHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-btn text-sm transition-all"
                style={{ background: "var(--color-cta)", color: "#ffffff", boxShadow: "0 4px 16px rgba(95,122,74,0.30)" }}
              >
                {hero.primaryCtaText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link prefetch={false}
                href="#build-your-cocoon"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70"
                style={{ color: "var(--color-ink)" }}
              >
                Build Your Cocoon
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>

            {hero.badgeText && (
              <p className="text-xs mt-8" style={{ color: "var(--color-ink-muted)" }}>{hero.badgeText}</p>
            )}
          </div>

          {/* ── Right column - hero image ── */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/hero-banner.webp"
              alt="A calm Gardening Is Ezee-styled home office nook with a reading chair, desk, and plants"
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              sizes="(min-width: 1024px) 460px, 100vw"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
