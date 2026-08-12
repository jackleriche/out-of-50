import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryBlock } from "./CategoryBlock";

describe("CategoryBlock", () => {
  const base = {
    title: "Aroma",
    blurb: "Swirl it.",
    score: 9,
    max: 12,
    notes: "",
    onScore: vi.fn(),
    onNotes: vi.fn(),
  };

  it("shows the title and blurb it was given", () => {
    render(<CategoryBlock {...base} />);
    expect(screen.getByRole("heading", { name: "Aroma" })).toBeInTheDocument();
    expect(screen.getByText("Swirl it.")).toBeInTheDocument();
  });

  it("passes the max down rather than knowing it", () => {
    render(<CategoryBlock {...base} />);
    expect(screen.getByRole("slider")).toHaveAttribute("max", "12");
  });

  it("lifts a score change", () => {
    const onScore = vi.fn();
    render(<CategoryBlock {...base} onScore={onScore} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "10" } });
    expect(onScore).toHaveBeenCalledWith(10);
  });

  it("lifts notes as the reviewer types", async () => {
    const onNotes = vi.fn();
    render(<CategoryBlock {...base} onNotes={onNotes} />);
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(onNotes).toHaveBeenCalledWith("x");
  });

  it("makes clear that notes are optional, since requiring them costs completion", () => {
    render(<CategoryBlock {...base} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", expect.stringMatching(/optional/i));
  });

  it("renders whatever children it is composed with", () => {
    render(<CategoryBlock {...base}><p>picker goes here</p></CategoryBlock>);
    expect(screen.getByText("picker goes here")).toBeInTheDocument();
  });
});
