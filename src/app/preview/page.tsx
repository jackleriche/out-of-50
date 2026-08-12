import Link from "next/link";

/** Preview index. Runs on fixtures — no database, no auth. */
export default function PreviewIndex() {
  return (
    <div className="sheet">
      <header className="head">
        <span className="eyebrow">Preview</span>
        <h1 className="h1">Visual test</h1>
        <p className="sub">Fixture data. No database needed.</p>
      </header>
      <section>
        <ul className="stack" style={{ listStyle: "none", padding: 0 }}>
          <li><Link className="toggle-btn" href="/preview/review">Reviewer flow — style shown</Link></li>
          <li><Link className="toggle-btn" href="/preview/review?blind=1">Reviewer flow — blind, guess first</Link></li>
          <li><Link className="toggle-btn" href="/preview/review?anon=1">Reviewer flow — anonymous link</Link></li>
          <li><Link className="toggle-btn" href="/preview/results">Brewer results — six sheets</Link></li>
          <li><Link className="toggle-btn" href="/preview/results?few=1">Brewer results — only two sheets</Link></li>
          <li><Link className="toggle-btn" href="/preview/results?first=1">Brewer results — first batch, no history</Link></li>
        </ul>
      </section>
    </div>
  );
}
