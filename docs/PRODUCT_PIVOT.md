# Product pivot: the challenge platform

> **This document captures a major product direction change**, agreed with
> the project owner, that supersedes the creation-tool framing in
> [PRODUCT_VISION.md](PRODUCT_VISION.md) going forward. It does not delete
> or invalidate that document yet — Pocket Universe, as described there, is
> still the live public experience while this pivot is implemented in
> phases (see [ROADMAP.md](ROADMAP.md)). This document is the source of
> truth for the *new* direction.

## What's changing

RootMap Play is becoming a **curated, admin-managed exhibition of creative
challenges**, not a client-side AI art generator:

- RootMap Play itself never generates images. It never has and never will
  call an image-generation API.
- An administrator curates and publishes beautiful example artwork and
  creative challenges through a private `/admin` dashboard — no redeploy
  required to publish, unpublish, reorder, or edit a challenge.
- A parent picks a challenge, answers a few simple questions about their
  child, and the site deterministically composes those answers into a
  personalized, high-quality **prompt** using an admin-defined template.
- The parent copies that prompt and pastes it into ChatGPT (or another
  image tool) themselves. RootMap Play never claims an image was generated
  on the site, and never claims success just because a prompt was copied.
- Feedback (star rating + optional reasons/comments) and an optional,
  separately-consented community-interest questionnaire follow the same
  shape already built for Pocket Universe (`FeedbackPrompt`), extended with
  a short additional questionnaire.

## What's staying the same

Per the pivot brief's explicit instruction to preserve reusable
infrastructure rather than rewrite it:

- Layout, routing, and the GitHub Pages deployment strategy.
- The consent-aware analytics abstraction (`src/analytics/`) — extended
  with new event names, not replaced (see
  [docs/SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md)).
- `FeedbackPrompt` and other shared UI components (`Button`, `Badge`,
  `Container`, `ArtworkFrame`, `ProductDetailLayout`).
- The privacy notice/consent banner.
- The i18n structure.
- The existing unit/browser test infrastructure (Vitest + Testing Library +
  Playwright).
- Pocket Universe's current SVG implementation is **not deleted** until the
  challenge-platform replacement is implemented and validated end-to-end
  (see Phase 5 in [ROADMAP.md](ROADMAP.md)).

## Prompt template system (design, not yet wired to UI)

The admin defines, per challenge: questions (short/long text, single/
multiple choice, required/optional, option lists, display order) and a
**placeholder-based prompt template** — e.g.
`请根据以下信息创作一张精美的幻想世界插画：{{favorite_things}}。...`. This is a
deterministic string-substitution system, never `eval`, never arbitrary
JavaScript execution, never unsanitized HTML rendering. Parent answers are
always treated as plain text.

Phase 1 ships the **pure, backend-agnostic logic** for this —
[src/content/promptTemplate.ts](../src/content/promptTemplate.ts) — so that
placeholder validation (every `{{question_key}}` in a template must match a
real question, and every required question should ideally appear in the
template) can be unit-tested and reused by both the future admin editor's
live preview (Phase 3) and the public prompt generator (Phase 2), without
duplicating the rules. It is not wired into any route or page yet.

## Database content model

See [docs/SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md) for the full schema, RLS
policies, and admin authorization model. The frontend-typed mirror of that
schema lives in [src/content/types.ts](../src/content/types.ts).

## Demo content

[src/content/demoChallenges.ts](../src/content/demoChallenges.ts) contains a
small set of **clearly labeled mock** challenges (matching the three
examples in the pivot brief) used today only by that module's own tests, to
prove the types and the prompt-template validator work end-to-end against
realistic content. It is intentionally not rendered by any page yet — the
public gallery UI is Phase 2 work. The equivalent SQL fixture for local
Supabase CLI testing is
[supabase/seed.sql](../supabase/seed.sql) — the two are independent,
hand-written mocks (one frontend-only, one backend-only), not a shared
source of truth, since no live Supabase connection exists yet to generate
one from the other.

## Phase plan

1. **Foundation and content model** *(this document's phase — see status in [ROADMAP.md](ROADMAP.md))*: schema, RLS, admin authorization design, typed content models, demo challenges.
2. **Public gallery and prompt generator**: exhibition homepage, challenge detail pages, configurable question forms, the live prompt generator UI, copy/ChatGPT actions.
3. **Admin content management**: secure login, challenge/artwork CRUD, question/template editor with live preview, publishing/ordering, private preview.
4. **Analytics and feedback**: secure event ingestion (incl. abuse controls), the real analytics dashboard, feedback/questionnaire review, community-interest management, CSV export.
5. **Final polish and migration cleanup**: mobile/visual polish, sharing metadata, removing the superseded SVG generator, documentation pass.

Each phase requires explicit approval before starting the next (see the
"How to Work" ground rules agreed for this pivot).
