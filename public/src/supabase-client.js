(function () {
  "use strict";

  const SUPABASE_URL = "https://ekvewbevtybvkcvvchaa.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdmV3YmV2dHlidmtjdnZjaGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzQ1NjMsImV4cCI6MjEwMzE1MDU2M30.Kc1aTcRjFt47Nhr2egU2kDQn7Yk3Xdl0kRKW7AispVI";
  const listeners = new Set();
  let client = null;
  let session = null;
  let profile = null;
  let error = null;
  let callbackFailure = null;
  let pendingPasswordRecovery = false;
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
    const message = String(value.message || value).replace(/\+/g, " ");
    if (/rate limit/i.test(message)) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    if (/invalid.*email/i.test(message)) return "Digite um endereço de e-mail válido.";
    if (/signups? not allowed|user not found/i.test(message)) return "Este e-mail ainda não foi convidado para o FitPlan.";
    if (/expired|invalid.*token|otp.*invalid/i.test(message)) return "Este link expirou ou já foi usado. Solicite um novo link de acesso.";
    if (/failed to fetch|network|offline/i.test(message)) return "Não foi possível conectar. Confira sua internet e tente novamente.";
    if (/invalid.*password|wrong.*password|invalid login/i.test(message)) return "E-mail ou senha incorretos.";
    if (/password.*short|password.*characters|should be at least/i.test(message)) return "A senha deve ter pelo menos 6 caracteres.";
    return message;
  }

  function callbackError() {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return search.get("error_description") || hash.get("error_description") || search.get("error") || hash.get("error");
  }

  function callbackType() {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return search.get("type") || hash.get("type");
  }

  function clearCallbackParams() {
    // Remove error/token params from URL without reloading so the user can
    // share or refresh without seeing the error or re-triggering auth.
    const clean = window.location.origin + window.location.pathname;
    if (window.history?.replaceState) window.history.replaceState({}, "", clean);
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
    if (!profile) error = "Conta autenticada, mas o perfil ainda não foi liberado pelo administrador.";
    else if (profile.active === false) error = "Este acesso está temporariamente desativado. Fale com o responsável pelo treino.";
    return profile;
  }

  async function refreshSession(preservedError = null) {
    if (!client) return snapshot();
    // Safety timeout — always emit ready after 10s even if Supabase is slow
    const safetyTimer = setTimeout(() => {
      if (!ready) { ready = true; emit(); }
    }, 10000);
    try {
      error = preservedError;
      const result = await client.auth.getSession();
      if (result.error) throw result.error;
      session = result.data.session;
      await loadProfile(session);
    } catch (nextError) {
      error = friendlyError(nextError);
    } finally {
      clearTimeout(safetyTimer);
      ready = true;
      emit();
    }
    return snapshot();
  }

  async function signInWithEmail({ email }) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Informe seu e-mail.");
    callbackFailure = null;
    error = null;
    const redirectUrl = new URL(window.location.pathname, window.location.origin);
    const currentQuery = new URLSearchParams(window.location.search);
    ["admin", "request"].forEach((key) => {
      const value = currentQuery.get(key);
      if (value) redirectUrl.searchParams.set(key, value);
    });
    const result = await client.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectUrl.toString(),
        shouldCreateUser: false
      }
    });
    if (result.error) throw new Error(friendlyError(result.error));
    return { email: normalizedEmail };
  }

  async function uploadProfileAvatar(userId, blob) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
    const path = `${userId}/avatar.${ext}`;
    // Remove any existing avatar first to avoid stale files
    await client.storage.from("avatars").remove([
      `${userId}/avatar.jpg`,
      `${userId}/avatar.png`,
      `${userId}/avatar.webp`
    ]);
    const { error: uploadError } = await client.storage.from("avatars").upload(path, blob, {
      upsert: true,
      contentType: blob.type || "image/jpeg"
    });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    // Bucket is private — use signed URL (1 year expiry)
    const { data: signedData, error: signedError } = await client.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signedError) throw new Error(signedError.message);
    const avatarUrl = signedData.signedUrl;
    // Persist the URL on the profiles row
    const { error: updateError } = await client
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId);
    if (updateError) throw new Error(updateError.message);
    // Update local snapshot so callers see the new URL immediately
    if (profile) profile = { ...profile, avatar_url: avatarUrl };
    emit();
    return avatarUrl;
  }

  async function deleteStorageAvatar(userId) {
    if (!client) return;
    await client.storage.from("avatars").remove([
      `${userId}/avatar.jpg`,
      `${userId}/avatar.png`,
      `${userId}/avatar.webp`
    ]);
    await client.from("profiles").update({ avatar_url: null }).eq("id", userId);
    if (profile) profile = { ...profile, avatar_url: null };
    emit();
  }

  async function signInWithPassword({ email, password }) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Informe seu e-mail.");
    if (!password) throw new Error("Informe sua senha.");
    callbackFailure = null;
    error = null;
    const result = await client.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });
    if (result.error) throw new Error(friendlyError(result.error));
    return { email: normalizedEmail };
  }

  async function updatePassword(newPassword) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    if (!newPassword || newPassword.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
    const result = await client.auth.updateUser({ password: newPassword });
    if (result.error) throw new Error(friendlyError(result.error));
    return true;
  }

  async function resetPassword(email) {
    if (!client) throw new Error("A conexão online está indisponível neste momento.");
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Informe seu e-mail.");
    const redirectUrl = new URL(window.location.pathname, window.location.origin);
    redirectUrl.searchParams.set("type", "recovery");
    const result = await client.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: redirectUrl.toString()
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
    signInWithPassword,
    updatePassword,
    resetPassword,
    uploadProfileAvatar,
    deleteStorageAvatar,
    signOut,
    subscribe
  };
  Object.defineProperty(api, "pendingPasswordRecovery", {
    get() { return pendingPasswordRecovery; }
  });
  api.consumePasswordRecovery = () => {
    const value = pendingPasswordRecovery;
    pendingPasswordRecovery = false;
    return value;
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
      // Signal the UI when the user arrives via a password-recovery link
      if (_event === "PASSWORD_RECOVERY") {
        pendingPasswordRecovery = true;
        window.dispatchEvent(new CustomEvent("fitplan:password-recovery"));
      }
      // Track whether the last sign-in was via magic link (OTP).
      // Only true when the session was created in THIS page load from a magic link
      // URL (access_token in hash). Never true for password logins or restored sessions.
      if (_event === "SIGNED_IN") {
        const hasTokenInUrl = window.location.hash.includes("access_token=");
        const amr = nextSession?.user?.amr;
        const amrUsedOtp = Array.isArray(amr) && amr.some((a) => a.method === "otp");
        // Only flag as OTP if token was in URL (first-time magic link open)
        // OR if amr explicitly confirms otp method (no URL fallback needed)
        api.lastSignInWasOtp = hasTokenInUrl || amrUsedOtp;
      }
      if (_event === "PASSWORD_RECOVERY") {
        // Clear any stale OTP flag so applyCloudAuthGate doesn't also try to open set-password
        api.lastSignInWasOtp = false;
      }
      window.setTimeout(async () => {
        try {
          error = callbackFailure;
          await loadProfile(nextSession);
        } catch (nextError) {
          error = friendlyError(nextError);
        } finally {
          ready = true;
          emit();
        }
      }, 0);
    });
    pendingPasswordRecovery = callbackType() === "recovery";
    callbackFailure = friendlyError(callbackError());
    error = callbackFailure;
    // Clean error/token params from URL so refreshing doesn't re-trigger auth
    if (callbackFailure || window.location.hash.includes("access_token")) {
      clearCallbackParams();
    }
    refreshSession(error);
  } catch (nextError) {
    error = friendlyError(nextError);
    ready = true;
    emit();
  }
})();
