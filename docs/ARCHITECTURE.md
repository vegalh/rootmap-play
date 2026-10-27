# Architecture

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19 + TypeScript | Strict TS via `tsc -b` project references |
| Build tool | Vite 8 | `base: '/rootmap-play/'` for GitHub Pages |
| Styling | Tailwind CSS v4 | CSS-first `@theme` config (no `tailwind.config.js`) |
| Routing | React Router v7 | `basename` derived from `import.meta.env.BASE_URL` |
| Unit/component tests | Vitest + Testing Library + jsdom | |
| Browser/e2e tests | Playwright (Chromium desktop + mobile-chrome) | |
| Hosting | GitHub Pages | Deployed via GitHub Actions, static SPA |
| Future backend | Supabase (Postgres + PostgREST + Auth) | Not yet provisioned — Phase 3 |

## Folder structure

```
src/
  analytics/          Analytics abstraction (see below)
  components/
    illustrations/    Original SVG artwork (logo, hero blobs, product art)
    layout/           Header, Footer, Layout (wraps <Outlet /> + tracking)
    ui/                Design-system primitives (Button, Badge, Container, SectionHeading)
    ProductCard.tsx           Home page product grid card (impression + click tracking)
    ProductDetailLayout.tsx   Shared layout for the 3 product detail pages
    PrivacyNoticeBanner.tsx   First-visit consent banner
  config/
    env.ts             Typed, centralised environment variable access
  i18n/
    translations/zh-CN.ts     Simplified Chinese copy dictionary
    index.ts                  `t` + `useTranslations()` — static today, locale-aware shape
  pages/               One file per route
  test/                Vitest setup + test helpers
e2e/                   Playwright specs
public/                Static assets, 404.html (SPA fallback), .nojekyll
```

## Routing & GitHub Pages SPA fallback

GitHub Pages serves static files with no server-side router, so direct loads
of a deep link (e.g. `https://vegalh.github.io/rootmap-play/pocket-universe`)
would normally 404. This is solved with the standard "spa-github-pages"
pattern:

1. `public/404.html` runs on any unmatched path. It computes the real path
   under the `/rootmap-play/` base, stores the full original URL in
   `sessionStorage.redirect`, and redirects to the site root.
2. `index.html` has an inline script that, on load, checks
   `sessionStorage.redirect`; if present, it calls
   `history.replaceState(null, '', redirect)` to restore the real URL before
   React Router mounts, then clears the stored value.
3. `main.tsx` passes `basename={import.meta.env.BASE_URL}` (with trailing
   slash stripped) to `<BrowserRouter>` so all routes resolve correctly
   under `/rootmap-play/` both in dev (base `/`) and production.

This means every route in `src/App.tsx` works for both client-side
navigation and hard/direct loads, and unknown paths render `NotFoundPage`
(verified in `src/App.test.tsx` and `e2e/navigation.spec.ts`).

## Analytics abstraction

Goals: typed event catalogue, works with zero configuration, never breaks
the public site, never sends anything anywhere without explicit consent, and
never collects sensitive data. See
[ANALYTICS_EVENTS.md](ANALYTICS_EVENTS.md) for the full event list and
consent model — this section covers the code shape.

```
src/analytics/
  events.ts              Event name + payload type catalogue (source of truth)
  types.ts                AnalyticsProvider interface (must never throw)
  consent.ts              localStorage-backed consent status (accepted/declined/unknown)
  providers/noopProvider.ts      Default. Logs to console in dev, does nothing else.
  providers/supabaseProvider.ts  Posts to PostgREST once configured + enabled + consented.
  manager.ts               Singleton `analytics` — picks provider, swallows all errors
  usePageViewTracking.ts   Router-aware hook firing `page_view` on route change
```

`analytics.track(event, properties)` is fully typed against
`AnalyticsEventPropertiesMap`, so calling it with the wrong payload shape is
a compile error. Internally it always resolves to the no-op provider unless
**all** of the following are true:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
  (`appConfig.isSupabaseConfigured`).
- `VITE_ENABLE_ANALYTICS=true` is set
  (`appConfig.isAnalyticsBackendEnabled`).
