import { describe, it, expect } from "vitest";
import {
  seriesText,
  repsText,
  parseSets,
  defaultReps,
  getEquipment,
  exerciseStateKey,
  getHistorySummary,
  getExerciseDoneSummary,
  getTodayWorkoutKey
} from "../helpers/workout.js";

// ---------------------------------------------------------------------------
// seriesText
// ---------------------------------------------------------------------------
describe("seriesText", () => {
  it("uses singular for 1 set", () => {
    expect(seriesText(1)).toBe("1 série");
    expect(seriesText("1")).toBe("1 série");
  });

  it("uses plural for multiple sets", () => {
    expect(seriesText(3)).toBe("3 séries");
    expect(seriesText(4)).toBe("4 séries");
  });

  it("preserves original value in output", () => {
    expect(seriesText("3–4")).toBe("3–4 séries");
  });
});

// ---------------------------------------------------------------------------
// repsText
// ---------------------------------------------------------------------------
describe("repsText", () => {
  it("appends reps for plain numbers", () => {
    expect(repsText("10")).toBe("10 reps");
    expect(repsText("8–12")).toBe("8–12 reps");
  });

  it("returns as-is for special rep schemes", () => {
    expect(repsText("30 min")).toBe("30 min");
    expect(repsText("moderado")).toBe("moderado");
    expect(repsText("até a falha")).toBe("até a falha");
    expect(repsText("12 cada lado")).toBe("12 cada lado");
  });

  it("handles empty/null gracefully", () => {
    expect(repsText("")).toBe(" reps");
    expect(repsText(null)).toBe(" reps");
  });
});

