import NewsletterForm from "@/components/NewsletterForm";
import { getEquitiesSnapshot } from "@/lib/equities";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equities",
  description:
    "Sector-by-sector equity research covering technology, healthcare, financials, energy, industrials, consumer, real estate, and utilities.",
};

export const revalidate = 300;

function formatChange(value: number | null) {
  if (value === null) {
    return {
      text: "—",
      className: "",
    };
  }

  return {
    text: `${value >= 0 ? "▲ +" : "▼ "}${value.toFixed(2)}%`,
    className: value >= 0 ? "up" : "down",
  };
}

function heatColor(value: number | null) {
  if (value === null) return "#8A8A8A";

  if (value >= 2) return "#1B5E3F";
  if (value >= 1) return "#2E7D57";
  if (value >= 0.3) return "#5C9878";
  if (value >= 0) return "#879A90";

  if (value <= -2) return "#8B1E2D";
  if (value <= -1) return "#A33A4D";
  if (value <= -0.3) return "#BF6A7A";

  return "#A88C93";
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

export default async function EquitiesPage() {
  const snapshot = await getEquitiesSnapshot();

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">
          Equities · Updated Automatically
        </p>

        <h1>
          Sector-by-sector, company-by-company.
        </h1>

        <p>
          Eight sectors, each covered on its own terms — the capital
          allocation decisions, competitive dynamics, and valuation
          questions that actually move individual stocks.
        </p>

        <p
          style={{
            fontSize: "12px",
            marginTop: "16px",
            color: "var(--ink-soft)",
          }}
        >
          Market data updated {formatUpdatedAt(snapshot.updatedAt)} ·
          quotes may be delayed.
        </p>
      </div>

      <div
        className="wrap"
        style={{ paddingTop: "56px" }}
      >
        {/* SECTORS */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Coverage
            </p>

            <h2>
              Browse by Sector
            </h2>
          </div>
        </div>

        <div className="sector-grid reveal">
          {snapshot.sectors.map((sector) => {
            const move = formatChange(
              sector.changePercent
            );

            return (
              <a
                href="/research"
                className="sector-card"
                key={sector.symbol}
              >
                <span
                  className={`sector-chg ${move.className}`}
                >
                  {move.text}
                </span>

                <h3>
                  {sector.name}
                </h3>

                <p>
                  {sector.description}
                </p>
              </a>
            );
          })}
        </div>

        {/* HEATMAP */}

        <div className="section-head reveal">
          <div>
            <p className="section-label">
              Data
            </p>

            <h2>
              Equity Heatmap
            </h2>
          </div>
        </div>

        <div className="heatmap reveal">
          {snapshot.heatmap.map((company) => {
            const change = company.changePercent;

            return (
              <div
                className="heat-cell"
                key={company.symbol}
                title={company.name}
                style={{
                  background: heatColor(change),
                }}
              >
                <b>
                  {company.symbol}
                </b>

                <span>
                  {change === null
                    ? "—"
                    : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
                </span>
              </div>
            );
          })}
        </div>

        <p
          style={{
            fontSize: "12.5px",
            color: "var(--ink-soft)",
            margin: "0 0 56px",
          }}
        >
          Selected large-cap companies · daily percentage move ·
          market data may be delayed · not investment advice.
        </p>

        {/* RESEARCH */}

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal">
              <div>
                <p className="section-label">
                  Featured
                </p>

                <h2>
                  Latest Equities Research
                </h2>
              </div>
            </div>

            <div className="card-grid cols-2 reveal">
              <article className="r-card">
                <span className="card-tag">
                  Equities
                </span>

                <h3>
                  Semiconductor Capex Is Diverging From Semiconductor Demand
                </h3>

                <p>
                  Capital spending plans across the industry no longer track
                  order books.
                </p>

                <div className="card-meta">
                  <span>7 min read</span>
                  <span>·</span>
                  <span>Aug 1, 2026</span>
                </div>
              </article>

              <article className="r-card">
                <span className="card-tag">
                  Equities
                </span>

                <h3>
                  Valuing the Unprofitable
                </h3>

                <p>
                  Discounted cash flow breaks down here. What actually works
                  instead.
                </p>

                <div className="card-meta">
                  <span>14 min read</span>
                  <span>·</span>
                  <span>Jul 7, 2026</span>
                </div>
              </article>

              <article className="r-card">
                <span className="card-tag">
                  Equities
                </span>

                <h3>
                  Energy Capex Discipline Is Ending, Quietly
                </h3>

                <p>
                  After three years of restraint, spending plans are turning
                  back up.
                </p>

                <div className="card-meta">
                  <span>9 min read</span>
                  <span>·</span>
                  <span>Jun 20, 2026</span>
                </div>
              </article>

              <article className="r-card">
                <span className="card-tag">
                  Equities
                </span>

                <h3>
                  The Quiet Compounders Wall Street Keeps Overlooking
                </h3>

                <p>
                  A framework for spotting durable compounders before consensus
                  catches on.
                </p>

                <div className="card-meta">
                  <span>11 min read</span>
                  <span>·</span>
                  <span>Jul 21, 2026</span>
                </div>
              </article>
            </div>

            <div className="load-more-wrap">
              <a
                href="/research"
                className="btn-outline"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                See all equities research
              </a>
            </div>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>
                Data Notes
              </h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                Sector performance is represented using major U.S. sector ETFs.
                The heatmap tracks selected large-cap companies and updates
                automatically. Quotes may be delayed.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>
            Sector research, without the sell-side spin
          </h2>

          <p>
            Independent equity analysis, every week.
          </p>

          <NewsletterForm
            idPrefix="equities-mid"
            variant="inline"
          />
        </div>
      </div>
    </main>
  );
}
