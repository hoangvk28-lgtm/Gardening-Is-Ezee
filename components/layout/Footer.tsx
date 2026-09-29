import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { footerNav } from "@/data/nav";
import { DISCLOSURE_SHORT } from "@/lib/affiliate";
import { getPublicFooterSettings, getPublicAffiliateSettings } from "@/lib/public-settings";

export async function Footer() {
  const year = new Date().getFullYear();
  const [footerSettings, affiliateSettings] = await Promise.all([
    getPublicFooterSettings(),
    getPublicAffiliateSettings(),
  ]);

  const disclosureText = affiliateSettings.disclosureShort || DISCLOSURE_SHORT;

  return (
    <footer className="bg-ink text-ink-inverse mt-auto">
      {/* Affiliate disclosure strip */}
      {footerSettings.showAffiliateDisclosure && (
        <div className="bg-ink/80 border-b border-white/10">
          <Container className="py-3">
            <p className="text-xs text-ink-inverse/70 text-center whitespace-nowrap">{disclosureText}</p>
          </Container>
        </div>
      )}

      {/* Main footer */}
      <Container className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link prefetch={false} href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/logo-icon.png"
                alt=""
                width={96}
                height={96}
                className="h-10 w-10 object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
              <span
                className="text-lg font-bold tracking-tight opacity-90"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink-inverse)" }}
              >
                workcocoon
              </span>
            </Link>
            <p className="text-sm text-ink-inverse/75 leading-relaxed max-w-xs">
              {footerSettings.description}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {footerNav.categories.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false} href={link.href} className="text-sm text-ink-inverse/80 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2.5">
              {footerNav.company.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false} href={link.href} className="text-sm text-ink-inverse/80 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false} href={link.href} className="text-sm text-ink-inverse/80 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-inverse/60">
            © {year} {footerSettings.copyrightText}
          </p>
          <p className="text-xs text-ink-inverse/55 text-center sm:text-right max-w-sm">
            Amazon and the Amazon logo are trademarks of Amazon.com, Inc. Product images shown are representative.
          </p>
        </div>
      </Container>
    </footer>
  );
}
