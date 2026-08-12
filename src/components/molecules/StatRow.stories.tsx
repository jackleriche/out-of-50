import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatRow } from "./StatRow";

const meta = {
  title: "Molecules/StatRow",
  component: StatRow,
} satisfies Meta<typeof StatRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Improving: Story = {
  args: { label: "Flavour", value: 15.2, max: 20, pct: 76, spread: 1.4, delta: 0.9 },
};

/** Declines are toned as faults — this is the line a brewer needs to notice. */
export const Declining: Story = {
  args: { label: "Mouthfeel", value: 3.4, max: 5, pct: 68, spread: 0.8, delta: -1.1 },
};

/** First batch: no history, so no comparison is shown at all. */
export const NoHistory: Story = {
  args: { label: "Aroma", value: 9.1, max: 12, pct: 75.8, spread: 2.2, delta: null },
};

/** High spread — the reviewers did not agree, which is itself the finding. */
export const Contested: Story = {
  args: { label: "Aroma", value: 8.0, max: 12, pct: 66.7, spread: 3.9, delta: -0.4 },
};
