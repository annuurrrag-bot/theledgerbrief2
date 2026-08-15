import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | The Ledger Brief",
  description: "Your subscription to The Ledger Brief is confirmed.",
};

export default function ConfirmedPage() {
  return (
    <main id="main">
      <section
        className="wrap"
        style={{
          minHeight: "76vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "72px",
          paddingBottom: "96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            textAlign: "center",
          }}
        >
          {/* Confirmation mark */}
          <div
            aria-hidden="true"
            style={{
              width: "52px",
              height: "52px",
              border: "1.5px solid var(--accent)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 34px",
              color: "var(--accent)",
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            ✓
          </div>

          {/* Label */}
          <p
            className="eyebrow"
            style={{
              marginBottom: "22px",
              letterSpacing: "0.16em",
            }}
          >
            Subscription Confirmed
          </p>

          {/* Main heading */}
          <h1
            style={{
              fontSize: "clamp(50px, 6vw, 76px)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              margin: "0 auto 28px",
            }}
          >
            Welcome to
            <br />
            The Ledger Brief.
          </h1>

          {/* Main message */}
          <p
            style={{
              maxWidth: "580px",
              margin: "0 auto",
              fontSize: "19px",
              lineHeight: 1.65,
              color: "var(--ink-soft)",
            }}
          >
            You're officially on the list. The next edition will arrive
            directly in your inbox.
          </p>

          {/* Accent divider */}
          <div
            aria-hidden="true"
            style={{
              width: "48px",
              height: "1px",
              background: "var(--accent)",
              margin: "38px auto",
            }}
          />

          {/* Secondary message */}
          <p
            style={{
              maxWidth: "620px",
              margin: "0 auto 32px",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--ink-soft)",
            }}
          >
            In the meantime, explore our latest market intelligence, macro
            analysis, and investment research.
          </p>

          {/* CTA */}
          <Link
            href="/research"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            Explore Research
          </Link>

          {/* Footer note */}
          <p
            style={{
              marginTop: "42px",
              marginBottom: 0,
              fontSize: "12.5px",
              letterSpacing: "0.02em",
              color: "var(--ink-soft)",
            }}
          >
            Independent Research · Est. 2025
          </p>
        </div>
      </section>
    </main>
  );
}
