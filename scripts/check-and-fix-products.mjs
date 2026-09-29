const SB = "https://xlipolezpdkfmneqkncd.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TAG = "theofficejournal-20";
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" };

// Fetch all with status
const res = await fetch(`${SB}/rest/v1/products?select=id,slug,status,archived,amazon_url`, { headers: h });
const rows = await res.json();

const notPublished = rows.filter(r => r.status !== "published" || r.archived === true);
const wrongTag = rows.filter(r => r.amazon_url && !r.amazon_url.includes(TAG));

console.log(`Total: ${rows.length} | Not published/archived: ${notPublished.length} | Wrong tag: ${wrongTag.length}\n`);

if (notPublished.length) {
  console.log("=== NOT PUBLISHED or ARCHIVED ===");
  for (const r of notPublished) console.log(`  [${r.status}${r.archived?" archived":""}] ${r.id} | ${r.slug}`);
}

if (wrongTag.length) {
  console.log("\n=== WRONG TAG ===");
  for (const r of wrongTag) console.log(`  ${r.id} | ${r.amazon_url?.slice(0,70)}`);
}

// Fix: publish all non-published products that aren't archived
const toPublish = rows.filter(r => r.status !== "published" && r.archived !== true);
if (toPublish.length) {
  console.log(`\nPublishing ${toPublish.length} products...`);
  for (const r of toPublish) {
    const patch = await fetch(`${SB}/rest/v1/products?id=eq.${r.id}`,
      { method: "PATCH", headers: { ...h, "Prefer": "return=minimal" }, body: JSON.stringify({ status: "published" }) });
    console.log(`  ${patch.ok ? "OK" : "FAIL"} [${r.id}]`);
  }
}

console.log("\nDone.");
