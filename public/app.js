// FitPlan app — constants, state, DOM refs, PIN, render, workout, wiring, init.
// Depends on all src/core/* and src/data/* modules loaded before this file.

const ACTIVE_KEY = "gym-app-active-profile";
const UI_KEY = "gym-app-ui";
const EXPORT_VERSION = 1;
const todayKey = getLocalDayKey();
const LOAD_WARMUP_TIP = "Dica de aquecimento: no primeiro exercício de cada grupo muscular, faça 1 ou 2 séries com 40~50% da carga válida antes das séries principais.";


/* === State === */
let currentProfile = null;
let activeTab = null;
let state = null;
let uiState = loadUiState();
let timerId = null;
let timerEndsAt = 0;
let activeRest = 0;

let pinScreenMode = "enter";
let pinScreenProfile = null;
let pinFirstAttempt = "";
let pinBuffer = "";
let pinResetArmed = false;
let pinResetTimer = null;

const screenPicker = document.querySelector("#screen-picker");
const screenPin = document.querySelector("#screen-pin");
const screenApp = document.querySelector("#screen-app");
const workoutEl = document.querySelector("#workout");
const timerEl = document.querySelector("#timer");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const stopTimer = document.querySelector("#stopTimer");
const compactModeButton = document.querySelector("#compactMode");
const todayWorkoutButton = document.querySelector("#todayWorkout");
const importDataInput = document.querySelector("#importData");

