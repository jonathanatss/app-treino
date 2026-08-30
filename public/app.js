// FitPlan app — constants, state, DOM refs, PIN, render, workout, wiring, init.
// Depends on all src/core/* and src/data/* modules loaded before this file.

const ACTIVE_KEY = "gym-app-active-profile";
const UI_KEY = "gym-app-ui";
const EXPORT_VERSION = 1;
const APP_VERSION = "61";
const APP_VERSION_KEY = "fitplan-app-version";
const todayKey = getLocalDayKey();
const LOAD_WARMUP_TIP = "Dica de aquecimento: no primeiro exercício de cada grupo muscular, faça 1 ou 2 séries com 40~50% da carga válida antes das séries principais.";

(function refreshStaleAppShell() {
  try {
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);
    if (storedVersion === APP_VERSION) return;
    localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
    if (!storedVersion) return;
    if (window.caches?.keys) {
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => /^fitplan-/.test(key)).map((key) => caches.delete(key)))
      ).catch(() => {});
    }
    navigator.serviceWorker?.getRegistrations?.()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.update().catch(() => null))))
      .catch(() => {});
  } catch {}
})();


/* === State === */
let currentProfile = null;
let activeTab = null;
let state = null;
let uiState = loadUiState();
let timerId = null;
let timerEndsAt = 0;
let activeRest = 0;

// DOM refs — initialized on DOMContentLoaded
let screenPicker, screenApp, workoutEl, timerEl, progressText, progressFill,
    stopTimer, compactModeButton, todayWorkoutButton, importDataInput;

function loadProfileState(profileId) {
  const profile = profiles[profileId];
  try {
    const parsed = JSON.parse(localStorage.getItem(profileStateKey(profileId))) || {};
    const initialTab = parsed.activeTab || profile.defaultTab || getTodayWorkoutKey(profile);
    if (parsed.day !== todayKey) {
      return {
        day: todayKey,
        activeTab: initialTab,
        weights: parsed.weights || {},
        done: {},
        history: parsed.history || {},
        sessions: parsed.sessions || [],
        seriesProgress: {},
        variants: parsed.variants || {},
        exerciseRest: parsed.exerciseRest || {},
        exerciseNotes: parsed.exerciseNotes || {},
        expandedMedia: parsed.expandedMedia || {},
        expandedExerciseKey: null
      };
    }
    return { day: todayKey, weights: {}, done: {}, history: {}, variants: {}, exerciseRest: {}, exerciseNotes: {}, expandedMedia: {}, expandedExerciseKey: null, activeTab: initialTab, ...parsed };
  } catch {
    return { day: todayKey, weights: {}, done: {}, history: {}, variants: {}, exerciseRest: {}, exerciseNotes: {}, expandedMedia: {}, expandedExerciseKey: null, activeTab: profile.defaultTab || getTodayWorkoutKey(profile) };
  }
}

function loadUiState() {
  try {
    return { compact: false, ...JSON.parse(localStorage.getItem(UI_KEY)) };
  } catch {
    return { compact: false };
  }
}

function saveUiState() {
  localStorage.setItem(UI_KEY, JSON.stringify(uiState));
}

function getTodayWorkoutKey(profile) {
  const prefixes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const prefix = prefixes[new Date().getDay()];
  return profile.tabs.find((tab) => tab.label.startsWith(prefix))?.key || null;
}

function updateModeControls() {
  screenApp.classList.toggle("compact-mode", !!uiState.compact);
  if (compactModeButton) {
    compactModeButton.textContent = uiState.compact ? "Modo visual" : "Modo compacto";
    compactModeButton.setAttribute("aria-pressed", String(!!uiState.compact));
  }
}

function updateTodayButton() {
  const profile = currentProfile ? profiles[currentProfile] : null;
  const todayKeyForProfile = profile ? getTodayWorkoutKey(profile) : null;
  if (!todayWorkoutButton) return;
  todayWorkoutButton.hidden = !profile;
  if (!profile) return;
  if (!todayKeyForProfile) {
    todayWorkoutButton.disabled = true;
    todayWorkoutButton.textContent = "Hoje: descanso";
    todayWorkoutButton.title = "Não há treino cadastrado para hoje neste perfil.";
    return;
  }
  todayWorkoutButton.disabled = todayKeyForProfile === activeTab;
  todayWorkoutButton.title = todayKeyForProfile === activeTab ? "Você já está no treino de hoje." : "Ir para o treino de hoje";
  const todayTab = profile?.tabs.find((tab) => tab.key === todayKeyForProfile);
  todayWorkoutButton.textContent = todayTab ? `Hoje: ${todayTab.label}` : "Treino de hoje";
}

