import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio construction research: diversification, risk management, asset allocation, factor investing, and long-term strategy.",
};

export default function PortfolioPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Portfolio</p>
        <h1>Building portfolios that survive contact with reality.</h1>
        <p>Construction, risk, allocation, and long-term strategy — the discipline layer that turns good research into good outcomes.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="section-head reveal"><div><p className="section-label">Illustrative</p><h2>A Sample Long-Term Allocation</h2></div></div>
        <div className="allocation-wrap reveal" style={{marginBottom: '56px'}}>
          <div
  className="donut"
  style={{
    background:
      'conic-gradient(#8B1E2D 0 45%, #B65A68 45% 65%, #6F7772 65% 82%, #B79A63 82% 92%, #D8D5CF 92% 100%)'
  }}
></div>></div>
          <ul className="alloc-legend">
  <li>
    <span
      className="swatch"
      style={{ background: '#8B1E2D' }}
    ></span>
    Global Equities — 45%
  </li>

  <li>
    <span
      className="swatch"
      style={{ background: '#B65A68' }}
    ></span>
    Fixed Income — 20%
  </li>

  <li>
    <span
      className="swatch"
      style={{ background: '#6F7772' }}
    ></span>
    Real Assets — 17%
  </li>

  <li>
    <span
      className="swatch"
      style={{ background: '#B79A63' }}
    ></span>
    Alternatives — 10%
  </li>

  <li>
    <span
      className="swatch"
      style={{ background: '#D8D5CF' }}
    ></span>
    Cash — 8%
  </li>
</ul>
        </div>
        <p style={{fontSize: '12.5px', color: 'var(--ink-soft)', margin: '-40px 0 56px'}}>Illustrative allocation for discussion purposes only · not a personalized recommendation.</p>

        <div className="section-head reveal"><div><p className="section-label">Topics</p><h2>Portfolio Construction Library</h2></div></div>
        <div className="card-grid reveal">
            <article className="r-card">
              <span className="card-tag">Topic 01</span>
              <h3>Diversification</h3>
              <p>Why traditional asset-class diversification has weakened, and what a more resilient structure looks like.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
            <article className="r-card">
              <span className="card-tag">Topic 02</span>
              <h3>Risk Management</h3>
              <p>Position sizing, drawdown tolerance, and the difference between volatility and permanent loss.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
            <article className="r-card">
              <span className="card-tag">Topic 03</span>
              <h3>Asset Allocation</h3>
              <p>Building an allocation framework around your actual time horizon, not a rule of thumb.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
            <article className="r-card">
              <span className="card-tag">Topic 04</span>
              <h3>Long-Term Investing</h3>
              <p>Why time in the market keeps beating timing the market, and how to actually stay the course.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
            <article className="r-card">
              <span className="card-tag">Topic 05</span>
              <h3>Factor Investing</h3>
              <p>Value, momentum, quality, and size, explained without the academic jargon.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
            <article className="r-card">
              <span className="card-tag">Topic 06</span>
              <h3>Case Studies</h3>
              <p>Real portfolio decisions, real outcomes — what worked, what didn't, and why.</p>
              <div className="card-meta"><a href="/research" className="link-underline" style={{border: '0'}}>Explore research &rarr;</a></div>
            </article>
        </div>

        <div className="pullquote reveal">The best portfolio isn't the one with the highest expected return. It's the one you can actually hold through a bad decade.</div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Portfolio thinking, not just stock picks</h2>
          <p>Weekly research on construction, risk, and allocation.</p>
          <NewsletterForm idPrefix="portfolio-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
