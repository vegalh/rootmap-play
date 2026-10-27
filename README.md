# RootMap Play

RootMap Play is a playful, shareable collection of interactive digital
experiences for families with children aged 0–6, built under the RootMap
brand. It is a separate repository and deployment from RootMapMVP.

> **Status: Phase 1 — Foundation.** The site, navigation, design system, and
> analytics/admin scaffolding described below are implemented. The actual
> creation experiences (Pocket Universe, Little Hero Card, Family Universe)
> are intentionally **not yet implemented** — product pages honestly show a
> "creation feature coming soon" state instead of a fake working button. See
> [docs/ROADMAP.md](docs/ROADMAP.md) for what's planned next.

## What's implemented in Phase 1

- Homepage with hero, brand introduction, and a product grid.
- Three product routes (`/pocket-universe`, `/little-hero`, `/family-universe`)
  with original SVG illustrations and an honest "coming soon" state.
- Responsive header (desktop nav + mobile menu) and footer.
- A privacy notice banner that gates any future analytics network calls on
  explicit visitor consent.
- A consent-aware analytics abstraction (`src/analytics/`) with a safe no-op
  default provider and a Supabase-ready provider stub that only activates
  once a backend is configured, enabled, and consented to.
- A `/admin` route that honestly reports "setup required" instead of showing
  a working dashboard, a login form, or any mock data.
- Simplified Chinese UI copy with an i18n structure ready for English later.
- Unit tests (Vitest + Testing Library) and browser tests (Playwright) for
  all of the above.
- A GitHub Actions workflow that builds, tests, and deploys to GitHub Pages.

## What's intentionally NOT implemented yet

- The three creation experiences themselves (image composition, downloadable
  PNG export) — Phase 2.
- Rating / feedback collection UI — Phase 2/3.
- Community interest form — Phase 2/3.
- Supabase database schema, event ingestion, and authenticated admin access —
  Phase 3.
- Real analytics charts/metrics in the admin dashboard — Phase 4.

See [docs/ROADMAP.md](docs/ROADMAP.md) for details.

## Tech stack

React, Vite, TypeScript, Tailwind CSS v4, React Router, Vitest, Testing
Library, Playwright, GitHub Pages. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full breakdown and
folder structure.

## Running locally

Requires Node.js 20+.

```bash
npm install

# Start the dev server (http://localhost:5173/rootmap-play/)
npm run dev

# Type-check and build a production bundle into dist/
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint

# Run unit tests (Vitest)
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run browser tests (Playwright). First build or have a dev server
# available — the Playwright config boots `npm run preview` automatically.
npm run test:e2e
```

### Environment variables

The public site works with **zero environment variables configured**. All
Supabase-related variables are optional and only unlock real analytics
ingestion once Phase 3 backend work lands. Copy `.env.example` to `.env.local`
if/when you want to experiment with a real Supabase project:

```bash
cp .env.example .env.local
```

See `.env.example` for the full list and, importantly, why the Supabase
**service-role key must never** be placed in any `VITE_`-prefixed variable
(anything with that prefix is bundled into the public client).

## Deployment

The site deploys to GitHub Pages at `https://vegalh.github.io/rootmap-play/`
via [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which runs
on every push to `main`: install → lint → type-check/build → unit tests →
upload the `dist/` artifact → deploy with `actions/deploy-pages`.

**Action required in GitHub repository settings** (needs repo admin access,
which this assistant does not have): under **Settings → Pages**, set
**Source** to **GitHub Actions**. Until that's done, the workflow will build
and test successfully but the deploy step will not have anywhere to publish
to.

The Vite `base` path is set to `/rootmap-play/` to match the Pages project
URL, and `public/404.html` implements the standard SPA-on-GitHub-Pages
redirect so deep links (e.g. sharing `/pocket-universe` directly) work
without a real server-side router.

## Documentation

- [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) — product vision, goals, and the three initial experiences.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tech stack, folder structure, routing, analytics, and i18n architecture.
- [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md) — the full event catalogue, consent model, and what's required before collecting real data.
- [docs/ROADMAP.md](docs/ROADMAP.md) — phase-by-phase plan and current status.
