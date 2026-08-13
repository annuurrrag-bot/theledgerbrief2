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

const REFRESH_INTERVAL = 30_000;

function formatValue(name: string, value: number | null): string {
  if (value === null) return "—";

  switch (name) {
    case "S&P 500":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    case "NASDAQ":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    case "DOW JONES":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    case "GOLD":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    case "BITCOIN":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

    case "WTI CRUDE":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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

function isPositive(change: number | null): boolean {
  return typeof change === "number" && change >= 0;
}

export default function Ticker() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/market", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Market API returned ${response.status}`);
      }

      const data: MarketResponse = await response.json();

      setQuotes(data.quotes);
      setLastUpdated(data.updatedAt);
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

  /*
   * Keep the ticker moving smoothly by duplicating the
   * live data once. The second copy is hidden from screen
   * readers to avoid duplicate announcements.
   */
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
        ) : (
          sequence.map((quote, index) => {
            const duplicate = index >= quotes.length;
            const positive = isPositive(quote.changePercent);

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
                  {formatValue(
                    quote.name,
                    quote.value
                  )}
                </span>

                <span
                  className={
                    quote.changePercent === null
                      ? ""
                      : positive
                        ? "up"
                        : "down"
                  }
                >
                  {quote.changePercent === null
                    ? "—"
                    : positive
                      ? "▲"
                      : "▼"}{" "}
                  {formatChange(
                    quote.changePercent
                  )}
                </span>
              </span>
            );
          })
        )}
      </div>

      {lastUpdated && (
        <span
          className="ticker-live-status"
          aria-label="Market data update status"
        >
          LIVE
        </span>
      )}
    </div>
  );
}
