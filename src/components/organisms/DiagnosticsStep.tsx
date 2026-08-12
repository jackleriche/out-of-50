"use client";

import { DescriptorPicker } from "../molecules/DescriptorPicker";
import { RadioOption } from "../atoms/RadioOption";
import { theme } from "@/lib/theme";
import type { Intensity } from "@/lib/scoring";

/**
 * Organism. True-to-style and off-flavours — neither of which moves the /50.
 *
 * Reviewers see plain descriptors only. The mapping to diacetyl, oxidation
 * and the rest is brewer-side; naming a fault here would suggest it into
 * existence, since told a beer might be buttery, a third of people find butter.
 */

const TRUE_TO_STYLE = ["Way off", "Loose", "Close", "Bang on", "Textbook"] as const;

type Fault = { id: string; label: string };

type Props = {
  faults: readonly Fault[];
  selected: Readonly<Record<string, Intensity>>;
  trueToStyle: number | null;
  onToggle: (id: string) => void;
  onIntensity: (id: string, intensity: Intensity) => void;
  onTrueToStyle: (value: number) => void;
};

export function DiagnosticsStep({
  faults,
  selected,
  trueToStyle,
  onToggle,
  onIntensity,
  onTrueToStyle,
}: Props) {
  return (
    <section>
      <span className="eyebrow">Not scored</span>
      <h2 className="h2">Two last things</h2>
      <p className="blurb">
        These don&apos;t move the total. They&apos;re the bit the brewer actually acts on.
      </p>

      <h3 className="h3">How close to the style?</h3>
      <div className="tts" role="radiogroup" aria-label="How close to the style">
        {TRUE_TO_STYLE.map((label, i) => (
          <RadioOption
            key={label}
            label={label}
            selected={trueToStyle === i + 1}
            disabled={false}
            tone={theme.colour.biro}
            surface={theme.colour.sheet}
            rule={theme.colour.rule}
            grow={false}
            onSelect={() => onTrueToStyle(i + 1)}
          />
        ))}
      </div>

      <h3 className="h3">Anything odd in there?</h3>
      <p className="blurb">
        Only tick what you genuinely noticed. Blank is a perfectly good answer.
      </p>

      <DescriptorPicker
        available={faults}
        selected={selected}
        tone={theme.colour.fault}
        onToggle={onToggle}
        onIntensity={onIntensity}
      />
    </section>
  );
}
