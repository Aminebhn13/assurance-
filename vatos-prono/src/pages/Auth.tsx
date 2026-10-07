import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHref, useLang, useT } from '../lib/i18n';
import { DEMO } from '../lib/supabase';

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { profile, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fr = lang === 'fr';
  const next = params.get('next') === 'vip' ? href('/vip') : href('/compte');

  if (profile) return <Navigate to={next} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      if (mode === 'login') { await signIn(email, password); nav(next); }
      else {
        await signUp(email, password, username);
        if (DEMO) nav(next);
        else setMsg({ ok: true, text: fr ? 'Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse.' : 'Account created! Check your inbox to confirm.' });
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : t('error') });
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="h-display text-5xl">{mode === 'login' ? t('login') : t('register')}</h1>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {mode === 'register' && (
          <label className="block text-sm font-medium">{fr ? 'Pseudo' : 'Username'}
            <input className="input mt-1.5" required minLength={3} maxLength={24} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        )}
        <label className="block text-sm font-medium">Email
          <input className="input mt-1.5" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">{fr ? 'Mot de passe' : 'Password'}
          <input className="input mt-1.5" type="password" required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {mode === 'register' && (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-1 accent-brand-500" />
            {fr ? 'Je certifie avoir 18 ans ou plus.' : 'I confirm I am 18 or older.'}
          </label>
        )}
        {msg && <p className={`text-sm ${msg.ok ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? '…' : mode === 'login' ? t('login') : t('register')}</button>
        {DEMO && <p className="text-xs text-stone-500">{fr ? 'Mode démo : n’importe quel email et mot de passe fonctionnent.' : 'Demo mode: any email and password work.'}</p>}
      </form>
      <p className="mt-4 text-center text-sm">
        {mode === 'login'
          ? <>{fr ? 'Pas de compte ?' : 'No account?'} <Link to={href('/inscription')} className="font-semibold text-brand-600 dark:text-brand-400">{t('register')}</Link></>
          : <>{fr ? 'Déjà inscrit ?' : 'Already registered?'} <Link to={href('/connexion')} className="font-semibold text-brand-600 dark:text-brand-400">{t('login')}</Link></>}
      </p>
    </div>
  );
}
