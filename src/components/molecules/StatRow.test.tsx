import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatRow } from "./StatRow";

describe("StatRow", () => {
  const base = { label: "Flavour", value: 14.7, max: 20, pct: 73.5, spread: 2.1 };

  it("shows the value against its maximum", () => {
    render(<StatRow {...base} delta={null} />);
    expect(screen.getByText("14.7")).toBeInTheDocument();
    expect(screen.getByText("/20")).toBeInTheDocument();
  });

  it("renders the bar at the percentage it was handed", () => {
    render(<StatRow {...base} delta={null} />);
    expect(screen.getByTestId("stat-fill")).toHaveStyle({ width: "73.5%" });
  });

  it("omits the comparison entirely when there is no history", () => {
    render(<StatRow {...base} delta={null} />);
    expect(screen.queryByText(/vs history/)).not.toBeInTheDocument();
  });

  it("signs a positive delta so an improvement reads as one", () => {
    render(<StatRow {...base} delta={0.8} />);
    expect(screen.getByText(/\+0\.8 vs history/)).toBeInTheDocument();
  });

  it("shows a decline without a plus sign", () => {
    render(<StatRow {...base} delta={-1.2} />);
    expect(screen.getByText(/-1\.2 vs history/)).toBeInTheDocument();
  });

  it("reports how much the reviewers disagreed", () => {
    render(<StatRow {...base} delta={null} />);
    expect(screen.getByText(/±2\.1/)).toBeInTheDocument();
  });
});
