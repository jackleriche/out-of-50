"use client";

import { useState } from "react";
import { SpreadStrip } from "../molecules/SpreadStrip";
import { StatRow } from "../molecules/StatRow";
import { SheetCard } from "../molecules/SheetCard";
import { FaultDiagnostic } from "../organisms/FaultDiagnostic";
import { positionsFor, bandFor } from "@/lib/geometry";
import { CATS, LABEL, MAX, categoryStats, mean, spread, total, type Cat } from "@/lib/scoring";
import { SUMMARY_MIN_REVIEWS } from "@/lib/summarise";

/**
 * Template. The brewer's results page.
 *
 * The average is the least interesting number here — spread, category deltas
 * against their own history, and descriptor agreement are what a brewer can
 * act on. Individual sheets stay readable: with five reviewers, aggregation
 * buries the one honest critic, and he is the one worth reading.
 */

type ReviewRow = {
  id: string;
  who: string | null;
  anonymous: boolean;
  ageDays: number | null;
  scores: Record<Cat, number>;
  notes: string | null;
  flagged: boolean;
};

type FaultRow = {
  faultName: string;
  reviewerWords: string[];
  flaggedBy: number;
  outOf: number;
  likelyCause: string;
  suggestedFix: string;
};

type Props = {
  beer: { name: string; style: string; abv: string; batch: string };
  reviews: readonly ReviewRow[];
  history: Partial<Record<Cat, number>> | null;
  descriptors: readonly { label: string; count: number; meanIntensity: number }[];
  faults: readonly FaultRow[];
  summary: string | null;
};

const TICKS = [0, 20, 40, 60, 80, 100];

export function BrewerResults({ beer, reviews, history, descriptors, faults, summary }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const totals = reviews.map((r) => total(r.scores));
  const sheets = reviews.map((r) => r.scores);
  const onScale = positionsFor(0, 50);

  return (
    <div className="sheet sheet--wide">
      <header className="head">
        <span className="eyebrow">Batch {beer.batch}</span>
        <h1 className="h1">{beer.name}</h1>
        <p className="sub">
          {beer.style} · {beer.abv} · {reviews.length}{" "}
          {reviews.length === 1 ? "scoresheet" : "scoresheets"} in
        </p>
      </header>

      <section>
        <h2 className="sec-title">Score</h2>
        <div className="headline">
          <span className="big">
            {mean(totals).toFixed(1)}
            <span className="big-max">/50</span>
          </span>
          <div>
            <span className="eyebrow">Spread</span>
            <p className="cat-val">±{spread(totals).toFixed(1)}</p>
          </div>
          <div>
            <span className="eyebrow">Range</span>
            <p className="cat-val">
              {Math.min(...totals)}–{Math.max(...totals)}
            </p>
          </div>
        </div>

        <SpreadStrip positions={onScale(totals)} band={bandFor(0, 50)(totals)} ticks={TICKS} />

        {reviews.length < SUMMARY_MIN_REVIEWS && (
          <p className="caveat">
            {reviews.length === 1 ? "Just one scoresheet" : `${reviews.length} scoresheets`} so far.
            One palate is a data point, not a verdict — wait for a few more before reading
            much into it.
          </p>
        )}
      </section>

      <section>
        <h2 className="sec-title">
          By category{history ? " · vs your previous batches" : ""}
        </h2>
        {CATS.map((c) => {
          const s = categoryStats(c, sheets, history);
          return (
            <StatRow
              key={c}
              label={LABEL[c]}
              value={s.mean}
              max={MAX[c]}
              pct={s.pct}
              spread={s.spread}
              delta={s.delta}
            />
          );
        })}
      </section>

      {faults.length > 0 && (
        <section>
          <h2 className="sec-title">Diagnostics · not scored</h2>
          {faults.map((f) => (
            <FaultDiagnostic key={f.faultName} {...f} />
          ))}
          <p className="caveat">
            Reviewers never saw these names — they picked plain words. Several people
            flagging the same thing independently is a real signal; one is noise.
          </p>
        </section>
      )}

      <section>
        <h2 className="sec-title">What they tasted</h2>
        {descriptors.map((d) => (
          <div className="desc-row" key={d.label}>
            <span className="desc-count">
              {d.count}/{reviews.length}
            </span>
            <span className="desc-name">{d.label}</span>
          </div>
        ))}
      </section>

      {summary && (
        <section>
          <h2 className="sec-title">Summary</h2>
          <div className="summary">
            {summary.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="sec-title">Scoresheets</h2>
        {reviews.map((r) => (
          <SheetCard
            key={r.id}
            who={r.anonymous ? "Anonymous" : (r.who ?? "Unnamed")}
            total={total(r.scores)}
            /* Age is withheld on anonymous sheets — "21 days" narrows it to
               whoever took a bottle three weeks ago. */
            meta={
              r.anonymous || r.ageDays === null
                ? "bottle age withheld"
                : `${r.ageDays} days old`
            }
            flagged={r.flagged}
            open={open === r.id}
            breakdown={CATS.map((c) => ({ label: LABEL[c], value: r.scores[c], max: MAX[c] }))}
            notes={r.notes}
            onToggle={() => setOpen(open === r.id ? null : r.id)}
          />
        ))}
      </section>
    </div>
  );
}
