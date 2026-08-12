"use client";

import { IntensitySegments } from "../atoms/IntensitySegments";
import { INTENSITIES, type Intensity } from "@/lib/scoring";
import { theme } from "@/lib/theme";

/**
 * Molecule — composes atoms, lifts every event, holds no state.
 * Whether this descriptor is a character note or a fault is the parent's
 * business; this only renders what it is handed.
 */

type Props = {
  label: string;
  intensity: Intensity | null;
  /** Defaults to the scoring pen; faults are handed theme.colour.fault. */
  tone?: string;
  onSelect: (intensity: Intensity) => void;
  onRemove: () => void;
};

export function DescriptorRow({
  label,
  intensity,
  tone = theme.colour.biro,
  onSelect,
  onRemove,
}: Props) {
  return (
    <div className="int-row">
      <span className="int-label">{label}</span>
      <div className="int-right">
        <IntensitySegments
          levels={INTENSITIES}
          value={intensity}
          label={label}
          tone={tone}
          onChange={onSelect}
        />
        <button type="button" className="row-x" aria-label={`Remove ${label}`} onClick={onRemove}>
          ×
        </button>
      </div>
    </div>
  );
}
