/**
 * Workout-related pure functions extracted from public/stitch-ui.js and public/index.html.
 * Must stay in sync with source implementations.
 */

import { slugify, hasAnyTerm, formatLoad } from "./utils.js";

// ---------------------------------------------------------------------------
// seriesText — stitch-ui.js
// ---------------------------------------------------------------------------
export function seriesText(value) {
  const count = parseInt(String(value), 10);
  return `${value} ${count === 1 ? "série" : "séries"}`;
}

// ---------------------------------------------------------------------------
// repsText — stitch-ui.js
// ---------------------------------------------------------------------------
export function repsText(value) {
  const text = String(value || "");
  return /min|moderado|falha|cada lado/i.test(text) ? text : `${text} reps`;
}

// ---------------------------------------------------------------------------
// parseSets — stitch-ui.js
// ---------------------------------------------------------------------------
export function parseSets(exercise) {
  const parsed = parseInt(String(exercise.sets), 10);
  return Number.isFinite(parsed) ? parsed : 1;
}

// ---------------------------------------------------------------------------
// defaultReps — stitch-ui.js
// ---------------------------------------------------------------------------
export function defaultReps(exercise) {
  const numbers = String(exercise.reps || "10").match(/\d+/g);
  return numbers?.length ? Number(numbers[numbers.length - 1]) : 10;
}

// ---------------------------------------------------------------------------
// getEquipment — stitch-ui.js
// ---------------------------------------------------------------------------
export function getEquipment(exercise, variant = null) {
  if (variant?.equipment) return variant.equipment;
  const text = slugify(variant?.displayName || variant?.label || exercise.name);
  if (text.includes("halter")) return "Halteres";
  if (text.includes("barra")) return "Barra";
  if (text.includes("polia") || text.includes("cabo") || text.includes("pulley")) return "Polia";
  if (
    text.includes("maquina") ||
    text.includes("hack") ||
    text.includes("leg-press") ||
    text.includes("cadeira")
  )
    return "Máquina";
  if (text.includes("smith")) return "Smith";
  if (text.includes("esteira") || text.includes("bike")) return "Cardio";
  return "Equipamento livre";
}

// ---------------------------------------------------------------------------
// exerciseStateKey — index.html
// Given pre-computed variants array to avoid dependency on global state.
// ---------------------------------------------------------------------------
export function exerciseStateKey(exercise, variant, variants) {
  if (variants.length <= 1 || variant.key === variants[0].key) return exercise.id;
  return `${exercise.id}::${variant.key}`;
}

// ---------------------------------------------------------------------------
// getHistorySummary — index.html
// Accepts history entries directly (extracted from state.history[key]).
// ---------------------------------------------------------------------------
export function getHistorySummary(entries) {
  const valid = (entries || []).filter((entry) => Number.isFinite(entry.load));
  if (!valid.length) return "";
  const last = valid[valid.length - 1];
  const best = valid.reduce((max, entry) => Math.max(max, entry.load), 0);
  return `Última: ${formatLoad(last.load)} kg • Melhor: ${formatLoad(best)} kg`;
}

// ---------------------------------------------------------------------------
// getExerciseDoneSummary — index.html
// Accepts weights map directly (extracted from state.weights).
// ---------------------------------------------------------------------------
export function getExerciseDoneSummary(exercise, stateKey, weights) {
  return (
    [
      exercise.sets ? `${exercise.sets} séries` : "",
      exercise.reps ? `${exercise.reps} reps` : "",
      weights[stateKey] ? `${weights[stateKey]} kg` : ""
    ]
      .filter(Boolean)
      .join(" • ") || "Concluído"
  );
}

// ---------------------------------------------------------------------------
// getTodayWorkoutKey — index.html
// Accepts a day index (0=Sun…6=Sat) to allow deterministic testing.
// ---------------------------------------------------------------------------
export function getTodayWorkoutKey(profile, dayIndex = new Date().getDay()) {
  const prefixes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const prefix = prefixes[dayIndex];
  return profile.tabs.find((tab) => tab.label.startsWith(prefix))?.key || null;
}
