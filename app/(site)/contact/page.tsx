import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Gardening Is Ezee",
  description:
    "Get in touch with the Gardening Is Ezee team. Corrections, product suggestions, buying questions, and press inquiries welcome.",
  path: "/contact",
});

const TOPICS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
      </svg>
    ),
    title: "Corrections & Updates",
    desc: "Found an error in a guide or a product that has been discontinued? We will update it.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Product Suggestions",
    desc: "Know a great small-space product we have not covered? We would like to evaluate it.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
    title: "Buying Questions",
    desc: "Not sure which product is right for your specific situation? Describe your space and we will point you in the right direction.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
    title: "Press & Media",
    desc: "Writing about small-space living, affiliate publishing, or consumer research? We are open to talking.",
  },
];

export default function ContactPage() {
  return (
    <Container narrow className="py-14">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Get in Touch</span>
        <h1 className="text-4xl font-bold text-ink mt-2 mb-4 tracking-tight">Contact Us</h1>
        <p className="text-lg text-ink-secondary leading-relaxed">
          We read every message. Corrections, product suggestions, and buying questions are especially welcome.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Left: topics + email */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-ink mb-4">What to Reach Out About</h2>
            <ul className="space-y-4">
              {TOPICS.map((topic) => (
                <li key={topic.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center shrink-0 mt-0.5">
                    {topic.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{topic.title}</p>
                    <p className="text-sm text-ink-secondary mt-0.5 leading-relaxed">{topic.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct email */}
          <div className="p-4 rounded-card border border-border bg-white">
            <p className="text-sm font-semibold text-ink mb-1.5">Prefer email directly?</p>
            <p className="text-sm text-ink-secondary leading-relaxed mb-2">
              You can reach us at:
            </p>
            <a
              href="mailto:hello@gardeningisezee.com"
              className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors break-all"
            >
              hello@gardeningisezee.com
            </a>
            <p className="text-xs text-ink-muted mt-2">
              We aim to respond within 3 business days.
            </p>
          </div>

          {/* Useful links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">Useful Pages</p>
            <ul className="space-y-1.5 text-sm">
              <li><Link prefetch={false} href="/how-we-review" className="text-brand hover:text-brand-dark transition-colors font-medium">How We Review Products →</Link></li>
              <li><Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:text-brand-dark transition-colors font-medium">Affiliate Disclosure →</Link></li>
              <li><Link prefetch={false} href="/about" className="text-brand hover:text-brand-dark transition-colors font-medium">About Gardening Is Ezee →</Link></li>
              <li><Link prefetch={false} href="/privacy-policy" className="text-brand hover:text-brand-dark transition-colors font-medium">Privacy Policy →</Link></li>
            </ul>
          </div>
        </div>

        {/* Right: contact form */}
        <div className="md:col-span-3">
          <h2 className="text-lg font-bold text-ink mb-5">Send a Message</h2>
          <form className="flex flex-col gap-4" action="#" method="post">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-ink-secondary">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="px-4 py-2.5 rounded-btn border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  placeholder="Jane Smith"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-ink-secondary">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="px-4 py-2.5 rounded-btn border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-sm font-semibold text-ink-secondary">
                Topic
              </label>
              <select
                id="subject"
                name="subject"
                className="px-4 py-2.5 rounded-btn border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              >
                <option value="">Select a topic...</option>
                <option value="correction">Correction or Update</option>
                <option value="suggestion">Product Suggestion</option>
                <option value="question">Buying Question</option>
                <option value="press">Press Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-semibold text-ink-secondary">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="px-4 py-2.5 rounded-btn border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-y"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand text-white font-semibold rounded-btn hover:bg-brand-dark transition-colors focus-ring text-sm"
              >
                Send Message
              </button>
              <p className="mt-2 text-xs text-ink-muted">
                This form does not have a backend connected yet. Please email us directly at hello@gardeningisezee.com.
              </p>
            </div>
          </form>
        </div>

      </div>
    </Container>
  );
}
