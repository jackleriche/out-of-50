import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpreadStrip } from "./SpreadStrip";

/**
 * Receives positions already computed. It must not know that BJCP tops out
 * at 50 — that maths lives in lib/geometry.
 */
describe("SpreadStrip", () => {
  it("plots a dot per reviewer", () => {
    render(<SpreadStrip positions={[60, 76, 88]} band={{ left: 60, width: 28 }} ticks={[]} />);
    expect(screen.getAllByTestId("spread-dot")).toHaveLength(3);
  });

  it("places each dot where it was told", () => {
    render(<SpreadStrip positions={[60]} band={null} ticks={[]} />);
    expect(screen.getByTestId("spread-dot")).toHaveStyle({ left: "60%" });
  });

  it("draws the band across the range of disagreement", () => {
    render(<SpreadStrip positions={[60, 88]} band={{ left: 60, width: 28 }} ticks={[]} />);
    expect(screen.getByTestId("spread-band")).toHaveStyle({ left: "60%", width: "28%" });
  });

  it("draws no band when there is nothing to span", () => {
    render(<SpreadStrip positions={[]} band={null} ticks={[]} />);
    expect(screen.queryByTestId("spread-band")).not.toBeInTheDocument();
  });

  it("renders the axis ticks it was given", () => {
    render(<SpreadStrip positions={[]} band={null} ticks={[0, 50, 100]} />);
    expect(screen.getAllByTestId("spread-tick")).toHaveLength(3);
  });
});
