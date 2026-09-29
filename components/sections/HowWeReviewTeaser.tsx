import Link from "next/link";

const criteria = [
  {
    label: "Real-World Fit",
    description: "Footprint, mounting options, and whether the product genuinely works in a real home workspace.",
    weight: "25%",
    color: "#7c9068",
  },
  {
    label: "Build Quality",
    description: "Materials, finish, construction details and warranty terms documented by the manufacturer.",
    weight: "20%",
    color: "#5c6f4b",
  },
  {
    label: "Ease of Use",
    description: "Setup time, control ergonomics, and how much day-to-day adjustment the product requires.",
    weight: "20%",
    color: "#5f7a4a",
  },
  {
    label: "Value for Money",
    description: "Price-to-performance ratio compared within each product subcategory, not across all products.",
    weight: "20%",
    color: "#c9a876",
  },
  {
    label: "Documentation",
    description: "Published capacity, compatibility, included components, operating limits and warranty coverage.",
    weight: "15%",
    color: "#a8875a",
  },
];

export function HowWeReviewTeaser() {
  return (
    <section className="py-14 border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
          {/* Left copy */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              How Gardening Is Ezee Chooses Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-3 mb-5 tracking-tight">
              Context first. Trade-offs included. No paid rankings.
            </h2>
            <p className="text-ink-secondary leading-relaxed mb-4 max-w-lg">
              We focus on the things that matter in a real home workspace: comfort, dimensions, usability, build quality and value. Every product is scored 1-10 against five criteria, then combined into a weighted overall score.
            </p>
            <p className="text-ink-secondary leading-relaxed mb-6 max-w-lg">
              Every recommendation explains who it&apos;s for - and who should skip it. Affiliate relationships don&apos;t determine placement or scores.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link prefetch={false}
                href="/how-we-review"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-btn text-sm font-semibold text-ink hover:border-brand hover:text-brand transition-all"
              >
                Read full methodology
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link prefetch={false}
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-btn text-sm font-semibold hover:bg-brand-dark transition-colors"
              >
                Compare all products →
              </Link>
            </div>
          </div>

          {/* Right criteria list */}
          <div className="flex flex-col gap-2.5">
            {criteria.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-border hover:border-border-dark transition-colors group"
              >
                {/* Weight pill */}
                <div
                  className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full text-xs font-bold text-white min-w-[3rem] text-center"
                  style={{ backgroundColor: item.color }}
                >
                  {item.weight}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-0.5">{item.label}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}

            {/* Total bar */}
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-brand-light border border-brand-muted mt-1">
              <div className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-brand min-w-[3rem] text-center">
                100%
              </div>
              <p className="text-xs font-semibold text-brand">
                = Overall score (1–10 scale)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
