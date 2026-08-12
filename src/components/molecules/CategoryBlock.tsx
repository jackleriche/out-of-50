"use client";

import type { ReactNode } from "react";
import { ScoreSlider } from "../atoms/ScoreSlider";
import { NotesField } from "../atoms/NotesField";

/**
 * Molecule. One scoring category: heading, blurb, whatever picker is composed
 * into it, the slider, and optional notes.
 *
 * The maximum arrives as a prop — this does not know that Aroma is out of 12.
 */

type Props = {
  title: string;
  blurb: string;
  score: number;
  max: number;
  notes: string;
  anchors?: readonly [string, string];
  children?: ReactNode;
  onScore: (score: number) => void;
  onNotes: (notes: string) => void;
};

export function CategoryBlock({
  title,
  blurb,
  score,
  max,
  notes,
  anchors,
  children,
  onScore,
  onNotes,
}: Props) {
  return (
    <section>
      <h2 className="h2">{title}</h2>
      <p className="blurb">{blurb}</p>

      {children}

      <ScoreSlider label={title} value={score} max={max} anchors={anchors} onChange={onScore} />

      <NotesField
        value={notes}
        rows={3}
        ariaLabel={`${title} notes`}
        placeholder="Notes (optional)"
        onChange={onNotes}
      />
    </section>
  );
}
