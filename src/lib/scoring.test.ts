import { describe, it, expect } from "vitest";
import {
  total,
  spread,
  categoryStats,
  tallyDescriptors,
  beerAgeDays,
  stepsFor,
  labelForStep,
} from "./scoring";

const sheet = (o: Partial<Record<string, number>> = {}) => ({
  aroma: 9,
  appearance: 3,
  flavour: 15,
  mouthfeel: 4,
  overall: 7,
  ...o,
});

describe("total", () => {
  it("sums the five BJCP categories", () => {
    expect(total(sheet())).toBe(38);
  });

  it("never exceeds 50 for a valid sheet", () => {
    expect(total({ aroma: 12, appearance: 3, flavour: 20, mouthfeel: 5, overall: 10 })).toBe(50);
  });

  it("excludes the unscored diagnostics", () => {
    // trueToStyle is deliberately not part of the total
    expect(total({ ...sheet(), trueToStyle: 5 } as never)).toBe(38);
  });
});

describe("spread", () => {
  it("is zero when every reviewer agrees", () => {
    expect(spread([38, 38, 38])).toBe(0);
  });

  it("grows with disagreement", () => {
    expect(spread([30, 38, 46])).toBeGreaterThan(spread([36, 38, 40]));
  });

  it("is zero for a single sheet, since one review cannot disagree", () => {
    expect(spread([38])).toBe(0);
  });
});

describe("categoryStats", () => {
  const sheets = [sheet(), sheet({ aroma: 11 }), sheet({ aroma: 7 })];

  it("reports the mean for a category", () => {
    expect(categoryStats("aroma", sheets, null).mean).toBe(9);
  });

  it("expresses the mean as a percentage of that category's maximum", () => {
    expect(categoryStats("appearance", sheets, null).pct).toBe(100);
  });

  it("returns a null delta when there is no history to compare against", () => {
    expect(categoryStats("aroma", sheets, null).delta).toBeNull();
  });

  it("returns a signed delta against the brewer's own history", () => {
    expect(categoryStats("aroma", sheets, { aroma: 8 }).delta).toBe(1);
  });
});

describe("tallyDescriptors", () => {
  const reviews = [
    { descriptors: [{ label: "Citrus", intensity: "strong" as const }] },
    {
      descriptors: [
        { label: "Citrus", intensity: "slight" as const },
        { label: "Hazy", intensity: "noticeable" as const },
      ],
    },
  ];

  it("counts how many reviewers named each descriptor", () => {
    expect(tallyDescriptors(reviews).find((d) => d.label === "Citrus")?.count).toBe(2);
  });

  it("orders by how many reviewers agreed", () => {
    expect(tallyDescriptors(reviews)[0].label).toBe("Citrus");
  });

  it("averages the intensity across the reviewers who named it", () => {
    expect(tallyDescriptors(reviews).find((d) => d.label === "Citrus")?.meanIntensity).toBe(2);
  });
});

describe("beerAgeDays", () => {
  it("measures from the reference date to the moment it was scored", () => {
    expect(beerAgeDays(new Date("2026-07-12"), new Date("2026-06-28"))).toBe(14);
  });

  it("is null when the brewer never recorded a date", () => {
    expect(beerAgeDays(new Date("2026-07-12"), null)).toBeNull();
  });
});

describe("stepsFor", () => {
  it("opens with the guess and reveal when the link is blind", () => {
    expect(stepsFor("guess_then_reveal").slice(0, 2)).toEqual(["guess", "reveal"]);
  });

  it("goes straight to scoring when the style is shown", () => {
    expect(stepsFor("off")[0]).toBe("aroma");
  });

  it("always ends with sign then done", () => {
    expect(stepsFor("off").slice(-2)).toEqual(["sign", "done"]);
  });
});

describe("labelForStep", () => {
  it("names the action rather than the step", () => {
    expect(labelForStep("sign")).toBe("Send scoresheet");
    expect(labelForStep("reveal")).toBe("Start scoring");
    expect(labelForStep("aroma")).toBe("Next");
  });
});
