// Fichier généré par scripts/copy-model.mjs — modifier src/lib/ à la place.
export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type TipCode = 'H' | 'A' | '1X' | 'X2' | 'BTTS' | 'O25' | 'U25';

export interface Prediction {
  prob_home: number;
  prob_draw: number;
  prob_away: number;
  xg_home: number;
  xg_away: number;
  score_home: number;
  score_away: number;
  btts: number;
  over25: number;
  tip: string;
  tip_code: TipCode;
  tip_odds: number;
  confidence: number;
  analysis: string;
}

export interface Match {
  id: number;
  league: string;
  country: string;
  league_logo: string | null;
  home: string;
  away: string;
  home_logo: string | null;
  away_logo: string | null;
  kickoff: string;
  status: MatchStatus;
  minute: number | null;
  goals_home: number | null;
  goals_away: number | null;
  is_vip: boolean;
  is_featured: boolean;
  prediction: Prediction | null;
}

export interface Profile {
  id: string;
  email: string;
  username: string;
  is_vip: boolean;
  vip_until: string | null;
  role: 'user' | 'admin';
}

export type BetResult = 'pending' | 'won' | 'lost' | 'void';

export interface Bet {
  id: string;
  label: string;
  stake: number;
  odds: number;
  result: BetResult;
  created_at: string;
}