function loadProfileState(profileId) {
  const profile = profiles[profileId];
  try {
    const parsed = JSON.parse(localStorage.getItem(profileStateKey(profileId))) || {};
    const activeForToday = getTodayWorkoutKey(profile) || parsed.activeTab || profile.defaultTab;
    if (parsed.day !== todayKey) {
      return {
        day: todayKey,
        activeTab: activeForToday,
        weights: parsed.weights || {},
        done: {},
        history: parsed.history || {},
        sessions: parsed.sessions || [],
        seriesProgress: {},
        variants: parsed.variants || {},
        exerciseRest: parsed.exerciseRest || {},
        exerciseNotes: parsed.exerciseNotes || {},
        expandedMedia: parsed.expandedMedia || {}
      };
    }
    return { day: todayKey, weights: {}, done: {}, history: {}, variants: {}, exerciseRest: {}, exerciseNotes: {}, expandedMedia: {}, activeTab: activeForToday, ...parsed };
  } catch {
    return { day: todayKey, weights: {}, done: {}, history: {}, variants: {}, exerciseRest: {}, exerciseNotes: {}, expandedMedia: {}, activeTab: getTodayWorkoutKey(profile) || profile.defaultTab };
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
  screenPicker.hidden = name !== "picker";
  screenPin.hidden = name !== "pin";
  screenApp.hidden = name !== "app";
  window.scrollTo(0, 0);
}

/* === Profile picker === */
function renderProfilePicker() {
  const list = document.querySelector("#profileList");
  list.innerHTML = `<div class="auth-gate-loading" role="status">Conectando à sua conta…</div>`;
}

/* === PIN screen === */
function openPinScreen(profileId) {
  pinScreenProfile = profileId;
  pinBuffer = "";
  pinFirstAttempt = "";
  clearPinResetRequest();
  const hasPin = !!localStorage.getItem(profilePinKey(profileId));
  pinScreenMode = hasPin ? "enter" : "setup";
  setPinError("");
  renderPinScreen();
  showScreen("pin");
}

function renderPinScreen() {
  const profile = profiles[pinScreenProfile];
  document.querySelector("#pinTitle").textContent = profile.name;
  let subtitle = "Digite seu PIN";
  if (pinScreenMode === "setup") subtitle = "Defina um PIN de 4 dígitos";
  if (pinScreenMode === "confirm") subtitle = "Confirme o PIN";
  document.querySelector("#pinSubtitle").textContent = subtitle;
  document.querySelectorAll("#screen-pin .pin-dot").forEach((dot, i) => {
    dot.classList.toggle("filled", i < pinBuffer.length);
  });
  renderPinResetButton();
}

function pinPress(digit) {
  if (pinBuffer.length >= 4) return;
  if (pinResetArmed) setPinError("");
  clearPinResetRequest();
  pinBuffer += digit;
  renderPinScreen();
  if (pinBuffer.length === 4) {
    setTimeout(processPinSubmit, 120);
  }
}

function pinBackspace() {
  if (pinResetArmed) setPinError("");
  clearPinResetRequest();
  pinBuffer = pinBuffer.slice(0, -1);
  renderPinScreen();
}

function clearPinResetRequest() {
  pinResetArmed = false;
  if (pinResetTimer) {
    clearTimeout(pinResetTimer);
    pinResetTimer = null;
  }
}

function renderPinResetButton() {
  const btn = document.querySelector("#pinReset");
  if (!btn) return;
  const canReset = pinScreenProfile
    && pinScreenMode === "enter"
    && !!localStorage.getItem(profilePinKey(pinScreenProfile));
  btn.hidden = !canReset;
  btn.textContent = pinResetArmed ? "Resetar PIN" : "Esqueci meu PIN";
  btn.classList.toggle("is-armed", pinResetArmed);
}

function requestPinReset() {
  if (!pinScreenProfile || pinScreenMode !== "enter") return;

  if (!pinResetArmed) {
    pinResetArmed = true;
    pinBuffer = "";
    renderPinScreen();
    setPinError("Toque em Resetar PIN para criar um novo PIN neste aparelho.");
    pinResetTimer = setTimeout(() => {
      pinResetTimer = null;
      pinResetArmed = false;
      if (pinScreenMode === "enter") {
        renderPinScreen();
        setPinError("");
      }
    }, 6000);
    return;
  }

  localStorage.removeItem(profilePinKey(pinScreenProfile));
  if (localStorage.getItem(ACTIVE_KEY) === pinScreenProfile) {
    localStorage.removeItem(ACTIVE_KEY);
  }
  clearPinResetRequest();
  pinBuffer = "";
  pinFirstAttempt = "";
  pinScreenMode = "setup";
  renderPinScreen();
  setPinError("PIN removido. Defina um novo PIN.");
}

function setPinError(msg) {
  const el = document.querySelector("#pinError");
  if (el) el.textContent = msg;
}

function processPinSubmit() {
  if (pinScreenMode === "enter") {
    const stored = localStorage.getItem(profilePinKey(pinScreenProfile));
    if (hashPin(pinBuffer) === stored) {
      setPinError("");
      enterApp(pinScreenProfile);
    } else {
      pinBuffer = "";
      renderPinScreen();
      setPinError("PIN incorreto. Tente de novo.");
    }
  } else if (pinScreenMode === "setup") {
    pinFirstAttempt = pinBuffer;
    pinBuffer = "";
    pinScreenMode = "confirm";
    setPinError("");
    renderPinScreen();
  } else if (pinScreenMode === "confirm") {
    if (pinBuffer === pinFirstAttempt) {
      localStorage.setItem(profilePinKey(pinScreenProfile), hashPin(pinBuffer));
      setPinError("");
      enterApp(pinScreenProfile);
    } else {
      pinBuffer = "";
      pinFirstAttempt = "";
      pinScreenMode = "setup";
      renderPinScreen();
      setPinError("PINs não combinaram. Crie um novo.");
    }
  }
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
}

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


/* === Wiring === */
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

document.querySelectorAll("#screen-pin .pin-key").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.action === "back") pinBackspace();
    else if (btn.dataset.digit) pinPress(btn.dataset.digit);
  });
});

document.querySelector("#pinBack").addEventListener("click", () => {
  pinBuffer = "";
  pinFirstAttempt = "";
  clearPinResetRequest();
  setPinError("");
  showScreen("picker");
});

document.querySelector("#pinReset").addEventListener("click", requestPinReset);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

/* === Init === */
(function init() {
  recoverJonathanFromTestProfile();
  renderProfilePicker();
  showScreen("picker");
})();
