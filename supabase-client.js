(function () {
  "use strict";

  const SUPABASE_URL = "https://ekvewbevtybvkcvvchaa.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdmV3YmV2dHlidmtjdnZjaGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzQ1NjMsImV4cCI6MjEwMzE1MDU2M30.Kc1aTcRjFt47Nhr2egU2kDQn7Yk3Xdl0kRKW7AispVI";
  const listeners = new Set();
  let client = null;
  let session = null;
  let profile = null;
  let error = null;
  let ready = false;

  const snapshot = () => ({
    configured: Boolean(client),
    ready,
    session,
    user: session?.user || null,
    profile,
    error
  });

  function emit() {
    const detail = snapshot();
    window.dispatchEvent(new CustomEvent("fitplan:cloud-auth", { detail }));
    listeners.forEach((listener) => listener(detail));
  }

  function friendlyError(value) {
    if (!value) return null;
    const message = String(value.message || value);
    if (/rate limit/i.test(message)) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    if (/invalid.*email/i.test(message)) return "Digite um endereço de e-mail válido.";
    return message;
  }

  async function loadProfile(nextSession = session) {
    if (!client || !nextSession?.user?.id) {
      profile = null;
      return null;
    }
    const result = await client
      .from("profiles")
      .select("id, display_name, avatar_url, role, active, legacy_profile_key")
      .eq("id", nextSession.user.id)
      .maybeSingle();
    if (result.error) throw result.error;
    profile = result.data || null;
    return profile;
  }

  async function refreshSession() {
    if (!client) return snapshot();
    try {
      error = null;
      const result = await client.auth.getSession();
      if (result.error) throw result.error;
      session = result.data.session;
      await loadProfile(session);
    } catch (nextError) {
      error = friendlyError(nextError);
    } finally {
      ready = true;
      emit();
    }
    return snapshot();
  }

  async function signInWithEmail({ email }) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Informe seu e-mail.");
    const redirectUrl = new URL(window.location.pathname, window.location.origin).toString();
    const result = await client.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: false
      }
    });
    if (result.error) throw new Error(friendlyError(result.error));
    return { email: normalizedEmail };
  }

  async function signOut() {
    if (!client) return;
    const result = await client.auth.signOut();
    if (result.error) throw new Error(friendlyError(result.error));
    session = null;
    profile = null;
    error = null;
    emit();
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  }

  const api = {
    get client() { return client; },
    snapshot,
    refresh: refreshSession,
    signInWithEmail,
    signOut,
    subscribe
  };
  window.fitplanCloud = api;

  try {
    if (!window.supabase?.createClient) throw new Error("SDK do Supabase não carregado.");
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    client.auth.onAuthStateChange((_event, nextSession) => {
      session = nextSession;
      window.setTimeout(async () => {
        try {
          error = null;
          await loadProfile(nextSession);
        } catch (nextError) {
          error = friendlyError(nextError);
        } finally {
          ready = true;
          emit();
        }
      }, 0);
    });
    refreshSession();
  } catch (nextError) {
    error = friendlyError(nextError);
    ready = true;
    emit();
  }
})();
