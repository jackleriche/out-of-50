"use client";

/** Atom — one option in a segmented control. */

type Props = {
  label: string;
  selected: boolean;
  disabled: boolean;
  tone: string;
  surface: string;
  rule: string;
  /** Text alignment within the button — "left" for a vertical stack, "center" for a row. */
  align?: "left" | "center";
  /** Whether the button grows to share available space (a row) or sizes to its content (a wrap). */
  grow?: boolean;
  onSelect: () => void;
};

export function RadioOption({
  label,
  selected,
  disabled,
  tone,
  surface,
  rule,
  align = "center",
  grow = true,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      disabled={disabled}
      className={`cursor-pointer rounded-sharp border bg-transparent px-2 py-3 font-sans text-body disabled:cursor-default disabled:text-muted ${
        grow ? "flex-1" : "flex-none"
      } ${align === "left" ? "text-left" : "text-center"}`}
      onClick={onSelect}
      style={{
        backgroundColor: selected ? tone : "transparent",
        color: selected ? surface : "inherit",
        borderColor: rule,
      }}
    >
      {label}
    </button>
  );
}
