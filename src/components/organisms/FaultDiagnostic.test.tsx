import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FaultDiagnostic } from "./FaultDiagnostic";

/**
 * Organism. Brewer-side only. The fault name, cause and fix must never be
 * rendered anywhere a reviewer can reach.
 */

const base = {
  faultName: "Diacetyl",
  reviewerWords: ["Buttery / butterscotch"],
  flaggedBy: 3,
  outOf: 6,
  likelyCause: "Yeast pulled off the beer before it reabsorbed its diacetyl.",
  suggestedFix: "Hold at 20-22C for 48h at terminal gravity before crashing.",
};

describe("FaultDiagnostic", () => {
  it("names the fault for the brewer", () => {
    render(<FaultDiagnostic {...base} />);
    expect(screen.getByText("Diacetyl")).toBeInTheDocument();
  });

  it("shows the plain words reviewers actually used", () => {
    render(<FaultDiagnostic {...base} />);
    expect(screen.getByText(/buttery \/ butterscotch/i)).toBeInTheDocument();
  });

  it("reports how many reviewers agreed, since agreement is the signal", () => {
    render(<FaultDiagnostic {...base} />);
    expect(screen.getByText(/3 of 6/)).toBeInTheDocument();
  });

  it("gives the cause and the fix", () => {
    render(<FaultDiagnostic {...base} />);
    expect(screen.getByText(/reabsorbed its diacetyl/)).toBeInTheDocument();
    expect(screen.getByText(/terminal gravity/)).toBeInTheDocument();
  });

  it("marks a single flag as weak evidence rather than a diagnosis", () => {
    render(<FaultDiagnostic {...base} flaggedBy={1} />);
    expect(screen.getByText(/one reviewer/i)).toBeInTheDocument();
  });

  it("does not hedge once several reviewers agree independently", () => {
    render(<FaultDiagnostic {...base} flaggedBy={4} />);
    expect(screen.queryByText(/one reviewer/i)).not.toBeInTheDocument();
  });
});
