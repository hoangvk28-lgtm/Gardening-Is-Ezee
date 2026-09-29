import type { GuideProduct } from "@/components/guide/RichGuidePage";
import { withAmazonTag } from "@/lib/affiliate";
import { SafeImage } from "@/components/editorial/SafeImage";

const MARKETPLACE_POINT = /(?:review|rating|buyer feedback|customer feedback|recognized by|hgTV|usa today|price|costs? more|least expensive)/i;
const REMOVED_CLAIM = "Compared using published specifications, included components, compatibility, and practical trade-offs.";

function lowerFirst(value: string) {
  const clean = value.trim().replace(/[.;,:]+$/, "");
  return clean ? `${clean[0].toLowerCase()}${clean.slice(1)}` : "";
}

function stableVariant(value: string) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
}

function usablePoint(value: string) {
  return Boolean(value) && value !== REMOVED_CLAIM && !MARKETPLACE_POINT.test(value);
}

function firstMeasurement(product: GuideProduct) {
  for (const spec of product.specs) {
    const match = spec.match(/(\d+(?:\.\d+)?)\s*(ft|feet|inches|inch|in\.?|lb|lbs|psi|v|ah|gal|gallon|minutes?|mins?|mph|cfm)\b/i);
    if (match) return { value: Number(match[1]), unit: match[2].toLowerCase().replace(/\.$/, ""), label: spec };
  }
  return null;
}

