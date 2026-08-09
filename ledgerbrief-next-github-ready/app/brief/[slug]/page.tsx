import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, categoryForPost, estimateReadingMinutes } from "@/lib/beehiiv";

export const revalidate = 120;

function formatDate(unixSeconds: number | null): string {
  if (!unixSeconds) return "";
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.subtitle || post.preview_text || undefined,
    openGraph: {
      title: post.title,
      description: post.subtitle || post.preview_text || undefined,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
      type: "article",
      publishedTime: post.publish_date ? new Date(post.publish_date * 1000).toISOString() : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  // decodeURIComponent guards against slugs that arrive percent-encoded
  // from odd inbound links; getPostBySlug itself only ever matches an
  // exact, published (status=confirmed) slug — so a slug for a draft or
  // scheduled post simply won't resolve here, by construction.
  const slug = decodeURIComponent(params.slug);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = post.content?.free?.web;
  const minutes = estimateReadingMinutes(html);
  const category = categoryForPost(post);

  return (
    <main id="main">
      <nav className="breadcrumb wrap" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/research">Research</Link> /{" "}
        <span aria-current="page">{post.title}</span>
      </nav>

      <article className="wrap" style={{ paddingTop: 26, paddingBottom: 64 }}>
        <div style={{ maxWidth: "68ch" }}>
          <span className="card-tag">{category}</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.12, margin: "14px 0 12px" }}>
            {post.title}
          </h1>
          {post.subtitle && (
            <p style={{ fontSize: 18, color: "var(--ink-soft)", margin: "0 0 20px" }}>{post.subtitle}</p>
          )}
          <div className="card-meta" style={{ marginBottom: 32 }}>
            {post.authors?.length > 0 && <span>{post.authors.join(", ")}</span>}
            {post.authors?.length > 0 && <span>·</span>}
            <span>{formatDate(post.publish_date)}</span>
            <span>·</span>
            <span>{minutes} min read</span>
          </div>

          {post.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.thumbnail_url}
              alt=""
              style={{ width: "100%", height: "auto", marginBottom: 36, border: "1px solid var(--border)" }}
            />
          )}

          {html ? (
            <div className="prose-block beehiiv-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{ color: "var(--ink-soft)" }}>
              This issue doesn&rsquo;t have web content available.{" "}
              <a href={post.web_url} target="_blank" rel="noopener noreferrer">View it on Beehiiv →</a>
            </p>
          )}
        </div>
      </article>
    </main>
  );
}
