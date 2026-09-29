"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that degrades to the frame's neutral background (plus a quiet
 * monogram) instead of a broken-image icon when an upstream image fails.
 */
export function SafeImage({ alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span aria-hidden className="absolute inset-0 grid place-items-center font-[family-name:var(--font-display)] text-2xl text-border-dark">
        TOJ
      </span>
    );
  }
  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
