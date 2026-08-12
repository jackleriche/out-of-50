import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaultDiagnostic } from "./FaultDiagnostic";

const meta = {
  title: "Organisms/FaultDiagnostic",
  component: FaultDiagnostic,
} satisfies Meta<typeof FaultDiagnostic>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Half the group flagging butter independently. This is a real finding. */
export const Consensus: Story = {
  args: {
    faultName: "Diacetyl",
    reviewerWords: ["Buttery / butterscotch"],
    flaggedBy: 3,
    outOf: 6,
    likelyCause:
      "Yeast pulled off the beer before it reabsorbed its diacetyl — most often a cold crash started too early, or a fermentation that stalled and was never roused.",
    suggestedFix:
      "Hold at 20–22 °C for 48h at terminal gravity before crashing. Force a diacetyl rest test: heat a sample to 60 °C, cool, and smell.",
  },
};

/** One flag. The card hedges rather than pretending this is a diagnosis. */
export const SingleFlag: Story = {
  args: { ...Consensus.args, flaggedBy: 1 },
};

export const Oxidation: Story = {
  args: {
    faultName: "Oxidation",
    reviewerWords: ["Wet cardboard", "Dull"],
    flaggedBy: 2,
    outOf: 6,
    likelyCause:
      "Oxygen pickup after fermentation — transfer, packaging, or headspace. Hazy beers show it fastest and worst.",
    suggestedFix:
      "Purge the receiving vessel with CO₂, closed-transfer, and cut headspace. Check bottle fill height and cap seal.",
  },
};
