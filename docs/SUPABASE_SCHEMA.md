# Supabase schema & admin authorization model

> **Status: designed, not connected.** Everything in this document and in
> [supabase/migrations/](../supabase/migrations) is schema design and local
> tooling only. No hosted Supabase project exists yet, nothing here has run
> against production, and the public site and `/admin` behave exactly as
> before until a real project is connected (see
> [supabase/README.md](../supabase/README.md) for that next step). This is
> the Phase 1 foundation for the challenge-platform product pivot described
> in [PRODUCT_PIVOT.md](PRODUCT_PIVOT.md).

## Why this exists

The product pivot replaces Pocket Universe's client-only SVG composer with
a model where an administrator curates challenges, example artwork, and
question/prompt-template configuration — and publishes changes without a
redeploy. That requires a real backend. Supabase was chosen (per the
product brief) for Postgres + Auth + Storage + Row Level Security (RLS) in
one project, all reachable from a static GitHub Pages frontend using only a
public anon key.

## Tables

| Table | Purpose | Public read | Public write | Admin |
|---|---|---|---|---|
| `admin_users` | Authorization allow-list (see below) | ❌ never | ❌ never | only via direct DB access, never the public API |
| `challenges` | A creative challenge (title, teaser, prompt template, status, order) | ✅ when `status = 'published'` | ❌ | full read/write |
| `challenge_questions` | The question form for a challenge | ✅ only for published challenges | ❌ | full read/write |
| `challenge_artworks` | Curated example artwork metadata (storage path, caption, alt text) | ✅ only for published challenges | ❌ | full read/write |
| `analytics_events` | Anonymous, consent-gated product analytics | ❌ (insert-only) | ✅ insert only, no select | read + delete |
| `feedback_submissions` | Voluntary star rating + optional questionnaire | ❌ (insert-only) | ✅ insert only, no select | read + delete |
| `community_interest_submissions` | Voluntary, separately-consented community/contact interest | ❌ (insert-only) | ✅ insert only, no select | read + update + delete |

