import Link from "next/link";

/**
 * Landing page. Deliberately not a redirect — a redirect on `/` makes the
 * app feel broken, because every stray navigation lands you somewhere you
 * didn't ask for.
 */
export default function DevIndex() {
  return (
    <div className="sheet">
      <header className="head">
        <span className="eyebrow">Beer scoring</span>
        <h1 className="h1">Score homebrew to BJCP</h1>
        <p className="sub">
          Share a beer by link or QR. Friends score it out of 50; you get the
          diagnostics back.
        </p>
      </header>

      <section>
        <h2 className="sec-title">Seeded links</h2>
        <p className="blurb">
          Real database, real submission. Run <code>npm run setup</code> first if these
          404 — the same beer, shared twice under different rules.
        </p>
        <ul className="stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <Link className="toggle-btn" href="/b/demo-open">
              Score it — style shown, named
            </Link>
          </li>
          <li>
            <Link className="toggle-btn" href="/b/demo-blind">
              Score it — blind, guess first, anonymous
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="sec-title">No database</h2>
        <p className="blurb">
          Every screen on fixture data, including the awkward cases the seeds
          don&apos;t cover yet.
        </p>
        <Link className="toggle-btn" href="/preview">
          Preview on fixtures
        </Link>
      </section>
    </div>
  );
}
