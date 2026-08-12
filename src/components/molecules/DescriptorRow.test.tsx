import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DescriptorRow } from "./DescriptorRow";
import { theme } from "@/lib/theme";

/**
 * Molecule. Composes atoms and lifts every event. It holds no state and
 * makes no decision about what a descriptor means.
 */
describe("DescriptorRow", () => {
  const base = {
    label: "Citrus",
    intensity: null,
    onSelect: vi.fn(),
    onRemove: vi.fn(),
  };

  it("shows the descriptor it was given", () => {
    render(<DescriptorRow {...base} />);
    expect(screen.getByText("Citrus")).toBeInTheDocument();
  });

  it("lifts the chosen intensity to its parent", async () => {
    const onSelect = vi.fn();
    render(<DescriptorRow {...base} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Citrus: strong" }));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith("strong");
  });

  it("lifts removal without deciding anything itself", async () => {
    const onRemove = vi.fn();
    render(<DescriptorRow {...base} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole("button", { name: /remove citrus/i }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("passes the fault tone through when told it is a fault", () => {
    render(<DescriptorRow {...base} label="Wet cardboard" intensity="slight" tone={theme.colour.fault} />);
    expect(screen.getByRole("button", { name: "Wet cardboard: slight" })).toHaveStyle({
      backgroundColor: theme.colour.fault,
    });
  });
});
