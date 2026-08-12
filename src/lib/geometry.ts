/**
 * Pure positioning maths. Molecules receive percentages; they never compute
 * them. Curried so a component partially applies the scale once and maps.
 */

const clamp = (lo: number, hi: number) => (n: number): number => Math.min(Math.max(n, lo), hi);

const toPercent = clamp(0, 100);

/** positionOnScale(0, 50)(38) → 76 */
export const positionOnScale =
  (min: number, max: number) =>
  (value: number): number =>
    max === min ? 0 : toPercent(((value - min) / (max - min)) * 100);

export const positionsFor =
  (min: number, max: number) =>
  (values: readonly number[]): number[] =>
    values.map(positionOnScale(min, max));

export type Band = { left: number; width: number };

/** The span from worst to best score — the shape of the disagreement. */
export const bandFor =
  (min: number, max: number) =>
  (values: readonly number[]): Band | null => {
    if (values.length === 0) return null;
    const at = positionOnScale(min, max);
    const left = at(Math.min(...values));
    return { left, width: at(Math.max(...values)) - left };
  };
