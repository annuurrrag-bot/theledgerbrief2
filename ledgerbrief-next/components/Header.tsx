"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS: { href: string; label: string; mega?: boolean }[] = [
  { href: "/research", label: "Research", mega: true },
  { href: "/markets", label: "Markets" },
  { href: "/macro", label: "Macro" },
  { href: "/equities", label: "Equities" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/data", label: "Data" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const subscribeHref = isHome ? "#subscribe" : "/#subscribe";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaLiRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (megaLiRef.current && !megaLiRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <header className="site-nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo">
            The Ledger Brief
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV_ITEMS.map((item) =>
                item.mega ? (
                  <li
                    key={item.href}
                    ref={megaLiRef}
                    className={megaOpen ? "mega-open" : undefined}
                    onMouseEnter={() => {
                      if (window.matchMedia("(hover:hover)").matches) setMegaOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (window.matchMedia("(hover:hover)").matches) setMegaOpen(false);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={pathname === item.href ? "active" : undefined}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      onClick={(e) => {
                        if (!window.matchMedia("(max-width:900px)").matches) {
                          e.preventDefault();
                          setMegaOpen((v) => !v);
                        }
                      }}
                    >
                      {item.label}
                      <svg className="chev" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path
                          d="M1 1l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <div className="mega-panel">
                      <div className="mega-col">
                        <h5>Browse by category</h5>
                        <ul>
                          <li>
                            <Link href="/markets">
                              Markets
                              <span className="desc">Indices, movers, commodities, currencies, treasuries</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/macro">
                              Macro
                              <span className="desc">Inflation, rates, central banks, the business cycle</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/equities">
                              Equities
                              <span className="desc">Sector-by-sector company and industry research</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/portfolio">
                              Portfolio
                              <span className="desc">Allocation, risk, and long-term strategy</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/data">
                              Data &amp; Dashboards
                              <span className="desc">Interactive charts and reference tables</span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/research">
                              All research
                              <span className="desc">Search and filter the full library</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="mega-col">
                        <h5>This week</h5>
                        <div className="mega-feature">
                          <p className="eyebrow">Latest issue</p>
                          <h4>See what just went out to subscribers</h4>
                          <p>The newest confirmed post from Beehiiv, pulled live.</p>
                          <Link href="/research" className="link-underline" style={{ fontSize: 13 }}>
                            Read the latest
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className={pathname === item.href ? "active" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className="nav-right">
            <Link href={subscribeHref} className="btn btn-solid btn-sm">
              Subscribe
            </Link>
            <button
              className="nav-toggle"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobilePanel"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-panel${mobileOpen ? " open" : ""}`} id="mobilePanel">
        <div className="mobile-panel-top">
          <span className="logo">The Ledger Brief</span>
          <button className="nav-toggle" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.6" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href={subscribeHref} className="subscribe-link" onClick={() => setMobileOpen(false)}>
          Subscribe
        </Link>
      </div>
    </>
  );
}
