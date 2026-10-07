// Données de démonstration générées localement quand Supabase n'est pas configuré.
import { predict } from './model';
import type { Match, MatchStatus } from './types';

const LEAGUES: { name: string; country: string; teams: [string, number][] }[] = [
  { name: 'Ligue 1', country: 'France', teams: [['Paris SG', 2.3], ['Marseille', 1.7], ['Monaco', 1.7], ['Lille', 1.5], ['Lyon', 1.5], ['Lens', 1.4], ['Nice', 1.3], ['Rennes', 1.3], ['Brest', 1.1], ['Strasbourg', 1.2], ['Nantes', 0.95], ['Toulouse', 1.05]] },
  { name: 'Premier League', country: 'Angleterre', teams: [['Liverpool', 2.2], ['Arsenal', 2.0], ['Man City', 2.1], ['Chelsea', 1.8], ['Newcastle', 1.6], ['Tottenham', 1.6], ['Aston Villa', 1.5], ['Brighton', 1.4], ['West Ham', 1.2], ['Everton', 1.0]] },
  { name: 'LaLiga', country: 'Espagne', teams: [['Real Madrid', 2.2], ['Barcelone', 2.3], ['Atlético', 1.7], ['Athletic', 1.4], ['Villarreal', 1.5], ['Betis', 1.3], ['Séville', 1.15], ['Valence', 1.1]] },
  { name: 'Serie A', country: 'Italie', teams: [['Inter', 2.0], ['Napoli', 1.7], ['Juventus', 1.6], ['Milan', 1.6], ['Atalanta', 1.8], ['Roma', 1.4], ['Lazio', 1.4], ['Bologne', 1.3]] },
  { name: 'Botola Pro', country: 'Maroc', teams: [['Raja', 1.5], ['Wydad', 1.5], ['AS FAR', 1.6], ['RS Berkane', 1.5], ['FUS Rabat', 1.2], ['MAS Fès', 1.1]] },
];

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function demoMatches(date: string): Match[] {
  const seed = Number(date.replace(/-/g, ''));
  const rnd = seeded(seed);
  const now = Date.now();
  const out: Match[] = [];
  let id = seed * 100;
  for (const lg of LEAGUES) {
    const teams = [...lg.teams].sort(() => rnd() - 0.5);
    const count = 2 + Math.floor(rnd() * 3);
    for (let i = 0; i < count && i * 2 + 1 < teams.length; i++) {
      const [home, ah] = teams[i * 2];
      const [away, aa] = teams[i * 2 + 1];
      const hour = 13 + Math.floor(rnd() * 9);
      const kickoff = new Date(`${date}T${String(hour).padStart(2, '0')}:${rnd() > 0.5 ? '00' : '45'}:00`);
      const xgH = Math.max(0.35, ah * 1.12 / Math.sqrt(aa) * (0.85 + rnd() * 0.3));
      const xgA = Math.max(0.3, aa * 0.9 / Math.sqrt(ah) * (0.85 + rnd() * 0.3));
      const pred = predict(xgH, xgA, home, away);
      const elapsed = (now - kickoff.getTime()) / 60000;
      let status: MatchStatus = 'scheduled';
      let gh: number | null = null, ga: number | null = null, minute: number | null = null;
      if (elapsed > 110) {
        status = 'finished';
        gh = sample(xgH, rnd); ga = sample(xgA, rnd);
      } else if (elapsed > 0) {
        status = 'live';
        minute = Math.min(90, Math.floor(elapsed > 60 ? elapsed - 15 : elapsed));
        gh = sample(xgH * minute / 90, rnd); ga = sample(xgA * minute / 90, rnd);
      }
      out.push({
        id: id++, league: lg.name, country: lg.country, league_logo: null,
        home, away, home_logo: null, away_logo: null,
        kickoff: kickoff.toISOString(), status, minute, goals_home: gh, goals_away: ga,
        is_vip: rnd() < 0.35, is_featured: false, prediction: pred,
      });
    }
  }
  // Le « choc du jour » : la rencontre la plus serrée entre deux grosses équipes.
  const top = [...out].sort((a, b) => (b.prediction!.xg_home + b.prediction!.xg_away) - (a.prediction!.xg_home + a.prediction!.xg_away))[0];
  if (top) { top.is_featured = true; top.is_vip = false; }
  return out.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

function sample(lambda: number, rnd: () => number) {
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= rnd(); } while (p > L);
  return k - 1;
}
