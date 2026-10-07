import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import Logo from './Logo';
import { LANGS, useHref, useT } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { DEMO } from '../lib/supabase';

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('vp-theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);
  return [dark, () => setDark((d) => !d)] as const;
}

export default function Layout() {
  const { lang } = useParams();
  const t = useT();
  const href = useHref();
  const { pathname } = useLocation();
  const { profile, isVip, isAdmin, signOut } = useAuth();
  const [dark, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  if (!LANGS.includes(lang as never)) return <Navigate to={`/fr${pathname}`} replace />;

  const other = lang === 'fr' ? 'en' : 'fr';
  const switchLang = pathname.replace(/^\/(fr|en)/, `/${other}`);

  const links = [
    { to: href('/'), label: t('nav_home'), end: true },
    { to: href('/vip'), label: t('nav_vip') },
    { to: href('/bilan'), label: t('nav_analyses') },
    { to: href('/concept'), label: t('nav_concept') },
    { to: href('/faq'), label: t('nav_faq') },
  ];
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'hover:bg-stone-200 dark:hover:bg-ink-800'}`;

  return (
    <div className="flex min-h-screen flex-col">
      {DEMO && (
        <div className="bg-brand-500 px-4 py-1.5 text-center text-xs font-semibold text-ink-950">{t('demo_banner')}</div>
      )}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-100/85 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link to={href('/')} aria-label="Vatos Prono"><Logo /></Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to={switchLang} className="btn-ghost px-2.5 py-1.5 font-mono text-xs uppercase">{other}</Link>
            <button onClick={toggleTheme} className="btn-ghost px-2.5 py-1.5" aria-label="Thème">{dark ? '☀' : '☾'}</button>
            {profile ? (
              <div className="hidden items-center gap-2 sm:flex">
                {isAdmin && <Link to={href('/admin')} className="btn-ghost py-1.5">{t('admin')}</Link>}
                <Link to={href('/compte')} className="btn-ghost py-1.5">
                  {isVip && <span className="chip bg-brand-500 px-2 py-0.5 text-ink-950">VIP</span>}
                  {profile.username}
                </Link>
              </div>
            ) : (
              <Link to={href('/connexion')} className="btn-primary hidden py-1.5 sm:inline-flex">{t('login')}</Link>
            )}
            <button className="btn-ghost px-2.5 py-1.5 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-stone-200 px-4 py-3 md:hidden dark:border-ink-800">
            {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
            {profile ? (
              <>
                <NavLink to={href('/compte')} className={linkCls}>{t('account')}</NavLink>
                {isAdmin && <NavLink to={href('/admin')} className={linkCls}>{t('admin')}</NavLink>}
                <button onClick={signOut} className="rounded-lg px-3 py-2 text-left text-sm font-medium">{t('logout')}</button>
              </>
            ) : (
              <NavLink to={href('/connexion')} className={linkCls}>{t('login')}</NavLink>
            )}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 dark:border-ink-800">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-stone-500 dark:text-stone-400">{t('footer_resp')}</p>
          </div>
          <div className="flex flex-col gap-2">
            {links.map((l) => <Link key={l.to} to={l.to} className="hover:text-brand-500">{l.label}</Link>)}
          </div>
          <div className="flex flex-col gap-2 text-stone-500 dark:text-stone-400">
            <span className="chip w-fit border border-current">18+</span>
            <span>© {new Date().getFullYear()} Vatos Prono</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
