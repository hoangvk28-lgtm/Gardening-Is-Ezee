import Link from "next/link";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { SectionHeader } from "./SectionHeader";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 7.409A2.25 2.25 0 0 1 2.25 5.493V5.25" />
    </svg>
  ),
  GraduationCap: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342m-7.48 0 3.74 1.342m3.74-1.342a50.716 50.716 0 0 1 3.741 1.342" />
    </svg>
  ),
  Archive: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Briefcase: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006-3.75 3.75m0 0-3.75-3.75M15.75 18.75v-2.25m0 2.25h2.25m-2.25 0h-2.25m0 0v-2.25m0 2.25H11.25M8.25 14.25V7.5m0 6.75L5.25 14.25M8.25 21v-3m0 3h-.375a.375.375 0 0 1-.375-.375v-.375m-5.25-3V7.5A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5v6.75a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25z" />
    </svg>
  ),
  Tag: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  Chair: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8.25V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v2.25M6 8.25h12M6 8.25l-.75 8.25a1.5 1.5 0 0 0 1.5 1.65h.5a1.5 1.5 0 0 0 1.493-1.35l.257-2.4h5l.257 2.4A1.5 1.5 0 0 0 15.75 18.15h.5a1.5 1.5 0 0 0 1.5-1.65L17 8.25" />
    </svg>
  ),
  Lightbulb: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6m-5.25 3h4.5M12 3a6 6 0 0 0-6 6c0 2.25 1.25 3.5 2.25 4.5.75.75 1.25 1.5 1.25 2.5h5c0-1 .5-1.75 1.25-2.5 1-1 2.25-2.25 2.25-4.5a6 6 0 0 0-6-6Z" />
    </svg>
  ),
};

export function CategoryGrid() {
  return (
    <section className="py-14">
      <SectionHeader
        eyebrow="Build Your Setup"
        title="Every piece of a better workday"
        description="Desk, chair, monitor, lighting, accessories - find the guide for what you need next."
        href="/categories"
        hrefLabel="All categories"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const guideCount = cat.matchSlugs
            ? guides.filter((g) => cat.matchSlugs!.includes(g.categorySlug) || cat.matchSlugs!.includes(g.subcategorySlug)).length
            : guides.filter((g) => g.categorySlug === cat.slug).length;
          const subcategoryCount = cat.subcategories?.length ?? 0;

          return (
            <Link prefetch={false}
              key={cat.slug}
              href={`/categories/${cat.slug}`}
             
              className="group flex flex-col gap-3 p-5 bg-white rounded-card border border-border border-t-4 border-t-transparent min-w-0 hover:shadow-card-hover hover:border-transparent hover:translate-y-[-2px] transition-all"
              style={{ borderTopColor: cat.color }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-lg text-white transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.color }}
                aria-hidden="true"
              >
                {iconMap[cat.icon]}
              </div>

              {/* Name + description */}
              <div>
                <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-sm leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-ink-secondary mt-1 leading-relaxed line-clamp-2">
                  {cat.shortDescription}
                </p>
              </div>

              {/* Guide count */}
              <div className="flex items-center gap-1 text-xs text-ink-muted mt-auto">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                {guideCount} {guideCount === 1 ? "guide" : "guides"}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
