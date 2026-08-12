import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SrmLadder } from "./SrmLadder";

const swatches = [
  { srm: 2, hex: "#F8F4A0" },
  { srm: 6, hex: "#EBC842" },
  { srm: 20, hex: "#8A3E15" },
];

describe("SrmLadder", () => {
  it("renders a swatch per colour it is given", () => {
    render(<SrmLadder swatches={swatches} value={null} onChange={vi.fn()} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("reports the SRM value that was picked", async () => {
    const onChange = vi.fn();
    render(<SrmLadder swatches={swatches} value={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "SRM 6" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(6);
  });

  it("marks only the chosen swatch", () => {
    render(<SrmLadder swatches={swatches} value={6} onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "SRM 6" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "SRM 2" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "SRM 20" })).not.toBeChecked();
  });

  it("nothing is selected before the reviewer chooses", () => {
    render(<SrmLadder swatches={swatches} value={null} onChange={vi.fn()} />);
    screen.getAllByRole("radio").forEach((r) => expect(r).not.toBeChecked());
  });
});
