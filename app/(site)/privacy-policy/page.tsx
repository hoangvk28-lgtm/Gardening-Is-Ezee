import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy - Gardening Is Ezee",
  description:
    "Gardening Is Ezee privacy policy. How we collect, use, and protect your information, including cookies, analytics, affiliate links, and contact data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <Container narrow className="py-14">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Legal</span>
        <h1 className="text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-ink-muted">Last updated: January 2026</p>
      </header>

      {/* Overview callout */}
      <div className="mb-10 p-4 bg-bg rounded-lg border border-border text-sm text-ink-secondary leading-relaxed">
        <strong className="text-ink">Summary:</strong> Gardening Is Ezee does not sell your data. We use anonymized analytics to understand what content is useful, and contact form submissions only to respond to your inquiry. Affiliate links go to Amazon, which has its own privacy policy.
      </div>

      <div className="space-y-10 text-sm text-ink-secondary leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">1. Overview</h2>
          <p>
            Gardening Is Ezee (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the site&rdquo;) operates at gardeningisezee.com. This policy explains what information we collect from visitors, how we use it, and your rights regarding that information. If you have questions, see the{" "}
            <Link prefetch={false} href="/contact" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">Contact</Link>{" "}
            section at the bottom of this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">2. Information We Collect</h2>

          <h3 className="text-base font-semibold text-ink mb-2">Analytics data</h3>
          <p className="mb-4">
            We use anonymized analytics to understand which content is most useful to our readers. This may include page views, approximate geographic region (country level only), device type, browser type, and referring URLs. We do not collect names, email addresses, or any personally identifiable information through analytics. We do not build individual visitor profiles.
          </p>

          <h3 className="text-base font-semibold text-ink mb-2">Contact form submissions</h3>
          <p className="mb-4">
            If you contact us through our contact form, we collect your name and email address solely to respond to your inquiry. We do not add contact form submissions to any mailing list without your explicit consent, and we do not share them with third parties.
          </p>

          <h3 className="text-base font-semibold text-ink mb-2">Affiliate link clicks</h3>
          <p>
            When you click an affiliate link to Amazon.com, you leave our site and are subject to{" "}
            <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">
              Amazon&apos;s privacy policy
            </a>. We do not receive personally identifiable information from Amazon when you make a purchase - we receive only an anonymous commission notification associated with our affiliate tag.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">3. Affiliate Links</h2>
          <p className="mb-3">
            As an Amazon Associate, we earn a small commission on qualifying purchases made through our links at no additional cost to you. Our affiliate tag (<code className="font-mono text-xs bg-bg px-1.5 py-0.5 rounded border border-border text-ink">theofficejournal-20</code>) is embedded in product links.
          </p>
          <p>
            For full details of our affiliate relationship and how it affects (or doesn&apos;t affect) our editorial recommendations, see our{" "}
            <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">
              Affiliate Disclosure page
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">4. Cookies</h2>
          <p className="mb-3">
            Gardening Is Ezee uses the minimum cookies necessary for the site to function (session management) and analytics cookies to understand visitor behavior in aggregate. We do not use advertising cookies, retargeting cookies, or cookies that track you across other websites.
          </p>
          <p>
            You can control or disable cookies in your browser settings. Disabling analytics cookies will not affect your ability to use any part of this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">5. Analytics</h2>
          <p>
            We may use a third-party analytics service (such as Google Analytics with IP anonymization enabled, or a privacy-focused alternative like Plausible Analytics) to understand aggregate traffic patterns. These services process data according to their own privacy policies. We configure analytics to minimize data collection and do not enable advertising or remarketing features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">6. Third-Party Links</h2>
          <p>
            Our site contains links to Amazon.com and other external sites. Once you leave Gardening Is Ezee, you are subject to the privacy policies of those sites. We are not responsible for the content or privacy practices of third-party websites. We recommend reviewing the privacy policy of any site you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">7. Data Retention</h2>
          <p>
            Contact form data is retained only as long as necessary to respond to your inquiry - typically no more than 90 days. Anonymized analytics data may be retained longer for trend analysis but contains no personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">8. Your Rights</h2>
          <p className="mb-3">
            Depending on your location, you may have the right to access, correct, or request deletion of any personal data you have provided to us. To make such a request, contact us via our{" "}
            <Link prefetch={false} href="/contact" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">
              contact page
            </Link>. We will respond within 30 days.
          </p>
          <p>
            If you are located in the European Economic Area (EEA), the UK, or California, additional rights may apply to you under GDPR, the UK GDPR, or the CCPA respectively. Contact us for more information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">9. Children&apos;s Privacy</h2>
          <p>
            Gardening Is Ezee is not directed to children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently received personal information from a child under 13, we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy periodically. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision. Continued use of the site after any changes constitutes acceptance of the updated policy. We will not make material changes that significantly reduce your privacy rights without providing prominent notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">11. Contact</h2>
          <p className="mb-3">
            Questions about this privacy policy or our data practices?
          </p>
          <div className="flex flex-wrap gap-4">
            <Link prefetch={false}
              href="/contact"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              Contact form →
            </Link>
            <a
              href="mailto:hello@gardeningisezee.com"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              hello@gardeningisezee.com →
            </a>
          </div>
        </section>

      </div>
    </Container>
  );
}
