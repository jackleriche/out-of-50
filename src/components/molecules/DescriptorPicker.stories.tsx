import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DescriptorPicker } from "./DescriptorPicker";
import { theme } from "@/lib/theme";

const character = [
  { id: "d1", label: "Citrus" },
  { id: "d2", label: "Tropical fruit" },
  { id: "d3", label: "Stone fruit" },
  { id: "d4", label: "Pine / resin" },
  { id: "d5", label: "Bready malt" },
];

const faults = [
  { id: "f1", label: "Buttery / butterscotch" },
  { id: "f2", label: "Green apple" },
  { id: "f3", label: "Wet cardboard" },
  { id: "f4", label: "Cooked veg" },
];

const meta = {
  title: "Molecules/DescriptorPicker",
  component: DescriptorPicker,
  args: { onToggle: () => {}, onIntensity: () => {} },
} satisfies Meta<typeof DescriptorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { available: character, selected: {} } };

export const SomeChosen: Story = {
  args: { available: character, selected: { d1: "strong", d2: "noticeable" } },
};

/**
 * Same molecule, fault tone. Reviewers see plain words only — the mapping to
 * diacetyl or oxidation is brewer-side and never reaches this client.
 */
export const Faults: Story = {
  args: { available: faults, selected: { f1: "noticeable" }, tone: theme.colour.fault },
};
