import NewsletterForm from "@/components/NewsletterForm";
import Watchlist from "@/components/Watchlist";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data & Dashboards",
  description: "Interactive reference dashboards from The Ledger Brief: sector heatmap, yield curve, economic indicators, and valuation metrics.",
};

export default function DataPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Data &amp; Dashboards</p>
        <h1>The numbers, without the noise.</h1>
        <p>Reference dashboards pulled together from public data each week — sector performance, the yield curve, valuation multiples, and the calendar of what's coming next.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="section-head reveal"><div><p className="section-label">Dashboard</p><h2>Sector Heatmap</h2></div></div>
        <div className="heatmap reveal">
          <div className="heat-cell" style={{background: '#4C8B6C'}}><b>Tech</b><span>+0.4%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>Health</b><span>+1.9%</span></div>
          <div className="heat-cell" style={{background: '#4C8B6C'}}><b>Fin</b><span>+0.8%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>Energy</b><span>-0.5%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>Indu</b><span>+2.4%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>Cnsm</b><span>+1.9%</span></div>
          <div className="heat-cell" style={{background: '#8B1E2D'}}><b>REIT</b><span>-2.0%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>Util</b><span>+1.9%</span></div>
          <div className="heat-cell" style={{background: '#B5697A'}}><b>Comm</b><span>-1.4%</span></div>
          <div className="heat-cell" style={{background: '#1B5E3F'}}><b>Mat</b><span>+1.9%</span></div>
        </div>
        <p style={{fontSize: '12.5px', color: 'var(--ink-soft)', margin: '0 0 56px'}}>Illustrative sector performance, single session · not investment advice.</p>

        <div className="section-head reveal"><div><p className="section-label">Fixed Income</p><h2>Yield Curve</h2></div></div>
        <svg className="yield-chart reveal" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" fontFamily="Inter, -apple-system, sans-serif" style={{fontVariantNumeric: 'tabular-nums'}}>
          <line x1="40" y1="160" x2="580" y2="160" stroke="#E8E8E8"/>
          <line x1="40" y1="20" x2="40" y2="160" stroke="#E8E8E8"/>
          <polyline points="40,132 130,104 220,90 310,86 400,84 490,76 580,72" fill="none" stroke="#8B1E2D" strokeWidth="2"/>
          <g fill="#5F6368" fontSize="11">
            <text x="34" y="176" textAnchor="middle">1M</text><text x="130" y="176" textAnchor="middle">1Y</text>
            <text x="220" y="176" textAnchor="middle">2Y</text><text x="310" y="176" textAnchor="middle">5Y</text>
            <text x="400" y="176" textAnchor="middle">10Y</text><text x="490" y="176" textAnchor="middle">20Y</text><text x="580" y="176" textAnchor="middle">30Y</text>
          </g>
        </svg>

        <div className="section-head reveal" style={{marginTop: '56px'}}><div><p className="section-label">Economy</p><h2>Key Indicators</h2></div></div>
        <div className="tile-grid reveal">
          <div className="tile"><span className="tile-label">CPI (YoY)</span><span className="tile-val">2.9%</span><span className="tile-chg down">&#9660; -0.1pt</span></div>
          <div className="tile"><span className="tile-label">Unemployment</span><span className="tile-val">4.0%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Unchanged</span></div>
          <div className="tile"><span className="tile-label">GDP Growth</span><span className="tile-val">2.1%</span><span className="tile-chg up">&#9650; +0.2pt</span></div>
          <div className="tile"><span className="tile-label">Fed Funds Rate</span><span className="tile-val">4.50%</span><span className="tile-chg" style={{color: 'var(--ink-soft)'}}>Held</span></div>
        </div>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal"><div><p className="section-label">Valuation</p><h2>Index Valuation Metrics</h2></div></div>
            <table className="data-table reveal">
              <thead><tr><th>Index</th><th>Fwd P/E</th><th>P/B</th><th>Div. Yield</th></tr></thead>
              <tbody>
                <tr><td>S&amp;P 500</td><td>21.4x</td><td>4.6x</td><td>1.3%</td></tr>
                <tr><td>Nasdaq 100</td><td>27.8x</td><td>7.1x</td><td>0.7%</td></tr>
                <tr><td>Russell 2000</td><td>18.2x</td><td>2.3x</td><td>1.6%</td></tr>
                <tr><td>MSCI EAFE</td><td>14.6x</td><td>2.0x</td><td>2.9%</td></tr>
                <tr><td>MSCI Emerging Mkts</td><td>12.9x</td><td>1.7x</td><td>2.7%</td></tr>
              </tbody>
            </table>

            <div className="section-head reveal"><div><p className="section-label">Watchlist</p><h2>My Watchlist</h2></div></div>
            <p style={{color: 'var(--ink-soft)', fontSize: '13.5px', margin: '-16px 0 20px'}}>Stored in this browser tab only — it clears on reload. Add a ticker to try it.</p>
            <Watchlist />
          </div>
          <aside>
            <div className="sidebar-box">
              <h4>Economic Calendar</h4>
              <div className="cal-row"><span className="cal-date">Aug 12</span><span>CPI (July)</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span className="on"></span></span></div>
              <div className="cal-row"><span className="cal-date">Aug 14</span><span>Retail Sales</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span></span></span></div>
              <div className="cal-row" style={{borderBottom: '0'}}><span className="cal-date">Aug 21</span><span>FOMC Minutes</span><span className="cal-impact"><span className="on"></span><span className="on"></span><span className="on"></span></span></div>
            </div>
            <div className="sidebar-box">
              <h4>Related Research</h4>
              <ul className="sidebar-list">
                <li><span className="rank">01</span><a href="/research">What the Sector Heatmap Isn't Telling You</a></li>
                <li><span className="rank">02</span><a href="/research">Reading Market Breadth Like a Professional</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Data is only useful with context</h2>
          <p>We add the context every Tuesday, free.</p>
          <NewsletterForm idPrefix="data-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
