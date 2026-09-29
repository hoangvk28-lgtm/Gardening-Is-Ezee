const SUPABASE_URL = "https://xlipolezpdkfmneqkncd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// ── Step 1: Revert hero_image URLs that got &tag= appended incorrectly ────────
console.log("── Reverting guides.hero_image (remove incorrectly appended &tag=) ──");

const res = await fetch(
  `${SUPABASE_URL}/rest/v1/guides?select=id,hero_image`,
  { headers: { ...headers, "Prefer": "return=representation" } }
);
const guides = await res.json();
console.log(`  ${guides.length} guides`);

let reverted = 0;
for (const g of guides) {
  const img = g.hero_image;
  if (!img || !img.includes("&tag=theofficejournal-20")) continue;
  const fixed = img.replace(/&tag=theofficejournal-20/g, "");
  const patch = await fetch(
    `${SUPABASE_URL}/rest/v1/guides?id=eq.${g.id}`,
    { method: "PATCH", headers: { ...headers, "Prefer": "return=minimal" }, body: JSON.stringify({ hero_image: fixed }) }
  );
  if (patch.ok) { console.log(`  REVERTED [${g.id}]: ...${img.slice(-40)}`); reverted++; }
  else console.error(`  FAIL [${g.id}]: ${patch.status}`);
}
console.log(`  ${reverted} hero_image URLs reverted.`);

// ── Step 2: Fix products.amazon_url (already done, verify) ────────────────────
console.log("\n── Verifying products.amazon_url ──");
const pr = await fetch(
  `${SUPABASE_URL}/rest/v1/products?select=id,amazon_url`,
  { headers: { ...headers, "Prefer": "return=representation" } }
);
const prods = await pr.json();
const badProds = prods.filter(p => p.amazon_url && !p.amazon_url.includes("theofficejournal-20"));
console.log(`  ${prods.length} products total, ${badProds.length} still need fixing.`);
for (const p of badProds) {
  const newUrl = p.amazon_url.includes("tag=")
    ? p.amazon_url.replace(/tag=[^&\s]+/g, "tag=theofficejournal-20")
    : p.amazon_url + (p.amazon_url.includes("?") ? "&" : "?") + "tag=theofficejournal-20";
  const patch = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`,
    { method: "PATCH", headers: { ...headers, "Prefer": "return=minimal" }, body: JSON.stringify({ amazon_url: newUrl }) }
  );
  if (patch.ok) console.log(`  FIXED [${p.id}]`);
}

console.log("\nDone.");
