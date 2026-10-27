-- Foundational helpers and the admin authorization model.
--
-- RootMap Play's admin authorization is server-enforced, never a frontend
-- route guard or an email-address check in client code:
--
--   1. Administrators authenticate with Supabase Auth (email/password or
--      magic link) like any other Supabase user.
--   2. Being "an admin" is defined ONLY by having a row in `admin_users`
--      keyed by that person's `auth.users.id`. There is no email allow-list
--      anywhere in application code.
--   3. `public.is_admin()` is a SECURITY DEFINER function that checks
--      `admin_users` for the current `auth.uid()`. Every privileged RLS
--      policy in later migrations calls this function. SECURITY DEFINER is
--      required here because `admin_users` itself has no public SELECT
--      policy (see below) — without it, policies on OTHER tables could not
--      consult `admin_users` for non-admins without recursion/denial.
--   4. There is no self-service "become an admin" endpoint. The first (and
--      every subsequent) admin row is inserted by the project owner via the
--      Supabase SQL editor/CLI using the service-role connection, after the
--      person has signed up through Supabase Auth. See supabase/README.md.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Authorization allow-list: a row here is the ONLY thing that makes a Supabase Auth user an administrator. Populated manually by the project owner (service-role), never via a public API.';

alter table public.admin_users enable row level security;
-- Intentionally zero policies for anon/authenticated roles: nobody can
-- read, insert, update, or delete this table through the public API
-- (PostgREST) or the anon/authenticated Postgres roles. Only the
-- service-role key (never shipped to the frontend) or a direct database
-- connection can manage admin membership. `is_admin()` below bypasses this
-- via SECURITY DEFINER, which is the one sanctioned exception.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True when the currently authenticated Supabase user (auth.uid()) is listed in admin_users. The single source of truth used by every admin-only RLS policy in this project.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Shared updated_at trigger used by every mutable content table.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
