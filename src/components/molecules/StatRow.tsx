"use client";

import { Bar } from "../atoms/Bar";
import { theme } from "@/lib/theme";

/**
 * Molecule. One category on the results page, shown against the brewer's own
 * history rather than against the maximum — a delta is actionable, a raw
 * fraction is not.
 */

type Props = {
  label: string;
  value: number;
  max: number;
  pct: number;
  spread: number;
  /** Null when there is no history to compare against. */
  delta: number | null;
};

const signed = (n: number): string => `${n >= 0 ? "+" : ""}${n.toFixed(1)}`;

export function StatRow({ label, value, max, pct, spread, delta }: Props) {
  return (
    <div className="cat">
      <div className="cat-top">
        <span className="cat-name">{label}</span>
        <span className="cat-val">
          {value.toFixed(1)}
          <span className="cat-max">/{max}</span>
        </span>
      </div>

      <Bar pct={pct} tone={theme.colour.biro} track={theme.colour.faint} testId="stat-fill" />

      <div className="cat-meta">
        {delta !== null && (
          <span
            className="meta"
            style={{ color: delta < 0 ? theme.colour.fault : theme.colour.muted }}
          >
            {signed(delta)} vs history
          </span>
        )}
        <span className="meta">±{spread.toFixed(1)} spread</span>
      </div>
    </div>
  );
}
