import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: { default: "sheet", values: [{ name: "sheet", value: "#FBFBF7" }] },
    // Fail the story on an accessibility violation rather than just flagging it.
    a11y: { test: "error" },
  },
};

export default preview;
