import { getPublishedPosts, withIssueNumbers } from "@/lib/beehiiv";
import ArchiveExplorer from "@/components/ArchiveExplorer";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse every issue of The Ledger Brief, filterable by category and year.",
};

export default async function ArchivePage() {
  const posts = await getPublishedPosts({ limit: 100 });
  const numbered = withIssueNumbers(posts).reverse(); // newest first for browsing, issueNo already fixed to oldest=1

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">The Archive</p>
        <h1>Every issue, since day one.</h1>
        <p>Browse the full run of The Ledger Brief below.</p>
        <div className="page-hero-meta">
          <div className="mini-stat"><span className="stat-num">{posts.length}</span><span>Issues published</span></div>
          <div className="mini-stat"><span className="stat-num">2025</span><span>Publishing since</span></div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 56 }}>
        <ArchiveExplorer items={numbered} />
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Never miss an issue</h2>
          <p>One email, every Tuesday. Free, forever.</p>
          <NewsletterForm idPrefix="archive-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
