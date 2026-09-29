import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const steps = [
  { n: "01", title: "Desk", hook: "Find your foundation", desc: "Small desks, standing desks and workspace sizing.", cta: "Explore Desks", href: "/categories/desk-setup" },
  { n: "02", title: "Chair", hook: "Sit better", desc: "Comfort and ergonomic seating for long workdays.", cta: "Explore Chairs", href: "/categories/chairs" },
  { n: "03", title: "Monitor", hook: "See more comfortably", desc: "Monitor placement, arms and screen setups.", cta: "Explore Monitor Setup", href: "/categories/monitors" },
  { n: "04", title: "Lighting", hook: "Light your space", desc: "Desk lamps, ambient lighting and natural light.", cta: "Explore Lighting", href: "/categories/lighting" },
  { n: "05", title: "Accessories", hook: "Finish your setup", desc: "Keyboards, mats, cable management and useful extras.", cta: "Explore Accessories", href: "/categories/accessories" },
];

export function BuildYourCocoon() {
  return (
    <section id="build-your-cocoon" className="py-14 scroll-mt-20">
      <SectionHeader
        eyebrow="Build Your Cocoon"
        title="Start with the essentials"
        description="Build a workspace around how you actually work."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((s) => (
          <Link prefetch={false}
            key={s.title}
            href={s.href}
            className="group flex flex-col gap-2 rounded-xl p-5 transition-all hover:-translate-y-0.5"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <span className="text-xs font-bold tracking-widest" style={{ color: "var(--color-cta)" }}>{s.n}</span>
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>{s.title}</h3>
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{s.hook}</p>
            <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-ink-secondary)" }}>{s.desc}</p>
            <span className="text-xs font-semibold flex items-center gap-1 mt-1 group-hover:gap-2 transition-all" style={{ color: "var(--color-cta)" }}>
              {s.cta}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
