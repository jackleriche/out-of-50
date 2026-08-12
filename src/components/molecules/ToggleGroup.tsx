"use client";

import { RadioOption } from "../atoms/RadioOption";
import { theme } from "@/lib/theme";

/**
 * Molecule. A two-or-more option switch that can be locked — used for the
 * share link settings, where anonymity and blind mode become immutable once
 * the link exists.
 */

type Option<V extends string> = { value: V; label: string };

type Props<V extends string> = {
  options: readonly Option<V>[];
  value: V;
  name: string;
  locked?: boolean;
  onChange: (value: V) => void;
};

export function ToggleGroup<V extends string>({
  options,
  value,
  name,
  locked = false,
  onChange,
}: Props<V>) {
  return (
    <div className="toggle" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <RadioOption
          key={o.value}
          label={o.label}
          selected={value === o.value}
          disabled={locked}
          tone={theme.colour.biro}
          surface={theme.colour.sheet}
          rule={theme.colour.rule}
          onSelect={() => onChange(o.value)}
        />
      ))}
    </div>
  );
}