function comparisonNote(product: GuideProduct, siblings: GuideProduct[]) {
  const current = firstMeasurement(product);
  if (!current) return null;
  const comparable = siblings
    .map((item) => ({ item, measurement: firstMeasurement(item) }))
    .filter((entry): entry is { item: GuideProduct; measurement: NonNullable<ReturnType<typeof firstMeasurement>> } =>
      Boolean(entry.measurement && entry.measurement.unit === current.unit)
    );
  if (comparable.length < 2) return null;

  const ordered = comparable.sort((a, b) => a.measurement.value - b.measurement.value);
  const values = ordered.map((entry) => entry.measurement.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const currentIndex = ordered.findIndex((entry) => entry.item.id === product.id);
  const previous = ordered[currentIndex - 1]?.measurement.label;
  const next = ordered[currentIndex + 1]?.measurement.label;

  const unitContext = /^(ft|feet)$/.test(current.unit)
    ? current.value === min
      ? `At ${current.label}, this is the shortest directly comparable option. It favors easier handling and storage, but gives up reach.`
      : current.value === max
        ? `At ${current.label}, this is the longest directly comparable option. It favors reach, while requiring more room to drain, coil and store.`
        : currentIndex < ordered.length / 2
          ? `${current.label} steps up in reach from ${previous} without moving as far as ${next}. It stays on the easier-to-handle side of this shortlist.`
          : `${current.label} reaches farther than ${previous} but remains easier to manage than ${next}. It sits on the longer-reach side of this shortlist.`
    : /^(inch|inches|in)$/.test(current.unit)
      ? "Check that dimension against access points, working space and storage before choosing."
      : /^(v|ah)$/.test(current.unit)
        ? "Treat the battery platform and included charger as part of the fit, not just the headline number."
        : /^(lb|lbs)$/.test(current.unit)
          ? "Confirm whether that figure refers to tool weight or working capacity before comparing it directly."
          : "Use that number as a comparison point, then verify how it applies to your actual workload.";

  if (/^(ft|feet)$/.test(current.unit)) return unitContext;
  const position = current.value === min && current.value === max
    ? "the same documented level as the comparable picks"
    : current.value === min
      ? "the lower end of the comparable range"
      : current.value === max
        ? "the upper end of the comparable range"
        : "between the lower and upper ends of the comparable range";
  return `Its ${current.label} specification sits at ${position} in this ${comparable.length}-product comparison. ${unitContext}`;
}

function fallbackComparison(product: GuideProduct, siblings: GuideProduct[], specs: string[]) {
  const comparisonBasis = specs.length > 0
    ? specs.slice(0, 2).map(lowerFirst).join(" and ")
    : "the documented configuration and included components";
  const alternatives = Math.max(0, siblings.length - 1);

  if (alternatives > 0) {
    return `Against the other ${alternatives} picks, the useful comparison starts with ${comparisonBasis}. Those details show whether its configuration suits the job better than a neighboring recommendation.`;
  }
  return `The useful comparison starts with ${comparisonBasis}. Match those details to the size and frequency of the work rather than relying on the category label alone.`;
}

function verificationNote(product: GuideProduct) {
  const measurement = firstMeasurement(product);
  const unit = measurement?.unit;

  if (unit && /^(ft|feet)$/.test(unit)) {
    return "Measure from the spigot to the farthest watering point before choosing this length. Check reel capacity and leave enough room to drain and coil the hose after use.";
  }
  if (unit && /^(inch|inches|in)$/.test(unit)) {
    return "Measure the narrowest access point and the available storage footprint before ordering. Confirm what the stated dimension refers to on the exact model and configuration.";
  }
  if (unit && /^(v|ah)$/.test(unit)) {
    return "Confirm whether the battery and charger are included with the exact package. Check platform compatibility and published runtime against the area or workload you need to cover.";
  }
  if (unit && /^(psi|cfm|mph)$/.test(unit)) {
    return "Match the stated output to the material and cleanup task you expect to handle. Confirm the included nozzle or attachments and any operating limits for the exact model.";
  }
  if (unit && /^(lb|lbs)$/.test(unit)) {
    return "Confirm whether the stated figure refers to product weight or rated working capacity. Compare it with your lifting, transport and support requirements before deciding.";
  }
  if (unit && /^(gal|gallon)$/.test(unit)) {
    return "Check whether the stated capacity leaves enough working margin for your routine. Also account for the filled weight, footprint and the space needed to empty or clean it.";
  }
  if (unit && /^(minute|minutes|min|mins)$/.test(unit)) {
    return "Compare the stated operating time with the length of a typical session. Confirm recharge time and whether a spare power source is practical for longer jobs.";
  }
  return "Confirm the exact model number and included components before ordering. Check dimensions, compatibility and maintenance needs against the way you plan to use and store it.";
}

function buildEditorialReview(product: GuideProduct, siblings: GuideProduct[]) {
  const strengths = product.pros.filter(usablePoint);
  const tradeoffs = product.cons.filter(usablePoint);
  const specs = product.specs.filter(usablePoint).slice(0, 3);
  const lead = strengths[0] ?? specs[0] ?? `a configuration suited to ${product.bestFor}`;
  const specLine = specs.length > 0
    ? `The documented setup centers on ${specs.map(lowerFirst).join(", ")}.`
    : "Confirm the exact configuration and included components before ordering.";
  const fit = product.bestFor || "buyers comparing the core specifications and fit";
  const relativePosition = comparisonNote(product, siblings) ?? fallbackComparison(product, siblings, specs);
  const verification = verificationNote(product);
  const variant = stableVariant(product.id || product.name);

  const fitParagraphs = [
    `This model is aimed at ${fit}. ${specLine}`,
    `For ${fit}, this is one of the more relevant configurations in the shortlist. ${specLine}`,
    `The intended use case is ${fit}. ${specLine}`,
    `${product.name} is positioned for ${fit}. ${specLine}`,
  ];
  const strengthOpeners = [
    `The most useful documented advantage is ${lowerFirst(lead)}.`,
    `Its case starts with ${lowerFirst(lead)}.`,
    `What separates it on paper is ${lowerFirst(lead)}.`,
    `The feature doing most of the work here is ${lowerFirst(lead)}.`,
  ];
  const tradeoffOpeners = [
    "The main limitation to plan around is",
    "The trade-off worth checking first is",
    "Before committing, account for",
    "The practical constraint here is",
  ];
  const finalParagraph = tradeoffs[0]
    ? `${tradeoffOpeners[variant]} ${lowerFirst(tradeoffs[0])}. ${verification}`
    : verification;

  const variants = [
    {
      verdict: `${product.name} makes the shortlist because ${lowerFirst(lead)}.`,
    },
    {
      verdict: `The strongest case for ${product.name} is ${lowerFirst(lead)}.`,
    },
    {
      verdict: `${product.name} is the better fit when ${lowerFirst(fit)}.`,
    },
    {
      verdict: `Choose ${product.name} for ${lowerFirst(lead)}.`,
    },
  ];
  return {
    verdict: variants[variant].verdict,
    rest: [
      fitParagraphs[variant],
      `${strengthOpeners[variant]} ${relativePosition}`,
      finalParagraph,
    ],
  };
}

const toList = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

function Label({ children }: { children: React.ReactNode }) {
  return <h4 className="font-[family-name:var(--font-body)] text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-ink">{children}</h4>;
}

/**
 * One product recommendation in editorial form: large image (~38%) beside the
 * verdict and reasoning (~62%). Stacks image → info → pros/cons → CTA on
 * phones. Exactly one commerce CTA per product.
 */
export function GuideProductPick({ product: p, products, total }: { product: GuideProduct; products: GuideProduct[]; total: number }) {
  const { verdict, rest } = buildEditorialReview(p, products);
  const skipIf = toList(p.skipIf);

  return (
    <article id={p.id} aria-labelledby={`${p.id}-name`} className="scroll-mt-32 border-t border-border py-10 first:border-t-0 first:pt-2 lg:scroll-mt-24">
      <div className="grid gap-6 md:grid-cols-[38fr_62fr] md:gap-10">
        <div>
          <a
            href={withAmazonTag(p.amazonUrl)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`${p.name} on Amazon (opens in a new tab)`}
            className="group relative block aspect-square overflow-hidden bg-surface focus-ring md:sticky md:top-28"
          >
            {p.imageUrl && (
              <SafeImage src={p.imageUrl} alt={p.name} fill sizes="(max-width: 768px) 100vw, 320px" className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]" unoptimized />
            )}
          </a>
        </div>

        <div className="min-w-0">
          <p className="eyebrow">
            {p.badge}
            <span className="ml-2 font-medium tracking-normal normal-case text-ink-secondary">
              {p.rank} of {total}
            </span>
          </p>
          <h3 id={`${p.id}-name`} className="mt-2 text-[1.625rem] leading-tight sm:text-[1.875rem]">
            <a
              href={withAmazonTag(p.amazonUrl)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="!text-ink transition-colors hover:!text-brand focus-ring"
            >
              {p.name}
              <span className="sr-only"> on Amazon (opens in a new tab)</span>
            </a>
          </h3>

          {verdict && (
            <p className="mt-4 border-l-2 border-ink pl-4 font-[family-name:var(--font-display)] text-[1.1875rem] leading-snug !text-ink">
              {verdict}
            </p>
          )}

          <dl className={`mt-6 grid gap-4 border-y border-border py-5 ${skipIf.length > 0 ? "sm:grid-cols-2 sm:gap-6" : ""}`}>
            {p.bestFor && (
              <div>
                <dt><Label>Best for</Label></dt>
                <dd className="mt-1.5 text-base leading-relaxed text-ink-secondary">{p.bestFor}</dd>
              </div>
            )}
            {skipIf.length > 0 && (
              <div>
                <dt><Label>Skip if</Label></dt>
                <dd className="mt-1.5 text-base leading-relaxed text-ink-secondary">{skipIf.join(" ")}</dd>
              </div>
            )}
          </dl>

          {rest.length > 0 && (
            <section className="mt-6">
              <Label>Why it made the shortlist</Label>
              <div className="mt-2 space-y-4">
                {rest.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          )}

          {p.specs.length > 0 && (
            <section className="mt-6">
              <Label>Key dimensions &amp; specs</Label>
              <ul className="mt-2 divide-y divide-border border-y border-border">
                {p.specs.map((s, i) => (
                  <li key={i} className="py-2 text-[0.9375rem] leading-snug text-ink">{s}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {p.pros.length > 0 && (
              <section>
                <Label>Pros</Label>
                <ul className="mt-2 space-y-2">
                  {p.pros.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-base leading-snug text-ink">
                      <span aria-hidden className="mt-px font-semibold text-olive">+</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {p.cons.length > 0 && (
              <section>
                <Label>Cons</Label>
                <ul className="mt-2 space-y-2">
                  {p.cons.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-base leading-snug text-ink">
                      <span aria-hidden className="mt-px font-semibold text-ink-secondary">−</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="mt-8">
            <a
              href={withAmazonTag(p.amazonUrl)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex min-h-12 items-center gap-2 bg-brand px-6 text-[0.9375rem] font-semibold !text-white transition-colors hover:bg-brand-dark focus-ring"
            >
              Check price on Amazon
              <span className="sr-only"> for {p.name} (opens in a new tab)</span>
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
