import Link from "next/link";

const tools = [
  {
    title: "Compare Desk Lamps",
    description: "Side-by-side scores for brightness, color temperature, footprint, and value across our top lamp picks.",
    href: "/compare",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    tag: "6 products",
    available: true,
  },
  {
    title: "Compare Monitor Stands",
    description: "Evaluate monitor risers and arms on height range, cable management, weight capacity, and desk space saved.",
    href: "/compare",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 7.409A2.25 2.25 0 0 1 2.25 5.493V5.25" />
      </svg>
    ),
    tag: "4 products",
    available: true,
  },
  {
    title: "Compare Dorm Storage",
    description: "Bedside caddies, under-bed containers, and rolling carts scored for capacity, access ease, and small-room fit.",
    href: "/compare",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    tag: "6 products",
    available: true,
  },
  {
    title: "Product Finder Quiz",
    description: "Answer 3 questions about your space and budget. We'll surface the best-fit product picks for your situation.",
    href: "#",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
    tag: "Coming soon",
    available: false,
  },
];

export function CompareTools() {
  return (
    <section className="py-14 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Compare</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-2 tracking-tight">
            Side-by-Side Comparisons
          </h2>
          <p className="text-ink-secondary mt-2 leading-relaxed max-w-2xl">
            All scores use the same 10-point rubric - overall quality, value, build, ease of use,
            and comfort - so comparisons stay apples-to-apples.
          </p>
        </div>
        <Link prefetch={false}
          href="/compare"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors shrink-0 flex items-center gap-1"
        >
          Full comparison page
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className={`relative flex flex-col gap-4 p-5 rounded-card border transition-all ${
              tool.available
                ? "bg-white border-border hover:shadow-card-hover hover:border-brand/20 cursor-pointer"
                : "bg-bg border-border opacity-60"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                tool.available ? "bg-brand-light text-brand" : "bg-border text-ink-muted"
              }`}
            >
              {tool.icon}
            </div>

            {/* Tag */}
            <span
              className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-badge ${
                tool.available
                  ? "bg-cta-light text-cta-dark"
                  : "bg-bg text-ink-muted border border-border"
              }`}
            >
              {tool.tag}
            </span>

            <div className="flex-1">
              <h3 className="font-bold text-ink text-sm mb-2">{tool.title}</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">{tool.description}</p>
            </div>

            {tool.available ? (
              <Link prefetch={false}
                href={tool.href}
                className="mt-auto text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
                aria-label={`Go to ${tool.title}`}
              >
                Compare now →
              </Link>
            ) : (
              <span className="mt-auto text-sm text-ink-muted font-medium">Coming soon</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
