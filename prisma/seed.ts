import { PrismaClient } from "@prisma/client";

/**
 * Seed. Gives you a working local app in one command: a brewer, a beer, two
 * share links (one blind and anonymous, one plain), the descriptor
 * vocabulary, and a handful of styles.
 *
 * The style data here is a minimal placeholder set written from scratch —
 * the real BJCP guidelines are copyrighted, and their licensing needs
 * settling before shipping the full catalogue.
 */

const db = new PrismaClient();

const STYLES = [
  { id: "4A", name: "Munich Helles", category: "Pale Malty European Lager", abvMin: 4.7, abvMax: 5.4, ibuMin: 16, ibuMax: 22, srmMin: 3, srmMax: 5 },
  { id: "5B", name: "Kölsch", category: "German Wheat Beer", abvMin: 4.4, abvMax: 5.2, ibuMin: 18, ibuMax: 30, srmMin: 3.5, srmMax: 5 },
  { id: "18B", name: "American Pale Ale", category: "Pale American Ale", abvMin: 4.5, abvMax: 6.2, ibuMin: 30, ibuMax: 50, srmMin: 5, srmMax: 10 },
  { id: "20A", name: "American Porter", category: "American Porter and Stout", abvMin: 4.8, abvMax: 6.5, ibuMin: 25, ibuMax: 50, srmMin: 22, srmMax: 40 },
  { id: "21A", name: "American IPA", category: "IPA", abvMin: 5.5, abvMax: 7.5, ibuMin: 40, ibuMax: 70, srmMin: 6, srmMax: 14 },
  { id: "21B", name: "Specialty IPA: New England IPA", category: "IPA", abvMin: 6.0, abvMax: 9.0, ibuMin: 25, ibuMax: 60, srmMin: 3, srmMax: 7 },
];

/**
 * Character descriptors. Plain words only — these are what reviewers pick.
 */
const CHARACTER: [string, string][] = [
  ["Citrus", "aroma"], ["Tropical fruit", "aroma"], ["Stone fruit", "aroma"],
  ["Pine / resin", "aroma"], ["Grassy", "aroma"], ["Bready malt", "aroma"],
  ["Caramel", "aroma"], ["Floral", "aroma"], ["Dank", "aroma"], ["Boozy", "aroma"],
  ["Hazy", "appearance"], ["Brilliant", "appearance"], ["Dull", "appearance"],
  ["Dense head", "appearance"], ["Thin head", "appearance"], ["Good lacing", "appearance"],
  ["Citrus", "flavour"], ["Tropical fruit", "flavour"], ["Bitter finish", "flavour"],
  ["Soft bitterness", "flavour"], ["Bready malt", "flavour"], ["Caramel", "flavour"],
  ["Sweet finish", "flavour"], ["Dry finish", "flavour"], ["Astringent", "flavour"],
  ["Full body", "mouthfeel"], ["Medium body", "mouthfeel"], ["Light body", "mouthfeel"],
  ["Creamy", "mouthfeel"], ["Slick", "mouthfeel"], ["Prickly carbonation", "mouthfeel"],
  ["Soft carbonation", "mouthfeel"], ["Warming", "mouthfeel"],
];

/**
 * Faults. The reviewer sees `label` only; the other three columns are
 * brewer-side and must never be selected by a reviewer-facing query.
 */
