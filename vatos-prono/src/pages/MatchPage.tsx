import { Link, useParams } from 'react-router-dom';
import TeamBadge from '../components/TeamBadge';
import ProbBar from '../components/ProbBar';
import Confidence from '../components/Confidence';
import { StatusPill } from '../components/MatchCard';
import { getMatch } from '../lib/api';
import { tipOutcome } from '../lib/model';
import { useHref, useLang, useT } from '../lib/i18n';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../context/AuthContext';

export default function MatchPage() {
  const { id } = useParams();
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const { isVip, profile } = useAuth();
  const { data: m, loading } = useAsync(() => getMatch(Number(id), isVip), [id, isVip]);

  if (loading && !m) return <p className="text-stone-500">{t('loading')}</p>;
  if (!m) return <p className="card p-6">{t('no_matches')}</p>;

  const p = m.prediction;
  const outcome = tipOutcome(m);
  const date = new Date(m.kickoff).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={href('/')} className="text-sm text-stone-500 hover:text-brand-500">← {t('back')}</Link>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3 text-sm dark:border-ink-700">
          <span className="text-stone-500 dark:text-stone-400">{m.country} · {m.league}</span>
          <StatusPill m={m} />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-8 text-center">
          <div className="flex flex-col items-center gap-3"><TeamBadge name={m.home} logo={m.home_logo} size={72} /><b className="text-lg">{m.home}</b></div>
          <div>
            <div className="h-display text-6xl">{m.status === 'scheduled' ? 'VS' : `${m.goals_home} - ${m.goals_away}`}</div>
            <p className="mt-2 text-xs capitalize text-stone-500">{date}</p>
          </div>
          <div className="flex flex-col items-center gap-3"><TeamBadge name={m.away} logo={m.away_logo} size={72} /><b className="text-lg">{m.away}</b></div>
        </div>
      </section>

      {p ? (
        <>
          <section className="card space-y-5 p-5">
            <h2 className="kicker">{t('probs')}</h2>
            <ProbBar h={p.prob_home} d={p.prob_draw} a={p.prob_away} labels={[m.home, 'Nul', m.away]} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label={t('predicted')} value={`${p.score_home}-${p.score_away}`} />
              <Stat label={t('xg')} value={`${p.xg_home.toFixed(2)} – ${p.xg_away.toFixed(2)}`} />
              <Stat label={t('btts')} value={`${p.btts}%`} />
              <Stat label={t('over25')} value={`${p.over25}%`} />
            </div>
          </section>

          <section className="rounded-2xl bg-ink-950 p-5 text-stone-100 ring-1 ring-brand-500/40">
            <div className="flex items-center justify-between">
              <h2 className="kicker text-brand-400">{t('tip')}</h2>
              <Confidence value={p.confidence} />
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <p className="h-display text-3xl">{p.tip}</p>
              <div className="flex items-center gap-3">
                {outcome !== null && (
                  <span className={`chip ${outcome ? 'bg-green-600' : 'bg-red-600'} text-white`}>{outcome ? t('won') : t('lost')}</span>
                )}
                <span className="num text-2xl font-bold text-brand-400">@{p.tip_odds.toFixed(2)}</span>
              </div>
            </div>
            {profile && (
              <Link to={`${href('/compte')}?bet=${encodeURIComponent(`${m.home} - ${m.away} · ${p.tip}`)}&odds=${p.tip_odds}`}
                className="btn-primary mt-4">+ Bankroll</Link>
            )}
          </section>

          <section className="card p-5">
            <h2 className="kicker">{t('analysis')}</h2>
            <p className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">{p.analysis}</p>
          </section>
        </>
      ) : (
        <section className="card p-8 text-center">
          <div className="text-4xl" aria-hidden>🔒</div>
          <h2 className="h-display mt-3 text-3xl">{t('locked')}</h2>
          <p className="mx-auto mt-2 max-w-md text-stone-500">
            {lang === 'fr' ? 'Probabilités, score prédit, tip et analyse complète sont disponibles pour les membres VIP.' : 'Probabilities, predicted score, tip and full analysis are available to VIP members.'}
          </p>
          <Link to={href('/vip')} className="btn-primary mt-5">{t('unlock')}</Link>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-100 p-3 dark:bg-ink-800">
      <div className="text-xs text-stone-500 dark:text-stone-400">{label}</div>
      <div className="num mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
