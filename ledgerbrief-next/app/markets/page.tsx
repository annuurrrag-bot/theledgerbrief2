import NewsletterForm from "@/components/NewsletterForm";
import { getTreasuryCurve } from "@/lib/treasury";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Major indices, commodities, currencies, and treasury yields, with market context from The Ledger Brief.",
};

export const dynamic = "force-dynamic";

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

async function getMarkets(): Promise<MarketResponse | null> {
  try {
    const headerList = headers();
    const host = headerList.get("host");

    if (!host) {
      return null;
    }

    const protocol = host.includes("localhost") ? "http" : "https";

    const response = await fetch(
      `${protocol}://${host}/api/markets`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Markets page fetch error:", error);
    return null;
  }
}

function formatNumber(
  value: number | null,
  decimals = 2
): string {
  if (value === null) return "—";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatAssetValue(
  name: string,
  value: number | null
): string {
  if (value === null) return "—";

  if (
    name === "GOLD" ||
    name === "WTI CRUDE" ||
    name === "BRENT CRUDE" ||
    name === "BITCOIN"
  ) {
    return `$${formatNumber(
      value,
      name === "BITCOIN" ? 0 : 2
    )}`;
  }

  if (name === "EUR/USD") {
    return value.toFixed(4);
  }

  if (name === "USD/JPY") {
    return value.toFixed(2);
  }

  return formatNumber(value, 2);
}

function Change({
  value,
}: {
  value: number | null;
}) {
  if (value === null) {
    return <span className="tile-chg">—</span>;
  }

  const positive = value >= 0;

  return (
    <span
      className={`tile-chg ${
        positive ? "up" : "down"
      }`}
    >
      {positive ? "▲" : "▼"}{" "}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function findQuote(
  quotes: MarketQuote[],
  name: string
): MarketQuote | undefined {
  return quotes.find((quote) => quote.name === name);
}

function formatUpdatedAt(date: string | undefined) {
  if (!date) return "Unavailable";

  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function MarketsPage() {
  const [markets, treasury] = await Promise.all([
    getMarkets(),
    getTreasuryCurve(),
  ]);

  const quotes = markets?.quotes ?? [];

  const indices = [
    "S&P 500",
    "NASDAQ COMPOSITE",
    "DOW JONES",
    "RUSSELL 2000",
    "FTSE 100",
    "EURO STOXX 50",
    "NIKKEI 225",
    "CBOE VOLATILITY (VIX)",
  ];

  const crossAssets = [
    "GOLD",
    "WTI CRUDE",
    "BRENT CRUDE",
    "BITCOIN",
    "US DOLLAR INDEX",
    "EUR/USD",
    "USD/JPY",
  ];

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">
          Markets · Updated Automatically
        </p>

        <h1>Markets, at a glance.</h1>

        <p>
          Major indices, commodities, currencies,
          and treasuries — with the context raw
          numbers don't give you. Market data may
          be delayed depending on the underlying
          venue.
        </p>

        <p
          style={{
            fontSize: "12px",
            marginTop: "16px",
            color: "var(--ink-soft)",
          }}
        >
          Market data updated{" "}
          {formatUpdatedAt(markets?.updatedAt)}
        </p>
      </div>

      <div
        className="wrap"
        style={{ paddingTop: "56px" }}
      >
        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Market Snapshot
            </p>

            <h2>Major Indices</h2>
          </div>
        </div>

        <div className="tile-grid reveal">
          {indices.map((name) => {
            const quote = findQuote(quotes, name);

            return (
              <div className="tile" key={name}>
                <span className="tile-label">
                  {name}
                </span>

                <span className="tile-val">
                  {formatNumber(
                    quote?.value ?? null,
                    2
                  )}
                </span>

                <Change
                  value={
                    quote?.changePercent ?? null
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Commodities &amp; Currencies
            </p>

            <h2>Cross-Asset Pulse</h2>
          </div>
        </div>

        <div className="data-table-wrap reveal">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Level</th>
                <th>1D</th>
              </tr>
            </thead>

            <tbody>
              {crossAssets.map((name) => {
                const quote = findQuote(
                  quotes,
                  name
                );

                const change =
                  quote?.changePercent ?? null;

                return (
                  <tr key={name}>
                    <td>{name}</td>

                    <td>
                      {formatAssetValue(
                        name,
                        quote?.value ?? null
                      )}
                    </td>

                    <td
                      className={
                        change === null
                          ? ""
                          : change >= 0
                          ? "up"
                          : "down"
                      }
                    >
                      {change === null
                        ? "—"
                        : `${change >= 0 ? "+" : ""}${change.toFixed(
                            2
                          )}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal">
              <div>
                <p className="section-label">
                  Fixed Income
                </p>

                <h2>Treasury Yields</h2>
              </div>
            </div>

            <table className="data-table reveal">
              <thead>
                <tr>
                  <th>Tenor</th>
                  <th>Yield</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>2-Year</td>
                  <td>
                    {treasury?.rates["2Y"] !==
                    null
                      ? `${treasury?.rates[
                          "2Y"
                        ]?.toFixed(2)}%`
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td>5-Year</td>
                  <td>
                    {treasury?.rates["5Y"] !==
                    null
                      ? `${treasury?.rates[
                          "5Y"
                        ]?.toFixed(2)}%`
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td>10-Year</td>
                  <td>
                    {treasury?.rates["10Y"] !==
                    null
                      ? `${treasury?.rates[
                          "10Y"
                        ]?.toFixed(2)}%`
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <td>30-Year</td>
                  <td>
                    {treasury?.rates["30Y"] !==
                    null
                      ? `${treasury?.rates[
                          "30Y"
                        ]?.toFixed(2)}%`
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>Data Notes</h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                Index, commodity, cryptocurrency,
                and FX quotes update automatically
                and may be delayed. Treasury yields
                are sourced separately from U.S.
                Treasury data.
              </p>
            </div>

            <div className="sidebar-box">
              <h4>Related Research</h4>

              <ul className="sidebar-list">
                <li>
                  <span className="rank">
                    01
                  </span>

                  <a href="/research">
                    Credit Spreads Are Quietly
                    Doing Something Unusual
                  </a>
                </li>

                <li>
                  <span className="rank">
                    02
                  </span>

                  <a href="/research">
                    Reading Market Breadth Like
                    a Professional
                  </a>
                </li>

                <li>
                  <span className="rank">
                    03
                  </span>

                  <a href="/research">
                    The Case Against Chasing
                    Momentum Into Earnings
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>
            Markets move fast. Context shouldn't
            lag.
          </h2>

          <p>
            Get the week's market read every
            Tuesday.
          </p>

          <NewsletterForm
            idPrefix="markets-mid"
            variant="inline"
          />
        </div>
      </div>
    </main>
  );
}
