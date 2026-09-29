import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure - Gardening Is Ezee",
  description:
    "Gardening Is Ezee participates in the Amazon Associates program. Read our disclosure on how we earn commissions and why it doesn't affect our recommendations.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <Container narrow className="py-14">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Transparency</span>
        <h1 className="text-4xl font-bold text-ink mt-2 mb-4 tracking-tight">
          Affiliate Disclosure
        </h1>
        <p className="text-sm text-ink-muted">Last updated: January 2026</p>
      </header>

      {/* Required FTC / Amazon Associates statement - prominent */}
      <div className="mb-10 p-5 rounded-lg border-2 border-brand-muted bg-brand-light">
        <p className="font-bold text-ink text-sm mb-1">Required Disclosure</p>
        <p className="text-ink leading-relaxed text-sm">
          As an Amazon Associate, we may earn from qualifying purchases. Gardening Is Ezee is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
        </p>
      </div>

      <div className="space-y-10 text-sm text-ink-secondary leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">How Affiliate Links Work</h2>
          <p className="mb-3">
            When you click a product link on Gardening Is Ezee and complete a purchase on Amazon, Amazon may pay us a referral fee. This fee is paid by Amazon and is not added to your order.
          </p>
          <p>
            Our links include an affiliate tag (<code className="font-mono text-xs bg-bg px-1.5 py-0.5 rounded border border-border text-ink">theofficejournal-20</code>) that allows Amazon to attribute the referral to our account. This tag is the only information passed; we do not receive your name, address, or payment details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">Does This Affect Our Recommendations?</h2>
          <p className="mb-3">
            No. Our product rankings and recommendations are determined entirely by our editorial evaluation process, which you can read in full on our{" "}
            <Link prefetch={false} href="/how-we-review" className="text-brand hover:text-brand-dark font-medium underline underline-offset-2 transition-colors">
              How We Review page
            </Link>.
          </p>
          <p className="mb-3">
            We do not accept payment from brands or manufacturers for higher placement or better scores. Affiliate relationships do not determine which products we recommend or how they are ranked.
          </p>
          <p>
            Editorial recommendations should remain - and do remain - independent. If a product is not the best choice for our readers, we do not recommend it regardless of its commission rate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">Amazon Associates Program</h2>
          <p className="mb-3">
            Gardening Is Ezee is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>
          <p>
            Amazon, the Amazon logo, AmazonSupply, and the AmazonSupply logo are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">Where Disclosures Appear</h2>
          <p className="mb-3">In addition to this dedicated page, our affiliate disclosure appears:</p>
          <ul className="space-y-2 list-none">
            {[
              "In the disclosure bar visible at the top of every page on the site",
              "Near every product recommendation section in our buying guides",
              "On our deals page near all product cards",
              "In the footer of every page",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-brand shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">FTC Compliance</h2>
          <p>
            This disclosure is made in compliance with the United States Federal Trade Commission (FTC) guidelines on endorsements and testimonials (16 C.F.R. Part 255). The FTC requires that any material connection between an endorser and a product or service be clearly disclosed. Our Amazon affiliate relationship constitutes such a material connection, and we disclose it on every relevant page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">Questions?</h2>
          <p>
            If you have questions about our affiliate relationships or our editorial independence, please{" "}
            <Link prefetch={false} href="/contact" className="text-brand hover:text-brand-dark font-medium underline underline-offset-2 transition-colors">
              contact us
            </Link>. We are happy to explain our process in more detail.
          </p>
        </section>

      </div>
    </Container>
  );
}
