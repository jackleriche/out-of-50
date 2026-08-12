import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlindGuess } from "./BlindGuess";
import { StyleReveal } from "./StyleReveal";

const styles = [
  { id: "21A", name: "American IPA" },
  { id: "21B", name: "Specialty IPA: New England IPA" },
];

describe("BlindGuess", () => {
  it("offers every candidate style", () => {
    render(<BlindGuess styles={styles} value={null} onChange={vi.fn()} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("lifts the guess by id", async () => {
    const onChange = vi.fn();
    render(<BlindGuess styles={styles} value={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: /New England/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("21B");
  });

  it("never shows the real answer", () => {
    render(<BlindGuess styles={styles} value={null} onChange={vi.fn()} />);
    expect(screen.queryByText(/correct|actual|target/i)).not.toBeInTheDocument();
  });
});

describe("StyleReveal", () => {
  const base = { actual: { id: "21B", name: "Specialty IPA: New England IPA" }, abv: "6.2%" };

  it("congratulates a correct guess", () => {
    render(<StyleReveal {...base} guess={{ id: "21B", name: "NEIPA" }} />);
    expect(screen.getByText(/spot on/i)).toBeInTheDocument();
  });

  it("says so plainly when the guess was wrong", () => {
    render(<StyleReveal {...base} guess={{ id: "21A", name: "American IPA" }} />);
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
  });

  it("always reveals the real style, right or wrong", () => {
    render(<StyleReveal {...base} guess={{ id: "21A", name: "American IPA" }} />);
    expect(screen.getByText(/Specialty IPA: New England IPA/)).toBeInTheDocument();
  });

  it("tells the reviewer to score against the style, not their own taste", () => {
    render(<StyleReveal {...base} guess={null} />);
    expect(screen.getByText(/not against what you like/i)).toBeInTheDocument();
  });

  it("handles a reviewer who skipped the guess", () => {
    render(<StyleReveal {...base} guess={null} />);
    expect(screen.getByText(/not quite/i)).toBeInTheDocument();
  });
});
