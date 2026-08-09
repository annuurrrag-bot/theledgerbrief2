# The Ledger Brief — Next.js + Beehiiv

Converted from the original static HTML site to Next.js (App Router) so the
Beehiiv API key can be used securely, server-side only. Visual design,
typography, and layout are unchanged — this was a framework migration, not a
redesign.

## 1. Final project structure

```
.
├── app/
│   ├── layout.tsx              Root layout — fonts, header, ticker, footer
│   ├── page.tsx                 Homepage (Featured Research + Latest Issues use real Beehiiv data)
│   ├── globals.css              Full design system (unchanged from the static site)
│   ├── not-found.tsx            Styled 404
│   ├── research/page.tsx        Research hub — search/filter/sort over real posts
│   ├── archive/page.tsx         Full issue archive
│   ├── brief/[slug]/page.tsx    Individual article page (real Beehiiv content)
│   ├── markets/page.tsx         Market dashboard (mock data — not Beehiiv content)
│   ├── macro/page.tsx           Macro dashboard (mock data)
│   ├── equities/page.tsx        Sector coverage (mock data)
│   ├── portfolio/page.tsx       Portfolio construction topics (mock data)
│   ├── data/page.tsx            Dashboards + interactive watchlist (mock data)
│   ├── about/page.tsx           Editorial philosophy
│   └── api/
│       ├── subscribe/route.ts   Server-side proxy to Beehiiv subscriptions (key never reaches browser)
│       └── revalidate/route.ts  Optional webhook receiver for instant cache refresh
├── components/                  Header (mega menu), Footer, Ticker, NewsletterForm,
│                                 ResearchExplorer, ArchiveExplorer, PostCards, Watchlist, RevealObserver
├── lib/
│   └── beehiiv.ts                All Beehiiv API calls live here — the only file that
│                                  reads BEEHIIV_API_KEY
├── public/assets/logo/           Logo suite (SVG)
├── .env.example                  Template — copy to .env.local for local dev
└── package.json
```

### Why some pages use real Beehiiv data and some don't

Per your spec, Beehiiv now drives: **Homepage** (Featured Research + Latest
Issues sections), **Research hub**, **Archive**, and **individual article
pages** (`/brief/[slug]`). Markets/Macro/Equities/Portfolio/Data are
dashboard pages showing market figures and reference material, not
newsletter posts — there was nothing in them to source from Beehiiv, so they
were preserved as-is, just moved into the new file structure.

## 2. Environment variables to add in Vercel

Project Settings → Environment Variables:

| Name | Value | Notes |
|---|---|---|
| `BEEHIIV_API_KEY` | your Beehiiv API key | **Rotate the key you shared in chat before using it — treat it as compromised.** Get a fresh one at Beehiiv → Settings → Integrations → API Keys. |
| `BEEHIIV_PUBLICATION_ID` | `pub_...` | From the same Beehiiv settings page |
| `REVALIDATE_SECRET` | a random string | Generate with `openssl rand -hex 32`. Only needed if you wire up the optional webhook (§6) |
| `NEXT_PUBLIC_SITE_URL` | `https://readledgerbrief.online` | Used for canonical/OG tags |

Set all four for the **Production** environment. If you also want Preview
deployments to work, add them there too (you can point Preview's
`BEEHIIV_PUBLICATION_ID` at the same publication — Beehiiv doesn't have a
separate sandbox).

## 3. Deploying to Vercel

1. Push this project to a GitHub repo (root of the repo = root of this
   project — `package.json` should sit at the repo root, not nested in a
   subfolder).
2. In Vercel: **Add New → Project**, import the repo. Vercel auto-detects
   Next.js — no build settings need changing.
3. Before the first deploy, add the four environment variables from §2.
4. Deploy. Vercel runs `npm install` and `next build` for you.
5. Every subsequent push to `main` redeploys automatically.

## 4. Connecting readledgerbrief.online

1. In the Vercel project: **Settings → Domains → Add** → enter
   `readledgerbrief.online` (and `www.readledgerbrief.online` if you want
   both).
