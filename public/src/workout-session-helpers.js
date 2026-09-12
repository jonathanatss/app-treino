(function () {
  "use strict";

  const DEFAULT_PLATES = Object.freeze([20, 15, 10, 5, 2.5, 1.25]);
  const SETTINGS_KEY = "gym-app-stitch-settings";

  function calculatePlates(totalKg, barKg = 20, inventory = DEFAULT_PLATES) {
    const total = Number(totalKg);
    const bar = Number(barKg);
    const plates = [...new Set((inventory || []).map(Number).filter((value) => value > 0))].sort((a, b) => b - a);
    if (!Number.isFinite(total) || !Number.isFinite(bar) || total < bar) {
      return { totalKg: total, barKg: bar, perSide: [], remainderKg: Math.max(0, total - bar), loadedTotalKg: bar, achievable: false };
    }

    let remaining = (total - bar) / 2;
    const perSide = [];
    plates.forEach((weight) => {
      const count = Math.floor((remaining + 1e-8) / weight);
      if (!count) return;
      perSide.push({ weight, count });
      remaining = Number((remaining - count * weight).toFixed(3));
    });
    const remainderKg = Number((remaining * 2).toFixed(2));
    return {
      totalKg: total,
      barKg: bar,
      perSide,
      remainderKg,
      loadedTotalKg: Number((total - remainderKg).toFixed(2)),
      achievable: Math.abs(remainderKg) < 0.01
    };
  }

  function getAlertSettings() {
    try {
      return { sound: false, vibration: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
    } catch {
      return { sound: false, vibration: true };
    }
  }

  function vibrate(pattern) {
    try {
      if (typeof navigator?.vibrate !== "function") return false;
      return navigator.vibrate(pattern) !== false;
    } catch {
      return false;
    }
  }

  function playTimerTone(kind = "finish") {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      const context = new AudioContext();
      const pulses = kind === "warning" ? [{ at: 0, frequency: 660, duration: 0.09 }] : [
        { at: 0, frequency: 760, duration: 0.2 },
        { at: 0.32, frequency: 920, duration: 0.28 }
      ];
      pulses.forEach(({ at, frequency, duration }) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, context.currentTime + at);
        gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + at + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(context.currentTime + at);
        oscillator.stop(context.currentTime + at + duration + 0.02);
      });
      window.setTimeout(() => context.close().catch(() => {}), 900);
      return true;
    } catch {
      return false;
    }
  }

  function lastSuccessfulSet(history = [], currentSeries = []) {
    const candidates = [...history, ...currentSeries].filter((entry) => Number.isFinite(Number(entry?.load)) && Number(entry?.reps) > 0);
    const latest = candidates.at(-1);
    return latest ? { load: Number(latest.load), reps: Number(latest.reps), actualRir: latest.actualRir ?? null } : null;
  }

  function defaultActualRir(targetRir) {
    const text = String(targetRir ?? "");
    if (/falha/i.test(text)) return "failure";
    const values = text.match(/\d+/g)?.map(Number) || [];
    return String(Math.min(3, values.at(-1) ?? 2));
  }

  function rirLabel(value) {
    return value === "failure" ? "Falha" : value === "3" ? "3+" : String(value ?? "—");
  }

  function rirSelectorMarkup(selected = "2", idPrefix = "rir") {
    const options = [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3+"], ["failure", "Falha"]];
    return `<fieldset class="rir-selector" data-actual-rir="${selected}"><legend>RIR REAL</legend><div class="rir-options">${options.map(([value, label]) => `<button class="rir-option${value === selected ? " is-selected" : ""}" type="button" data-rir-value="${value}" aria-pressed="${value === selected}">${label}</button>`).join("")}</div></fieldset>`;
  }

  function bindRirSelector(root) {
    root?.querySelectorAll?.("[data-rir-value]").forEach((button) => button.addEventListener("click", () => {
      const fieldset = button.closest(".rir-selector");
      fieldset.dataset.actualRir = button.dataset.rirValue;
      fieldset.querySelectorAll("[data-rir-value]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
    }));
  }

  function plateCalculatorMarkup(initialTotal = 20) {
    return `<div class="plate-calculator" data-plate-calculator>
      <label class="plate-total-label"><span>Carga total desejada</span><span class="plate-total-input"><input type="number" min="0" step="0.5" inputmode="decimal" value="${Number(initialTotal) || 20}" data-plate-total><strong>kg</strong></span></label>
      <fieldset><legend>BARRA</legend><div class="plate-choice-row">${[20, 15, 10].map((value) => `<button type="button" data-bar-kg="${value}" class="${value === 20 ? "is-selected" : ""}" aria-pressed="${value === 20}">${value} kg</button>`).join("")}</div></fieldset>
      <fieldset><legend>ANILHAS DISPONÍVEIS</legend><div class="plate-choice-row plate-inventory">${DEFAULT_PLATES.map((value) => `<button type="button" data-plate-kg="${value}" class="is-selected" aria-pressed="true">${String(value).replace(".", ",")}</button>`).join("")}</div></fieldset>
      <section class="plate-result" aria-live="polite" data-plate-result></section>
      <button class="primary-button plate-apply" type="button" data-plate-apply>Aplicar carga</button>
    </div>`;
  }

  function bindPlateCalculator(root, onApply) {
    const calculator = root?.querySelector?.("[data-plate-calculator]");
    if (!calculator) return;
    const totalInput = calculator.querySelector("[data-plate-total]");
    let barKg = 20;
    const inventory = new Set(DEFAULT_PLATES);
    const render = () => {
      const result = calculatePlates(totalInput.value, barKg, [...inventory]);
      const discs = result.perSide.flatMap(({ weight, count }) => Array.from({ length: count }, () => `<span class="plate-disc plate-${String(weight).replace(".", "-")}" title="${weight} kg">${String(weight).replace(".", ",")}</span>`)).join("");
      const list = result.perSide.length ? result.perSide.map(({ weight, count }) => `<li><strong>${count}×</strong> ${String(weight).replace(".", ",")} kg</li>`).join("") : "<li>Somente a barra</li>";
      calculator.querySelector("[data-plate-result]").innerHTML = `<p><strong>Por lado da barra</strong><span>${result.achievable ? `${result.loadedTotalKg} kg no total` : `Mais próximo: ${result.loadedTotalKg} kg`}</span></p><div class="plate-bar-visual" aria-hidden="true"><span class="plate-sleeve"></span>${discs || '<span class="plate-empty">sem anilhas</span>'}</div><ul>${list}</ul>${result.achievable ? "" : `<small class="plate-warning">Faltam ${result.remainderKg} kg com o inventário selecionado.</small>`}`;
      calculator.dataset.loadedTotal = String(result.loadedTotalKg);
    };
    totalInput.addEventListener("input", render);
    calculator.querySelectorAll("[data-bar-kg]").forEach((button) => button.addEventListener("click", () => {
      barKg = Number(button.dataset.barKg);
      calculator.querySelectorAll("[data-bar-kg]").forEach((item) => { item.classList.toggle("is-selected", item === button); item.setAttribute("aria-pressed", String(item === button)); });
      render();
    }));
    calculator.querySelectorAll("[data-plate-kg]").forEach((button) => button.addEventListener("click", () => {
      const value = Number(button.dataset.plateKg);
      inventory.has(value) ? inventory.delete(value) : inventory.add(value);
      button.classList.toggle("is-selected", inventory.has(value));
      button.setAttribute("aria-pressed", String(inventory.has(value)));
      render();
    }));
    calculator.querySelector("[data-plate-apply]").addEventListener("click", () => onApply?.(Number(calculator.dataset.loadedTotal)));
    render();
  }

  window.FitPlanWorkoutHelpers = Object.freeze({
    DEFAULT_PLATES, calculatePlates, getAlertSettings, vibrate, playTimerTone,
    lastSuccessfulSet, defaultActualRir, rirLabel, rirSelectorMarkup, bindRirSelector,
    plateCalculatorMarkup, bindPlateCalculator
  });
})();
