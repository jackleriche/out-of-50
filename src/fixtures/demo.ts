/**
 * Fixtures for the preview routes — no database required.
 *
 * Deliberately awkward data: one harsh outlier, one very old bottle, two
 * faults with partial agreement. A results page that only looks right on
 * tidy data is not finished.
 */

import type { Cat } from "@/lib/scoring";

export const DEMO_BEER = {
  name: "Corbière Current",
  brewer: "Wonder",
  abv: "6.2%",
  batch: "4",
  style: { id: "21B", name: "Specialty IPA: New England IPA" },
};

export const DEMO_STYLES = [
  { id: "4A", name: "Munich Helles" },
  { id: "5B", name: "Kölsch" },
  { id: "18B", name: "American Pale Ale" },
  { id: "20A", name: "American Porter" },
  { id: "21A", name: "American IPA" },
  { id: "21B", name: "Specialty IPA: New England IPA" },
];

export const DEMO_DESCRIPTORS = [
  { id: "a1", label: "Citrus", category: "aroma" },
  { id: "a2", label: "Tropical fruit", category: "aroma" },
  { id: "a3", label: "Stone fruit", category: "aroma" },
  { id: "a4", label: "Pine / resin", category: "aroma" },
  { id: "a5", label: "Bready malt", category: "aroma" },
  { id: "a6", label: "Dank", category: "aroma" },
  { id: "p1", label: "Hazy", category: "appearance" },
  { id: "p2", label: "Brilliant", category: "appearance" },
  { id: "p3", label: "Dense head", category: "appearance" },
  { id: "p4", label: "Thin head", category: "appearance" },
  { id: "f1", label: "Citrus", category: "flavour" },
  { id: "f2", label: "Tropical fruit", category: "flavour" },
  { id: "f3", label: "Bitter finish", category: "flavour" },
  { id: "f4", label: "Soft bitterness", category: "flavour" },
  { id: "f5", label: "Dry finish", category: "flavour" },
  { id: "f6", label: "Sweet finish", category: "flavour" },
  { id: "m1", label: "Full body", category: "mouthfeel" },
  { id: "m2", label: "Medium body", category: "mouthfeel" },
  { id: "m3", label: "Creamy", category: "mouthfeel" },
  { id: "m4", label: "Prickly carbonation", category: "mouthfeel" },
];

export const DEMO_FAULTS = [
  { id: "x1", label: "Buttery / butterscotch" },
  { id: "x2", label: "Green apple" },
  { id: "x3", label: "Sticking plaster" },
  { id: "x4", label: "Wet cardboard" },
  { id: "x5", label: "Cooked veg" },
  { id: "x6", label: "Cidery" },
];

export const SRM_LADDER = [
  { srm: 2, hex: "#F8F4A0" }, { srm: 3, hex: "#F6EE85" }, { srm: 4, hex: "#F3E163" },
  { srm: 6, hex: "#EBC842" }, { srm: 8, hex: "#DFA837" }, { srm: 10, hex: "#D08D2B" },
  { srm: 13, hex: "#BC6F20" }, { srm: 17, hex: "#A0521A" }, { srm: 20, hex: "#8A3E15" },
  { srm: 24, hex: "#743012" }, { srm: 30, hex: "#55200E" }, { srm: 40, hex: "#2C1108" },
];

const s = (
  aroma: number, appearance: number, flavour: number, mouthfeel: number, overall: number
): Record<Cat, number> => ({ aroma, appearance, flavour, mouthfeel, overall });

export const DEMO_REVIEWS = [
  { id: "r1", who: "Tom H.", anonymous: false, ageDays: 14, flagged: false,
    scores: s(10, 3, 16, 4, 8),
    notes: "Massive tropical hit on the nose. Softer bitterness than I expected but it works." },
  { id: "r2", who: null, anonymous: true, ageDays: 16, flagged: true,
    scores: s(9, 2, 15, 4, 8), notes: "Head dropped away fast. Good beer." },
  { id: "r3", who: "Priya S.", anonymous: false, ageDays: 12, flagged: false,
    scores: s(11, 3, 17, 5, 8), notes: "Best one you've done. Pillowy." },
  // The outlier, and the oldest bottle. The page must make this legible.
  { id: "r4", who: null, anonymous: true, ageDays: 21, flagged: true,
    scores: s(6, 2, 11, 3, 5),
    notes: "Something a bit off in the finish — sort of sweet and buttery, and the hops felt faded. Might just be my bottle." },
  { id: "r5", who: "Dave M.", anonymous: false, ageDays: 15, flagged: false,
    scores: s(9, 3, 15, 4, 7), notes: "Really juicy. Fades a bit warm." },
  { id: "r6", who: null, anonymous: true, ageDays: 19, flagged: true,
    scores: s(8, 2, 14, 3, 6), notes: null },
];

export const DEMO_HISTORY = { aroma: 9.1, appearance: 2.6, flavour: 15.2, mouthfeel: 3.9, overall: 7.4 };

export const DEMO_TALLY = [
  { label: "Tropical fruit", count: 5, meanIntensity: 2.6 },
  { label: "Citrus", count: 4, meanIntensity: 2.3 },
  { label: "Hazy", count: 4, meanIntensity: 2.5 },
  { label: "Creamy", count: 2, meanIntensity: 2.5 },
  { label: "Bready malt", count: 2, meanIntensity: 1.5 },
];

export const DEMO_FAULT_CARDS = [
  {
    faultName: "Diacetyl",
    reviewerWords: ["Buttery / butterscotch"],
    flaggedBy: 3,
    outOf: 6,
    likelyCause:
      "Yeast pulled off the beer before it reabsorbed its diacetyl — most often a cold crash started too early, or a fermentation that stalled and was never roused.",
    suggestedFix:
      "Hold at 20–22 °C for 48h at terminal gravity before crashing. Force a diacetyl rest test on the next batch: heat a sample to 60 °C, cool, and smell.",
  },
  {
    faultName: "Oxidation",
    reviewerWords: ["Wet cardboard", "Dull"],
    flaggedBy: 1,
    outOf: 6,
    likelyCause:
      "Oxygen pickup after fermentation — transfer, packaging, or headspace. Hazy beers show it fastest and worst.",
    suggestedFix:
      "Purge the receiving vessel with CO₂, closed-transfer, and cut headspace. Check bottle fill height and cap seal.",
  },
];

export const DEMO_SUMMARY = `Strong agreement on the hop character — tropical fruit and citrus came up in five of six sheets, mostly at full intensity. Mouthfeel scored well wherever the bottle was fresh.

The disagreement is almost entirely about condition rather than recipe. Sheets from bottles under 16 days old average 41; the two oldest average 35. Three reviewers independently described butter, and the oldest bottle also showed cardboard.`;
