import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DiagnosticsStep } from "./DiagnosticsStep";

const faults = [
  { id: "f1", label: "Buttery / butterscotch" },
  { id: "f2", label: "Wet cardboard" },
];

const base = {
  faults,
  selected: {},
  trueToStyle: null,
  onToggle: vi.fn(),
  onIntensity: vi.fn(),
  onTrueToStyle: vi.fn(),
};

describe("DiagnosticsStep", () => {
  it("states plainly that none of this is scored", () => {
    render(<DiagnosticsStep {...base} />);
    expect(screen.getByText(/not scored/i)).toBeInTheDocument();
  });

  it("never shows a fault name, only the plain words", () => {
    render(<DiagnosticsStep {...base} />);
    expect(screen.queryByText(/diacetyl|oxidation|acetaldehyde/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buttery / butterscotch" })).toBeInTheDocument();
  });

  it("tells the reviewer that flagging nothing is a valid answer", () => {
    render(<DiagnosticsStep {...base} />);
    expect(screen.getByText(/blank is a perfectly good answer/i)).toBeInTheDocument();
  });

  it("offers a true-to-style judgement", async () => {
    const onTrueToStyle = vi.fn();
    render(<DiagnosticsStep {...base} onTrueToStyle={onTrueToStyle} />);
    await userEvent.click(screen.getByRole("radio", { name: "Bang on" }));
    expect(onTrueToStyle).toHaveBeenCalledExactlyOnceWith(4);
  });

  it("lifts a flagged fault by id", async () => {
    const onToggle = vi.fn();
    render(<DiagnosticsStep {...base} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: "Wet cardboard" }));
    expect(onToggle).toHaveBeenCalledExactlyOnceWith("f2");
  });
});
