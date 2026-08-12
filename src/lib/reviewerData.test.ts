import { describe, it, expect } from "vitest";
import { REVIEWER_DESCRIPTOR_SELECT, toReviewerDescriptor } from "./reviewerData";

/**
 * The reviewer endpoint must not select brewer-side columns. Enforcing it on
 * the select clause means the data never reaches the network response at all,
 * rather than being filtered in the component and shipped in the payload.
 */

describe("REVIEWER_DESCRIPTOR_SELECT", () => {
  it("selects only what a reviewer needs to choose a word", () => {
    expect(REVIEWER_DESCRIPTOR_SELECT).toEqual({ id: true, label: true, category: true });
  });

  it("selects no brewer-side column", () => {
    ["faultName", "likelyCause", "suggestedFix"].forEach((f) =>
      expect(REVIEWER_DESCRIPTOR_SELECT).not.toHaveProperty(f)
    );
  });
});

describe("toReviewerDescriptor", () => {
  it("strips brewer-side fields even if a caller over-selects", () => {
    // Deliberately over-selected, as a careless caller would.
    const row = {
      id: "f1",
      label: "Buttery / butterscotch",
      category: "flavour",
      faultName: "Diacetyl",
      likelyCause: "cold crashed too early",
      suggestedFix: "diacetyl rest",
    } as unknown as { id: string; label: string; category: string };
    expect(toReviewerDescriptor(row)).toEqual({
      id: "f1",
      label: "Buttery / butterscotch",
      category: "flavour",
    });
  });

  it("never leaks a fault name through a stray key", () => {
    const out = toReviewerDescriptor({
      id: "f1",
      label: "Green apple",
      category: "aroma",
      faultName: "Acetaldehyde",
    } as unknown as { id: string; label: string; category: string });
    expect(JSON.stringify(out)).not.toMatch(/acetaldehyde/i);
  });
});
