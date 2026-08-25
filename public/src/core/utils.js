// Pure utility functions — no DOM, no global state dependencies.
// Source: public/index.html (helpers section + parseLoad/formatLoad/hasAnyTerm)

function getLocalDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function profileStateKey(id) { return `gym-app-profile-${id}-state`; }
function profilePinKey(id) { return `gym-app-profile-${id}-pin`; }

function hashPin(pin) {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = (((h << 5) + h) ^ pin.charCodeAt(i)) >>> 0;
  }
  return String(h);
}

function recoverJonathanFromTestProfile() {
  const stateKey = profileStateKey("jonathan");
  const measurementsKey = "gym-app-profile-jonathan-measurements";
  const displayNameKey = "gym-app-profile-jonathan-display-name";
  const rawState = localStorage.getItem(stateKey);
  if (!rawState) return false;

  try {
    const candidate = JSON.parse(rawState);
    const sessions = Array.isArray(candidate.sessions) ? candidate.sessions : [];
    const squatHistory = candidate.history?.["lower-a-squat"];
    const isFourMonthTest = sessions.length === 80
      && sessions[0]?.date === "2026-05-04"
      && sessions.at(-1)?.date === "2026-08-22"
      && Array.isArray(squatHistory)
      && squatHistory.length === 16
      && squatHistory[0]?.load === 80
      && squatHistory.at(-1)?.load === 102.5
      && String(candidate.weights?.["lower-a-leg-press"]) === "205";

    if (!isFourMonthTest) return false;

    localStorage.removeItem(stateKey);
    localStorage.removeItem(displayNameKey);

    try {
      const measurements = JSON.parse(localStorage.getItem(measurementsKey) || "[]");
      const isTestMeasurements = Array.isArray(measurements)
        && measurements.length === 9
        && measurements[0]?.date === "2026-05-04"
        && measurements[0]?.weight === "99.0"
        && measurements.at(-1)?.date === "2026-08-24"
        && measurements.at(-1)?.weight === "92.0";
      if (isTestMeasurements) localStorage.removeItem(measurementsKey);
    } catch {}

    if (localStorage.getItem(profilePinKey("jonathan")) === hashPin("1234")) {
      localStorage.removeItem(profilePinKey("jonathan"));
    }
    if (localStorage.getItem(ACTIVE_KEY) === "jonathan") {
      localStorage.removeItem(ACTIVE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "opcao";
}

function parseLoad(value) {
  const normalized = String(value || "").replace(",", ".").match(/\d+(?:\.\d+)?/);
  return normalized ? Number(normalized[0]) : null;
}

function formatLoad(value) {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1))).replace(".", ",");
}

function getHistoryEntries(key) {
  return state?.history?.[key] || [];
}

function getHistorySummary(key) {
  const entries = getHistoryEntries(key).filter((entry) => Number.isFinite(entry.load));
  if (!entries.length) return "";
  const last = entries[entries.length - 1];
  const best = entries.reduce((max, entry) => Math.max(max, entry.load), 0);
  return `Última: ${formatLoad(last.load)} kg • Melhor: ${formatLoad(best)} kg`;
}

function hasAnyTerm(text, terms) {
  return terms.some((term) => text.includes(term));
}
