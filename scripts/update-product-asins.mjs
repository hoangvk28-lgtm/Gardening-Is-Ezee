const SUPABASE_URL = "https://xlipolezpdkfmneqkncd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TAG = "theofficejournal-20";
const BASE = `https://www.amazon.com/dp`;

const h = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=minimal",
};

// id → new ASIN (verified valid products on Amazon)
const updates = {
  "compact-led-lamp-usb":             "B08WQCZGPK",
  "wide-angle-study-lamp":            "B09XK8H2FQ",
  "adjustable-monitor-riser":         "B073VKC134",
  "dual-monitor-arm-mount":           "B01N2YFO5Z",
  "foldable-aluminum-laptop-riser":   "B08M94BTYC",
  "adjustable-portable-laptop-stand": "B089JY2QNM",
  "desk-cable-organizer-kit":         "B08P5VH157",
  "under-desk-cable-tray":            "B0CN6YDG6V",
  "hanging-bedside-caddy":            "B07M6BQGXF",
  "over-mattress-pocket-organizer":   "B018WLP4EK",
  "zippered-underbed-bags":           "B07JJFF9Z9",
  "rolling-underbed-container":       "B07MTLKFXN",
  "desktop-organizer-with-drawers":   "B0BYDGF8DT",
  "desk-drawer-organizer-tray-set":   "B002RL9CYK",
  "stackable-acrylic-desk-organizer": "B09V1D2B36",
  "personal-foldable-whiteboard":     "B083QW26LW",
  "slim-wireless-charging-pad":       "B07Q1DJDGK",
  "compact-bluetooth-keyboard":       "B00MUTWLW4",
  "over-door-pocket-organizer":       "B01D58DRVC",
  "collapsible-storage-cubes":        "B071225BBS",
  "dorm-shower-caddy":                "B0BQPSRLH5",
  "bed-risers-with-outlets-usb":      "B08KZNFSTY",
  "vacuum-storage-bags":              "B07RMV89JD",
  "compact-power-strip-usb":          "B0B1DKN9HG",
  "narrow-rolling-storage-cart":      "B07D1M5DQD",
  "compact-3tier-storage-tower":      "B08ML2RSTS",
};

let ok = 0, fail = 0;
for (const [id, asin] of Object.entries(updates)) {
  const newUrl = `${BASE}/${asin}?tag=${TAG}`;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
    { method: "PATCH", headers: h, body: JSON.stringify({ amazon_url: newUrl }) }
  );
  if (res.ok) {
    console.log(`OK  [${id}] → ${newUrl}`);
    ok++;
  } else {
    const err = await res.text();
    console.error(`FAIL [${id}]: ${res.status} ${err}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} updated, ${fail} failed.`);
