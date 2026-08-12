import { describe, it, expect } from "vitest";
import { theme, space, SPACE_STEPS } from "./theme";

/**
 * The theme is a frozen, static object. Nothing computes a colour or a gap at
 * runtime — if a value isn't in here, it isn't allowed in a stylesheet.
 */

describe("theme", () => {
  it("is frozen, so nothing can mutate the design system at runtime", () => {
    expect(Object.isFrozen(theme)).toBe(true);
    expect(Object.isFrozen(theme.colour)).toBe(true);
  });

  it("exposes every colour as a hex string", () => {
    Object.values(theme.colour).forEach((c) => expect(c).toMatch(/^#[0-9A-F]{6}$/i));
  });

  it("names colours by role, not by appearance", () => {
    // "ink" and "biro" survive a repaint; "darkBlue" does not.
    expect(Object.keys(theme.colour)).not.toContain("blue");
    expect(theme.colour).toHaveProperty("ink");
    expect(theme.colour).toHaveProperty("fault");
  });
});

describe("space", () => {
  it("is built entirely from multiples of four", () => {
    SPACE_STEPS.forEach((n) => expect(n % 4).toBe(0));
  });

  it("runs 4 to 48, small enough to hold in your head", () => {
    expect(SPACE_STEPS[0]).toBe(4);
    expect(SPACE_STEPS[SPACE_STEPS.length - 1]).toBe(48);
    expect(SPACE_STEPS).toHaveLength(7);
  });

  it("ascends, and never doubles so far that a layout has nowhere to land", () => {
    expect(SPACE_STEPS).toEqual([4, 8, 12, 16, 24, 32, 48]);
    SPACE_STEPS.forEach((n, i) => {
      if (i > 0) expect(n / SPACE_STEPS[i - 1]).toBeLessThanOrEqual(2);
    });
  });

  it("returns a px string for a step", () => {
    expect(space(4)).toBe("4px");
    expect(space(24)).toBe("24px");
  });

  it("composes multiple steps for shorthand properties", () => {
    expect(space(8, 16)).toBe("8px 16px");
    expect(space(4, 8, 4, 8)).toBe("4px 8px 4px 8px");
  });

  it("accepts zero, since no gap is a legitimate choice", () => {
    expect(space(0)).toBe("0px");
  });
});

describe("theme.type", () => {
  it("offers a bounded set of sizes rather than arbitrary numbers", () => {
    expect(Object.keys(theme.type.size).length).toBeLessThanOrEqual(8);
  });

  it("sizes are all px strings", () => {
    Object.values(theme.type.size).forEach((s) => expect(s).toMatch(/^\d+px$/));
  });
});
