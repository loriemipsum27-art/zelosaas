import { sb } from './supabase.js';

export async function getSession() {
  const { data, error } = await sb.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function requireSession(redirectTo = 'login.html') {
  const session = await getSession();

  if (!session) {
    window.location.href = redirectTo;
    return null;
  }

  return session;
}

export async function redirectIfAuthenticated(redirectTo = 'dashboard.html') {
  const session = await getSession();

  if (session) {
    window.location.href = 'dashboard.html';
    return session;
  }

  return null;
}

export async function signInWithPassword(credentials) {
  return sb.auth.signInWithPassword(credentials);
}

export async function signUp({ email, password, nome }) {
  return sb.auth.signUp({
    email,
    password,
    options: { data: { nome },
  emailRedirectTo: `${window.location.origin}/login.html`

}
  });
}

export async function resetPasswordForEmail(email, redirectTo) {
  return sb.auth.resetPasswordForEmail(email, { redirectTo });
}

export async function signOut() {
  return sb.auth.signOut();
}
