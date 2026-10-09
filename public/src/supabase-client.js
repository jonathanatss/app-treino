(function () {
  "use strict";
  const SUPABASE_URL = "https://ekvewbevtybvkcvvchaa.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdmV3YmV2dHlidmtjdnZjaGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzQ1NjMsImV4cCI6MjEwMzE1MDU2M30.Kc1aTcRjFt47Nhr2egU2kDQn7Yk3Xdl0kRKW7AispVI";
  const AUTH_EVENT = "fitplan:cloud-auth";
  const RECOVERY_MARKER = "fitplan:recovery-callback-v2";
  const RECOVERY_CONSUMED = "fitplan:recovery-consumed-v2";
  const VALID_STATES = new Set(["booting", "signed_out", "signing_in", "authenticated", "recovering_password", "updating_password", "profile_pending", "profile_disabled", "offline", "error"]);
  const listeners = new Set();
  let client = null, session = null, profile = null, state = "booting", error = null, ready = false, operationId = 0;

  function safeGet(key) { try { return sessionStorage.getItem(key); } catch { return null; } }
  function safeSet(key, value) { try { value == null ? sessionStorage.removeItem(key) : sessionStorage.setItem(key, value); } catch {} }
  function callbackInfo() {
    const search = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const type = search.get("type") || hash.get("type"), code = search.get("code");
    const description = search.get("error_description") || hash.get("error_description");
    const callbackError = search.get("error") || hash.get("error");
    return {
      present: type === "recovery" || safeGet(RECOVERY_MARKER) === "1" || Boolean(code && safeGet(RECOVERY_CONSUMED) !== "1"),
      hasParams: Boolean(type || code || description || callbackError || hash.get("access_token")),
      invalid: Boolean(description || callbackError)
    };
  }
  let recoveryCallback = callbackInfo();
  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
  const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
  function friendlyError(value, context = "general") {
    const message = String(value?.message || value || "").replace(/\+/g, " ");
    if (context === "login" && /invalid login|invalid.*credential|email not confirmed/i.test(message)) return "E-mail ou senha incorretos.";
    if (/rate limit|too many requests/i.test(message)) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    if (/failed to fetch|network|load failed|offline|timeout/i.test(message)) return "Não foi possível conectar. Confira sua internet e tente novamente.";
    if (/expired|invalid.*token|otp.*invalid|flow state/i.test(message)) return "Este link expirou ou já foi usado. Solicite um novo e-mail.";
    if (/password.*short|password.*characters|should be at least/i.test(message)) return "A senha deve ter pelo menos 8 caracteres.";
    if (context === "recovery") return "Não foi possível concluir a solicitação agora. Tente novamente em alguns minutos.";
    return "Não foi possível concluir a operação. Tente novamente.";
  }
  const snapshot = () => Object.freeze({ configured: Boolean(client), ready, state, session, user: session?.user || null, profile, error, recovery: state === "recovering_password" || state === "updating_password" });
  function emit() { const detail = snapshot(); window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail })); listeners.forEach((fn) => fn(detail)); }
  function transition(next, nextError = null) { if (!VALID_STATES.has(next)) throw new Error(`Estado inválido: ${next}`); state = next; error = nextError; ready = next !== "booting"; emit(); }
  function clearAuthParams() {
    if (!recoveryCallback.hasParams || !history.replaceState) return;
    const url = new URL(location.href);
    ["code", "type", "error", "error_code", "error_description"].forEach((key) => url.searchParams.delete(key));
    url.hash = ""; history.replaceState({}, "", `${url.pathname}${url.search}` || "/"); recoveryCallback.hasParams = false;
  }
  async function fetchProfile(nextSession, requestId) {
    if (!nextSession?.user?.id) return null;
    const result = await client.from("profiles").select("id, display_name, avatar_url, role, active, legacy_profile_key").eq("id", nextSession.user.id).maybeSingle();
    if (requestId !== operationId) return profile;
    if (result.error) throw result.error;
    return result.data || null;
  }
  function profileState(value) { if (value?.active === false) return "profile_disabled"; if (!value || !value.legacy_profile_key) return "profile_pending"; return "authenticated"; }
  async function reconcile(nextSession, options = {}) {
    const requestId = ++operationId; session = nextSession || null;
    if (!session) { profile = null; transition("signed_out"); return snapshot(); }
    if (options.recovery) { safeSet(RECOVERY_MARKER, "1"); transition("recovering_password"); return snapshot(); }
    try {
      const nextProfile = await fetchProfile(session, requestId);
      if (requestId !== operationId) return snapshot();
      profile = nextProfile; transition(profileState(profile));
    } catch (nextError) {
      if (requestId === operationId) transition(navigator.onLine === false ? "offline" : "error", friendlyError(nextError));
    }
    return snapshot();
  }
  async function initialize() {
    try {
      const result = await client.auth.getSession(); if (result.error) throw result.error; session = result.data.session || null;
      if (recoveryCallback.invalid) { safeSet(RECOVERY_MARKER, null); safeSet(RECOVERY_CONSUMED, "1"); clearAuthParams(); transition("error", "Este link expirou ou já foi usado. Solicite um novo e-mail."); return; }
      const recoveryReady = recoveryCallback.present && Boolean(session); if (recoveryReady) clearAuthParams();
      await reconcile(session, { recovery: recoveryReady });
    } catch (nextError) { transition(navigator.onLine === false ? "offline" : "error", friendlyError(nextError)); }
  }
  async function signInWithPassword({ email, password }) {
    const normalized = normalizeEmail(email); if (!validEmail(normalized)) throw new Error("Digite um endereço de e-mail válido."); if (!password) throw new Error("Informe sua senha.");
    const requestId = ++operationId; transition("signing_in"); const result = await client.auth.signInWithPassword({ email: normalized, password });
    if (requestId !== operationId) return snapshot();
    if (result.error) { const message = friendlyError(result.error, "login"); transition("signed_out", message); throw new Error(message); }
    await reconcile(result.data.session); return snapshot();
  }
  async function requestPasswordRecovery(email) {
    const normalized = normalizeEmail(email); if (!validEmail(normalized)) throw new Error("Digite um endereço de e-mail válido.");
    const redirectTo = new URL("/", location.origin); redirectTo.searchParams.set("type", "recovery");
    const result = await client.auth.resetPasswordForEmail(normalized, { redirectTo: redirectTo.toString() });
    if (result.error) throw new Error(friendlyError(result.error, "recovery"));
    return { message: "Se existir uma conta para este e-mail, enviaremos as instruções de recuperação." };
  }
  async function updatePassword(newPassword) {
    if (!state.startsWith("recover") && state !== "updating_password") throw new Error("Este link de recuperação não é mais válido.");
    if (!newPassword || newPassword.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");
    transition("updating_password"); const result = await client.auth.updateUser({ password: newPassword });
    if (result.error) { const message = friendlyError(result.error); transition("recovering_password", message); throw new Error(message); }
    safeSet(RECOVERY_MARKER, null); safeSet(RECOVERY_CONSUMED, "1"); recoveryCallback.present = false;
    const current = session || (await client.auth.getSession()).data.session; await reconcile(current); return snapshot();
  }
  async function signOut() { const result = await client.auth.signOut({ scope: "local" }); if (result.error) throw new Error(friendlyError(result.error)); session = null; profile = null; transition("signed_out"); }
  async function uploadProfileAvatar(userId, blob) {
    const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg", path = `${userId}/avatar.${ext}`;
    await client.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);
    const upload = await client.storage.from("avatars").upload(path, blob, { upsert: true, contentType: blob.type || "image/jpeg" }); if (upload.error) throw new Error(friendlyError(upload.error));
    const signed = await client.storage.from("avatars").createSignedUrl(path, 31536000); if (signed.error) throw new Error(friendlyError(signed.error));
    const updated = await client.from("profiles").update({ avatar_url: signed.data.signedUrl }).eq("id", userId); if (updated.error) throw new Error(friendlyError(updated.error));
    if (profile) profile = { ...profile, avatar_url: signed.data.signedUrl }; emit(); return signed.data.signedUrl;
  }
  async function deleteStorageAvatar(userId) { await client.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]); await client.from("profiles").update({ avatar_url: null }).eq("id", userId); if (profile) profile = { ...profile, avatar_url: null }; emit(); }
  function subscribe(listener) { if (typeof listener !== "function") return () => {}; listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); }
  window.fitplanCloud = { get client() { return client; }, snapshot, subscribe, refresh: initialize, signInWithPassword, requestPasswordRecovery, resetPassword: requestPasswordRecovery, updatePassword, signOut, uploadProfileAvatar, deleteStorageAvatar };
  try {
    if (!window.supabase?.createClient) throw new Error("SDK do Supabase não carregado.");
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    client.auth.onAuthStateChange((event, nextSession) => {
      session = nextSession || null;
      // signInWithPassword owns reconciliation while its request is active.
      // Safari/iOS may emit SIGNED_IN before that promise resolves; running a
      // second reconciliation here would supersede it and leave the UI busy.
      if (event === "SIGNED_IN" && state === "signing_in") return;
      const recoveryEvent = event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && recoveryCallback.present && Boolean(session));
      window.setTimeout(() => reconcile(session, { recovery: recoveryEvent }), 0);
    });
    initialize();
  } catch (nextError) { transition("error", friendlyError(nextError)); }
})();
