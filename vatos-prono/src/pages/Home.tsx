import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MatchCard, { StatusPill } from '../components/MatchCard';
import TeamBadge from '../components/TeamBadge';
import { tipOutcome } from '../lib/model';
import ProbBar from '../components/ProbBar';
import { getMatches } from '../lib/api';
import { dayKey } from '../lib/demo';
import { useHref, useLang, useT } from '../lib/i18n';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../context/AuthContext';
import type { Match } from '../lib/types';

type Filter = 'all' | 'live' | 'scheduled' | 'finished';

function offsetDay(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dayKey(new Date(d.getTime() - d.getTimezoneOffset() * 60000));
}

export default function Home() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const { isVip } = useAuth();
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const date = offsetDay(offset);
  const { data, loading, error, reload } = useAsync(() => getMatches(date, isVip), [date, isVip]);

  // Rafraîchissement auto toutes les 60 s pour les scores en direct.
  useEffect(() => {
    const id = setInterval(reload, 60000);
    return () => clearInterval(id);
  }, [reload]);

  const featured = data?.find((m) => m.is_featured);
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data ?? []).filter((m) =>
      (filter === 'all' || m.status === filter) &&
      (!needle || `${m.home} ${m.away} ${m.league} ${m.country}`.toLowerCase().includes(needle)));
  }, [data, filter, q]);

  const byLeague = useMemo(() => {
    const g = new Map<string, Match[]>();
    for (const m of visible) {
      const k = `${m.country} · ${m.league}`;
      g.set(k, [...(g.get(k) ?? []), m]);
    }
    return [...g.entries()];
  }, [visible]);

  const days = [-1, 0, 1, 2, 3].map((n) => {
    const d = new Date(); d.setDate(d.getDate() + n);
    const label = n === -1 ? t('yesterday') : n === 0 ? t('today') : n === 1 ? t('tomorrow')
      : d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'short', day: 'numeric' });
    return { n, label };
  });
  const filters: { k: Filter; l: string }[] = [
    { k: 'all', l: t('filter_all') }, { k: 'live', l: t('filter_live') },
    { k: 'scheduled', l: t('filter_scheduled') }, { k: 'finished', l: t('filter_finished') },
  ];

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="kicker">{t('hero_kicker')}</p>
          <h1 className="h-display mt-3 text-5xl sm:text-7xl">{t('hero_title')}</h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600 dark:text-stone-300">{t('hero_sub')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#matchs" className="btn-primary">{t('hero_cta')}</a>
            {!isVip && <Link to={href('/vip')} className="btn-ghost">{t('hero_cta2')}</Link>}
          </div>
        </div>
        {featured && <Featured m={featured} />}
      </section>

      <section id="matchs" className="scroll-mt-24 space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button key={d.n} onClick={() => setOffset(d.n)}
              className={`btn shrink-0 capitalize ${offset === d.n ? 'bg-ink-950 text-white dark:bg-stone-100 dark:text-ink-950' : 'btn-ghost'}`}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input className="input sm:max-w-sm" placeholder={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button key={f.k} onClick={() => setFilter(f.k)}
                className={`chip shrink-0 px-3.5 py-2 ${filter === f.k ? 'bg-brand-500 text-ink-950' : 'bg-stone-200 dark:bg-ink-800'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {loading && !data && <p className="text-stone-500">{t('loading')}</p>}
        {error != null && <p className="text-red-600">{t('error')}</p>}
        {data && byLeague.length === 0 && <p className="card p-6 text-center text-stone-500">{t('no_matches')}</p>}

        {byLeague.map(([league, ms]) => (
          <div key={league}>
            <h2 className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {league}<span className="h-px flex-1 bg-stone-200 dark:bg-ink-800" />
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ms.map((m) => <MatchCard key={m.id} m={m} />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Featured({ m }: { m: Match }) {
  const t = useT();
  const href = useHref();
  const p = m.prediction;
  return (
    <Link to={href(`/match/${m.id}`)} className="relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-stone-100 ring-1 ring-ink-700 transition hover:ring-brand-500">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <span className="kicker text-brand-400">★ {t('motd')}</span>
        <StatusPill m={m} />
      </div>
      <p className="relative mt-1 text-xs text-stone-400">{m.country} · {m.league}</p>
      <div className="relative mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <div className="flex flex-col items-center gap-2"><TeamBadge name={m.home} logo={m.home_logo} size={56} /><b>{m.home}</b></div>
        <span className="h-display text-5xl text-brand-400">
          {m.status === 'scheduled' ? (p ? `${p.score_home}-${p.score_away}` : 'VS') : `${m.goals_home}-${m.goals_away}`}
        </span>
        <div className="flex flex-col items-center gap-2"><TeamBadge name={m.away} logo={m.away_logo} size={56} /><b>{m.away}</b></div>
      </div>
      {p && (
        <div className="relative mt-6 space-y-3">
          <ProbBar h={p.prob_home} d={p.prob_draw} a={p.prob_away} />
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm">
            <span>{t('tip')} · <b>{p.tip}</b></span>
            {tipOutcome(m) === null
              ? <span className="num font-bold text-brand-400">@{p.tip_odds.toFixed(2)}</span>
              : <span className={`chip text-white ${tipOutcome(m) ? 'bg-green-600' : 'bg-red-600'}`}>{tipOutcome(m) ? t('won') : t('lost')}</span>}
          </div>
        </div>
      )}
    </Link>
  );
}
