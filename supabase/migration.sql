-- Run this in the Supabase SQL Editor to set up the schema.

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  start_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create table completed_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_name text not null,
  workout_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, profile_name, workout_id)
);

create table swaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_name text not null,
  week_num int not null,
  id_a text not null,
  id_b text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table completed_workouts enable row level security;
alter table swaps enable row level security;

create policy "Users manage own profiles"
  on profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own completed workouts"
  on completed_workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own swaps"
  on swaps for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index idx_profiles_user on profiles(user_id);
create index idx_completed_user on completed_workouts(user_id, profile_name);
create index idx_swaps_user on swaps(user_id, profile_name, week_num);
