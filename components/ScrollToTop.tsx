"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  const isPopNavigation = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Deliberately do NOT touch history.scrollRestoration here. Next.js's App
    // Router manages it internally for its own client-side navigation cache, and
    // a previous version of this component overriding it to "manual" is what
    // broke both scroll-to-top-on-navigate and restoring position on back/forward.
    const handlePopState = () => {
      isPopNavigation.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Only force a scroll-to-top for genuine forward navigations (clicking a link).
    // Back/forward navigations are left alone so the browser's own scroll
    // restoration (re-enabled above) can put the user back where they were.
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
