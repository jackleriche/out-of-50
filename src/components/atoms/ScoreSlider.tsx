"use client";

/**
 * Atom — purely presentational.
 *
 * Takes its maximum as a prop. It must never import MAX or know that Aroma
 * is out of 12; the organism composing it holds that knowledge.
 */

type Props = {
  label: string;
  value: number;
  max: number;
  anchors?: readonly [string, string];
  onChange: (value: number) => void;
};

export function ScoreSlider({ label, value, max, anchors, onChange }: Props) {
  return (
    <div className="mb-4 border-t border-rule pt-4">
      <div className="flex items-baseline justify-between">
        <span className="block font-mono text-micro tracking-eyebrow text-muted uppercase">{label}</span>
        <div className="font-mono text-display font-medium tracking-[-0.03em] text-biro">
          <span>{value}</span>
          <span className="text-lead text-muted">/{max}</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        className="mt-2 mb-1 w-full accent-biro"
        aria-label={`${label} score out of ${max}`}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />

      {anchors && (
        <div className="flex justify-between font-mono text-micro tracking-[0.1em] text-muted uppercase">
          <span>{anchors[0]}</span>
          <span>{anchors[1]}</span>
        </div>
      )}
    </div>
  );
}