function saveProfileState() {
  if (!currentProfile) return;
  state.activeTab = activeTab;
  localStorage.setItem(profileStateKey(currentProfile), JSON.stringify(state));
}

function showScreen(name) {
  const picker = screenPicker || document.querySelector("#screen-picker");
  const app    = screenApp    || document.querySelector("#screen-app");
  if (picker) picker.hidden = name !== "picker";
  if (app)    app.hidden    = name !== "app";
  window.scrollTo(0, 0);
}

/* === Profile picker === */
function renderProfilePicker() {
  const list = document.querySelector("#profileList");
  list.innerHTML = `<div class="auth-gate-loading" role="status">Conectando à sua conta…</div>`;
}

/* === Enter / leave app === */
function enterApp(profileId) {
  currentProfile = profileId;
  localStorage.setItem(ACTIVE_KEY, profileId);
  state = loadProfileState(profileId);
  const profile = profiles[profileId];
  const visibleTabKeys = new Set(profile.tabs.map((tab) => tab.key));
  activeTab = visibleTabKeys.has(state.activeTab) ? state.activeTab : profile.defaultTab;
  renderApp();
  showScreen("app");
  // Pull history from Supabase in background after rendering
  pullHistoryFromSupabase(profileId).catch(() => {});
}

/**
 * Fetches exercise load history from Supabase and merges it into the local
 * state.history. Runs in background — does not block the initial render.
 * Only runs if the user is authenticated and has a linked profile.
 */
async function pullHistoryFromSupabase(profileId) {
  const client = window.fitplanCloud?.client;
  const userId = window.fitplanCloud?.snapshot?.().user?.id;
  if (!client || !userId) return;

  try {
    // 8 second timeout — if Supabase is slow or RLS blocks, fail silently
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 8000)
    );

    // Load the latest load entries per exercise from workout_set_logs
    const queryPromise = client
      .from("workout_set_logs")
      .select(`
        load_kg,
        completed_at,
        workout_exercise_logs!inner(
          exercise_id,
          plan_exercise_id,
          workout_sessions!inner(
            session_date,
            user_id,
            workout_days!inner(day_key)
          )
        )
      `)
      .not("load_kg", "is", null)
      .order("completed_at", { ascending: true })
      .limit(500);

    const { data: rows, error } = await Promise.race([queryPromise, timeoutPromise]);
    if (error || !rows?.length) return;

    // Filter to only this user's rows (safer than relying solely on RLS join filter)
    const userRows = rows.filter((r) =>
      r.workout_exercise_logs?.workout_sessions?.user_id === userId
    );
    if (!userRows.length) return;

    // Build exercise_catalog slug → legacy stateKey map
    const planExerciseIds = [...new Set(userRows.map((r) => r.workout_exercise_logs?.plan_exercise_id).filter(Boolean))];
    if (!planExerciseIds.length) return;

    const { data: catalog } = await Promise.race([
      client.from("plan_exercises").select("id, exercise_catalog!inner(slug)").in("id", planExerciseIds),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))
    ]);
    if (!catalog?.length) return;

    const slugByPlanExerciseId = new Map(
      catalog.map((pe) => [pe.id, pe.exercise_catalog?.slug?.replace(/^legacy-/, "") || ""])
    );

    // Merge into state.history without overwriting entries already present
    let changed = false;
    for (const row of userRows) {
      const log = row.workout_exercise_logs;
      if (!log) continue;
      const session = log.workout_sessions;
      if (!session) continue;
      const dayKey = session.workout_days?.day_key;
      const date = session.session_date;
      const load = parseLoad(row.load_kg);
      if (!Number.isFinite(load) || !dayKey || !date) continue;

      const slug = slugByPlanExerciseId.get(log.plan_exercise_id);
      if (!slug) continue;

      state.history = state.history || {};
      const entries = state.history[slug] || [];
      const alreadyHas = entries.some((e) => e.date === date && e.tab === dayKey);
      if (!alreadyHas) {
        entries.push({ date, tab: dayKey, exerciseId: slug, variant: "base", load });
        state.history[slug] = entries.slice(-16);
        changed = true;
      }
    }

    if (changed) {
      saveProfileState();
      renderWorkout();
    }
  } catch {
    // Fail silently — history sync is best-effort, never blocks the app
  }
}

