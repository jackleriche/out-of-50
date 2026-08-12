import { describe, it, expect } from "vitest";
import {
  initialState,
  reducer,
  canAdvance,
  isScoringStep,
  toSubmitPayload,
} from "./reviewFlow";

/**
 * The reviewer flow as a pure reducer. All the branching logic lives here,
 * not in the template — so the awkward cases are testable without rendering.
 */

const start = (blind: "off" | "guess_then_reveal" = "off") => initialState(blind);

describe("initialState", () => {
  it("starts every category at zero rather than a flattering midpoint", () => {
    // Defaulting to 6/12 nudges an unmotivated reviewer into an average score.
    expect(start().scores.aroma).toBe(0);
  });

  it("opens on the guess when the link is blind", () => {
    expect(start("guess_then_reveal").step).toBe("guess");
  });

  it("opens on aroma when the style is shown", () => {
    expect(start().step).toBe("aroma");
  });
});

describe("reducer", () => {
  it("records a score for the category it was given", () => {
    const s = reducer(start(), { type: "score", cat: "flavour", value: 16 });
    expect(s.scores.flavour).toBe(16);
  });

  it("advances one step at a time", () => {
    const s = reducer(start(), { type: "next" });
    expect(s.step).toBe("appearance");
  });

  it("cannot advance past the end", () => {
    let s = start();
    for (let i = 0; i < 50; i++) s = reducer(s, { type: "next" });
    expect(s.step).toBe("done");
  });

  it("cannot reverse past the beginning", () => {
    expect(reducer(start(), { type: "back" }).step).toBe("aroma");
  });

  it("toggling a descriptor on defaults it to noticeable", () => {
    const s = reducer(start(), { type: "toggleDescriptor", id: "d1" });
    expect(s.descriptors.d1).toBe("noticeable");
  });

  it("toggling the same descriptor again removes it entirely", () => {
    const on = reducer(start(), { type: "toggleDescriptor", id: "d1" });
    expect(reducer(on, { type: "toggleDescriptor", id: "d1" }).descriptors).toEqual({});
  });

  it("does not mutate the state it was given", () => {
    const before = start();
    reducer(before, { type: "score", cat: "aroma", value: 9 });
    expect(before.scores.aroma).toBe(0);
  });
});

describe("canAdvance", () => {
  it("blocks the blind round until a style is guessed", () => {
    expect(canAdvance(start("guess_then_reveal"))).toBe(false);
  });

  it("allows it once a guess is made", () => {
    const s = reducer(start("guess_then_reveal"), { type: "guess", styleId: "21B" });
    expect(canAdvance(s)).toBe(true);
  });

  it("blocks appearance until a colour is chosen", () => {
    const s = { ...start(), step: "appearance" as const };
    expect(canAdvance(s)).toBe(false);
  });

  it("never blocks a scoring step on the score itself, since zero is a real score", () => {
    expect(canAdvance(start())).toBe(true);
  });
});

describe("isScoringStep", () => {
  it("recognises the five BJCP categories", () => {
    expect(isScoringStep("aroma")).toBe(true);
    expect(isScoringStep("overall")).toBe(true);
  });

  it("rejects the steps that are not scored", () => {
    expect(isScoringStep("diagnostics")).toBe(false);
    expect(isScoringStep("guess")).toBe(false);
  });
});

describe("toSubmitPayload", () => {
  it("flattens descriptors into the shape the API expects", () => {
    const s = reducer(start(), { type: "toggleDescriptor", id: "d1" });
    expect(toSubmitPayload(s).descriptors).toEqual([
      { descriptorId: "d1", intensity: "noticeable" },
    ]);
  });

  it("carries the style guess through", () => {
    const s = reducer(start("guess_then_reveal"), { type: "guess", styleId: "21B" });
    expect(toSubmitPayload(s).styleGuessId).toBe("21B");
  });

  it("sends consent as false unless the reviewer ticked it", () => {
    expect(toSubmitPayload(start()).marketingConsent).toBe(false);
  });
});
