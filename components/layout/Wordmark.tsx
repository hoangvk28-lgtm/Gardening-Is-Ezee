import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup: monochrome OJ mark + text wordmark (the text stays the primary
 * element). The whole lockup links home.
 */
export function Wordmark({ size = "md" }: { size?: "md" | "sm" }) {
  const md = size === "md";
  return (
    <Link prefetch={false} href="/" aria-label="Gardening Is Ezee — home" className="group inline-flex items-center gap-2.5 focus-ring sm:gap-3">
      <Image
        src="/images/brand/mark.png"
        alt=""
        width={72}
        height={72}
        priority={md}
        unoptimized
        className={md ? "h-7 w-7 shrink-0 sm:h-8 sm:w-8 xl:h-[34px] xl:w-[34px]" : "h-6 w-6 shrink-0"}
      />
      <span className="flex flex-col">
        <span
          className={`font-[family-name:var(--font-display)] whitespace-nowrap font-semibold uppercase leading-none tracking-[0.01em] text-ink ${
            md ? "text-[1.0625rem] min-[360px]:text-[1.25rem] sm:text-[1.5rem] lg:text-[1.3125rem] xl:text-[1.625rem]" : "text-lg"
          }`}
        >
          Gardening Is Ezee
        </span>
        {md && (
          <span className="mt-1.5 hidden whitespace-nowrap text-[0.5625rem] font-medium uppercase leading-none tracking-[0.32em] text-ink-secondary sm:block lg:hidden xl:block">
            Better gardens, less guesswork.
          </span>
        )}
      </span>
    </Link>
  );
}
