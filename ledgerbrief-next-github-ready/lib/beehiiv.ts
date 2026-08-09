// lib/beehiiv.ts
//
// Server-only Beehiiv API client. Never import this file from a
// "use client" component — it reads process.env.BEEHIIV_API_KEY, which
// must never reach the browser bundle. Next.js already excludes files
// only referenced from Server Components/Route Handlers from the client
// bundle, but keep the discipline: no "use client" directive here, ever.

const BEEHIIV_BASE_URL = "https://api.beehiiv.com/v2";

// How long fetched post data is cached before Next.js will fetch fresh
// data again (ISR-style). Keep this short enough that "publish in
// Beehiiv -> shows up on the site" feels automatic, long enough that we
// aren't hammering Beehiiv's API on every visitor.
const POSTS_REVALIDATE_SECONDS = 120;

export type BeehiivPost = {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  slug: string;
  thumbnail_url: string | null;
  web_url: string;
  status: "draft" | "confirmed" | "archived";
  content_tags: string[];
  publish_date: number | null; // unix seconds
  displayed_date: number | null;
  preview_text: string | null;
  content?: {
    free?: { web?: string; email?: string; rss?: string };
    premium?: { web?: string; email?: string };
  };
};

type BeehiivListResponse = {
  data: BeehiivPost[];
  limit: number;
  page: number;
  total_results: number;
  total_pages: number;
};

function getEnv() {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    throw new Error(
      "Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID environment variables."
    );
  }
  return { apiKey, publicationId };
}

async function beehiivFetch<T>(
  path: string,
  searchParams: Record<string, string | string[] | undefined>,
  revalidate: number
): Promise<T | null> {
  let apiKey: string, publicationId: string;
  try {
    ({ apiKey, publicationId } = getEnv());
  } catch (err) {
    console.error("[beehiiv] config error:", err);
    return null;
  }

  const url = new URL(
    `${BEEHIIV_BASE_URL}/publications/${publicationId}${path}`
  );
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(`${key}[]`, v);
    } else {
      url.searchParams.set(key, value);
    }
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      // Next.js data cache: revalidate on a timer rather than refetching
      // on every request. See app/api/revalidate/route.ts for the
      // on-demand alternative triggered by a Beehiiv webhook.
      next: { revalidate, tags: ["beehiiv-posts"] },
    });

    if (!res.ok) {
      console.error(
        `[beehiiv] ${res.status} ${res.statusText} for ${url.pathname}`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // Network failure, timeout, DNS, etc. — Beehiiv being unreachable
    // should never crash the site.
    console.error("[beehiiv] fetch failed:", err);
    return null;
  }
}

/**
 * All published (status=confirmed) posts, newest first. Never returns
 * drafts, scheduled, or archived posts. Returns [] on any API failure —
 * callers should render an empty/fallback state, not crash.
 */
export async function getPublishedPosts(
  options: { limit?: number; contentTags?: string[]; expandContent?: boolean } = {}
): Promise<BeehiivPost[]> {
  const { limit = 100, contentTags, expandContent = true } = options;

  const expand = expandContent ? ["free_web_content"] : undefined;

  const result = await beehiivFetch<BeehiivListResponse>(
    "/posts",
    {
      status: "confirmed",
      order_by: "publish_date",
      direction: "desc",
      limit: String(Math.min(limit, 100)),
      content_tags: contentTags,
      expand,
    },
    POSTS_REVALIDATE_SECONDS
  );

  return result?.data ?? [];
}

/**
 * A single published post by its Beehiiv slug. Returns null if the slug
 * doesn't exist OR if the matching post isn't published (confirmed) —
 * callers should treat null as "show a 404", so a scheduled/draft post
 * never becomes reachable by guessing its slug.
 */
export async function getPostBySlug(
  slug: string
): Promise<BeehiivPost | null> {
  if (!slug) return null;

  const result = await beehiivFetch<BeehiivListResponse>(
    "/posts",
    {
      status: "confirmed",
      slugs: [slug],
      expand: ["free_web_content"],
      limit: "1",
    },
    POSTS_REVALIDATE_SECONDS
  );

  return result?.data?.[0] ?? null;
}

/** Rough reading-time estimate from rendered HTML content. */
export function estimateReadingMinutes(html: string | undefined | null): number {
  if (!html) return 3;
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Strips HTML and trims to a card-friendly excerpt when no subtitle exists. */
export function excerptFromHtml(html: string | undefined | null, maxLen = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? text.slice(0, maxLen).trimEnd() + "…" : text;
}

/**
 * Pairs posts (already sorted newest-first, as getPublishedPosts returns
 * them) with a sequential issue number where the oldest post is No. 1.
 * Used to keep "Issue No." consistent between the homepage teaser and
 * the full archive. Assumes the full set fits in one page (<=100 posts,
 * getPublishedPosts' max) — true for a weekly newsletter for the next
 * couple of years; if you outgrow that, switch to paginating here.
 */
export function withIssueNumbers(
  postsNewestFirst: BeehiivPost[]
): { post: BeehiivPost; issueNo: number }[] {
  const total = postsNewestFirst.length;
  return postsNewestFirst.map((post, i) => ({ post, issueNo: total - i }));
}

const KNOWN_CATEGORIES = ["Markets", "Macro", "Equities", "Portfolio", "Data"];

/** Maps a post's Beehiiv content_tags to one of the site's known category pills. */
export function categoryForPost(post: BeehiivPost): string {
  const tags = (post.content_tags || []).map((t) => t.toLowerCase());
  const match = KNOWN_CATEGORIES.find((c) => tags.includes(c.toLowerCase()));
  return match ?? "Markets";
}

type SubscribeResult = { ok: true } | { ok: false; error: string };

/**
 * Creates a Beehiiv subscription. Server-only — call this from a Route
 * Handler (app/api/subscribe/route.ts), never directly from the client.
 */
export async function subscribeEmail(
  email: string,
  meta: { utm_source?: string; utm_medium?: string } = {}
): Promise<SubscribeResult> {
  let apiKey: string, publicationId: string;
  try {
    ({ apiKey, publicationId } = getEnv());
  } catch {
    return { ok: false, error: "Subscription service is not configured." };
  }

  try {
    const res = await fetch(
      `${BEEHIIV_BASE_URL}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: meta.utm_source ?? "website",
          utm_medium: meta.utm_medium ?? "organic",
        }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message =
        body?.errors?.[0]?.message ||
        body?.message ||
        "Something went wrong. Please try again.";
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (err) {
    console.error("[beehiiv] subscribe failed:", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
