"use client";

import { match, P } from "ts-pattern";
import { theme } from "@/lib/theme";

/**
 * Organism. Reveals the target style, then reframes the task: from here the
 * reviewer scores against the style, not against their own preference.
 */

type StyleOption = { id: string; name: string };

type Props = {
  actual: StyleOption;
  guess: StyleOption | null;
  abv: string;
};

const verdict = (actual: StyleOption, guess: StyleOption | null) =>
  match(guess)
    .with(null, () => ({ headline: "Not quite", right: false, said: "nothing" }))
    .with({ id: actual.id }, (g) => ({ headline: "Spot on", right: true, said: g.name }))
    .otherwise((g) => ({ headline: "Not quite", right: false, said: g.name }));

export function StyleReveal({ actual, guess, abv }: Props) {
  const { headline, right, said } = verdict(actual, guess);

  return (
    <section>
      <span className="eyebrow" style={{ color: right ? theme.colour.biro : theme.colour.fault }}>
        {headline}
      </span>
      <h2 className="h2">It&apos;s a {actual.name}</h2>
      <p className="blurb">
        You guessed {said}. From here, score it against this style — not against what
        you like.
      </p>

      <dl className="vitals">
        <div>
          <dt className="eyebrow">Style</dt>
          <dd>{actual.id}</dd>
        </div>
        <div>
          <dt className="eyebrow">ABV</dt>
          <dd>{abv}</dd>
        </div>
      </dl>
    </section>
  );
}
