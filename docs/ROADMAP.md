# Roadmap

RootMap Play is being built in four phases. This document tracks what's done
and what's intentionally deferred, so nothing in later phases is silently
implemented ahead of schedule or silently skipped.

> **Product pivot in progress.** The sections below (original "Phase 1"
> through "Phase 4") describe the original creation-tool product, which is
> still live today. A new five-phase plan, superseding this one, is tracked
> separately immediately below — see [PRODUCT_PIVOT.md](PRODUCT_PIVOT.md)
> for the full vision.

## Product pivot — Phase 1: Foundation and content model 🚧 In progress

- [x] Audit the existing codebase (analytics abstraction, `FeedbackPrompt`,
  layout/routing, i18n, test infrastructure — see
  [PRODUCT_PIVOT.md](PRODUCT_PIVOT.md) for what's reused).
- [x] Design the Supabase schema: `challenges`, `challenge_questions`,
  `challenge_artworks`, `analytics_events`, `feedback_submissions`,
  `community_interest_submissions`, `admin_users` — see
  [docs/SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md).
- [x] Write SQL migrations and Row Level Security policies for every table
  and for the `challenge-artwork` storage bucket — see
  [supabase/migrations/](../supabase/migrations).
- [x] Design and document the server-enforced admin authorization model
  (Supabase Auth + `admin_users` allow-list + `is_admin()` — never a
  frontend route guard or email check) — see
  [docs/SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md#admin-authorization-model).
- [x] Add typed frontend content models
  ([src/content/types.ts](../src/content/types.ts)) and a pure, tested
  prompt-template validation/resolution utility
  ([src/content/promptTemplate.ts](../src/content/promptTemplate.ts)).
- [x] Add a small set of clearly labeled demo challenges
  ([src/content/demoChallenges.ts](../src/content/demoChallenges.ts) and
  [supabase/seed.sql](../supabase/seed.sql)) — not rendered by any page yet.
- [x] Preserve the existing live app (Pocket Universe, homepage, admin
  "setup required" state) completely unchanged.
- [ ] Not yet connected to a real Supabase project — see
  [supabase/README.md](../supabase/README.md) for that next action, which
  only the project owner can take (credentials cannot be created here).

**Explicitly not done in this phase** (by instruction — stop after Phase 1
pending approval): the public exhibition homepage/challenge pages, the live
prompt generator UI, the admin dashboard's real CRUD screens, and real
analytics ingestion/dashboard. See [PRODUCT_PIVOT.md](PRODUCT_PIVOT.md) for
Phases 2–5.

---

## Original Pocket Universe roadmap (historical)

The phases below predate the product pivot above and describe the
creation-tool product that is still live today.

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

## Phase 2A — Pocket Universe creator ✅ Complete

The first of the three creation experiences is fully functional end-to-end:

- [x] Five-item selection UI (`ItemPicker`) — 30 hand-authored SVG icons
  across 6 categories (animals/nature/food/vehicles/toys/magical), clear
  running "x/5" progress, exactly-five enforcement (disables the rest once
  full, deselect always allowed), accessible `<fieldset>`/`<legend>`/
  `aria-pressed` structure.
- [x] Deterministic composition engine (`composition.ts`) — seeds from the
  sorted selection (order-independent), picks a stable "hero" centerpiece,
  arranges the other four items around an elliptical orbit ring with
  seeded jitter, and scatters an ambient star field. Fully unit tested
  (9 tests) independent of React/DOM.
- [x] Themed scene renderer (`SceneArt`) — layered background sphere /
  ground / orbit ring / stars / items, 3 selectable color themes (深夜星空 /
  黄昏暖阳 / 梦境薰衣草), same layout logic across all themes.
- [x] Customize controls — regenerate (reshuffles layout, keeps the same
  hero), theme switch, and "← 重新选择" to return to the picker without
  losing the previous selection.
- [x] High-resolution PNG export (`svgExport.ts`) — rasterizes the SVG scene
  via canvas, then draws the Chinese title/credit text directly with the
  Canvas 2D API (after awaiting font readiness) for guaranteed correct glyph
  rendering; enforces a minimum 2000px long edge; small RootMap credit line
  included on every export. Verified with a real download in Chromium and
  mobile-chrome (Playwright).
- [x] Analytics wired end-to-end: `creation_started` (on generating the
  first composition), `creation_completed` (with selection duration),
  `download_clicked`, `download_succeeded` — no artwork content or child
  personal information included in any event.
- [x] Post-download optional 1–5 star rating (`FeedbackPrompt`, shared across
  future products) — low ratings (1–3) show the five specified reason chips,
  high ratings (4–5) show an optional free-text compliment; feedback never
  blocks or gates the download, which has already completed by the time this
  UI appears.
- [x] Tests: unit/component tests for selection enforcement, composition
  determinism, theme switching, regenerate, edit-selection, PNG export
  success/error paths, and analytics event firing; Playwright coverage for
  the full select → preview → download → rating journey on both desktop
  and mobile viewports.

**Known limitations:** the 30 item illustrations are original but simple
flat-SVG icons rather than fully painterly artwork — a few (e.g. the
lollipop spiral, fairy wings) would benefit from a visual polish pass.
Illustration quality should be revisited before heavy promotion. Mobile
downloading was verified in Chromium's mobile emulation (Pixel 7) only —
real iOS Safari save-to-photos behavior for a programmatic anchor download
has not been verified on a physical device.

## Phase 2B/2C — Little Hero Card & Family Universe (not started)

- Little Hero Card: playful question flow, generated character title/
  superpower/description/illustration, downloadable PNG.
- Family Universe: family member selection, name/relationship customization
  (common Chinese relationship terms), generated family map, downloadable PNG.
- Both product pages currently show an honest "即将开放" state and reuse the
  same analytics event names and `FeedbackPrompt` component built for
  Pocket Universe.
- Community interest invitation UI (separate consent from analytics;
  contact fields collected only after that consent) — not yet built for any
  product.

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
