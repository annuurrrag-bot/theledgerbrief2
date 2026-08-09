import NewsletterForm from "@/components/NewsletterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The Ledger Brief is an independent investment research publication written by former equity analysts and portfolio strategists.",
};

export default function AboutPage() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal">
        <p className="eyebrow">About</p>
        <h1>Research written to be understood, not skimmed.</h1>
        <p>The Ledger Brief is written by a small team of former equity analysts and portfolio strategists who spent their careers inside institutional research desks — and grew tired of research written to be skimmed rather than understood.</p>
      </div>

      <div className="wrap" style={{paddingTop: '56px'}}>
        <div className="with-sidebar">
          <div className="prose-block reveal">
            <h2>Research philosophy</h2>
            <p>We start from the numbers, not the narrative. Every issue is built around primary sources — filings, transcripts, and data — before a single word of opinion is written. When we're uncertain, we say so, rather than manufacturing false confidence.</p>

            <h2>Editorial standards</h2>
            <p>No sponsored placements. No affiliate relationships influence coverage. When we hold a position related to something we write about, we say so, plainly, at the top of the piece — not buried in a footnote.</p>

            <h2>Mission</h2>
            <p>To give serious, long-term investors — institutional and independent alike — research that respects their time and their intelligence. We would rather publish one well-reasoned idea a week than ten reactive hot takes.</p>

            <div className="value-grid">
              <div>
                <h4>Independent</h4>
                <p>Reader-supported, with no sponsored content or affiliate agendas shaping what we cover.</p>
              </div>
              <div>
                <h4>Rigorous</h4>
                <p>Primary-source research first — filings and data before narrative and opinion.</p>
              </div>
              <div>
                <h4>Long-term</h4>
                <p>Written for investors thinking in years, not for traders chasing the next headline.</p>
              </div>
            </div>

            <h2>How we publish</h2>
            <p>One issue, every Tuesday, without exception since our first send in March 2025. Alongside the newsletter, this site holds the full research library, organized by category, so you can go deeper on any topic at any time.</p>
          </div>

          <aside>
            <div className="sidebar-box">
              <h4>By the Numbers</h4>
              <ul className="sidebar-list">
                <li><span className="rank">47</span><a href="/archive">Issues published since 2025</a></li>
                <li><span className="rank">312</span><a href="/research">Research articles in the library</a></li>
                <li><span className="rank">6</span><a href="/research">Research categories</a></li>
              </ul>
            </div>
            <div className="sidebar-box">
              <h4>Get in Touch</h4>
              <p style={{fontSize: '13.5px', color: 'var(--ink-soft)', margin: '0 0 16px'}}>Questions, corrections, or feedback on a piece? We read everything.</p>
              <a href="/#footer-contact" className="link-underline" style={{fontSize: '13.5px'}}>Contact us</a>
            </div>
          </aside>
        </div>

        <div className="pullquote reveal">One of the few newsletters worth making time for. &mdash; Portfolio Manager, Family Office</div>
      </div>

      <div className="inline-cta">
        <div className="wrap">
          <h2>Join a growing group of serious investors</h2>
          <p>Free, independent, delivered every Tuesday morning.</p>
          <NewsletterForm idPrefix="about-mid" variant="inline" />
        </div>
      </div>
    </main>
  );
}
