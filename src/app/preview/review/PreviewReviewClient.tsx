"use client";

import { ReviewerFlow } from "@/components/templates/ReviewerFlow";
import {
  DEMO_BEER, DEMO_STYLES, DEMO_DESCRIPTORS, DEMO_FAULTS, SRM_LADDER,
} from "@/fixtures/demo";
import type { SubmitPayload } from "@/lib/scoring";

export function PreviewReviewClient({ blind, anonymous }: { blind: boolean; anonymous: boolean }) {
  /** Submission is a no-op here — the point is to look at the flow. */
  const submit = async (payload: SubmitPayload) => {
    // eslint-disable-next-line no-console
    console.log("Would submit:", payload);
  };

  return (
    <ReviewerFlow
      beer={DEMO_BEER}
      blind={blind ? "guess_then_reveal" : "off"}
      anonymous={anonymous}
      styles={DEMO_STYLES}
      descriptors={DEMO_DESCRIPTORS}
      faults={DEMO_FAULTS}
      swatches={SRM_LADDER}
      onSubmit={submit}
    />
  );
}
