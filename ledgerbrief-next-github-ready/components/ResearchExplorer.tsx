"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BeehiivPost } from "@/lib/beehiiv";
import { categoryForPost, estimateReadingMinutes, excerptFromHtml } from "@/lib/beehiiv";
import { EmptyState } from "./PostCards";

type Props = {
  posts: BeehiivPost[];
  editorPicks: BeehiivPost[]; // most-recent N, used for the sidebar
  mostRead: BeehiivPost[]; // same set client-side has no read-count from Beehiiv's base fields, so this mirrors "recent" too — see note in ResearchExplorer
};

const CATEGORIES = ["all", "Markets", "Macro", "Equities", "Portfolio", "Data"];

function formatDate(unixSeconds: number | null): string {
  if (!unixSeconds) return "";
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ResearchExplorer({ posts, editorPicks, mostRead }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p) => {
      const cat = categoryForPost(p);
      const matchCat = category === "all" || cat === category;
      const excerpt = p.subtitle || p.preview_text || "";
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        excerpt.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    list = list.slice().sort((a, b) => {
      const diff = (b.publish_date ?? 0) - (a.publish_date ?? 0);
      return sort === "newest" ? diff : -diff;
    });
    return list;
  }, [posts, query, category, sort]);

  const shown = filtered.slice(0, visibleCount);
  const remaining = filtered.length - shown.length;

  return (
    <div className="with-sidebar">
      <div>
        <div className="filter-bar reveal">
          <div className="search-field">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search research..."
              aria-label="Search research"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(9);
              }}
            />
          </div>
          <div className="pill-group">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`pill${category === c ? " active" : ""}`}
                onClick={() => {
                  setCategory(c);
                  setVisibleCount(9);
                }}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            aria-label="Sort research"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "newest" | "oldest");
              setVisibleCount(9);
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {shown.length === 0 ? (
          <EmptyState message={posts.length === 0 ? "No published issues yet — check back soon." : "No research matches your filters."} />
        ) : (
          <div className="card-grid reveal">
            {shown.map((post) => {
              const excerpt = post.subtitle || post.preview_text || excerptFromHtml(post.content?.free?.web);
              const minutes = estimateReadingMinutes(post.content?.free?.web);
              return (
                <article className="r-card" key={post.id}>
                  <span className="card-tag">{categoryForPost(post)}</span>
                  <h3>
                    <Link href={`/brief/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  </h3>
                  {excerpt && <p>{excerpt}</p>}
                  <div className="card-meta">
                    <span>{minutes} min read</span><span>·</span><span>{formatDate(post.publish_date)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="load-more-wrap">
          {remaining > 0 && (
            <button className="btn-outline" onClick={() => setVisibleCount((v) => v + 6)}>
              Load more research
            </button>
          )}
          <p className="load-count">
            {filtered.length > 0 && `Showing ${shown.length} of ${filtered.length} articles`}
          </p>
        </div>
      </div>

      <aside>
        <div className="sidebar-box">
          <h4>Latest Issues</h4>
          <ul className="sidebar-list">
            {editorPicks.map((p, i) => (
              <li key={p.id}>
                <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                <Link href={`/brief/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
            {editorPicks.length === 0 && <li style={{ color: "var(--ink-soft)", fontSize: 13 }}>Nothing published yet.</li>}
          </ul>
        </div>
        <div className="sidebar-box">
          <h4>More From The Archive</h4>
          <ul className="sidebar-list">
            {mostRead.map((p, i) => (
              <li key={p.id}>
                <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                <Link href={`/brief/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
            {mostRead.length === 0 && <li style={{ color: "var(--ink-soft)", fontSize: 13 }}>Nothing here yet.</li>}
          </ul>
        </div>
      </aside>
    </div>
  );
}
