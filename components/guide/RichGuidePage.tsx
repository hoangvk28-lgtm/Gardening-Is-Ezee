import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { AMAZON_TAG } from "@/lib/affiliate";
import { formatDate } from "@/lib/utils";
import { getGuideBySlug } from "@/lib/helpers";
import { canonicalGuidePath, siloForGuide } from "@/lib/migrated-silos";
import { getSiloBySlug } from "@/data/silos";
import { guideDeks } from "@/data/guide-deks";
import { guideSectionHeadings, type GuideSectionHeadings } from "@/lib/guide-headings";
import { SafeImage } from "@/components/editorial/SafeImage";
import { GuideQuickPicks } from "@/components/guide/editorial/GuideQuickPicks";
import { GuideProductPick } from "@/components/guide/editorial/GuideProductPick";
import { GuideJumpTo, GuideTocSidebar, type TocItem } from "@/components/guide/editorial/GuideToc";

export interface GuideProduct {
  id: string;
  rank: number;
  badge: string;
  name: string;
  imageUrl: string;
  amazonUrl: string;
  description: string;
  specs: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  /** Optional; rendered as "Skip if" only when a guide's data provides it. */
  skipIf?: string | string[];
  /** Optional one-sentence reason the pick is in the guide (Quick Picks). */
  summary?: string;
}

export interface HowToChooseSection {
  subheading: string;
  intro?: string;
  table?: { headers: string[]; rows: string[][] };
  cards?: { label: string; text: string }[];
  note?: string;
}

export interface RichGuidePageProps {
  slug: string;
  guideTitle: string;
  /** Short label for breadcrumbs when the H1 is an editorial headline. */
  breadcrumbLabel?: string;
  metaDescription: string;
  mainKeyword?: string;
  introParagraphs?: string[];
  lastUpdated: string;
  readTime: string;
  heroImage: string;
  products: GuideProduct[];
  howWeEvaluated?: { title: string; description: string }[];
  howToChoose?: HowToChooseSection[];
  buyingCriteria?: { criterion: string; explanation: string }[];
  faq?: { q: string; a: string }[];
  /** Editorial conclusion paragraphs; replaces the generated Bottom Line when present. */
  bottomLine?: string[];
  /** Per-guide overrides for generated section headings. */
  sectionHeadings?: Partial<GuideSectionHeadings>;
  relatedGuides?: { href: string; title: string }[];
}

// Mirrors scripts/generate-guide-page.mjs's toBreadcrumbTitle/toAmazonSearchQuery
// helpers, so demoted guides keep their breadcrumb and Amazon search link. Section
// headings come from lib/guide-headings.ts.
function toBreadcrumbTitle(guideTitle: string) {
  return guideTitle.replace(/^\d+\s+/, "").replace(/\s+in\s+2026$/i, "");
}

/**
 * Keep the full search topic intact while giving the on-page headline a
 * Gardening Is Ezee editorial voice distinct from the source registry.
 */
function toEditorialHeadline(guideTitle: string) {
  const clean = guideTitle.replace(/\s*\(2026\)\s*$/i, "").trim();
  if (/^best\s+/i.test(clean)) {
    return `Our Guide to ${clean.replace(/^best\s+/i, "the Best ")}`;
  }
  return `${clean}: A Practical Garden Guide`;
}

function toAmazonSearchQuery(mainKeyword: string | undefined, slug: string) {
  const kw = mainKeyword || slug.replace(/^best-/, "").replace(/-/g, " ");
  return kw.replace(/\s+/g, "+");
}

const REMOVED_MARKETPLACE_CLAIM =
  "Compared using published specifications, included components, compatibility, and practical trade-offs.";
const NON_EDITORIAL_BULLET = /(?:review|rating|buyer feedback|customer feedback|recognized by|hgtv|usa today|price|pricing|costs? more|lowest cost|least expensive|budget pick)/i;

function cleanEditorialText(value: string | undefined, fallback: string) {
  return !value || value === REMOVED_MARKETPLACE_CLAIM ? fallback : value;
}

