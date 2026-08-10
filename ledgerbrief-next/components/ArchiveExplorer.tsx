"use client";

import { useMemo, useState } from "react";
import type { BeehiivPost } from "@/lib/beehiiv";
import { categoryForPost } from "@/lib/beehiiv";
import { IssueRow, EmptyState } from "./PostCards";

type NumberedPost = { post: BeehiivPost; issueNo: number };

const CATEGORIES = ["all", "Markets", "Macro", "Equities", "Portfolio", "Data"];

export default function ArchiveExplorer({ items }: { items: NumberedPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const years = useMemo(() => {
    const set = new Set<string>();
    items.forEach(({ post }) => {
      if (post.publish_date) set.add(String(new Date(post.publish_date * 1000).getFullYear()));
    });
    return Array.from(set).sort().reverse();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(({ post }) => {
      const cat = categoryForPost(post);
      const matchCat = category === "all" || cat === category;
      const postYear = post.publish_date ? String(new Date(post.publish_date * 1000).getFullYear()) : "";
      const matchYear = year === "all" || postYear === year;
      const excerpt = post.subtitle || post.preview_text || "";
      const matchQ = !q || post.title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
      return matchCat && matchYear && matchQ;
    });
  }, [items, query, category, year]);

  const shown = filtered.slice(0, visibleCount);
  const remaining = filtered.length - shown.length;

  return (
    <>
      <div className="filter-bar reveal">
        <div className="search-field">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search issues..."
            aria-label="Search issues"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisibleCount(10); }}
          />
        </div>
        <div className="pill-group">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`pill${category === c ? " active" : ""}`}
              onClick={() => { setCategory(c); setVisibleCount(10); }}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          aria-label="Filter by year"
          value={year}
          onChange={(e) => { setYear(e.target.value); setVisibleCount(10); }}
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState message={items.length === 0 ? "No published issues yet — check back soon." : "No issues match your filters."} />
      ) : (
        <div className="issue-list reveal">
          {shown.map(({ post, issueNo }) => (
            <IssueRow post={post} issueNo={issueNo} key={post.id} />
          ))}
        </div>
      )}

      <div className="load-more-wrap">
        {remaining > 0 && (
          <button className="btn-outline" onClick={() => setVisibleCount((v) => v + 10)}>
            Load more issues
          </button>
        )}
        <p className="load-count">
          {filtered.length > 0 && `Showing ${shown.length} of ${filtered.length} issues`}
        </p>
      </div>
    </>
  );
}
