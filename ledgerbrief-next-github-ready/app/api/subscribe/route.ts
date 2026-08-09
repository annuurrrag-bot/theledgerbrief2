// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/beehiiv";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very small in-memory rate limit per server instance: not a substitute
// for a real rate limiter, but enough to blunt naive abuse without adding
// an external dependency. Resets on redeploy/cold start.
const recentRequests = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 10_000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = typeof (body as any)?.email === "string" ? (body as any).email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const key = `${ip}:${email.toLowerCase()}`;
  const now = Date.now();
  const last = recentRequests.get(key);
  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { ok: false, error: "Please wait a moment before trying again." },
      { status: 429 }
    );
  }
  recentRequests.set(key, now);

  const result = await subscribeEmail(email, { utm_source: "website" });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
