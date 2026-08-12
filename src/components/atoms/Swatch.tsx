"use client";

/** Atom — one colour in a ladder. It does not know what SRM means. */

type Props = {
  hex: string;
  caption: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
};

export function Swatch({ hex, caption, name, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      className={`aspect-square cursor-pointer rounded-sharp border-0 font-mono text-small text-ink ${
        selected ? "outline-thick outline-ink outline-offset-2" : ""
      }`}
      onClick={onSelect}
      style={{ backgroundColor: hex }}
    >
      <span aria-hidden="true">{caption}</span>
    </button>
  );
}
