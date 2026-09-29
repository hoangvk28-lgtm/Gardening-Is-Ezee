import Image from "next/image";

const stats = [
  {
    number: "1,000+",
    unit: "products",
    icon: (
      <Image
        src="/images/icons/products-evaluated-icon.webp"
        alt="3D checklist icon representing evaluated products"
        width={64}
        height={64}
        className="object-contain"
      />
    ),
    iconSize: "w-16 h-16",
    label: "Evaluated for real home offices",
    description: "Every product compared using specifications, compatibility, included components and documented trade-offs.",
  },
  {
    number: "200+",
    unit: "buying guides",
    icon: (
      <Image
        src="/images/icons/buying-guides-icon.webp"
        alt="3D chat and guide icon representing buying guides"
        width={64}
        height={64}
        className="object-contain"
      />
    ),
    iconSize: "w-16 h-16",
    label: "With side-by-side comparisons",
    description: "Practical recommendations built around real workspace constraints.",
  },
  {
    number: "5",
    unit: "scoring criteria",
    icon: (
      <Image
        src="/images/icons/scoring-criteria-icon.webp"
        alt="3D scoring criteria icon representing evaluation methodology"
        width={64}
        height={64}
        className="object-contain"
      />
    ),
    iconSize: "w-16 h-16",
    label: "Tuned for daily comfort",
    description: "Job fit, build quality, ease of setup, compatibility and documentation are applied consistently.",
  },
  {
    number: "1–10",
    unit: "score scale",
    icon: (
      <Image
        src="/images/icons/score-scale-icon.webp"
        alt="3D score scale icon representing consistent 1-10 scoring"
        width={64}
        height={64}
        className="object-contain"
      />
    ),
    iconSize: "w-16 h-16",
    label: "Consistent across all products",
    description: "The same rubric for every product we evaluate - so scores are genuinely comparable across guides.",
  },
];

export function TrustStats() {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3">
              {/* Icon + number row */}
              <div className="flex items-center gap-3">
                <div className={`shrink-0 ${stat.iconSize} rounded-xl bg-brand-light flex items-center justify-center text-brand overflow-hidden`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-2xl font-bold text-ink tabular-nums tracking-tight leading-none whitespace-nowrap">
                    {stat.number}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-muted leading-none whitespace-nowrap">
                    {stat.unit}
                  </span>
                </div>
              </div>
              {/* Labels */}
              <div>
                <p className="font-semibold text-ink text-xs leading-snug mb-0.5">{stat.label}</p>
                <p className="text-xs text-ink-secondary leading-relaxed hidden sm:block">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
