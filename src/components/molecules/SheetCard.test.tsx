import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SheetCard } from "./SheetCard";

describe("SheetCard", () => {
  const base = {
    who: "Tom H.",
    total: 41,
    meta: "14 days old",
    flagged: false,
    open: false,
    onToggle: vi.fn(),
    breakdown: [{ label: "Aroma", value: 10, max: 12 }],
    notes: "Massive tropical hit.",
  };

  it("shows the reviewer and their total", () => {
    render(<SheetCard {...base} />);
    expect(screen.getByText("Tom H.")).toBeInTheDocument();
    expect(screen.getByText("41")).toBeInTheDocument();
  });

  it("hides the breakdown until opened", () => {
    render(<SheetCard {...base} />);
    expect(screen.queryByText("Aroma")).not.toBeInTheDocument();
  });

  it("shows the breakdown and notes when open", () => {
    render(<SheetCard {...base} open />);
    expect(screen.getByText("Aroma")).toBeInTheDocument();
    expect(screen.getByText(/Massive tropical hit/)).toBeInTheDocument();
  });

  it("lifts the toggle rather than holding open state itself", async () => {
    const onToggle = vi.fn();
    render(<SheetCard {...base} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { expanded: false }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("marks a sheet that flagged a fault", () => {
    render(<SheetCard {...base} flagged />);
    expect(screen.getByText(/flagged/i)).toBeInTheDocument();
  });

  it("says so plainly when a reviewer left no notes", () => {
    render(<SheetCard {...base} open notes={null} />);
    expect(screen.getByText(/no notes/i)).toBeInTheDocument();
  });
});