2. Vercel shows the DNS records to add. At your domain registrar:
   - For the apex domain (`readledgerbrief.online`), add the **A record**
     Vercel gives you (currently `76.76.21.21`, but use whatever Vercel's
     UI shows you — it's authoritative).
   - For `www`, add the **CNAME** Vercel gives you (`cname.vercel-dns.com`).
3. DNS propagation is usually minutes, sometimes up to ~48 hours. Vercel's
   dashboard shows the domain's status and issues a TLS certificate
   automatically once it verifies.
4. Once verified, update `NEXT_PUBLIC_SITE_URL` to match if it doesn't
   already, and redeploy.

## 5. Testing that publishing in Beehiiv shows up on the site

1. In Beehiiv, publish (or schedule-then-let-send) a test post.
2. **If you did nothing else:** the site re-checks Beehiiv on a timer (every
   ~2 minutes — see `POSTS_REVALIDATE_SECONDS` in `lib/beehiiv.ts`). Wait a
   couple minutes, then reload `/research` — the post should appear.
3. **To confirm instantly** instead of waiting: visit
   `https://<your-domain>/api/revalidate?secret=<REVALIDATE_SECRET>` in a
   browser right after publishing, then reload `/research`. That forces an
   immediate cache refresh.
4. Click through to the post from a card — it should open at
   `/brief/<the-post's-slug>` with the full rendered content.
5. **To confirm scheduled/draft posts stay hidden:** create a draft or a
   post scheduled for the future in Beehiiv, and confirm it does *not*
   appear anywhere on the site (homepage, research, archive) and that
   guessing its slug at `/brief/<slug>` returns your styled 404, not the
   content. This is enforced in `lib/beehiiv.ts` — every fetch explicitly
   filters `status=confirmed`; nothing else is ever requested.

## 6. Beehiiv settings to configure

- **Required:** none — the API key + publication ID are enough for
  everything except instant updates.
- **Recommended, if your plan supports it:** Beehiiv webhooks are available
  on the Scale plan and above. If you have that: Beehiiv → Settings →
  Integrations → Webhooks → Add webhook, events **Post Sent** and **Post
  Updated**, URL:
  ```
  https://<your-domain>/api/revalidate?secret=<REVALIDATE_SECRET>
  ```
  With this set up, a newly sent/updated post appears on the site within
  seconds instead of within the ~2 minute polling window. Without it, the
  site still updates automatically — just on the timer.
- **Content tags for category display:** the site maps each post's
  category pill from its Beehiiv content tags. Tag your posts with one of
  `Markets`, `Macro`, `Equities`, `Portfolio`, or `Data` (case-insensitive)
  and it'll show correctly; untagged posts default to "Markets".

## Known limitations / things you may want next

- **Reading time & excerpts** are estimated from the post's rendered HTML
  (word count ÷ 220wpm) since Beehiiv doesn't provide either directly. Set
  a post's **subtitle** in Beehiiv for a better excerpt than the
  auto-generated one.
- **"Most read" / "Editor's picks"** on the Research page are honestly
  labeled as "Latest Issues" / "More From The Archive" — Beehiiv's base API
  doesn't expose per-post read counts or an editorial-pick flag without an
  extra `stats` expand per post, which wasn't worth the added API load for
  a sidebar. Happy to wire up real stats if you want them badly enough to
  justify the extra calls.
- **Issue numbering** (`No. 047` style) is computed client-side from
  publish order, not stored in Beehiiv — it assumes your published post
  count stays under 100 (Beehiiv's per-request max); fine for a weekly
  newsletter for the next couple of years, but flag it if that changes.
- No local `npm install` / `next build` was run before delivering this —
  there's no network access in the environment I built it in. I verified
  everything I could with the TypeScript compiler directly against the
  real source (all 22 files, using the project's actual `strict: true`
  config), which catches syntax errors, bad imports, and type mismatches,
  but it isn't a substitute for a real `next build`. Run `npm install &&
  npm run build` locally (or let Vercel's first deploy do it) as the real
  check before you consider this done.
