(function () {
  "use strict";
  const QUEUE_KEY = "fitplan-telemetry-queue-v1";
  const SESSION_KEY = "fitplan-telemetry-session-v1";
  const HEARTBEAT_MS = 90_000;
  const MAX_QUEUE = 500;
  const ALLOWED_PAYLOAD_KEYS = new Set([
    "profile_key", "workout_key", "workout_title", "exercise_key", "exercise_name",
    "variant_key", "previous_variant_key", "set_number", "load_kg", "reps",
    "total_sets", "exercise_count", "volume_kg", "duration_seconds", "fields"
  ]);
  let userId = null;
  let session = null;
  let timer = null;
  let lastTick = 0;
  let flushing = false;

  const now = () => new Date().toISOString();
  const uuid = () => crypto.randomUUID();
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  function safePayload(value) {
    const result = {};
    Object.entries(value || {}).forEach(([key, item]) => {
      if (!ALLOWED_PAYLOAD_KEYS.has(key)) return;
      if (["string", "number", "boolean"].includes(typeof item) || Array.isArray(item)) result[key] = item;
    });
    return result;
  }
  function persistSession() { if (session) write(SESSION_KEY, session); }
  function accountVisibleTime() {
    if (!session || !lastTick || document.visibilityState !== "visible") return;
    const timestamp = Date.now();
    session.active_seconds += Math.min(180, Math.max(0, Math.round((timestamp - lastTick) / 1000)));
    session.last_active_at = now();
    lastTick = timestamp;
    persistSession();
  }
  async function flushQueue(options = {}) {
    if (flushing || !userId || !navigator.onLine || !window.fitplanCloud?.client) return false;
    const queue = read(QUEUE_KEY, []);
    if (!queue.length && !session) return true;
    flushing = true;
    accountVisibleTime();
    const sentIds = queue.slice(0, 100).map((event) => event.id);
    try {
      const result = await window.fitplanCloud.client.rpc("ingest_telemetry", {
        batch: { session, events: queue.slice(0, 100) }
      });
      if (result.error) throw result.error;
      write(QUEUE_KEY, read(QUEUE_KEY, []).filter((event) => !sentIds.includes(event.id)));
      return true;
    } catch (error) {
      if (!options.quiet) console.warn("FitPlan telemetry pending", error.message);
      return false;
    } finally { flushing = false; }
  }
  function heartbeat(options = {}) {
    if (!session) return;
    accountVisibleTime();
    if (options.end) session.ended_at = now();
    persistSession();
    return flushQueue({ quiet: true });
  }
  function trackEvent(eventName, payload = {}) {
    if (!userId || !session) return;
    const queue = read(QUEUE_KEY, []);
    queue.push({ id: uuid(), app_session_id: session.id, event_name: eventName, occurred_at: now(), payload: safePayload(payload) });
    write(QUEUE_KEY, queue.slice(-MAX_QUEUE));
    if (navigator.onLine) flushQueue({ quiet: true });
  }
  function initSession(nextUserId) {
    if (!nextUserId || userId === nextUserId) return;
    userId = nextUserId;
    const stored = read(SESSION_KEY, null);
    const reusable = stored && stored.user_id === userId && !stored.ended_at && Date.now() - Date.parse(stored.last_active_at) < 30 * 60_000;
    session = reusable ? stored : { id: uuid(), user_id: userId, started_at: now(), last_active_at: now(), ended_at: null, active_seconds: 0, app_version: "66", platform: navigator.standalone ? "ios-pwa" : matchMedia("(display-mode: standalone)").matches ? "pwa" : "browser" };
    lastTick = Date.now();
    persistSession();
    if (!reusable) trackEvent("login");
    clearInterval(timer);
    timer = setInterval(heartbeat, HEARTBEAT_MS);
    flushQueue({ quiet: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") heartbeat();
    else { lastTick = Date.now(); heartbeat(); }
  });
  window.addEventListener("online", () => flushQueue());
  window.addEventListener("pagehide", () => heartbeat());
  window.addEventListener("beforeunload", () => heartbeat({ end: true }));
  window.addEventListener("fitplan:cloud-auth", (event) => {
    const nextUser = event.detail?.user;
    if (nextUser?.id) initSession(nextUser.id);
    else { clearInterval(timer); timer = null; userId = null; session = null; }
  });
  window.FitPlanTelemetry = Object.freeze({ initSession, heartbeat, trackEvent, flushQueue });
})();
