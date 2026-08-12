"use client";

import { useReducer, useState } from "react";
import { match } from "ts-pattern";
import {
  initialState,
  reducer,
  canAdvance,
  isScoringStep,
  toSubmitPayload,
  progress,
  stepLabel,
} from "@/lib/reviewFlow";
import { total, type BlindMode, type SubmitPayload } from "@/lib/scoring";
import { ScoresheetStep } from "../organisms/ScoresheetStep";
import { DiagnosticsStep } from "../organisms/DiagnosticsStep";
import { BlindGuess } from "../organisms/BlindGuess";
import { StyleReveal } from "../organisms/StyleReveal";
import { NotesField } from "../atoms/NotesField";

/**
 * Template. Owns flow state and orchestrates organisms.
 *
 * Submission is injected rather than fetched here, so the whole flow is
 * testable without a network and the page decides how a draft is persisted.
 */

type StyleOption = { id: string; name: string };

type Props = {
  beer: { name: string; brewer: string; abv: string; style: StyleOption };
  blind: BlindMode;
  anonymous: boolean;
  styles: readonly StyleOption[];
  descriptors: readonly { id: string; label: string; category: string }[];
  faults: readonly { id: string; label: string }[];
  swatches: readonly { srm: number; hex: string }[];
  onSubmit: (payload: SubmitPayload) => Promise<void>;
};

export function ReviewerFlow({
  beer,
  blind,
  anonymous,
  styles,
  descriptors,
  faults,
  swatches,
  onSubmit,
}: Props) {
  const [state, dispatch] = useReducer(reducer, blind, initialState);
  const [sending, setSending] = useState(false);

  const revealed = blind === "off" || state.steps.indexOf(state.step) > state.steps.indexOf("reveal");
  const guessed = styles.find((s) => s.id === state.styleGuessId) ?? null;

  const send = async () => {
    setSending(true);
    await onSubmit(toSubmitPayload(state));
    dispatch({ type: "next" });
    setSending(false);
  };

  const body = () =>
    match(state.step)
      .with("guess", () => (
        <BlindGuess
          styles={styles}
          value={state.styleGuessId}
          onChange={(styleId) => dispatch({ type: "guess", styleId })}
        />
      ))
      .with("reveal", () => (
        <StyleReveal actual={beer.style} guess={guessed} abv={beer.abv} />
      ))
      .with("diagnostics", () => (
        <DiagnosticsStep
          faults={faults}
          selected={state.faults}
          trueToStyle={state.trueToStyle}
          onToggle={(id) => dispatch({ type: "toggleFault", id })}
          onIntensity={(id, intensity) => dispatch({ type: "faultIntensity", id, intensity })}
          onTrueToStyle={(value) => dispatch({ type: "trueToStyle", value })}
        />
      ))
      .with("sign", () => (
        <section>
          <h2 className="h2">Who shall we say it&apos;s from?</h2>
          <p className="blurb">
            Optional. Leave it blank and your scoresheet goes in without a name.
          </p>
          <input
            className="field"
            placeholder="Name"
            aria-label="Name"
            value={state.displayName}
            onChange={(e) =>
              dispatch({ type: "contact", field: "displayName", value: e.currentTarget.value })
            }
          />
          <input
            className="field"
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={state.contactEmail}
            onChange={(e) =>
              dispatch({ type: "contact", field: "contactEmail", value: e.currentTarget.value })
            }
          />
          <label className="consent">
            <input
              type="checkbox"
              checked={state.marketingConsent}
              onChange={(e) => dispatch({ type: "consent", value: e.currentTarget.checked })}
            />
            <span>
              Email me when the brewer replies, and about keeping my scoresheets in one
              place. Nothing else.
            </span>
          </label>
          <p className="fineprint">
            Your scores are saved either way — this box only controls email.
          </p>
        </section>
      ))
      .with("done", () => (
        <section>
          <span className="eyebrow">Sent to the brewer</span>
          <div className="total">
            <span>{total(state.scores)}</span>
            <span className="score-max">/50</span>
          </div>
          <p className="blurb">
            {Object.keys(state.faults).length > 0
              ? "What you flagged goes straight into their diagnostics — that's the useful part."
              : "Clean sheet, no faults flagged."}
          </p>
        </section>
      ))
      .when(isScoringStep, (step) => (
        <ScoresheetStep
          step={step}
          scores={state.scores}
          notes={state.notes}
          descriptors={descriptors}
          selected={state.descriptors}
          srm={state.srm}
          swatches={swatches}
          onScore={(cat, value) => dispatch({ type: "score", cat, value })}
          onNotes={(cat, value) => dispatch({ type: "notes", cat, value })}
          onToggleDescriptor={(id) => dispatch({ type: "toggleDescriptor", id })}
          onIntensity={(id, intensity) => dispatch({ type: "intensity", id, intensity })}
          onSrm={(value) => dispatch({ type: "srm", value })}
        />
      ))
      .otherwise(() => null);

  return (
    <div className="sheet">
      <header className="head">
        <div>
          <span className="eyebrow">{beer.brewer}</span>
          <h1 className="beername">{revealed ? beer.name : "Beer no. 4"}</h1>
          <span className="eyebrow">
            {revealed ? `${beer.style.id} — ${beer.style.name}` : "Style hidden"}
          </span>
        </div>
      </header>

      {/* The promise is made before they score, never after. */}
      {anonymous && (
        <p className="promise">
          This one&apos;s anonymous — the brewer sees your scores, not your name.
        </p>
      )}

      <div className="ticks" aria-hidden="true">
        {state.steps.slice(0, -1).map((s, i) => (
          <span key={s} className="tick" data-on={String(i <= progress(state))} />
        ))}
      </div>

      <main className="body">{body()}</main>

      {state.step !== "done" && (
        <footer className="foot">
          {progress(state) > 0 && (
            <button type="button" className="back" onClick={() => dispatch({ type: "back" })}>
              Back
            </button>
          )}
          <button
            type="button"
            className="btn"
            disabled={!canAdvance(state) || sending}
            onClick={() => (state.step === "sign" ? send() : dispatch({ type: "next" }))}
          >
            {stepLabel(state)}
          </button>
        </footer>
      )}
    </div>
  );
}
