import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equities",
  description: "Sector-by-sector equity research covering technology, healthcare, financials, energy, industrials, consumer, real estate, and utilities.",
};

export default function EquitiesPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Equities</p>
        <h1>Sector-by-sector, company-by-company.</h1>
        <p>Eight sectors, each covered on its own terms — the capital allocation decisions, competitive dynamics, and valuation questions that actually move individual stocks.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="section-head reveal"><div><p className="section-label">Coverage</p><h2>Browse by Sector</h2></div></div>
        <div className="sector-grid reveal">
          <a href="/research" className="sector-card">
            <span className="sector-chg up" style={{color: 'var(--green)'}}>&#9650; +1.2%</span>
            <h3>Technology</h3>
            <p>Semiconductor capex, AI infrastructure spend, and platform margins.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg down" style={{color: 'var(--accent)'}}>&#9660; -0.3%</span>
            <h3>Healthcare</h3>
            <p>Drug pricing policy, biotech M&A, and payer economics.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg up" style={{color: 'var(--green)'}}>&#9650; +0.6%</span>
            <h3>Financials</h3>
            <p>Net interest margins, credit quality, and capital markets activity.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg up" style={{color: 'var(--green)'}}>&#9650; +0.9%</span>
            <h3>Energy</h3>
            <p>Capex discipline, OPEC+ supply decisions, and refining margins.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg up" style={{color: 'var(--green)'}}>&#9650; +0.2%</span>
            <h3>Industrials</h3>
            <p>Reshoring capex, defense budgets, and supply chain realignment.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg down" style={{color: 'var(--accent)'}}>&#9660; -0.5%</span>
            <h3>Consumer</h3>
            <p>Discretionary spend, private-label share, and pricing power.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg down" style={{color: 'var(--accent)'}}>&#9660; -1.1%</span>
            <h3>Real Estate</h3>
            <p>Cap rates, refinancing walls, and office-to-residential conversion.</p>
          </a>
          <a href="/research" className="sector-card">
            <span className="sector-chg up" style={{color: 'var(--green)'}}>&#9650; +0.4%</span>
            <h3>Utilities</h3>
            <p>Grid investment, data-center power demand, and regulated returns.</p>
          </a>
        </div>

        <div className="section-head reveal"><div><p className="section-label">Data</p><h2>Sector Heatmap</h2></div></div>
        <div className="heatmap reveal">
          <div className="heat-cell" style={{background: '#8B1E2D'}}><b>NVEX</b><span>-3.0%</span></div>
          <div className="heat-cell" style={{background: '#4C8B6C'}}><b>SOLR</b><span>+1.4%</span></div>
          <div className="heat-cell" style={{background: '#8A8A8A'}}><b>QNTM</b><span>+0.2%</span></div>
          <div className="heat-cell" style={{background: '#8B1E2D'}}><b>MDCX</b><span>-2.1%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>FNCL</b><span>-0.8%</span></div>
          <div className="heat-cell" style={{background: '#4C8B6C'}}><b>ENRG</b><span>+0.6%</span></div>
          <div className="heat-cell" style={{background: '#4C8B6C'}}><b>INDU</b><span>+1.1%</span></div>
          <div className="heat-cell" style={{background: '#8B1E2D'}}><b>CNSM</b><span>-2.1%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>REIT</b><span>+3.9%</span></div>
          <div className="heat-cell" style={{background: '#8B1E2D'}}><b>UTIL</b><span>-2.1%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>AUTO</b><span>-0.8%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>BANK</b><span>-0.4%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>PHRM</b><span>-0.4%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>AERO</b><span>-0.8%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>RETL</b><span>-1.5%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>CHEM</b><span>-0.8%</span></div>
        </div>
        <p style={{fontSize: '12.5px', color: 'var(--ink-soft)', margin: '0 0 56px'}}>Illustrative single-day performance by representative constituent · not investment advice.</p>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal"><div><p className="section-label">Featured</p><h2>Latest Equities Research</h2></div></div>
            <div className="card-grid cols-2 reveal">
              <article className="r-card">
                <span className="card-tag">Equities</span>
                <h3>Semiconductor Capex Is Diverging From Semiconductor Demand</h3>
                <p>Capital spending plans across the industry no longer track order books.</p>
                <div className="card-meta"><span>7 min read</span><span>·</span><span>Aug 1, 2026</span></div>
              </article>
              <article className="r-card">
                <span className="card-tag">Equities</span>
                <h3>Valuing the Unprofitable</h3>
                <p>Discounted cash flow breaks down here. What actually works instead.</p>
                <div className="card-meta"><span>14 min read</span><span>·</span><span>Jul 7, 2026</span></div>
              </article>
              <article className="r-card">
                <span className="card-tag">Equities</span>
                <h3>Energy Capex Discipline Is Ending, Quietly</h3>
                <p>After three years of restraint, spending plans are turning back up.</p>
                <div className="card-meta"><span>9 min read</span><span>·</span><span>Jun 20, 2026</span></div>
              </article>
              <article className="r-card">
                <span className="card-tag">Equities</span>
                <h3>The Quiet Compounders Wall Street Keeps Overlooking</h3>
                <p>A framework for spotting durable compounders before consensus catches on.</p>
                <div className="card-meta"><span>11 min read</span><span>·</span><span>Jul 21, 2026</span></div>
              </article>
            </div>
            <div className="load-more-wrap"><a href="/research" className="btn-outline" style={{display: 'inline-block', textDecoration: 'none'}}>See all equities research</a></div>
          </div>
          <aside>
            <div className="sidebar-box">
              <h4>Valuation Snapshot</h4>
              <ul className="sidebar-list">
                <li><span className="rank">P/E</span><a href="/data">S&amp;P 500 forward P/E: 21.4x</a></li>
                <li><span className="rank">P/B</span><a href="/data">S&amp;P 500 price/book: 4.6x</a></li>
                <li><span className="rank">DY</span><a href="/data">S&amp;P 500 dividend yield: 1.3%</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Sector research, without the sell-side spin</h2>
          <p>Independent equity analysis, every week.</p>
          <NewsletterForm idPrefix="equities-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
