# Roadmap

RootMap Play is being built in four phases. This document tracks what's done
and what's intentionally deferred, so nothing in later phases is silently
implemented ahead of schedule or silently skipped.

## Phase 1 — Foundation ✅ Complete

- [x] Inspect the repository.
- [x] Initialize the React/Vite/TypeScript application.
- [x] Configure Tailwind CSS (v4, CSS-first theme).
- [x] Set up routing (React Router, GitHub Pages-aware basename + SPA fallback).
- [x] Build the RootMap Play homepage.
- [x] Create three product cards and product routes (honest "coming soon" state).
- [x] Create reusable design components (Button, Badge, Container, ArtworkFrame, ProductCard, ProductDetailLayout).
- [x] Add a responsive header and footer.
- [x] Create the analytics abstraction (typed events, consent-aware, Supabase-ready stub, safe no-op default).
- [x] Create a secure placeholder for the admin dashboard (setup-required state, no hardcoded auth, no mock data).
- [x] Add unit tests (Vitest) and browser tests (Playwright).
- [x] Configure GitHub Pages deployment (Vite base path, 404.html SPA fallback, GitHub Actions workflow).

**Not included in Phase 1** (by explicit instruction — Phase 1 is foundation
only): the three creation experiences themselves, rating/feedback UI,
community interest form, any Supabase schema/backend, and real admin
dashboard data. Product pages exist and look finished, but their primary
action is honestly disabled rather than faked.

**Homepage/UX redesign pass (post-Phase-1):** the original Phase 1 homepage
read as a full SaaS landing page (brand intro, mission/trust sections, three
equal-weight product cards). It was redesigned into a lightweight promotional
mini-experience: a minimal header (logo + a single privacy link, no
hamburger menu), one hero section featuring Pocket Universe with a framed
"art print" preview (`ArtworkFrame`) and a single primary CTA, two compact
secondary experience cards below it, and a minimal footer. Product detail
pages were simplified to a single artwork + name/tagline + one honest
"即将开放" CTA, dropping the old multi-step explanatory layout. No analytics
events, consent design, or admin placeholder were changed by this pass.

## Phase 2 — Interactive products (not started)

Implement the three creation experiences, beginning with Pocket Universe:

- Pocket Universe: five-item selection UI, live/preview composition from
  original SVG elements, downloadable PNG with small RootMap branding.
- Little Hero Card: playful question flow, generated character title/
  superpower/description/illustration, downloadable PNG.
- Family Universe: family member selection, name/relationship customization
  (common Chinese relationship terms), generated family map, downloadable PNG.
- Wire up `creation_started`, `creation_completed`, `download_clicked`,
  `download_succeeded` analytics events (types already exist in
  `src/analytics/events.ts`).
- Post-creation rating UI (1–5 stars) with the specified low-rating reason
  chips, never blocking download.
- Community interest invitation UI (separate consent from analytics;
  contact fields collected only after that consent).

## Phase 3 — Backend (not started)

- Supabase project provisioning and migrations:
  - `analytics_events` table, anonymous-insert-only RLS.
  - Community interest/contact table, no public read/write access.
  - Feedback/rating table.
- Secure event ingestion wired to `src/analytics/providers/supabaseProvider.ts`
  (already shaped for this — currently fails silently since the table
  doesn't exist).
- Real administrator authentication for `/admin` (e.g. Supabase Auth with a
  server-verified admin role/claim) — explicitly not a hardcoded password or
  frontend-only check.
- Until this phase lands, `/admin` continues to show "setup required."

## Phase 4 — Analytics dashboard (not started)

- Real metrics and visualizations built on top of the Phase 3 data:
  visits/unique visitors over time, product impressions/clicks/CTR, creation
  starts/completions/completion rate, download attempts/successes/conversion
  rate, average satisfaction per product, low-rating reason breakdowns,
  returning-visitor estimates, community interest submissions.
- Product performance comparison views.
- Feedback summaries.
- CSV export.
- All of the above gated behind the real admin authentication built in
  Phase 3 — never shown with fabricated/mock numbers.

## Open items that need the user's input (not blocking Phase 1)

- The real RootMap main-site URL, for the eventual "introduce interested
  parents to the main RootMap application" cross-link. Not fabricated
  anywhere in Phase 1 — the homepage's secondary CTA currently links to an
  in-page anchor instead.
- Confirmation of the Supabase project to provision for Phase 3 (new project
  vs. an existing one shared with RootMapMVP — the instructions say this is
  a separate repository/deployment, but don't specify Supabase project
  isolation).
- GitHub repository admin action: set **Settings → Pages → Source** to
  **GitHub Actions** so the deployment workflow has somewhere to publish to.
