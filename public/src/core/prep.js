// Preparatory set inference and rendering.
// Depends on: globals currentProfile, state, activeTab, todayKey
// and: slugify, hasAnyTerm, escapeHtml, parseLoad, formatLoad,
//      getExerciseVariants, getSelectedVariant, exerciseStateKey, PREP_EXERCISE_META

function selectedExerciseName(exercise) {
  const variants = getExerciseVariants(exercise);
  const selected = getSelectedVariant(exercise);
  if (!selected || variants.length <= 1 || selected.key === variants[0].key) return selected?.displayName || selected?.label || exercise.name;
  if (selected.displayName) return selected.displayName;
  const movementRoot = exercise.name
    .split(/\sou\s/i)[0]
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
  return `${movementRoot} ${selected.label}`;
}

function inferWarmupGroup(exercise) {
  const text = slugify(selectedExerciseName(exercise));
  if (hasAnyTerm(text, ["panturrilha", "calf", "soleo", "gastrocnemio"])) return "panturrilha";
  if (hasAnyTerm(text, ["abdominal", "abdomen", "core", "prancha", "dead-bug", "bird-dog"])) return "abdômen";
  if (hasAnyTerm(text, ["biceps", "rosca", "martelo", "scott", "curl"])) return "bíceps";
  if (hasAnyTerm(text, ["triceps", "pulley", "testa", "frances"])) return "tríceps";
  if (hasAnyTerm(text, ["desenvolvimento", "ombro", "deltoide", "elevacao-lateral", "face-pull", "voador-inverso", "crucifixo-invertido"])) return "ombros";
  if (hasAnyTerm(text, ["supino", "crossover", "crucifixo", "chest-press", "peck-deck", "paralelas"])) return "peito";
  if (hasAnyTerm(text, ["remada", "puxada", "pulldown", "costas", "dorsais", "dorsal"])) return "costas";
  if (hasAnyTerm(text, ["flexora", "posterior", "terra-romeno", "romeno", "stiff"])) return "posterior";
  if (hasAnyTerm(text, ["elevacao-pelvica", "gluteo", "gluteos", "abdutora", "abdutora", "abductor", "coice", "bulgaro", "afundo"])) return "glúteos";
  if (hasAnyTerm(text, ["agachamento", "hack", "leg-press", "extensora", "quadriceps", "smith"])) return "quadríceps";
  return "geral";
}