export function RichGuidePage(props: RichGuidePageProps) {
  const {
    slug, guideTitle, metaDescription, mainKeyword, readTime,
    heroImage, products: rawProducts, lastUpdated,
  } = props;
  const introParagraphs = props.introParagraphs ?? [];
  const products = rawProducts.map((product) => ({
    ...product,
    badge: cleanEditorialText(product.badge, "Also Consider"),
    description: cleanEditorialText(product.description, "This option is included for its documented specifications and fit for the job described in this guide."),
    bestFor: NON_EDITORIAL_BULLET.test(product.bestFor)
      ? "buyers comparing capacity, compatibility, included components and storage needs"
      : cleanEditorialText(product.bestFor, "buyers comparing capacity, compatibility, included components and storage needs"),
    pros: product.pros.filter((item) => item !== REMOVED_MARKETPLACE_CLAIM && !NON_EDITORIAL_BULLET.test(item)),
    cons: product.cons.filter((item) => item !== REMOVED_MARKETPLACE_CLAIM && !NON_EDITORIAL_BULLET.test(item)),
  }));
  const howWeEvaluated = (props.howWeEvaluated ?? []).map((item) => ({
    title: cleanEditorialText(item.title, "Documented specifications"),
    description: cleanEditorialText(item.description, "We compared capacity, compatibility, included components, operating limits and warranty documentation."),
  }));
  const howToChoose = (props.howToChoose ?? []).map((section) => ({
    ...section,
    subheading: cleanEditorialText(section.subheading, "Match the product to the job"),
    cards: section.cards?.map((card) => ({
      label: cleanEditorialText(card.label, "Verify before ordering"),
      text: cleanEditorialText(card.text, "Confirm dimensions, compatibility and included components for your setup."),
    })),
  }));
  const buyingCriteria = (props.buyingCriteria ?? []).map((item) => ({
    criterion: cleanEditorialText(item.criterion, "Verify the complete configuration"),
    explanation: cleanEditorialText(item.explanation, "Confirm capacity, dimensions, compatibility, included components, warranty coverage and storage requirements before choosing."),
  }));
  const faq = (props.faq ?? []).map((item) => ({
    q: cleanEditorialText(item.q, "What should I verify before ordering?"),
    a: cleanEditorialText(item.a, "Confirm the model number, dimensions, capacity, included components, compatibility, warranty coverage and storage requirements."),
  }));
  const relatedGuides = props.relatedGuides ?? [];

  const breadcrumbTitle = props.breadcrumbLabel ?? toBreadcrumbTitle(guideTitle);
  const editorialHeadline = toEditorialHeadline(guideTitle);
  const amazonQuery = toAmazonSearchQuery(mainKeyword, slug);
  const headings = guideSectionHeadings(breadcrumbTitle, props.sectionHeadings);
  const productNounPlural = breadcrumbTitle.replace(/^Best\s+/i, "").trim();

  // Canonical URL + breadcrumb parent come from where the guide is actually
  // served (its topic silo when migrated), not the legacy /guide/ path.
  const registryGuide = getGuideBySlug(slug);
  const canonicalPath = registryGuide ? canonicalGuidePath(registryGuide) : `/guide/${slug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const siloSlug = registryGuide ? siloForGuide(registryGuide.categorySlug, registryGuide.subcategorySlug) : undefined;
  const parentSilo = siloSlug && canonicalPath.startsWith(`/${siloSlug}/`) ? getSiloBySlug(siloSlug) : undefined;
  const parent = parentSilo
    ? { name: parentSilo.name, href: `/${parentSilo.slug}` }
    : { name: "Buying Guides", href: "/guide" };
  const dek = guideDeks[slug] ?? metaDescription;

  // Related links stored as /guide/<slug> resolve to their canonical URL at render time.
  const resolveHref = (href: string) => {
    const m = href.match(/^\/guide\/([^/?#]+)(.*)$/);
    const g = m ? getGuideBySlug(m[1]) : undefined;
    return g ? canonicalGuidePath(g) + m![2] : href;
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guideTitle,
    description: metaDescription,
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    author: { "@type": "Organization", name: `${SITE_NAME} Editors`, url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    about: [{ "@type": "Thing", name: breadcrumbTitle }],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: parent.name, item: `${SITE_URL}${parent.href}` },
      { "@type": "ListItem", position: 3, name: breadcrumbTitle, item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guideTitle,
    description: metaDescription,
    numberOfItems: products.length,
    itemListElement: products.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      name: `${p.name} - ${p.badge}`,
      url: `${canonicalUrl}#${p.id}`,
    })),
  };

  const firstPick = products[0];
  const distinguishingSpecs = products
    .slice(0, 3)
    .map((product) => product.specs[0])
    .filter((spec, index, all): spec is string => Boolean(spec) && all.indexOf(spec) === index);
  const firstTradeoff = products.flatMap((product) => product.cons).find(Boolean);
  const gardenFitChecks: { label: string; text: string }[] = [];
  if (firstPick?.bestFor) {
    gardenFitChecks.push({
      label: "Start with the job",
      text: `${firstPick.name} leads this shortlist for ${firstPick.bestFor}. Use that fit as a reference point, then compare the alternatives against your own space and workload.`,
    });
  }
  if (distinguishingSpecs.length > 0) {
    gardenFitChecks.push({
      label: "Specs that separate the picks",
      text: `The first details to compare are ${distinguishingSpecs.join(", ")}. Confirm the exact model and included components before ordering.`,
    });
  }
  if (firstTradeoff) {
    gardenFitChecks.push({ label: "Trade-off to plan for", text: firstTradeoff });
  }

  const toc: TocItem[] = [
    ...(gardenFitChecks.length > 0 ? [{ id: "garden-fit-check", label: "Garden Fit Check" }] : []),
    { id: "quick-picks", label: "Quick Picks" },
    { id: "our-picks", label: "Our Picks" },
    ...(howWeEvaluated.length > 0 ? [{ id: "how-we-chose", label: "How We Chose" }] : []),
    ...(buyingCriteria.length > 0 ? [{ id: "what-to-look-for", label: "What to Look For" }] : []),
    ...(howToChoose.length > 0 ? [{ id: "comparison", label: "Comparison" }] : []),
    ...(faq.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  const sectionTitle = "scroll-mt-32 text-[1.75rem] leading-tight sm:text-[2rem] lg:scroll-mt-24";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <article className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        {/* ── Header ── */}
        <header className="max-w-[760px]">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-secondary">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li><Link prefetch={false} href="/" className="!text-ink-secondary hover:!text-ink">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link prefetch={false} href={parent.href} className="!text-ink-secondary hover:!text-ink">{parent.name}</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">{breadcrumbTitle}</li>
            </ol>
          </nav>
          <p className="eyebrow mt-5">Buying Guide</p>
          <h1 className="mt-3 text-[2.125rem] leading-[1.1] sm:text-[2.75rem] lg:text-[3rem]">{editorialHeadline}</h1>
          <p className="mt-3 text-[1.125rem] leading-relaxed sm:text-[1.25rem]">{dek}</p>
          <div className="mt-4 text-sm leading-relaxed text-ink-secondary">
            <p>By <span className="font-medium text-ink">{SITE_NAME} Editors</span></p>
            <p>
              <time dateTime={lastUpdated}>Updated {formatDate(lastUpdated)}</time>
              <span aria-hidden> · </span>
              {readTime} read
              <span aria-hidden> · </span>
              {products.length} products evaluated
            </p>
          </div>
        </header>

        {/* Skip the hero when it would just repeat a product shot shown below. */}
        {heroImage && !products.some((p) => p.imageUrl === heroImage) && (
          <figure className="relative mt-6 aspect-[16/9] max-h-[440px] w-full overflow-hidden bg-surface sm:aspect-[21/9]">
            <SafeImage src={heroImage} alt={breadcrumbTitle} fill priority sizes="(max-width: 1120px) 100vw, 1060px" className="object-contain p-4" unoptimized />
          </figure>
        )}

        {/* ── Body: article column + sticky rail ── */}
        <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,760px)_220px] lg:justify-between lg:gap-12">
          <div className="min-w-0">
            <div className="lg:hidden">
              <GuideJumpTo items={toc} />
            </div>

            {introParagraphs.length > 0 && (
              <div className="mt-6 max-w-[68ch] space-y-5 text-[1.0625rem] leading-[1.75] lg:mt-0">
                {introParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}

            {gardenFitChecks.length > 0 && (
              <section aria-labelledby="garden-fit-check" className="mt-12 border-y border-border bg-surface px-5 py-6 sm:px-7">
                <p className="eyebrow">Gardening Is Ezee field notes</p>
                <h2 id="garden-fit-check" className="mt-2 text-[1.625rem] leading-tight sm:text-[1.875rem]">The Garden Fit Check</h2>
                <p className="mt-2 max-w-[68ch]">A quick way to connect the shortlist to the space, workload and ownership details that matter after the box arrives.</p>
                <dl className="mt-5 divide-y divide-border border-y border-border">
                  {gardenFitChecks.map((item) => (
                    <div key={item.label} className="py-4 sm:grid sm:grid-cols-[190px_1fr] sm:gap-7">
                      <dt className="font-semibold text-ink">{item.label}</dt>
                      <dd className="mt-1 text-base leading-relaxed text-ink-secondary sm:mt-0">{item.text}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section aria-labelledby="quick-picks" className="mt-12">
              <h2 id="quick-picks" className={sectionTitle}>The Practical Shortlist</h2>
              <p className="mt-2 mb-5">A garden-first look at {products.length} options, organized around the job each one suits best.</p>
              <GuideQuickPicks products={products} />
            </section>

            <section aria-labelledby="our-picks" className="mt-14">
              <h2 id="our-picks" className={`${sectionTitle} border-b border-ink pb-3`}>Why Each Pick Made the Cut</h2>
              <div className="mt-6">
                {products.map((product) => (
                  <GuideProductPick key={product.id} product={product} products={products} total={products.length} />
                ))}
              </div>
            </section>

            {howWeEvaluated.length > 0 && (
              <section aria-labelledby="how-we-chose" className="mt-14">
                <h2 id="how-we-chose" className={sectionTitle}>{headings.howWeChose}</h2>
                <p className="mt-2">Each pick was assessed across {howWeEvaluated.length} criteria weighted for real-world use.</p>
                <dl className="mt-6 divide-y divide-border border-y border-border">
                  {howWeEvaluated.map((item, i) => (
                    <div key={i} className="py-5 sm:grid sm:grid-cols-[200px_1fr] sm:gap-8">
                      <dt className="font-[family-name:var(--font-display)] text-[1.1875rem] font-semibold leading-snug text-ink">{item.title}</dt>
                      <dd className="mt-1.5 text-base leading-relaxed text-ink-secondary sm:mt-0">{item.description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {buyingCriteria.length > 0 && (
              <section aria-labelledby="what-to-look-for" className="mt-14">
                <h2 id="what-to-look-for" className={sectionTitle}>
                  {headings.whatToLookFor}
                </h2>
                <p className="mt-2">Key buying criteria so you get the right fit the first time.</p>
                <ol className="mt-6 divide-y divide-border border-y border-border">
                  {buyingCriteria.map((item, i) => (
                    <li key={i} className="py-6">
                      <h3 className="flex gap-3 text-[1.25rem] leading-snug">
                        <span aria-hidden className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                        {item.criterion}
                      </h3>
                      <div className="mt-3 max-w-[68ch] space-y-4 text-base leading-relaxed">
                        {item.explanation.split("\n\n").map((para, pi) => <p key={pi}>{para}</p>)}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {howToChoose.length > 0 && (
              <section aria-labelledby="comparison" className="mt-14">
                <h2 id="comparison" className={sectionTitle}>{headings.howToChoose}</h2>
                <div className="mt-6 space-y-10">
                  {howToChoose.map((sub, i) => (
                    <div key={i}>
                      <h3 className="text-[1.25rem] leading-snug">{sub.subheading}</h3>
                      {sub.intro && <p className="mt-2 max-w-[68ch] text-base leading-relaxed">{sub.intro}</p>}
                      {sub.table && (
                        <div className="mt-4">
                          <div
                            role="region"
                            aria-label={`${sub.subheading} (table, scrolls sideways)`}
                            tabIndex={0}
                            className="-mx-4 overflow-x-auto px-4 focus-ring sm:mx-0 sm:px-0"
                          >
                            <table className={`w-full border-collapse text-left ${sub.table.headers.length > 2 ? "min-w-[36rem]" : ""}`}>
                              <thead>
                                <tr className="border-b border-ink">
                                  {sub.table.headers.map((h, hi) => (
                                    <th key={hi} scope="col" className="py-3 pr-5 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-secondary">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {sub.table.rows.map((row, ri) => (
                                  <tr key={ri} className="align-top">
                                    {row.map((cell, ci) =>
                                      ci === 0 ? (
                                        <th key={ci} scope="row" className="py-3 pr-5 text-[0.9375rem] font-semibold leading-snug text-ink">{cell}</th>
                                      ) : (
                                        <td key={ci} className="py-3 pr-5 text-[0.9375rem] leading-snug text-ink-secondary">{cell}</td>
                                      )
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {sub.table.headers.length > 2 && (
                            <p className="mt-2 text-sm text-ink-secondary sm:hidden">Scroll sideways to see every column.</p>
                          )}
                        </div>
                      )}
                      {sub.cards && (
                        <dl className="mt-4 divide-y divide-border border-y border-border">
                          {sub.cards.map((c, ci) => (
                            <div key={ci} className="py-4 sm:grid sm:grid-cols-[200px_1fr] sm:gap-8">
                              <dt className="font-semibold text-ink">{c.label}</dt>
                              <dd className="mt-1 text-base leading-relaxed text-ink-secondary sm:mt-0">{c.text}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {sub.note && <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{sub.note}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {faq.length > 0 && (
              <section aria-labelledby="faq" className="mt-14">
                <h2 id="faq" className={sectionTitle}>Before You Bring One Home</h2>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {faq.map((item, i) => (
                    <div key={i} className="py-5">
                      <h3 className="text-[1.1875rem] leading-snug">{item.q}</h3>
                      <p className="mt-2 max-w-[68ch] text-base leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="bottom-line" className="mt-14 border-t border-ink pt-6">
              <h2 id="bottom-line" className="text-[1.5rem]">Bottom Line</h2>
              {props.bottomLine && props.bottomLine.length > 0 ? (
                <div className="mt-3 max-w-[68ch] space-y-4 text-[1.0625rem] leading-relaxed">
                  {props.bottomLine.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ) : (
                <>
                  {products[0] && (
                    <p className="mt-3 max-w-[68ch] text-[1.0625rem] leading-relaxed">
                      <strong className="text-ink">Best overall:</strong>{" "}
                      <a href={`#${products[0].id}`} className="font-semibold">{products[0].name}</a>
                      {" "}— {products[0].badge.toLowerCase()} pick in this roundup. See the full verdicts above for every pick,
                      with pros, cons and who each one suits.
                    </p>
                  )}
                  <p className="mt-4 text-[0.9375rem]">
                    <a
                      href={`https://www.amazon.com/s?k=${amazonQuery}&tag=${AMAZON_TAG}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="!text-ink underline decoration-border-dark underline-offset-4 hover:decoration-ink"
                    >
                      Browse all {productNounPlural.toLowerCase()} on Amazon
                    </a>
                    <span className="text-ink-secondary"> — Prime-eligible options with current pricing.</span>
                  </p>
                </>
              )}
            </section>

            {relatedGuides.length > 0 && (
              <section aria-labelledby="related" className="mt-14">
                <h2 id="related" className="border-b border-ink pb-3 text-[1.5rem]">Related Guides</h2>
                <ul className="divide-y divide-border">
                  {relatedGuides.map((g) => {
                    const isExternal = /^https?:\/\//.test(g.href);
                    const href = isExternal ? g.href : resolveHref(g.href);
                    const cls = "group flex items-baseline justify-between gap-4 py-4 font-[family-name:var(--font-display)] text-[1.125rem] leading-snug !text-ink hover:!text-brand focus-ring";
                    const inner = (<>{g.title}<span aria-hidden className="shrink-0 font-[family-name:var(--font-body)] text-ink-secondary transition-transform group-hover:translate-x-0.5">→</span></>);
                    return (
                      <li key={g.href}>
                        {isExternal ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                        ) : (
                          <Link prefetch={false} href={href} className={cls}>{inner}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          <aside className="hidden lg:block">
            <GuideTocSidebar items={toc} />
          </aside>
        </div>
      </article>
    </>
  );
}
