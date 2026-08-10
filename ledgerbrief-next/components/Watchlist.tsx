"use client";

import { useState } from "react";

export default function Watchlist() {
  const [tickers, setTickers] = useState<string[]>(["NVEX", "SOLR"]);
  const [value, setValue] = useState("");

  function addTicker() {
    const v = value.trim().toUpperCase();
    if (v && !tickers.includes(v)) setTickers((t) => [...t, v]);
    setValue("");
  }

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", maxWidth: "320px" }}>
        <input
          type="text"
          placeholder="Add ticker, e.g. NVEX"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTicker()}
          style={{ flex: "1", padding: "10px 12px", border: "1px solid var(--border)", font: "400 14px var(--sans)" }}
        />
        <button className="btn-outline" style={{ padding: "10px 18px" }} onClick={addTicker}>
          Add
        </button>
      </div>
      <table className="data-table" style={{ marginBottom: "16px" }}>
        <thead><tr><th>Ticker</th><th></th></tr></thead>
        <tbody>
          {tickers.length === 0 ? (
            <tr><td colSpan={2} style={{ color: "var(--ink-soft)" }}>No tickers added yet.</td></tr>
          ) : (
            tickers.map((t, i) => (
              <tr key={t}>
                <td>{t}</td>
                <td style={{ textAlign: "right" }}>
                  <button
                    className="pill"
                    aria-label={`Remove ${t}`}
                    onClick={() => setTickers((cur) => cur.filter((x) => x !== t))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
