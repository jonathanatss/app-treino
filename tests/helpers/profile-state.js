/**
 * Profile state helpers extracted from public/index.html and public/stitch-ui.js.
 * Must stay in sync with the source implementations.
 */

export const PROFILE_STATE_PREFIX = "gym-app-profile-";
export const UI_KEY = "gym-app-ui";
export const SETTINGS_KEY = "gym-app-stitch-settings";

export function profileStateKey(id) {
  return `${PROFILE_STATE_PREFIX}${id}-state`;
}

export function profileDisplayNameKey(id) {
  return `${PROFILE_STATE_PREFIX}${id}-display-name`;
}

// ---------------------------------------------------------------------------
// lastProfileActivity — stitch-ui.js
// ---------------------------------------------------------------------------
export function lastProfileActivity(id) {
  try {
    const stored = JSON.parse(localStorage.getItem(profileStateKey(id)) || "{}");
    if (!stored.day) return "Novo perfil";
    const [y, m, d] = stored.day.split("-");
    return `Última sessão: ${d}/${m}/${y}`;
  } catch {
    return "Toque para entrar";
  }
}

// ---------------------------------------------------------------------------
// getSettings — stitch-ui.js
// ---------------------------------------------------------------------------
export function getSettings() {
  try {
    return {
      notifications: true,
      autoRest: true,
      sound: false,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY))
    };
  } catch {
    return { notifications: true, autoRest: true, sound: false };
  }
}

// ---------------------------------------------------------------------------
// saveSettings — stitch-ui.js
// ---------------------------------------------------------------------------
export function saveSettings(next) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

// ---------------------------------------------------------------------------
// loadProfileState — index.html
// Accepts todayKey and profile as explicit arguments for testability.
// ---------------------------------------------------------------------------
export function loadProfileState(profileId, profile, todayKey) {
  try {
    const parsed = JSON.parse(localStorage.getItem(profileStateKey(profileId))) || {};
    const activeForToday =
      getTodayWorkoutKeyFromTabs(profile, new Date().getDay()) ||
      parsed.activeTab ||
      profile.defaultTab;
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
    return {
      day: todayKey,
      weights: {},
      done: {},
      history: {},
      variants: {},
      exerciseRest: {},
      exerciseNotes: {},
      expandedMedia: {},
      activeTab: activeForToday,
      ...parsed
    };
  } catch {
    return {
      day: todayKey,
      weights: {},
      done: {},
      history: {},
      variants: {},
      exerciseRest: {},
      exerciseNotes: {},
      expandedMedia: {},
      activeTab: profile.defaultTab
    };
  }
}

function getTodayWorkoutKeyFromTabs(profile, dayIndex) {
  const prefixes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const prefix = prefixes[dayIndex];
  return profile.tabs.find((tab) => tab.label.startsWith(prefix))?.key || null;
}
