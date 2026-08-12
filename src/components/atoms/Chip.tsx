"use client";

/** Atom — a pressable label. Knows nothing of descriptors or faults. */

type Props = {
  label: string;
  pressed: boolean;
  tone: string;
  surface: string;
  rule: string;
  onClick: () => void;
};

export function Chip({ label, pressed, tone, surface, rule, onClick }: Props) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-sharp border bg-transparent px-3 py-2 font-mono text-small transition-colors"
      aria-pressed={pressed}
      onClick={onClick}
      style={{
        borderColor: pressed ? tone : rule,
        backgroundColor: pressed ? tone : "transparent",
        color: pressed ? surface : "inherit",
      }}
    >
      {label}
    </button>
  );
}
