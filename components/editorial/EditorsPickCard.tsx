import Link from "next/link";
import type { PickView } from "@/lib/homepage";
import { EditorialImage } from "./EditorialImage";

/** Editorial-first product pick: the review link leads, price check is secondary. */
export function EditorsPickCard({ pick }: { pick: PickView }) {
  return (
    <article className="group flex flex-col">
      <Link prefetch={false} href={pick.reviewHref} tabIndex={-1} aria-hidden>
        <EditorialImage src={pick.image} alt="" aspect="aspect-square" fit="contain" className="!bg-surface" sizes="(max-width: 640px) 100vw, 280px" />
      </Link>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-olive">{pick.useCase}</p>
      <h3 className="mt-1.5 text-[1.25rem] leading-snug">
        <Link prefetch={false} href={pick.reviewHref} className="text-ink transition-colors hover:text-brand focus-ring">
          {pick.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-base leading-relaxed">{pick.sentence}</p>
      <div className="mt-auto flex items-center gap-5 pt-4 text-[0.9375rem]">
        <Link prefetch={false} href={pick.reviewHref} className="font-medium focus-ring">
          Read review <span aria-hidden>→</span>
        </Link>
        {pick.priceHref && (
          <a
            href={pick.priceHref}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="!text-ink-secondary underline decoration-border-dark underline-offset-4 hover:!text-ink focus-ring"
          >
            Check price<span className="sr-only"> for {pick.name} (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
