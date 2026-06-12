import { supabaseReady } from './supabase.js';

let _supabase = null;

async function getAdmin() {
  if (!_supabase) {
    _supabase = await supabaseReady;
  }
  return _supabase;
}

export async function login(email, password) {
  const supabase = await getAdmin();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}


