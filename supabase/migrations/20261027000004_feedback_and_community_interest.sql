-- Voluntary feedback/questionnaire responses and community interest
-- submissions. Deliberately separate tables from analytics_events (per the
-- product spec: "store voluntary questionnaire responses separately from
-- analytics events") and from each other, so that optional contact
-- information never gets anywhere near the anonymous analytics pipeline.

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges (id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  low_rating_reason text check (low_rating_reason is null or low_rating_reason in (
    '创意不够吸引我',
    'Prompt 不够个性化',
    '操作太复杂',
    '不知道怎么使用',
    '其他'
  )),
  comment text check (comment is null or char_length(comment) <= 1000),
  -- Optional questionnaire (all voluntary, all independently nullable).
  child_age_range text check (child_age_range is null or child_age_range in (
    '0-2', '2-3', '3-4', '4-6', 'other'
  )),
  future_topic_suggestion text check (future_topic_suggestion is null or char_length(future_topic_suggestion) <= 500),
  -- Anonymous correlation only (e.g. the same client-side id used in
  -- analytics_events.visitor_id) — never a Supabase Auth user id.
  visitor_id text check (visitor_id is null or char_length(visitor_id) <= 100),
  created_at timestamptz not null default now()
);

comment on table public.feedback_submissions is
  'Voluntary star rating + optional questionnaire. Never publicly readable. child_age_range/future_topic_suggestion/comment are all optional and voluntary, never required to participate.';

create index if not exists feedback_submissions_challenge_id_idx
  on public.feedback_submissions (challenge_id);

alter table public.feedback_submissions enable row level security;

create policy "anon_insert_feedback_submissions"
  on public.feedback_submissions for insert
  to anon, authenticated
  with check (true);

create policy "admin_read_feedback_submissions"
  on public.feedback_submissions for select
  to authenticated
  using (public.is_admin());

create policy "admin_delete_feedback_submissions"
  on public.feedback_submissions for delete
  to authenticated
  using (public.is_admin());

create table if not exists public.community_interest_submissions (
  id uuid primary key default gen_random_uuid(),
  -- Optional link back to the feedback flow that led here; never required.
  feedback_submission_id uuid references public.feedback_submissions (id) on delete set null,
  wants_community boolean not null,
  contact_platform text not null default 'none' check (contact_platform in ('wechat', 'xiaohongshu', 'none')),
  -- The actual WeChat ID / Xiaohongshu username. Requires its own explicit
  -- consent (contact_consent_given), separate from the analytics consent
  -- banner and separate from wanting to hear about the community in
  -- general. No prechecked boxes: contact_consent_given must be explicitly
  -- set true by the submitter, enforced by the app layer and re-asserted
  -- here via the check constraint below.
  contact_handle text check (contact_handle is null or char_length(contact_handle) <= 100),
  contact_consent_given boolean not null default false,
  -- Supports "a reasonable method to request deletion of submitted contact
  -- information" from the product spec: an admin (or, later, a
  -- self-service flow) marks this when a deletion request is honored.
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  constraint contact_handle_requires_consent check (
    contact_handle is null or contact_consent_given = true
  ),
  constraint contact_handle_requires_platform check (
    contact_handle is null or contact_platform <> 'none'
  )
);

comment on table public.community_interest_submissions is
  'Optional, separately-consented interest in the RootMap parent community. Never publicly readable. contact_handle may only be set when contact_consent_given = true (enforced by constraint, not just app logic).';

alter table public.community_interest_submissions enable row level security;

create policy "anon_insert_community_interest_submissions"
  on public.community_interest_submissions for insert
  to anon, authenticated
  with check (true);

create policy "admin_read_community_interest_submissions"
  on public.community_interest_submissions for select
  to authenticated
  using (public.is_admin());

create policy "admin_manage_community_interest_submissions"
  on public.community_interest_submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_delete_community_interest_submissions"
  on public.community_interest_submissions for delete
  to authenticated
  using (public.is_admin());
