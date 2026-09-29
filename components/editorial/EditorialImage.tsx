import { SafeImage } from "./SafeImage";

interface EditorialImageProps {
  src?: string;
  alt: string;
  sizes: string;
  aspect?: string;
  priority?: boolean;
  /** Load immediately (above-the-fold) without the preload hint `priority` adds. */
  eager?: boolean;
  className?: string;
  fit?: "cover" | "contain";
}

/**
 * Cropped, square-cornered image frame with a restrained hover scale (≤1.02).
 * The frame reserves its aspect ratio, so nothing shifts while images load.
 * Parent needs the `group` class for the hover effect.
 */
export function EditorialImage({ src, alt, sizes, aspect = "aspect-[3/2]", priority, eager, className = "", fit = "cover" }: EditorialImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2px] bg-[#ebe7df] ${aspect} ${className}`}>
      {src ? (
        <SafeImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : eager ? "eager" : "lazy"}
          className={`${fit === "contain" ? "object-contain p-6" : "object-cover"} transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 grid place-items-center font-[family-name:var(--font-display)] text-3xl text-border-dark">
          TOJ
        </div>
      )}
    </div>
  );
}
