import { match, P } from "ts-pattern";
import {
  CATS,
  stepsFor,
  type BlindMode,
  type Cat,
  type Intensity,
  type Step,
  type SubmitPayload,
} from "./scoring";

/**
 * The reviewer flow as a pure reducer.
 *
 * Every branch lives here rather than in the template, so the awkward cases —
 * blind mode, the appearance gate, a reviewer who skips the guess — are
 * testable without rendering anything.
 */

export type ReviewState = {
  blind: BlindMode;
  steps: readonly Step[];
  step: Step;
  scores: Record<Cat, number>;
  notes: Partial<Record<Cat, string>>;
  descriptors: Record<string, Intensity>;
  faults: Record<string, Intensity>;
  srm: number | null;
  styleGuessId: string | null;
  trueToStyle: number | null;
  displayName: string;
  contactEmail: string;
  marketingConsent: boolean;
};

export type ReviewAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "score"; cat: Cat; value: number }
  | { type: "notes"; cat: Cat; value: string }
  | { type: "toggleDescriptor"; id: string }
  | { type: "intensity"; id: string; intensity: Intensity }
  | { type: "toggleFault"; id: string }
  | { type: "faultIntensity"; id: string; intensity: Intensity }
  | { type: "srm"; value: number }
  | { type: "guess"; styleId: string }
  | { type: "trueToStyle"; value: number }
  | { type: "contact"; field: "displayName" | "contactEmail"; value: string }
  | { type: "consent"; value: boolean };

const zeroScores = (): Record<Cat, number> =>
  CATS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<Cat, number>);

export const initialState = (blind: BlindMode): ReviewState => {
  const steps = stepsFor(blind);
  return {
    blind,
    steps,
    step: steps[0],
    // Zero, not a midpoint — defaulting to 6/12 nudges an unmotivated
    // reviewer into handing out an average score they never formed.
    scores: zeroScores(),
    notes: {},
    descriptors: {},
    faults: {},
    srm: null,
    styleGuessId: null,
    trueToStyle: null,
    displayName: "",
    contactEmail: "",
    marketingConsent: false,
  };
};

const shift = (state: ReviewState, by: number): Step => {
  const i = state.steps.indexOf(state.step);
  return state.steps[Math.min(Math.max(i + by, 0), state.steps.length - 1)];
};

/** Toggle on → noticeable; toggle again → gone. */
const toggle =
  (map: Record<string, Intensity>) =>
  (id: string): Record<string, Intensity> => {
    if (id in map) {
      const { [id]: _removed, ...rest } = map;
      return rest;
    }
    return { ...map, [id]: "noticeable" };
  };

export const reducer = (state: ReviewState, action: ReviewAction): ReviewState =>
  match(action)
    .with({ type: "next" }, () => ({ ...state, step: shift(state, 1) }))
    .with({ type: "back" }, () => ({ ...state, step: shift(state, -1) }))
    .with({ type: "score" }, ({ cat, value }) => ({
      ...state,
      scores: { ...state.scores, [cat]: value },
    }))
    .with({ type: "notes" }, ({ cat, value }) => ({
      ...state,
      notes: { ...state.notes, [cat]: value },
    }))
    .with({ type: "toggleDescriptor" }, ({ id }) => ({
      ...state,
      descriptors: toggle(state.descriptors)(id),
    }))
    .with({ type: "intensity" }, ({ id, intensity }) => ({
      ...state,
      descriptors: { ...state.descriptors, [id]: intensity },
    }))
    .with({ type: "toggleFault" }, ({ id }) => ({ ...state, faults: toggle(state.faults)(id) }))
    .with({ type: "faultIntensity" }, ({ id, intensity }) => ({
      ...state,
      faults: { ...state.faults, [id]: intensity },
    }))
    .with({ type: "srm" }, ({ value }) => ({ ...state, srm: value }))
    .with({ type: "guess" }, ({ styleId }) => ({ ...state, styleGuessId: styleId }))
    .with({ type: "trueToStyle" }, ({ value }) => ({ ...state, trueToStyle: value }))
    .with({ type: "contact" }, ({ field, value }) => ({ ...state, [field]: value }))
    .with({ type: "consent" }, ({ value }) => ({ ...state, marketingConsent: value }))
    .exhaustive();

export const isScoringStep = (step: Step): step is Cat =>
  (CATS as readonly string[]).includes(step);

/**
 * Gates. Deliberately never gate on a score itself — zero is a legitimate
 * mark, and blocking on it would force reviewers to touch a slider they
 * meant to leave alone.
 */
export const canAdvance = (state: ReviewState): boolean =>
  match(state.step)
    .with("guess", () => state.styleGuessId !== null)
    .with("appearance", () => state.srm !== null)
    .otherwise(() => true);

export const toSubmitPayload = (state: ReviewState): SubmitPayload => ({
  ...state.scores,
  trueToStyle: state.trueToStyle,
  perceivedSrm: state.srm,
  styleGuessId: state.styleGuessId,
  aromaNotes: state.notes.aroma ?? null,
  appearanceNotes: state.notes.appearance ?? null,
  flavourNotes: state.notes.flavour ?? null,
  mouthfeelNotes: state.notes.mouthfeel ?? null,
  overallNotes: state.notes.overall ?? null,
  displayName: state.displayName || null,
  contactEmail: state.contactEmail || null,
  marketingConsent: state.marketingConsent,
  descriptors: Object.entries({ ...state.descriptors, ...state.faults }).map(
    ([descriptorId, intensity]) => ({ descriptorId, intensity })
  ),
});

/** Which step index the progress ticks should fill to. */
export const progress = (state: ReviewState): number =>
  state.steps.indexOf(state.step);

export const stepLabel = (state: ReviewState): string =>
  match(state.step)
    .with("sign", () => "Send scoresheet")
    .with("reveal", () => "Start scoring")
    .with("done", () => "")
    .with(P._, () => "Next")
    .exhaustive();
