"use client";

/**
 * Atom — purely presentational.
 *
 * Knows nothing about descriptors, faults or BJCP. It is handed a list of
 * levels, told which is selected, and reports clicks. Fill is cumulative:
 * selecting the second level fills the first two.
 */

type Props<L extends string> = {
  levels: readonly L[];
  value: L | null;
  label: string;
  /** A theme colour, chosen by the parent — the atom has no default of its own. */
  tone: string;
  onChange: (level: L) => void;
};

const filledUpTo =
  <L extends string>(levels: readonly L[], value: L | null) =>
  (index: number): boolean =>
    value !== null && levels.indexOf(value) >= index;

export function IntensitySegments<L extends string>({
  levels,
  value,
  label,
  tone,
  onChange,
}: Props<L>) {
  const isFilled = filledUpTo(levels, value);

  return (
    <span className="inline-flex gap-0.75" role="group" aria-label={label}>
      {levels.map((level, i) => {
        const filled = isFilled(i);
        return (
          <button
            key={level}
            type="button"
            className="h-3.75 w-5 cursor-pointer rounded-sharp border border-rule p-0 transition-colors"
            data-filled={String(filled)}
            aria-pressed={value === level}
            aria-label={`${label}: ${level}`}
            onClick={() => onChange(level)}
            style={{ backgroundColor: filled ? tone : "transparent" }}
          />
        );
      })}
    </span>
  );
}
