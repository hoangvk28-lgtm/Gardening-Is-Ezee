import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiloHub } from "@/components/sections/SiloHub";
import { getSiloBySlug } from "@/data/silos";
import { buildMetadata } from "@/lib/seo";
import { getPublicGuidesByCategory } from "@/lib/public-guides";
import { matchSlugsForSilo } from "@/lib/migrated-silos";
import { getInformationalGuidesBySilo } from "@/data/informational-guides";

export const revalidate = 86400;

const SLUG = "growing";

export async function generateMetadata(): Promise<Metadata> {
  const silo = getSiloBySlug(SLUG);
  if (!silo) return {};
  return buildMetadata({
    title: silo.name,
    description: silo.description,
    path: `/${SLUG}`,
  });
}

export default async function Page() {
  const silo = getSiloBySlug(SLUG);
  if (!silo) notFound();
  const guides = await getPublicGuidesByCategory(SLUG, matchSlugsForSilo(SLUG));
  const informational = getInformationalGuidesBySilo(SLUG);
  return (
    <SiloHub
      silo={silo}
      guides={[
        ...informational.map((g) => ({ slug: g.slug, title: g.title, description: g.description, readTime: g.readTime })),
        ...guides.map((g) => ({ slug: g.slug, title: g.title, description: g.description, readTime: g.readTime })),
      ]}
    />
  );
}
