import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntensitySegments } from "./IntensitySegments";
import { theme } from "@/lib/theme";

/**
 * Atom. Purely presentational: it is told which levels exist, which one is
 * selected, and what to call when one is chosen. It knows nothing about
 * descriptors, faults, or BJCP.
 */
describe("IntensitySegments", () => {
  const levels = ["slight", "noticeable", "strong"] as const;

  it("renders one segment per level", () => {
    render(<IntensitySegments levels={levels} value={null} label="Citrus" tone={theme.colour.biro} onChange={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("fills every segment up to and including the selected level", () => {
    render(
      <IntensitySegments levels={levels} value="noticeable" label="Citrus" tone={theme.colour.biro} onChange={vi.fn()} />
    );
    const segs = screen.getAllByRole("button");
    expect(segs[0]).toHaveAttribute("data-filled", "true");
    expect(segs[1]).toHaveAttribute("data-filled", "true");
    expect(segs[2]).toHaveAttribute("data-filled", "false");
  });

  it("fills nothing when no level is selected", () => {
    render(<IntensitySegments levels={levels} value={null} label="Citrus" tone={theme.colour.biro} onChange={vi.fn()} />);
    screen
      .getAllByRole("button")
      .forEach((s) => expect(s).toHaveAttribute("data-filled", "false"));
  });

  it("marks only the selected level as pressed", () => {
    render(<IntensitySegments levels={levels} value="strong" label="Citrus" tone={theme.colour.biro} onChange={vi.fn()} />);
    const segs = screen.getAllByRole("button");
    expect(segs.map((s) => s.getAttribute("aria-pressed"))).toEqual(["false", "false", "true"]);
  });

  it("reports the level that was clicked", async () => {
    const onChange = vi.fn();
    render(<IntensitySegments levels={levels} value={null} label="Citrus" tone={theme.colour.biro} onChange={onChange} />);
    await userEvent.click(screen.getAllByRole("button")[1]);
    expect(onChange).toHaveBeenCalledExactlyOnceWith("noticeable");
  });

  it("names each segment for screen readers using the label it was given", () => {
    render(<IntensitySegments levels={levels} value={null} label="Citrus" tone={theme.colour.biro} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Citrus: slight" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Citrus: strong" })).toBeInTheDocument();
  });

  it("applies the tone it is handed rather than choosing one", () => {
    render(
      <IntensitySegments
        levels={levels}
        value="slight"
        label="Wet cardboard"
        tone={theme.colour.fault}
        onChange={vi.fn()}
      />
    );
    expect(screen.getAllByRole("button")[0]).toHaveStyle({ backgroundColor: theme.colour.fault });
  });
});
