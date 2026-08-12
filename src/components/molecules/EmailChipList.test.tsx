import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailChipList } from "./EmailChipList";

describe("EmailChipList", () => {
  const base = { emails: ["tom@example.com", "priya@example.com"], onRemove: vi.fn() };

  it("renders a chip per address", () => {
    render(<EmailChipList {...base} />);
    expect(screen.getByText("tom@example.com")).toBeInTheDocument();
    expect(screen.getByText("priya@example.com")).toBeInTheDocument();
  });

  it("lifts removal with the address concerned", async () => {
    const onRemove = vi.fn();
    render(<EmailChipList {...base} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove tom@example.com" }));
    expect(onRemove).toHaveBeenCalledExactlyOnceWith("tom@example.com");
  });

  it("renders nothing when the list is empty", () => {
    const { container } = render(<EmailChipList emails={[]} onRemove={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("offers no removal when the list is read-only", () => {
    render(<EmailChipList {...base} readOnly />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
