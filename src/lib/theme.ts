/**
 * The design system. Static, frozen, and the only legal source of a colour,
 * a gap or a font size.
 *
 * If a value isn't in here, it doesn't go in a stylesheet — enforced by
 * src/components/architecture.test.ts, which fails the build on any raw hex
 * or px literal in a component.
 *
 * Colours are named by role, not appearance. "ink" survives a repaint;
 * "darkBlue" doesn't.
 */

// --- spacing ---------------------------------------------------------------

/**
 * A four-based scale: 4, 8, 12, 16, 24, 32, 48.
 *
 * Seven steps, every one a multiple of four, and no gap wider than a
 * doubling. That last property is what a pure power-of-two scale lacks —
 * 16→32 leaves nowhere to land when a layout wants a little more than
 * comfortable but not twice as much, which in practice is most of the time.
 *
 * Everything below 4 is a border or a hairline, and those come from
 * theme.border rather than from spacing.
 */
export const SPACE_STEPS = [4, 8, 12, 16, 24, 32, 48] as const;

export type SpaceStep = (typeof SPACE_STEPS)[number] | 0;

/**
 * Curried-friendly spacing. Takes one to four steps and returns a px string,
 * so shorthand properties stay on the scale too:
 *   padding: space(8, 16)
 */
export const space = (...steps: SpaceStep[]): string => steps.map((s) => `${s}px`).join(" ");

// --- the theme -------------------------------------------------------------

export const theme = Object.freeze({
  colour: Object.freeze({
    /** Page background, behind the sheet. */
    ground: "#E4E9EC",
    /** The scoresheet itself. */
    sheet: "#FBFBF7",
    /** Body text and strong marks. */
    ink: "#141C24",
    /** The scoring pen — every interactive and every score. */
    biro: "#22389E",
    /** Wash behind a selected biro element. */
    biroWash: "#EDF0FB",
    /** Faults, warnings, anything the brewer must not miss. */
    fault: "#B0271F",
    /** Secondary text, captions, eyebrows. */
    muted: "#6A7883",
    /** Hairlines and borders. */
    rule: "#C6CFD5",
    /** Filled tracks, inactive bars, panel backgrounds. */
    faint: "#EDF0F2",
    /** Printable surfaces — QR tags. Not the same as sheet. */
    paper: "#FFFFFF",
  }),

  type: Object.freeze({
    family: Object.freeze({
      sans: "'IBM Plex Sans', system-ui, sans-serif",
      /** Anything numeric: scores, tokens, counts, eyebrows. */
      mono: "'IBM Plex Mono', ui-monospace, monospace",
    }),
    size: Object.freeze({
      micro: "10px",
      small: "12px",
      body: "14px",
      lead: "17px",
      title: "24px",
      display: "34px",
      hero: "56px",
      mega: "76px",
    }),
    weight: Object.freeze({
      regular: 400,
      medium: 500,
      semibold: 600,
    }),
    tracking: Object.freeze({
      eyebrow: "0.16em",
      tight: "-0.02em",
      hero: "-0.04em",
    }),
    leading: Object.freeze({
      tight: 1.15,
      body: 1.55,
    }),
  }),

  radius: Object.freeze({
    /** Near-square. The whole product reads as a printed form. */
    sharp: "2px",
    round: "50%",
  }),

  border: Object.freeze({
    hair: "1px",
    thick: "3px",
  }),

  layout: Object.freeze({
    /** Reviewer flow — single column, phone in one hand. */
    reviewer: "460px",
    /** Brewer setup. */
    setup: "560px",
    /** Results, which carries wider stat rows. */
    results: "640px",
    /** Marketing — the only full-width surface. */
    marketing: "1120px",
  }),

  motion: Object.freeze({
    quick: "120ms",
    easing: "ease",
  }),
});

export type Theme = typeof theme;
export type Colour = keyof Theme["colour"];