function inferPrepGroupFromName(name) {
  const text = slugify(name);

  // Condicionamento e mobilidade não possuem um único músculo-alvo.
  if (hasAnyTerm(text, ["corrida", "caminhada", "esteira", "eliptico", "cardio-zona-2"])) {
    return "Quadríceps femoral • glúteo máximo • isquiotibiais • tríceps sural";
  }
  if (hasAnyTerm(text, ["bike", "bicicleta"])) {
    return "Quadríceps femoral • glúteo máximo • tríceps sural";
  }
  if (hasAnyTerm(text, ["mobilidade"])) {
    return "Sem alvo único • musculatura do quadril e do tronco";
  }

  // Tronco.
  if (hasAnyTerm(text, ["prancha-lateral"])) {
    return "Oblíquos • quadrado lombar • glúteo médio";
  }
  if (hasAnyTerm(text, ["prancha", "dead-bug", "bird-dog"])) {
    return "Reto abdominal • transverso do abdome • oblíquos";
  }
  if (hasAnyTerm(text, ["abdominal-infra", "elevacao-de-pernas", "elevacao-de-joelhos", "leg-raise"])) {
    return "Reto abdominal • iliopsoas";
  }
  if (hasAnyTerm(text, ["abdominal", "abdomen", "crunch"])) {
    return "Reto abdominal • oblíquos";
  }

  // Quadril, coxa e perna.
  if (hasAnyTerm(text, ["panturrilha-sentada", "seated-calf"])) {
    return "Sóleo";
  }
  if (hasAnyTerm(text, ["panturrilha", "calf"])) {
    return "Gastrocnêmio medial e lateral • sóleo";
  }
  if (hasAnyTerm(text, ["adutora", "aducao-de-quadril", "hip-adduction"])) {
    return "Adutores do quadril: longo, magno, curto e grácil";
  }
  if (hasAnyTerm(text, ["abdutora", "abducao-de-quadril", "hip-abduction", "abductor"])) {
    return "Glúteo médio • glúteo mínimo";
  }
  if (hasAnyTerm(text, ["elevacao-pelvica", "hip-thrust", "glute-bridge", "ponte-de-gluteos", "coice", "kickback", "gluteo-no-cabo"])) {
    return "Glúteo máximo";
  }
  if (hasAnyTerm(text, ["rdl", "terra-romeno", "romeno", "stiff"])) {
    return "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo • glúteo máximo";
  }
  if (hasAnyTerm(text, ["flexora", "leg-curl", "nordic"])) {
    return "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo";
  }
  if (hasAnyTerm(text, ["extensora", "leg-extension"])) {
    return "Quadríceps femoral: reto femoral e vastos";
  }
  if (hasAnyTerm(text, ["bulgaro", "afundo", "passada", "split-squat", "lunge"])) {
    return "Quadríceps femoral • glúteo máximo • glúteo médio";
  }
  if (hasAnyTerm(text, ["sumo"])) {
    return "Quadríceps femoral • glúteo máximo • adutores do quadril";
  }
  if (hasAnyTerm(text, ["leg-press-com-pes-mais-altos", "leg-press-pes-mais-altos", "leg-press-45-pes-medios-altos"])) {
    return "Glúteo máximo • quadríceps femoral • isquiotibiais";
  }
  if (hasAnyTerm(text, ["leg-press"])) {
    return "Quadríceps femoral • glúteo máximo";
  }
  if (hasAnyTerm(text, ["agachamento", "hack", "goblet", "squat"])) {
    return "Quadríceps femoral • glúteo máximo • adutor magno";
  }

  // Cintura escapular, ombro e peito.
  if (hasAnyTerm(text, ["rotacao-externa", "external-rotation"])) {
    return "Infraespinhal • redondo menor";
  }
  if (hasAnyTerm(text, ["face-pull"])) {
    return "Deltoide posterior • infraespinhal • redondo menor • trapézio médio • romboides";
  }
  if (hasAnyTerm(text, ["crucifixo-inverso", "crucifixo-invertido", "voador-inverso", "reverse-fly", "rear-delt"])) {
    return "Deltoide posterior • trapézio médio • romboides";
  }
  if (hasAnyTerm(text, ["encolhimento", "shrug"])) {
    return "Trapézio superior • elevador da escápula";
  }
  if (hasAnyTerm(text, ["elevacao-lateral", "lateral-raise"])) {
    return "Deltoide lateral • supraespinhal";
  }
  if (hasAnyTerm(text, ["desenvolvimento", "shoulder-press", "overhead-press"])) {
    return "Deltoide anterior e lateral • tríceps braquial";
  }
  if (hasAnyTerm(text, ["supino-inclinado", "incline-chest", "incline-press"])) {
    return "Peitoral maior (porção clavicular) • deltoide anterior";
  }
  if (hasAnyTerm(text, ["crossover-de-cima-para-baixo", "declinado", "decline-press"])) {
    return "Peitoral maior (porção esternocostal)";
  }
  if (hasAnyTerm(text, ["crucifixo", "crossover", "peck-deck", "fly"])) {
    return "Peitoral maior (porções esternocostal e clavicular)";
  }
  if (hasAnyTerm(text, ["supino", "chest-press"])) {
    return "Peitoral maior (porções esternocostal e clavicular) • tríceps braquial";
  }

  // Costas e flexores/extensores do cotovelo.
  if (hasAnyTerm(text, ["pulldown-na-polia", "pullover", "bracos-estendidos", "straight-arm"])) {
    return "Latíssimo do dorso (grande dorsal) • redondo maior";
  }
  if (hasAnyTerm(text, ["puxada", "barra-fixa", "lat-pulldown", "chin-up", "pull-up"])) {
    return "Latíssimo do dorso (grande dorsal) • redondo maior • bíceps braquial";
  }
  if (hasAnyTerm(text, ["remada", "row"])) {
    return "Latíssimo do dorso (grande dorsal) • trapézio médio/inferior • romboides • deltoide posterior";
  }
  if (hasAnyTerm(text, ["rosca-martelo", "hammer-curl", "barra-h"])) {
    return "Braquial • braquiorradial • bíceps braquial";
  }
  if (hasAnyTerm(text, ["rosca", "biceps", "curl", "scott"])) {
    return "Bíceps braquial • braquial";
  }
  if (hasAnyTerm(text, ["triceps-frances", "triceps-testa", "frances", "testa", "overhead-triceps"])) {
    return "Tríceps braquial (ênfase na cabeça longa)";
  }
  if (hasAnyTerm(text, ["triceps", "pulley"])) {
    return "Tríceps braquial (cabeças lateral, medial e longa)";
  }

  return "Corpo inteiro • sem músculo-alvo isolado";
}

