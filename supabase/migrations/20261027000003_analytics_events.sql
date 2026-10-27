-- Analytics event ingestion.
--
-- Column/table names here intentionally match what
-- src/analytics/providers/supabaseProvider.ts already posts to
-- (`analytics_events` with `event_name` / `properties` / `occurred_at`),
-- so that provider starts working the moment this migration is applied and
-- VITE_ENABLE_ANALYTICS is turned on — no frontend changes required.
--
-- `event_name` accepts BOTH the event vocabulary already shipped for the
-- live Pocket Universe experience (`creation_started`, `download_succeeded`,
-- etc., see src/analytics/events.ts) and the new challenge-platform
-- vocabulary from the product pivot spec (`challenge_impression`,
-- `prompt_copied`, etc.). Both experiences are live side-by-side during the
-- migration (see docs/ROADMAP.md), so both vocabularies must keep working.
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in (
    -- Existing Pocket Universe / shared vocabulary (src/analytics/events.ts)
    'page_view',
    'product_card_view',
    'product_click',
    'creation_started',
    'creation_completed',
    'download_clicked',
    'download_succeeded',
    'rating_submitted',
    'feedback_submitted',
    'community_interest_submitted',
    -- New challenge-platform vocabulary (product pivot spec, section 7)
    'challenge_impression',
    'challenge_opened',
    'prompt_started',
    'prompt_generated',
    'prompt_copied',
    'chatgpt_outbound_clicked'
  )),
  -- Nullable: only events about a specific challenge set this.
  challenge_id uuid references public.challenges (id) on delete set null,
  -- Client-generated anonymous identifiers (never a Supabase Auth user id
  -- for public visitors). Only ever written when analytics consent was
  -- granted — see src/analytics/consent.ts.
  visitor_id text check (visitor_id is null or char_length(visitor_id) <= 100),
  session_id text check (session_id is null or char_length(session_id) <= 100),
  referrer text check (referrer is null or char_length(referrer) <= 500),
  -- Non-sensitive event metadata only. A hard size cap guards against
  -- abuse/malformed submissions; forbidden-key enforcement (no child
  -- names, generated prompt text, WeChat/Xiaohongshu identifiers, etc.) is
  -- documented in docs/SUPABASE_SCHEMA.md and enforced by the Phase 4
  -- ingestion path, since Postgres check constraints cannot easily inspect
  -- arbitrary jsonb key sets at the column-default level used here.
  properties jsonb not null default '{}'::jsonb check (pg_column_size(properties) <= 4000),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.analytics_events is
  'Anonymous, consent-gated product analytics. No PII, no free-text child descriptions, no generated prompt text, no contact identifiers — see docs/SUPABASE_SCHEMA.md.';

create index if not exists analytics_events_event_name_occurred_at_idx
  on public.analytics_events (event_name, occurred_at);
create index if not exists analytics_events_challenge_id_idx
  on public.analytics_events (challenge_id);

alter table public.analytics_events enable row level security;

-- Anonymous visitors (and logged-in admins, who share the same frontend
-- code path) may INSERT events but can never read any event back — this is
-- what keeps one visitor from reading another visitor's analytics through
-- the anon key.
create policy "anon_insert_analytics_events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

-- Only admins may read analytics (the admin dashboard, Phase 4).
create policy "admin_read_analytics_events"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());

-- Nobody may update or delete analytics events through the public API —
-- intentionally no policies for those operations beyond admin-only select.
create policy "admin_delete_analytics_events"
  on public.analytics_events for delete
  to authenticated
  using (public.is_admin());
