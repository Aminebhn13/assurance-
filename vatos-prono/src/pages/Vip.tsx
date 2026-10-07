import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { startCheckout } from '../lib/api';
import { DEMO } from '../lib/supabase';
import { useHref, useLang } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

export const PLANS = [
  { id: 'monthly', name: { fr: 'Mensuel', en: 'Monthly' }, price: '12,99 €', per: { fr: '/ mois', en: '/ month' }, note: { fr: 'Sans engagement', en: 'Cancel anytime' } },
  { id: 'quarterly', name: { fr: 'Trimestriel', en: 'Quarterly' }, price: '29,99 €', per: { fr: '/ 3 mois', en: '/ 3 months' }, note: { fr: 'Soit 10 € / mois', en: '€10 / month' }, best: true },
  { id: 'yearly', name: { fr: 'Annuel', en: 'Yearly' }, price: '99 €', per: { fr: '/ an', en: '/ year' }, note: { fr: '2 mois offerts+', en: 'Best value' } },
] as const;

const FEATURES = {
  fr: ['Tous les pronostics VIP débloqués', 'Probabilités 1N2, BTTS, +2,5', 'Score exact le plus probable', 'Analyse détaillée de chaque match', 'Suivi de bankroll illimité', 'Accès prioritaire aux nouvelles ligues'],
  en: ['All VIP predictions unlocked', '1X2, BTTS, Over 2.5 probabilities', 'Most likely exact score', 'Detailed analysis for every match', 'Unlimited bankroll tracking', 'Priority access to new leagues'],
};
const FREE = {
  fr: ['Matchs du jour et scores en direct', 'Pronostics des matchs gratuits', 'Le choc du jour', 'Bilan public'],
  en: ['Daily fixtures and live scores', 'Predictions on free matches', 'Match of the day', 'Public track record'],
};

export default function Vip() {
  const lang = useLang();
  const href = useHref();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { profile, isVip, demoToggleVip, refresh } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const fr = lang === 'fr';

  const buy = async (plan: string) => {
    if (!profile) { nav(`${href('/inscription')}?next=vip`); return; }
    setErr('');
    if (DEMO) { if (!isVip) demoToggleVip(); return; }
    setBusy(plan);
    try { window.location.href = await startCheckout(plan); }
    catch { setErr(fr ? 'Paiement indisponible pour le moment.' : 'Payment unavailable right now.'); setBusy(null); }
  };

  return (
    <div className="space-y-10">
      {params.get('success') && (
        <div className="card border-green-600 p-4 text-green-700 dark:text-green-400">
          {fr ? 'Paiement reçu ! Ton accès VIP s’active dans quelques secondes.' : 'Payment received! VIP access activates in a few seconds.'}
          <button onClick={refresh} className="ml-3 underline">{fr ? 'Actualiser' : 'Refresh'}</button>
        </div>
      )}
      <header className="text-center">
        <p className="kicker">Vatos VIP</p>
        <h1 className="h-display mt-3 text-5xl sm:text-6xl">{fr ? 'Passe de l’autre côté du cadenas.' : 'Get past the padlock.'}</h1>
        <p className="mx-auto mt-4 max-w-xl text-stone-600 dark:text-stone-300">
          {fr ? 'Tous les pronostics, toutes les analyses, tous les jours. Résiliable en un clic.' : 'Every prediction, every analysis, every day. Cancel in one click.'}
        </p>
        {isVip && <p className="chip mx-auto mt-5 inline-block bg-brand-500 text-ink-950">{fr ? 'Tu es déjà VIP ✓' : 'You are VIP ✓'}</p>}
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="card flex flex-col p-6">
          <h2 className="text-lg font-semibold">{fr ? 'Gratuit' : 'Free'}</h2>
          <p className="h-display mt-3 text-4xl">0 €</p>
          <ul className="mt-5 flex-1 space-y-2 text-sm">{FREE[lang].map((f) => <li key={f}>✓ {f}</li>)}</ul>
          <Link to={href(profile ? '/' : '/inscription')} className="btn-ghost mt-6">{fr ? 'Commencer' : 'Start'}</Link>
        </div>
        {PLANS.map((p) => (
          <div key={p.id} className={`relative flex flex-col rounded-2xl p-6 ${'best' in p ? 'bg-ink-950 text-stone-100 ring-2 ring-brand-500' : 'card'}`}>
            {'best' in p && <span className="chip absolute -top-3 left-6 bg-brand-500 text-ink-950">{fr ? 'Le plus choisi' : 'Most popular'}</span>}
            <h2 className="text-lg font-semibold">{p.name[lang]}</h2>
            <p className="mt-3"><span className="h-display text-4xl">{p.price}</span> <span className="text-sm opacity-70">{p.per[lang]}</span></p>
            <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">{p.note[lang]}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">{FEATURES[lang].map((f) => <li key={f}>✓ {f}</li>)}</ul>
            <button onClick={() => buy(p.id)} disabled={busy !== null || isVip} className="btn-primary mt-6">
              {busy === p.id ? '…' : isVip ? 'VIP ✓' : fr ? 'Choisir' : 'Choose'}
            </button>
          </div>
        ))}
      </div>
      {err && <p className="text-center text-red-600">{err}</p>}
      <p className="text-center text-xs text-stone-500">
        {fr ? 'Paiement sécurisé par Stripe. Les pronostics sont des estimations statistiques, pas des certitudes. 18+.' : 'Secure payment by Stripe. Predictions are statistical estimates, not certainties. 18+.'}
      </p>
    </div>
  );
}
