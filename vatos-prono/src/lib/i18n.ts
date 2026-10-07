import { useParams } from 'react-router-dom';

export type Lang = 'fr' | 'en';
export const LANGS: Lang[] = ['fr', 'en'];

const fr = {
  nav_home: 'Matchs', nav_vip: 'VIP', nav_concept: 'Comment ça marche', nav_analyses: 'Bilan', nav_faq: 'FAQ',
  login: 'Connexion', register: 'Créer un compte', logout: 'Déconnexion', account: 'Mon espace', admin: 'Admin',
  hero_kicker: 'Pronostics football · modèle statistique',
  hero_title: 'Lis le match avant le coup d’envoi.',
  hero_sub: 'Probabilités 1N2, score le plus probable, buts attendus et tip du jour pour chaque rencontre. Suis ta bankroll au même endroit.',
  hero_cta: 'Voir les matchs du jour', hero_cta2: 'Passer VIP',
  motd: 'Le choc du jour', today: 'Aujourd’hui', yesterday: 'Hier', tomorrow: 'Demain',
  filter_all: 'Tous', filter_live: 'En direct', filter_scheduled: 'À venir', filter_finished: 'Terminés',
  search: 'Rechercher une équipe ou un championnat…', no_matches: 'Aucun match pour ces critères.',
  predicted: 'Score prédit', tip: 'Tip', odds: 'Cote', confidence: 'Confiance', locked: 'Pronostic réservé aux VIP',
  unlock: 'Débloquer', see_analysis: 'Voir l’analyse', back: 'Retour',
  probs: 'Probabilités', xg: 'Buts attendus (xG)', btts: 'Les 2 marquent', over25: '+2,5 buts', analysis: 'Analyse',
  won: 'Gagné', lost: 'Perdu', live: 'Direct', ft: 'Terminé',
  loading: 'Chargement…', error: 'Une erreur est survenue.',
  demo_banner: 'Mode démo : données générées localement. Configure Supabase pour passer en production.',
  footer_resp: 'Les paris sportifs comportent des risques : endettement, dépendance… Appelez le 09 74 75 13 13 (appel non surtaxé). Interdit aux moins de 18 ans.',
};

const en: typeof fr = {
  nav_home: 'Matches', nav_vip: 'VIP', nav_concept: 'How it works', nav_analyses: 'Track record', nav_faq: 'FAQ',
  login: 'Log in', register: 'Sign up', logout: 'Log out', account: 'My space', admin: 'Admin',
  hero_kicker: 'Football predictions · statistical model',
  hero_title: 'Read the game before kick-off.',
  hero_sub: '1X2 probabilities, most likely score, expected goals and a tip of the day for every fixture. Track your bankroll in the same place.',
  hero_cta: 'See today’s matches', hero_cta2: 'Go VIP',
  motd: 'Match of the day', today: 'Today', yesterday: 'Yesterday', tomorrow: 'Tomorrow',
  filter_all: 'All', filter_live: 'Live', filter_scheduled: 'Upcoming', filter_finished: 'Finished',
  search: 'Search a team or league…', no_matches: 'No match for these filters.',
  predicted: 'Predicted score', tip: 'Tip', odds: 'Odds', confidence: 'Confidence', locked: 'VIP-only prediction',
  unlock: 'Unlock', see_analysis: 'See analysis', back: 'Back',
  probs: 'Probabilities', xg: 'Expected goals (xG)', btts: 'Both score', over25: 'Over 2.5', analysis: 'Analysis',
  won: 'Won', lost: 'Lost', live: 'Live', ft: 'FT',
  loading: 'Loading…', error: 'Something went wrong.',
  demo_banner: 'Demo mode: locally generated data. Configure Supabase to go live.',
  footer_resp: 'Sports betting involves risks: debt, addiction… Get help at a local gambling helpline. Forbidden to under-18s.',
};

const dicts = { fr, en };
export type Key = keyof typeof fr;

export function useLang(): Lang {
  const { lang } = useParams();
  return lang === 'en' ? 'en' : 'fr';
}

export function useT() {
  const lang = useLang();
  return (k: Key) => dicts[lang][k];
}

/** Lien préfixé par la langue courante. */
export function useHref() {
  const lang = useLang();
  return (path: string) => `/${lang}${path === '/' ? '' : path}`;
}
