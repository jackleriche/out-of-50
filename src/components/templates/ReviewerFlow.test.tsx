import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewerFlow } from "./ReviewerFlow";

/**
 * Template. Owns state via the reducer and orchestrates organisms.
 * Submission is injected, so nothing here touches the network.
 */

const beer = {
  name: "Corbière Current",
  brewer: "Wonder",
  abv: "6.2%",
  style: { id: "21B", name: "Specialty IPA: New England IPA" },
};

const base = {
  beer,
  blind: "off" as const,
  anonymous: false,
  styles: [
    { id: "21A", name: "American IPA" },
    { id: "21B", name: "Specialty IPA: New England IPA" },
  ],
  descriptors: [{ id: "d1", label: "Citrus", category: "aroma" }],
  faults: [{ id: "f1", label: "Buttery / butterscotch" }],
  swatches: [{ srm: 4, hex: "#F3E163" }],
  onSubmit: vi.fn().mockResolvedValue(undefined),
};

describe("ReviewerFlow", () => {
  it("opens on aroma when the style is shown", () => {
    render(<ReviewerFlow {...base} />);
    expect(screen.getByRole("heading", { name: "Aroma" })).toBeInTheDocument();
  });

  it("opens on the blind guess when the link is blind", () => {
    render(<ReviewerFlow {...base} blind="guess_then_reveal" />);
    expect(screen.getByRole("heading", { name: /what do you think this is/i })).toBeInTheDocument();
  });

  it("hides the beer name until the style is revealed", () => {
    render(<ReviewerFlow {...base} blind="guess_then_reveal" />);
    expect(screen.queryByText("Corbière Current")).not.toBeInTheDocument();
  });

  it("shows the beer name from the start when not blind", () => {
    render(<ReviewerFlow {...base} />);
    expect(screen.getByText("Corbière Current")).toBeInTheDocument();
  });

  it("never shows the running total while scoring, to stop reviewers anchoring", async () => {
    render(<ReviewerFlow {...base} />);
    expect(screen.queryByText("/50")).not.toBeInTheDocument();
  });

  it("blocks the blind round until a style is guessed", () => {
    render(<ReviewerFlow {...base} blind="guess_then_reveal" />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("advances once a guess is made", async () => {
    render(<ReviewerFlow {...base} blind="guess_then_reveal" />);
    await userEvent.click(screen.getByRole("radio", { name: /American IPA/ }));
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("tells an anonymous reviewer their sheet is anonymous before they score", () => {
    render(<ReviewerFlow {...base} anonymous />);
    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
  });

  it("makes no anonymity promise on a named link", () => {
    render(<ReviewerFlow {...base} />);
    expect(screen.queryByText(/anonymous/i)).not.toBeInTheDocument();
  });

  it("walks the whole sheet and submits once", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ReviewerFlow {...base} onSubmit={onSubmit} />);

    // aroma → appearance
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    // appearance is gated on picking a colour
    await userEvent.click(screen.getByRole("radio", { name: "SRM 4" }));
    for (const _ of ["appearance", "flavour", "mouthfeel", "overall", "diagnostics"]) {
      await userEvent.click(screen.getByRole("button", { name: /next/i }));
    }
    await userEvent.click(screen.getByRole("button", { name: /send scoresheet/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("shows the total only after submission", async () => {
    render(<ReviewerFlow {...base} />);
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await userEvent.click(screen.getByRole("radio", { name: "SRM 4" }));
    for (const _ of ["appearance", "flavour", "mouthfeel", "overall", "diagnostics"]) {
      await userEvent.click(screen.getByRole("button", { name: /next/i }));
    }
    await userEvent.click(screen.getByRole("button", { name: /send scoresheet/i }));
    expect(await screen.findByText("/50")).toBeInTheDocument();
  });
});
