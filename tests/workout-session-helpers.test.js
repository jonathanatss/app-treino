import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  window.eval(readFileSync(join(process.cwd(), "public/src/workout-session-helpers.js"), "utf8"));
});

describe("workout session helpers", () => {
  it("calcula as anilhas por lado para uma carga exata", () => {
    const result = window.FitPlanWorkoutHelpers.calculatePlates(100, 20);
    expect(result.achievable).toBe(true);
    expect(result.loadedTotalKg).toBe(100);
    expect(result.perSide).toEqual([{ weight: 20, count: 2 }]);
  });

  it("informa a carga alcançável quando faltam anilhas", () => {
    const result = window.FitPlanWorkoutHelpers.calculatePlates(23, 20);
    expect(result.achievable).toBe(false);
    expect(result.loadedTotalKg).toBe(22.5);
    expect(result.remainderKg).toBe(0.5);
  });

  it("prioriza a série atual no preenchimento inteligente", () => {
    const result = window.FitPlanWorkoutHelpers.lastSuccessfulSet(
      [{ load: 60, reps: 10 }],
      [{ load: 62.5, reps: 8, actualRir: "1" }]
    );
    expect(result).toEqual({ load: 62.5, reps: 8, actualRir: "1" });
  });

  it("faz fallback silencioso quando vibração não existe", () => {
    vi.stubGlobal("navigator", {});
    expect(window.FitPlanWorkoutHelpers.vibrate(100)).toBe(false);
    vi.unstubAllGlobals();
  });
});
