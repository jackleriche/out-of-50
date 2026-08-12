import { describe, it, expect } from "vitest";
import { positionOnScale, positionsFor, bandFor } from "./geometry";

/**
 * Pure positioning maths, pulled OUT of the molecules that render it.
 * A molecule that computes percentages is doing logic; this is where it goes.
 */

describe("positionOnScale", () => {
  it("puts the minimum at the left edge", () => {
    expect(positionOnScale(0, 50)(0)).toBe(0);
  });

  it("puts the maximum at the right edge", () => {
    expect(positionOnScale(0, 50)(50)).toBe(100);
  });

  it("places a midpoint halfway", () => {
    expect(positionOnScale(0, 50)(25)).toBe(50);
  });

  it("clamps anything beyond the scale rather than overflowing the track", () => {
    expect(positionOnScale(0, 50)(60)).toBe(100);
    expect(positionOnScale(0, 50)(-5)).toBe(0);
  });

  it("collapses to the left edge when the scale has no width", () => {
    expect(positionOnScale(10, 10)(10)).toBe(0);
  });
});

describe("positionsFor", () => {
  it("maps every value onto the scale", () => {
    expect(positionsFor(0, 50)([0, 25, 50])).toEqual([0, 50, 100]);
  });

  it("preserves order, so a dot never jumps track", () => {
    expect(positionsFor(0, 50)([40, 10])).toEqual([80, 20]);
  });
});

describe("bandFor", () => {
  it("spans from the lowest score to the highest", () => {
    expect(bandFor(0, 50)([30, 38, 44])).toEqual({ left: 60, width: 28 });
  });

  it("has no width when every reviewer agreed", () => {
    expect(bandFor(0, 50)([38, 38])).toEqual({ left: 76, width: 0 });
  });

  it("is null when there is nothing to plot", () => {
    expect(bandFor(0, 50)([])).toBeNull();
  });
});
