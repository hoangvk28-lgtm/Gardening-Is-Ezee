import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "./SectionHeader";

const problems = [
  { icon: "/images/icons/more-comfort.png", label: "More Comfort", desc: "Chairs & ergonomics", href: "/categories/chairs" },
  { icon: "/images/icons/more-desk-space.png", label: "More Desk Space", desc: "Monitor arms & organization", href: "/categories/monitors" },
  { icon: "/images/icons/better-lighting.png", label: "Better Lighting", desc: "Lighting guides", href: "/categories/lighting" },
  { icon: "/images/icons/small-workspace.png", label: "Small Workspace", desc: "Space-saving setups", href: "/categories/dorm-essentials" },
  { icon: "/images/icons/less-clutter.png", label: "Less Clutter", desc: "Cable & desk organization", href: "/categories/small-room-storage" },
  { icon: "/images/icons/smarter-budget.png", label: "Smarter Budget", desc: "Value-focused picks", href: "/deals" },
];

export function StartWithYourSpace() {
  return (
    <section className="py-14">
      <SectionHeader
        eyebrow="Start With Your Space"
        title="What would make your workspace better?"
        description="Tell us the problem, not the product - we'll point you to the right guides."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {problems.map((p) => (
          <Link prefetch={false}
            key={p.label}
            href={p.href}
            className="flex flex-col items-center text-center gap-2 rounded-xl px-3 py-5 transition-all hover:-translate-y-0.5"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <span
              className="flex items-center justify-center w-16 h-16 rounded-full"
              style={{ background: "var(--color-brand-light)" }}
            >
              <Image src={p.icon} alt="" width={64} height={64} className="w-10 h-10 object-contain" />
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{p.label}</span>
            <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{p.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
