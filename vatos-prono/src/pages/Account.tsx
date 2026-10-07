import { useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addBet, deleteBet, listBets, setBetResult, startCheckout } from '../lib/api';
import { DEMO } from '../lib/supabase';
import { useHref, useLang, useT } from '../lib/i18n';
import { useAsync } from '../lib/useAsync';
import type { Bet } from '../lib/types';

function profitOf(b: Bet) {
  if (b.result === 'won') return b.stake * (b.odds - 1);
  if (b.result === 'lost') return -b.stake;
  return 0;
}

export default function Account() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const fr = lang === 'fr';
  const [params] = useSearchParams();
  const { profile, loading, isVip, signOut, demoToggleVip } = useAuth();
  const bets = useAsync(() => (profile ? listBets() : Promise.resolve([])), [profile?.id]);
  const [label, setLabel] = useState(params.get('bet') ?? '');
  const [odds, setOdds] = useState(params.get('odds') ?? '');
  const [stake, setStake] = useState('10');

  const stats = useMemo(() => {
    const list = bets.data ?? [];
    const settled = list.filter((b) => b.result === 'won' || b.result === 'lost');
    const staked = settled.reduce((s, b) => s + b.stake, 0);
    const profit = settled.reduce((s, b) => s + profitOf(b), 0);
    let acc = 0;
    const curve = [...settled].reverse().map((b) => (acc += profitOf(b)));
    return { n: settled.length, won: settled.filter((b) => b.result === 'won').length, staked, profit, roi: staked ? (profit / staked) * 100 : 0, curve };
  }, [bets.data]);

  if (loading) return <p className="text-stone-500">{t('loading')}</p>;
  if (!profile) return <Navigate to={href('/connexion')} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await addBet(profile.id, { label, stake: Number(stake), odds: Number(odds) });
    setLabel(''); setOdds('');
    bets.reload();
  };

  const manage = async () => {
    if (DEMO) return;
    window.location.href = await startCheckout('portal');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">{t('account')}</p>
          <h1 className="h-display mt-2 text-5xl">{profile.username}</h1>
          <p className="text-sm text-stone-500">{profile.email}</p>
        </div>
        <button onClick={signOut} className="btn-ghost">{t('logout')}</button>
      </header>

      <section className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 ${isVip ? 'bg-ink-950 text-stone-100 ring-2 ring-brand-500' : 'card'}`}>
        <div>
          <p className="text-sm opacity-70">{fr ? 'Statut' : 'Status'}</p>
          <p className="h-display text-3xl">{isVip ? 'VIP ★' : fr ? 'Gratuit' : 'Free'}</p>
          {isVip && profile.vip_until && (
            <p className="text-sm opacity-70">{fr ? 'Jusqu’au' : 'Until'} {new Date(profile.vip_until).toLocaleDateString(fr ? 'fr-FR' : 'en-GB')}</p>
          )}
        </div>
        <div className="flex gap-2">
          {DEMO && <button onClick={demoToggleVip} className="btn-ghost">{fr ? 'Simuler VIP on/off' : 'Toggle VIP (demo)'}</button>}
          {isVip
            ? !DEMO && <button onClick={manage} className="btn-primary">{fr ? 'Gérer mon abonnement' : 'Manage subscription'}</button>
            : <Link to={href('/vip')} className="btn-primary">{fr ? 'Passer VIP' : 'Go VIP'}</Link>}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h-display text-3xl">Bankroll</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label={fr ? 'Paris réglés' : 'Settled bets'} value={`${stats.won}/${stats.n}`} />
          <Kpi label={fr ? 'Misé' : 'Staked'} value={`${stats.staked.toFixed(2)} €`} />
          <Kpi label="Profit" value={`${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)} €`} tone={stats.profit} />
          <Kpi label="ROI" value={`${stats.roi.toFixed(1)} %`} tone={stats.roi} />
        </div>
        {stats.curve.length > 1 && <Curve points={stats.curve} />}

        <form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-[1fr_110px_110px_auto]">
          <input className="input" required placeholder={fr ? 'Pari (ex. PSG - OM · PSG gagne)' : 'Bet (e.g. Arsenal win)'} value={label} onChange={(e) => setLabel(e.target.value)} />
          <input className="input" required type="number" min="0.01" step="0.01" placeholder={fr ? 'Mise €' : 'Stake €'} value={stake} onChange={(e) => setStake(e.target.value)} />
          <input className="input" required type="number" min="1.01" step="0.01" placeholder={t('odds')} value={odds} onChange={(e) => setOdds(e.target.value)} />
          <button className="btn-primary">{fr ? 'Ajouter' : 'Add'}</button>
        </form>

        <div className="card divide-y divide-stone-200 dark:divide-ink-700">
          {(bets.data ?? []).length === 0 && <p className="p-5 text-center text-sm text-stone-500">{fr ? 'Aucun pari pour l’instant.' : 'No bets yet.'}</p>}
          {(bets.data ?? []).map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate font-medium">{b.label}</span>
              <span className="num">{b.stake.toFixed(2)} € @{b.odds.toFixed(2)}</span>
              <select className="input w-auto py-1.5" value={b.result}
                onChange={async (e) => { await setBetResult(b.id, e.target.value as Bet['result']); bets.reload(); }}>
                <option value="pending">{fr ? 'En cours' : 'Pending'}</option>
                <option value="won">{t('won')}</option>
                <option value="lost">{t('lost')}</option>
                <option value="void">{fr ? 'Remboursé' : 'Void'}</option>
              </select>
              <span className={`num w-20 text-right font-bold ${profitOf(b) > 0 ? 'text-green-600' : profitOf(b) < 0 ? 'text-red-600' : ''}`}>
                {profitOf(b) >= 0 ? '+' : ''}{profitOf(b).toFixed(2)}
              </span>
              <button onClick={async () => { await deleteBet(b.id); bets.reload(); }} className="text-stone-400 hover:text-red-600" aria-label="Supprimer">✕</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: number }) {
  const c = tone === undefined || tone === 0 ? '' : tone > 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="card p-4">
      <div className="text-xs text-stone-500 dark:text-stone-400">{label}</div>
      <div className={`num mt-1 text-2xl font-bold ${c}`}>{value}</div>
    </div>
  );
}

function Curve({ points }: { points: number[] }) {
  const all = [0, ...points];
  const min = Math.min(...all), max = Math.max(...all);
  const span = max - min || 1;
  const W = 600, H = 140;
  const xy = all.map((v, i) => [(i / (all.length - 1)) * W, H - ((v - min) / span) * (H - 10) - 5]);
  const zeroY = H - ((0 - min) / span) * (H - 10) - 5;
  const last = all[all.length - 1];
  return (
    <div className="card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" preserveAspectRatio="none">
        <line x1="0" x2={W} y1={zeroY} y2={zeroY} className="stroke-stone-300 dark:stroke-ink-700" strokeDasharray="4 4" />
        <polyline points={xy.map((p) => p.join(',')).join(' ')} fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke"
          className={last >= 0 ? 'stroke-green-600' : 'stroke-red-600'} />
      </svg>
    </div>
  );
}
