# BJCP Scoring App

Brewers share a beer by link or QR; reviewers score it against the BJCP
50-point scale and the brewer gets diagnostics back.

## Running it

### No database, no email — just look at it

```bash
npm install
npm run dev
# http://localhost:3000/preview
```

Fixture data, no services. Good enough to judge the design; not enough to test
submission, links or persistence.

### The real thing, locally

```bash
npm install
cp .env.example .env     # works as-is — no keys needed
npm run setup            # docker postgres + schema + constraints + seed
npm run dev
```

Then open one of the seeded links:

| Link | Rules |
|---|---|
| `/b/demo-blind` | blind, guess-then-reveal, anonymous |
| `/b/demo-open` | style shown, named |

Same beer, two links, different rules — which is the point of putting settings
on the link rather than the beer.

**Email needs no account.** With `RESEND_API_KEY` blank, mail prints to the
console and is written to `.mail/*.eml`, which you can open in a mail client to
check it renders. Nothing is sent, and no real invite can escape by accident.
Set the key only when you actually want delivery.

**Why not SQLite?** Prisma has no native enum support on SQLite, and this
schema has six. More to the point, `prisma/constraints.sql` holds the check
constraints and the triggers that make `anonymous` and `blindMode` immutable —
the guarantees the product rests on. Testing against a database that cannot
enforce them tests something you never ship. Docker Postgres is one command.

## Testing

```bash
npm test            # Vitest + React Testing Library
npm run test:watch
npm run test:e2e    # Playwright — the full reviewer flow
npm run storybook
```

Development is red-green-refactor. Write the failing test, make it pass,
then tidy. `src/components/architecture.test.ts` mechanically enforces the
layer rules below, so a violation fails CI rather than surviving review.

## Architecture

Atomic design, strictly applied:

| Layer | Holds | Never |
|---|---|---|
| **atoms** | markup, props, event callbacks | state beyond UI, domain constants, I/O, `useEffect`, the clock |
| **molecules** | composed atoms, lifted events | business logic, fetching, routing |
| **organisms** | domain shape, composition | data fetching |
| **templates / pages** | data, orchestration, server access | — |

`ScoreSlider` takes `max` as a prop rather than importing `MAX.aroma`. That
asymmetry is the whole point: atoms stay testable with no mocking.

Domain logic lives in `src/lib` as pure functions — no React, no I/O, no
`new Date()` read from the clock. `ts-pattern` over `switch`; currying where
partial application is genuinely useful (`statsFor(sheets)(history)(cat)`).

## Rules the code enforces

- **Total is never stored.** It is the sum of five columns, derived on read.
- **`anonymous` and `blindMode` are immutable** once a share link exists —
  Postgres triggers, not app-layer discipline. Reviewers see the promise
  before they score.
- **`reviews.anonymous` is a snapshot** taken at insert. Rendering never reads
  the live link value, so a review keeps the promise it was collected under.
- **Fault mappings never reach the reviewer client.** `Descriptor.faultName`,
  `likelyCause` and `suggestedFix` are brewer-side columns; the reviewer
  endpoint must not select them.
- **No skipping.** Every category is required, so every sheet is a valid /50.
- **Diagnostics are unscored.** True-to-style and off-flavours never move the
  total.

## Dependency versions

Pins in `package.json` are the versions that were actually installed and
tested, not hand-written guesses — get that wrong and the app works locally
while a fresh `npm install` resolves something different and breaks.

Two deliberate exceptions:

- **`next-auth` is pinned to a v5 beta.** `@latest` resolves to v4, which is a
  different API. The pin is explicit on purpose.
- **Prisma stays on 6.x.** Prisma 7 moves configuration to `prisma.config.ts`
  and changes client output; worth doing, but as a deliberate upgrade you can
  test, not a silent bump.

`postinstall` runs `prisma generate` but does not fail the install if it can't
reach Prisma's binary CDN — useful behind a proxy or offline. `npm run build`
generates properly before building.

Run `npm run typecheck` to check both the app and the stories/tests; the Next
build deliberately excludes dev artefacts, so they need the second pass.
# out-of-50
