import NewsletterForm from "@/components/NewsletterForm";
import { getMacroSnapshot } from "@/lib/macro";
import { getTreasuryCurve } from "@/lib/treasury";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Macro",
  description:
    "Inflation, interest rates, central bank policy, GDP, employment, and the yield curve, explained clearly every week.",
};

export const revalidate = 3600;

function formatPct(value: number | null, digits = 1) {
  if (value === null) return "—";
  return `${value.toFixed(digits)}%`;
}

function formatSignedPoints(
  current: number | null,
  prior: number | null
): {
  text: string;
  className: string;
} {
  if (current === null || prior === null) {
    return {
      text: "—",
      className: "",
    };
  }

  const diff = current - prior;

  if (Math.abs(diff) < 0.01) {
    return {
      text: "Unchanged",
      className: "",
    };
  }

  return {
    text: `${diff > 0 ? "▲ +" : "▼ "}${diff.toFixed(
      1
    )}pt vs prior`,
    className: diff > 0 ? "up" : "down",
  };
}

function formatPayroll(value: number | null) {
  if (value === null) return "—";

  const rounded = Math.round(value);

  return `${rounded >= 0 ? "+" : ""}${rounded.toLocaleString(
    "en-US"
  )}K`;
}

function formatTreasuryDate(
  date: string | null | undefined
) {
  if (!date) return "Unavailable";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function curveY(
  value: number | null,
  min: number,
  max: number,
  top: number,
  bottom: number
) {
  if (value === null || max === min) {
    return (top + bottom) / 2;
  }

  const normalized = (value - min) / (max - min);

  return bottom - normalized * (bottom - top);
}

function getCurvePoints(
  values: Array<number | null>,
  xs: number[],
  top: number,
  bottom: number
) {
  const valid = values.filter(
    (value): value is number => value !== null
  );

  if (!valid.length) {
    return xs
      .map(
        (x) => `${x},${(top + bottom) / 2}`
      )
      .join(" ");
  }

  const min = Math.min(...valid);
  const max = Math.max(...valid);

  return values
    .map(
      (value, index) =>
        `${xs[index]},${curveY(
          value,
          min,
          max,
          top,
          bottom
        )}`
    )
    .join(" ");
}

export default async function MacroPage() {
  const [macro, treasury] = await Promise.all([
    getMacroSnapshot(),
    getTreasuryCurve(),
  ]);

  const headlineMove = formatSignedPoints(
    macro.inflation.headlineCpi,
    macro.inflation.headlineCpiPrior
  );

  const coreMove = formatSignedPoints(
    macro.inflation.coreCpi,
    macro.inflation.coreCpiPrior
  );

  const unemploymentMove = formatSignedPoints(
    macro.labor.unemployment,
    macro.labor.unemploymentPrior
  );

  const payrollPrior =
    macro.labor.payrollsPrior !== null
      ? formatPayroll(macro.labor.payrollsPrior)
      : "—";

  const treasuryRates = treasury?.rates ?? {
    "1M": null,
    "3M": null,
    "6M": null,
    "1Y": null,
    "2Y": null,
    "5Y": null,
    "10Y": null,
    "30Y": null,
  };

  const curveLabels = [
    "1M",
    "3M",
    "6M",
    "1Y",
    "2Y",
    "5Y",
    "10Y",
    "30Y",
  ];

  const curveValues = [
    treasuryRates["1M"],
    treasuryRates["3M"],
    treasuryRates["6M"],
    treasuryRates["1Y"],
    treasuryRates["2Y"],
    treasuryRates["5Y"],
    treasuryRates["10Y"],
    treasuryRates["30Y"],
  ];

  const xs = [40, 112, 184, 256, 328, 400, 472, 544];

  const curvePoints = getCurvePoints(
    curveValues,
    xs,
    35,
    165
  );

  const validCurve = curveValues.filter(
    (value): value is number => value !== null
  );

  const minCurve = validCurve.length
    ? Math.min(...validCurve)
    : 0;

  const maxCurve = validCurve.length
    ? Math.max(...validCurve)
    : 1;

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">
          Macro · Official Data
        </p>

        <h1>The forces behind the tape.</h1>

        <p>
          Inflation, interest rates, central bank
          policy, growth, and employment — the macro
          backdrop that ultimately drives everything
          else on this site.
        </p>

        <p
          style={{
            fontSize: "12px",
            marginTop: "16px",
            color: "var(--ink-soft)",
          }}
        >
          U.S. macro data updates automatically from
          official public releases.
        </p>
      </div>

      <div
        className="wrap"
        style={{ paddingTop: "56px" }}
      >
        <div className="section-head reveal">
          <div>
            <p className="section-label">Prices</p>
            <h2>Inflation</h2>
          </div>
        </div>

        <div className="tile-grid cols-3 reveal">
          <div className="tile">
            <span className="tile-label">
              Headline CPI (YoY)
            </span>

            <span className="tile-val">
              {formatPct(
                macro.inflation.headlineCpi
              )}
            </span>

            <span
              className={`tile-chg ${headlineMove.className}`}
            >
              {headlineMove.text}
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              Core CPI (YoY)
            </span>

            <span className="tile-val">
              {formatPct(
                macro.inflation.coreCpi
              )}
            </span>

            <span
              className={`tile-chg ${coreMove.className}`}
            >
              {coreMove.text}
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              PCE (YoY)
            </span>

            <span className="tile-val">—</span>

            <span
              className="tile-chg"
              style={{
                color: "var(--ink-soft)",
              }}
            >
              BEA feed not connected yet
            </span>
          </div>
        </div>

        <div className="section-head reveal">
          <div>
            <p className="section-label">Policy</p>
            <h2>
              Interest Rates &amp; Central Banks
            </h2>
          </div>
        </div>

        <div
          className="tile-grid cols-3 reveal"
          style={{ marginBottom: "24px" }}
        >
          <div className="tile">
            <span className="tile-label">
              <div className="tile">
  <span className="tile-label">
    Fed Funds Rate
  </span>

  <span className="tile-val">
    {macro.policy.fedUpper !== null
      ? `${macro.policy.fedUpper.toFixed(2)}%`
      : "—"}
  </span>

  <span
    className="tile-chg"
    style={{
      color: "var(--ink-soft)",
    }}
  >
    {macro.policy.fedLower !== null &&
    macro.policy.fedUpper !== null
      ? `Target range ${macro.policy.fedLower.toFixed(
          2
        )}–${macro.policy.fedUpper.toFixed(2)}%`
      : "Policy rate unavailable"}
  </span>
</div>
            </span>

            <span className="tile-val">
              {macro.policy.fedUpper.toFixed(2)}%
            </span>

            <span
              className="tile-chg"
              style={{
                color: "var(--ink-soft)",
              }}
            >
              Target range{" "}
              {macro.policy.fedLower.toFixed(2)}–
              {macro.policy.fedUpper.toFixed(2)}%
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              ECB Deposit Rate
            </span>

            <span className="tile-val">—</span>

            <span
              className="tile-chg"
              style={{
                color: "var(--ink-soft)",
              }}
            >
              Official ECB feed not connected yet
            </span>
          </div>

          <div className="tile">
            <span className="tile-label">
              BoJ Policy Rate
            </span>

            <span className="tile-val">—</span>

            <span
              className="tile-chg"
              style={{
                color: "var(--ink-soft)",
              }}
            >
              Official BoJ feed not connected yet
            </span>
          </div>
        </div>

        <div className="with-sidebar">
          <div>
            <div className="section-head reveal">
              <div>
                <p className="section-label">
                  Growth &amp; Labor
                </p>

                <h2>Employment</h2>
              </div>
            </div>

            <div
              className="tile-grid cols-3 reveal"
              style={{
                marginBottom: "56px",
              }}
            >
              <div className="tile">
                <span className="tile-label">
                  Unemployment Rate
                </span>

                <span className="tile-val">
                  {formatPct(
                    macro.labor.unemployment
                  )}
                </span>

                <span
                  className={`tile-chg ${unemploymentMove.className}`}
                >
                  {unemploymentMove.text}
                </span>
              </div>

              <div className="tile">
                <span className="tile-label">
                  Nonfarm Payrolls
                </span>

                <span className="tile-val">
                  {formatPayroll(
                    macro.labor.payrolls
                  )}
                </span>

                <span
                  className="tile-chg"
                  style={{
                    color: "var(--ink-soft)",
                  }}
                >
                  Prior {payrollPrior}
                </span>
              </div>

              <div className="tile">
                <span className="tile-label">
                  GDP Growth
                </span>

                <span className="tile-val">—</span>

                <span
                  className="tile-chg"
                  style={{
                    color: "var(--ink-soft)",
                  }}
                >
                  BEA feed not connected yet
                </span>
              </div>
            </div>

            <div className="section-head reveal">
              <div>
                <p className="section-label">
                  Fixed Income
                </p>

                <h2>Treasury Yield Curve</h2>
              </div>
            </div>

            <svg
              className="yield-chart reveal"
              viewBox="0 0 600 220"
              xmlns="http://www.w3.org/2000/svg"
              fontFamily="Inter, -apple-system, sans-serif"
              style={{
                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              <line
                x1="40"
                y1="180"
                x2="560"
                y2="180"
                stroke="#E8E8E8"
              />

              <polyline
                points={curvePoints}
                fill="none"
                stroke="#8B1E2D"
                strokeWidth="2"
              />

              {curveValues.map((value, index) => {
                if (value === null) return null;

                const y = curveY(
                  value,
                  minCurve,
                  maxCurve,
                  35,
                  165
                );

                return (
                  <circle
                    key={curveLabels[index]}
                    cx={xs[index]}
                    cy={y}
                    r="3"
                    fill={
                      index ===
                      curveValues.length - 1
                        ? "#8B1E2D"
                        : "#111111"
                    }
                  />
                );
              })}

              <g
                fill="#5F6368"
                fontSize="11"
              >
                {curveLabels.map(
                  (label, index) => (
                    <text
                      key={label}
                      x={xs[index]}
                      y="198"
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  )
                )}
              </g>
            </svg>

            <p
              style={{
                fontSize: "12.5px",
                color: "var(--ink-soft)",
                marginTop: "10px",
              }}
            >
              U.S. Treasury daily par yield curve ·{" "}
              {formatTreasuryDate(
                treasury?.date
              )}{" "}
              · not investment advice.
            </p>

            <div className="pullquote reveal">
              The business cycle isn't dead. It's
              just moving on a longer and messier
              clock than the models assume.
            </div>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>Data Status</h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                CPI, unemployment, and payroll data
                are sourced from BLS. Treasury yields
                are sourced from the U.S. Treasury.
                PCE, GDP, ECB, BoJ, and calendar data
                remain hidden until official feeds are
                connected.
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
                    The Yield Curve Just Un-Inverted
                  </a>
                </li>

                <li>
                  <span className="rank">
                    02
                  </span>
                  <a href="/research">
                    Central Banks Are Running Out of
                    Synchronized Room
                  </a>
                </li>

                <li>
                  <span className="rank">
                    03
                  </span>
                  <a href="/research">
                    Employment Data Is Getting Harder
                    to Trust
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
            Macro moves markets. Understand it
            first.
          </h2>

          <p>
            Weekly macro analysis, delivered free.
          </p>

          <NewsletterForm
            idPrefix="macro-mid"
            variant="inline"
          />
        </div>
      </div>
    </main>
  );
}
