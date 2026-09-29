import Link from "next/link";
import { shoppingCategories } from "@/data/homepage-editorial";
import { CategoryIcon } from "./CategoryIcon";

export function ShoppingCategoryStrip() {
  return (
    <nav aria-labelledby="shopping-for" className="mt-10 border-y border-border py-5 lg:mt-12">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
        <h2 id="shopping-for" className="shrink-0 text-[1.375rem] leading-tight xl:w-36">
          What are you shopping for?
        </h2>
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 xl:mx-0 xl:flex-1 xl:overflow-visible xl:px-0">
          {shoppingCategories.map((c) => (
            <li key={c.label} className="shrink-0 snap-start border-l border-border first:border-l-0 xl:flex-1 xl:shrink xl:first:border-l">
              <Link
                prefetch={false}
                href={c.href}
                className="group flex min-h-12 w-[8.5rem] items-center gap-3 px-3 py-1.5 text-ink focus-ring sm:w-[9rem] xl:w-auto xl:px-3"
              >
                <CategoryIcon name={c.icon} className="h-8 w-8 shrink-0 text-ink transition-colors group-hover:text-brand" />
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold leading-tight text-ink transition-colors group-hover:text-brand">
                    {c.label}
                  </span>
                  <span className="mt-0.5 hidden text-[0.8125rem] leading-snug text-ink-secondary xl:block">{c.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
