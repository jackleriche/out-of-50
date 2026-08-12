import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpreadStrip } from "./SpreadStrip";
import { positionsFor, bandFor } from "@/lib/geometry";

const onScale = positionsFor(0, 50);
const band = bandFor(0, 50);
const ticks = [0, 20, 40, 60, 80, 100];

const meta = {
  title: "Molecules/SpreadStrip",
  component: SpreadStrip,
  args: { ticks },
} satisfies Meta<typeof SpreadStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six mates, broad agreement — the boring, healthy case. */
export const Agreement: Story = {
  args: { positions: onScale([37, 38, 38, 39, 40, 41]), band: band([37, 38, 38, 39, 40, 41]) },
};

/** One harsh sheet. This is the shape an average would hide. */
export const OneOutlier: Story = {
  args: { positions: onScale([31, 38, 39, 40, 41, 42]), band: band([31, 38, 39, 40, 41, 42]) },
};

/** Genuine ambiguity — the beer divides people. */
export const Polarised: Story = {
  args: { positions: onScale([28, 30, 31, 43, 44, 46]), band: band([28, 30, 31, 43, 44, 46]) },
};

export const SingleReview: Story = { args: { positions: onScale([38]), band: band([38]) } };
export const Empty: Story = { args: { positions: [], band: null } };
