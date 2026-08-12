import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScoreSlider } from "./ScoreSlider";

const meta = {
  title: "Atoms/ScoreSlider",
  component: ScoreSlider,
  args: { onChange: () => {}, anchors: ["Absent", "Exemplary"] },
} satisfies Meta<typeof ScoreSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Max always arrives as a prop — the atom has no idea Aroma is out of 12.
export const Aroma: Story = { args: { label: "Aroma", value: 9, max: 12 } };
export const Appearance: Story = { args: { label: "Appearance", value: 2, max: 3 } };
export const Flavour: Story = { args: { label: "Flavour", value: 15, max: 20 } };
