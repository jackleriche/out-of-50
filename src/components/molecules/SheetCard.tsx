"use client";

/**
 * Molecule. One reviewer's scoresheet, collapsed to a total until opened.
 *
 * Open state is lifted — the results page decides which card is expanded, so
 * this holds no state of its own.
 */

type Line = { label: string; value: number; max: number };

type Props = {
  who: string;
  total: number;
  meta: string;
  flagged: boolean;
  open: boolean;
  breakdown: readonly Line[];
  notes: string | null;
  onToggle: () => void;
};

export function SheetCard({
  who,
  total,
  meta,
  flagged,
  open,
  breakdown,
  notes,
  onToggle,
}: Props) {
  return (
    <div className="sheetcard">
      <button type="button" className="sc-top" aria-expanded={open} onClick={onToggle}>
        <span>
          <span className="sc-who">{who}</span>
          <span className="sc-meta">
            {meta}
            {flagged && <span className="flag"> · flagged</span>}
          </span>
        </span>
        <span className="sc-total">{total}</span>
      </button>

      {open && (
        <div className="sc-body">
          <div className="sc-grid">
            {breakdown.map((l) => (
              <span className="sc-cell" key={l.label}>
                <span className="eyebrow">{l.label}</span>
                {l.value}/{l.max}
              </span>
            ))}
          </div>
          <p className="sc-note">{notes ? `“${notes}”` : "No notes left."}</p>
        </div>
      )}
    </div>
  );
}
