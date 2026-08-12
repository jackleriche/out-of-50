import { describe, it, expect } from "vitest";
import { nextNudgeDue, NUDGE_SCHEDULE } from "./nudges";

/** 24 hours, 48 hours, one week — then stop. */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000);

describe("nextNudgeDue", () => {
  it("sends nothing in the first day", () => {
    expect(nextNudgeDue({ sentAt: hoursAgo(3), reminderCount: 0, submittedAt: null })).toBe(false);
  });

  it("sends the first nudge after a day", () => {
    expect(nextNudgeDue({ sentAt: hoursAgo(25), reminderCount: 0, submittedAt: null })).toBe(true);
  });

  it("does not send the second nudge early", () => {
    expect(nextNudgeDue({ sentAt: hoursAgo(30), reminderCount: 1, submittedAt: null })).toBe(false);
  });

  it("sends the last nudge after a week", () => {
    expect(nextNudgeDue({ sentAt: hoursAgo(24 * 8), reminderCount: 2, submittedAt: null })).toBe(true);
  });

  it("stops nagging after the schedule is exhausted", () => {
    expect(
      nextNudgeDue({ sentAt: hoursAgo(24 * 60), reminderCount: 3, submittedAt: null })
    ).toBe(false);
  });

  it("stops the moment someone submits", () => {
    expect(
      nextNudgeDue({ sentAt: hoursAgo(24 * 8), reminderCount: 0, submittedAt: new Date() })
    ).toBe(false);
  });

  it("sends nothing for an invite that was never emailed", () => {
    expect(nextNudgeDue({ sentAt: null, reminderCount: 0, submittedAt: null })).toBe(false);
  });

  it("has exactly three steps", () => {
    expect(NUDGE_SCHEDULE).toEqual([24, 48, 168]);
  });
});
