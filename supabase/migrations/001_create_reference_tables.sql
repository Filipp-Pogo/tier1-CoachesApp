-- Tier 1 Academy — Reference Data Tables
-- These hold the drill library, session plans, pathway stages, and session blocks.
-- Public read access (anon + authenticated), admin-only writes via migrations.

-- ─── Pathway Stages ────────────────────────────────────────────────

create table if not exists public.pathway_stages (
  id text primary key,
  name text not null,
  short_name text not null,
  subtitle text not null,
  ball_color text,
  purpose text not null,
  priorities text[] not null default '{}',
  non_negotiables text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  competition_expectations text not null default '',
  advancement_expectations text not null default '',
  advancement_owner text not null default '',
  content_status text not null default 'partial' check (content_status in ('complete', 'partial', 'placeholder')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Session Blocks ────────────────────────────────────────────────

create table if not exists public.session_blocks (
  id text primary key,
  name text not null,
  short_name text not null,
  description text not null,
  typical_duration text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Skill Categories ──────────────────────────────────────────────

create table if not exists public.skill_categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0
);

-- ─── Drills ────────────────────────────────────────────────────────

create table if not exists public.drills (
  id text primary key,
  name text not null,
  level text[] not null,
  session_block text not null references public.session_blocks(id),
  skill_category text not null references public.skill_categories(id),
  feeding_style text not null check (feeding_style in ('feeding', 'live-ball', 'both')),
  type text not null check (type in ('technical', 'tactical', 'competitive', 'cooperative')),
  objective text not null,
  setup text not null,
  recommended_time text not null,
  coaching_cues text[] not null default '{}',
  standards text[] not null default '{}',
  common_breakdowns text[] not null default '{}',
  progression text not null default '',
  regression text not null default '',
  competitive_variation text not null default '',
  match_play_relevance text not null default '',
  video_url text,
  sub_band text[],
  format text check (format in ('group', 'private', 'group-or-private')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drills_level_idx on public.drills using gin (level);
create index if not exists drills_session_block_idx on public.drills (session_block);
create index if not exists drills_skill_category_idx on public.drills (skill_category);

-- ─── Session Plans (Stock/Reference) ──────────────────────────────

create table if not exists public.session_plans (
  id text primary key,
  plan_number integer not null,
  name text not null,
  level_tag text not null,
  level text not null,
  sub_band text,
  total_time integer not null,
  objective text not null,
  blocks jsonb not null default '[]',
  coaching_emphasis text not null default '',
  standards text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  match_play_transfer text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists session_plans_level_idx on public.session_plans (level);

-- ─── Assessments ───────────────────────────────────────────────────

create table if not exists public.assessments (
  id serial primary key,
  stage_id text not null,
  stage_name text not null,
  categories jsonb not null default '[]',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assessments_stage_idx on public.assessments (stage_id);

-- ─── Coach Standards ───────────────────────────────────────────────

create table if not exists public.coach_standards (
  id serial primary key,
  category text not null,
  items text[] not null default '{}',
  sort_order integer not null default 0
);

-- ─── Content Versions (for cache invalidation) ────────────────────

create table if not exists public.content_versions (
  table_name text primary key,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

insert into public.content_versions (table_name, version) values
  ('pathway_stages', 1),
  ('session_blocks', 1),
  ('skill_categories', 1),
  ('drills', 1),
  ('session_plans', 1),
  ('assessments', 1),
  ('coach_standards', 1)
on conflict (table_name) do nothing;

-- ─── RLS: Public read for all reference tables ─────────────────────

alter table public.pathway_stages enable row level security;
alter table public.session_blocks enable row level security;
alter table public.skill_categories enable row level security;
alter table public.drills enable row level security;
alter table public.session_plans enable row level security;
alter table public.assessments enable row level security;
alter table public.coach_standards enable row level security;
alter table public.content_versions enable row level security;

-- Allow anyone (anon + authenticated) to read reference data
create policy "Public read access" on public.pathway_stages for select using (true);
create policy "Public read access" on public.session_blocks for select using (true);
create policy "Public read access" on public.skill_categories for select using (true);
create policy "Public read access" on public.drills for select using (true);
create policy "Public read access" on public.session_plans for select using (true);
create policy "Public read access" on public.assessments for select using (true);
create policy "Public read access" on public.coach_standards for select using (true);
create policy "Public read access" on public.content_versions for select using (true);

-- ─── Push Notifications (for Phase 3) ─────────────────────────────

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Users manage their own push subscriptions"
on public.push_subscriptions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  upcoming_sessions boolean not null default true,
  assessment_reminders boolean not null default true,
  onboarding_nudges boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users manage their own notification preferences"
on public.notification_preferences for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
