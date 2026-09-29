"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { markdownToHtml } from "@/lib/markdown";

interface RichContentProps {
  html: string;
  className?: string;
}

/**
 * Renders Tiptap HTML output with proper link handling:
 * - Internal links (/path) use Next.js client-side navigation
 * - External links open in a new tab with rel="noopener noreferrer"
 */
export function RichContent({ html, className = "" }: RichContentProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Internal link: starts with / or same origin
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);

      if (isInternal) {
        e.preventDefault();
        const path = href.startsWith("/")
          ? href
          : href.replace(window.location.origin, "");
        router.push(path);
      } else {
        // External: ensure opens in new tab
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    }

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [router]);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(html) }}
      className={`prose max-w-none ${className}`}
    />
  );
}
