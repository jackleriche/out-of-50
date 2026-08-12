import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup } from "./ToggleGroup";

describe("ToggleGroup", () => {
  const opts = [
    { value: "invite", label: "Invited only" },
    { value: "open", label: "Anyone with the link" },
  ];

  it("renders every option it is given", () => {
    render(<ToggleGroup options={opts} value="invite" name="Who can score" onChange={vi.fn()} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("marks the selected option", () => {
    render(<ToggleGroup options={opts} value="open" name="Who can score" onChange={vi.fn()} />);
    expect(screen.getByRole("radio", { name: "Anyone with the link" })).toBeChecked();
  });

  it("lifts the chosen value", async () => {
    const onChange = vi.fn();
    render(<ToggleGroup options={opts} value="invite" name="Who can score" onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Anyone with the link" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("open");
  });

  it("disables every option when locked", () => {
    render(
      <ToggleGroup options={opts} value="invite" name="Who can score" locked onChange={vi.fn()} />
    );
    screen.getAllByRole("radio").forEach((r) => expect(r).toBeDisabled());
  });

  it("does not report changes while locked", async () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup options={opts} value="invite" name="Who can score" locked onChange={onChange} />
    );
    await userEvent.click(screen.getByRole("radio", { name: "Anyone with the link" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("groups the options under the name it was given", () => {
    render(<ToggleGroup options={opts} value="invite" name="Who can score" onChange={vi.fn()} />);
    expect(screen.getByRole("radiogroup", { name: "Who can score" })).toBeInTheDocument();
  });
});
