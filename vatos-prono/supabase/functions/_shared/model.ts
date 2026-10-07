// Fichier généré par scripts/copy-model.mjs — modifier src/lib/ à la place.
// Modèle de Poisson bivarié indépendant : à partir des buts attendus (xG)
// de chaque équipe, on calcule la matrice des scores puis les marchés.
import type { Match, Prediction, TipCode } from './types.ts';

const MAX_GOALS = 8;

function poisson(k: number, lambda: number): number {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / f;
}

export function predict(xgHome: number, xgAway: number, homeName: string, awayName: string): Prediction {
  let pH = 0, pD = 0, pA = 0, btts = 0, over = 0;
  let best = { h: 0, a: 0, p: 0 };
  for (let h = 0; h <= MAX_GOALS; h++) {
    for (let a = 0; a <= MAX_GOALS; a++) {
      const p = poisson(h, xgHome) * poisson(a, xgAway);
      if (h > a) pH += p; else if (h === a) pD += p; else pA += p;
      if (h > 0 && a > 0) btts += p;
      if (h + a > 2) over += p;
      if (p > best.p) best = { h, a, p };
    }
  }
  const total = pH + pD + pA;
  pH /= total; pD /= total; pA /= total;

  const markets: { code: TipCode; tip: string; p: number }[] = [
    { code: 'H', tip: `Victoire ${homeName}`, p: pH },
    { code: 'A', tip: `Victoire ${awayName}`, p: pA },
    { code: 'BTTS', tip: 'Les deux équipes marquent', p: btts },
    { code: 'O25', tip: 'Plus de 2,5 buts', p: over },
    { code: 'U25', tip: 'Moins de 2,5 buts', p: 1 - over },
  ];
  const doubles: typeof markets = [
    { code: '1X', tip: `${homeName} ou nul`, p: pH + pD },
    { code: 'X2', tip: `${awayName} ou nul`, p: pA + pD },
  ];
  // Marché simple le plus probable s'il est assez solide, sinon double chance.
  const bestSingle = [...markets].sort((x, y) => y.p - x.p)[0];
  const pick = bestSingle.p >= 0.55 ? bestSingle : [...doubles].sort((x, y) => y.p - x.p)[0];

  return {
    prob_home: round(pH * 100),
    prob_draw: round(pD * 100),
    prob_away: round(pA * 100),
    xg_home: round(xgHome, 2),
    xg_away: round(xgAway, 2),
    score_home: best.h,
    score_away: best.a,
    btts: round(btts * 100),
    over25: round(over * 100),
    tip: pick.tip,
    tip_code: pick.code,
    tip_odds: round(1 / pick.p, 2),
    confidence: Math.min(5, Math.max(1, Math.round((pick.p - 0.5) * 14))),
    analysis: buildAnalysis(homeName, awayName, xgHome, xgAway, pH, pD, pA, btts, over),
  };
}

function buildAnalysis(home: string, away: string, xh: number, xa: number, pH: number, pD: number, pA: number, btts: number, over: number) {
  const fav = pH > pA ? home : away;
  const gap = Math.abs(pH - pA);
  const parts: string[] = [];
  if (gap > 0.3) parts.push(`${fav} part largement favori (${Math.round(Math.max(pH, pA) * 100)} %).`);
  else if (gap > 0.12) parts.push(`${fav} a un léger avantage sur le papier.`);
  else parts.push(`Match très équilibré : le nul reste une option sérieuse (${Math.round(pD * 100)} %).`);
  parts.push(`Le modèle attend ${xh.toFixed(2)} buts pour ${home} et ${xa.toFixed(2)} pour ${away}.`);
  if (over > 0.58) parts.push('Profil offensif : on s’attend à un match ouvert.');
  else if (over < 0.42) parts.push('Profil fermé : peu de buts attendus.');
  if (btts > 0.55) parts.push('Les deux attaques devraient trouver le chemin des filets.');
  return parts.join(' ');
}

function round(n: number, d = 0) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

/** Résultat d'un tip une fois le match terminé (null si pas encore joué). */
export function tipOutcome(m: Match): boolean | null {
  if (m.status !== 'finished' || !m.prediction || m.goals_home == null || m.goals_away == null) return null;
  const h = m.goals_home, a = m.goals_away;
  switch (m.prediction.tip_code) {
    case 'H': return h > a;
    case 'A': return a > h;
    case '1X': return h >= a;
    case 'X2': return a >= h;
    case 'BTTS': return h > 0 && a > 0;
    case 'O25': return h + a > 2;
    case 'U25': return h + a < 3;
  }
}
