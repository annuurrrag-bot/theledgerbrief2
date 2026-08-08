# The Ledger Brief

A static, multi-page site for The Ledger Brief — an editorial investment research
publication. Homepage is conversion-focused; the rest of the site is a full
research platform (search, filters, dashboards, archive).

## Structure

```
.
├── index.html          Homepage
├── research.html        Research hub — search, filter, sort, load more
├── archive.html          Issue archive — filter by category/year
├── markets.html          Market snapshot, movers, commodities, treasuries
├── macro.html            Inflation, rates, central banks, yield curve
├── equities.html         Sector coverage + heatmap
├── portfolio.html        Allocation, risk, construction topics
├── data.html              Dashboards: heatmap, yield curve, valuation, watchlist
├── about.html             Editorial philosophy, standards, contact
└── assets/
    └── logo/            Logo suite (SVG, see below)
```

Every page is a self-contained HTML file (CSS and JS inlined) — there's no
build step. Open any file directly in a browser, or deploy as-is.

## Deploying to GitHub Pages

1. Create a new repo and push this folder's contents to the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. Your site will be live at `https://<username>.github.io/<repo-name>/`
   within a minute or two.

## Logo

`assets/logo/` contains the full mark as vector SVG:

| File | Use |
|---|---|
| `logo-icon.svg` | Standalone mark, transparent background |
| `logo-app-icon.svg` | Filled square — favicon, app icon, social avatar (already wired in as the site favicon) |
| `logo-horizontal.svg` | Icon + wordmark, for light backgrounds |
| `logo-horizontal-reverse.svg` | Icon + wordmark, white-on-dark, for dark surfaces (e.g. footer) |
| `logo-wordmark.svg` | Wordmark only, no icon |
| `logo-display.svg` | Stacked icon + wordmark + tagline, for larger applications (social banners, letterhead) |

## Known placeholders — update before launch

- **Newsletter forms**: every subscribe form points to
  `https://embeds.beehiiv.com/YOUR_PUBLICATION_ID` with `data-simulate="true"`
  (fake success/error, no real signups happen). Replace with your real Beehiiv
  (or other ESP) endpoint and set `data-simulate="false"` once wired up —
  search each HTML file for `YOUR_PUBLICATION_ID`.
- **Domain**: canonical URLs and Open Graph tags use
  `https://www.theledgerbrief.com/` as a placeholder — find-and-replace with
  your real domain once you have one.
- **Social preview image**: `og:image`/`twitter:image` point to
  `/og-image.jpg`, which doesn't exist yet — add a real 1200×630 image at that
  path (or update the meta tags to point elsewhere).
- **Mock data**: all market figures, research articles, and archive issues
  are illustrative placeholder content, hardcoded in each page's JS — not a
  live data feed.
- **No article detail pages**: research/archive cards don't currently link
  to individual article pages — one doesn't exist per article yet.
