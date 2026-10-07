import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Sans configuration Supabase, le site tourne en mode démo. */
export const DEMO = !url || !key;

export const supabase = DEMO ? null : createClient(url!, key!);
