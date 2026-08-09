import Link from "next/link";
import type { BeehiivPost } from "@/lib/beehiiv";
import { categoryForPost, estimateReadingMinutes, excerptFromHtml } from "@/lib/beehiiv";

function formatDate(unixSeconds: number | null): string {
  if (!unixSeconds) return "";
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostGridCard({ post }: { post: BeehiivPost }) {
  const category = categoryForPost(post);
  const excerpt = post.subtitle || post.preview_text || excerptFromHtml(post.content?.free?.web);
  const minutes = estimateReadingMinutes(post.content?.free?.web);

  return (
    <article className="r-card">
      <span className="card-tag">{category}</span>
      <h3>
        <Link href={`/brief/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
          {post.title}
        </Link>
      </h3>
      {excerpt && <p>{excerpt}</p>}
      <div className="card-meta">
        <span>{minutes} min read</span>
        <span>·</span>
        <span>{formatDate(post.publish_date)}</span>
      </div>
    </article>
  );
}

export function IssueRow({ post, issueNo }: { post: BeehiivPost; issueNo: number }) {
  const category = categoryForPost(post);
  const excerpt = post.subtitle || post.preview_text || excerptFromHtml(post.content?.free?.web);

  return (
    <div className="issue-row">
      <span className="issue-no">No. {String(issueNo).padStart(3, "0")}</span>
      <div className="issue-body">
        <span className="card-tag">{category}</span>
        <h3>
          <Link href={`/brief/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
            {post.title}
          </Link>
        </h3>
        {excerpt && <p>{excerpt}</p>}
      </div>
      <span className="issue-date">{formatDate(post.publish_date)}</span>
    </div>
  );
}

export function FeaturedSplit({ main, side }: { main: BeehiivPost; side: BeehiivPost[] }) {
  const excerpt = main.subtitle || main.preview_text || excerptFromHtml(main.content?.free?.web, 220);
  const minutes = estimateReadingMinutes(main.content?.free?.web);

  return (
    <div className="featured-split reveal">
      <div className="featured-main">
        <span className="card-tag">{categoryForPost(main)}</span>
        <h3>
          <Link href={`/brief/${main.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
            {main.title}
          </Link>
        </h3>
        {excerpt && <p>{excerpt}</p>}
        <div className="card-meta">
          <span>{minutes} min read</span>
          <span>·</span>
          <span>{formatDate(main.publish_date)}</span>
        </div>
      </div>
      <div className="featured-side">
        {side.map((post) => (
          <div className="mini-item" key={post.id}>
            <span className="card-tag">{categoryForPost(post)}</span>
            <h4>
              <Link href={`/brief/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                {post.title}
              </Link>
            </h4>
            <div className="card-meta" style={{ border: 0, padding: 0 }}>
              {formatDate(post.publish_date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p style={{ color: "var(--ink-soft)", padding: "40px 0", textAlign: "center" }}>{message}</p>
  );
}

export function BeehiivErrorState() {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--paper, #FAF9F7)",
        padding: "32px",
        textAlign: "center",
        color: "var(--ink-soft)",
        margin: "24px 0 56px",
      }}
    >
      We couldn&rsquo;t load research from Beehiiv right now. The rest of the site is still
      working — please check back in a few minutes.
    </div>
  );
}
