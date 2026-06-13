import { supabaseReady } from './supabase.js';

export async function login(email, password) {
  const supabase = await supabaseReady;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}


