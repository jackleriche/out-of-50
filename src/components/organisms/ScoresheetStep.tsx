"use client";

import { CategoryBlock } from "../molecules/CategoryBlock";
import { DescriptorPicker } from "../molecules/DescriptorPicker";
import { SrmLadder } from "../molecules/SrmLadder";
import {
  MAX,
  LABEL,
  BLURB,
  ANCHORS,
  takesDescriptors,
  type Cat,
  type Intensity,
} from "@/lib/scoring";

/**
 * Organism — the first layer allowed domain knowledge.
 *
 * It knows the BJCP maxima, which categories take descriptors, and that
 * appearance gets a colour ladder. It still fetches nothing; the page hands
 * it every value and receives every event back.
 */

type Descriptor = { id: string; label: string; category: string };
type SwatchSpec = { srm: number; hex: string };

type Props = {
  step: Cat;
  scores: Record<Cat, number>;
  notes: Partial<Record<Cat, string>>;
  descriptors: readonly Descriptor[];
  selected: Readonly<Record<string, Intensity>>;
  srm: number | null;
  swatches: readonly SwatchSpec[];
  onScore: (cat: Cat, score: number) => void;
  onNotes: (cat: Cat, notes: string) => void;
  onToggleDescriptor: (id: string) => void;
  onIntensity: (id: string, intensity: Intensity) => void;
  onSrm: (srm: number) => void;
};

export function ScoresheetStep({
  step,
  scores,
  notes,
  descriptors,
  selected,
  srm,
  swatches,
  onScore,
  onNotes,
  onToggleDescriptor,
  onIntensity,
  onSrm,
}: Props) {
  const forThisStep = descriptors.filter((d) => d.category === step);

  return (
    <CategoryBlock
      title={LABEL[step]}
      blurb={BLURB[step]}
      score={scores[step]}
      max={MAX[step]}
      notes={notes[step] ?? ""}
      anchors={ANCHORS[step]}
      onScore={(v) => onScore(step, v)}
      onNotes={(v) => onNotes(step, v)}
    >
      {step === "appearance" && (
        <SrmLadder swatches={swatches} value={srm} onChange={onSrm} />
      )}

      {takesDescriptors(step) && forThisStep.length > 0 && (
        <DescriptorPicker
          available={forThisStep}
          selected={selected}
          onToggle={onToggleDescriptor}
          onIntensity={onIntensity}
        />
      )}
    </CategoryBlock>
  );
}
