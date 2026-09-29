import fs from "fs";
let c = fs.readFileSync("scripts/gen-mini-ups-data.mjs", "utf8");

const prosCons = {
  B0C1YRSBMN: {
    pros: ["Four output rails (5V USB, 5V DC, 9V DC, 12V DC) on one compact unit", "Five-layer protection circuitry is standard across the line", "Built-in 10,000mAh cell also works as a standalone power bank via USB", "Aluminum-alloy housing is more durable than plastic competitors"],
    cons: ["No published Wh figure, only 10,000mAh and an implied 37Wh", "60W ceiling is shared across all rails combined", "No PoE output for camera-only setups"],
  },
  B07WLD32RP: {
    pros: ["Highest capacity in this cluster at 97.2Wh", "Four separate 12V ports for multi-device setups", "18W USB-C PD port charges phones and small electronics too", "Ships with two DC cables and a charger in the box"],
    cons: ["37W continuous limit is lower than its capacity might suggest", "5.5x2.1mm barrel only, other connector sizes need a separate cable", "No PoE output"],
  },
  B0CQR5GMN4: {
    pros: ["Built-in AVR for stable output voltage", "5V/9V/12V plus USB and Type-C charging in one unit", "LED indicator makes remaining charge easy to check at a glance", "Slim form factor fits tight spaces"],
    cons: ["No published maximum wattage ceiling", "LED indicator only, no detailed status display", "No PoE output for camera setups"],
  },
  B0GWC8GVGZ: {
    pros: ["LiFePO4 chemistry rated for longer cycle life than lithium-ion", "Passive PoE (15V/24V) plus full DC rail lineup", "12-month warranty with lifetime technical support", "Compact 6.22 x 3.2 x 2.7in footprint"],
    cons: ["36W ceiling is tighter than the TalentCell or 74Wh sibling", "Passive PoE only, incompatible with active 802.3af/at gear"],
  },
  B0FF9QS7LK: {
    pros: ["Two independent 12V DC rails for router + modem", "74Wh is a genuine step up from the 37Wh entry model", "Same aluminum-alloy build quality as the smaller sibling", "Five-layer protection circuitry included"],
    cons: ["Same 60W combined ceiling as the smaller sibling despite more capacity", "Battery isn't sold as a standalone replacement part", "No PoE output"],
  },
  B0GJBWXM66: {
    pros: ["Only unit here with both 24V and 48V passive PoE output", "Ships with 8 DC connector tips covering most router/ONU barrels", "Compact 6.1 x 4.3 x 1.4in and just 1.01lb", "Overcharge, over-discharge, and short-circuit protection built in"],
    cons: ["30W ceiling is the lowest among the PoE-capable units", "Passive PoE only, not compatible with active PoE cameras/switches"],
  },
  B0CP693BWD: {
    pros: ["Claimed 0-second switchover avoids device reboots", "Smallest, lightest footprint in this cluster", "PoE 24V output alongside standard DC rails", "Four built-in protection functions"],
    cons: ["29.6Wh capacity is on the low end for the price", "Switchover claim is manufacturer-stated, not independently verified", "No USB-C charging port"],
  },
  B0G2QWNVCK: {
    pros: ["Simple 12V/9V/5V layout covers most routers without extra research", "Compact and portable enough for travel use", "Power indicator LED shows remaining charge at a glance", "13,500mAh is a solid mid-tier capacity"],
    cons: ["No stated wattage ceiling for load planning", "LED indicator only, no detailed charge percentage", "No PoE output"],
  },
  B0FCV2Q8TB: {
    pros: ["Only unit in this price range with an LCD status screen", "Passive PoE output alongside full DC rail lineup", "User-replaceable battery extends the unit's useful life", "Ships with an assortment of DC barrel adapters"],
    cons: ["24W ceiling is among the lowest here", "PoE voltage (15V/24V) may not match every camera's requirement"],
  },
  B0FXFTFBBF: {
    pros: ["Thin, compact profile fits tight desk space", "Lowest price in this cluster", "Same five-rail layout as larger, pricier units", "Built-in short-circuit and temperature protection"],
    cons: ["6,000mAh is the smallest capacity here, roughly 5 hours claimed runtime", "No PoE or AVR features", "Not built for multi-device backup"],
  },
  B0F2K1PL64: {
    pros: ["Six separate protection circuits", "Claimed 95%+ compatibility with mainstream routers/modems", "Dual-purpose design works as a travel charger too", "20,000mAh capacity is competitive for the price"],
    cons: ["No published per-rail current specs", "Marketed as dual-purpose travel charger, less optimized for fixed installs", "No PoE output"],
  },
  B0CGHGVG3L: {
    pros: ["Dual charging input (9V/12V DC or 5V USB)", "Clear per-port 2A current rating", "Doubles as a standard charging power bank", "Compact, simple design"],
    cons: ["No stated combined output ceiling", "10,400mAh label without a disclosed Wh figure", "No PoE output"],
  },
  B0CGVZBCKH: {
    pros: ["Dual charging input flexibility", "Compact design for shelf or cabinet placement", "Multiple intelligent protection circuits", "Can double as a standard USB charging bank"],
    cons: ["18Wh actual energy is lower than some same-mAh competitors", "No PoE or AVR features", "No USB-C charging"],
  },
  B0CLVSQY5S: {
    pros: ["Automatic switchover keeps network devices live during outages", "Compact housing for discreet desk or cabinet placement", "Dual DC input (9V and 12V) adds charging flexibility", "Multiple protection circuits guard against voltage irregularities"],
    cons: ["18Wh capacity limits runtime to short-to-moderate outages", "Dual DC input only, no USB-C charging"],
  },
};

for (const [asin, pc] of Object.entries(prosCons)) {
  const marker = `  ${asin}: {`;
  const startIdx = c.indexOf(marker);
  if (startIdx === -1) { console.log("MISSING", asin); continue; }
  const prosStart = c.indexOf("pros: [", startIdx);
  const prosLineEnd = c.indexOf("],", prosStart) + 2;
  const consStart = c.indexOf("cons: [", prosLineEnd);
  const consLineEnd = c.indexOf("]", consStart) + 1;
  const newBlock = `pros: ${JSON.stringify(pc.pros)},\n    cons: ${JSON.stringify(pc.cons)}`;
  c = c.slice(0, prosStart) + newBlock + c.slice(consLineEnd);
}
fs.writeFileSync("scripts/gen-mini-ups-data.mjs", c);
console.log("done");
