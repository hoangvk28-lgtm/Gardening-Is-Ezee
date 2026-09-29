import { clsx } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-border text-ink-secondary",
  primary:  "bg-brand-light text-brand",
  success:  "bg-cta-light text-cta-dark",
  warning:  "bg-accent-light text-accent-dark",
  info:     "bg-blue-50 text-blue-700",
  muted:    "bg-bg text-ink-muted border border-border",
};

const autoVariantMap: Record<string, BadgeVariant> = {
  "Best Overall":             "success",
  "Editor's Choice":          "primary",
  "Best Budget":              "warning",
  "Best Value":               "warning",
  "Best for Students":        "info",
  "Best for Dorm Rooms":      "info",
  "Best for Study":           "info",
  "Best for Dual Monitors":   "primary",
  "Best for Compact Home Office": "primary",
};

export function Badge({ children, variant, className }: BadgeProps) {
  const resolved = variant ?? autoVariantMap[String(children)] ?? "default";

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-badge text-xs font-semibold tracking-wide",
        variantStyles[resolved],
        className
      )}
    >
      {children}
    </span>
  );
}
