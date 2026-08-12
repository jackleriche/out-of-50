import { describe, it, expect } from "vitest";
import { buildSummaryFacts, shouldSummarise, SUMMARY_MIN_REVIEWS } from "./summarise";

/**
 * The generator is fed computed statistics only — never the raw notes.
 * Hand a model six free-text reviews and it will invent a pattern; hand it
 * numbers and it can only describe what is actually there.
 */

const review = (o: Partial<Record<string, unknown>> = {}) => ({
  scores: { aroma: 9, appearance: 3, flavour: 15, mouthfeel: 4, overall: 7 },
  ageDays: 14,
  descriptors: [{ label: "Citrus", intensity: "strong" as const }],
  faults: [],
  notes: "This beer tasted like my nan's kitchen and I have opinions about the label",
  ...o,
});

describe("shouldSummarise", () => {
  it("refuses to invent a consensus from too few sheets", () => {
    expect(shouldSummarise(2, 0)).toBe(false);
  });

  it("summarises once enough reviewers have weighed in", () => {
    expect(shouldSummarise(SUMMARY_MIN_REVIEWS, 0)).toBe(true);
  });

  it("does not regenerate on every new review", () => {
    expect(shouldSummarise(4, 3)).toBe(false);
  });

  it("refreshes once several more have arrived", () => {
    expect(shouldSummarise(6, 3)).toBe(true);
  });
});

describe("buildSummaryFacts", () => {
  const reviews = [review(), review(), review({ ageDays: 30 })];

  it("passes no free text to the generator", () => {
    expect(JSON.stringify(buildSummaryFacts(reviews))).not.toMatch(/nan's kitchen/);
  });

  it("includes the total and its spread", () => {
    const facts = buildSummaryFacts(reviews);
    expect(facts.totalMean).toBe(38);
    expect(facts.totalSpread).toBe(0);
  });

  it("includes per-category means", () => {
    expect(buildSummaryFacts(reviews).categories.flavour.mean).toBe(15);
  });

  it("counts descriptor agreement rather than listing every mention", () => {
    expect(buildSummaryFacts(reviews).descriptors[0]).toMatchObject({
      label: "Citrus",
      count: 3,
    });
  });

  it("reports the range of bottle ages, since condition explains most disagreement", () => {
    expect(buildSummaryFacts(reviews).ageRange).toEqual({ min: 14, max: 30 });
  });

  it("omits the age range entirely when no dates were recorded", () => {
    expect(buildSummaryFacts([review({ ageDays: null })]).ageRange).toBeNull();
  });
});
