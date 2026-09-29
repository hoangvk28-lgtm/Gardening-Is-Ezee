import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteDisclosureBar } from "@/components/affiliate/SiteDisclosureBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-icon.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <SiteHeader />
      <SiteDisclosureBar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