// ---------------------------------------------------------------------------
// parseSets
// ---------------------------------------------------------------------------
describe("parseSets", () => {
  it("parses integer sets", () => {
    expect(parseSets({ sets: "3" })).toBe(3);
    expect(parseSets({ sets: 4 })).toBe(4);
  });

  it("defaults to 1 for non-numeric or missing sets", () => {
    expect(parseSets({ sets: undefined })).toBe(1);
    expect(parseSets({ sets: "abc" })).toBe(1);
    expect(parseSets({})).toBe(1);
  });

  it("parses first number from range notation", () => {
    expect(parseSets({ sets: "3–4" })).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// defaultReps
// ---------------------------------------------------------------------------
describe("defaultReps", () => {
  it("returns last number from reps string", () => {
    expect(defaultReps({ reps: "8–12" })).toBe(12);
    expect(defaultReps({ reps: "10" })).toBe(10);
    expect(defaultReps({ reps: "15 cada lado" })).toBe(15);
  });

  it("defaults to 10 when reps is missing", () => {
    expect(defaultReps({})).toBe(10);
    expect(defaultReps({ reps: null })).toBe(10);
  });

  it("defaults to 10 for non-numeric reps", () => {
    expect(defaultReps({ reps: "moderado" })).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// getEquipment
// ---------------------------------------------------------------------------
describe("getEquipment", () => {
  it("uses variant.equipment when provided", () => {
    expect(getEquipment({ name: "Qualquer" }, { equipment: "Halteres" })).toBe("Halteres");
  });

  it("infers Halteres from name", () => {
    expect(getEquipment({ name: "Supino com halteres" })).toBe("Halteres");
  });

  it("infers Barra from name", () => {
    expect(getEquipment({ name: "Agachamento com barra" })).toBe("Barra");
  });

  it("infers Polia from cabo/polia/pulley", () => {
    expect(getEquipment({ name: "Rosca no cabo" })).toBe("Polia");
    expect(getEquipment({ name: "Puxada na polia" })).toBe("Polia");
  });

  it("infers Máquina from leg-press/hack/cadeira", () => {
    expect(getEquipment({ name: "Leg Press 45°" })).toBe("Máquina");
    expect(getEquipment({ name: "Hack Squat" })).toBe("Máquina");
    expect(getEquipment({ name: "Cadeira extensora" })).toBe("Máquina");
  });

  it("infers Smith from smith", () => {
    expect(getEquipment({ name: "Agachamento no Smith" })).toBe("Smith");
  });

  it("infers Cardio from bike/esteira", () => {
    expect(getEquipment({ name: "Bike ergométrica" })).toBe("Cardio");
    expect(getEquipment({ name: "Caminhada na esteira" })).toBe("Cardio");
  });

  it("returns Equipamento livre as fallback", () => {
    expect(getEquipment({ name: "Prancha" })).toBe("Equipamento livre");
  });
});

// ---------------------------------------------------------------------------
// exerciseStateKey
// ---------------------------------------------------------------------------
describe("exerciseStateKey", () => {
  const baseVariant = { key: "base", label: "Base" };
  const altVariant = { key: "maquina", label: "Máquina" };

  it("returns exercise.id when only one variant", () => {
    const exercise = { id: "upper-a-row" };
    expect(exerciseStateKey(exercise, baseVariant, [baseVariant])).toBe("upper-a-row");
  });

  it("returns exercise.id when selected variant is the first (default)", () => {
    const exercise = { id: "upper-a-row" };
    expect(exerciseStateKey(exercise, baseVariant, [baseVariant, altVariant])).toBe("upper-a-row");
  });

  it("returns compound key when non-default variant selected", () => {
    const exercise = { id: "upper-a-row" };
    expect(exerciseStateKey(exercise, altVariant, [baseVariant, altVariant])).toBe(
      "upper-a-row::maquina"
    );
  });
});

// ---------------------------------------------------------------------------
// getHistorySummary
// ---------------------------------------------------------------------------
describe("getHistorySummary", () => {
  it("returns empty string for no entries", () => {
    expect(getHistorySummary([])).toBe("");
    expect(getHistorySummary(null)).toBe("");
    expect(getHistorySummary(undefined)).toBe("");
  });

  it("returns empty string when no entry has numeric load", () => {
    expect(getHistorySummary([{ load: null }, { load: undefined }])).toBe("");
  });

  it("returns correct last and best values", () => {
    const entries = [
      { load: 80 },
      { load: 90 },
      { load: 85 }
    ];
    expect(getHistorySummary(entries)).toBe("Última: 85 kg • Melhor: 90 kg");
  });

  it("formats decimal loads with comma", () => {
    const entries = [{ load: 102.5 }, { load: 107.5 }];
    expect(getHistorySummary(entries)).toBe("Última: 107,5 kg • Melhor: 107,5 kg");
  });

  it("handles single entry", () => {
    expect(getHistorySummary([{ load: 60 }])).toBe("Última: 60 kg • Melhor: 60 kg");
  });
});

// ---------------------------------------------------------------------------
// getExerciseDoneSummary
// ---------------------------------------------------------------------------
describe("getExerciseDoneSummary", () => {
  it("combines sets, reps and weight", () => {
    const exercise = { sets: "3", reps: "10" };
    expect(getExerciseDoneSummary(exercise, "lower-a-squat", { "lower-a-squat": "80" })).toBe(
      "3 séries • 10 reps • 80 kg"
    );
  });

  it("omits missing parts", () => {
    const exercise = { sets: "3", reps: "10" };
    expect(getExerciseDoneSummary(exercise, "lower-a-squat", {})).toBe("3 séries • 10 reps");
  });

  it("returns 'Concluído' when all parts are empty", () => {
    expect(getExerciseDoneSummary({}, "key", {})).toBe("Concluído");
  });
});

// ---------------------------------------------------------------------------
// getTodayWorkoutKey
// ---------------------------------------------------------------------------
describe("getTodayWorkoutKey", () => {
  const profile = {
    tabs: [
      { key: "push-a", label: "Seg • Push A" },
      { key: "pull-a", label: "Ter • Pull A" },
      { key: "legs-a", label: "Qua • Legs A" },
      { key: "push-b", label: "Qui • Push B" },
      { key: "pull-b", label: "Sex • Pull B" },
      { key: "legs-b", label: "Sáb • Legs B" }
    ]
  };

  it("returns correct key for each weekday", () => {
    expect(getTodayWorkoutKey(profile, 1)).toBe("push-a"); // Seg
    expect(getTodayWorkoutKey(profile, 2)).toBe("pull-a"); // Ter
    expect(getTodayWorkoutKey(profile, 3)).toBe("legs-a"); // Qua
    expect(getTodayWorkoutKey(profile, 4)).toBe("push-b"); // Qui
    expect(getTodayWorkoutKey(profile, 5)).toBe("pull-b"); // Sex
    expect(getTodayWorkoutKey(profile, 6)).toBe("legs-b"); // Sáb
  });

  it("returns null on rest day (Sunday — no matching tab)", () => {
    expect(getTodayWorkoutKey(profile, 0)).toBeNull(); // Dom
  });

  it("returns null if no tab matches", () => {
    const minimal = { tabs: [{ key: "full", label: "Seg • Full Body" }] };
    expect(getTodayWorkoutKey(minimal, 3)).toBeNull(); // Qua, no tab
  });
});