Storage: a single **private** `challenge-artwork` bucket. See
[Storage strategy](#storage-strategy) below — "private" here is load-bearing
for keeping unpublished artwork hidden.

Full column-level detail lives in the migration files themselves
(each has extensive comments):

1. [20261027000001_foundational_helpers_and_admin_auth.sql](../supabase/migrations/20261027000001_foundational_helpers_and_admin_auth.sql)
2. [20261027000002_challenge_content_schema.sql](../supabase/migrations/20261027000002_challenge_content_schema.sql)
3. [20261027000003_analytics_events.sql](../supabase/migrations/20261027000003_analytics_events.sql)
4. [20261027000004_feedback_and_community_interest.sql](../supabase/migrations/20261027000004_feedback_and_community_interest.sql)
5. [20261027000005_challenge_artwork_storage.sql](../supabase/migrations/20261027000005_challenge_artwork_storage.sql)

## Admin authorization model

**The frontend never decides who is an admin.** There is no hardcoded
password, no "is this email in a list" check in TypeScript, and no reliance
on `/admin` being an obscure route. Authorization is enforced entirely by
Postgres RLS, which the public anon key cannot bypass:

1. An administrator authenticates with **Supabase Auth** (email/password or
   magic link) exactly like any other Supabase user would. This produces a
   normal `auth.users` row and a JWT — nothing special yet.
2. Being an admin is defined **solely** by having a corresponding row in
   `public.admin_users`, keyed by `auth.users.id`. This table has RLS
   enabled with **zero** policies for `anon`/`authenticated` — meaning
   nobody can read, insert, update, or delete it through the public API,
   full stop. Only a direct database connection (the project owner, using
   the service-role key or the Supabase Studio/CLI, never the frontend) can
   manage admin membership. See [supabase/README.md](../supabase/README.md)
   for the exact steps to create the first admin.
3. `public.is_admin()` is a `SECURITY DEFINER` SQL function that checks
   whether `admin_users` contains a row for `auth.uid()` (the currently
   authenticated request's user id, as decoded from its JWT by PostgREST).
   `SECURITY DEFINER` is what lets this function consult a table that has
   no public policies of its own, without opening that table up generally —
   it's the one narrow, intentional exception.
4. **Every** privileged RLS policy on every table — challenge writes,
   analytics reads, feedback reads, community-interest management, and the
   storage bucket — calls `public.is_admin()`. There is no second,
   parallel authorization path to keep in sync.
5. Losing/rotating the anon key does not grant admin access — RLS is
   evaluated per-request based on the authenticated JWT, not the key used
   to reach PostgREST.

This means: even if someone discovers the `/admin` route, reads the
frontend bundle, or obtains the public anon key (expected to be public —
it's shipped in the Vite bundle by design), they still cannot read
analytics, feedback, or contact information, or write/publish challenge
content, without an `admin_users` row that only the project owner can
create.

## Row Level Security summary

- **`challenges` / `challenge_questions` / `challenge_artworks`**: anon and
  authenticated roles may `select` only rows belonging to a
  `status = 'published'` challenge (admins may `select` everything, for
  private preview of drafts). All writes require `is_admin()`.
- **`analytics_events` / `feedback_submissions`**: anon and authenticated
  roles may `insert` (`with check (true)` — these are intentionally public,
  write-only submission endpoints) but have **no select policy at all**,
  so nobody can read back analytics or feedback through the public API,
  including the person who just submitted one. Only admins can `select`
  (and `delete`, e.g. to honor a feedback deletion request).
- **`community_interest_submissions`**: same insert-only-for-public,
  admin-only-read shape, plus a `check` constraint
  (`contact_handle_requires_consent`) that makes it a *database-level*
  invariant — not just an app convention — that a WeChat/Xiaohongshu handle
  can never be stored without `contact_consent_given = true` alongside it.
- **`admin_users`**: no policies at all for `anon`/`authenticated` (default
  deny on every operation).

## Storage strategy

The `challenge-artwork` bucket is created with Supabase's **public bucket
flag set to `false`**. This is a deliberate choice: a "public" Supabase
Storage bucket serves any object via its public URL with **no RLS check
whatsoever**, which would mean an unpublished challenge's artwork is only
"hidden" as long as nobody guesses or leaks its object path — not an
acceptable guarantee per the product spec's "avoid exposing unpublished
artwork unintentionally" requirement.

Instead, every read goes through a `storage.objects` RLS policy that joins
back to `public.challenges` using the object path convention
`{challenge_id}/{artwork_id}-{filename}`:

```sql
using (
  bucket_id = 'challenge-artwork'
  and (
    public.is_admin()
    or exists (
      select 1 from public.challenges c
      where c.id::text = (storage.foldername(name))[1]
        and c.status = 'published'
    )
  )
)
```

Unpublishing a challenge immediately revokes public read access to every
object under its folder — no code change, no cache to bust, no separate
"make this image private too" step. Uploads/updates/deletes require
`is_admin()`. File type (`image/jpeg`, `image/png`, `image/webp`) and size
(10 MiB) are enforced at the bucket level.

## What's deliberately *not* in Phase 1

- No Supabase client library (`@supabase/supabase-js`) has been added to
  `package.json` yet, and no frontend code queries any of these tables.
  Phase 1 is schema + authorization design; wiring the public gallery,
  prompt generator, and admin dashboard to real queries is Phase 2/3 (see
  [ROADMAP.md](ROADMAP.md)).
- No Edge Functions yet. Direct `insert`-only RLS policies are sufficient
  for Phase 1's goals; rate-limiting/abuse-control for public analytics and
  feedback ingestion (explicitly called for in the product spec) is planned
  as Phase 4 work, once there's real traffic to protect against.
- `analytics_events.properties` has a byte-size cap (4000 bytes) enforced
  by a check constraint, but Postgres check constraints can't cleanly
  enumerate "forbidden jsonb keys" (e.g. rejecting a `wechat_id` key).
  That stricter validation is documented here as a requirement for the
  Phase 4 ingestion path, not implemented as a trigger in Phase 1.
- Nothing has been deployed. These migrations have only been validated by
  manual SQL review (no local Supabase CLI/Docker instance was available
  in this environment) — see [supabase/README.md](../supabase/README.md)
  for how to actually run `supabase start` / `supabase db reset` and verify
  them yourself before connecting a hosted project.
