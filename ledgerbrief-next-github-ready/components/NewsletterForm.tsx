"use client";

import { useState, FormEvent } from "react";

type Props = {
  idPrefix: string; // keeps input/message ids unique when multiple forms exist on one page
  variant?: "footer" | "inline";
};

export default function NewsletterForm({ idPrefix, variant = "footer" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);

  const emailId = `email-${idPrefix}`;
  const msgId = `msg-${idPrefix}`;

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
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setInvalid(false);
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again in a moment.");
        return;
      }

      setInvalid(false);
      setStatus("success");
      setMessage("You're on the list — check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again in a moment.");
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
        className={variant === "footer" ? undefined : undefined}
      >
        <label htmlFor={emailId} className="visually-hidden">
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
          <span className="btn-spinner" aria-hidden="true" />
          <span className="btn-label">Subscribe Free</span>
        </button>
      </form>
      <p
        id={msgId}
        role="status"
        aria-live="polite"
        className={`form-msg${status === "success" || status === "error" ? " show" : ""}${
          status === "success" ? " is-success" : status === "error" ? " is-error" : ""
        }`}
      >
        {message}
      </p>
    </>
  );
}
