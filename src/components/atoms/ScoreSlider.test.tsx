import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScoreSlider } from "./ScoreSlider";

/**
 * Atom. It is handed a max — it must not know that Aroma is out of 12.
 * That knowledge belongs to the organism that composes it.
 */
describe("ScoreSlider", () => {
  it("takes its bounds from props, not from any domain constant", () => {
    render(<ScoreSlider label="Aroma" value={6} max={12} onChange={vi.fn()} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "12");
  });

  it("shows the value against the maximum it was given", () => {
    render(<ScoreSlider label="Flavour" value={14} max={20} onChange={vi.fn()} />);
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("/20")).toBeInTheDocument();
  });

  it("reports changes as a number, not a string", () => {
    const onChange = vi.fn();
    render(<ScoreSlider label="Aroma" value={6} max={12} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "7" } });
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("labels the slider for assistive tech", () => {
    render(<ScoreSlider label="Mouthfeel" value={3} max={5} onChange={vi.fn()} />);
    expect(screen.getByRole("slider", { name: /mouthfeel/i })).toBeInTheDocument();
  });

  it("renders the anchor words it is given", () => {
    render(
      <ScoreSlider
        label="Aroma"
        value={6}
        max={12}
        anchors={["Absent", "Exemplary"]}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Absent")).toBeInTheDocument();
    expect(screen.getByText("Exemplary")).toBeInTheDocument();
  });
});
