// Synchronise les matchs d'une journée depuis API-Football (api-sports.io),
// calcule les pronostics avec le modèle de Poisson et met à jour les scores.
// Appelé par le cron (service role) ou par un admin depuis /admin.
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { predict } from '../_shared/model.ts';
import { cors, json } from '../_shared/cors.ts';

const API = 'https://v3.football.api-sports.io';
const KEY = Deno.env.get('API_FOOTBALL_KEY')!;
// Ligue 1, Premier League, LaLiga, Serie A, Bundesliga, Ligue des champions,
// Ligue Europa, Botola Pro, Liga Portugal, Eredivisie (modifiable via LEAGUES).
const LEAGUES = (Deno.env.get('LEAGUES') ?? '61,39,140,135,78,2,3,200,94,88').split(',').map(Number);

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

async function api<T>(path: string): Promise<T[]> {
  const r = await fetch(`${API}${path}`, { headers: { 'x-apisports-key': KEY } });
  if (!r.ok) throw new Error(`API-Football ${r.status}`);
  const body = await r.json();
  return body.response as T[];
}

const LIVE = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE', 'INT', 'SUSP'];
const DONE = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO'];

interface Fixture {
  fixture: { id: number; date: string; status: { short: string; elapsed: number | null } };
  league: { id: number; name: string; country: string; logo: string; season: number };
  teams: { home: { id: number; name: string; logo: string }; away: { id: number; name: string; logo: string } };
  goals: { home: number | null; away: number | null };
}
interface Side { played: number; goals: { for: number; against: number } }
interface Standing { team: { id: number }; home: Side; away: Side }

/** Forces offensives/défensives domicile/extérieur à partir du classement. */
async function leagueStrength(league: number, season: number) {
  const res = await api<{ league: { standings: Standing[][] } }>(`/standings?league=${league}&season=${season}`);
  const rows = (res[0]?.league.standings ?? []).flat();
  const sum = (f: (s: Standing) => number) => rows.reduce((a, s) => a + f(s), 0);
  const hp = sum((s) => s.home.played) || 1;
  const ap = sum((s) => s.away.played) || 1;
  const avgHome = sum((s) => s.home.goals.for) / hp || 1.45;
  const avgAway = sum((s) => s.away.goals.for) / ap || 1.15;
  const teams = new Map<number, { attH: number; defH: number; attA: number; defA: number }>();
  for (const s of rows) {
    // Lissage : avec peu de matchs, on reste proche de la moyenne (1).
    const shrink = (rate: number, n: number) => (rate * n + 1 * 4) / (n + 4);
    teams.set(s.team.id, {
      attH: shrink(s.home.played ? s.home.goals.for / s.home.played / avgHome : 1, s.home.played),
      defH: shrink(s.home.played ? s.home.goals.against / s.home.played / avgAway : 1, s.home.played),
      attA: shrink(s.away.played ? s.away.goals.for / s.away.played / avgAway : 1, s.away.played),
      defA: shrink(s.away.played ? s.away.goals.against / s.away.played / avgHome : 1, s.away.played),
    });
  }
  return { avgHome, avgAway, teams };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  // Autorisation : service role (cron) ou utilisateur admin.
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (token !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    const { data: { user } } = await db.auth.getUser(token);
    const { data: p } = user ? await db.from('profiles').select('role').eq('id', user.id).single() : { data: null };
    if (p?.role !== 'admin') return json({ error: 'forbidden' }, 403);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const date: string = body.date ?? new Date().toISOString().slice(0, 10);
    const fixtures = (await api<Fixture>(`/fixtures?date=${date}&timezone=Europe/Paris`))
      .filter((f) => LEAGUES.includes(f.league.id));
    if (!fixtures.length) return json({ synced: 0 });

    const strengths = new Map<string, Awaited<ReturnType<typeof leagueStrength>>>();
    for (const key of new Set(fixtures.map((f) => `${f.league.id}:${f.league.season}`))) {
      const [l, s] = key.split(':').map(Number);
      try { strengths.set(key, await leagueStrength(l, s)); } catch { /* coupe sans classement */ }
    }

    const ids = fixtures.map((f) => f.fixture.id);
    const { data: existing } = await db.from('matches').select('id').in('id', ids);
    const known = new Set((existing ?? []).map((r) => r.id));

    const matchRows = [];
    const predRows = [];
    for (const f of fixtures) {
      const st = f.fixture.status.short;
      const status = LIVE.includes(st) ? 'live' : DONE.includes(st) ? 'finished' : 'scheduled';
      const base = {
        id: f.fixture.id, league: f.league.name, country: f.league.country, league_logo: f.league.logo,
        home: f.teams.home.name, away: f.teams.away.name, home_logo: f.teams.home.logo, away_logo: f.teams.away.logo,
        kickoff: f.fixture.date, status, minute: status === 'live' ? f.fixture.status.elapsed : null,
        goals_home: f.goals.home, goals_away: f.goals.away, updated_at: new Date().toISOString(),
      };

      let pred = null;
      if (!known.has(f.fixture.id) && status === 'scheduled') {
        const lg = strengths.get(`${f.league.id}:${f.league.season}`);
        const h = lg?.teams.get(f.teams.home.id);
        const a = lg?.teams.get(f.teams.away.id);
        const xgH = (lg?.avgHome ?? 1.45) * (h?.attH ?? 1) * (a?.defA ?? 1);
        const xgA = (lg?.avgAway ?? 1.15) * (a?.attA ?? 1) * (h?.defH ?? 1);
        pred = predict(Math.max(0.2, xgH), Math.max(0.15, xgA), base.home, base.away);
        predRows.push({ match_id: f.fixture.id, ...pred });
      }
      // Nouveau match : les pronostics les plus sûrs passent en VIP. Sinon on ne touche pas aux réglages admin.
      matchRows.push(known.has(f.fixture.id) ? base : { ...base, is_vip: (pred?.confidence ?? 0) >= 3 });
    }

    const fresh = matchRows.filter((m) => 'is_vip' in m);
    const old = matchRows.filter((m) => !('is_vip' in m));
    if (fresh.length) { const { error } = await db.from('matches').insert(fresh); if (error) throw error; }
    if (old.length) { const { error } = await db.from('matches').upsert(old); if (error) throw error; }
    // Un pronostic n'est jamais modifié après publication (bilan honnête).
    if (predRows.length) {
      const { error } = await db.from('predictions').upsert(predRows, { onConflict: 'match_id', ignoreDuplicates: true });
      if (error) throw error;
    }

    // Choc du jour : si aucun n'est choisi, le match avec le plus de buts attendus.
    const dayStart = `${date}T00:00:00+02:00`;
    const dayEnd = new Date(new Date(dayStart).getTime() + 86400000).toISOString();
    const { data: feat } = await db.from('matches').select('id').eq('is_featured', true).gte('kickoff', dayStart).lt('kickoff', dayEnd).limit(1);
    if (!feat?.length && predRows.length) {
      const best = predRows.sort((x, y) => (y.xg_home + y.xg_away) - (x.xg_home + x.xg_away))[0];
      await db.from('matches').update({ is_featured: true, is_vip: false }).eq('id', best.match_id);
    }

    return json({ synced: fixtures.length, predictions: predRows.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
