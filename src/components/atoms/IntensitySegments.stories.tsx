import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntensitySegments } from "./IntensitySegments";
import { INTENSITIES } from "@/lib/scoring";
import { theme } from "@/lib/theme";

const meta = {
  title: "Atoms/IntensitySegments",
  component: IntensitySegments,
  args: {
    levels: INTENSITIES,
    label: "Citrus",
    tone: theme.colour.biro,
    onChange: () => {},
  },
} satisfies Meta<typeof IntensitySegments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unset: Story = { args: { value: null } };
export const Slight: Story = { args: { value: "slight" } };
export const Strong: Story = { args: { value: "strong" } };
export const Fault: Story = {
  args: { value: "noticeable", label: "Wet cardboard", tone: theme.colour.fault },
};
