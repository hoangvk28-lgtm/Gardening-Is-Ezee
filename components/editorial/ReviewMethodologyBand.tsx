import Link from "next/link";

const principles = [
  { title: "Context First", body: "We start with your yard: its size, terrain, storage space, water pressure and how much upkeep you want." },
  { title: "Real Trade-offs", body: "Every pick comes with what it gives up. Useful specifications over marketing claims." },
  { title: "Independent Recommendations", body: "Brands can’t pay for placement. Affiliate commissions never decide what we recommend." },
];

export function ReviewMethodologyBand() {
  return (
    <section aria-labelledby="how-we-review" className="border-y border-border bg-surface">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[4fr_8fr] lg:gap-14 lg:px-8 lg:py-14">
        <div>
          <p className="eyebrow !text-olive">Our standards</p>
          <h2 id="how-we-review" className="mt-2 text-[1.75rem] sm:text-[2rem]">How We Review</h2>
          <p className="mt-3">
            We focus on real yard and garden constraints, useful specifications, clear trade-offs and value.
          </p>
          <Link prefetch={false} href="/how-we-review" className="group mt-4 inline-block text-sm font-medium focus-ring">
            Learn about our process
            <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <ol className="grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-border pt-4 md:border-t-0 md:px-6 md:pt-0 md:first:pl-0">
              <span aria-hidden className="font-[family-name:var(--font-display)] text-sm text-brand">0{i + 1}</span>
              <h3 className="mt-1 text-lg">{p.title}</h3>
              <p className="mt-2 text-base leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
