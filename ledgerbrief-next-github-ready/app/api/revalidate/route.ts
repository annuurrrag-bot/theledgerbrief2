// app/api/revalidate/route.ts
//
// Optional: lets a Beehiiv webhook (Post Sent / Post Updated — available
// on Beehiiv's Scale plan and above) trigger an immediate cache refresh
// instead of waiting for the timed revalidation window in lib/beehiiv.ts.
//
// Without this wired up, the site still updates automatically — just on
// the fixed ~2 minute schedule set in lib/beehiiv.ts (POSTS_REVALIDATE_SECONDS)
// rather than instantly.
//
// Set up in Beehiiv: Settings > Integrations > Webhooks > Add webhook
//   URL:    https://<your-domain>/api/revalidate?secret=<REVALIDATE_SECRET>
//   Events: Post Sent, Post Updated
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  revalidateTag("beehiiv-posts");
  revalidatePath("/");
  revalidatePath("/research");
  revalidatePath("/archive");

  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}

// Convenience for manual testing in a browser: GET behaves the same as
// POST here since Beehiiv's webhook payload isn't required for a full
// tag-based revalidation.
export async function GET(req: NextRequest) {
  return POST(req);
}
