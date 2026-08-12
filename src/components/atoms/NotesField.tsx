"use client";

/** Atom — a plain multiline input. */

type Props = {
  value: string;
  placeholder: string;
  rows?: number;
  ariaLabel: string;
  onChange: (value: string) => void;
};

export function NotesField({ value, placeholder, rows = 3, ariaLabel, onChange }: Props) {
  return (
    <textarea
      className="mb-3 w-full rounded-sharp border border-rule bg-transparent p-3 font-sans text-body text-ink focus:outline-2 focus:outline-biro focus:outline-offset-1"
      rows={rows}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
