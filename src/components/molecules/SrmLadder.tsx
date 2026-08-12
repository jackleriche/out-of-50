"use client";

import { Swatch } from "../atoms/Swatch";

/**
 * Molecule. The reviewer taps the colour they actually see, which the brewer
 * later compares against the recipe's calculated SRM.
 */

type SwatchSpec = { srm: number; hex: string };

type Props = {
  swatches: readonly SwatchSpec[];
  value: number | null;
  onChange: (srm: number) => void;
};

export function SrmLadder({ swatches, value, onChange }: Props) {
  return (
    <div className="srm" role="radiogroup" aria-label="Colour in the glass">
      {swatches.map((s) => (
        <Swatch
          key={s.srm}
          hex={s.hex}
          caption={String(s.srm)}
          name={`SRM ${s.srm}`}
          selected={value === s.srm}
          onSelect={() => onChange(s.srm)}
        />
      ))}
    </div>
  );
}
