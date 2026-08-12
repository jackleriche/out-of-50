"use client";

import { Chip } from "../atoms/Chip";
import { DescriptorRow } from "./DescriptorRow";
import { theme } from "@/lib/theme";
import type { Intensity } from "@/lib/scoring";

/**
 * Molecule. Chips to choose from, then an intensity row per choice.
 *
 * Works identically for character notes and for faults — only the tone
 * differs, and that is the parent's decision. The reviewer never sees a fault
 * name; that mapping is brewer-side only.
 */

type Descriptor = { id: string; label: string };

type Props = {
  available: readonly Descriptor[];
  selected: Readonly<Record<string, Intensity>>;
  tone?: string;
  onToggle: (id: string) => void;
  onIntensity: (id: string, intensity: Intensity) => void;
};

export function DescriptorPicker({
  available,
  selected,
  tone = theme.colour.biro,
  onToggle,
  onIntensity,
}: Props) {
  const chosen = available.filter((d) => d.id in selected);

  return (
    <>
      <div className="chips">
        {available.map((d) => (
          <Chip
            key={d.id}
            label={d.label}
            pressed={d.id in selected}
            tone={tone}
            surface={theme.colour.sheet}
            rule={theme.colour.rule}
            onClick={() => onToggle(d.id)}
          />
        ))}
      </div>

      {chosen.length > 0 && (
        <div className="intensities">
          {chosen.map((d) => (
            <DescriptorRow
              key={d.id}
              label={d.label}
              intensity={selected[d.id]}
              tone={tone}
              onSelect={(i) => onIntensity(d.id, i)}
              onRemove={() => onToggle(d.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