window.FitPlanMuscles = Object.freeze({ targetForName: inferPrepGroupFromName });

function inferPrepGroup(exercise) {
  return inferPrepGroupFromName(selectedExerciseName(exercise));
}

function inferPrepKind(exercise) {
  const text = slugify(`${exercise.name} ${exercise.note || ""}`);
  if (hasAnyTerm(text, [
    "extensora", "flexora", "abdutora", "abdutora", "coice", "panturrilha", "calf",
    "rosca", "triceps", "pulley", "elevacao-lateral", "face-pull", "voador",
    "crucifixo", "crossover", "abdominal", "prancha"
  ])) return "isolation";
  if (hasAnyTerm(text, [
    "agachamento", "hack", "leg-press", "terra-romeno", "romeno", "stiff",
    "supino", "chest-press", "remada-curvada", "remada-maquina", "remada-unilateral",
    "remada-articulada", "elevacao-pelvica"
  ])) return "heavy";
  return "moderate";
}

function inferPrepMeta(exercise) {
  return {
    group: inferPrepGroup(exercise),
    warmupGroup: inferWarmupGroup(exercise),
    kind: inferPrepKind(exercise)
  };
}

function getPrepMeta(exercise) {
  const inferred = inferPrepMeta(exercise);
  const stored = PREP_EXERCISE_META[currentProfile]?.[exercise.id];
  return {
    ...inferred,
    ...(stored || {}),
    group: inferred.group,
    warmupGroup: stored?.group || inferred.warmupGroup
  };
}

function getActiveWorkoutExercises() {
  return profiles[currentProfile]?.workouts?.[activeTab]?.exercises || [];
}

function isFirstPrepForGroup(exercise, workoutExercises = getActiveWorkoutExercises()) {
  const meta = getPrepMeta(exercise);
  if (!meta) return false;
  const exerciseIndex = workoutExercises.findIndex((item) => item.id === exercise.id);
  const previousExercises = workoutExercises.slice(0, Math.max(0, exerciseIndex));
  return !previousExercises.some((item) => getPrepMeta(item)?.warmupGroup === meta.warmupGroup);
}

function roundPrepLoad(value) {
  return Math.round(value * 2) / 2;
}

