import { additionalInformationalGuides } from "./additional-informational-guides";

export type InformationalSilo = "growing" | "garden-tools" | "lawn-care" | "watering" | "yard-cleanup";

export interface InformationalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface InformationalGuide {
  slug: string;
  silo: InformationalSilo;
  title: string;
  metaTitle: string;
  description: string;
  dek: string;
  directAnswer: string;
  readTime: string;
  lastUpdated: string;
  keyTakeaways: string[];
  sections: InformationalSection[];
  faq: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
  related: { title: string; href: string }[];
  /** Full long-form Markdown stored under public/content/informational. */
  contentFile?: string;
  /** Original editorial diagram used for social sharing and in-article context. */
  heroImage?: string;
}

const updated = "2026-09-29";

export const informationalGuides: InformationalGuide[] = [
  ...additionalInformationalGuides,
  {
    slug: "how-deep-should-a-raised-garden-bed-be",
    silo: "growing",
    title: "How Deep Should a Raised Garden Bed Be?",
    metaTitle: "How Deep Should a Raised Garden Bed Be?",
    description: "Choose raised-bed depth by crops, usable rooting space, drainage, and access. Understand the difference between open-bottom beds and planters.",
    dek: "Choose raised-bed depth by the crops, usable rooting space, drainage and access—not by frame height alone.",
    directAnswer: "For many annual vegetables, 8 to 12 inches of loose growing medium over workable native soil is a practical starting point. Use 12 to 18 inches when the ground below is compacted, contaminated or paved, and consider 24 inches or more when the bed also needs to reduce bending or accommodate seated access.",
    readTime: "16 min",
    lastUpdated: "2026-09-30",
    contentFile: "05-how-deep-should-a-raised-bed-be.md",
    heroImage: "/images/informational/05-raised-bed-depth.png",
    keyTakeaways: [
      "Count usable root depth, including loosened soil below an open-bottom bed.",
      "Deep-rooted crops benefit from 10 to 12 inches or more of improved soil.",
      "Beds taller than about 18 inches need stronger walls and substantially more fill.",
    ],
    sections: [
      {
        heading: "Start with what is under the bed",
        paragraphs: [
          "An open-bottom frame on healthy, drainable ground does not need to contain the crop's entire root zone. Loosening the native soil before filling lets roots continue below the frame and makes an 8- to 12-inch bed more useful than the frame height alone suggests.",
          "If the bed sits on concrete, heavily compacted subsoil or ground you do not want roots entering, the frame must provide the full growing depth. In that situation, treat it more like a large container and pay closer attention to drainage holes and the weight of wet soil.",
        ],
      },
      {
        heading: "Match depth to the crop",
        paragraphs: [
          "Leaf lettuce, radishes and many herbs can grow in a relatively shallow profile, while tomatoes, peppers, carrots and long-lived herbs benefit from more room. Oregon State Extension notes that most vegetables can use an improved layer around 8 inches deep, while deeper-rooted vegetables and perennial crops benefit from soil improved to 10 to 12 inches.",
        ],
        bullets: [
          "6–8 inches: shallow greens, radishes and short-season herbs where the soil below is usable.",
          "10–12 inches: a flexible target for mixed vegetables and many root crops.",
          "12–18 inches: useful over poor ground or for crops needing a larger moisture reserve.",
          "24–34 inches: primarily an accessibility choice; reinforce the structure and plan the fill volume first.",
        ],
      },
      {
        heading: "Do not make a tall bed deeper by accident",
        paragraphs: [
          "A tall frame does not have to be filled entirely with premium mix, but the active root zone should be consistent and free of large voids. Avoid a thick layer of fresh wood directly beneath a shallow growing layer; decomposition and settling can lower the surface and temporarily tie up nitrogen near roots.",
          "Before building, calculate length × width × fill depth. A small increase in depth can add many cubic feet of soil, extra wall pressure and more water-holding mass, so choose the height for plant needs and accessibility rather than appearance alone.",
        ],
      },
      {
        heading: "A simple decision rule",
        paragraphs: [
          "Use 10 to 12 inches for a first general-purpose vegetable bed on open soil. Go deeper when the base is sealed or unsuitable, when you want long root crops, or when the bed must be comfortable to reach from a chair. If drainage is slow, fix the drainage path before adding depth; a taller box cannot correct trapped water beneath it.",
        ],
      },
    ],
    faq: [
      { question: "Is 6 inches deep enough for a raised bed?", answer: "It can work for shallow crops when roots can enter loosened soil below, but it leaves less margin for drying and is restrictive over a hard surface." },
      { question: "Is 12 inches deep enough for tomatoes?", answer: "Twelve inches of good mix over open, loosened soil is workable for many tomatoes. Over concrete or badly compacted ground, a deeper soil profile gives roots and moisture more room." },
      { question: "Does a deeper raised bed need more drainage?", answer: "Yes. Deep beds hold more wet soil, and water still needs a route out through the base. Never assume extra height will solve a blocked or sealed bottom." },
    ],
    sources: [
      { label: "Oregon State University Extension — Raised bed gardening", href: "https://extension.oregonstate.edu/catalog/fs-270-raised-bed-gardening" },
      { label: "Oregon State University Extension — Improving garden soils with organic matter", href: "https://extension.oregonstate.edu/catalog/ec-1561-improving-garden-soils-organic-matter" },
    ],
    related: [
      { title: "Best Tall Raised Garden Beds", href: "/growing/best-tall-raised-garden-beds" },
      { title: "Raised Garden Bed vs. In-Ground Garden", href: "/growing/raised-garden-bed-vs-in-ground-garden" },
    ],
  },
  {
    slug: "how-to-fill-a-raised-garden-bed",
    silo: "growing",
    title: "How to Fill a Raised Garden Bed Without Wasting Soil",
    metaTitle: "How to Fill a Raised Garden Bed: Soil Mix, Volume and Setup",
    description: "Calculate raised-bed soil volume, prepare the base and build a balanced growing mix without relying on an overly rich layer of compost.",
    dek: "A productive bed needs a stable, drainable soil profile—not a stack of random filler capped with a few inches of mix.",
    directAnswer: "Prepare and loosen the ground, calculate the bed's cubic volume, then fill with a mineral-soil-based mix that contains a moderate amount of finished plant compost. For a general vegetable bed, extension guidance supports roughly one-half to two-thirds topsoil with one-third to one-half plant-based compost, adjusted for the texture of the topsoil and confirmed with a soil test.",
    readTime: "8 min",
    lastUpdated: updated,
    keyTakeaways: [
      "Volume in cubic feet equals length × width × soil depth, all measured in feet.",
      "Do not fill the bed with compost alone; excessive compost can create nutrient and moisture problems.",
      "Expect a newly filled bed to settle and plan a modest top-up after the first season.",
    ],
    sections: [
      { heading: "Prepare the base before the soil arrives", paragraphs: ["Remove persistent weeds and large root masses, then loosen the native surface with a fork. On an open-bottom bed, blending the first few inches of fill into the soil below avoids an abrupt boundary and gives roots a path downward.", "Use quarter-inch hardware cloth only where burrowing rodents are a known problem. Landscape fabric can obstruct the soil connection and is unnecessary for ordinary weed control once the bed is properly filled and mulched."] },
      { heading: "Calculate how much mix you need", paragraphs: ["Multiply internal length by internal width by the intended fill depth in feet. A 4 × 8-foot bed filled 12 inches deep needs about 32 cubic feet, or roughly 1.2 cubic yards, before allowing for settling.", "Measure the inside of the frame rather than using the advertised outside dimensions. For tall beds that do not need a full-depth root zone, design a stable lower layer deliberately and preserve at least 10 to 12 inches of consistent growing medium on top."], bullets: ["Cubic feet: length (ft) × width (ft) × depth (ft).", "Cubic yards: cubic feet ÷ 27.", "Bag count: cubic feet needed ÷ volume printed on each bag."] },
      { heading: "Build a balanced soil mix", paragraphs: ["Start with loam or sandy-loam topsoil for structure and mineral content, then add finished plant-based compost for organic matter. University of Minnesota Extension recommends around one-half to two-thirds topsoil and one-third to one-half plant-based compost, while Oregon State advises keeping compost to no more than about one-quarter by volume in some fill situations.", "Those ranges are starting points, not recipes that override the materials in front of you. Clay-heavy topsoil needs improved structure; very sandy soil needs more water-holding capacity. A local soil test is the best basis for lime and fertilizer decisions."], bullets: ["Avoid pure compost, which can dry unpredictably and accumulate excessive phosphorus or salts.", "Avoid potting mix as the main bulk ingredient in a large outdoor bed.", "Do not bury meat, dairy, pet waste or diseased plant material as filler."] },
      { heading: "Fill, water and recheck", paragraphs: ["Add mix in lifts, break up clods and blend rather than creating sharply separated layers. Water enough to settle air pockets, let the bed drain, then bring the surface back to the intended level without compacting it by walking inside.", "Finish below the rim so mulch and irrigation water stay in the bed. Recheck the level after several weeks and again before the next season, because organic matter continues to decompose and the mix will settle."], },
    ],
    faq: [
      { question: "Can I fill a raised bed with compost only?", answer: "No. Compost is an amendment, not a complete long-term soil structure. Blend a moderate amount with suitable topsoil or a tested raised-bed mix." },
      { question: "Should I put rocks in the bottom?", answer: "Usually not. Rocks take up root space and do not correct a blocked drainage outlet. Provide a permeable base and suitable soil texture instead." },
      { question: "Why did my raised-bed soil sink?", answer: "Freshly filled soil settles as air pockets collapse and organic matter decomposes. A modest seasonal top-up is normal." },
    ],
    sources: [
      { label: "University of Minnesota Extension — Raised bed gardens", href: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/raised-bed-gardens" },
      { label: "Oregon State University Extension — How to use compost", href: "https://extension.oregonstate.edu/catalog/em-9308-how-use-compost-gardens-landscapes" },
    ],
    related: [
      { title: "Best Cedar Raised Garden Beds", href: "/growing/best-cedar-raised-garden-beds" },
      { title: "Best Galvanized Raised Garden Beds", href: "/growing/best-galvanized-raised-garden-beds" },
    ],
  },
  {
    slug: "how-often-to-water-raised-garden-beds",
    silo: "growing",
    title: "How Often Should You Water a Raised Garden Bed?",
    metaTitle: "How Often to Water Raised Garden Beds Without Guessing",
    description: "Use soil moisture, weather, plant stage and bed depth to decide when to water a raised garden bed instead of following a rigid calendar.",
    dek: "Raised beds often dry faster than in-ground soil, but the correct schedule comes from the root zone, not the day of the week.",
    directAnswer: "Check moisture about 2 inches below the surface and water when that zone is becoming dry. A newly planted or shallow bed may need frequent attention in hot weather, while a deep, mulched bed may go several days between thorough waterings; rainfall, soil texture and crop stage should always override a fixed schedule.",
    readTime: "7 min",
    lastUpdated: updated,
    keyTakeaways: ["Test the soil below the dry surface before watering.", "Water the root zone deeply, then let air return to the soil.", "Morning watering and mulch reduce avoidable moisture loss."],
    sections: [
      { heading: "Use the two-inch check", paragraphs: ["Push a finger or small trowel about 2 inches into the soil near, but not against, a plant. If the soil is moist at that depth, wait; if it is dry and crumbly, water. Seedlings have shallower roots, so check their immediate zone more often.", "A moisture meter can help reveal trends, but it should not replace observation. Test more than one location because bed edges, corners and areas beside large plants can dry at different rates."] },
      { heading: "Why one schedule cannot fit every bed", paragraphs: ["Coarse or sandy mixes drain quickly, while mixes with more loam hold water longer. Tall beds have more exposed sidewall area, dark metal sides gain heat, and windy sites lose moisture faster. Mature tomatoes or squash also draw far more water than a new row of lettuce.", "After watering, note how long the bed stays moist under typical weather. That becomes a useful baseline, but shorten the interval during heat and wind and lengthen it after meaningful rain."], bullets: ["Check daily during establishment and heat waves; water only if the root zone needs it.", "Check containers and narrow elevated planters more often than ground-connected beds.", "Add 2 to 3 inches of organic mulch once seedlings are established."] },
      { heading: "Water deeply without waterlogging", paragraphs: ["Apply water slowly at soil level so it infiltrates instead of running down a path or splashing leaves. Drip line and soaker hose layouts are efficient when their spacing wets the full root area rather than narrow strips.", "Stop if water ponds for a long time or drains from one channel while the surrounding mix stays dry. Break up a water-repellent crust, use multiple short cycles on very dry soil and confirm moisture below the surface afterward."], },
      { heading: "Choose the right time of day", paragraphs: ["Early morning is the most forgiving window because evaporation is lower and any wet foliage can dry. Evening watering is sometimes necessary, but direct it at the soil and avoid leaving dense foliage wet overnight where disease pressure is high.", "The goal is not to hit an exact clock time. It is to deliver water when the plant can use it while minimizing evaporation, runoff and prolonged leaf wetness."], },
    ],
    faq: [
      { question: "Do raised beds need water every day?", answer: "Not automatically. Seedlings, shallow beds and hot weather may justify daily checks, but water only when the root zone is drying." },
      { question: "How do I know I watered deeply enough?", answer: "Check the soil several inches down after watering. The target root zone should be evenly moist rather than wet only at the surface." },
      { question: "Can mulch make a raised bed too wet?", answer: "It can slow drying, which is usually helpful. Keep mulch away from plant stems and reduce irrigation if the soil remains saturated." },
    ],
    sources: [
      { label: "Oregon State University Extension — Watering Basics", href: "https://extension.oregonstate.edu/imported-publication/watering-basics" },
      { label: "University of Minnesota Extension — Raised bed gardens", href: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/raised-bed-gardens" },
    ],
    related: [
      { title: "Best Garden Hoses", href: "/watering/best-garden-hoses" },
      { title: "Best Watering Timers", href: "/watering/best-watering-timers" },
    ],
  },
  {
    slug: "why-does-compost-smell-bad",
    silo: "growing",
    title: "Why Does Compost Smell Bad? Causes and Fast Fixes",
    metaTitle: "Why Does Compost Smell Bad? Diagnose and Fix the Odor",
    description: "Identify rotten-egg, ammonia and sour compost odors, then correct moisture, airflow and the brown-to-green balance.",
    dek: "Healthy compost should smell earthy. A strong odor is useful diagnostic information, not a reason to discard the entire pile.",
    directAnswer: "A bad-smelling compost pile is usually too wet, short of oxygen or overloaded with nitrogen-rich greens. Open the pile, mix in dry coarse browns, restore drainage and turn it; then bury future food scraps beneath 4 to 8 inches of brown material.",
    readTime: "6 min",
    lastUpdated: updated,
    keyTakeaways: ["Rotten-egg or sour odors usually point to low oxygen and excess moisture.", "An ammonia smell often means the pile contains too much nitrogen.", "Dry leaves, shredded cardboard and coarse woody browns correct both structure and balance."],
    sections: [
      { heading: "Match the odor to the likely cause", paragraphs: ["A rotten-egg or sewage-like smell suggests anaerobic pockets where air cannot circulate. An ammonia smell is more consistent with excess nitrogen from a heavy load of grass clippings or food scraps. A sour, stagnant smell often appears when fine wet material has matted together.", "Look at structure as well as smell. A glossy, compressed mass needs pore space; a dripping pile needs dry material and weather protection; visible food at the surface needs to be buried."], },
      { heading: "The fastest way to reset the pile", paragraphs: ["Pull apart compacted sections and mix in dry browns such as autumn leaves, torn uncoated cardboard or small dry wood chips. Coarse pieces create air channels while carbon-rich material absorbs moisture and balances nitrogen.", "Turn the pile so the wet center and dry outside exchange places. If water squeezes out by hand, leave the pile open briefly in dry weather or cover only the top while keeping the sides ventilated."], bullets: ["Add browns gradually until the texture resembles a wrung-out sponge.", "Do not add more food scraps or fresh grass until the odor subsides.", "Check that the bin base can drain and that vents are not blocked."] },
      { heading: "Prevent odors from returning", paragraphs: ["EPA guidance recommends roughly two to three parts browns for each part greens by volume and covering food scraps with 4 to 8 inches of dry leaves or other browns. Exact ratios vary with moisture, so watch the pile rather than measuring every handful.", "Avoid meat, dairy, grease and pet waste in a normal backyard pile. Chop large pieces, mix wet additions into the pile instead of leaving layers, and keep a covered container of dry browns beside the bin for quick balancing."], },
      { heading: "When the pile does not smell but will not heat", paragraphs: ["A cold pile is a different problem. It may be too small, too dry or short of nitrogen, or the weather may simply be cold. Finished compost also cools naturally, so check whether the original ingredients are dark, crumbly and no longer recognizable before trying to restart it."], },
    ],
    faq: [
      { question: "Should compost smell like manure?", answer: "A persistent manure or ammonia odor signals imbalance. Mix in dry carbon-rich material and improve airflow." },
      { question: "Will turning compost remove the smell?", answer: "Turning restores oxygen, but a very wet or nitrogen-heavy pile also needs dry browns and better drainage." },
      { question: "Can smelly compost still be used?", answer: "Let it finish and cure first. Mature compost should be dark, crumbly and earthy-smelling rather than sour or putrid." },
    ],
    sources: [
      { label: "US EPA — Composting at Home", href: "https://www.epa.gov/recycle/composting-home" },
      { label: "US EPA — Approaches to Composting", href: "https://www.epa.gov/sustainable-management-food/approaches-composting" },
    ],
    related: [
      { title: "Best Compost Tumblers", href: "/growing/best-compost-tumblers" },
      { title: "Best Compost Tumblers for Beginners", href: "/growing/best-compost-tumblers-for-beginners" },
    ],
  },
  {
    slug: "can-you-compost-in-winter",
    silo: "growing",
    title: "Can You Compost in Winter? What Actually Happens in the Pile",
    metaTitle: "Can You Compost in Winter? A Cold-Weather Composting Guide",
    description: "Keep adding to compost through winter, understand why small piles slow down and prepare the pile to restart cleanly in spring.",
    dek: "Cold weather slows decomposition, but it does not make a backyard compost pile useless or prevent you from managing organic material responsibly.",
    directAnswer: "Yes, you can keep composting in winter, although a home-scale pile may slow sharply or freeze. Build enough mass before hard freezes, balance wet food scraps with dry browns, protect the top from excess precipitation and accept that active decomposition may resume when daytime temperatures rise.",
    readTime: "7 min",
    lastUpdated: updated,
    keyTakeaways: ["A frozen pile is paused, not ruined.", "Pile size, moisture and insulation determine how much activity continues.", "Stockpile dry browns before winter so food scraps do not create a wet, compacted core."],
    sections: [
      { heading: "What cold weather changes", paragraphs: ["Microbial activity slows as the pile loses heat, and the outside can freeze while the center remains active. Small backyard piles lose heat faster than large ones, so maintaining hot compost through sustained freezing weather can require more effort than it is worth.", "You can continue adding material even when breakdown pauses. Expect the pile to fill faster and plan to mix it once conditions become reliably milder."], },
      { heading: "Prepare before the first hard freeze", paragraphs: ["Turn and balance the pile while it is still workable. Aim for the moisture of a wrung-out sponge, add coarse browns for air space and increase the pile's mass if you have suitable material.", "A roof, lid or top cover can keep winter rain and snow from saturating the pile, but do not seal the sides airtight. Straw bales or bags of dry leaves around the bin add insulation; install them before the pile freezes."], bullets: ["Store shredded leaves or plain cardboard in a dry place.", "Bury fresh scraps in the center and cover them with browns.", "Keep meat, dairy, fats and pet waste out of a backyard pile."] },
      { heading: "Should you turn compost in winter?", paragraphs: ["Turn an active pile only when it needs oxygen and can be mixed without creating a frozen mess. Frequent turning releases stored heat, so a well-balanced winter pile may benefit from being disturbed less often.", "If the pile is frozen solid, leave it alone. When daytime temperatures stay above freezing, break up compacted material, mix the old and new layers and correct moisture before expecting it to heat again."], },
      { heading: "Spring restart checklist", paragraphs: ["Inspect drainage, add dry browns if the thawed pile is soggy and mix the outer material into the center. If it is dry and inactive, add water gradually. A finished lower layer can be removed to cure while fresher material starts a new active pile."], },
    ],
    faq: [
      { question: "Does freezing kill compost microbes?", answer: "A freeze greatly slows activity, but decomposition can resume as the pile warms and conditions become favorable again." },
      { question: "Should winter compost be covered?", answer: "Covering the top is useful in wet climates, provided the pile still has side ventilation and drainage." },
      { question: "Can I add kitchen scraps to frozen compost?", answer: "Yes, in moderation. Chop them, bury them when possible and add dry browns so the thawed pile does not become wet and odor-prone." },
    ],
    sources: [
      { label: "Oregon State University Extension — Can I compost in freezing temperatures?", href: "https://extension.oregonstate.edu/ask-extension/featured/can-i-compost-freezing-temperatures" },
      { label: "US EPA — Composting at Home", href: "https://www.epa.gov/recycle/composting-home" },
    ],
    related: [
      { title: "Best Compost Tumblers for Leaves and Garden Waste", href: "/growing/best-compost-tumblers-for-leaves-and-garden-waste" },
      { title: "Best Compost Tumblers", href: "/growing/best-compost-tumblers" },
    ],
  },
  {
    slug: "how-to-sharpen-pruning-shears",
    silo: "garden-tools",
    title: "How to Sharpen Pruning Shears Without Ruining the Blade",
    metaTitle: "How to Sharpen Pruning Shears Step by Step",
    description: "Sharpen bypass and anvil pruning shears safely, preserve the factory bevel and remove burrs without grinding both sides of the blade.",
    dek: "The key is to sharpen the beveled cutting face while leaving the flat mating surface flat.",
    directAnswer: "Clean and secure the pruner, identify the factory bevel, then move a fine file or diamond sharpener along that bevel in one direction. Use the same angle already on the blade, make an equal number of light strokes along the edge, remove the burr from the flat side with one light pass, then lubricate the pivot.",
    readTime: "7 min",
    lastUpdated: updated,
    keyTakeaways: ["Sharpen only the beveled outside face on bypass pruners.", "Light, controlled strokes are safer than aggressive grinding.", "Replace a nicked, bent or cracked blade rather than removing excessive metal."],
    sections: [
      { heading: "Know which edge you are sharpening", paragraphs: ["Bypass pruners have a sharpened blade that passes a thicker counter-blade. The outside face is beveled; the inside face should remain flat so the blades slide closely. Anvil pruners cut against a block and may have a different bevel, so follow the tool's original geometry.", "Take a photo before disassembly and consult the manufacturer's instructions when the blade is replaceable. A pruning saw has set teeth and is better sharpened professionally unless its maker provides a specific process."], },
      { heading: "Clean, inspect and secure the tool", paragraphs: ["Wear eye protection and cut-resistant gloves. Remove soil and sap, dry the tool and check for cracks, deep chips, a bent blade or a damaged pivot. Sharpening cannot safely correct structural damage.", "Lock the pruner open or clamp it so the cutting edge faces away from you. If you disassemble the pivot, keep washers and spacers in order for accurate reassembly."], },
      { heading: "Sharpen in controlled passes", paragraphs: ["Place the file or stone flat against the existing bevel. Push it away from your body from the heel of the blade toward the tip, lifting on the return stroke. Work the entire edge rather than concentrating on one dull spot.", "Stop when the bevel is clean and a small, even burr can be felt on the flat side. Lay the sharpener nearly flat on that side and make one or two very light passes to remove the burr without creating a second bevel."], bullets: ["Maintain the original angle instead of choosing an arbitrary degree.", "Use the same light pressure along the full edge.", "Do not use a high-speed grinder unless the manufacturer permits it; excess heat can damage temper."] },
      { heading: "Reassemble and test", paragraphs: ["Apply a small amount of light machine oil to the pivot, reassemble and adjust tension so the blades move smoothly without side play. Test on scrap plant material, not a finger or sheet of paper held in your hand.", "Clean and dry the blades after use and store the pruner closed in a dry place. Regular light touch-ups remove less metal than waiting until the edge is severely rounded."], },
    ],
    faq: [
      { question: "Do you sharpen both sides of pruning shears?", answer: "Usually no. On bypass shears, sharpen the beveled face and only deburr the flat face so the blades continue to meet correctly." },
      { question: "Can I use a kitchen knife sharpener?", answer: "A small diamond file or sharpening stone gives better control over the existing bevel. Pull-through kitchen sharpeners can create the wrong geometry." },
      { question: "How often should pruners be sharpened?", answer: "Touch them up when cuts begin crushing or tearing rather than slicing cleanly. Frequency depends on use, blade steel and the material being cut." },
    ],
    sources: [
      { label: "UGA Extension — How to take care of garden tools", href: "https://site.extension.uga.edu/forsyth/how-to-take-care-of-garden-tools/" },
      { label: "UGA Cooperative Extension — Pruning ornamental plants", href: "https://extension.uga.edu/publications/detail.html?number=B961&title=pruning-ornamental-plants-in-the-landscape" },
    ],
    related: [
      { title: "Best Electric Pruning Shears", href: "/garden-tools/best-electric-pruning-shears" },
      { title: "Electric Pruning Shears vs. Manual Pruners", href: "/garden-tools/electric-pruning-shears-vs-manual-pruners" },
    ],
  },
  {
    slug: "how-to-clean-and-disinfect-pruning-shears",
    silo: "garden-tools",
    title: "How to Clean and Disinfect Pruning Shears",
    metaTitle: "How to Clean and Disinfect Pruning Shears Safely",
    description: "Remove sap and soil, disinfect pruning shears between diseased plants, dry the blades and protect the pivot from corrosion.",
    dek: "Cleaning removes debris; disinfecting reduces the chance of carrying pathogens. A good routine does both in the right order.",
    directAnswer: "Brush off debris and remove sap first, then wet the clean blade surfaces with 70% isopropyl alcohol when disease transfer is a concern. Let the disinfectant remain for the product's labeled contact time, dry the tool and lightly oil the pivot and metal surfaces before storage.",
    readTime: "6 min",
    lastUpdated: updated,
    keyTakeaways: ["Disinfectant works best after visible soil and sap have been removed.", "Clean between plants—and between cuts when removing infected tissue.", "Alcohol is convenient; bleach solutions can corrode tools and require careful rinsing and drying."],
    sections: [
      { heading: "Clean before you disinfect", paragraphs: ["Close the pruner safely and remove loose debris with a stiff brush or cloth. Use warm soapy water for ordinary grime and a small amount of an appropriate sap remover when resin remains, keeping liquid out of enclosed battery housings on powered tools.", "Inspect the blade, spring, lock and pivot while the tool is clean. Dry immediately; storing a damp tool can cause rust even if it was disinfected correctly."], },
      { heading: "Choose a practical disinfectant", paragraphs: ["For routine work around diseased tissue, wiping or spraying clean blades with 70% isopropyl alcohol is convenient and less corrosive than bleach. Follow the label and keep alcohol away from flame.", "Extension publications also describe diluted bleach, but bleach can damage metal and clothing and should never be mixed with other cleaners. If used, prepare it according to current label or extension guidance, rinse after the required contact time, dry thoroughly and oil the tool."], },
      { heading: "Know when to disinfect", paragraphs: ["Cleaning after every session is good maintenance. Disinfect when moving between plants where disease could be carried on the blade, and after each cut when removing visibly infected tissue from the same plant.", "Do not dip a dirty blade repeatedly into one container; organic debris reduces effectiveness and contaminates the solution. Use fresh wipes or decant a small working amount that will be discarded safely."], bullets: ["Remove soil and sap.", "Apply disinfectant to all cutting surfaces.", "Observe the labeled wet-contact time.", "Dry, lubricate the pivot and store the tool closed."] },
      { heading: "Care for powered pruning shears", paragraphs: ["Remove the battery before cleaning and follow the manufacturer's instructions for blade access and lubrication. Never soak the tool body, spray liquid into vents or bypass a blade-lock procedure.", "If the blade has side play, a damaged cutting edge or a contaminated mechanism you cannot safely reach, service or replace the relevant part instead of forcing disassembly."], },
    ],
    faq: [
      { question: "Can hydrogen peroxide disinfect pruning shears?", answer: "Use only a product whose label supports the intended surface and organism. Alcohol is commonly recommended by extension guidance because it is convenient and less corrosive than bleach." },
      { question: "Do I need to disinfect after every cut?", answer: "Not for routine pruning of healthy plants. Do it between plants when disease is a concern and after each cut through infected tissue." },
      { question: "Can I use bleach on pruning tools?", answer: "Diluted bleach can disinfect, but it is corrosive. Follow current guidance, never mix it with another cleaner, then rinse, dry and oil the metal." },
    ],
    sources: [
      { label: "UGA Cooperative Extension — Home Fruit Orchard Pruning Techniques", href: "https://extension.uga.edu/publications/detail.html?number=C1087" },
      { label: "UGA Extension — Rules for Pruning", href: "https://extension.uga.edu/content/dam/extension-county-offices/clarke-county/ag-newsletters/Shades%20of%20Green%20February%202024.pdf" },
    ],
    related: [
      { title: "Best Cordless Electric Pruning Shears", href: "/garden-tools/best-cordless-electric-pruning-shears" },
      { title: "Best Professional Electric Pruning Shears", href: "/garden-tools/best-professional-electric-pruning-shears" },
    ],
  },
  {
    slug: "best-time-to-water-a-lawn",
    silo: "lawn-care",
    title: "What Is the Best Time to Water a Lawn?",
    metaTitle: "Best Time to Water a Lawn: Morning, Midday or Evening?",
    description: "Learn why early morning is usually the best lawn-watering window and how to adjust irrigation for soil, rainfall and runoff.",
    dek: "Timing matters, but a deep, measured application and a check of soil moisture matter more than choosing an exact minute.",
    directAnswer: "Water established lawns in the early morning, commonly between about 4 and 8 a.m. in warm weather. Wind and evaporation are usually lower, and grass blades have time to dry; avoid routine midday irrigation and avoid leaving turf wet for long periods overnight.",
    readTime: "6 min",
    lastUpdated: updated,
    keyTakeaways: ["Early morning combines lower evaporation with daytime drying.", "Subtract rainfall and water according to soil moisture, not an automatic daily timer.", "Cycle-and-soak applications reduce runoff on slopes and compacted soil."],
    sections: [
      { heading: "Why morning usually wins", paragraphs: ["Morning irrigation loses less water to heat and wind than a midday cycle. It also allows wet leaf surfaces to dry as the day warms, reducing the long damp period that can occur with late-evening watering.", "The window is flexible. If local watering restrictions assign specific hours, follow them and choose the coolest, calmest permitted period."], },
      { heading: "How often is more important than a perfect time", paragraphs: ["An established lawn generally benefits from deeper, less frequent watering that moistens the root zone. University of Minnesota Extension notes that soil and weather can move weekly needs from roughly a quarter inch to an inch after accounting for rain, with sandy soil needing smaller, more frequent applications than clay.", "Use a rain gauge or straight-sided catch cans to measure output. Then probe the soil; the objective is moisture several inches down, not a glossy surface after every scheduled cycle."], },
      { heading: "Prevent runoff and wasted water", paragraphs: ["If water begins moving onto pavement, stop and allow it to soak in before restarting. Several shorter cycles can deliver the same measured amount with less runoff on compacted ground or a slope.", "Repair tilted heads, blocked nozzles and leaks. Keep spray off sidewalks, adjust the controller after rainfall and use a rain or soil-moisture sensor where compatible."], bullets: ["Water before heat and wind increase evaporation.", "Measure sprinkler output instead of estimating by run time.", "Pause irrigation when rain has supplied enough moisture."] },
      { heading: "Exceptions to the morning rule", paragraphs: ["New seed and sod need different moisture management from an established lawn and may require light applications at more than one time of day during establishment. Follow the installer or seed guidance, then transition toward deeper, less frequent watering as roots develop.", "During drought restrictions, conservation rules take priority. Letting suitable turf enter dormancy may be more responsible than trying to keep it uniformly green."], },
    ],
    faq: [
      { question: "Is 10 a.m. too late to water grass?", answer: "It is not automatically harmful, but evaporation and wind generally increase as the day warms. Earlier morning is usually more efficient." },
      { question: "Is it bad to water a lawn at night?", answer: "Routine late-night watering can keep foliage wet longer. If evening is the only option, water the soil efficiently and avoid excessive leaf wetness." },
      { question: "Should I water the lawn every day?", answer: "Established turf usually should not be watered daily. Base frequency on soil, rainfall, grass type and signs of water stress." },
    ],
    sources: [
      { label: "University of Minnesota Extension — Water wisely", href: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/water-wisely-start-in-your-own-backyard" },
      { label: "University of Minnesota Extension — Water-saving strategies for home lawns", href: "https://extension.umn.edu/garden-and-home/yard-and-garden/lawns-and-landscapes-in-minnesota/water-saving-strategies-for-home-lawns" },
    ],
    related: [
      { title: "Best Smart Sprinkler Controllers", href: "/watering/best-smart-sprinkler-controllers" },
      { title: "Best Lawn Aerators", href: "/lawn-care/best-lawn-aerators" },
    ],
  },
  {
    slug: "should-you-bag-grass-clippings",
    silo: "lawn-care",
    title: "Should You Bag Grass Clippings or Leave Them on the Lawn?",
    metaTitle: "Should You Bag Grass Clippings? When to Mulch or Remove Them",
    description: "Learn when grass clippings should stay on the lawn, when they need removal and why normal clippings do not create thatch.",
    dek: "For a routinely mowed lawn, leaving short clippings is usually the simpler and more useful choice.",
    directAnswer: "Leave short, evenly dispersed clippings on a healthy lawn. They decompose quickly, return nutrients and do not significantly contribute to thatch; bag or redistribute them when mowing produces wet clumps, when the grass is extremely tall, or when weed seed and herbicide restrictions make reuse unsuitable.",
    readTime: "6 min",
    lastUpdated: updated,
    keyTakeaways: ["Normal clippings break down quickly and are not a major cause of thatch.", "Remove or spread clumps that block light and air at the turf surface.", "Keep every clipping off streets and storm drains."],
    sections: [
      { heading: "Why clippings can stay", paragraphs: ["Small clippings filter into the canopy and decompose, returning plant nutrients to the soil. They are largely water and readily decomposed tissue, unlike the tougher stems and roots that contribute more to a thatch layer.", "Mulching in place also avoids bags, transport and a separate disposal task. The result depends on mowing often enough that the mower can distribute small pieces rather than rows of heavy material."], },
      { heading: "When removal makes sense", paragraphs: ["Bag, rake or spread clippings when the lawn was allowed to grow very tall and the cut leaves piles that shade the grass. Wet clippings can form dense mats, so wait for the lawn to dry when possible or collect the material if mowing cannot be postponed.", "Remove material where turf disease, mature weed seed or a recently applied lawn product creates a specific reason not to redistribute it. Follow the pesticide label; it controls whether treated clippings can be composted or used as garden mulch."], },
      { heading: "Use excess clippings carefully", paragraphs: ["Untreated, seed-free clippings can become a thin mulch layer after they dry. Iowa State Extension cautions that fresh material can mat and smell, so apply it lightly rather than creating a thick wet blanket.", "Mix clippings with dry browns in compost instead of dumping them into one compressed layer. Never sweep them into a road or drain, where nutrients can reach waterways and wet debris can create a slipping hazard."], bullets: ["Let garden-bound clippings dry first.", "Avoid thick layers around plant stems.", "Do not use clippings contrary to a herbicide label."] },
      { heading: "Improve the mowing result", paragraphs: ["Keep the blade sharp and remove no more than about one-third of the grass blade in a routine cut. If clumps still appear, make a second pass in a different direction after they dry or rake them apart instead of leaving opaque piles."], },
    ],
    faq: [
      { question: "Do grass clippings cause thatch?", answer: "Routine short clippings contribute very little to thatch because they decompose quickly." },
      { question: "Can I compost grass clippings?", answer: "Yes. Mix them with dry carbon-rich material so they do not compact into a wet, low-oxygen layer." },
      { question: "Can grass clippings be used around vegetables?", answer: "Dry, untreated and seed-free clippings can be used in a thin layer. Check any lawn-product label before moving treated clippings into a food garden." },
    ],
    sources: [
      { label: "Iowa State University Extension — Should I remove grass clippings?", href: "https://yardandgarden.extension.iastate.edu/faq/should-i-remove-grass-clippings-when-mowing-lawn" },
      { label: "Iowa State University Extension — Using mulch in the garden", href: "https://yardandgarden.extension.iastate.edu/how-to/using-mulch-garden" },
    ],
    related: [
      { title: "Best Lawn Sweepers for Grass Clippings", href: "/yard-cleanup/best-lawn-sweepers-for-grass-clippings" },
      { title: "Best Mulching Lawn Mowers", href: "/lawn-care/best-mulching-lawn-mowers" },
    ],
  },
  {
    slug: "how-to-winterize-a-garden-hose",
    silo: "watering",
    title: "How to Winterize a Garden Hose Before the First Freeze",
    metaTitle: "How to Winterize a Garden Hose and Outdoor Faucet",
    description: "Disconnect, drain, inspect and store a garden hose before freezing weather while protecting the connected outdoor faucet and supply pipe.",
    dek: "Leaving a hose attached can trap water at the faucet, turning a simple storage oversight into freeze damage to the plumbing behind it.",
    directAnswer: "Disconnect the hose before freezing weather, remove every attachment and drain it from end to end. Coil it without kinks in a dry, sheltered space, then shut off and drain the outdoor faucet if your plumbing has an interior isolation valve and protect the hose bib according to local guidance.",
    readTime: "6 min",
    lastUpdated: updated,
    keyTakeaways: ["Disconnecting the hose protects both the hose and the faucet connection.", "Drain accessories, nozzles and reels—not just the visible hose run.", "Store a loose coil out of sunlight and away from sharp bends."],
    sections: [
      { heading: "Disconnect before temperatures reach freezing", paragraphs: ["Remove the hose from the outdoor faucet even if it is marketed as freeze-resistant. Water trapped in the hose or fitting can freeze and expand, and an attached hose can prevent a frost-free faucet from draining as designed.", "Remove splitters, timers, spray nozzles and quick-connect fittings. Battery timers should be dried and stored according to their manual."], },
      { heading: "Drain the full length", paragraphs: ["Lay the hose downhill or stretch it across a gentle slope. Starting at the high end, lift sections and walk the water toward the open end. A reel must also be unwound enough to release trapped pockets.", "Do not use high-pressure compressed air unless the hose or irrigation manufacturer provides a procedure and pressure limit. For an ordinary removable hose, gravity draining is safer and usually sufficient."], },
      { heading: "Inspect and store without kinks", paragraphs: ["Check washers, couplings and the jacket for cracks or bulges. Let the hose dry, make broad coils and secure them loosely; a tight tie or sharp hook can create a permanent pinch point.", "Store the coil in a shed, garage or other sheltered location away from direct sun, rodents and sharp tools. Flexible hoses and drip tubing may survive outdoors when empty, but protected storage generally extends service life."], bullets: ["Drain nozzles and fittings separately.", "Replace flattened or cracked washers before spring.", "Keep the coil off a damp floor when practical."] },
      { heading: "Protect the outdoor faucet too", paragraphs: ["If the faucet has an indoor shutoff, close it and open the exterior faucet to drain the exposed section. Leave the valve in the position recommended for your plumbing type and add an insulated cover where local guidance calls for one.", "Plumbing layouts differ. If you cannot identify a shutoff or have an irrigation backflow device, follow the manufacturer or local water utility procedure rather than guessing."], },
    ],
    faq: [
      { question: "Can I leave an empty hose outside in winter?", answer: "An empty flexible hose may tolerate it, but sheltered storage reduces UV exposure, abrasion and freeze-thaw stress. Always disconnect it from the faucet." },
      { question: "Will a connected hose make pipes freeze?", answer: "It can trap water and prevent an outdoor faucet from draining, increasing the risk of damage to the faucet or connected pipe." },
      { question: "Should I put antifreeze in a garden hose?", answer: "No. A removable garden hose should be disconnected and gravity-drained. Follow manufacturer guidance for specialized irrigation or RV systems." },
    ],
    sources: [
      { label: "UGA Extension — Protect water pipes from freezing", href: "https://site.extension.uga.edu/forsyth/protect-water-pipes-from-freezing/" },
      { label: "Philadelphia Water Department — Frozen pipes", href: "https://water.phila.gov/drops/frozen-pipes/" },
    ],
    related: [
      { title: "Best Garden Hoses", href: "/watering/best-garden-hoses" },
      { title: "Best Retractable Garden Hose Reels", href: "/watering/best-retractable-garden-hose-reels" },
    ],
  },
  {
    slug: "soaker-hose-vs-drip-irrigation",
    silo: "watering",
    title: "Soaker Hose vs Drip Irrigation: Which Fits Your Garden?",
    metaTitle: "Soaker Hose vs Drip Irrigation: Which Fits Your Garden?",
    description: "Compare soaker hoses and drip irrigation for beds, pots, and sloping gardens. Choose a practical layout, test coverage, and plan maintenance.",
    dek: "Compare the complete watering layout—not just the line at the soil surface—to decide which system fits your beds, containers and maintenance routine.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "01-soaker-hose-vs-drip-irrigation.md",
    heroImage: "/images/informational/01-soaker-vs-drip.png",
  },
  {
    slug: "how-to-choose-a-garden-hose",
    silo: "watering",
    title: "How to Choose a Garden Hose: Length, Diameter, and Material",
    metaTitle: "How to Choose a Garden Hose: Length, Diameter, and Material",
    description: "Choose a garden hose by route length, internal diameter, material, fittings, and storage. Includes flow checks and a practical buying checklist.",
    dek: "Start with the route, water demand and storage method, then compare hose construction and fittings around that real job.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "02-how-to-choose-a-garden-hose.md",
    heroImage: "/images/informational/02-hose-selection.png",
  },
  {
    slug: "garden-hose-timer-not-working",
    silo: "watering",
    title: "Garden Hose Timer Not Working? A Troubleshooting Checklist",
    metaTitle: "Garden Hose Timer Not Working? Troubleshooting Checklist",
    description: "Troubleshoot a hose timer with no display, missed cycles, weak flow, leaks, or a valve that will not close. Follow model-specific instructions.",
    dek: "Isolate the power, supply, programming and valve one at a time before resetting or replacing the timer.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "03-garden-hose-timer-not-working.md",
    heroImage: "/images/informational/03-timer-checklist.png",
  },
  {
    slug: "how-to-set-up-drip-irrigation-for-raised-beds",
    silo: "watering",
    title: "How to Set Up Drip Irrigation for Raised Beds",
    metaTitle: "How to Set Up Drip Irrigation for Raised Beds",
    description: "Plan and install drip irrigation for raised beds, from source checks and compatible parts to coverage testing, schedules, and maintenance.",
    dek: "Plan the source, zones and wetting pattern on paper before buying fittings or fastening tubing inside the beds.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "04-drip-irrigation-for-raised-beds.md",
    heroImage: "/images/informational/04-raised-bed-drip.png",
  },
  {
    slug: "how-much-soil-for-a-raised-bed",
    silo: "growing",
    title: "How Much Soil Do You Need for a Raised Bed?",
    metaTitle: "How Much Soil for a Raised Bed? Calculator and Tables",
    description: "Calculate raised-bed soil volume in cubic feet, yards, or liters. Includes checked size tables, bag counts, top-up examples, and ordering advice.",
    dek: "Measure the usable interior, calculate volume in one unit and separate planting mix from mulch before ordering.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "06-how-much-soil-for-a-raised-bed.md",
    heroImage: "/images/informational/06-soil-volume.png",
  },
  {
    slug: "compost-tumbler-vs-compost-bin",
    silo: "growing",
    title: "Compost Tumbler vs Compost Bin: Which Fits Your Yard?",
    metaTitle: "Compost Tumbler vs Compost Bin: Which Fits Your Yard?",
    description: "Compare compost tumblers and bins by usable capacity, access, materials, batch routine, and harvesting. Choose the system that fits your yard.",
    dek: "The better system is the one that fits your material volume, batch routine, turning method and plan for harvesting finished compost.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "07-compost-tumbler-vs-compost-bin.md",
    heroImage: "/images/informational/07-tumbler-vs-bin.png",
  },
  {
    slug: "compost-tumbler-not-heating-up",
    silo: "growing",
    title: "Why Is My Compost Tumbler Not Heating Up?",
    metaTitle: "Why Is My Compost Tumbler Not Heating Up?",
    description: "Diagnose a cool compost tumbler by batch volume, moisture, materials, structure, and stage. Learn when slow composting is normal.",
    dek: "A cool tumbler is not automatically broken; diagnose batch size, moisture, material balance and stage before changing several things at once.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "08-compost-tumbler-not-heating-up.md",
    heroImage: "/images/informational/08-compost-diagnosis.png",
  },
  {
    slug: "dethatching-vs-aerating",
    silo: "lawn-care",
    title: "Dethatching vs Aerating: What Does Your Lawn Need?",
    metaTitle: "Dethatching vs Aerating: What Does Your Lawn Need?",
    description: "Understand dethatching and core aeration, inspect the lawn, and choose treatment timing by grass type and local conditions before buying tools.",
    dek: "Dethatching removes an excessive organic layer; core aeration relieves compacted soil. Inspect the lawn before choosing either treatment.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "09-dethatching-vs-aerating.md",
    heroImage: "/images/informational/09-dethatch-vs-aerate.png",
  },
  {
    slug: "leaf-blower-cfm-vs-mph",
    silo: "yard-cleanup",
    title: "Leaf Blower CFM vs MPH: What Matters for Your Yard?",
    metaTitle: "Leaf Blower CFM vs MPH: What Matters for Your Yard?",
    description: "Understand leaf blower CFM, MPH, force, nozzles, and runtime. Compare useful working specifications instead of isolated peak numbers.",
    dek: "CFM describes air volume and MPH describes speed; neither number alone captures how a blower will move your particular debris.",
    directAnswer: "", readTime: "16 min", lastUpdated: "2026-09-30",
    keyTakeaways: [], sections: [], faq: [], sources: [], related: [],
    contentFile: "10-leaf-blower-cfm-vs-mph.md",
    heroImage: "/images/informational/10-cfm-vs-mph.png",
  },
];

export function getInformationalGuide(slug: string) {
  return informationalGuides.find((guide) => guide.slug === slug);
}

export function getInformationalGuidesBySilo(silo: string) {
  return informationalGuides.filter((guide) => guide.silo === silo);
}
