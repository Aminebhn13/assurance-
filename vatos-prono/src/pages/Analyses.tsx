import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../lib/api';
import { tipOutcome } from '../lib/model';
import { useHref, useLang, useT } from '../lib/i18n';
import { useAsync } from '../lib/useAsync';

export default function Analyses() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const fr = lang === 'fr';
  const { data, loading } = useAsync(() => getHistory(14), []);

  const stats = useMemo(() => {
    const rows = (data ?? []).map((m) => ({ m, o: tipOutcome(m) })).filter((r) => r.o !== null);
    const won = rows.filter((r) => r.o).length;
    // Profit à mise fixe de 1 unité sur chaque tip.
    const profit = rows.reduce((s, r) => s + (r.o ? r.m.prediction!.tip_odds - 1 : -1), 0);
    const exact = rows.filter((r) => r.m.prediction!.score_home === r.m.goals_home && r.m.prediction!.score_away === r.m.goals_away).length;
    const byDay = new Map<string, { w: number; n: number }>();
    for (const r of rows) {
      const k = r.m.kickoff.slice(0, 10);
      const v = byDay.get(k) ?? { w: 0, n: 0 };
      byDay.set(k, { w: v.w + (r.o ? 1 : 0), n: v.n + 1 });
    }
    return { rows, won, n: rows.length, profit, exact, days: [...byDay.entries()].sort() };
  }, [data]);

  return (
    <div className="space-y-8">
      <header>
        <p className="kicker">{fr ? '14 derniers jours' : 'Last 14 days'}</p>
        <h1 className="h-display mt-3 text-5xl">{fr ? 'Le bilan, sans filtre.' : 'The record, unfiltered.'}</h1>
        <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">
          {fr ? 'Chaque tip publié est comptabilisé automatiquement, gagné ou perdu. Mise fixe d’une unité par tip.' : 'Every published tip is counted automatically, won or lost. Flat stake of one unit per tip.'}
        </p>
      </header>

      {loading && !data ? <p className="text-stone-500">{t('loading')}</p> : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label={fr ? 'Tips joués' : 'Tips played'} value={String(stats.n)} />
            <Kpi label={fr ? 'Réussite' : 'Hit rate'} value={stats.n ? `${Math.round((stats.won / stats.n) * 100)}%` : '–'} />
            <Kpi label={fr ? 'Profit (unités)' : 'Profit (units)'} value={`${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(1)}`} accent={stats.profit >= 0} />
            <Kpi label={fr ? 'Scores exacts' : 'Exact scores'} value={String(stats.exact)} />
          </div>

          <section className="card p-5">
            <h2 className="kicker mb-4">{fr ? 'Réussite par jour' : 'Daily hit rate'}</h2>
            <div className="flex h-40 items-end gap-1.5">
              {stats.days.map(([d, v]) => (
                <div key={d} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div className="w-full min-h-[2px] rounded-t bg-brand-500" style={{ height: `${(v.w / v.n) * 100}%` }} title={`${d}: ${v.w}/${v.n}`} />
                  <span className="num mt-1 text-[10px] text-stone-500">{d.slice(8)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card divide-y divide-stone-200 dark:divide-ink-700">
            {stats.rows.slice().reverse().slice(0, 40).map(({ m, o }) => (
              <Link key={m.id} to={href(`/match/${m.id}`)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-stone-50 dark:hover:bg-ink-800">
                <span className="num w-12 shrink-0 text-xs text-stone-500">{m.kickoff.slice(5, 10).split('-').reverse().join('/')}</span>
                <span className="min-w-0 flex-1 truncate"><b>{m.home} {m.goals_home}-{m.goals_away} {m.away}</b> · {m.prediction!.tip}</span>
                <span className="num shrink-0">@{m.prediction!.tip_odds.toFixed(2)}</span>
                <span className={`chip shrink-0 text-white ${o ? 'bg-green-600' : 'bg-red-600'}`}>{o ? t('won') : t('lost')}</span>
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-stone-500 dark:text-stone-400">{label}</div>
      <div className={`h-display mt-2 text-4xl ${accent === undefined ? '' : accent ? 'text-green-600' : 'text-red-600'}`}>{value}</div>
    </div>
  );
}
