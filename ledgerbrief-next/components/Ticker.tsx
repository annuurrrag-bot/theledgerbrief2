"use client";

import { useCallback, useEffect, useState } from "react";

type MarketQuote = {
  symbol: string;
  name: string;
  value: number | null;
  changePercent: number | null;
};

type MarketResponse = {
  updatedAt: string;
  quotes: MarketQuote[];
};

const REFRESH_INTERVAL = 30_000; // 30 seconds

function formatValue(name: string, value: number | null): string {
  if (value === null) return "—";

  switch (name) {
    case "S&P 500":
    case "NASDAQ":
    case "DOW JONES":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    case "GOLD":
    case "WTI CRUDE":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    case "BITCOIN":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

    case "10Y YIELD":
      return `${value.toFixed(2)}%`;

    case "US DOLLAR":
      return value.toFixed(2);

    default:
      return value.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });
  }
}

function formatChange(change: number | null): string {
  if (change === null) return "—";

  const sign = change >= 0 ? "+" : "";

  return `${sign}${change.toFixed(2)}%`;
}

export default function Ticker() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/market", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Market API returned ${response.status}`);
      }

      const data: MarketResponse = await response.json();

      if (Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error("Ticker market data error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();

    const interval = window.setInterval(
      fetchMarketData,
      REFRESH_INTERVAL
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchMarketData]);

  const sequence = [...quotes, ...quotes];

  return (
    <div
      className="ticker-bar site-ticker"
      role="region"
      aria-label="Live market ticker"
    >
      <div className="ticker-track">
        {loading && quotes.length === 0 ? (
          <span className="ticker-item">
            <span className="ticker-name">MARKETS</span>
            <span className="ticker-val">Loading…</span>
          </span>
        ) : quotes.length === 0 ? (
          <span className="ticker-item">
            <span className="ticker-name">MARKETS</span>
            <span className="ticker-val">Data unavailable</span>
          </span>
        ) : (
          sequence.map((quote, index) => {
            const duplicate = index >= quotes.length;
            const change = quote.changePercent;
            const positive = typeof change === "number" && change >= 0;

            return (
              <span
                className="ticker-item"
                key={`${quote.symbol}-${index}`}
                aria-hidden={duplicate}
              >
                <span className="ticker-name">
                  {quote.name}
                </span>

                <span className="ticker-val">
                  {formatValue(quote.name, quote.value)}
                </span>

                <span
                  className={
                    change === null
                      ? ""
                      : positive
                        ? "up"
                        : "down"
                  }
                >
                  {change === null
                    ? "—"
                    : positive
                      ? "▲"
                      : "▼"}{" "}
                  {formatChange(change)}
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
