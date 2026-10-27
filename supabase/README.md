# Supabase backend (local development)

This directory contains the SQL migrations, storage policy, and local-dev
seed data for RootMap Play's challenge-platform backend. **No Supabase
project is connected yet** — see
[docs/SUPABASE_SCHEMA.md](../docs/SUPABASE_SCHEMA.md) for the full schema
reference and authorization model, and the end of this file for what to do
to actually connect one.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (`brew install supabase/tap/supabase` or see the linked docs for other platforms).
- Docker (the CLI runs Postgres, Auth, Storage, etc. locally in containers).

## Running locally

```bash
cd supabase/..               # repository root
supabase start                # boots local Postgres/Auth/Storage/Studio
supabase db reset             # (re)applies every migration in order, then seed.sql
```

`supabase start` prints a local API URL and anon key — copy those into
`.env.local` as `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see
[.env.example](../.env.example)) to point the frontend at your local
instance. Local Supabase Studio is at `http://127.0.0.1:54323`.

`supabase db reset` drops and recreates the local database, re-running every
file in [migrations/](migrations) in filename order and then
[seed.sql](seed.sql) (three demo challenges — two published, one draft — so
you can see published/draft visibility working immediately). Seed data is
**local-development-only**, never production content.

## Creating the first administrator (local or hosted)

There is intentionally no sign-up flow that grants admin access. To make a
Supabase Auth user an administrator:

1. Have that person sign up/sign in once through Supabase Auth (Studio's
   Auth panel locally, or your real project's Auth settings once hosted) so
   a row exists in `auth.users`.
2. As the project owner, insert a row into `public.admin_users` referencing
   their `auth.users.id` — via Studio's SQL editor, `psql`, or the CLI:

   ```sql
   insert into public.admin_users (user_id, note)
   values ('<their-auth-users-uuid>', 'created via supabase/README.md step 2');
   ```

That single row is the entire authorization mechanism — see
`public.is_admin()` in
[migrations/20261027000001_foundational_helpers_and_admin_auth.sql](migrations/20261027000001_foundational_helpers_and_admin_auth.sql)
and [docs/SUPABASE_SCHEMA.md](../docs/SUPABASE_SCHEMA.md).

## Connecting a real (hosted) project — next action for the project owner

This repository cannot create or configure a hosted Supabase project (no
credentials exist in this environment, and none should ever be invented).
To go from "schema designed" to "backend connected":

1. Create a Supabase project at [supabase.com](https://supabase.com) (a new
   project, isolated from any existing RootMapMVP infrastructure, is
   recommended but is your call).
2. Push these migrations to it: `supabase link --project-ref <ref>` then
   `supabase db push`. **Do not** run `seed.sql` against production — it's
   local-dev demo content only.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the anon/publishable
   key, never the service-role key) in your local `.env.local` and in the
   GitHub Actions deployment environment/secrets for the Pages workflow.
4. Create your own Supabase Auth account in that project, then insert your
   `admin_users` row as above.
5. Leave `VITE_ENABLE_ANALYTICS` unset/`false` until the Phase 4 analytics
   dashboard work lands — flipping it on earlier would start sending real
   events with no dashboard yet to review them.

None of this is required for the public site to keep working — it continues
to degrade gracefully with zero environment variables configured.
