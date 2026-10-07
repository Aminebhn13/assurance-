import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEMO, supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  isVip: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Mode démo uniquement : bascule le statut VIP pour tester le site. */
  demoToggleVip: () => void;
}

const Ctx = createContext<AuthState | null>(null);
const LS_DEMO = 'vp-demo-user';

function readDemo(): Profile | null {
  try { return JSON.parse(localStorage.getItem(LS_DEMO) || 'null'); } catch { return null; }
}
function writeDemo(p: Profile | null) {
  try { p ? localStorage.setItem(LS_DEMO, JSON.stringify(p)) : localStorage.removeItem(LS_DEMO); } catch { /* ignore */ }
}

function isActiveVip(p: Profile | null) {
  if (!p?.is_vip) return false;
  return !p.vip_until || new Date(p.vip_until).getTime() > Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (DEMO) { setProfile(readDemo()); setLoading(false); return; }
    const { data: { session } } = await supabase!.auth.getSession();
    if (!session) { setProfile(null); setLoading(false); return; }
    const { data } = await supabase!.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    if (DEMO) return;
    const { data } = supabase!.auth.onAuthStateChange(() => { load(); });
    return () => data.subscription.unsubscribe();
  }, [load]);

  const signIn = async (email: string, password: string) => {
    if (DEMO) {
      const p: Profile = readDemo() ?? { id: 'demo', email, username: email.split('@')[0], is_vip: false, vip_until: null, role: 'admin' };
      writeDemo(p); setProfile(p); return;
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (DEMO) {
      const p: Profile = { id: 'demo', email, username, is_vip: false, vip_until: null, role: 'admin' };
      writeDemo(p); setProfile(p); return;
    }
    const { error } = await supabase!.auth.signUp({ email, password, options: { data: { username } } });
    if (error) throw error;
  };

  const signOut = async () => {
    if (DEMO) { writeDemo(null); setProfile(null); return; }
    await supabase!.auth.signOut();
  };

  const demoToggleVip = () => {
    if (!DEMO || !profile) return;
    const p = { ...profile, is_vip: !profile.is_vip, vip_until: null };
    writeDemo(p); setProfile(p);
  };

  return (
    <Ctx.Provider value={{
      profile, loading, isVip: isActiveVip(profile), isAdmin: profile?.role === 'admin',
      signIn, signUp, signOut, refresh: load, demoToggleVip,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth hors AuthProvider');
  return c;
}
