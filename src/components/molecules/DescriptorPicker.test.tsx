import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DescriptorPicker } from "./DescriptorPicker";

describe("DescriptorPicker", () => {
  const available = [
    { id: "d1", label: "Citrus" },
    { id: "d2", label: "Tropical fruit" },
  ];
  const base = { available, selected: {}, onToggle: vi.fn(), onIntensity: vi.fn() };

  it("offers every descriptor as a chip", () => {
    render(<DescriptorPicker {...base} />);
    expect(screen.getByRole("button", { name: "Citrus" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tropical fruit" })).toBeInTheDocument();
  });

  it("lifts the toggle by id, not by label", async () => {
    const onToggle = vi.fn();
    render(<DescriptorPicker {...base} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: "Citrus" }));
    expect(onToggle).toHaveBeenCalledExactlyOnceWith("d1");
  });

  it("shows an intensity row only for the descriptors already chosen", () => {
    render(<DescriptorPicker {...base} selected={{ d1: "slight" }} />);
    expect(screen.getByRole("group", { name: "Citrus" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Tropical fruit" })).not.toBeInTheDocument();
  });

  it("marks a chosen chip as pressed", () => {
    render(<DescriptorPicker {...base} selected={{ d1: "slight" }} />);
    expect(screen.getByRole("button", { name: "Citrus" })).toHaveAttribute("aria-pressed", "true");
  });

  it("lifts an intensity change with the descriptor it belongs to", async () => {
    const onIntensity = vi.fn();
    render(<DescriptorPicker {...base} selected={{ d1: "slight" }} onIntensity={onIntensity} />);
    await userEvent.click(screen.getByRole("button", { name: "Citrus: strong" }));
    expect(onIntensity).toHaveBeenCalledExactlyOnceWith("d1", "strong");
  });

  it("renders nothing but chips when nothing is selected", () => {
    render(<DescriptorPicker {...base} />);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
