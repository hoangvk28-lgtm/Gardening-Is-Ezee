import { AMAZON_TAG as TAG } from "@/lib/affiliate";

export const amazonSearchLinks: Record<string, string> = {
  "desk-setup":         `https://www.amazon.com/s?k=desk+setup+essentials&tag=${TAG}`,
  "dorm-essentials":    `https://www.amazon.com/s?k=dorm+room+essentials&tag=${TAG}`,
  "small-room-storage": `https://www.amazon.com/s?k=small+room+storage&tag=${TAG}`,
  "compact-home-office":`https://www.amazon.com/s?k=compact+home+office+setup&tag=${TAG}`,
  "budget-finds":       `https://www.amazon.com/s?k=budget+desk+accessories&tag=${TAG}`,
  "desk-lamps":         `https://www.amazon.com/s?k=desk+lamp+for+small+desk&tag=${TAG}`,
  "monitor-stands":     `https://www.amazon.com/s?k=monitor+stand+for+desk&tag=${TAG}`,
  "laptop-stands":      `https://www.amazon.com/s?k=foldable+laptop+stand&tag=${TAG}`,
  "cable-management":   `https://www.amazon.com/s?k=cable+management+for+desk&tag=${TAG}`,
  "under-bed-storage":  `https://www.amazon.com/s?k=under+bed+storage+bins&tag=${TAG}`,
  "bedside-caddies":    `https://www.amazon.com/s?k=bedside+caddy&tag=${TAG}`,
  "monitor-stands-small-desks": `https://www.amazon.com/s?k=monitor+stand+for+desk&tag=${TAG}`,
  "laptop-stands-small-desks":  `https://www.amazon.com/s?k=foldable+laptop+stand&tag=${TAG}`,
  "desk-lamps-small-desks":     `https://www.amazon.com/s?k=desk+lamp+for+small+desk&tag=${TAG}`,
  "cable-management-dorm":      `https://www.amazon.com/s?k=cable+management+for+desk&tag=${TAG}`,
  "under-bed-storage-small-rooms": `https://www.amazon.com/s?k=under+bed+storage+bins&tag=${TAG}`,
  "bedside-caddies-students":   `https://www.amazon.com/s?k=bedside+caddy&tag=${TAG}`,
};

export const heroChipLinks = [
  { label: "Desk Lamps",       href: `https://www.amazon.com/s?k=desk+lamps&tag=${TAG}` },
  { label: "Monitor Stands",   href: `https://www.amazon.com/s?k=monitor+stand&tag=${TAG}` },
  { label: "Laptop Stands",    href: `https://www.amazon.com/s?k=laptop+stand&tag=${TAG}` },
  { label: "Under-Bed Storage",href: `https://www.amazon.com/s?k=under+bed+storage&tag=${TAG}` },
  { label: "Cable Management", href: `https://www.amazon.com/s?k=cable+management&tag=${TAG}` },
  { label: "Bedside Caddies",  href: `https://www.amazon.com/s?k=bedside+caddy&tag=${TAG}` },
];
