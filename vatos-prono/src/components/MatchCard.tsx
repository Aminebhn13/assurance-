import { Link } from 'react-router-dom';
import TeamBadge from './TeamBadge';
import ProbBar from './ProbBar';
import Confidence from './Confidence';
import { useHref, useLang, useT } from '../lib/i18n';
import { tipOutcome } from '../lib/model';
import type { Match } from '../lib/types';

export function kickoffTime(iso: string, lang: string) {
  return new Date(iso).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function StatusPill({ m }: { m: Match }) {
  const t = useT();
  const lang = useLang();
  if (m.status === 'live') return <span className="chip animate-pulse bg-red-600 text-white">{t('live')} {m.minute}'</span>;
  if (m.status === 'finished') return <span className="chip bg-stone-200 dark:bg-ink-700">{t('ft')}</span>;
  return <span className="num text-sm font-bold">{kickoffTime(m.kickoff, lang)}</span>;
}

export default function MatchCard({ m }: { m: Match }) {
  const t = useT();
  const href = useHref();
  const p = m.prediction;
  const outcome = tipOutcome(m);
  const showScore = m.status !== 'scheduled';

  return (
    <Link to={href(`/match/${m.id}`)} className="card group block p-4 transition hover:-translate-y-0.5 hover:border-brand-500/60">
      <div className="mb-3 flex items-center justify-between">
        <StatusPill m={m} />
        {m.is_vip && <span className="chip bg-ink-950 text-brand-400 dark:bg-brand-500 dark:text-ink-950">VIP</span>}
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-y-2">
        {[{ n: m.home, l: m.home_logo, g: m.goals_home }, { n: m.away, l: m.away_logo, g: m.goals_away }].map((x) => (
          <div key={x.n} className="contents">
            <div className="flex min-w-0 items-center gap-2.5">
              <TeamBadge name={x.n} logo={x.l} size={26} />
              <span className="truncate font-semibold">{x.n}</span>
            </div>
            <span className="num text-lg font-bold">{showScore ? x.g : ''}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-dashed border-stone-200 pt-3 dark:border-ink-700">
        {p ? (
          <>
            <ProbBar h={p.prob_home} d={p.prob_draw} a={p.prob_away} />
            <div className="mt-3 flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate">
                <span className="text-stone-500 dark:text-stone-400">{t('tip')} · </span>
                <span className="font-semibold">{p.tip}</span>
              </span>
              {outcome === null ? (
                <span className="num shrink-0 font-bold text-brand-600 dark:text-brand-400">@{p.tip_odds.toFixed(2)}</span>
              ) : (
                <span className={`chip shrink-0 ${outcome ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{outcome ? t('won') : t('lost')}</span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>{t('predicted')} <b className="num text-ink-950 dark:text-stone-100">{p.score_home}-{p.score_away}</b></span>
              <Confidence value={p.confidence} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-stone-100 px-3 py-3 text-sm dark:bg-ink-800">
            <span className="flex items-center gap-2"><span aria-hidden>🔒</span>{t('locked')}</span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">{t('unlock')} →</span>
          </div>
        )}
      </div>
    </Link>
  );
}
