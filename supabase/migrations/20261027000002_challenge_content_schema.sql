-- Challenge content schema: challenges, their question forms, and their
-- curated example artwork. This is the data the public exhibition site and
-- the admin dashboard both read from (Phase 2/3), designed here in Phase 1.

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  -- Stable, URL-safe identifier used in public links (e.g. for Xiaohongshu/
  -- WeChat sharing) instead of exposing the database id.
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  -- The single intriguing sentence shown on the homepage card.
  teaser text not null check (char_length(teaser) between 1 and 280),
  -- Longer description shown on the challenge detail page.
  description text not null default '' check (char_length(description) <= 4000),
  -- Optional free-text visual-style guidance folded into generated prompts
  -- (e.g. "水彩质感，柔和光线"). Never executable, always plain text.
  style_notes text check (style_notes is null or char_length(style_notes) <= 1000),
  -- Named-placeholder template resolved against challenge_questions answers.
  -- Validated by the admin editor (and by src/content/promptTemplate.ts)
  -- against this challenge's question_key values before publishing.
  prompt_template text not null default '' check (char_length(prompt_template) <= 4000),
  cta_label text not null default '我也想试试' check (char_length(cta_label) <= 40),
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.challenges is
  'A single creative challenge (e.g. 宝宝的口袋宇宙). Only rows with status = ''published'' are ever visible to anonymous visitors.';
comment on column public.challenges.slug is
  'Stable public identifier for direct/shareable links; never reuse or repurpose a slug after it has been shared.';

create index if not exists challenges_status_display_order_idx
  on public.challenges (status, display_order);

drop trigger if exists set_challenges_updated_at on public.challenges;
create trigger set_challenges_updated_at
  before update on public.challenges
  for each row execute function public.set_updated_at();

create table if not exists public.challenge_questions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  -- Matches a {{question_key}} placeholder in the parent challenge's
  -- prompt_template. snake_case by convention, enforced here.
  question_key text not null check (question_key ~ '^[a-z][a-z0-9_]*$'),
  prompt_label text not null check (char_length(prompt_label) between 1 and 200),
  help_text text check (help_text is null or char_length(help_text) <= 300),
  question_type text not null
    check (question_type in ('short_text', 'long_text', 'single_choice', 'multiple_choice')),
  is_required boolean not null default true,
  -- Required (non-null, non-empty array) for single_choice/multiple_choice,
  -- must be null for the two free-text types. Enforced below.
  options jsonb,
  -- Guards against excessively long free-text submissions (requirement in
  -- the product spec). Ignored for choice question types.
  max_length integer not null default 200 check (max_length between 1 and 2000),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, question_key),
  constraint options_required_for_choice_types check (
    (question_type in ('single_choice', 'multiple_choice') and jsonb_typeof(options) = 'array' and jsonb_array_length(options) > 0)
    or (question_type in ('short_text', 'long_text') and options is null)
  )
);

comment on table public.challenge_questions is
  'Admin-defined question form for a challenge. question_key must match a {{placeholder}} used in the parent challenge''s prompt_template.';
comment on column public.challenge_questions.options is
  'Array of {"value": string, "label": string} objects. Only present for single_choice/multiple_choice.';

create index if not exists challenge_questions_challenge_id_display_order_idx
  on public.challenge_questions (challenge_id, display_order);

drop trigger if exists set_challenge_questions_updated_at on public.challenge_questions;
create trigger set_challenge_questions_updated_at
  before update on public.challenge_questions
  for each row execute function public.set_updated_at();

create table if not exists public.challenge_artworks (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  -- Path within the private `challenge-artwork` storage bucket, always
  -- prefixed with `{challenge_id}/` — see the storage migration for why.
  storage_path text not null,
  title text check (title is null or char_length(title) <= 120),
  caption text check (caption is null or char_length(caption) <= 300),
  -- Required for every artwork: accessibility is not optional here.
  alt_text text not null check (char_length(alt_text) between 1 and 300),
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.challenge_artworks is
  'Curated example artwork for a challenge. storage_path points into the private challenge-artwork bucket; public read access is granted per-object only when the parent challenge is published (see storage migration).';

create unique index if not exists challenge_artworks_storage_path_idx
  on public.challenge_artworks (storage_path);
create index if not exists challenge_artworks_challenge_id_display_order_idx
  on public.challenge_artworks (challenge_id, display_order);

-- At most one featured artwork per challenge (used as the homepage/card
-- cover image).
create unique index if not exists challenge_artworks_one_featured_per_challenge_idx
  on public.challenge_artworks (challenge_id)
  where is_featured;

alter table public.challenges enable row level security;
alter table public.challenge_questions enable row level security;
alter table public.challenge_artworks enable row level security;

-- Public visitors may read PUBLISHED challenges and their questions/artwork
-- only. Admins may read everything (including drafts, for private preview).
create policy "public_read_published_challenges"
  on public.challenges for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "public_read_questions_of_published_challenges"
  on public.challenge_questions for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.challenges c
      where c.id = challenge_questions.challenge_id and c.status = 'published'
    )
  );

create policy "public_read_artworks_of_published_challenges"
  on public.challenge_artworks for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.challenges c
      where c.id = challenge_artworks.challenge_id and c.status = 'published'
    )
  );

-- Only admins may ever write challenge content. No anon/authenticated
-- insert/update/delete policies exist for these tables, so writes from any
-- non-admin session are denied by default.
create policy "admin_write_challenges"
  on public.challenges for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_write_challenge_questions"
  on public.challenge_questions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_write_challenge_artworks"
  on public.challenge_artworks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
