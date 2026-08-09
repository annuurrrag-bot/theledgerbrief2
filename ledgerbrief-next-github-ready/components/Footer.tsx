import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer id="footer-contact">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <span className="logo">The Ledger Brief</span>
          <p>Independent investment research, delivered weekly to serious long-term investors.</p>
        </div>
        <div className="footer-col">
          <h4>Research</h4>
          <ul>
            <li><Link href="/research">All Research</Link></li>
            <li><Link href="/markets">Markets</Link></li>
            <li><Link href="/macro">Macro</Link></li>
            <li><Link href="/equities">Equities</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/data">Data</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Publication</h4>
          <ul>
            <li><Link href="/archive">Archive</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/#footer-contact">Contact</Link></li>
            {/* Placeholder until a real privacy policy page exists — plain
                anchor, no handler needed, keeps this a Server Component. */}
            <li><a href="#" aria-disabled="true">Privacy</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Elsewhere</h4>
          <ul>
            {/* Placeholders until real social accounts are linked. */}
            <li><a href="#" aria-disabled="true">LinkedIn</a></li>
            <li><a href="#" aria-disabled="true">X</a></li>
            <li><a href="#" aria-disabled="true">RSS</a></li>
          </ul>
        </div>
        <div className="footer-col footer-signup">
          <h4>Subscribe</h4>
          <NewsletterForm idPrefix="footer" variant="footer" />
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>&copy; {new Date().getFullYear()} The Ledger Brief. All rights reserved.</span>
        <div className="footer-social">
          <a href="#" aria-disabled="true" aria-label="RSS feed">RSS</a>
          <a href="#" aria-disabled="true" aria-label="LinkedIn">LinkedIn</a>
          <a href="#" aria-disabled="true" aria-label="X (Twitter)">X</a>
        </div>
      </div>
    </footer>
  );
}
