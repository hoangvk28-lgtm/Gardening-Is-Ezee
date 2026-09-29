import { clsx } from "@/lib/utils";
import { withAmazonTag } from "@/lib/affiliate";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "amazon" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
  target?: string;
  rel?: string;
}

export function CTAButton({
  href,
  children,
  variant = "amazon",
  size = "md",
  className,
  fullWidth = false,
  target = "_blank",
  rel = "nofollow sponsored noopener noreferrer",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all focus-ring";

  const variants = {
    amazon:
      "bg-cta text-white hover:bg-cta-dark active:scale-[0.98] shadow-sm hover:shadow",
    primary:
      "bg-brand text-white hover:bg-brand-dark active:scale-[0.98] shadow-sm hover:shadow",
    secondary:
      "bg-brand-light text-brand hover:bg-brand-muted border border-brand/20",
    outline:
      "bg-white text-ink border-2 border-border hover:border-brand hover:text-brand",
  };

  const sizes = {
    sm: "px-4 py-2.5 text-sm min-h-[44px]",
    md: "px-5 py-3 text-sm min-h-[44px]",
    lg: "px-7 py-3.5 text-base min-h-[44px]",
  };

  return (
    <a
      href={withAmazonTag(href)}
      target={target}
      rel={rel}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
    >
      {variant === "amazon" && (
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      )}
      {children}
    </a>
  );
}
