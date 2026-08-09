import { getPublishedPosts } from "@/lib/beehiiv";
import ResearchExplorer from "@/components/ResearchExplorer";
import { FeaturedSplit, EmptyState } from "@/components/PostCards";
import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Research Hub",
  description: "Search and filter the complete Ledger Brief research library: markets, macro, equities, portfolio strategy, and data.",
};

export default async function ResearchPage() {
  const posts = await getPublishedPosts({ limit: 100 });
  const [main, ...rest] = posts;
  const sideFeatured = rest.slice(0, 3);
  const gridPosts = rest.slice(3); // everything after the featured split feeds the explorer
  const sidebarRecent = posts.slice(0, 4);
  const sidebarMore = posts.slice(4, 8);

  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">Research Hub</p>
        <h1>Every issue. Every idea. Searchable.</h1>
        <p>
          The full library of Ledger Brief research — market analysis, macro reads, sector
          deep-dives, and portfolio strategy, organized so you can find exactly what you need.
        </p>
        <div className="page-hero-meta">
          <div className="mini-stat"><span className="stat-num">{posts.length}</span><span>Articles published</span></div>
          <div className="mini-stat"><span className="stat-num">5</span><span>Categories</span></div>
          <div className="mini-stat"><span className="stat-num">Weekly</span><span>Publishing cadence</span></div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 56 }}>
        <div className="section-head reveal">
          <div><p className="section-label">Featured</p><h2>Latest Issue</h2></div>
        </div>

        {main ? (
          <FeaturedSplit main={main} side={sideFeatured} />
        ) : (
          <EmptyState message="No published issues yet — check back soon." />
        )}

        <ResearchExplorer posts={gridPosts} editorPicks={sidebarRecent} mostRead={sidebarMore} />
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Get research like this every week</h2>
          <p>Free, independent, delivered every Tuesday morning.</p>
          <NewsletterForm idPrefix="research-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
