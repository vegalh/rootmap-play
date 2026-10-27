# RootMap Play

RootMap Play is a playful, shareable collection of interactive digital
experiences for families with children aged 0–6, built under the RootMap
brand. It is a separate repository and deployment from RootMapMVP.

> **A product pivot is in progress** (currently Phase 2 of 5: public gallery
> and prompt generator, complete and awaiting approval for Phase 3).
> RootMap Play is evolving from a client-only AI-art tool into an
> admin-curated "creative challenge" platform: a warm, illustrated gallery
> homepage (**"The Little House"**) presents open-ended creative challenges;
> picking one opens a dynamic question form that generates a text prompt
> for the parent to paste into ChatGPT or another image tool themselves —
> RootMap Play never calls an image-generation API. See
> [docs/PRODUCT_PIVOT.md](docs/PRODUCT_PIVOT.md) for the full vision,
> [docs/SUPABASE_SCHEMA.md](docs/SUPABASE_SCHEMA.md) for the backend schema
> and admin authorization model, and [docs/ROADMAP.md](docs/ROADMAP.md) for
> current phase status.
>
> The original Pocket Universe creation tool (Phase 2A, below) remains fully
> live at `/pocket-universe`, `/little-hero`, and `/family-universe` — it's
> simply no longer linked from the homepage, in favor of the new gallery.

## What's implemented

- **The Little House gallery homepage**: a warm, illustrated entrance
  presenting one featured creative challenge and a grid of the rest, all
  read from a typed content model (`src/content/`) through a
  content-access abstraction designed to swap in a real Supabase-backed
  implementation later without touching any page or component.
- **Challenge detail pages** (`/challenges/:slug`): example artwork (clearly
  labeled as a placeholder until real artwork is supplied — RootMap Play
  never fakes finished art), an intro, a dynamically rendered question
  form (short/long text, single/multiple choice), and a generated prompt
  result with copy-to-clipboard and "open ChatGPT" actions. One page
  renders every admin-published challenge — no per-challenge hardcoded
  pages.
- A deterministic, `eval`-free prompt-template engine
  (`src/content/promptTemplate.ts`) that validates answers and resolves
  named placeholders into the final prompt text — reused by both the
  question form and the detail page, never reimplemented.
- **Pocket Universe** (`/pocket-universe`, still fully functional, reachable
  by direct link): pick exactly 5 of 30 illustrated items across 6
  categories, generate a deterministic personalized illustrated scene,
  switch between 3 color themes, regenerate the layout, return to edit the
  selection, and download a ≥2000px branded PNG. See
  [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it's built.
- Little Hero Card and Family Universe product routes exist with original
  SVG illustrations and an honest "即将开放" state (also no longer linked
  from the homepage, still reachable by direct link).
- Responsive header (logo + privacy link only, no hamburger menu) and a
  minimal footer.
- A privacy notice banner that gates any future analytics network calls on
  explicit visitor consent.
- A consent-aware analytics abstraction (`src/analytics/`) with a safe no-op
  default provider and a Supabase-ready provider stub that only activates
  once a backend is configured, enabled, and consented to. Pocket Universe
  fires `creation_started`/`creation_completed`/`download_clicked`/
  `download_succeeded`; the challenge gallery fires
  `challenge_opened`/`prompt_started`/`prompt_generated`/`prompt_copied`/
  `chatgpt_outbound_clicked`; and the post-download rating prompt fires
  `rating_submitted`/`feedback_submitted` — see
  [docs/ANALYTICS_EVENTS.md](docs/ANALYTICS_EVENTS.md).
- A `/admin` route that honestly reports "setup required" instead of showing
  a working dashboard, a login form, or any mock data.
- Simplified Chinese UI copy with an i18n structure ready for English later.
- Unit tests (Vitest + Testing Library) and browser tests (Playwright) for
  all of the above.
- A GitHub Actions workflow that builds, tests, and deploys to GitHub Pages.

## What's intentionally NOT implemented yet

- Real example artwork for any challenge — every artwork slot is an
  honestly labeled placeholder until real images are supplied.
- A live Supabase backend — the gallery/challenges above are still backed by
  demo content (`src/content/demoChallenges.ts`); no credentials or project
  have been connected.
- Admin content management (secure login, challenge/artwork CRUD, template
  editor with live preview) — Phase 3.
- Real analytics ingestion/dashboard and feedback review — Phase 4.
- Little Hero Card and Family Universe creation experiences (the SVG
  generator itself, not the gallery around it) — Phase 2B/2C of the
  original roadmap, separate from the challenge-platform pivot.

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
