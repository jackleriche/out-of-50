import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScoresheetStep } from "./ScoresheetStep";

/**
 * Organism. This is the first layer allowed to know that Aroma is out of 12.
 * It still fetches nothing — the page hands it everything.
 */

const base = {
  scores: { aroma: 9, appearance: 2, flavour: 15, mouthfeel: 4, overall: 7 },
  notes: {},
  descriptors: [
    { id: "d1", label: "Citrus", category: "aroma" as const },
    { id: "d2", label: "Hazy", category: "appearance" as const },
  ],
  selected: {},
  srm: null,
  swatches: [{ srm: 4, hex: "#F3E163" }],
  onScore: vi.fn(),
  onNotes: vi.fn(),
  onToggleDescriptor: vi.fn(),
  onIntensity: vi.fn(),
  onSrm: vi.fn(),
};

describe("ScoresheetStep", () => {
  it("knows each category's BJCP maximum without being told", () => {
    render(<ScoresheetStep step="aroma" {...base} />);
    expect(screen.getByRole("slider")).toHaveAttribute("max", "12");
  });

  it("uses the right maximum for a different category", () => {
    render(<ScoresheetStep step="flavour" {...base} />);
    expect(screen.getByRole("slider")).toHaveAttribute("max", "20");
  });

  it("shows only the descriptors belonging to this category", () => {
    render(<ScoresheetStep step="aroma" {...base} />);
    expect(screen.getByRole("button", { name: "Citrus" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hazy" })).not.toBeInTheDocument();
  });

  it("offers the colour ladder on appearance and nowhere else", () => {
    const { unmount } = render(<ScoresheetStep step="appearance" {...base} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    unmount();
    render(<ScoresheetStep step="aroma" {...base} />);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });

  it("offers no descriptors on overall impression, which is a judgement not a list", () => {
    render(<ScoresheetStep step="overall" {...base} />);
    expect(screen.queryByRole("button", { name: "Citrus" })).not.toBeInTheDocument();
  });

  it("lifts a score change tagged with the category it came from", () => {
    const onScore = vi.fn();
    render(<ScoresheetStep step="mouthfeel" {...base} onScore={onScore} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "5" } });
    expect(onScore).toHaveBeenCalledExactlyOnceWith("mouthfeel", 5);
  });

  it("lifts notes tagged with the category", () => {
    const onNotes = vi.fn();
    render(<ScoresheetStep step="aroma" {...base} onNotes={onNotes} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "juicy" } });
    expect(onNotes).toHaveBeenCalledExactlyOnceWith("aroma", "juicy");
  });
});
