import { CATS, MAX, mean, spread, total, tallyDescriptors, type Cat, type Intensity } from "./scoring";

/**
 * Facts for the summary generator.
 *
 * Deliberately statistics only. Handed six free-text notes a model will
 * confabulate a narrative; handed numbers it can only describe what is there.
 */

export const SUMMARY_MIN_REVIEWS = 3;
const REFRESH_EVERY = 3;

/** Below the floor a "consensus" would be fiction; above it, refresh in batches. */
export const shouldSummarise = (reviewCount: number, lastGeneratedAt: number): boolean =>
  reviewCount >= SUMMARY_MIN_REVIEWS && reviewCount - lastGeneratedAt >= REFRESH_EVERY;

type ReviewFacts = {
  scores: Record<Cat, number>;
  ageDays: number | null;
  descriptors: readonly { label: string; intensity: Intensity }[];
  faults: readonly { label: string; intensity: Intensity }[];
};

export type SummaryFacts = {
  reviewCount: number;
  totalMean: number;
  totalSpread: number;
  categories: Record<Cat, { mean: number; spread: number; max: number }>;
  descriptors: { label: string; count: number; meanIntensity: number }[];
  faults: { label: string; count: number; meanIntensity: number }[];
  ageRange: { min: number; max: number } | null;
};

export const buildSummaryFacts = (reviews: readonly ReviewFacts[]): SummaryFacts => {
  const totals = reviews.map((r) => total(r.scores));
  const ages = reviews.map((r) => r.ageDays).filter((a): a is number => a !== null);

  return {
    reviewCount: reviews.length,
    totalMean: mean(totals),
    totalSpread: spread(totals),
    categories: CATS.reduce(
      (acc, c) => ({
        ...acc,
        [c]: {
          mean: mean(reviews.map((r) => r.scores[c])),
          spread: spread(reviews.map((r) => r.scores[c])),
          max: MAX[c],
        },
      }),
      {} as SummaryFacts["categories"]
    ),
    descriptors: tallyDescriptors(reviews),
    faults: tallyDescriptors(reviews.map((r) => ({ descriptors: r.faults }))),
    ageRange: ages.length ? { min: Math.min(...ages), max: Math.max(...ages) } : null,
  };
};

export const SUMMARY_PROMPT = `You are summarising anonymous tasting feedback for a homebrewer.

You will receive STATISTICS ONLY. Describe what the numbers show and nothing more.

Rules:
- Never invent a cause the numbers do not support.
- Agreement is the signal: several reviewers naming the same thing matters, one does not.
- If bottle ages vary and scores track age, say so — that is a packaging problem, not a recipe one.
- If spread is high, say the reviewers disagreed rather than reporting the average as settled.
- Two short paragraphs. Plain language. No score out of 50 in the first sentence.`;