- The visitor has explicitly accepted the privacy notice banner
  (`hasAnalyticsConsent()`).

Even then, the Supabase provider uses a plain `fetch` POST against
PostgREST (`${VITE_SUPABASE_URL}/rest/v1/analytics_events`) with the
**anonymous key only** — it intentionally does not depend on the
`@supabase/supabase-js` SDK, since the ingestion table doesn't exist until
Phase 3 and pulling in a full SDK for an inactive feature would be
unnecessary complexity. Any network failure is caught and logged as a dev
warning only; it never throws and never surfaces to the user.

## Environment configuration

`src/config/env.ts` is the single place that reads `import.meta.env`. All
values are optional; nothing in this file ever throws, and absence simply
means dependent features (Supabase analytics ingestion, future admin auth)
stay in their "not configured" state. See `.env.example` for the documented
variable list and the explicit warning that the Supabase **service-role
key must never** be put in a `VITE_`-prefixed variable, since Vite inlines
those into the public client bundle.

## Internationalisation

`src/i18n/translations/zh-CN.ts` holds every piece of UI copy as a single
typed object (`Translations`). `src/i18n/index.ts` exports a static `t`
constant and a `useTranslations()` hook that both currently just return the
Chinese dictionary. Components already consume `useTranslations()` rather
than importing the dictionary directly, so adding a second locale later is a
matter of:

1. Adding `src/i18n/translations/en.ts` matching the same `Translations`
   shape.
2. Introducing a locale context/state and a `SUPPORTED_LOCALES` map in
   `src/i18n/index.ts`.
3. Swapping `useTranslations()`'s return value based on the active locale.

No component changes are required for that migration.

## Design system

Tailwind v4's CSS-first `@theme` block (in `src/index.css`) defines the
palette (`cream`, `ink`, `terracotta`, `pine`, `gold`), the two font
families, and soft shadow tokens — deliberately avoiding a default
blue/purple SaaS look. Two Google Fonts are loaded in `index.html`:
`Fraunces` (Latin display serif) and `Noto Sans SC` (Chinese + Latin body
and, as a fallback, display text — Fraunces has no CJK glyphs, and no
separate CJK serif family is loaded, so Chinese headings render in
`Noto Sans SC`). `src/components/ui/` holds the shared primitives (Button
variants, Badge, Container, SectionHeading); `src/components/illustrations/`
holds original SVG artwork used across the homepage and product pages.

## Testing

- **Unit/component tests** (`npm run test`): Vitest + Testing Library,
  jsdom environment configured in `vite.config.ts`'s `test` block, with
  `src/test/setup.ts` providing `jest-dom` matchers and a minimal
  `IntersectionObserver` stub (jsdom doesn't implement it, and
  `ProductCard.tsx` uses one for impression tracking).
- **Browser/e2e tests** (`npm run test:e2e`): Playwright, configured in
  `playwright.config.ts` with two projects (`chromium` desktop and
  `mobile-chrome`), running against a production build served by
  `vite preview`. Specs cover home page rendering, navigation across every
  route (including 404), the admin "setup required" state, and the privacy
  consent banner.

Two gotchas worth knowing if you add more Playwright specs:

- `playwright.config.ts`'s `baseURL` includes the `/rootmap-play/` path
  segment. `page.goto('/some-path')` (leading slash) resolves to the
  **site root**, discarding that segment — use `page.goto('some-path')`
  (no leading slash) instead, and `page.goto('')` for the home page.
- The header's desktop `<nav>` is `hidden` below the `md` breakpoint, so on
  the `mobile-chrome` project it isn't in the accessibility tree until the
  "菜单" (menu) toggle button is clicked first.

## Deployment

See the README's [Deployment](../README.md#deployment) section and
[.github/workflows/deploy.yml](../.github/workflows/deploy.yml). In short:
GitHub Actions builds, lints, type-checks, unit-tests, and publishes `dist/`
to GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages`
on every push to `main`. The repository's **Settings → Pages → Source** must
be set to **GitHub Actions** (one-time, manual, requires repo admin access).
