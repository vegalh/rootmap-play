# Analytics Events

RootMap Play's analytics exist to understand which products parents enjoy —
**anonymously**, and only with explicit visitor consent. This document is
the canonical reference for event names, payloads, the consent model, and
what must be true before any of this collects real production data.

Source of truth in code: [src/analytics/events.ts](../src/analytics/events.ts).

## Current status (Phase 2)

- Five new events cover the challenge-platform flow: `challenge_opened`,
  `prompt_started`, `prompt_generated`, `prompt_copied`, and
  `chatgpt_outbound_clicked`. Each carries only `challengeSlug` (plus an
  optional `source` on `challenge_opened`) — never answer text or the
  generated prompt itself.
- `challenge_opened` fires once when `ChallengeDetailPage` mounts, with
  `source` set to `'gallery_featured'`, `'gallery_grid'`, or `'direct'`
  depending on how the parent arrived.
- `prompt_started` fires on the first interaction with the questionnaire.
  `prompt_generated` fires once validation passes and a prompt is
  resolved. `prompt_copied` fires on the copy button; the ChatGPT button
  fires `chatgpt_outbound_clicked` immediately before the new tab opens.

## Prior status (Phase 2A)

- All ten event names and payload types below are defined and typed.
- `page_view` and the product-card events (`product_card_view`,
  `product_click`) fire from `src/components/layout/Layout.tsx`'s page-view
  hook and `src/components/ProductCard.tsx`.
- Pocket Universe (`src/features/pocketUniverse/PocketUniverseCreator.tsx`)
  now fires `creation_started`, `creation_completed`, `download_clicked`,
  and `download_succeeded`, and its post-download `FeedbackPrompt` fires
  `rating_submitted` and `feedback_submitted`. **Little Hero Card and Family
  Universe do not exist yet**, so none of these fire for those two products.
- `community_interest_submitted` has no UI yet (planned for a later phase).
- By default, every event resolves to a **no-op provider**: nothing is sent
  anywhere, regardless of consent, because no Supabase backend is
  configured. The dev console logs tracked events for local debugging only.
- **No mock or fabricated analytics data is presented anywhere** — the admin
  dashboard explicitly shows a "setup required" state instead of charts with
  placeholder numbers.

## Consent model

A first-visit banner (`src/components/PrivacyNoticeBanner.tsx`) asks for
consent before any event can ever reach a backend. Status is stored in
`localStorage` (`rootmap-play:analytics-consent`) as `'accepted'`,
`'declined'`, or `'unknown'` (not yet answered).

The analytics manager (`src/analytics/manager.ts`) only ever considers using
a real backend provider when **all** of the following hold:

1. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.
2. `VITE_ENABLE_ANALYTICS=true` is set.
3. `getConsentStatus() === 'accepted'`.

If any of these is false — including the common case of a fresh clone with
no `.env.local` at all — every event is handled by the no-op provider and
nothing leaves the browser. This means the public site always works
correctly with zero backend configuration, per the project's requirements.

## Event catalogue

| Event name | Fired when | Payload fields |
|---|---|---|
| `page_view` | A route renders (tracked once per route change) | `path`, `referrer?` |
| `product_card_view` | A product card scrolls into view on the home grid | `productId`, `position?` |
| `product_click` | A product card or its CTA is clicked | `productId`, `source?` |
| `creation_started` | A parent begins a creation flow | `productId` |
| `creation_completed` | A parent finishes composing a result | `productId`, `durationMs?` |
| `download_clicked` | The download button is pressed | `productId` |
| `download_succeeded` | The PNG export completes successfully | `productId` |
| `rating_submitted` | A parent submits a 1–5 star rating | `productId`, `rating` (1-5) |
| `feedback_submitted` | Optional feedback text/reason is submitted | `productId`, `rating`, `reason?`, `comment?` |
| `community_interest_submitted` | A parent opts into the community invitation | `interests` (array of `'community' \| 'product_testing' \| 'suggestions'`) |
| `challenge_opened` | The challenge detail page mounts | `challengeSlug`, `source?` |
| `prompt_started` | A parent first interacts with the questionnaire | `challengeSlug` |
| `prompt_generated` | A prompt is successfully resolved from valid answers | `challengeSlug` |
| `prompt_copied` | The "复制创作咒语" button is pressed | `challengeSlug` |
| `chatgpt_outbound_clicked` | The "打开 ChatGPT" link is clicked | `challengeSlug` |

`productId` is always one of `'pocket-universe' | 'little-hero' |
'family-universe'` (`PRODUCT_IDS` in `events.ts`) for the legacy
product-card events. The new challenge events above use `challengeSlug`
(a plain string, since challenges are admin-managed content, not a fixed
closed set) instead of `productId`.

### Low-rating reasons

When `rating` is 1–3, `feedback_submitted.reason` (if provided) must be one
of (`LOW_RATING_REASONS` in `events.ts`):

- 作品不够好看
- 结果不够个性化
- 操作太复杂
- 不符合我的期待
- 其他

4–5 star ratings may instead include free-text positive `comment`.
Submitting a rating/feedback must never block or delay downloading — this
will be enforced in the Phase 2 creation flow UI.

## What analytics events deliberately exclude

Per the project's hard privacy requirements, no event payload — now or in
any future phase — may contain:

- A child's name, photo, or other identifying detail.
- A WeChat or Xiaohongshu account identifier, inferred or entered.
- Any free-text field that isn't explicitly optional and user-initiated
  (e.g. `feedback_submitted.comment`).

Community interest **contact information** (WeChat ID, Xiaohongshu
username, preferred contact platform, product suggestions) is a
deliberately separate concern from anonymous analytics:

- It will be collected only after a second, explicit, separate consent step
  (distinct from the analytics consent banner).
- It will be stored in its own Supabase table, never merged with or sent to
  the anonymous `analytics_events` table/provider.
- It will never be exposed through a publicly readable table/API — only
  authenticated admin access may read it (see
  [ARCHITECTURE.md](ARCHITECTURE.md) and the Phase 3 plan in
  [ROADMAP.md](ROADMAP.md)).

None of this is implemented yet — it's documented here so Phase 3's schema
design has a clear, pre-agreed contract to build against.

## What's required before collecting real production data

1. **Supabase project provisioned** with an `analytics_events` table whose
   columns match `AnalyticsEventPropertiesMap` (plus a server-generated
   timestamp and an anonymous session/visitor identifier — not a user
   account id, since accounts don't exist).
2. Row-level security policies that allow **anonymous inserts only** (no
   anonymous reads) on `analytics_events`, so the anon key used by the
   frontend can never read other visitors' events.
3. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set in the deployment
   environment, and `VITE_ENABLE_ANALYTICS=true` set only once the schema
   above is live and reviewed.
4. A separate, non-public table (or a RLS-protected one with no anonymous
   read/write policy) for community interest contact submissions, with
   writes only permitted after the explicit contact-consent step.
5. Real administrator authentication (not a hardcoded password or
   frontend-only check) before the `/admin` dashboard is allowed to display
   any of this data — see [ROADMAP.md](ROADMAP.md) Phase 3/4.
6. Until 1–5 are in place, `/admin` must keep showing its current
   "setup required" state rather than a working dashboard — this is already
   enforced today since `isSupabaseConfigured` only toggles an informational
   note, never real data rendering.
