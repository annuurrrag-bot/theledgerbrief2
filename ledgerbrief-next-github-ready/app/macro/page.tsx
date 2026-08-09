import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Macro",
  description: "Inflation, interest rates, central bank policy, GDP, employment, and the yield curve, explained clearly every week.",
};

export default function MacroPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Macro</p>
        <h1>The forces behind the tape.</h1>
        <p>Inflation, interest rates, central bank policy, growth, and employment — the macro backdrop that ultimately drives everything else on this site.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="section-head reveal"><div><p className="section-label">Prices</p><h2>Inflation</h2></div></div>
        <div className="tile-grid cols-3 reveal">
          <div className="tile"><span className="tile-label">Headline CPI (YoY)</span><span className="tile-val">2.9%</span><span className="tile-chg down">&#9660; -0.1pt vs prior</span></div>
          <div className="tile"><span className="tile-label">Core CPI (YoY)</span><span className="tile-val">3.1%</span><span className="tile-chg down">&#9660; -0.1pt vs prior</span></div>
          <div className="tile"><span className="tile-label">PCE (YoY)</span><span className="tile-val">2.6%</span><span className="tile-chg up">&#9650; +0.1pt vs prior</span></div>
        </div>

        <div className="section-head reveal"><div><p className="section-label">Policy</p><h2>Interest Rates &amp; Central Banks</h2></div></div>
        <div className="tile-grid cols-3 reveal" style={{marginBottom: '24px'}}>
          <div className="tile"><span className="tile-label">Fed Funds Rate</span><span className="tile-val">4.50%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Target range 4.25–4.50%</span></div>
          <div className="tile"><span className="tile-label">ECB Deposit Rate</span><span className="tile-val">2.75%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Held at last meeting</span></div>
          <div className="tile"><span className="tile-label">BoJ Policy Rate</span><span className="tile-val">0.50%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Gradual normalization path</span></div>
        </div>
        <table className="data-table reveal">
          <thead><tr><th>Central Bank</th><th>Current Stance</th><th>Next Meeting</th></tr></thead>
          <tbody>
            <tr><td>Federal Reserve</td><td>Holding, data-dependent</td><td>Sep 17, 2026</td></tr>
            <tr><td>European Central Bank</td><td>Cautiously easing</td><td>Sep 10, 2026</td></tr>
            <tr><td>Bank of Japan</td><td>Gradual tightening</td><td>Sep 19, 2026</td></tr>
            <tr><td>Bank of England</td><td>Holding</td><td>Sep 24, 2026</td></tr>
          </tbody>
        </table>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal"><div><p className="section-label">Growth &amp; Labor</p><h2>GDP &amp; Employment</h2></div></div>
            <div className="tile-grid cols-3 reveal" style={{marginBottom: '56px'}}>
              <div className="tile"><span className="tile-label">GDP Growth (QoQ ann.)</span><span className="tile-val">2.1%</span><span className="tile-chg up">&#9650; +0.2pt vs prior</span></div>
              <div className="tile"><span className="tile-label">Unemployment Rate</span><span className="tile-val">4.0%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Unchanged</span></div>
              <div className="tile"><span className="tile-label">Nonfarm Payrolls</span><span className="tile-val">+142K</span><span className="tile-chg down">&#9660; vs +180K prior</span></div>
            </div>

            <div className="section-head reveal"><div><p className="section-label">Fixed Income</p><h2>Treasury Yield Curve</h2></div></div>
            <svg className="yield-chart reveal" viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, -apple-system, sans-serif" style={{fontVariantNumeric: 'tabular-nums'}}>
              <line x1="40" y1="180" x2="580" y2="180" stroke="#E8E8E8"/>
              <line x1="40" y1="20" x2="40" y2="180" stroke="#E8E8E8"/>
              <polyline points="40,150 130,120 220,105 310,100 400,98 490,90 580,86" fill="none" stroke="#8B1E2D" strokeWidth="2"/>
              <g fill="#5F6368" fontSize="11">
                <text x="34" y="196" textAnchor="middle">1M</text>
                <text x="130" y="196" textAnchor="middle">1Y</text>
                <text x="220" y="196" textAnchor="middle">2Y</text>
                <text x="310" y="196" textAnchor="middle">5Y</text>
                <text x="400" y="196" textAnchor="middle">10Y</text>
                <text x="490" y="196" textAnchor="middle">20Y</text>
                <text x="580" y="196" textAnchor="middle">30Y</text>
              </g>
              <g fill="#111">
                <circle cx="40" cy="150" r="3"/><circle cx="130" cy="120" r="3"/><circle cx="220" cy="105" r="3"/>
                <circle cx="310" cy="100" r="3"/><circle cx="400" cy="98" r="3"/><circle cx="490" cy="90" r="3"/><circle cx="580" cy="86" r="3"/>
              </g>
            </svg>
            <p style={{fontSize: '12.5px', color: 'var(--ink-soft)', marginTop: '10px'}}>Illustrative composite of public Treasury yield data · not investment advice.</p>

            <div className="pullquote reveal">The business cycle isn't dead. It's just moving on a longer and messier clock than the models assume.</div>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>Economic Calendar</h4>
              <div className="cal-row"><span className="cal-date">Aug 12</span><span>CPI (July)</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span className="on"></span></span></div>
              <div className="cal-row"><span className="cal-date">Aug 14</span><span>Retail Sales</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span></span></span></div>
              <div className="cal-row"><span className="cal-date">Aug 21</span><span>FOMC Minutes</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span className="on"></span></span></div>
              <div className="cal-row" style={{borderBottom: '0'}}><span className="cal-date">Sep 5</span><span>Nonfarm Payrolls</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span className="on"></span></span></div>
            </div>
            <div className="sidebar-box">
              <h4>Related Research</h4>
              <ul className="sidebar-list">
                <li><span className="rank">01</span><a href="/research">The Yield Curve Just Un-Inverted</a></li>
                <li><span className="rank">02</span><a href="/research">Central Banks Are Running Out of Synchronized Room</a></li>
                <li><span className="rank">03</span><a href="/research">Employment Data Is Getting Harder to Trust</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Macro moves markets. Understand it first.</h2>
          <p>Weekly macro analysis, delivered free.</p>
          <NewsletterForm idPrefix="macro-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
