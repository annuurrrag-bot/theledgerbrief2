import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets",
  description: "Major indices, market movers, commodities, currencies, and treasury yields, with weekly context from The Ledger Brief.",
};

export default function MarketsPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Markets · Updated Weekly</p>
        <h1>Markets, at a glance.</h1>
        <p>Major indices, commodities, currencies, and treasuries — with the context that raw numbers don't give you. Figures are illustrative and refresh with each issue, not in real time.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="section-head reveal"><div><p className="section-label">Market Snapshot</p><h2>Major Indices</h2></div></div>
        <div className="tile-grid reveal">
          <div className="tile"><span className="tile-label">S&amp;P 500</span><span className="tile-val">5,842.11</span><span className="tile-chg up">&#9650; +0.42%</span></div>
          <div className="tile"><span className="tile-label">Nasdaq Composite</span><span className="tile-val">19,003.55</span><span className="tile-chg up">&#9650; +0.61%</span></div>
          <div className="tile"><span className="tile-label">Dow Jones</span><span className="tile-val">41,220.88</span><span className="tile-chg down">&#9660; -0.18%</span></div>
          <div className="tile"><span className="tile-label">Russell 2000</span><span className="tile-val">2,184.30</span><span className="tile-chg up">&#9650; +0.24%</span></div>
          <div className="tile"><span className="tile-label">FTSE 100</span><span className="tile-val">8,211.40</span><span className="tile-chg up">&#9650; +0.15%</span></div>
          <div className="tile"><span className="tile-label">Euro Stoxx 50</span><span className="tile-val">4,987.60</span><span className="tile-chg down">&#9660; -0.09%</span></div>
          <div className="tile"><span className="tile-label">Nikkei 225</span><span className="tile-val">39,540.12</span><span className="tile-chg up">&#9650; +0.73%</span></div>
          <div className="tile"><span className="tile-label">CBOE Volatility (VIX)</span><span className="tile-val">14.82</span><span className="tile-chg down">&#9660; -3.10%</span></div>
        </div>

        <div className="section-head reveal"><div><p className="section-label">Movers</p><h2>Market Movers</h2></div></div>
        <div className="data-table-wrap reveal">
          <table className="data-table">
            <caption className="visually-hidden">Top gainers and decliners</caption>
            <thead><tr><th>Gainers</th><th>Price</th><th>Change</th></tr></thead>
            <tbody>
              <tr><td>NVEX</td><td>412.88</td><td className="up">+6.42%</td></tr>
              <tr><td>SOLR</td><td>88.14</td><td className="up">+5.10%</td></tr>
              <tr><td>QNTM</td><td>54.02</td><td className="up">+4.87%</td></tr>
            </tbody>
          </table>
          <table className="data-table">
            <caption className="visually-hidden">Top decliners</caption>
            <thead><tr><th>Decliners</th><th>Price</th><th>Change</th></tr></thead>
            <tbody>
              <tr><td>RTLX</td><td>21.44</td><td className="down">-7.18%</td></tr>
              <tr><td>BLDX</td><td>63.90</td><td className="down">-4.62%</td></tr>
              <tr><td>SHPG</td><td>109.30</td><td className="down">-3.95%</td></tr>
            </tbody>
          </table>
        </div>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal"><div><p className="section-label">Commodities &amp; Currencies</p><h2>Cross-Asset Pulse</h2></div></div>
            <table className="data-table reveal">
              <thead><tr><th>Asset</th><th>Level</th><th>1D</th><th>1M</th></tr></thead>
              <tbody>
                <tr><td>Gold</td><td>$2,412.30</td><td className="up">+0.27%</td><td className="up">+2.10%</td></tr>
                <tr><td>WTI Crude</td><td>$78.64</td><td className="up">+0.35%</td><td className="down">-1.80%</td></tr>
                <tr><td>Brent Crude</td><td>$82.11</td><td className="up">+0.31%</td><td className="down">-1.42%</td></tr>
                <tr><td>Bitcoin</td><td>$71,540</td><td className="down">-1.12%</td><td className="up">+8.60%</td></tr>
                <tr><td>US Dollar Index</td><td>104.12</td><td className="up">+0.09%</td><td className="up">+0.85%</td></tr>
                <tr><td>EUR/USD</td><td>1.0842</td><td className="down">-0.06%</td><td className="down">-0.40%</td></tr>
                <tr><td>USD/JPY</td><td>151.24</td><td className="up">+0.22%</td><td className="up">+1.15%</td></tr>
              </tbody>
            </table>

            <div className="section-head reveal"><div><p className="section-label">Fixed Income</p><h2>Treasury Yields</h2></div></div>
            <table className="data-table reveal">
              <thead><tr><th>Tenor</th><th>Yield</th><th>1W Change</th></tr></thead>
              <tbody>
                <tr><td>2-Year</td><td>4.41%</td><td className="down">-0.05%</td></tr>
                <tr><td>5-Year</td><td>4.32%</td><td className="down">-0.04%</td></tr>
                <tr><td>10-Year</td><td>4.28%</td><td className="down">-0.03%</td></tr>
                <tr><td>30-Year</td><td>4.46%</td><td className="up">+0.02%</td></tr>
              </tbody>
            </table>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>Market Breadth</h4>
              <div style={{display: 'flex', gap: '2px', height: '14px', marginBottom: '10px'}}>
                <div style={{width: '64%', background: 'var(--green)'}}></div><div style={{width: '36%', background: 'var(--accent)'}}></div>
              </div>
              <p style={{fontSize: '12.5px', color: 'var(--ink-soft)', margin: '0'}}>64% of S&amp;P 500 constituents advancing on the week, versus 36% declining — breadth confirming the index-level move.</p>
            </div>
            <div className="sidebar-box">
              <h4>Related Research</h4>
              <ul className="sidebar-list">
                <li><span className="rank">01</span><a href="/research">Credit Spreads Are Quietly Doing Something Unusual</a></li>
                <li><span className="rank">02</span><a href="/research">Reading Market Breadth Like a Professional</a></li>
                <li><span className="rank">03</span><a href="/research">The Case Against Chasing Momentum Into Earnings</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Markets move fast. Context shouldn't lag.</h2>
          <p>Get the week's market read every Tuesday.</p>
          <NewsletterForm idPrefix="markets-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
