import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrewerResults } from "./BrewerResults";

const review = (o = {}) => ({
  id: "r1",
  who: "Tom H.",
  anonymous: false,
  ageDays: 14,
  scores: { aroma: 10, appearance: 3, flavour: 16, mouthfeel: 4, overall: 8 },
  notes: "Massive tropical hit.",
  flagged: false,
  ...o,
});

const base = {
  beer: { name: "Corbière Current", style: "21B — NEIPA", abv: "6.2%", batch: "4" },
  reviews: [review(), review({ id: "r2", who: "Priya S." }), review({ id: "r3", who: "Dave M." })],
  history: null,
  descriptors: [{ label: "Citrus", count: 3, meanIntensity: 2.7 }],
  faults: [],
  summary: null,
};

describe("BrewerResults", () => {
  it("leads with the average and its spread together", () => {
    render(<BrewerResults {...base} />);
    expect(screen.getByText("41.0")).toBeInTheDocument();
    // Spread sits beside the average, not buried further down the page.
    expect(screen.getByText("Spread")).toBeInTheDocument();
    expect(screen.getByText("Range")).toBeInTheDocument();
  });

  it("plots a dot per reviewer", () => {
    render(<BrewerResults {...base} />);
    expect(screen.getAllByTestId("spread-dot")).toHaveLength(3);
  });

  it("shows no category comparison on a first batch", () => {
    render(<BrewerResults {...base} />);
    expect(screen.queryByText(/vs history/)).not.toBeInTheDocument();
  });

  it("compares against the brewer's own history when there is some", () => {
    render(<BrewerResults {...base} history={{ aroma: 8 }} />);
    expect(screen.getByText(/\+2\.0 vs history/)).toBeInTheDocument();
  });

  it("keeps individual scoresheets readable, not just aggregates", async () => {
    render(<BrewerResults {...base} />);
    await userEvent.click(screen.getAllByRole("button", { expanded: false })[0]);
    expect(screen.getByText(/Massive tropical hit/)).toBeInTheDocument();
  });

  it("says plainly when there are too few reviews to summarise", () => {
    render(<BrewerResults {...base} reviews={[review()]} />);
    expect(screen.getByText(/one scoresheet/i)).toBeInTheDocument();
  });

  it("withholds bottle age on anonymous sheets, which would otherwise identify them", () => {
    render(<BrewerResults {...base} reviews={[review({ anonymous: true, who: null })]} />);
    expect(screen.queryByText(/14 days/)).not.toBeInTheDocument();
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });

  it("surfaces fault diagnostics when reviewers flagged something", () => {
    render(
      <BrewerResults
        {...base}
        faults={[
          {
            faultName: "Diacetyl",
            reviewerWords: ["Buttery / butterscotch"],
            flaggedBy: 2,
            outOf: 3,
            likelyCause: "Cold crashed too early.",
            suggestedFix: "Diacetyl rest.",
          },
        ]}
      />
    );
    expect(screen.getByText("Diacetyl")).toBeInTheDocument();
  });
});
