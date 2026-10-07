-- Vatos Prono — schéma initial

-- ========== Profils ==========
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  username text not null,
  is_vip boolean not null default false,
  vip_until timestamptz,
  role text not null default 'user' check (role in ('user', 'admin')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_vip() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and (role = 'admin' or (is_vip and (vip_until is null or vip_until > now())))
  );
$$;

alter table public.profiles enable row level security;
create policy "profil lisible par soi ou admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
-- Seul l'admin modifie les profils (VIP, rôle). Le webhook Stripe passe par la service role.
create policy "admin modifie les profils" on public.profiles
  for update using (public.is_admin());

-- ========== Matchs ==========
create table public.matches (
  id bigint primary key,               -- id du match côté API-Football
  league text not null,
  country text not null,
  league_logo text,
  home text not null,
  away text not null,
  home_logo text,
  away_logo text,
  kickoff timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  minute int,
  goals_home int,
  goals_away int,
  is_vip boolean not null default false,
  is_featured boolean not null default false,
  updated_at timestamptz not null default now()
);
create index matches_kickoff_idx on public.matches (kickoff);

alter table public.matches enable row level security;
create policy "matchs publics" on public.matches for select using (true);
create policy "admin modifie les matchs" on public.matches for update using (public.is_admin());

-- ========== Pronostics ==========
create table public.predictions (
  match_id bigint primary key references public.matches on delete cascade,
  prob_home int not null,
  prob_draw int not null,
  prob_away int not null,
  xg_home numeric not null,
  xg_away numeric not null,
  score_home int not null,
  score_away int not null,
  btts int not null,
  over25 int not null,
  tip text not null,
  tip_code text not null,
  tip_odds numeric not null,
  confidence int not null,
  analysis text not null default '',
  created_at timestamptz not null default now()
);

alter table public.predictions enable row level security;
-- Un pronostic VIP n'est lisible que par un VIP (ou un admin) tant que le match n'est pas terminé.
create policy "pronostics selon statut" on public.predictions for select using (
  exists (
    select 1 from public.matches m
    where m.id = match_id and (not m.is_vip or m.status = 'finished' or public.is_vip())
  )
);
create policy "admin modifie les pronostics" on public.predictions for update using (public.is_admin());

-- Bilan public : tous les matchs terminés avec leur pronostic.
create or replace function public.history(since timestamptz) returns setof jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(m) || jsonb_build_object('prediction', to_jsonb(p))
  from matches m join predictions p on p.match_id = m.id
  where m.status = 'finished' and m.kickoff >= since and m.goals_home is not null
  order by m.kickoff;
$$;

-- ========== Bankroll ==========
create table public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  label text not null check (char_length(label) <= 200),
  stake numeric not null check (stake > 0),
  odds numeric not null check (odds > 1),
  result text not null default 'pending' check (result in ('pending', 'won', 'lost', 'void')),
  created_at timestamptz not null default now()
);
create index bets_user_idx on public.bets (user_id, created_at desc);

alter table public.bets enable row level security;
create policy "mes paris" on public.bets for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
