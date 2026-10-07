import { DEMO, supabase } from './supabase';
import { demoMatches } from './demo';
import type { Bet, Match, Prediction, Profile } from './types';

// ---------- Matchs ----------

type Row = Omit<Match, 'prediction'> & { prediction: Prediction | Prediction[] | null };

function normalize(r: Row): Match {
  const p = Array.isArray(r.prediction) ? r.prediction[0] ?? null : r.prediction;
  return { ...r, prediction: p };
}

/** En démo, on masque les pronostics VIP aux non-VIP comme le ferait la RLS. */
function gate(m: Match, vip: boolean): Match {
  return m.is_vip && !vip && m.status !== 'finished' ? { ...m, prediction: null } : m;
}

export async function getMatches(date: string, vip: boolean): Promise<Match[]> {
  if (DEMO) return demoMatches(date).map((m) => gate(m, vip));
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start.getTime() + 86400000);
  const { data, error } = await supabase!
    .from('matches')
    .select('*, prediction:predictions(*)')
    .gte('kickoff', start.toISOString())
    .lt('kickoff', end.toISOString())
    .order('kickoff');
  if (error) throw error;
  return (data as Row[]).map(normalize);
}

export async function getMatch(id: number, vip: boolean): Promise<Match | null> {
  if (DEMO) {
    const date = String(Math.floor(id / 100));
    const d = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    const m = demoMatches(d).find((x) => x.id === id);
    return m ? gate(m, vip) : null;
  }
  const { data, error } = await supabase!.from('matches').select('*, prediction:predictions(*)').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? normalize(data as Row) : null;
}

/** Historique des matchs terminés sur N jours (bilan public). */
export async function getHistory(days: number): Promise<Match[]> {
  if (DEMO) {
    const out: Match[] = [];
    for (let i = 1; i <= days; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      out.push(...demoMatches(d));
    }
    return out;
  }
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase!.rpc('history', { since });
  if (error) throw error;
  return (data as Row[]).map(normalize);
}

export async function updateMatch(id: number, patch: Partial<Pick<Match, 'is_vip' | 'is_featured'>>) {
  if (DEMO) return;
  const { error } = await supabase!.from('matches').update(patch).eq('id', id);
  if (error) throw error;
}

export async function updateAnalysis(id: number, analysis: string) {
  if (DEMO) return;
  const { error } = await supabase!.from('predictions').update({ analysis }).eq('match_id', id);
  if (error) throw error;
}

export async function runSync(date: string) {
  if (DEMO) return { synced: 0 };
  const { data, error } = await supabase!.functions.invoke('sync-matches', { body: { date } });
  if (error) throw error;
  return data as { synced: number };
}

// ---------- Paiement ----------

export async function startCheckout(plan: string): Promise<string> {
  const { data, error } = await supabase!.functions.invoke('create-checkout', {
    body: { plan, origin: window.location.origin },
  });
  if (error) throw error;
  return (data as { url: string }).url;
}

// ---------- Admin ----------

export async function listProfiles(): Promise<Profile[]> {
  if (DEMO) return [];
  const { data, error } = await supabase!.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Profile[];
}

export async function setVip(userId: string, vip: boolean) {
  const vip_until = vip ? new Date(Date.now() + 30 * 86400000).toISOString() : null;
  const { error } = await supabase!.from('profiles').update({ is_vip: vip, vip_until }).eq('id', userId);
  if (error) throw error;
}

// ---------- Bankroll ----------

const LS_BETS = 'vp-bets';

function lsBets(): Bet[] {
  try { return JSON.parse(localStorage.getItem(LS_BETS) || '[]'); } catch { return []; }
}
function lsSave(b: Bet[]) {
  try { localStorage.setItem(LS_BETS, JSON.stringify(b)); } catch { /* stockage indisponible */ }
}

export async function listBets(): Promise<Bet[]> {
  if (DEMO) return lsBets();
  const { data, error } = await supabase!.from('bets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Bet[];
}

export async function addBet(userId: string, b: Pick<Bet, 'label' | 'stake' | 'odds'>) {
  if (DEMO) {
    lsSave([{ ...b, id: crypto.randomUUID(), result: 'pending', created_at: new Date().toISOString() }, ...lsBets()]);
    return;
  }
  const { error } = await supabase!.from('bets').insert({ ...b, user_id: userId });
  if (error) throw error;
}

export async function setBetResult(id: string, result: Bet['result']) {
  if (DEMO) { lsSave(lsBets().map((b) => (b.id === id ? { ...b, result } : b))); return; }
  const { error } = await supabase!.from('bets').update({ result }).eq('id', id);
  if (error) throw error;
}

export async function deleteBet(id: string) {
  if (DEMO) { lsSave(lsBets().filter((b) => b.id !== id)); return; }
  const { error } = await supabase!.from('bets').delete().eq('id', id);
  if (error) throw error;
}
