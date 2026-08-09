"use client";

const TICKER_DATA = [
  { name: "S&P 500", val: "5,842.11", chg: "+0.42%", up: true },
  { name: "NASDAQ", val: "19,003.55", chg: "+0.61%", up: true },
  { name: "DOW JONES", val: "41,220.88", chg: "-0.18%", up: false },
  { name: "GOLD", val: "$2,412.30", chg: "+0.27%", up: true },
  { name: "BITCOIN", val: "$71,540", chg: "-1.12%", up: false },
  { name: "WTI CRUDE", val: "$78.64", chg: "+0.35%", up: true },
  { name: "10Y YIELD", val: "4.28%", chg: "-0.03%", up: false },
  { name: "US DOLLAR", val: "104.12", chg: "+0.09%", up: true },
];

export default function Ticker() {
  const seq = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="ticker-bar site-ticker" role="region" aria-label="Market ticker">
      <div className="ticker-track">
        {seq.map((t, i) => (
          <span className="ticker-item" key={i} aria-hidden={i >= TICKER_DATA.length}>
            <span className="ticker-name">{t.name}</span>
            <span className="ticker-val">{t.val}</span>
            <span className={t.up ? "up" : "down"}>
              {t.up ? "▲" : "▼"} {t.chg}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
