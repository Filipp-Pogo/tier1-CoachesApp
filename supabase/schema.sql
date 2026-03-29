-- Tier 1 Coaches App - auth, personal state sync, and custom session plans
-- Run this in Supabase SQL editor.

create table if not exists public.coach_app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.coach_app_state enable row level security;

create policy "Users can read their own app state"
on public.coach_app_state
for select
using (auth.uid() = user_id);

create policy "Users can insert their own app state"
on public.coach_app_state
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own app state"
on public.coach_app_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own app state"
on public.coach_app_state
for delete
using (auth.uid() = user_id);

create table if not exists public.custom_session_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_plan_id text,
  source_type text not null default 'custom' check (source_type in ('stock', 'custom')),
  name text not null,
  level text not null,
  sub_band text,
  total_time integer not null check (total_time between 30 and 240),
  objective text not null default '',
  coaching_emphasis text not null default '',
  standards text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  match_play_transfer text not null default '',
  visibility text not null default 'private' check (visibility in ('private', 'shared')),
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_session_plans_user_id_idx
  on public.custom_session_plans (user_id, updated_at desc);

create index if not exists custom_session_plans_shared_idx
  on public.custom_session_plans (visibility, updated_at desc)
  where visibility = 'shared';

alter table public.custom_session_plans enable row level security;

create policy "Users can read their own custom plans"
on public.custom_session_plans
for select
using (auth.uid() = user_id);

create policy "Authenticated users can read shared custom plans"
on public.custom_session_plans
for select
using (auth.role() = 'authenticated' and visibility = 'shared');

create policy "Users can insert their own custom plans"
on public.custom_session_plans
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own custom plans"
on public.custom_session_plans
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own custom plans"
on public.custom_session_plans
for delete
using (auth.uid() = user_id);