const FAULTS = [
  {
    label: "Buttery / butterscotch", category: "flavour", faultName: "Diacetyl",
    likelyCause:
      "Yeast pulled off the beer before it reabsorbed its diacetyl — most often a cold crash started too early, or a fermentation that stalled and was never roused.",
    suggestedFix:
      "Hold at 20–22 °C for 48h at terminal gravity before crashing. Run a forced diacetyl test: heat a sample to 60 °C, cool it, and smell.",
  },
  {
    label: "Green apple", category: "aroma", faultName: "Acetaldehyde",
    likelyCause: "Beer packaged young — acetaldehyde is an intermediate the yeast had not finished converting.",
    suggestedFix: "Give it longer at fermentation temperature before crashing, and confirm gravity is stable across three days.",
  },
  {
    label: "Wet cardboard", category: "flavour", faultName: "Oxidation",
    likelyCause: "Oxygen pickup after fermentation — transfer, packaging, or headspace. Hazy hoppy beers show it fastest and worst.",
    suggestedFix: "Purge the receiving vessel with CO₂, closed-transfer, cut headspace, and check fill height and cap seal.",
  },
  {
    label: "Sticking plaster", category: "flavour", faultName: "Chlorophenol",
    likelyCause: "Chlorine or chloramine in the water reacting with yeast phenols, or sanitiser residue left in a vessel.",
    suggestedFix: "Treat liquor with campden, or use RO water. Rinse or switch to a no-rinse sanitiser used at the right strength.",
  },
  {
    label: "Cooked veg", category: "aroma", faultName: "DMS",
    likelyCause: "Insufficiently vigorous or too short a boil, or wort left hot and covered so DMS could not escape.",
    suggestedFix: "Boil uncovered for at least 60 minutes at a genuine rolling boil, then chill quickly.",
  },
  {
    label: "Cidery", category: "flavour", faultName: "Acetaldehyde / excess simple sugar",
    likelyCause: "Fermented too warm, or too much simple sugar in the grist thinning the finish.",
    suggestedFix: "Control fermentation temperature and keep simple sugar additions modest for the style.",
  },
  {
    label: "Soy sauce", category: "flavour", faultName: "Autolysis",
    likelyCause: "Beer left on a yeast cake too long, especially warm — the yeast broke down and released its contents.",
    suggestedFix: "Transfer off the yeast sooner after terminal gravity, and keep the vessel cold if it must sit.",
  },
  {
    label: "Vinegar", category: "flavour", faultName: "Acetic acid",
    likelyCause: "Bacterial infection, usually with oxygen present — a scratched vessel, a tired seal, or a hose past its life.",
    suggestedFix: "Replace soft parts, inspect plastics for scratches, and review the sanitation routine end to end.",
  },
];

async function main() {
  console.log("Seeding…");

  for (const s of STYLES) {
    await db.style.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, year: 2021 },
    });
  }

  for (const [label, category] of CHARACTER) {
    await db.descriptor.upsert({
      where: { label_category: { label, category: category as never } },
      update: {},
      create: { label, category: category as never, kind: "character" },
    });
  }

  for (const f of FAULTS) {
    await db.descriptor.upsert({
      where: { label_category: { label: f.label, category: f.category as never } },
      update: {},
      create: {
        label: f.label,
        category: f.category as never,
        kind: "fault",
        faultName: f.faultName,
        likelyCause: f.likelyCause,
        suggestedFix: f.suggestedFix,
      },
    });
  }

  const brewer = await db.user.upsert({
    where: { email: "brewer@example.com" },
    update: {},
    create: { email: "brewer@example.com", name: "Wonder" },
  });

  const beer = await db.beer.upsert({
    where: { id: "seed-beer-1" },
    update: {},
    create: {
      id: "seed-beer-1",
      brewerId: brewer.id,
      name: "Corbière Current",
      styleId: "21B",
      batchNo: "4",
      abv: 6.2,
      ibu: 45,
      srm: 5,
      brewedOn: new Date(Date.now() - 40 * 86_400_000),
      packagedOn: new Date(Date.now() - 21 * 86_400_000),
    },
  });

  // Two links on one beer, with different rules — the reason settings live on
  // the link rather than the beer.
  await db.shareLink.upsert({
    where: { token: "demo-blind" },
    update: {},
    create: {
      beerId: beer.id,
      token: "demo-blind",
      kind: "open",
      blindMode: "guess_then_reveal",
      anonymous: true,
    },
  });

  await db.shareLink.upsert({
    where: { token: "demo-open" },
    update: {},
    create: {
      beerId: beer.id,
      token: "demo-open",
      kind: "open",
      blindMode: "off",
      anonymous: false,
    },
  });

  console.log("Done.\n");
  console.log("  Blind + anonymous:  http://localhost:3000/b/demo-blind");
  console.log("  Style shown:        http://localhost:3000/b/demo-open\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
