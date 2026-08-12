"use client";

import { RadioOption } from "../atoms/RadioOption";
import { theme } from "@/lib/theme";

/**
 * Organism. The blind round — the reviewer names the style before it is
 * revealed. This is the actual blind signal; hiding the style without asking
 * for a guess just produces an unanchored score.
 */

type StyleOption = { id: string; name: string };

type Props = {
  styles: readonly StyleOption[];
  value: string | null;
  onChange: (id: string) => void;
};

export function BlindGuess({ styles, value, onChange }: Props) {
  return (
    <section>
      <span className="eyebrow">Blind round</span>
      <h2 className="h2">What do you think this is?</h2>
      <p className="blurb">
        Have a look, a smell and a sip. Pick the closest style — you&apos;ll find out how
        you did in a second.
      </p>

      <div className="stack" role="radiogroup" aria-label="Style guess">
        {styles.map((s) => (
          <RadioOption
            key={s.id}
            label={`${s.id} — ${s.name}`}
            selected={value === s.id}
            disabled={false}
            tone={theme.colour.biroWash}
            surface={theme.colour.ink}
            rule={theme.colour.rule}
            align="left"
            onSelect={() => onChange(s.id)}
          />
        ))}
      </div>
    </section>
  );
}
