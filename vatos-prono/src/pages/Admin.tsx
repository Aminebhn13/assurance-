import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMatches, listProfiles, runSync, setVip, updateAnalysis, updateMatch } from '../lib/api';
import { dayKey } from '../lib/demo';
import { DEMO } from '../lib/supabase';
import { useHref, useT } from '../lib/i18n';
import { useAsync } from '../lib/useAsync';
import type { Match } from '../lib/types';

export default function Admin() {
  const t = useT();
  const href = useHref();
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<'matches' | 'users'>('matches');

  if (loading) return <p>{t('loading')}</p>;
  if (!isAdmin) return <Navigate to={href('/')} replace />;

  return (
    <div className="space-y-6">
      <h1 className="h-display text-5xl">Admin</h1>
      {DEMO && <p className="card p-4 text-sm">Mode démo : les modifications ne sont pas enregistrées. Branche Supabase pour activer l’admin.</p>}
      <div className="flex gap-2">
        {(['matches', 'users'] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={tab === k ? 'btn-primary' : 'btn-ghost'}>
            {k === 'matches' ? 'Matchs' : 'Membres'}
          </button>
        ))}
      </div>
      {tab === 'matches' ? <Matches /> : <Users />}
    </div>
  );
}

function Matches() {
  const [date, setDate] = useState(dayKey(new Date()));
  const { data, reload } = useAsync(() => getMatches(date, true), [date]);
  const [msg, setMsg] = useState('');

  const sync = async () => {
    setMsg('Synchronisation…');
    try { const r = await runSync(date); setMsg(`${r.synced} matchs synchronisés.`); reload(); }
    catch (e) { setMsg(e instanceof Error ? e.message : 'Erreur'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input type="date" className="input w-auto" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={sync} className="btn-primary">Synchroniser l’API</button>
        {msg && <span className="text-sm text-stone-500">{msg}</span>}
      </div>
      <div className="card divide-y divide-stone-200 dark:divide-ink-700">
        {(data ?? []).map((m) => <MatchRow key={m.id} m={m} onChange={reload} />)}
      </div>
    </div>
  );
}

function MatchRow({ m, onChange }: { m: Match; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(m.prediction?.analysis ?? '');
  const toggle = async (k: 'is_vip' | 'is_featured') => { await updateMatch(m.id, { [k]: !m[k] }); onChange(); };
  return (
    <div className="px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="num w-12 text-xs text-stone-500">{new Date(m.kickoff).toTimeString().slice(0, 5)}</span>
        <span className="min-w-0 flex-1 truncate font-medium">{m.home} - {m.away} <span className="text-stone-500">· {m.league}</span></span>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={m.is_vip} onChange={() => toggle('is_vip')} className="accent-brand-500" />VIP</label>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={m.is_featured} onChange={() => toggle('is_featured')} className="accent-brand-500" />Une</label>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost py-1">Analyse</button>
      </div>
      {open && (
        <div className="mt-3 flex gap-2">
          <textarea className="input min-h-24" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn-primary self-start" onClick={async () => { await updateAnalysis(m.id, text); setOpen(false); onChange(); }}>OK</button>
        </div>
      )}
    </div>
  );
}

function Users() {
  const { data, reload } = useAsync(listProfiles, []);
  const [q, setQ] = useState('');
  const list = (data ?? []).filter((p) => `${p.username} ${p.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <input className="input max-w-xs" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="chip self-center bg-stone-200 dark:bg-ink-800">{data?.length ?? 0} membres · {data?.filter((p) => p.is_vip).length ?? 0} VIP</span>
      </div>
      <div className="card divide-y divide-stone-200 dark:divide-ink-700">
        {list.length === 0 && <p className="p-5 text-center text-sm text-stone-500">Aucun membre.</p>}
        {list.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <span className="min-w-0 flex-1 truncate"><b>{p.username}</b> <span className="text-stone-500">{p.email}</span></span>
            {p.role === 'admin' && <span className="chip bg-stone-200 dark:bg-ink-800">admin</span>}
            <button onClick={async () => { await setVip(p.id, !p.is_vip); reload(); }} className={p.is_vip ? 'btn-primary py-1' : 'btn-ghost py-1'}>
              {p.is_vip ? 'VIP ✓ (retirer)' : 'Donner VIP 30 j'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
