import { match } from "ts-pattern";
import { z } from "zod";

/**
 * Pure domain functions. No React, no I/O, no dates read from the clock.
 * Everything here is referentially transparent and trivially testable.
 */

// --- constants -------------------------------------------------------------

export const MAX = {
  aroma: 12,
  appearance: 3,
  flavour: 20,
  mouthfeel: 5,
  overall: 10,
} as const;

export const CATS = ["aroma", "appearance", "flavour", "mouthfeel", "overall"] as const;
export type Cat = (typeof CATS)[number];

export const LABEL: Record<Cat, string> = {
  aroma: "Aroma",
  appearance: "Appearance",
  flavour: "Flavour",
  mouthfeel: "Mouthfeel",
  overall: "Overall",
};

export const INTENSITIES = ["slight", "noticeable", "strong"] as const;
export type Intensity = (typeof INTENSITIES)[number];

const intensityWeight = (i: Intensity): number => INTENSITIES.indexOf(i) + 1;

export type Scores = Record<Cat, number>;
export type BlindMode = "off" | "guess_then_reveal";

export type Step =
  | "guess" | "reveal"
  | "aroma" | "appearance" | "flavour" | "mouthfeel" | "overall"
  | "diagnostics" | "sign" | "done";

// --- maths -----------------------------------------------------------------

export const mean = (xs: readonly number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * Population standard deviation. A single sheet cannot disagree with itself,
 * so one review yields zero rather than NaN.
 */
export const spread = (xs: readonly number[]): number =>
  xs.length < 2 ? 0 : Math.sqrt(mean(xs.map((x) => (x - mean(xs)) ** 2)));

/** Total is always derived — never stored, so it cannot drift. */
export const total = (s: Scores): number => CATS.reduce((acc, c) => acc + (s[c] ?? 0), 0);

// --- aggregation -----------------------------------------------------------

export type CategoryStat = {
  cat: Cat;
  mean: number;
  max: number;
  pct: number;
  spread: number;
  /** Against the brewer's own history. Null when there is nothing to compare. */
  delta: number | null;
};

export const categoryStats = (
  cat: Cat,
  sheets: readonly Scores[],
  history: Partial<Record<Cat, number>> | null
): CategoryStat => {
  const values = sheets.map((s) => s[cat]);
  const m = mean(values);
  const past = history?.[cat];

  return {
    cat,
    mean: m,
    max: MAX[cat],
    pct: (m / MAX[cat]) * 100,
    spread: spread(values),
    delta: past === undefined ? null : m - past,
  };
};

/** Curried so a page can partially apply the sheets once and map over categories. */
export const statsFor =
  (sheets: readonly Scores[]) =>
  (history: Partial<Record<Cat, number>> | null) =>
  (cat: Cat): CategoryStat =>
    categoryStats(cat, sheets, history);

export type Tally = { label: string; count: number; meanIntensity: number };

type Tallyable = { descriptors: readonly { label: string; intensity: Intensity }[] };

/**
 * How many reviewers independently named each thing. Agreement is the signal —
 * one person tasting butter is noise, four is a diagnosis.
 */
export const tallyDescriptors = (reviews: readonly Tallyable[]): Tally[] => {
  const acc = reviews
    .flatMap((r) => r.descriptors)
    .reduce<Record<string, number[]>>(
      (m, d) => ({ ...m, [d.label]: [...(m[d.label] ?? []), intensityWeight(d.intensity)] }),
      {}
    );

  return Object.entries(acc)
    .map(([label, weights]) => ({
      label,
      count: weights.length,
      meanIntensity: mean(weights),
    }))
    .sort((a, b) => b.count - a.count || b.meanIntensity - a.meanIntensity);
};

/** Days from packaging (or brewing) to the moment it was scored. */
export const beerAgeDays = (scoredAt: Date, ref: Date | null): number | null =>
  ref === null ? null : Math.round((scoredAt.getTime() - ref.getTime()) / 86_400_000);

// --- flow ------------------------------------------------------------------

const SCORING_STEPS: Step[] = [
  "aroma", "appearance", "flavour", "mouthfeel", "overall", "diagnostics", "sign", "done",
];

/** The share link decides this, never the reviewer. */
export const stepsFor = (blind: BlindMode): Step[] =>
  match(blind)
    .with("guess_then_reveal", (): Step[] => ["guess", "reveal", ...SCORING_STEPS])
    .with("off", (): Step[] => SCORING_STEPS)
    .exhaustive();

export const labelForStep = (step: Step): string =>
  match(step)
    .with("sign", () => "Send scoresheet")
    .with("reveal", () => "Start scoring")
    .with("done", () => "")
    .otherwise(() => "Next");

// --- validation ------------------------------------------------------------

export const scoreSchema = z.object({
  aroma: z.number().int().min(0).max(MAX.aroma),
  appearance: z.number().int().min(0).max(MAX.appearance),
  flavour: z.number().int().min(0).max(MAX.flavour),
  mouthfeel: z.number().int().min(0).max(MAX.mouthfeel),
  overall: z.number().int().min(0).max(MAX.overall),
});

/** No skipping — every category is required on a submitted sheet. */
export const submitSchema = scoreSchema.extend({
  trueToStyle: z.number().int().min(1).max(5).nullish(),
  perceivedSrm: z.number().min(1).max(50).nullish(),
  styleGuessId: z.string().nullish(),
  aromaNotes: z.string().max(2000).nullish(),
  appearanceNotes: z.string().max(2000).nullish(),
  flavourNotes: z.string().max(2000).nullish(),
  mouthfeelNotes: z.string().max(2000).nullish(),
  overallNotes: z.string().max(2000).nullish(),
  displayName: z.string().max(80).nullish(),
  contactEmail: z.string().email().nullish(),
  marketingConsent: z.boolean().default(false),
  descriptors: z
    .array(z.object({ descriptorId: z.string(), intensity: z.enum(INTENSITIES) }))
    .max(60)
    .default([]),
});

export type SubmitPayload = z.infer<typeof submitSchema>;

// --- category copy ---------------------------------------------------------

/** What each category asks the reviewer to do. Organism-level knowledge. */
export const BLURB: Record<Cat, string> = {
  aroma: "Swirl it. Malt, hops, fermentation character — what's there, and how strong?",
  appearance: "Hold it to the light. Pick the colour you actually see.",
  flavour: "Let it warm slightly. Balance, bitterness, finish, and how it changes.",
  mouthfeel: "Body, carbonation, warmth, astringency. Texture, not taste.",
  overall: "Would you have another? Does it hang together as an example of the style?",
};

export const ANCHORS: Record<Cat, readonly [string, string]> = {
  aroma: ["Absent", "Exemplary"],
  appearance: ["Off", "Perfect"],
  flavour: ["Unpleasant", "Exemplary"],
  mouthfeel: ["Thin", "Perfect"],
  overall: ["Would not finish", "Would buy again"],
};

/** Overall impression is a judgement, not a checklist — no descriptors there. */
export const takesDescriptors = (cat: Cat): boolean => cat !== "overall";
