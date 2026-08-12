"use client";

/**
 * Molecule. Every reviewer as a dot on one axis, with a band across the range
 * of disagreement. Positions arrive already computed — the percentage maths
 * lives in lib/geometry, so this stays purely presentational.
 */

type Band = { left: number; width: number };

type Props = {
  positions: readonly number[];
  band: Band | null;
  ticks: readonly number[];
};

export function SpreadStrip({ positions, band, ticks }: Props) {
  return (
    <div className="strip">
      {ticks.map((t) => (
        <span key={t} className="strip-tick" data-testid="spread-tick" style={{ left: `${t}%` }} />
      ))}

      {band && (
        <span
          className="strip-band"
          data-testid="spread-band"
          style={{ left: `${band.left}%`, width: `${band.width}%` }}
        />
      )}

      {positions.map((p, i) => (
        <span key={i} className="strip-dot" data-testid="spread-dot" style={{ left: `${p}%` }} />
      ))}
    </div>
  );
}
