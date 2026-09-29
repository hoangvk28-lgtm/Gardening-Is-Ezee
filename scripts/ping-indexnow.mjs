/**
 * Ping IndexNow after deploying new or updated pages.
 * Run: node scripts/ping-indexnow.mjs
 *
 * IndexNow notifies Bing + Yandex simultaneously.
 * Rate limit: 10,000 URLs/day (we have ~100 pages -- no issue).
 */

const HOST = "www.deskfinds.com";
const KEY = "c98c7bf07f814a3b85155692e78cbbfc";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const guideSlugs = [
  // Tablet stands
  "best-tablet-stands",
  "best-tablet-stands-for-bed",
  "best-tablet-stands-for-desk",
  // Desk setup
  "desk-lamps-small-desks",
  "monitor-stands-small-desks",
  "laptop-stands-small-desks",
  "cable-management-dorm",
  "bedside-caddies-students",
  "under-bed-storage-small-rooms",
  "desk-organizers-small-desks",
  "dorm-room-shower-essentials",
  "small-room-closet-storage",
  "dorm-room-power-essentials",
  "best-small-keyboards",
  "best-small-desk-accessories",
  "desk-setup-essentials",
  "best-desk-setup-accessories",
  "small-desk-setup",
  "ergonomic-desk-setup",
  "minimalist-desk-setup",
  "best-dorm-items-under-25",
  "best-desk-mat-for-small-desk",
  "20-genius-small-space-hacks",
  "best-usb-hub-for-desk",
  "desk-upgrades-under-100",
  "best-clip-on-desk-lamp",
  "best-headphone-stand-desk",
  "best-under-desk-cable-trays",
  "small-desk-organization-ideas",
  // Charging stations
  "best-charging-stations-for-desk",
  "best-small-desk-charging-stations",
  "best-wireless-charging-stations-for-desk",
  "best-charging-stations-for-multiple-devices-desk",
  "best-charging-station-desk-organizers",
  "best-docking-stations-for-desk-setup",
  "best-docking-stations-for-laptop-and-desktop",
  "under-desk-charging-station",
  "best-charging-stations-for-bedside-table",
  "best-charging-stations-for-home-office",
  "best-budget-usb-charging-station-under-30",
  "best-budget-multi-device-charging-station-under-50",
  "best-budget-apple-3-in-1-charging-station-under-40",
  // Audio / accessories
  "best-headset-for-work",
  "best-headphones-for-gaming",
  "best-headphones-for-working-out",
  "best-headphones-for-online-classes",
  "best-headphones-under-30",
  "best-headphones-under-50",
  "best-headphones-under-70",
  "best-headphones-under-100",
  "best-seat-cushions-for-office-chair",
  "best-phone-gimbals-for-content-creators",
  "best-document-cameras-home-office",
  // Webcams
  "best-webcam-under-50",
  "best-webcams-for-home-office",
  "best-budget-1080p-webcam",
  "best-webcam-for-video-calls",
  // Keyboards
  "best-compact-keyboard-under-50",
  "best-small-keyboard-with-numpad",
  "best-mechanical-keyboard-under-100",
  "60-vs-65-vs-75-keyboard",
  "tkl-vs-full-size-keyboard",
  "keyboard-size-chart",
  // Monitors / arms
  "best-monitor-under-100",
  "best-27-inch-monitor-under-200",
  "best-monitor-arm-under-100",
  // Chairs
  "best-office-chair-under-100",
  "best-ergonomic-chair-under-300",
  "best-ergonomic-chair-under-500",
  // Standing desks
  "best-standing-desk-under-200",
  "best-standing-desk-under-300",
  "best-standing-desk-under-500",
  "best-standing-desk-with-drawers",
  "best-electric-standing-desk",
  "best-flexispot-standing-desk",
  "best-l-shaped-standing-desk",
  "best-small-standing-desk",
  "best-solid-wood-standing-desk",
  // Desks
  "best-solid-wood-desk",
  "best-computer-desk-with-hutch",
  "best-l-shaped-wood-desk",
  "best-small-solid-wood-desk",
  "best-vintage-wooden-desk",
  "best-wooden-desk-with-drawers",
  "best-wooden-gaming-desk",
  "best-wood-executive-desk",
  // File cabinets (added 2026-07-02)
  "best-wood-file-cabinets",
  "best-wood-file-cabinets-under-200",
  "best-2-drawer-wood-file-cabinets",
  "best-2-drawer-wood-file-cabinets-under-150",
  "best-wood-file-cabinets-under-500",
  "best-lateral-wood-file-cabinets",
  "best-solid-wood-file-cabinets",
  "best-vintage-wood-file-cabinets",
  "best-3-and-4-drawer-wood-file-cabinets",
  // Printer stands and storage (added 2026-07-03)
  "best-printer-stands-with-storage",
  "best-printer-stands-with-file-drawers",
  "best-small-printer-stands",
  "best-under-desk-storage-drawers",
  "best-clamp-on-desk-drawers",
  "best-rolling-carts-home-office",
  "best-rolling-carts-with-drawers",
  "best-desk-shelves-small-desks",
  "best-over-desk-shelves",
  "best-wall-mounted-desks-small-spaces",
  // Info guides
  "standard-desk-height",
  "ergonomic-chair-vs-gaming-chair",
  "ultrawide-vs-dual-monitor",
  "desk-lamp-under-30",
  // Desk hutch guides
  "best-desk-hutches-for-small-desks",
  "best-desk-hutches-for-dorm-rooms",
  "best-desk-hutches",
  "best-desk-hutches-with-storage",
  "best-white-desk-hutches",
  // Monitor light bar guides
  "best-monitor-light-bars-for-curved-monitors",
  "best-monitor-light-bars-for-gaming",
  "best-monitor-light-bars-under-50",
  "best-monitor-light-bars",
  "best-under-desk-footrests-for-short-people",
  "best-adjustable-under-desk-footrests",
  "best-rocking-footrests-under-desk",
  "best-wooden-footrests-for-desk",
  "best-under-desk-footrests",
  "best-vertical-macbook-stands",
  "best-dual-vertical-laptop-stands",
  "best-adjustable-vertical-laptop-stands",
  "best-vertical-laptop-stands-for-desk-setup",
  "best-vertical-laptop-stands",
  "best-lap-desks-for-bed",
  "best-lap-desks-with-cushion",
  "best-lap-desks-for-laptops",
];

const compareSlug = ["monitor-stand-vs-monitor-arm"];

const staticPaths = [
  "/",
  "/guide",
  "/compare",
  "/categories",
  "/deals",
  "/about-deskfinds",
  "/affiliate-disclosure",
  "/how-we-review",
];

const urlList = [
  ...staticPaths.map((p) => `https://${HOST}${p}`),
  ...guideSlugs.map((s) => `https://${HOST}/guide/${s}`),
  ...compareSlug.map((s) => `https://${HOST}/compare/${s}`),
];

console.log(`Pinging IndexNow with ${urlList.length} URLs...`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

if (res.ok) {
  console.log(`OK IndexNow accepted -- HTTP ${res.status}`);
  console.log(`  ${urlList.length} URLs submitted to Bing + Yandex`);
} else {
  const body = await res.text();
  console.error(`FAILED IndexNow rejected -- HTTP ${res.status}: ${body}`);
  process.exit(1);
}
