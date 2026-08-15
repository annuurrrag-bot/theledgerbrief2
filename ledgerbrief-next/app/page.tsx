import Link from "next/link";
import {
  getPublishedPosts,
  withIssueNumbers,
  categoryForPost,
  estimateReadingMinutes,
  excerptFromHtml,
} from "@/lib/beehiiv";
import {
  IssueRow,
  EmptyState,
  BeehiivErrorState,
} from "@/components/PostCards";
import NewsletterForm from "@/components/NewsletterForm";
import { getTreasuryCurve } from "@/lib/treasury";

export const revalidate = 120;

function formatDate(unixSeconds: number | null): string {
  if (!unixSeconds) return "";

  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTreasuryDate(date: string | null | undefined): string {
  if (!date) return "";

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

function formatRate(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(2)}%`;
}

function calculateSpread(
  twoYear: number | null,
  tenYear: number | null
): number | null {
  if (twoYear === null || tenYear === null) {
    return null;
  }

  return (tenYear - twoYear) * 100;
}

function formatSpread(value: number | null): string {
  if (value === null) return "—";

  const rounded = Math.round(value);

  if (rounded > 0) {
    return `+${rounded}`;
  }

  return `${rounded}`;
}

function curveY(
  value: number | null,
  min: number,
  max: number,
  top: number,
  bottom: number
): number {
  if (value === null) {
    return (top + bottom) / 2;
  }

  if (max === min) {
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
): string {
  const validValues = values.filter(
    (value): value is number => value !== null
  );

  if (!validValues.length) {
    return xs.map((x, index) => `${x},${(top + bottom) / 2}`).join(" ");
  }

  const min = Math.min(...validValues);
  const max = Math.max(...validValues);

  return values
    .map((value, index) => {
      return `${xs[index]},${curveY(value, min, max, top, bottom)}`;
    })
    .join(" ");
}

function getRatePoints(
  values: Array<number | null>,
  xs: number[],
  top: number,
  bottom: number
): Array<{ x: number; y: number; value: number | null }> {
  const validValues = values.filter(
    (value): value is number => value !== null
  );

  if (!validValues.length) {
    return values.map((value, index) => ({
      x: xs[index],
      y: (top + bottom) / 2,
      value,
    }));
  }

  const min = Math.min(...validValues);
  const max = Math.max(...validValues);

  return values.map((value, index) => ({
    x: xs[index],
    y: curveY(value, min, max, top, bottom),
    value,
  }));
}

export default async function HomePage() {
  const allPosts = await getPublishedPosts({ limit: 100 });
  const treasury = await getTreasuryCurve();

  const beehiivFailed = allPosts === null;

  const posts = allPosts ?? [];

  const featured = posts.slice(0, 3);
  const numbered = withIssueNumbers(posts).slice(0, 4);

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

  const curveXs = [45, 101, 156, 212, 268, 324, 379, 435];

  const fullCurvePoints = getCurvePoints(
    curveValues,
    curveXs,
    75,
    181
  );

  const fullCurveRatePoints = getRatePoints(
    curveValues,
    curveXs,
    75,
    181
  );

  const compactValues = [
    treasuryRates["1M"],
    treasuryRates["1Y"],
    treasuryRates["5Y"],
    treasuryRates["10Y"],
    treasuryRates["30Y"],
  ];

  const compactXs = [20, 90, 160, 230, 300];

  const compactCurvePoints = getCurvePoints(
    compactValues,
    compactXs,
    74,
    162
  );

  const compactCurveRatePoints = getRatePoints(
    compactValues,
    compactXs,
    74,
    162
  );

  const spread = calculateSpread(
    treasuryRates["2Y"],
    treasuryRates["10Y"]
  );

  const spreadPosition =
    spread === null
      ? 160
      : Math.max(
          20,
          Math.min(300, 160 + (spread / 100) * 140)
        );

  const fullSpreadPosition =
    spread === null
      ? 240
      : Math.max(
          45,
          Math.min(435, 240 + (spread / 100) * 195)
        );

  return (
    <main id="main">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">
              Independent Research · Est. 2025
            </p>

            <h1>
              The Ledger <span className="line2">Brief</span>
            </h1>

            <p className="hero-sub">
              Independent investment research. Delivered weekly.
            </p>

            <p className="hero-copy">
              Weekly market intelligence, deep-dive analysis, macro
              insights, business research, and long-term investment
              ideas — designed to help investors think beyond the
              headlines.
            </p>

            <div className="hero-ctas">
              <a href="#subscribe" className="btn btn-solid">
                Subscribe Free
              </a>

              <Link
                href="/research"
                className="link-underline"
              >
                Browse Research
              </Link>
            </div>

            <p className="hero-meta">
              <span>No spam</span>
              <span className="dot" aria-hidden="true" />
              <span>Unsubscribe anytime</span>
              <span className="dot" aria-hidden="true" />
              <span>Trusted by readers worldwide</span>
            </p>
          </div>

          {/* =====================================================
              LIVE MACRO VISUAL
          ===================================================== */}
          <div className="hero-viz" aria-hidden="true">
            <svg
              className="viz-full"
              viewBox="0 0 480 420"
              xmlns="http://www.w3.org/2000/svg"
              fontFamily="Inter, -apple-system, sans-serif"
              style={{
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M40 0H0V40"
                    fill="none"
                    stroke="#F1F1F1"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <rect
                x="0"
                y="0"
                width="480"
                height="420"
                fill="url(#grid)"
              />

              <rect
                x="0.5"
                y="0.5"
                width="479"
                height="419"
                fill="none"
                stroke="#E8E8E8"
              />

              <text
                x="24"
                y="30"
                fontSize="10.5"
                fill="#8B1E2D"
                letterSpacing="1.4"
              >
                LB · MACRO MONITOR
              </text>

              <line
                x1="24"
                y1="40"
                x2="456"
                y2="40"
                stroke="#E8E8E8"
                strokeWidth="1"
              />

              <text
                x="24"
                y="62"
                fontSize="9.5"
                fill="#5F6368"
                letterSpacing="0.6"
              >
                U.S. TREASURY YIELD CURVE
              </text>

              {treasury ? (
                <>
                  <polyline
                    points={fullCurvePoints}
                    fill="none"
                    stroke="#111111"
                    strokeWidth="1.5"
                  />

                  <g fill="#111111">
                    {fullCurveRatePoints.map(
                      ({ x, y, value }, index) => (
                        <circle
                          key={`${x}-${index}`}
                          cx={x}
                          cy={y}
                          r={
                            index === fullCurveRatePoints.length - 1
                              ? 3.6
                              : 2.4
                          }
                          fill={
                            index ===
                            fullCurveRatePoints.length - 1
                              ? "#8B1E2D"
                              : "#111111"
                          }
                        />
                      )
                    )}
                  </g>
                </>
              ) : (
                <>
                  <line
                    x1="45"
                    y1="128"
                    x2="435"
                    y2="128"
                    stroke="#C7C7C7"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  <text
                    x="240"
                    y="132"
                    fontSize="9"
                    fill="#8B1E2D"
                    textAnchor="middle"
                  >
                    Treasury data temporarily unavailable
                  </text>
                </>
              )}

              <g
                fontSize="9"
                fill="#5F6368"
                textAnchor="middle"
              >
                {curveLabels.map((label, index) => (
                  <text
                    key={label}
                    x={curveXs[index]}
                    y="200"
                  >
                    {label}
                  </text>
                ))}
              </g>

              <line
                x1="24"
                y1="222"
                x2="456"
                y2="222"
                stroke="#E8E8E8"
                strokeWidth="1"
              />

              <text
                x="24"
                y="242"
                fontSize="9.5"
                fill="#5F6368"
                letterSpacing="0.6"
              >
                SECTOR BREADTH — RELATIVE STRENGTH
              </text>

              <g>
                <rect
                  x="45"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.75"
                />

                <rect
                  x="81"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.4"
                />

                <rect
                  x="117"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.15"
                />

                <rect
                  x="153"
                  y="252"
                  width="32"
                  height="34"
                  fill="#8B1E2D"
                  opacity="0.45"
                />

                <rect
                  x="189"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.28"
                />

                <rect
                  x="225"
                  y="252"
                  width="32"
                  height="34"
                  fill="#8B1E2D"
                  opacity="0.22"
                />

                <rect
                  x="261"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.08"
                />

                <rect
                  x="297"
                  y="252"
                  width="32"
                  height="34"
                  fill="#8B1E2D"
                  opacity="0.55"
                />

                <rect
                  x="333"
                  y="252"
                  width="32"
                  height="34"
                  fill="#8B1E2D"
                  opacity="0.12"
                />

                <rect
                  x="369"
                  y="252"
                  width="32"
                  height="34"
                  fill="#8B1E2D"
                  opacity="0.32"
                />

                <rect
                  x="405"
                  y="252"
                  width="32"
                  height="34"
                  fill="#1B5E3F"
                  opacity="0.45"
                />
              </g>

              <g
                fontSize="8"
                fill="#5F6368"
                textAnchor="middle"
              >
                <text x="61" y="298">TC</text>
                <text x="97" y="298">FN</text>
                <text x="133" y="298">HC</text>
                <text x="169" y="298">EN</text>
                <text x="205" y="298">IN</text>
                <text x="241" y="298">CD</text>
                <text x="277" y="298">CS</text>
                <text x="313" y="298">UT</text>
                <text x="349" y="298">MT</text>
                <text x="385" y="298">RE</text>
                <text x="421" y="298">CM</text>
              </g>

              <line
                x1="24"
                y1="320"
                x2="456"
                y2="320"
                stroke="#E8E8E8"
                strokeWidth="1"
              />

              <text
                x="24"
                y="340"
                fontSize="9.5"
                fill="#5F6368"
                letterSpacing="0.6"
              >
                2S10S TREASURY SPREAD (BPS)
              </text>

              <rect
                x="45"
                y="352"
                width="390"
                height="7"
                fill="#F1F1F1"
                stroke="#E8E8E8"
                strokeWidth="1"
              />

              <line
                x1="240"
                y1="349"
                x2="240"
                y2="362"
                stroke="#C7C7C7"
                strokeWidth="1"
              />

              <circle
                cx={fullSpreadPosition}
                cy="355.5"
                r="5"
                fill="#8B1E2D"
              />

              <text
                x={fullSpreadPosition}
                y="342"
                fontSize="10"
                fill="#8B1E2D"
                textAnchor="middle"
                fontWeight="600"
              >
                {formatSpread(spread)} BPS
              </text>

              <g fontSize="8.5" fill="#5F6368">
                <text x="45" y="378">
                  −100
                </text>

                <text x="234" y="378">
                  0
                </text>

                <text x="418" y="378">
                  +100
                </text>
              </g>
            </svg>

            {/* =================================================
                COMPACT MOBILE VERSION
            ================================================= */}


            <p className="viz-caption">
              {treasury
                ? `U.S. Treasury data · ${formatTreasuryDate(
                    treasury.date
                  )} · not investment advice`
                : "U.S. Treasury data temporarily unavailable · not investment advice"}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SOCIAL PROOF
      ========================================================= */}
      <section
        className="stats-band"
        aria-label="Publication statistics"
      >
        <div className="wrap stats-grid">
          <div className="stat">
            <div className="stat-num">11,000+</div>
            <div className="stat-label">Readers</div>
          </div>

          <div className="stat">
            <div className="stat-num">40+</div>
            <div className="stat-label">Countries</div>
          </div>

          <div className="stat">
            <div className="stat-num">
              {posts.length || "150+"}
            </div>
            <div className="stat-label">
              Research Notes
            </div>
          </div>

          <div className="stat">
            <div className="stat-num">2025</div>
            <div className="stat-label">Weekly Since</div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED RESEARCH
      ========================================================= */}
      <section id="research" className="section-border">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">Featured</p>

              <h2>Featured Research</h2>

              <p className="section-lede">
                The latest published issues from The Ledger Brief.
              </p>
            </div>

            <Link
              href="/research"
              className="link-underline"
            >
              Browse all research
            </Link>
          </div>

          {beehiivFailed ? (
            <BeehiivErrorState />
          ) : featured.length === 0 ? (
            <EmptyState message="No published issues yet — check back soon." />
          ) : (
            <div className="research-grid reveal">
              {featured.map((post) => {
                const excerpt =
                  post.subtitle ||
                  post.preview_text ||
                  excerptFromHtml(
                    post.content?.free?.web
                  );

                const minutes =
                  estimateReadingMinutes(
                    post.content?.free?.web
                  );

                return (
                  <article
                    className="research-card"
                    key={post.id}
                  >
                    <span className="eyebrow">
                      {categoryForPost(post)}
                    </span>

                    <h3>
                      <Link
                        href={`/brief/${post.slug}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {excerpt && <p>{excerpt}</p>}

                    <div className="card-meta">
                      <span>
                        {minutes} min read
                      </span>

                      <span>·</span>

                      <span>
                        {formatDate(post.publish_date)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          WHY READ
      ========================================================= */}
      <section className="section-border">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">
                Why Subscribe
              </p>

              <h2>
                Why Read The Ledger Brief
              </h2>
            </div>
          </div>

          <div className="why-grid reveal">
            <div className="why-item">
              <svg
                className="icon"
                viewBox="0 0 34 34"
                fill="none"
                stroke="#8B1E2D"
                strokeWidth="1.3"
              >
                <circle
                  cx="17"
                  cy="17"
                  r="12"
                />

                <path d="M17 10v7l5 3" />
              </svg>

              <h3>
                Independent Research
              </h3>

              <p>
                Objective analysis free from
                sensationalism — no sponsored
                takes, no affiliate agendas, no
                clickbait.
              </p>
            </div>

            <div className="why-item">
              <svg
                className="icon"
                viewBox="0 0 34 34"
                fill="none"
                stroke="#8B1E2D"
                strokeWidth="1.3"
              >
                <path d="M4 24l7-10 6 6 8-12 5 7" />
              </svg>

              <h3>
                Macro Intelligence
              </h3>

              <p>
                Understand what truly moves
                markets, from central bank policy
                to the shifts hiding beneath the
                headline data.
              </p>
            </div>

            <div className="why-item">
              <svg
                className="icon"
                viewBox="0 0 34 34"
                fill="none"
                stroke="#8B1E2D"
                strokeWidth="1.3"
              >
                <path d="M6 26V14M17 26V8M28 26v-6" />
              </svg>

              <h3>
                Long-Term Thinking
              </h3>

              <p>
                A focus on durable investment
                ideas rather than daily noise,
                position for the next decade, not
                the next headline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LATEST ISSUES
      ========================================================= */}
      <section
        id="archive"
        className="section-border"
      >
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow">Archive</p>

              <h2>Latest Issues</h2>

              <p className="section-lede">
                Every issue, in full, since the first
                one went out in 2025.
              </p>
            </div>

            <Link
              href="/archive"
              className="link-underline"
            >
              View full archive
            </Link>
          </div>

          <div className="reveal issue-list">
            {numbered.length === 0 ? (
              <EmptyState message="No published issues yet — check back soon." />
            ) : (
              numbered.map(
                ({ post, issueNo }) => (
                  <IssueRow
                    post={post}
                    issueNo={issueNo}
                    key={post.id}
                  />
                )
              )
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          NEWSLETTER SIGNUP
      ========================================================= */}
      <section
        className="signup-band"
        id="subscribe"
      >
        <div className="wrap signup-inner reveal">
          <p className="eyebrow eyebrow-center">
            Join The Ledger Brief
          </p>

          <h2>
            Join 11,000+ investors who start
            their week with clarity.
          </h2>

          <p>
            One email, every week. No noise,
            no spam, unsubscribe anytime.
          </p>

          <NewsletterForm
            idPrefix="home"
            variant="inline"
          />

          <p className="signup-note">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section className="section-border">
        <div className="wrap about-grid">
          <div className="reveal">
            <p className="eyebrow">About</p>

            <h2 className="about-heading">
              Who we are
            </h2>
          </div>

          <div className="reveal">
            <p>
              The Ledger Brief is written by a
              small team of former equity
              analysts and portfolio strategists
              who spent their careers inside
              institutional research desks — and
              grew tired of research written to be
              skimmed rather than understood.
            </p>

            <p>
              <strong>
                Research philosophy.
              </strong>{" "}
              We start from the numbers, not the
              narrative. Every issue is built
              around primary sources — filings,
              transcripts, and data — before a
              single word of opinion is written.
            </p>

            <p>
              <strong>
                Editorial standards.
              </strong>{" "}
              No sponsored placements. No
              affiliate relationships influence
              coverage. When we hold a position
              related to something we write about,
              we say so, plainly.
            </p>

            <p>
              <strong>Mission.</strong>{" "}
              To give serious, long-term investors
              — institutional and independent alike
              — research that respects their time
              and their intelligence.
            </p>

            <Link
              href="/about"
              className="link-underline"
            >
              More about The Ledger Brief
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="section-border">
        <div className="wrap">
          <p className="eyebrow reveal">
            Reader Notes
          </p>

          <div className="testi-grid">
            <blockquote className="reveal">
              One of the few newsletters worth
              making time for.

              <div className="testi-attr">
                — Portfolio Manager, Family Office
              </div>
            </blockquote>

            <blockquote className="reveal">
              Thoughtful research without the
              noise.

              <div className="testi-attr">
                — Independent Investor, subscriber
                since 2025
              </div>
            </blockquote>
          </div>
        </div>
      </section>
    </main>
  );
}
