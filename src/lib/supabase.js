import { createClient } from '@supabase/supabase-js';

// Public publishable configuration only — safe for the browser. RLS policies
// in Supabase control what this key can do (insert forms; read after login).
// The secret key is NEVER used in this project.
const url = import.meta.env.VITE_SUPABASE_URL || '';
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const SUPABASE_READY = url.startsWith('http') && anon.length > 20;

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anon || 'public-anon-key'
);