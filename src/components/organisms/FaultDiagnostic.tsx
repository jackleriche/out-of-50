"use client";

import { theme } from "@/lib/theme";

/**
 * Organism — BREWER SIDE ONLY.
 *
 * The fault name, likely cause and suggested fix come from columns the
 * reviewer endpoint must never select. Reviewers pick plain words; the
 * translation to "diacetyl" happens here and nowhere else.
 */

type Props = {
  faultName: string;
  reviewerWords: readonly string[];
  flaggedBy: number;
  outOf: number;
  likelyCause: string;
  suggestedFix: string;
};

export function FaultDiagnostic({
  faultName,
  reviewerWords,
  flaggedBy,
  outOf,
  likelyCause,
  suggestedFix,
}: Props) {
  /** One flag is a palate; several independent flags is a diagnosis. */
  const isolated = flaggedBy === 1;

  return (
    <article className="fault" style={{ borderColor: theme.colour.fault }}>
      <header className="fault-top">
        <h3 className="fault-name" style={{ color: theme.colour.fault }}>
          {faultName}
        </h3>
        <span className="sc-meta">
          {flaggedBy} of {outOf} reviewers
        </span>
      </header>

      <p className="fault-said">
        They described it as: {reviewerWords.join(", ").toLowerCase()}
      </p>

      {isolated && (
        <p className="fault-hedge">
          Only one reviewer noticed this, so treat it as a lead rather than a finding —
          it could as easily be their bottle or their palate.
        </p>
      )}

      <h4 className="fault-h">Likely cause</h4>
      <p className="fault-p">{likelyCause}</p>

      <h4 className="fault-h">What to change</h4>
      <p className="fault-p">{suggestedFix}</p>
    </article>
  );
}
