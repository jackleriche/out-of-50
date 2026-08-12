import { theme, SPACE_STEPS } from "./theme";

/**
 * Emits the theme as CSS custom properties for the global stylesheet, so
 * plain CSS files draw from exactly the same tokens as component styles.
 * Generated, never hand-edited — there is one source of truth.
 */
export const themeCssVariables = (): string =>
  [
    ...Object.entries(theme.colour).map(([k, v]) => `  --c-${k}: ${v};`),
    ...SPACE_STEPS.map((s) => `  --s-${s}: ${s}px;`),
    ...Object.entries(theme.type.size).map(([k, v]) => `  --t-${k}: ${v};`),
    ...Object.entries(theme.type.family).map(([k, v]) => `  --f-${k}: ${v};`),
    ...Object.entries(theme.radius).map(([k, v]) => `  --r-${k}: ${v};`),
  ].join("\n");

export const themeCss = (): string => `:root {\n${themeCssVariables()}\n}`;
