# RootMap Play

RootMap Play is a playful, shareable collection of interactive digital
experiences for families with children aged 0–6, built under the RootMap
brand. It is a separate repository and deployment from RootMapMVP.

> **Status: Phase 2A — Pocket Universe creator.** The foundation (site,
> navigation, design system, analytics/admin scaffolding) and a fully
> functional Pocket Universe creation experience are implemented. Little
> Hero Card and Family Universe are intentionally **not yet implemented** —
> their product pages honestly show a "即将开放" (coming soon) state instead
> of a fake working button. See [docs/ROADMAP.md](docs/ROADMAP.md) for
> what's planned next.
>
> **A product pivot is in progress** (currently Phase 1 of 5: schema design
> only — the public site below is unchanged). RootMap Play is evolving into
> an admin-curated challenge/prompt-generation platform instead of a
> client-only AI art tool. See [docs/PRODUCT_PIVOT.md](docs/PRODUCT_PIVOT.md)
> for the new vision, [docs/SUPABASE_SCHEMA.md](docs/SUPABASE_SCHEMA.md) for
> the backend schema and admin authorization model, and
> [docs/ROADMAP.md](docs/ROADMAP.md) for current phase status.

## What's implemented

- Homepage as a lightweight, art-first promotional entry point (not a SaaS
  landing page) — one hero experience, a short headline, one primary CTA,
  and two secondary experience cards.
- **Pocket Universe** (`/pocket-universe`) is fully functional: pick exactly
  5 of 30 illustrated items across 6 categories, generate a deterministic
  personalized illustrated scene, switch between 3 color themes, regenerate
  the layout, return to edit the selection, and download a ≥2000px branded
  PNG. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it's built.
- Little Hero Card and Family Universe product routes exist with original
  SVG illustrations and an honest "即将开放" state.
- Responsive header (logo + privacy link only, no hamburger menu) and a
  minimal footer.
- A privacy notice banner that gates any future analytics network calls on
  explicit visitor consent.
- A consent-aware analytics abstraction (`src/analytics/`) with a safe no-op
  default provider and a Supabase-ready provider stub that only activates
  once a backend is configured, enabled, and consented to. Pocket Universe
  fires `creation_started`/`creation_completed`/`download_clicked`/
  `download_succeeded`, and its post-download rating prompt fires
  `rating_submitted`/`feedback_submitted` — see
  [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md).
- A `/admin` route that honestly reports "setup required" instead of showing
  a working dashboard, a login form, or any mock data.
- Simplified Chinese UI copy with an i18n structure ready for English later.
- Unit tests (Vitest + Testing Library) and browser tests (Playwright) for
  all of the above.
- A GitHub Actions workflow that builds, tests, and deploys to GitHub Pages.

## What's intentionally NOT implemented yet

- Little Hero Card and Family Universe creation experiences — Phase 2B/2C.
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

- [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) — original product vision, goals, and the three initial experiences (still the live public site today).
- [docs/PRODUCT_PIVOT.md](docs/PRODUCT_PIVOT.md) — the new challenge-platform product direction and phase plan.
- [docs/SUPABASE_SCHEMA.md](docs/SUPABASE_SCHEMA.md) — backend schema, Row Level Security policies, and the server-enforced admin authorization model.
- [supabase/README.md](supabase/README.md) — local Supabase CLI setup and how to connect a real project.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — tech stack, folder structure, routing, analytics, and i18n architecture.
- [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md) — the full event catalogue, consent model, and what's required before collecting real data.
- [docs/ROADMAP.md](docs/ROADMAP.md) — phase-by-phase plan and current status.
