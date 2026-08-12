import Link from "next/link";

/**
 * Sign-in stub. Auth.js magic links are wired up next — this exists so the
 * marketing page's calls to action lead somewhere honest rather than 404.
 */
export default function Login() {
  return (
    <div className="sheet">
      <header className="head">
        <span className="eyebrow">Out of Fifty</span>
        <h1 className="h1">Sign in</h1>
        <p className="sub">
          We&apos;ll email you a link — no password to remember.
        </p>
      </header>

      <section>
        <label className="eyebrow" htmlFor="email">Email</label>
        <input className="field" id="email" type="email" placeholder="you@example.com" disabled />
        <button className="btn" disabled>Email me a link</button>
        <p className="fineprint" style={{ marginTop: "var(--s-16)" }}>
          Not connected yet. Reviewers never need to sign in — this is only for brewers
          putting a beer up.
        </p>
      </section>

      <section style={{ borderBottom: "none" }}>
        <Link className="toggle-btn" href="/preview">Look around without an account</Link>
      </section>
    </div>
  );
}
