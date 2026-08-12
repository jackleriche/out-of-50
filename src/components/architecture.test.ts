import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The rule, enforced by the build rather than by discipline:
 * atoms and molecules are purely presentational.
 *
 * This is the test that stops the architecture rotting six months in, when
 * someone reaches for a fetch inside a Chip because it's convenient.
 */

const root = join(process.cwd(), "src/components");

const componentsIn = (layer: string): { file: string; source: string }[] => {
  const dir = join(root, layer);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && !f.includes(".test.") && !f.includes(".stories."))
    .map((file) => ({ file: `${layer}/${file}`, source: readFileSync(join(dir, file), "utf8") }));
};

const PURE_LAYERS = ["atoms", "molecules"];

const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /\bfetch\s*\(/, why: "performs I/O" },
  { pattern: /from ["']@\/lib\/db["']/, why: "reaches for the database" },
  { pattern: /from ["']next\/navigation["']/, why: "knows about routing" },
  { pattern: /useSWR|useQuery|useMutation/, why: "fetches data" },
  { pattern: /\bprocess\.env\b/, why: "reads the environment" },
  { pattern: /\bnew Date\(\s*\)/, why: "reads the clock, making it untestable" },
  { pattern: /\bMath\.random\b/, why: "is non-deterministic" },
  { pattern: /\bsetInterval\s*\(/, why: "polls" },
  { pattern: /localStorage|sessionStorage/, why: "reads outside storage" },
];

/**
 * Effects are allowed only when they push state INTO the node this component
 * owns — focus, measurement, imperative drawing, scroll. That always needs a
 * ref. An effect with no ref in the file is pulling something in from outside,
 * which is business logic wearing a hook.
 */
const usesEffect = (source: string) => /\buse(Layout)?Effect\b/.test(source);
const usesRef = (source: string) => /\buseRef\b/.test(source);

/**
 * An effect that calls a parent callback makes the atom mutate its parent's
 * state on its own schedule. That is no longer a controlled component.
 */
const effectCallsParent = (source: string): boolean =>
  [...source.matchAll(/\buse(?:Layout)?Effect\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\n\s*\}/g)].some(
    ([, body]) => /\bon[A-Z]\w*\s*\(/.test(body)
  );

describe.each(PURE_LAYERS)("%s are purely presentational", (layer) => {
  const components = componentsIn(layer);

  it("has components to check", () => {
    expect(components.length).toBeGreaterThan(0);
  });

  it.each(components)("$file holds no business logic", ({ source, file }) => {
    const broken = FORBIDDEN.filter(({ pattern }) => pattern.test(source)).map(
      ({ why }) => `${file} ${why}`
    );
    expect(broken).toEqual([]);
  });

  it.each(components)("$file does not import domain constants", ({ source, file }) => {
    // Types and shared enums are fine; hard-coded BJCP maxima are not.
    const importsMax = /import\s*{[^}]*\bMAX\b[^}]*}\s*from/.test(source);
    expect(importsMax, `${file} should take its bounds as props`).toBe(false);
  });

  it.each(components)("$file only uses effects to drive its own DOM node", ({ source, file }) => {
    const orphanEffect = usesEffect(source) && !usesRef(source);
    expect(
      orphanEffect,
      `${file} has an effect with no ref — if it isn't focusing, measuring or drawing its own node, that logic belongs in an organism`
    ).toBe(false);
  });

  it.each(components)("$file never calls back to its parent from an effect", ({ source, file }) => {
    expect(
      effectCallsParent(source),
      `${file} fires a parent callback from an effect, so it mutates parent state on its own schedule instead of on user intent`
    ).toBe(false);
  });

  it.each(components)("$file uses no raw colour values", ({ source, file }) => {
    const hexes = source.match(/#[0-9A-Fa-f]{3,8}\b/g) ?? [];
    expect(hexes, `${file} should take colours from theme.colour`).toEqual([]);
  });

  it.each(components)("$file uses no raw pixel values", ({ source, file }) => {
    // Strip the theme import line so `space(8, 16)` reads as a token, not a literal.
    const px = source.match(/(?<![\w.])-?\d+(\.\d+)?px\b/g) ?? [];
    expect(px, `${file} should use space() or theme.type.size`).toEqual([]);
  });

  it.each(components)("$file uses no raw rgb or hsl values", ({ source, file }) => {
    expect(/\b(rgba?|hsla?)\s*\(/.test(source), `${file} should use theme.colour`).toBe(false);
  });
});
