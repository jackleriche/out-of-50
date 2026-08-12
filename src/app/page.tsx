import Link from "next/link";
import "./marketing.css";

/**
 * The landing page.
 *
 * One job: get a brewer to put a beer up for scoring. Not to explain BJCP,
 * not to list features.
 *
 * The visual language is the judging form itself — hairlines, mono for
 * anything numeric, and red pen reserved strictly for faults, exactly as in
 * the app. Marketing and product should look like the same object.
 */

export const metadata = {
  title: "Out of Fifty — honest scores on your homebrew",
  description:
    "Share a beer by link or QR. Friends score it against the BJCP guidelines and you get back what they actually tasted.",
};

const STEPS = [
  {
    n: "01",
    title: "Put a beer up",
    body: "Name, style, batch, brew date. Takes a minute. You get a link and a QR you can print onto the bottles.",
  },
  {
    n: "02",
    title: "Hand it round",
    body: "Email invitations, or paste the link into the group chat. Nobody needs an account and nobody installs anything.",
  },
  {
    n: "03",
    title: "Read what came back",
    body: "Scores as they land, what people agreed on, and — the useful bit — which faults showed up and what causes them.",
  },
];

const SHEET_ROWS: [string, string, string][] = [
  ["Aroma", "8.8", "12"],
  ["Appearance", "2.5", "3"],
  ["Flavour", "14.7", "20"],
  ["Mouthfeel", "3.8", "5"],
  ["Overall", "7.0", "10"],
];

/* Six reviewers, plotted where they actually landed. */
const DOTS = ["56%", "60%", "62%", "78%", "84%", "88%"];

export default function Landing() {
  return (
    <div className="m">
      <header className="m-nav">
        <span className="m-mark">
          Out of <span className="m-mark-num">50</span>
        </span>
        <nav className="m-nav-links">
          <Link href="/preview">See it</Link>
          <Link className="m-btn m-btn--small" href="/login">
            Sign in
          </Link>
        </nav>
      </header>

      {/* The thesis is the red pen on the card, not the headline. */}
      <section className="m-hero">
        <div className="m-hero-copy">
          <p className="m-eyebrow">For homebrewers</p>
          <h1 className="m-h1">
            &ldquo;Yeah mate, lovely.&rdquo;
            <span className="m-h1-sub">is not feedback.</span>
          </h1>
          <p className="m-lead">
            Your friends will never tell you the beer is a bit buttery. Give them a
            proper scoresheet and they will tell you without meaning to — and you will
            know it was the cold crash.
          </p>
          <div className="m-cta-row">
            <Link className="m-btn" href="/login">
              Put a beer up
            </Link>
            <Link className="m-ghost" href="/preview">
              Look around first
            </Link>
          </div>
          <p className="m-fine">No account needed to score. Free while it&apos;s early.</p>
        </div>

        <figure className="m-card" aria-label="An example scoresheet with the brewer's diagnosis">
          <div className="m-card-head">
            <span className="m-cap">Batch 4 · six scoresheets</span>
            <span className="m-card-name">Corbière Current</span>
          </div>

          <dl className="m-rows">
            {SHEET_ROWS.map(([label, value, max]) => (
              <div className="m-row" key={label}>
                <dt>{label}</dt>
                <dd>
                  <span className="m-val">{value}</span>
                  <span className="m-max">/{max}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="m-total">
            <span className="m-cap">Total</span>
            <span className="m-total-num">
              36.8<span className="m-max">/50</span>
            </span>
          </div>

          <div className="m-pen">
            <p className="m-pen-said">
              3 of 6 wrote <em>buttery</em>. 1 wrote <em>wet cardboard</em>.
            </p>
            <p className="m-pen-name">Diacetyl</p>
            <p className="m-pen-fix">
              Crashed before the yeast finished. Hold at 20&ndash;22&nbsp;°C for 48h at
              terminal gravity next time.
            </p>
          </div>
        </figure>
      </section>

      <section className="m-band">
        <div className="m-band-inner">
          <h2 className="m-h2">Everyone gives you a 38</h2>
          <p className="m-body">
            Friends round to polite. What they cannot fake is where they agree. Six
            people landing on 38 is a good beer; three at 30 and three at 44 is a beer
            that divides people — and those are not the same result, even though the
            average is identical.
          </p>
          <div className="m-strip" aria-hidden="true">
            <span className="m-strip-rule" />
            {DOTS.map((left) => (
              <span className="m-dot" key={left} style={{ left }} />
            ))}
          </div>
          <p className="m-cap m-strip-cap">
            Every reviewer, plotted. The spread is the finding, not the mean.
          </p>
        </div>
      </section>

      {/* A real sequence, so the numbering carries information. */}
      <section className="m-steps">
        <h2 className="m-h2">How it goes</h2>
        <ol className="m-step-list">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="m-step-n">{s.n}</span>
              <h3 className="m-h3">{s.title}</h3>
              <p className="m-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="m-two">
        <article>
          <h2 className="m-h2">Blind, if you want it</h2>
          <p className="m-body">
            Hide the style and ask people to name it before you tell them. You find out
            whether the beer reads as what you were aiming for, which is a harder and
            more useful question than whether they enjoyed it.
          </p>
        </article>
        <article>
          <h2 className="m-h2">Anonymous, if you want it</h2>
          <p className="m-body">
            Decide when you make the link, and it cannot be changed afterwards.
            Reviewers are told which it is before they score, so the promise is worth
            something.
          </p>
        </article>
      </section>

      <section className="m-band">
        <div className="m-band-inner">
          <h2 className="m-h2">Nobody is asked to spot diacetyl</h2>
          <p className="m-body">
            Tell someone a beer might be buttery and a third of them will find butter.
            So reviewers only ever pick plain words. The translation happens on your
            side.
          </p>
          <div className="m-split">
            <div>
              <p className="m-cap">They tick</p>
              <ul className="m-words">
                <li>Buttery / butterscotch</li>
                <li>Green apple</li>
                <li>Wet cardboard</li>
                <li>Sticking plaster</li>
              </ul>
            </div>
            <div>
              <p className="m-cap m-cap--pen">You read</p>
              <ul className="m-words m-words--pen">
                <li>Diacetyl</li>
                <li>Acetaldehyde</li>
                <li>Oxidation</li>
                <li>Chlorophenol</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="m-end">
        <h2 className="m-h1 m-h1--end">Find out what it&apos;s really like</h2>
        <div className="m-cta-row m-cta-row--centre">
          <Link className="m-btn" href="/login">
            Put a beer up
          </Link>
          <Link className="m-ghost" href="/preview">
            Look around first
          </Link>
        </div>
      </section>

      <footer className="m-foot">
        <span className="m-cap">Out of Fifty</span>
        <span className="m-cap">
          Scoring follows the BJCP style guidelines. Not affiliated with the BJCP.
        </span>
      </footer>
    </div>
  );
}
