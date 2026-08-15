import NewsletterForm from "@/components/NewsletterForm";
import {
  MODEL_PORTFOLIO,
  getPortfolioPerformance,
} from "@/lib/portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Portfolio construction research: diversification, risk management, asset allocation, factor investing, and long-term strategy.",
};

export const revalidate = 3600;

const COLORS = [
  "#E32636",
  "#173F6B",
  "#3E7C73",
  "#D89B2B",
  "#C7C9CC",
];

function formatReturn(value: number | null) {
  if (value === null) return "—";

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function returnClass(value: number | null) {
  if (value === null) return "";

  return value >= 0 ? "up" : "down";
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function createPortfolioGradient() {
  let runningTotal = 0;

  const segments = MODEL_PORTFOLIO.map(
    (asset, index) => {
      const start = runningTotal;
      const end = runningTotal + asset.weight;

      runningTotal = end;

      return `${COLORS[index]} ${start}% ${end}%`;
    }
  );

  return `conic-gradient(${segments.join(", ")})`;
}

export default async function PortfolioPage() {
  const performance =
    await getPortfolioPerformance();

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">
          The Ledger Brief · Model Allocation
        </p>

        <h1>
          Building portfolios that survive contact with reality.
        </h1>

        <p>
          Construction, risk, allocation, and long-term strategy — the
          discipline layer that turns good research into good outcomes.
        </p>

        <p
          style={{
            fontSize: "12px",
            marginTop: "16px",
            color: "var(--ink-soft)",
          }}
        >
          Model allocation · Rebalanced periodically · Market data updated{" "}
{formatUpdatedAt(performance.updatedAt)}
        </p>
      </div>

      <div
        className="wrap"
        style={{ paddingTop: "56px" }}
      >
        {/* ALLOCATION */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Illustrative
            </p>

            <h2>
              Strategic Allocation
            </h2>
          </div>
        </div>

        <div
          className="allocation-wrap reveal"
          style={{ marginBottom: "56px" }}
        >
          <div
            className="donut"
            style={{
              background:
                createPortfolioGradient(),
            }}
          />

          <ul className="alloc-legend">
            {MODEL_PORTFOLIO.map(
              (asset, index) => (
                <li key={asset.name}>
                  <span
                    className="swatch"
                    style={{
                      background:
                        COLORS[index],
                    }}
                  />

                  {asset.name} —{" "}
                  {asset.weight}%
                </li>
              )
            )}
          </ul>
        </div>

        <p
          style={{
            fontSize: "12.5px",
            color: "var(--ink-soft)",
            margin: "-40px 0 56px",
          }}
        >
          Strategic model allocation for research and discussion purposes ONLY · not a
personalized recommendation.
        </p>

        {/* PERFORMANCE */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Performance
            </p>

            <h2>
              Model Portfolio Performance
            </h2>
          </div>
        </div>

        <div
          className="tile-grid cols-3 reveal"
          style={{ marginBottom: "24px" }}
        >
          <div className="tile">
            <span className="tile-label">
              1 Month
            </span>

            <span
              className={`tile-val ${returnClass(
                performance.portfolio.oneMonth
              )}`}
            >
              {formatReturn(
                performance.portfolio.oneMonth
              )}
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              Year to Date
            </span>

            <span
              className={`tile-val ${returnClass(
                performance.portfolio.ytd
              )}`}
            >
              {formatReturn(
                performance.portfolio.ytd
              )}
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              1 Year
            </span>

            <span
              className={`tile-val ${returnClass(
                performance.portfolio.oneYear
              )}`}
            >
              {formatReturn(
                performance.portfolio.oneYear
              )}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: "12.5px",
            color: "var(--ink-soft)",
            margin: "0 0 56px",
          }}
        >
          Performance is calculated from the weighted proxy holdings in the
          illustrative model portfolio. Market data may be delayed · not
          investment advice.
        </p>

        {/* ASSET BREAKDOWN */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Components
            </p>

            <h2>
              Asset-Class Performance
            </h2>
          </div>
        </div>

        <div className="data-table-wrap reveal">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Proxy</th>
                <th>Weight</th>
                <th>1M</th>
                <th>YTD</th>
                <th>1Y</th>
              </tr>
            </thead>

            <tbody>
              {performance.assets.map(
                (asset) => (
                  <tr key={asset.symbol}>
                    <td>
                      {asset.name}
                    </td>

                    <td>
                      {asset.symbol}
                    </td>

                    <td>
                      {asset.weight}%
                    </td>

                    <td
                      className={returnClass(
                        asset.oneMonth
                      )}
                    >
                      {formatReturn(
                        asset.oneMonth
                      )}
                    </td>

                    <td
                      className={returnClass(
                        asset.ytd
                      )}
                    >
                      {formatReturn(
                        asset.ytd
                      )}
                    </td>

                    <td
                      className={returnClass(
                        asset.oneYear
                      )}
                    >
                      {formatReturn(
                        asset.oneYear
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* TOPIC LIBRARY */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Topics
            </p>

            <h2>
              Portfolio Construction Library
            </h2>
          </div>
        </div>

        <div className="card-grid reveal">
          <article className="r-card">
            <span className="card-tag">
              Topic 01
            </span>

            <h3>Diversification</h3>

            <p>
              Why traditional asset-class diversification has weakened, and
              what a more resilient structure looks like.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>

          <article className="r-card">
            <span className="card-tag">
              Topic 02
            </span>

            <h3>Risk Management</h3>

            <p>
              Position sizing, drawdown tolerance, and the difference between
              volatility and permanent loss.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>

          <article className="r-card">
            <span className="card-tag">
              Topic 03
            </span>

            <h3>Asset Allocation</h3>

            <p>
              Building an allocation framework around your actual time horizon,
              not a rule of thumb.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>

          <article className="r-card">
            <span className="card-tag">
              Topic 04
            </span>

            <h3>Long-Term Investing</h3>

            <p>
              Why time in the market keeps beating timing the market, and how
              to actually stay the course.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>

          <article className="r-card">
            <span className="card-tag">
              Topic 05
            </span>

            <h3>Factor Investing</h3>

            <p>
              Value, momentum, quality, and size, explained without the academic
              jargon.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>

          <article className="r-card">
            <span className="card-tag">
              Topic 06
            </span>

            <h3>Case Studies</h3>

            <p>
              Real portfolio decisions, real outcomes — what worked, what
              didn't, and why.
            </p>

            <div className="card-meta">
              <a
                href="/research"
                className="link-underline"
                style={{ border: "0" }}
              >
                Explore research &rarr;
              </a>
            </div>
          </article>
        </div>

        <div className="pullquote reveal">
          The best portfolio isn't the one with the highest expected return.
          It's the one you can actually hold through a bad decade.
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>
            Portfolio thinking, not just stock picks
          </h2>

          <p>
            Weekly research on construction, risk, and allocation.
          </p>

          <NewsletterForm
            idPrefix="portfolio-mid"
            variant="inline"
          />
        </div>
      </div>
    </main>
  );
}