/* === Render === */
function logout() {
  saveProfileState();
  stopRest();
  currentProfile = null;
  state = null;
  activeTab = null;
  localStorage.removeItem(ACTIVE_KEY);
  renderProfilePicker();
  showScreen("picker");
}

/* === Render === */
function renderApp() {
  const profile = profiles[currentProfile];
  document.querySelector("#appTitle").textContent = profile.title;
  document.querySelector("#profileIndicator").textContent = `Perfil: ${profile.name}`;
  document.querySelector("#appSubtitle").textContent = profile.subtitle;
  updateModeControls();
  updateTodayButton();
  const tabsShell = document.querySelector("#tabsShell");
  tabsShell.innerHTML = "";
  const todayWorkoutKey = getTodayWorkoutKey(profile);
  profile.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = `tab${tab.key === todayWorkoutKey ? " is-today" : ""}`;
    btn.type = "button";
    btn.dataset.tab = tab.key;
    btn.style.setProperty("--tab-color", tab.color);
    btn.setAttribute("aria-selected", String(tab.key === activeTab));
    btn.innerHTML = `<span class="tab-dot" aria-hidden="true"></span><span class="tab-label">${tab.label}</span>`;
    btn.addEventListener("click", () => {
      activeTab = tab.key;
      saveProfileState();
      renderWorkout();
    });
    tabsShell.appendChild(btn);
  });
  renderWorkout();
}

function renderTabs() {
  document.querySelectorAll("#tabsShell .tab").forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.tab === activeTab));
  });
  updateTodayButton();
  const activeButton = document.querySelector("#tabsShell .tab[aria-selected='true']");
  if (activeButton) {
    activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
}



/* === Wiring (inside DOMContentLoaded — see bottom of file) === */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then((reg) => {
        reg.update().catch(() => {});
        // Force new SW to activate immediately without waiting for tabs to close
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New SW installed — tell it to skip waiting and take control
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      }).catch(() => {});
      // Reload the page when a new SW takes control so users always get fresh code
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
  });
}

/* === Init === */
// Deferred to DOMContentLoaded so stitch-ui.js (loaded after app.js) has run
// and renderProfilePicker has been overridden with the real implementation.
document.addEventListener("DOMContentLoaded", function init() {
  // Initialize all DOM refs here — DOM is guaranteed to be ready
  screenPicker       = document.querySelector("#screen-picker");
  screenApp          = document.querySelector("#screen-app");
  workoutEl          = document.querySelector("#workout");
  timerEl            = document.querySelector("#timer");
  progressText       = document.querySelector("#progressText");
  progressFill       = document.querySelector("#progressFill");
  stopTimer          = document.querySelector("#stopTimer");
  compactModeButton  = document.querySelector("#compactMode");
  todayWorkoutButton = document.querySelector("#todayWorkout");
  importDataInput    = document.querySelector("#importData");

  // Wire up all event listeners
  document.querySelectorAll(".rest-button").forEach((b) => {
    b.addEventListener("click", () => startRest(Number(b.dataset.rest)));
  });
  stopTimer.addEventListener("click", stopRest);
  compactModeButton.addEventListener("click", () => {
    uiState.compact = !uiState.compact;
    saveUiState();
    updateModeControls();
    renderWorkout();
  });
  todayWorkoutButton.addEventListener("click", () => {
    const todayWorkout = getTodayWorkoutKey(profiles[currentProfile]);
    if (!todayWorkout) return;
    activeTab = todayWorkout;
    saveProfileState();
    renderWorkout();
  });
  document.querySelector("#exportData").addEventListener("click", exportData);
  importDataInput.addEventListener("change", (event) => {
    importData(event.target.files?.[0]);
    importDataInput.value = "";
  });
  document.querySelector("#resetDay").addEventListener("click", () => {
    if (!state) return;
    state.done = {};
    state.seriesProgress = {};
    state.day = todayKey;
    stopRest();
    saveProfileState();
    renderWorkout();
  });
  document.querySelector("#logoutBtn").addEventListener("click", logout);

  recoverJonathanFromTestProfile();
  renderProfilePicker();
  showScreen("picker");
});
