// app/lib/authActions.ts

import { supabase } from "./supabaseClient";

export async function login(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
      shouldCreateUser: false,
    },
  });
}

export async function logout() {
  return supabase.auth.signOut();
}
