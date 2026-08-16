"use client";

import { useEffect, useState, FormEvent } from "react";

type Props = {
  idPrefix: string;
  variant?: "footer" | "inline";
};

export default function NewsletterForm({
  idPrefix,
  variant = "footer",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const emailId = `email-${idPrefix}`;
  const msgId = `msg-${idPrefix}`;

  useEffect(() => {
    if (!showModal) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setInvalid(true);
      setStatus("error");
      setMessage("Enter a valid email address to subscribe.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setInvalid(false);
        setStatus("error");
        setMessage(
          data.error ||
            "Something went wrong. Please try again in a moment."
        );
        return;
      }

      setInvalid(false);
      setStatus("success");
      setMessage("");
      setEmail("");
      setShowModal(true);
    } catch {
      setInvalid(false);
      setStatus("error");
      setMessage(
        "Something went wrong. Please try again in a moment."
      );
    }
  }

  const formStyle =
    variant === "inline"
      ? {
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          maxWidth: "420px",
          margin: "0 auto",
          flexWrap: "wrap" as const,
        }
      : undefined;

  const inputStyle =
    variant === "inline"
      ? {
          flex: "1 1 220px",
          padding: "12px 14px",
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.05)",
          color: "#fff",
        }
      : undefined;

  return (
    <>
      <form
        id={`form-${idPrefix}`}
        noValidate
        onSubmit={handleSubmit}
        style={formStyle}
      >
        <label
          htmlFor={emailId}
          className="visually-hidden"
        >
          Email address
        </label>

        <input
          type="email"
          id={emailId}
          name="email"
          placeholder="you@company.com"
          required
          autoComplete="email"
          inputMode="email"
          aria-describedby={msgId}
          aria-invalid={invalid}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (status === "error") {
              setStatus("idle");
              setInvalid(false);
              setMessage("");
            }
          }}
          style={inputStyle}
        />

        <button
          type="submit"
          className="btn btn-solid btn-sm btn-submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          <span
            className="btn-spinner"
            aria-hidden="true"
          />

          <span className="btn-label">
            Subscribe Free
          </span>
        </button>
      </form>

      {status === "error" && (
        <p
          id={msgId}
          role="status"
          aria-live="polite"
          className="form-msg show is-error"
        >
          {message}
        </p>
      )}

      {showModal && (
        <div
          role="presentation"
          onMouseDown={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(17,17,17,0.42)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`subscribe-modal-title-${idPrefix}`}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              border: "1px solid #E8E8E8",
              boxShadow:
                "0 28px 80px rgba(17,17,17,0.18)",
              padding: "46px 42px 40px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "18px",
                border: 0,
                background: "transparent",
                color: "#5F6368",
                fontSize: "24px",
                lineHeight: 1,
                padding: "4px",
              }}
            >
              ×
            </button>

            <div
              aria-hidden="true"
              style={{
                width: "46px",
                height: "46px",
                border: "1px solid #8B1E2D",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "#8B1E2D",
                fontSize: "19px",
                fontWeight: 600,
              }}
            >
              ✓
            </div>

            <p
              style={{
                margin: "0 0 12px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8B1E2D",
              }}
            >
              One final step
            </p>

            <h2
              id={`subscribe-modal-title-${idPrefix}`}
              style={{
                margin: "0 0 18px",
                fontFamily:
                  "'Source Serif 4', Georgia, serif",
                fontSize: "36px",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#111111",
              }}
            >
              Check your inbox.
            </h2>

            <p
              style={{
                maxWidth: "410px",
                margin: "0 auto",
                fontSize: "15.5px",
                lineHeight: 1.7,
                color: "#5F6368",
              }}
            >
              We sent you a confirmation email.
              Click the confirmation link inside to
              complete your subscription to The
              Ledger Brief.
            </p>

            <div
              aria-hidden="true"
              style={{
                width: "38px",
                height: "1px",
                background: "#8B1E2D",
                margin: "28px auto",
              }}
            />

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-solid"
            >
              Got it
            </button>

            <p
              style={{
                margin: "24px 0 0",
                fontSize: "12px",
                color: "#8A8A8A",
              }}
            >
              Didn’t see it? Check your spam or
              promotions folder.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
