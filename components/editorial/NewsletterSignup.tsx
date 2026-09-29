"use client";

import { useState } from "react";

// NOTE: no newsletter backend exists yet (same as the previous NewsletterCTA).
// The form validates and confirms locally; wire `onSubmit` to a provider later.
export function NewsletterSignup() {
  const [done, setDone] = useState(false);

  return (
    <section aria-labelledby="newsletter-heading" className="py-14 lg:py-16">
      <div className="grid gap-8 border-t border-ink pt-10 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <p className="eyebrow">The Gardening Is Ezee Weekly</p>
          <h2 id="newsletter-heading" className="mt-3 text-[2rem] leading-tight sm:text-[2.5rem]">
            An easier way to garden.
          </h2>
          <p className="mt-3 text-[1.0625rem]">
            Seasonal garden jobs, useful tools and the newest guides, delivered once a week.
          </p>
        </div>
        <div>
          {done ? (
            <p role="status" className="border-l-2 border-olive pl-4 text-ink">
              Thank you — you’re on the list. The next issue arrives this week.
            </p>
          ) : (
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="min-h-12 flex-1 rounded-[2px] border border-border-dark bg-surface px-4 text-[0.9375rem] text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              />
              <button
                type="submit"
                className="min-h-12 rounded-[2px] bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand focus-ring"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-ink-secondary">One email a week. No sponsored content. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
