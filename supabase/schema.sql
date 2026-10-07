-- Applied to Supabase project "thali-club" (hmsvahfsffrockcxzrqm)
create table public.members (name text primary key check (char_length(name) between 1 and 30), phone text, joined_at timestamptz not null default now());
create table public.date_votes (plan_id text not null check (plan_id ~ '^\d{4}-\d{2}$'), member text not null, day date not null, created_at timestamptz not null default now(), primary key (plan_id, member, day));
create table public.restaurant_votes (plan_id text not null check (plan_id ~ '^\d{4}-\d{2}$'), member text not null, restaurant_id text not null, created_at timestamptz not null default now(), primary key (plan_id, member, restaurant_id));
create table public.messages (id bigint generated always as identity primary key, plan_id text not null, member text not null, body text not null check (char_length(body) between 1 and 1000), kind text not null default 'chat' check (kind in ('chat','system')), created_at timestamptz not null default now());
create table public.plans (plan_id text primary key, day date, time text, restaurant_id text, note text, finalized_by text, finalized_at timestamptz);
-- RLS enabled on all tables with open anon policies (select/insert/update/delete as needed); all tables added to supabase_realtime.
