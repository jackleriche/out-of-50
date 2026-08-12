import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The reviewer must never see a fault name.
 *
 * Reviewers pick plain words — "buttery", "wet cardboard". The translation to
 * diacetyl or oxidation happens brewer-side only. Told a beer might be
 * buttery, a third of people will find butter, so naming the fault in the
 * reviewer flow corrupts the very data the app exists to collect.
 *
 * This test enforces it structurally rather than by anyone remembering.
 */

const root = join(process.cwd(), "src/components");

/** Components a reviewer's browser can load. */
const REVIEWER_FACING = [
  "organisms/ScoresheetStep.tsx",
  "organisms/DiagnosticsStep.tsx",
  "organisms/BlindGuess.tsx",
  "organisms/StyleReveal.tsx",
];

/** Columns that exist only for the brewer. */
const BREWER_ONLY_FIELDS = ["faultName", "likelyCause", "suggestedFix"];

/** Names no reviewer should ever be shown. */
const FAULT_VOCABULARY = [
  "diacetyl",
  "acetaldehyde",
  "oxidation",
  "DMS",
  "chlorophenol",
  "autolysis",
  "isovaleric",
];

const read = (rel: string) => readFileSync(join(root, rel), "utf8");

describe("reviewer-facing components leak no brewer-side data", () => {
  it.each(REVIEWER_FACING)("%s exists", (rel) => {
    expect(existsSync(join(root, rel))).toBe(true);
  });

  it.each(REVIEWER_FACING)("%s never references brewer-only fields", (rel) => {
    const source = read(rel);
    const leaked = BREWER_ONLY_FIELDS.filter((f) => source.includes(f));
    expect(leaked, `${rel} must not touch brewer-side columns`).toEqual([]);
  });

  it.each(REVIEWER_FACING)("%s renders no fault name", (rel) => {
    // Strip comments — explaining the rule is not breaking it.
    const source = read(rel).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    const leaked = FAULT_VOCABULARY.filter((w) =>
      new RegExp(`\\b${w}\\b`, "i").test(source)
    );
    expect(leaked, `${rel} would suggest the fault to the reviewer`).toEqual([]);
  });
});

describe("brewer-side components are not imported into the reviewer flow", () => {
  const brewerOnly = readdirSync(join(root, "organisms"))
    .filter((f) => f.startsWith("Fault"))
    .map((f) => f.replace(".tsx", ""));

  it("has brewer-only organisms to check", () => {
    expect(brewerOnly.length).toBeGreaterThan(0);
  });

  it.each(REVIEWER_FACING)("%s imports none of them", (rel) => {
    const source = read(rel);
    const leaked = brewerOnly.filter((c) => source.includes(c));
    expect(leaked, `${rel} pulls in a brewer-side component`).toEqual([]);
  });
});
