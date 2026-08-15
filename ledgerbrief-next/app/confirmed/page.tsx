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
          minHeight: "72vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            textAlign: "center",
          }}
        >
          {/* Confirmation mark */}
          <div
            aria-hidden="true"
            style={{
              width: "42px",
              height: "42px",
              border: "1px solid var(--accent)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 30px",
              color: "var(--accent)",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            ✓
          </div>

          <p
            className="eyebrow"
            style={{
              marginBottom: "18px",
            }}
          >
            Subscription Confirmed
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 68px)",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              marginBottom: "24px",
            }}
          >
            Welcome to
            <br />
            The Ledger Brief.
          </h1>

          <p
            style={{
              maxWidth: "510px",
              margin: "0 auto",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--ink-soft)",
            }}
          >
            You're officially on the list. The next edition will arrive
            directly in your inbox.
          </p>

          <div
            style={{
              width: "44px",
              height: "1px",
              background: "var(--accent)",
              margin: "34px auto",
            }}
          />

          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              marginBottom: "30px",
            }}
          >
            In the meantime, explore our latest market intelligence,
            macro analysis, and investment research.
          </p>

          <Link
            href="/research"
            className="btn-primary"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Explore Research
          </Link>

          <p
            style={{
              marginTop: "38px",
              fontSize: "12px",
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
