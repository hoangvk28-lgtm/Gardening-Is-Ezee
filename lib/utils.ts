export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function scoreToLabel(score: number): string {
  if (score >= 9.0) return "Excellent";
  if (score >= 8.0) return "Very Good";
  if (score >= 7.0) return "Good";
  if (score >= 6.0) return "Fair";
  return "Below Average";
}

export function scoreToColor(score: number): string {
  if (score >= 8.5) return "text-score-high";
  if (score >= 7.0) return "text-score-mid";
  return "text-score-low";
}

export function scoreToBarColor(score: number): string {
  if (score >= 8.5) return "bg-score-high";
  if (score >= 7.0) return "bg-score-mid";
  return "bg-score-low";
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function starRatingToPercent(rating: number): number {
  return (rating / 5) * 100;
}