function buildPrepSets(load, kind, isFirstForGroup) {
  if (!isFirstForGroup) {
    if (kind === "isolation") return [];
    return [{ percent: 50, reps: "5 reps" }];
  }

  if (kind === "heavy") {
    if (load >= 80) {
      return [
        { percent: 40, reps: "8 reps" },
        { percent: 60, reps: "5 reps" },
        { percent: 75, reps: "3 reps" },
        { percent: 85, reps: "1–2 reps" }
      ];
    }
    if (load >= 40) {
      return [
        { percent: 50, reps: "8 reps" },
        { percent: 70, reps: "4–5 reps" }
      ];
    }
    return [{ percent: 50, reps: "8–10 reps" }];
  }

  if (kind === "moderate") {
    if (load >= 60) {
      return [
        { percent: 50, reps: "8 reps" },
        { percent: 70, reps: "4 reps" }
      ];
    }
    return [{ percent: 50, reps: "8 reps" }];
  }

  return [{ percent: 50, reps: "10–12 reps" }];
}

function renderPreparatoryPanel(exercise, stateKey, workoutExercises = getActiveWorkoutExercises()) {
  if (exercise.trackWeight === false) return "";
  const meta = getPrepMeta(exercise);
  if (!meta) return "";

  const load = parseLoad(state.weights[stateKey]);
  if (!Number.isFinite(load)) {
    return `
      <details class="prep-panel">
        <summary><span>Preparatórias</span><span class="prep-summary-value">carga pendente</span></summary>
        <p class="prep-empty">Informe a carga válida para calcular as séries de aproximação.</p>
      </details>
    `;
  }

  const isFirstForGroup = isFirstPrepForGroup(exercise, workoutExercises);
  const prepSets = buildPrepSets(load, meta.kind, isFirstForGroup)
    .map((set) => ({ ...set, load: roundPrepLoad(load * (set.percent / 100)) }));
  const summary = prepSets.length ? `${prepSets.length} séries` : "opcional";
  const note = isFirstForGroup
    ? `${meta.group}: aquecimento específico antes das séries válidas.`
    : `${meta.group} já aquecido neste treino; use só se precisar sentir o movimento.`;

  return `
    <details class="prep-panel">
      <summary><span>Preparatórias</span><span class="prep-summary-value">${escapeHtml(summary)}</span></summary>
      <p class="prep-note">${escapeHtml(note)} Não contam como séries de trabalho.</p>
      ${prepSets.length ? `
        <div class="prep-list">
          ${prepSets.map((set) => `
            <div class="prep-row">
              <span>${set.percent}%</span>
              <strong>${formatLoad(set.load)} kg</strong>
              <span>${escapeHtml(set.reps)}</span>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </details>
  `;
}

function updatePreparatoryPanel(article, exercise, stateKey) {
  const currentPanel = article.querySelector(".prep-panel");
  const wasOpen = !!currentPanel?.open;
  const nextHtml = renderPreparatoryPanel(exercise, stateKey);
  if (!nextHtml) {
    currentPanel?.remove();
    return;
  }
  const template = document.createElement("template");
  template.innerHTML = nextHtml.trim();
  const nextPanel = template.content.firstElementChild;
  if (nextPanel && wasOpen) nextPanel.open = true;
  if (currentPanel) {
    currentPanel.replaceWith(nextPanel);
    return;
  }
  const historyLine = article.querySelector(".history-line");
  if (historyLine) historyLine.after(nextPanel);
  else article.querySelector(".weight-row")?.after(nextPanel);
}

function recordExerciseHistory(exercise, variant, weightValue) {
  const load = parseLoad(weightValue);
  if (!Number.isFinite(load)) return;
  const key = exerciseStateKey(exercise, variant);
  state.history = state.history || {};
  const entries = state.history[key] || [];
  const entry = {
    date: todayKey,
    tab: activeTab,
    exerciseId: exercise.id,
    variant: variant.key,
    load
  };
  const todayIndex = entries.findIndex((item) => item.date === todayKey && item.tab === activeTab);
  if (todayIndex >= 0) entries[todayIndex] = entry;
  else entries.push(entry);
  state.history[key] = entries.slice(-16);
}

function renderVariantControls(exercise, variants, selectedVariant) {
  if (variants.length <= 1) return "";
  return `
    <div class="variant-control" role="group" aria-label="Variação do exercício">
      ${variants.map((variant) => `
        <button class="variant-button" type="button" data-variant="${escapeHtml(variant.key)}" aria-pressed="${variant.key === selectedVariant.key}">
          ${escapeHtml(variant.label)}
        </button>
      `).join("")}
    </div>
  `;
}

function getExerciseDoneSummary(exercise, stateKey) {
  return [
    exercise.sets ? `${exercise.sets} séries` : "",
    exercise.reps ? `${exercise.reps} reps` : "",
    state.weights[stateKey] ? `${state.weights[stateKey]} kg` : ""
  ].filter(Boolean).join(" • ") || "Concluído";
}

function updateExerciseCardForVariant(article, exercise) {
  const variants = getExerciseVariants(exercise);
  const selectedVariant = getSelectedVariant(exercise);
  const stateKey = exerciseStateKey(exercise, selectedVariant);
  const displayName = variants.length > 1 ? (selectedVariant.displayName || selectedVariant.label) : exercise.name;
  const isDone = !!state.done[stateKey];
  const doneExpanded = !!state.expandedDone?.[stateKey];
  const historySummary = getHistorySummary(stateKey);

  article.dataset.stateKey = stateKey;
  article.classList.toggle("done", isDone);
  article.classList.toggle("expanded-done", doneExpanded);
  article.title = isDone ? "Toque no card para ver detalhes. Toque no check para desmarcar." : "";
  article.querySelector(".exercise-title").textContent = displayName;
  article.querySelector(".done-summary").textContent = getExerciseDoneSummary(exercise, stateKey);
  article.querySelectorAll(".variant-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.variant === selectedVariant.key));
  });

  const visual = article.querySelector(".exercise-visual");
  if (visual) {
    visual.classList.remove("media-error");
    visual.innerHTML = renderMovementMedia(exercise, selectedVariant);
  }

  const weightInput = article.querySelector(".weight-input");
  const weightLabel = article.querySelector(".weight-label");
  if (weightInput) {
    weightInput.id = `weight-${stateKey}`;
    weightInput.value = state.weights[stateKey] || "";
  }
  if (weightLabel) {
    weightLabel.setAttribute("for", `weight-${stateKey}`);
  }

  let historyLine = article.querySelector(".history-line");
  if (historySummary && weightInput) {
    if (!historyLine) {
      historyLine = document.createElement("p");
      historyLine.className = "history-line";
      article.querySelector(".weight-row")?.after(historyLine);
    }
    historyLine.textContent = historySummary;
  } else if (historyLine) {
    historyLine.remove();
  }
  updatePreparatoryPanel(article, exercise, stateKey);

  const doneButton = article.querySelector(".done-button");
  if (doneButton) {
    doneButton.title = isDone ? "Desmarcar exercício" : "Concluir exercício";
    doneButton.setAttribute("aria-label", `${isDone ? "Desmarcar" : "Concluir"} ${displayName}`);
  }
}

function renderWorkout() {
  const profile = profiles[currentProfile];
  const workout = profile.workouts[activeTab];
  renderTabs();
  workoutEl.innerHTML = "";

  const summary = document.createElement("div");
  summary.className = "day-summary";
  summary.innerHTML = `
    <p class="day-kicker">${workout.total}</p>
    <h2>${workout.title}</h2>
    <details class="warmup-panel">
      <summary>Aquecimento</summary>
      ${workout.warmup ? `<p>${workout.warmup}</p>` : ""}
      <p>${LOAD_WARMUP_TIP}</p>
    </details>
  `;
  workoutEl.appendChild(summary);

  workout.exercises.forEach((exercise) => {
    const variants = getExerciseVariants(exercise);
    const selectedVariant = getSelectedVariant(exercise);
    const stateKey = exerciseStateKey(exercise, selectedVariant);
    const isDone = !!state.done[stateKey];
    const displayName = variants.length > 1 ? (selectedVariant.displayName || selectedVariant.label) : exercise.name;
    const historySummary = getHistorySummary(stateKey);
    const mediaExpanded = !!state.expandedMedia?.[exercise.id];
    const doneExpanded = !!state.expandedDone?.[stateKey];
    const doneSummary = getExerciseDoneSummary(exercise, stateKey);
    const controlsHtml = variants.length > 1 || uiState.compact ? `
      <div class="exercise-controls">
        ${renderVariantControls(exercise, variants, selectedVariant)}
        <button class="media-toggle" type="button">${mediaExpanded ? "Ocultar movimento" : "Ver movimento"}</button>
      </div>
    ` : "";
    const article = document.createElement("article");
    article.className = `exercise${isDone ? " done" : ""}${doneExpanded ? " expanded-done" : ""}${mediaExpanded ? " show-media" : ""}`;
    article.dataset.id = exercise.id;
    article.dataset.stateKey = stateKey;
    article.title = isDone ? "Toque no card para ver detalhes. Toque no check para desmarcar." : "";
    article.innerHTML = `
      <div class="exercise-main">
        <h2 class="exercise-title">${escapeHtml(displayName)}</h2>
        <p class="done-summary">${escapeHtml(doneSummary || "Concluído")}</p>
        <p class="exercise-note">${exercise.note}</p>
        ${controlsHtml}
        <div class="metrics">
          <div>
            <span class="metric-label">Séries</span>
            <div class="metric-value">${exercise.sets}</div>
          </div>
          <div>
            <span class="metric-label">Reps</span>
            <div class="metric-value">${exercise.reps}</div>
          </div>
          <div>
            <span class="metric-label">RIR</span>
            <div class="metric-value">${exercise.rir}</div>
          </div>
          <div>
            <span class="metric-label">Descanso</span>
            <div class="metric-value">${exercise.restLabel}</div>
          </div>
        </div>
        ${exercise.trackWeight === false ? "" : `
          <div class="weight-row">
            <label class="weight-label" for="weight-${stateKey}">Carga (kg)</label>
            <input class="weight-input" id="weight-${stateKey}" inputmode="decimal" autocomplete="off" value="${state.weights[stateKey] || ""}">
          </div>
          ${historySummary ? `<p class="history-line">${historySummary}</p>` : ""}
          ${renderPreparatoryPanel(exercise, stateKey, workout.exercises)}
        `}
      </div>
      <figure class="exercise-visual">
        ${renderMovementMedia(exercise, selectedVariant)}
      </figure>
      <button class="done-button" type="button" title="${isDone ? "Desmarcar exercício" : "Concluir exercício"}" aria-label="${isDone ? "Desmarcar" : "Concluir"} ${displayName}">
        <span class="check-ring" aria-hidden="true"></span>
      </button>
    `;
    article.addEventListener("click", (event) => {
      const currentKey = article.dataset.stateKey || stateKey;
      if (!state.done[currentKey]) return;
      if (event.target.closest("button,input,label,a,summary,details")) return;
      const scrollXBefore = window.scrollX;
      const scrollYBefore = window.scrollY;
      state.expandedDone = state.expandedDone || {};
      state.expandedDone[currentKey] = !state.expandedDone[currentKey];
      article.classList.toggle("expanded-done", state.expandedDone[currentKey]);
      saveProfileState();
      requestAnimationFrame(() => {
        window.scrollTo(scrollXBefore, scrollYBefore);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 0);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 120);
      });
    });
    article.querySelectorAll(".variant-button").forEach((button) => {
      button.addEventListener("click", () => {
        const scrollXBefore = window.scrollX;
        const scrollYBefore = window.scrollY;
        state.variants = state.variants || {};
        state.variants[exercise.id] = button.dataset.variant;
        saveProfileState();
        updateExerciseCardForVariant(article, exercise);
        updateProgress();
        requestAnimationFrame(() => {
          window.scrollTo(scrollXBefore, scrollYBefore);
          setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 0);
          setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 120);
        });
      });
    });
    article.querySelector(".media-toggle")?.addEventListener("click", () => {
      const scrollXBefore = window.scrollX;
      const scrollYBefore = window.scrollY;
      state.expandedMedia = state.expandedMedia || {};
      state.expandedMedia[exercise.id] = !state.expandedMedia[exercise.id];
      saveProfileState();
      renderWorkout();
      requestAnimationFrame(() => {
        window.scrollTo(scrollXBefore, scrollYBefore);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 0);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 120);
      });
    });
    const weightInput = article.querySelector(".weight-input");
    if (weightInput) {
      weightInput.addEventListener("input", (event) => {
        const currentKey = article.dataset.stateKey || stateKey;
        state.weights[currentKey] = event.target.value.trim();
        const doneSummaryEl = article.querySelector(".done-summary");
        if (doneSummaryEl) doneSummaryEl.textContent = getExerciseDoneSummary(exercise, currentKey);
        updatePreparatoryPanel(article, exercise, currentKey);
        saveProfileState();
      });
    }
    const doneButton = article.querySelector(".done-button");
    doneButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const scrollXBefore = window.scrollX;
      const scrollYBefore = window.scrollY;
      const keepScrollPosition = () => requestAnimationFrame(() => {
        window.scrollTo(scrollXBefore, scrollYBefore);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 0);
        setTimeout(() => window.scrollTo(scrollXBefore, scrollYBefore), 120);
      });
      const currentKey = article.dataset.stateKey || stateKey;
      const wasDone = !!state.done[currentKey];
      if (wasDone) {
        delete state.done[currentKey];
        if (state.expandedDone) delete state.expandedDone[currentKey];
        article.classList.remove("done", "expanded-done");
        article.title = "";
        doneButton.title = "Concluir exercício";
        doneButton.setAttribute("aria-label", `Concluir ${displayName}`);
        saveProfileState();
        updateProgress();
        keepScrollPosition();
        return;
      }

      state.done[currentKey] = true;
      if (state.expandedDone) delete state.expandedDone[currentKey];
      article.classList.add("done");
      article.classList.remove("expanded-done");
      article.title = "Toque no card para ver detalhes. Toque no check para desmarcar.";
      doneButton.title = "Desmarcar exercício";
      doneButton.setAttribute("aria-label", `Desmarcar ${displayName}`);
      const doneSummaryEl = article.querySelector(".done-summary");
      if (doneSummaryEl) {
        doneSummaryEl.textContent = getExerciseDoneSummary(exercise, currentKey);
      }
      recordExerciseHistory(exercise, getSelectedVariant(exercise), weightInput?.value);
      const nextHistorySummary = getHistorySummary(currentKey);
      if (nextHistorySummary && weightInput) {
        let historyLine = article.querySelector(".history-line");
        if (!historyLine) {
          historyLine = document.createElement("p");
          historyLine.className = "history-line";
          article.querySelector(".weight-row")?.after(historyLine);
        }
        historyLine.textContent = nextHistorySummary;
      }
      if (exercise.restSeconds > 0) startRest(exercise.restSeconds);
      saveProfileState();
      updateProgress();
      keepScrollPosition();
    });
    workoutEl.appendChild(article);
  });
  updateProgress();
}

function updateProgress() {
  const profile = profiles[currentProfile];
  const exercises = profile.workouts[activeTab].exercises;
  const done = exercises.filter((exercise) => state.done[exerciseStateKey(exercise, getSelectedVariant(exercise))]).length;
  const total = exercises.length;
  progressText.textContent = `${done}/${total}`;
  progressFill.style.setProperty("--progress", `${total ? (done / total) * 100 : 0}%`);
}

