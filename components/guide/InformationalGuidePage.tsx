import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getSiloBySlug } from "@/data/silos";
import type { InformationalGuide } from "@/data/informational-guides";

export function InformationalGuidePage({ guide }: { guide: InformationalGuide }) {
  const silo = getSiloBySlug(guide.silo)!;
  const canonicalUrl = `${SITE_URL}/${guide.silo}/${guide.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    author: { "@type": "Organization", name: `${SITE_NAME} Editors`, url: `${SITE_URL}/about` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: silo.name, item: `${SITE_URL}/${silo.slug}` },
      { "@type": "ListItem", position: 3, name: guide.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="mx-auto w-full max-w-[1080px] px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <header className="max-w-[760px]">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-secondary">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="!text-ink-secondary hover:!text-brand">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`/${silo.slug}`} className="!text-ink-secondary hover:!text-brand">{silo.name}</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">How-To</li>
            </ol>
          </nav>
          <p className="eyebrow mt-6">Practical Garden Guide</p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.08] sm:text-[3rem]">{guide.title}</h1>
          <p className="mt-4 max-w-[68ch] text-[1.125rem] leading-relaxed sm:text-[1.25rem]">{guide.dek}</p>
          <p className="mt-5 text-sm text-ink-secondary">
            By <span className="font-medium text-ink">{SITE_NAME} Editors</span>
            <span aria-hidden> · </span>
            Updated <time dateTime={guide.lastUpdated}>{formatDate(guide.lastUpdated)}</time>
            <span aria-hidden> · </span>{guide.readTime} read
          </p>
        </header>

        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,720px)_220px] lg:justify-between lg:gap-14">
          <div className="min-w-0">
            <section aria-labelledby="quick-answer" className="border-l-4 border-brand bg-surface px-5 py-5 sm:px-7">
              <p className="eyebrow">Quick answer</p>
              <h2 id="quick-answer" className="sr-only">Quick answer</h2>
              <p className="mt-2 text-[1.0625rem] leading-[1.75] text-ink">{guide.directAnswer}</p>
            </section>

            <section aria-labelledby="key-takeaways" className="mt-8 border-y border-border py-6">
              <h2 id="key-takeaways" className="text-[1.5rem]">Key takeaways</h2>
              <ul className="mt-4 space-y-3">
                {guide.keyTakeaways.map((item) => <li key={item} className="flex gap-3 leading-relaxed"><span aria-hidden className="font-semibold text-brand">✓</span><span>{item}</span></li>)}
              </ul>
            </section>

            {guide.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`} className="mt-11 scroll-mt-28">
                <h2 className="border-b border-border pb-3 text-[1.75rem] leading-tight">{section.heading}</h2>
                <div className="mt-5 max-w-[68ch] space-y-5 text-[1.0625rem] leading-[1.75]">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul className="space-y-3 pl-5">{section.bullets.map((item) => <li key={item} className="list-disc pl-1">{item}</li>)}</ul>}
                </div>
              </section>
            ))}

            <section id="faq" className="mt-12 scroll-mt-28" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="border-b border-ink pb-3 text-[1.75rem]">Frequently asked questions</h2>
              <div className="divide-y divide-border">
                {guide.faq.map((item) => <div key={item.question} className="py-5"><h3 className="text-[1.1875rem]">{item.question}</h3><p className="mt-2 leading-relaxed text-ink-secondary">{item.answer}</p></div>)}
              </div>
            </section>

            <section className="mt-12 border-t border-border pt-7" aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-[1.375rem]">Sources and further reading</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">This guide is based on public guidance from university extension services and government agencies. Local climate and regulations may differ.</p>
              <ul className="mt-4 space-y-2 text-sm">
                {guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
              </ul>
            </section>

            <section className="mt-10 bg-surface p-6" aria-labelledby="related-heading">
              <p className="eyebrow">Continue reading</p>
              <h2 id="related-heading" className="mt-2 text-[1.5rem]">Related Gardening Is Ezee guides</h2>
              <ul className="mt-4 space-y-3">
                {guide.related.map((item) => <li key={item.href}><Link href={item.href} className="font-semibold underline decoration-brand/40 underline-offset-4 hover:decoration-brand">{item.title} →</Link></li>)}
              </ul>
            </section>
          </div>

          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28 border-l border-border pl-5">
              <p className="eyebrow">On this page</p>
              <ol className="mt-4 space-y-3 text-sm">
                {guide.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`} className="!text-ink-secondary hover:!text-brand">{section.heading}</a></li>)}
                <li><a href="#faq" className="!text-ink-secondary hover:!text-brand">FAQ</a></li>
              </ol>
            </nav>
          </aside>
        </div>
      </article>
    </>
  );
}
