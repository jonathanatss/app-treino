(function () {
  const overlay = document.querySelector("#fitOverlay");
  const routeButtons = [...document.querySelectorAll(".bottom-nav-item")];
  const views = [...document.querySelectorAll(".fit-view")];
  const settingsKey = "gym-app-stitch-settings";
  const photoDbName = "fitplan-progress-media";
  const photoStoreName = "progressPhotos";
  const avatarStoreName = "profileAvatars";
  let photoDbPromise = null;
  const avatarUrlCache = new Map();
  const avatarRequestCache = new Map();
  let currentRoute = "workout";
  let activeExercise = null;
  let activeExerciseIndex = -1;

  const localMediaByUrl = {
    "https://gymvisual.com/img/p/4/8/8/8/4888.gif": "assets/exercises/4888.gif",
    "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-crunch.gif": "assets/exercises/lever-seated-crunch.gif",
    "https://liftmanual.com/wp-content/uploads/2023/04/sled-hack-squat.webp": "assets/exercises/sled-hack-squat.webp",
    "https://gymvisual.com/img/p/1/0/2/8/6/10286.gif": "assets/exercises/10286.gif",
    "https://gymvisual.com/img/p/6/6/1/4/6614.gif": "assets/exercises/6614.gif",
    "https://gymvisual.com/img/p/1/4/4/5/7/14457.gif": "assets/exercises/14457.gif",
    "https://gymvisual.com/img/p/2/9/5/3/9/29539.gif": "assets/exercises/29539.gif",
    "https://gymvisual.com/img/p/3/3/8/5/4/33854.gif": "assets/exercises/33854.gif",
    "https://gymvisual.com/img/p/7/5/5/2/7552.gif": "assets/exercises/7552.gif",
    "https://gymvisual.com/img/p/5/3/5/6/5356.gif": "assets/exercises/5356.gif",
    "https://gymvisual.com/img/p/5/9/2/3/5923.gif": "assets/exercises/5923.gif",
    "https://gymvisual.com/img/p/5/6/0/6/5606.gif": "assets/exercises/5606.gif",
    "https://gymvisual.com/img/p/1/0/4/7/2/10472.gif": "assets/exercises/10472.gif"
  };

  const mediaFallbackByUrl = {
    "https://liftmanual.com/wp-content/uploads/2023/04/lever-seated-leg-curl.webp": `${EXERCISE_MEDIA_BASE}Zg3XY7P.gif`,
    "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-one-arm-bent-over-row.gif": `${EXERCISE_MEDIA_BASE}Fhdtwf3.gif`,
    "https://liftmanual.com/wp-content/uploads/2023/04/smith-hip-raise.webp": `${EXERCISE_MEDIA_BASE}qg2PGl6.gif`,
    "https://liftmanual.com/wp-content/uploads/2023/04/cable-lying-triceps-extension.webp": "assets/exercises/7552.gif"
  };

  const icon = (name) => ({
    workout: "⚒",
    history: "◷",
    progress: "⌁",
    profile: "♙",
    weight: "◉",
    target: "⚒",
    equipment: "⚑",
    data: "⇅",
    measure: "+",
    camera: "▣",
    records: "★"
  }[name] || "•");

  function getSettings() {
    try {
      return { notifications: true, autoRest: true, sound: false, ...JSON.parse(localStorage.getItem(settingsKey)) };
    } catch {
      return { notifications: true, autoRest: true, sound: false };
    }
  }

  function saveSettings(next) {
    localStorage.setItem(settingsKey, JSON.stringify(next));
  }

  function profileName(id) {
    const saved = localStorage.getItem(`gym-app-profile-${id}-display-name`);
    return saved || profiles[id]?.name || id;
  }

  function initialsFor(id) {
    return profileName(id).split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function selectedWorkout() {
    return profiles[currentProfile]?.workouts?.[activeTab] || null;
  }

  function selectedExercises() {
    return selectedWorkout()?.exercises || [];
  }

  function mediaFor(exercise) {
    const variant = getSelectedVariant(exercise);
    const media = variant?.media || EXERCISE_MEDIA[exercise.id];
    if (!media) return null;
    return {
      src: media.url ? (localMediaByUrl[media.url] || media.url) : `${EXERCISE_MEDIA_BASE}${media.id}.gif`,
      fallbackSrc: media.url ? mediaFallbackByUrl[media.url] : null,
      label: media.label || exercise.name
    };
  }

  function getEquipment(exercise) {
    const text = slugify(exercise.name);
    if (text.includes("halter")) return "Halteres";
    if (text.includes("barra")) return "Barra";
    if (text.includes("polia") || text.includes("cabo") || text.includes("pulley")) return "Polia";
    if (text.includes("maquina") || text.includes("hack") || text.includes("leg-press") || text.includes("cadeira")) return "Máquina";
    if (text.includes("smith")) return "Smith";
    if (text.includes("esteira") || text.includes("bike")) return "Cardio";
    return "Equipamento livre";
  }

  function allProfileExercises(profileId = currentProfile) {
    const profile = profiles[profileId];
    if (!profile) return [];
    return Object.entries(profile.workouts).flatMap(([tab, workout]) => workout.exercises.map((exercise) => ({ ...exercise, tab })));
  }

  function exerciseNameByKey(key) {
    const base = String(key).split("::")[0];
    return allProfileExercises().find((exercise) => exercise.id === base)?.name || base;
  }

  function parseSets(exercise) {
    const parsed = parseInt(String(exercise.sets), 10);
    return Number.isFinite(parsed) ? parsed : 1;
  }

  function defaultReps(exercise) {
    const numbers = String(exercise.reps || "10").match(/\d+/g);
    return numbers?.length ? Number(numbers[numbers.length - 1]) : 10;
  }

  function seriesText(value) {
    const count = parseInt(String(value), 10);
    return `${value} ${count === 1 ? "série" : "séries"}`;
  }

  function repsText(value) {
    const text = String(value || "");
    return /min|moderado|falha|cada lado/i.test(text) ? text : `${text} reps`;
  }

  function historyEntries() {
    return Object.entries(state?.history || {}).flatMap(([key, entries]) => entries.map((entry) => ({ ...entry, key, name: exerciseNameByKey(key) })));
  }

  function lastProfileActivity(id) {
    try {
      const stored = JSON.parse(localStorage.getItem(profileStateKey(id)) || "{}");
      if (!stored.day) return "Novo perfil";
      const [y, m, d] = stored.day.split("-");
      return `Última sessão: ${d}/${m}/${y}`;
    } catch {
      return "Toque para entrar";
    }
  }

  function navigate(route) {
    currentRoute = route;
    views.forEach((view) => view.classList.toggle("is-active", view.dataset.view === route));
    routeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.route === route));
    if (route === "history") renderHistoryView();
    if (route === "progress") renderProgressView();
    if (route === "profile") renderProfileView();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showOverlay(html) {
    if (typeof overlay._cleanup === "function") overlay._cleanup();
    overlay._cleanup = null;
    overlay.innerHTML = html;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    overlay.scrollTop = 0;
  }

  function closeOverlay() {
    if (typeof overlay._cleanup === "function") overlay._cleanup();
    overlay._cleanup = null;
    overlay.hidden = true;
    overlay.innerHTML = "";
    document.body.style.overflow = "";
    activeExercise = null;
    activeExerciseIndex = -1;
  }

  function renderProfileCards(query = "") {
    const list = document.querySelector("#profileList");
    if (!list) return;
    const normalized = String(query).trim() ? slugify(query) : "";
    const cards = Object.entries(profiles)
      .filter(([id]) => !normalized || slugify(profileName(id)).includes(normalized))
      .sort(([a], [b]) => profileName(a).localeCompare(profileName(b), "pt-BR"));
    const search = Object.keys(profiles).length > 5
      ? `<input class="profile-search" id="profileSearch" type="search" placeholder="Buscar usuário" value="${escapeHtml(query)}" autocomplete="off" aria-label="Buscar usuário">`
      : "";
    list.innerHTML = search + (cards.length ? cards.map(([id]) => {
      const hasPin = !!localStorage.getItem(profilePinKey(id));
      return `<button class="profile-card" type="button" data-profile="${id}" style="--profile-color:${profiles[id].accent}">
        <span class="profile-avatar" data-avatar-profile="${id}">${initialsFor(id)}</span>
        <span class="profile-info"><span class="profile-name">${escapeHtml(profileName(id))}</span><span class="profile-meta">${hasPin ? escapeHtml(lastProfileActivity(id)) : "Configurar PIN"}</span></span>
      </button>`;
    }).join("") : `<div class="empty-search">Nenhum usuário encontrado.</div>`);
    list.querySelector("#profileSearch")?.addEventListener("input", (event) => {
      const cursor = event.target.selectionStart;
      renderProfileCards(event.target.value);
      const next = document.querySelector("#profileSearch");
      next?.focus();
      next?.setSelectionRange(cursor, cursor);
    });
    list.querySelectorAll(".profile-card").forEach((card) => card.addEventListener("click", () => openPinScreen(card.dataset.profile)));
    hydrateProfileAvatars(list);
  }

  renderProfilePicker = function () {
    document.querySelector("#screen-picker .lock-title").textContent = "Quem está treinando?";
    document.querySelector("#screen-picker .lock-subtitle").textContent = "Selecione seu perfil para acessar seus dados.";
    renderProfileCards();
  };

  const originalRenderPinScreen = renderPinScreen;
  renderPinScreen = function () {
    originalRenderPinScreen();
    const header = document.querySelector("#screen-pin .lock-header");
    header?.setAttribute("data-initials", initialsFor(pinScreenProfile));
    header?.setAttribute("data-avatar-profile", pinScreenProfile);
    hydrateProfileAvatars(header?.parentElement || document);
    document.querySelector("#pinTitle").textContent = profileName(pinScreenProfile);
  };

  function renderTabsStitch() {
    const profile = profiles[currentProfile];
    const tabsShell = document.querySelector("#tabsShell");
    const todayWorkoutKey = getTodayWorkoutKey(profile);
    tabsShell.innerHTML = "";
    profile.tabs.forEach((tab) => {
      const button = document.createElement("button");
      button.className = `tab${tab.key === todayWorkoutKey ? " is-today" : ""}`;
      button.type = "button";
      button.dataset.tab = tab.key;
      button.setAttribute("aria-selected", String(tab.key === activeTab));
      button.innerHTML = `<span class="tab-dot"></span><span class="tab-label">${escapeHtml(tab.label)}</span>`;
      button.addEventListener("click", () => {
        activeTab = tab.key;
        state.activeTab = activeTab;
        saveProfileState();
        renderApp();
      });
      tabsShell.appendChild(button);
    });
  }

  renderApp = function () {
    const profile = profiles[currentProfile];
    const workout = selectedWorkout();
    if (!profile || !workout) return;
    const titleParts = workout.title.split("•").map((part) => part.trim()).filter(Boolean);
    const title = titleParts[1] || titleParts[0] || "Treino";
    document.querySelector("#topAvatar").textContent = initialsFor(currentProfile);
    document.querySelector("#profileSwitcher").dataset.avatarProfile = currentProfile;
    hydrateProfileAvatars(document.querySelector(".fit-topbar"));
    document.querySelector("#appTitle").textContent = title;
    document.querySelector("#profileIndicator").textContent = `Perfil: ${profileName(currentProfile)}`;
    document.querySelector("#appSubtitle").textContent = workout.total || profile.subtitle;
    document.querySelector("#todayLabel").textContent = `${profile.tabs.find((tab) => tab.key === activeTab)?.label || "TREINO"}`.toUpperCase();
    document.querySelector("#heroExerciseCount").textContent = selectedExercises().length;
    renderTabsStitch();
    renderWorkout();
    renderHistoryView();
    renderProgressView();
    renderProfileView();
    navigate(currentRoute);
  };

  renderWorkout = function () {
    const workout = selectedWorkout();
    if (!workout) return;
    workoutEl.innerHTML = "";
    const exercises = workout.exercises;
    const firstPending = exercises.findIndex((exercise) => !state.done[exerciseStateKey(exercise, getSelectedVariant(exercise))]);

    exercises.forEach((exercise, index) => {
      const variant = getSelectedVariant(exercise);
      const variants = getExerciseVariants(exercise);
      const stateKey = exerciseStateKey(exercise, variant);
      const done = !!state.done[stateKey];
      const displayName = variants.length > 1 ? (variant.displayName || variant.label) : exercise.name;
      const weight = state.weights[stateKey];
      const article = document.createElement("article");
      article.className = `exercise${done ? " done" : ""}${index === firstPending ? " is-current" : ""}`;
      article.dataset.id = exercise.id;
      article.innerHTML = `
        ${index === firstPending && !done ? `<button class="exercise-play" type="button" aria-label="Iniciar ${escapeHtml(displayName)}">▶</button>` : `<span class="exercise-number">${done ? "✓" : index + 1}</span>`}
        <div class="exercise-main">
          <h2 class="exercise-title">${escapeHtml(displayName)}</h2>
          <div class="compact-meta"><strong>${seriesText(exercise.sets)}</strong><span>•</span><span>${escapeHtml(repsText(exercise.reps))}</span>${weight ? `<span>•</span><span>${escapeHtml(weight)} kg</span>` : ""}</div>
        </div>
        <button class="exercise-menu" type="button" aria-label="Detalhes de ${escapeHtml(displayName)}">⋮</button>`;
      article.addEventListener("click", (event) => {
        if (event.target.closest(".exercise-play")) openActiveExercise(exercise, index);
        else openExerciseDetail(exercise, index);
      });
      workoutEl.appendChild(article);
    });
    updateProgress();
  };

  updateProgress = function () {
    const exercises = selectedExercises();
    const done = exercises.filter((exercise) => state.done[exerciseStateKey(exercise, getSelectedVariant(exercise))]).length;
    const total = exercises.length;
    progressText.textContent = `${done}/${total}`;
    progressFill.style.setProperty("--progress", `${total ? (done / total) * 100 : 0}%`);
    document.querySelector("#heroExerciseCount").textContent = total;
  };

  function variantButtons(exercise) {
    const variants = getExerciseVariants(exercise);
    if (variants.length <= 1) return "";
    const selected = getSelectedVariant(exercise);
    return `<div class="active-tags" aria-label="Escolha a variação">${variants.map((variant) => `<button class="pill-button variant-choice" type="button" data-variant="${escapeHtml(variant.key)}" style="${variant.key === selected.key ? "outline:2px solid var(--fit-lime);color:var(--fit-lime)" : ""}">${escapeHtml(variant.label)}</button>`).join("")}</div>`;
  }

  function openExerciseDetail(exercise, index) {
    const variant = getSelectedVariant(exercise);
    const stateKey = exerciseStateKey(exercise, variant);
    const media = mediaFor(exercise);
    const prep = getPrepMeta(exercise);
    const history = getHistoryEntries(stateKey).filter((entry) => Number.isFinite(entry.load));
    const last = history.at(-1)?.load;
    showOverlay(`<div class="overlay-page detail-page">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Voltar">←</button><h2>${escapeHtml(variant.displayName || variant.label || exercise.name)}</h2><button class="overlay-more" type="button" aria-label="Mais opções">⋮</button></header>
      <div class="exercise-media">${media ? `<img class="detail-media-image" src="${media.src}" alt="Demonstração de ${escapeHtml(exercise.name)}" referrerpolicy="no-referrer" decoding="async">` : `<div class="exercise-media-empty">Demonstração não disponível</div>`}<button class="play-fab" type="button" aria-label="Iniciar exercício">▶</button></div>
      ${variantButtons(exercise)}
      <div class="detail-metrics"><div class="detail-metric"><small>${icon("target")} MÚSCULO-ALVO</small><strong>${escapeHtml(prep.group)}</strong></div><div class="detail-metric"><small>${icon("equipment")} EQUIPAMENTO</small><strong>${escapeHtml(getEquipment(exercise))}</strong></div></div>
      <section class="guide-card"><h3><span style="color:var(--fit-lime)">▤</span> Guia de execução</h3><ol class="guide-list"><li>Prepare o equipamento e adote uma posição estável antes de iniciar.</li><li>${escapeHtml(exercise.note || "Controle a fase de descida e mantenha a amplitude confortável.")}</li><li>Finalize cada repetição sem perder a técnica e respeite o RIR indicado: ${escapeHtml(exercise.rir)}.</li></ol></section>
      <div class="history-strip"><div><small>ÚLTIMA CARGA</small><strong>${Number.isFinite(last) ? `${formatLoad(last)} kg` : "Sem registro"}</strong></div><button class="text-button detail-history" type="button">Histórico</button></div>
      <button class="primary-button detail-start" type="button">▶ &nbsp; INICIAR EXERCÍCIO</button>
    </div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    const detailImage = overlay.querySelector(".detail-media-image");
    if (detailImage) {
      detailImage.addEventListener("error", () => {
        if (media?.fallbackSrc && detailImage.dataset.fallback !== "true") {
          detailImage.dataset.fallback = "true";
          detailImage.src = media.fallbackSrc;
          return;
        }
        detailImage.replaceWith(Object.assign(document.createElement("div"), { className: "exercise-media-empty", textContent: "Demonstração temporariamente indisponível" }));
      });
    }
    overlay.querySelector(".play-fab").addEventListener("click", () => openActiveExercise(exercise, index));
    overlay.querySelector(".detail-start").addEventListener("click", () => openActiveExercise(exercise, index));
    overlay.querySelector(".detail-history").addEventListener("click", () => { closeOverlay(); navigate("history"); });
    overlay.querySelectorAll(".variant-choice").forEach((button) => button.addEventListener("click", () => {
      state.variants = state.variants || {};
      state.variants[exercise.id] = button.dataset.variant;
      saveProfileState();
      openExerciseDetail(exercise, index);
    }));
  }

  function activeSeriesFor(key) {
    state.seriesProgress = state.seriesProgress || {};
    return state.seriesProgress[key] || [];
  }

  function openActiveExercise(exercise, index) {
    activeExercise = exercise;
    activeExerciseIndex = index;
    const variant = getSelectedVariant(exercise);
    const key = exerciseStateKey(exercise, variant);
    const series = activeSeriesFor(key);
    const totalSets = parseSets(exercise);
    const load = parseLoad(state.weights[key]) || 0;
    const reps = defaultReps(exercise);
    showOverlay(`<div class="overlay-page active-page">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Fechar">×</button><h2 style="color:var(--fit-lime)">FitPlan</h2><span></span></header>
      <span class="set-chip">Série ${Math.min(series.length + 1, totalSets)} de ${totalSets}</span>
      <h1 class="active-title">${escapeHtml(variant.displayName || variant.label || exercise.name)}</h1>
      <div class="active-tags"><span>${escapeHtml(getPrepMeta(exercise).group)}</span><span>${escapeHtml(getEquipment(exercise))}</span></div>
      <div class="stepper-card load-card"><small>CARGA (KG)</small><div class="stepper"><button type="button" data-adjust="load:-1" aria-label="Diminuir carga">−</button><input id="activeLoad" type="number" inputmode="decimal" min="0" step="0.5" value="${load}" aria-label="Carga em quilogramas"><button type="button" data-adjust="load:1" aria-label="Aumentar carga">+</button></div><div class="quick-adjust" aria-label="Ajustes rápidos de carga"><button type="button" data-quick-load="-10">−10</button><button type="button" data-quick-load="2.5">+2,5</button><button type="button" data-quick-load="5">+5</button><button type="button" data-quick-load="10">+10</button></div></div>
      <div class="stepper-card"><small>REPS</small><div class="stepper"><button type="button" data-adjust="reps:-1" aria-label="Diminuir repetições">−</button><input id="activeReps" type="number" inputmode="numeric" min="0" step="1" value="${reps}" aria-label="Número de repetições"><button type="button" data-adjust="reps:1" aria-label="Aumentar repetições">+</button></div></div>
      <button class="primary-button complete-set" type="button">Concluir série &nbsp; ✓</button>
      <section class="sets-history"><h3>Histórico de séries</h3><div id="activeSetRows">${renderSetRows(series)}</div></section>
    </div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", () => { closeOverlay(); renderWorkout(); });
    overlay.querySelectorAll("[data-adjust]").forEach((button) => button.addEventListener("click", () => {
      const [field, deltaText] = button.dataset.adjust.split(":");
      const output = overlay.querySelector(field === "load" ? "#activeLoad" : "#activeReps");
      const step = field === "load" ? 2.5 : 1;
      output.value = String(Math.max(0, Number(output.value || 0) + Number(deltaText) * step));
    }));
    overlay.querySelectorAll("[data-quick-load]").forEach((button) => button.addEventListener("click", () => {
      const input = overlay.querySelector("#activeLoad");
      input.value = String(Math.max(0, Number(input.value || 0) + Number(button.dataset.quickLoad)));
      input.focus({ preventScroll: true });
    }));
    overlay.querySelector(".complete-set").addEventListener("click", completeActiveSet);
  }

  function renderSetRows(series) {
    if (!series.length) return `<div class="set-row" style="color:var(--fit-muted)">Nenhuma série concluída</div>`;
    return series.map((set, index) => `<div class="set-row"><span class="set-index">${index + 1}</span><strong class="set-ok">✓ &nbsp; ${set.load} kg</strong><span>× &nbsp; ${set.reps}</span></div>`).join("");
  }

  function completeActiveSet() {
    if (!activeExercise) return;
    const exercise = activeExercise;
    const variant = getSelectedVariant(exercise);
    const key = exerciseStateKey(exercise, variant);
    const series = activeSeriesFor(key);
    const load = Number(overlay.querySelector("#activeLoad").value || overlay.querySelector("#activeLoad").textContent) || 0;
    const reps = Number(overlay.querySelector("#activeReps").value || overlay.querySelector("#activeReps").textContent) || 0;
    series.push({ load, reps, completedAt: new Date().toISOString() });
    state.seriesProgress[key] = series;
    state.weights[key] = String(load);
    const totalSets = parseSets(exercise);
    const isFinished = series.length >= totalSets;
    if (isFinished) {
      state.done[key] = true;
      recordExerciseHistory(exercise, variant, load);
    }
    saveProfileState();
    if (getSettings().autoRest && exercise.restSeconds > 0 && !isFinished) startRest(exercise.restSeconds);
    if (isFinished) {
      const allDone = selectedExercises().every((item) => state.done[exerciseStateKey(item, getSelectedVariant(item))]);
      closeOverlay();
      renderWorkout();
      if (allDone) showWorkoutSummary();
      return;
    }
    openActiveExercise(exercise, activeExerciseIndex);
  }

  function showWorkoutSummary() {
    const exercises = selectedExercises();
    const totalSets = exercises.reduce((sum, exercise) => sum + parseSets(exercise), 0);
    const volume = exercises.reduce((sum, exercise) => {
      const key = exerciseStateKey(exercise, getSelectedVariant(exercise));
      return sum + (state.seriesProgress?.[key] || []).reduce((setSum, set) => setSum + (set.load * set.reps), 0);
    }, 0);
    state.sessions = state.sessions || [];
    if (!state.sessions.some((item) => item.date === todayKey && item.tab === activeTab)) {
      state.sessions.push({ date: todayKey, tab: activeTab, title: selectedWorkout().title, exercises: exercises.length, sets: totalSets, volume, completedAt: new Date().toISOString() });
      saveProfileState();
    }
    showOverlay(`<div class="overlay-page summary-page"><div class="summary-check">✓</div><h2>Treino concluído!</h2><p>Treino finalizado com sucesso</p><div class="summary-metrics"><div class="summary-metric"><small>◷</small><strong>${Math.max(1, Math.round(totalSets * 1.8))}</strong><small>min<br>Tempo estimado</small></div><div class="summary-metric"><small>⚒</small><strong>${(volume / 1000).toFixed(1)}</strong><small>ton<br>Volume total</small></div></div><div class="summary-line"><span>Exercícios concluídos</span><strong>${exercises.length}/${exercises.length}</strong></div><div class="summary-line"><span>Séries totais</span><strong>${totalSets}</strong></div><button class="primary-button summary-home" type="button">⌂ &nbsp; Voltar ao início</button></div>`);
    overlay.querySelector(".summary-home").addEventListener("click", () => { closeOverlay(); navigate("workout"); });
  }

  function sessionData() {
    const stored = state?.sessions || [];
    if (stored.length) return [...stored].reverse();
    const byDay = new Map();
    historyEntries().forEach((entry) => {
      const key = `${entry.date}|${entry.tab}`;
      if (!byDay.has(key)) byDay.set(key, { date: entry.date, tab: entry.tab, title: profiles[currentProfile].workouts[entry.tab]?.title || "Treino", exercises: 0, volume: 0 });
      const item = byDay.get(key);
      item.exercises += 1;
      item.volume += entry.load || 0;
    });
    return [...byDay.values()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function prettyDate(value) {
    if (!value) return "Hoje";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }

  function renderHistoryView() {
    const view = document.querySelector("#view-history");
    if (!view || !state) return;
    const sessions = sessionData();
    const monthKey = todayKey.slice(0, 7);
    const monthSessions = sessions.filter((session) => session.date?.startsWith(monthKey));
    const volume = monthSessions.reduce((sum, session) => sum + (session.volume || 0), 0);
    view.innerHTML = `<div class="screen-heading"><h2>Histórico de Treinos</h2></div><div class="metric-grid"><article class="stat-card"><small>TREINOS NO MÊS</small><strong>${monthSessions.length}</strong></article><article class="stat-card"><small>VOLUME TOTAL</small><strong class="neutral">${(volume / 1000).toFixed(1)}<small style="display:inline"> t</small></strong></article><article class="stat-card wide-card"><small>SEQUÊNCIA ATUAL</small><strong>${Math.min(sessions.length, 7)}<small style="display:inline"> dias</small></strong><div class="streak-bars">${Array.from({length:7},(_,i)=>`<i class="${i < Math.min(sessions.length,7) ? "on" : ""}"></i>`).join("")}</div></article></div><div class="section-title"><h3>Últimos treinos</h3></div><div class="session-list">${sessions.length ? sessions.slice(0, 12).map((session) => `<article class="session-card"><span class="session-icon">${icon("workout")}</span><div><h4>${escapeHtml(session.title.replace(/^[^•]+•\s*/, ""))}</h4><p>◷ ${prettyDate(session.date)} &nbsp; • &nbsp; ${session.exercises || 0} exercícios</p></div><span class="status-chip">✓ Concluído</span></article>`).join("") : `<article class="content-card" style="padding:24px;color:var(--fit-muted)">Seus treinos concluídos aparecerão aqui.</article>`}</div>`;
  }

  function personalRecords() {
    const best = new Map();
    historyEntries().forEach((entry) => {
      if (!Number.isFinite(entry.load)) return;
      const current = best.get(entry.key);
      if (!current || entry.load > current.load) best.set(entry.key, entry);
    });
    return [...best.values()].sort((a, b) => b.load - a.load);
  }

  function measurementData() {
    try { return JSON.parse(localStorage.getItem(`gym-app-profile-${currentProfile}-measurements`) || "[]"); }
    catch { return []; }
  }

  function resetWeightHistory(button) {
    if (button?.dataset.confirm !== "true") {
      button.dataset.confirm = "true";
      button.classList.add("is-confirm");
      button.innerHTML = "✓ <span>Confirmar limpeza</span>";
      button.setAttribute("aria-label", "Confirmar limpeza do histórico de peso");
      window.setTimeout(() => {
        if (!button.isConnected || button.dataset.confirm !== "true") return;
        button.dataset.confirm = "false";
        button.classList.remove("is-confirm");
        button.innerHTML = "↺ <span>Limpar gráfico</span>";
        button.setAttribute("aria-label", "Limpar histórico de peso");
      }, 6000);
      return;
    }
    const fields = ["fat", "arms", "chest", "waist", "thighs"];
    const cleaned = measurementData()
      .map(({ weight, ...entry }) => entry)
      .filter((entry) => fields.some((field) => String(entry[field] || "").trim()));
    const key = `gym-app-profile-${currentProfile}-measurements`;
    if (cleaned.length) localStorage.setItem(key, JSON.stringify(cleaned));
    else localStorage.removeItem(key);
    renderProgressView();
  }

  function buildWeightChart(entries) {
    if (!entries.length) {
      return `<div class="chart-empty"><span>⌁</span><strong>Sem medidas registradas</strong><p>Registre seu peso para visualizar a evolução.</p></div>`;
    }
    const width = 640;
    const height = 250;
    const pad = { top: 20, right: 22, bottom: 42, left: 52 };
    const values = entries.map((entry) => Number(entry.weight));
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const rangePad = Math.max(1, (rawMax - rawMin) * 0.2);
    const min = Math.floor((rawMin - rangePad) * 2) / 2;
    const max = Math.ceil((rawMax + rangePad) * 2) / 2;
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xAt = (index) => entries.length === 1 ? pad.left + plotWidth / 2 : pad.left + (index / (entries.length - 1)) * plotWidth;
    const yAt = (value) => pad.top + ((max - value) / (max - min || 1)) * plotHeight;
    const points = values.map((value, index) => `${xAt(index).toFixed(1)},${yAt(value).toFixed(1)}`);
    const ticks = Array.from({ length: 5 }, (_, index) => max - (index / 4) * (max - min));
    const grid = ticks.map((tick) => {
      const y = yAt(tick).toFixed(1);
      return `<line class="chart-grid-line" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line><text class="chart-axis-label" x="${pad.left - 10}" y="${Number(y) + 4}" text-anchor="end">${tick.toFixed(1)}</text>`;
    }).join("");
    const labels = entries.map((entry, index) => {
      if (entries.length > 5 && index % 2 !== 0 && index !== entries.length - 1) return "";
      const parts = String(entry.date || "").split("-");
      const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : `${index + 1}`;
      return `<text class="chart-axis-label chart-x-label" x="${xAt(index).toFixed(1)}" y="${height - 14}" text-anchor="middle">${label}</text>`;
    }).join("");
    const dots = values.map((value, index) => `<circle class="chart-dot" cx="${xAt(index).toFixed(1)}" cy="${yAt(value).toFixed(1)}" r="5"><title>${value.toFixed(1)} kg</title></circle>`).join("");
    const linePath = points.map((point, index) => `${index ? "L" : "M"} ${point}`).join(" ");
    const area = `${linePath} L ${xAt(entries.length - 1).toFixed(1)},${height - pad.bottom} L ${xAt(0).toFixed(1)},${height - pad.bottom} Z`;
    return `<div class="chart-wrap"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Evolução do peso corporal"><defs><linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--fit-lime)" stop-opacity=".24"></stop><stop offset="100%" stop-color="var(--fit-lime)" stop-opacity="0"></stop></linearGradient></defs>${grid}<path class="chart-area" d="${area}"></path><polyline class="chart-line" points="${points.join(" ")}"></polyline>${dots}${labels}</svg></div>`;
  }

  function renderProgressView() {
    const view = document.querySelector("#view-progress");
    if (!view || !state) return;
    const records = personalRecords();
    const measurements = measurementData();
    const weights = measurements.map((item) => Number(item.weight)).filter(Number.isFinite);
    const lastWeight = weights.at(-1);
    const chartMeasurements = measurements.filter((item) => Number.isFinite(Number(item.weight))).slice(-8);
    const chartMarkup = buildWeightChart(chartMeasurements);
    const delta = weights.length > 1 ? weights.at(-1) - weights.at(-2) : null;
    view.innerHTML = `<div class="screen-heading"><h2>Análise de Progresso</h2><p>Acompanhe sua evolução e supere seus limites.</p></div><article class="content-card chart-card"><div class="chart-head"><div><h3>${icon("weight")} Peso corporal</h3><strong class="chart-current ${Number.isFinite(lastWeight) ? "" : "is-empty"}">${Number.isFinite(lastWeight) ? `${lastWeight.toFixed(1)}<small> kg</small>` : "Sem registro atual"}</strong>${Number.isFinite(delta) ? `<p class="chart-delta ${delta <= 0 ? "is-positive" : ""}">${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg desde o último registro</p>` : ""}</div>${weights.length ? `<button class="chart-reset" type="button" aria-label="Limpar histórico de peso">↺ <span>Limpar gráfico</span></button>` : ""}</div>${chartMarkup}</article><div class="section-title"><h3>Recordes pessoais</h3><button class="text-button all-records" type="button">VER TODOS</button></div><div class="record-list">${records.length ? records.slice(0, 3).map((record) => `<article class="record-card"><span class="record-icon">${icon("records")}</span><div><h4>${escapeHtml(record.name)}</h4><p>MELHOR CARGA REGISTRADA</p></div><div class="record-load">${formatLoad(record.load)} <small>kg</small></div></article>`).join("") : `<article class="content-card" style="padding:22px;color:var(--fit-muted)">Registre cargas para formar seus recordes.</article>`}</div><div class="pill-actions"><button class="pill-button add-measure" type="button">+ &nbsp; Registrar medidas</button><button class="pill-button add-photo" type="button">▣ &nbsp; Fotos de evolução</button></div>`;
    view.querySelector(".add-measure")?.addEventListener("click", openMeasurements);
    view.querySelector(".add-photo")?.addEventListener("click", openPhotoProgress);
    view.querySelector(".all-records")?.addEventListener("click", openRecords);
    view.querySelector(".chart-reset")?.addEventListener("click", (event) => resetWeightHistory(event.currentTarget));
  }

  function renderProfileView() {
    const view = document.querySelector("#view-profile");
    if (!view || !currentProfile) return;
    const settings = getSettings();
    view.innerHTML = `<div class="profile-layout"><section class="profile-hero"><div class="profile-hero-avatar" data-avatar-profile="${currentProfile}">${initialsFor(currentProfile)}</div><h2>${escapeHtml(profileName(currentProfile))}</h2><p>${escapeHtml(profiles[currentProfile].subtitle)}</p><button class="pill-button edit-profile" type="button">Editar perfil</button></section><section><p class="settings-label">GERAL</p><div class="settings-group"><button class="settings-row toggle-setting" type="button" data-setting="notifications"><span class="row-icon">♢</span><span>Notificações</span><span class="toggle ${settings.notifications ? "on" : ""}"></span></button><button class="settings-row" type="button" data-action="switch"><span class="row-icon">♙</span><span>Trocar usuário<small>Selecionar outro perfil</small></span><span class="chevron">›</span></button></div><p class="settings-label">TREINO</p><div class="settings-group"><button class="settings-row toggle-setting" type="button" data-setting="autoRest"><span class="row-icon">◷</span><span>Cronômetro automático<small>Inicia após cada série</small></span><span class="toggle ${settings.autoRest ? "on" : ""}"></span></button><button class="settings-row toggle-setting" type="button" data-setting="sound"><span class="row-icon">◖</span><span>Efeitos sonoros</span><span class="toggle ${settings.sound ? "on" : ""}"></span></button><button class="settings-row" type="button" data-action="reset"><span class="row-icon">↺</span><span>Limpar treino do dia</span><span class="chevron">›</span></button></div><p class="settings-label">DADOS</p><div class="settings-group"><button class="settings-row" type="button" data-action="data"><span class="row-icon">⇅</span><span>Importar e exportar<small>Backup dos seus dados</small></span><span class="chevron">›</span></button><button class="settings-row" type="button" data-action="logout"><span class="row-icon">←</span><span>Sair do perfil</span><span class="chevron">›</span></button></div></section></div>`;
    hydrateProfileAvatars(view);
    view.querySelectorAll(".toggle-setting").forEach((button) => button.addEventListener("click", () => {
      const next = getSettings();
      next[button.dataset.setting] = !next[button.dataset.setting];
      saveSettings(next);
      renderProfileView();
    }));
    view.querySelector("[data-action='switch']")?.addEventListener("click", openUserSwitcher);
    view.querySelector("[data-action='data']")?.addEventListener("click", openDataManagement);
    view.querySelector("[data-action='reset']")?.addEventListener("click", () => document.querySelector("#resetDay").click());
    view.querySelector("[data-action='logout']")?.addEventListener("click", logout);
    view.querySelector(".edit-profile")?.addEventListener("click", openEditProfile);
  }

  function openUserSwitcher() {
    const sheet = document.createElement("div");
    sheet.className = "sheet-backdrop";
    sheet.innerHTML = `<div class="bottom-sheet"><div class="sheet-handle"></div><div class="sheet-header"><h2>Trocar usuário</h2><button class="sheet-close" type="button">×</button></div><div class="switch-list">${Object.keys(profiles).sort((a,b)=>profileName(a).localeCompare(profileName(b),"pt-BR")).map((id)=>`<button class="switch-user ${id === currentProfile ? "is-current" : ""}" type="button" data-profile="${id}"><span class="switch-avatar" data-avatar-profile="${id}">${initialsFor(id)}</span><span><strong>${escapeHtml(profileName(id))}</strong><small>${id === currentProfile ? "Sessão atual" : lastProfileActivity(id)}</small></span><span class="current-check">${id === currentProfile ? "✓" : ""}</span></button>`).join("")}</div><button class="secondary-button sheet-cancel" type="button" style="margin-top:24px">Cancelar</button></div>`;
    document.body.appendChild(sheet);
    hydrateProfileAvatars(sheet);
    const close = () => sheet.remove();
    sheet.querySelector(".sheet-close").addEventListener("click", close);
    sheet.querySelector(".sheet-cancel").addEventListener("click", close);
    sheet.addEventListener("click", (event) => { if (event.target === sheet) close(); });
    sheet.querySelectorAll(".switch-user").forEach((button) => button.addEventListener("click", () => {
      close();
      if (button.dataset.profile === currentProfile) return;
      saveProfileState();
      stopRest();
      localStorage.removeItem(ACTIVE_KEY);
      currentProfile = null;
      state = null;
      activeTab = null;
      openPinScreen(button.dataset.profile);
    }));
  }

  function openDataManagement() {
    showOverlay(`<div class="overlay-page"><header class="overlay-header"><button class="overlay-close" type="button">←</button><h2>FitPlan</h2><span></span></header><div class="screen-heading"><h2>Gerenciamento de dados</h2><p>Faça backup do seu progresso ou restaure os dados de outro aparelho.</p></div><section class="guide-card"><h3>⇩ &nbsp; Exportar backup</h3><p>Gere um arquivo JSON seguro contendo treinos, histórico, cargas e preferências.</p><button class="primary-button export-now" type="button" style="margin-top:24px">⇩ &nbsp; Gerar arquivo de backup</button></section><section class="guide-card"><h3>⇧ &nbsp; Importar dados</h3><p>Restaure os dados de um backup FitPlan gerado anteriormente.</p><div class="warning-card" style="margin:18px 0">A importação substitui os dados locais atuais. Esta ação não pode ser desfeita.</div><button class="secondary-button import-now" type="button">Selecionar arquivo</button></section></div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    overlay.querySelector(".export-now").addEventListener("click", exportData);
    overlay.querySelector(".import-now").addEventListener("click", () => document.querySelector("#importData").click());
  }

  function openEditProfile() {
    const profileAtOpen = currentProfile;
    let selectedAvatar = null;
    let previewUrl = null;
    let removeAvatar = false;
    showOverlay(`<div class="overlay-page edit-profile-page"><header class="overlay-header"><button class="overlay-close" type="button">←</button><h2>Editar perfil</h2><span></span></header>
      <div class="edit-avatar-section">
        <div class="profile-hero-avatar edit-avatar-preview" data-avatar-profile="${profileAtOpen}">${initialsFor(profileAtOpen)}</div>
        <div><h3>Foto do perfil</h3><p>Use uma imagem nítida; ela será recortada em formato quadrado.</p></div>
        <input id="profilePhoto" type="file" accept="image/*" hidden>
        <input id="profileCamera" type="file" accept="image/*" capture="user" hidden>
        <div class="edit-avatar-actions"><button class="secondary-button choose-avatar" type="button">▣ &nbsp; Escolher foto</button><button class="secondary-button take-avatar" type="button">◎ &nbsp; Usar câmera</button><button class="avatar-remove" type="button">Remover foto</button></div>
      </div>
      <div class="form-card"><div class="field"><label for="editName">NOME</label><input id="editName" value="${escapeHtml(profileName(profileAtOpen))}"></div><p class="profile-edit-status" role="status" aria-live="polite"></p><button class="primary-button save-profile" type="button">Salvar alterações</button></div>
    </div>`);
    hydrateProfileAvatars(overlay);
    const preview = overlay.querySelector(".edit-avatar-preview");
    const photoInput = overlay.querySelector("#profilePhoto");
    const cameraInput = overlay.querySelector("#profileCamera");
    const status = overlay.querySelector(".profile-edit-status");
    const removeButton = overlay.querySelector(".avatar-remove");
    const releasePreview = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    };
    overlay._cleanup = releasePreview;
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    overlay.querySelector(".choose-avatar").addEventListener("click", () => photoInput.click());
    overlay.querySelector(".take-avatar").addEventListener("click", () => cameraInput.click());
    const useAvatar = (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        status.textContent = "Selecione um arquivo de imagem.";
        status.className = "profile-edit-status is-error";
        return;
      }
      releasePreview();
      selectedAvatar = file;
      removeAvatar = false;
      previewUrl = URL.createObjectURL(file);
      preview.classList.add("has-profile-photo");
      preview.style.setProperty("--avatar-image", `url(\"${previewUrl}\")`);
      removeButton.textContent = "Remover foto";
      removeButton.classList.remove("is-pending");
      status.textContent = "Nova foto pronta para salvar.";
      status.className = "profile-edit-status";
    };
    photoInput.addEventListener("change", () => useAvatar(photoInput.files?.[0]));
    cameraInput.addEventListener("change", () => useAvatar(cameraInput.files?.[0]));
    removeButton.addEventListener("click", () => {
      selectedAvatar = null;
      removeAvatar = true;
      releasePreview();
      preview.classList.remove("has-profile-photo");
      preview.style.removeProperty("--avatar-image");
      removeButton.textContent = "Foto será removida";
      removeButton.classList.add("is-pending");
      status.textContent = "Clique em “Salvar alterações” para confirmar a remoção.";
      status.className = "profile-edit-status";
    });
    overlay.querySelector(".save-profile").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const value = overlay.querySelector("#editName").value.trim();
      button.disabled = true;
      button.textContent = "Salvando…";
      try {
        if (value) localStorage.setItem(`gym-app-profile-${profileAtOpen}-display-name`, value);
        if (selectedAvatar) {
          const blob = await optimizeProfileAvatar(selectedAvatar);
          await saveProfileAvatar({ profile: profileAtOpen, blob, updatedAt: new Date().toISOString(), originalName: selectedAvatar.name || "foto-perfil" });
          clearAvatarCache(profileAtOpen);
        } else if (removeAvatar) {
          await removeProfileAvatar(profileAtOpen);
          clearAvatarCache(profileAtOpen);
        }
        closeOverlay();
        renderApp();
      } catch (error) {
        button.disabled = false;
        button.textContent = "Salvar alterações";
        status.textContent = error.name === "QuotaExceededError" ? "Não há espaço suficiente para salvar esta foto." : error.message;
        status.className = "profile-edit-status is-error";
      }
    });
  }

  function openMeasurements() {
    const latest = measurementData().at(-1) || {};
    showOverlay(`<div class="overlay-page"><header class="overlay-header"><button class="overlay-close" type="button">←</button><h2>FitPlan</h2><span></span></header><div class="screen-heading"><h2>Medidas corporais</h2><p>Registre suas métricas mais recentes para acompanhar o progresso.</p></div><div class="form-card"><div class="field"><label>PESO CORPORAL (KG)</label><input inputmode="decimal" id="measureWeight" placeholder="0,0" value="${latest.weight || ""}"></div><div class="field"><label>GORDURA CORPORAL (%)</label><input inputmode="decimal" id="measureFat" placeholder="0,0" value="${latest.fat || ""}"></div><div class="field"><label>BRAÇOS — MÉDIA (CM)</label><input inputmode="decimal" id="measureArms" placeholder="0" value="${latest.arms || ""}"></div><div class="field"><label>PEITO (CM)</label><input inputmode="decimal" id="measureChest" placeholder="0" value="${latest.chest || ""}"></div><div class="field"><label>CINTURA (CM)</label><input inputmode="decimal" id="measureWaist" placeholder="0" value="${latest.waist || ""}"></div><div class="field"><label>COXAS — MÉDIA (CM)</label><input inputmode="decimal" id="measureThighs" placeholder="0" value="${latest.thighs || ""}"></div><button class="primary-button save-measures" type="button">Salvar medidas</button></div></div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    overlay.querySelector(".save-measures").addEventListener("click", () => {
      const value = (id) => overlay.querySelector(id).value.trim().replace(",", ".");
      const data = measurementData();
      data.push({ date: todayKey, weight: value("#measureWeight"), fat: value("#measureFat"), arms: value("#measureArms"), chest: value("#measureChest"), waist: value("#measureWaist"), thighs: value("#measureThighs") });
      localStorage.setItem(`gym-app-profile-${currentProfile}-measurements`, JSON.stringify(data.slice(-36)));
      closeOverlay();
      renderProgressView();
    });
  }

  function openPhotoDatabase() {
    if (photoDbPromise) return photoDbPromise;
    photoDbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Armazenamento de fotos indisponível neste navegador."));
        return;
      }
      const request = indexedDB.open(photoDbName, 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.objectStoreNames.contains(photoStoreName)
          ? request.transaction.objectStore(photoStoreName)
          : db.createObjectStore(photoStoreName, { keyPath: "id" });
        if (!store.indexNames.contains("profile")) store.createIndex("profile", "profile", { unique: false });
        if (!db.objectStoreNames.contains(avatarStoreName)) db.createObjectStore(avatarStoreName, { keyPath: "profile" });
      };
      request.onsuccess = () => {
        request.result.onversionchange = () => {
          request.result.close();
          photoDbPromise = null;
        };
        resolve(request.result);
      };
      request.onerror = () => {
        photoDbPromise = null;
        reject(request.error || new Error("Não foi possível abrir a galeria."));
      };
    });
    return photoDbPromise;
  }

  async function getProfileAvatar(profileId) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const request = db.transaction(avatarStoreName, "readonly").objectStore(avatarStoreName).get(profileId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Não foi possível carregar a foto do perfil."));
    });
  }

  async function saveProfileAvatar(record) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(avatarStoreName, "readwrite");
      transaction.objectStore(avatarStoreName).put(record);
      transaction.oncomplete = () => resolve(record);
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível salvar a foto do perfil."));
    });
  }

  async function removeProfileAvatar(profileId) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(avatarStoreName, "readwrite");
      transaction.objectStore(avatarStoreName).delete(profileId);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível remover a foto do perfil."));
    });
  }

  function clearAvatarCache(profileId) {
    const currentUrl = avatarUrlCache.get(profileId);
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    avatarUrlCache.delete(profileId);
    avatarRequestCache.delete(profileId);
  }

  async function profileAvatarUrl(profileId) {
    if (avatarUrlCache.has(profileId)) return avatarUrlCache.get(profileId);
    if (avatarRequestCache.has(profileId)) return avatarRequestCache.get(profileId);
    const request = getProfileAvatar(profileId).then((record) => {
      const url = record?.blob ? URL.createObjectURL(record.blob) : null;
      avatarUrlCache.set(profileId, url);
      avatarRequestCache.delete(profileId);
      return url;
    }).catch(() => {
      avatarRequestCache.delete(profileId);
      return null;
    });
    avatarRequestCache.set(profileId, request);
    return request;
  }

  function hydrateProfileAvatars(root = document) {
    const targets = [];
    if (root?.matches?.("[data-avatar-profile]")) targets.push(root);
    root?.querySelectorAll?.("[data-avatar-profile]").forEach((element) => targets.push(element));
    targets.forEach(async (element) => {
      const profileId = element.dataset.avatarProfile;
      element.classList.remove("has-profile-photo");
      element.style.removeProperty("--avatar-image");
      const url = await profileAvatarUrl(profileId);
      if (!url || !element.isConnected || element.dataset.avatarProfile !== profileId) return;
      element.style.setProperty("--avatar-image", `url(\"${url}\")`);
      element.classList.add("has-profile-photo");
    });
  }

  async function optimizeProfileAvatar(file) {
    if (!window.createImageBitmap) return file;
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const side = Math.min(bitmap.width, bitmap.height);
      const sourceX = Math.round((bitmap.width - side) / 2);
      const sourceY = Math.round((bitmap.height - side) / 2);
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      canvas.getContext("2d", { alpha: false }).drawImage(bitmap, sourceX, sourceY, side, side, 0, 0, 512, 512);
      const optimized = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .86));
      return optimized || file;
    } catch {
      return file;
    } finally {
      bitmap?.close?.();
    }
  }

  async function listProgressPhotos(profileId) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(photoStoreName, "readonly");
      const request = transaction.objectStore(photoStoreName).index("profile").getAll(profileId);
      request.onsuccess = () => resolve(request.result.sort((a, b) => `${b.date}|${b.createdAt}`.localeCompare(`${a.date}|${a.createdAt}`)));
      request.onerror = () => reject(request.error || new Error("Não foi possível carregar as fotos."));
    });
  }

  async function saveProgressPhoto(record) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(photoStoreName, "readwrite");
      transaction.objectStore(photoStoreName).put(record);
      transaction.oncomplete = () => resolve(record);
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível salvar a foto."));
      transaction.onabort = () => reject(transaction.error || new Error("O armazenamento da foto foi interrompido."));
    });
  }

  async function removeProgressPhoto(id) {
    const db = await openPhotoDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(photoStoreName, "readwrite");
      transaction.objectStore(photoStoreName).delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível excluir a foto."));
    });
  }

  async function optimizeProgressPhoto(file) {
    if (!window.createImageBitmap || file.size < 1400000) return file;
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      if (scale === 1 && file.size < 2200000) return file;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const compressed = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .86));
      return compressed || file;
    } catch {
      return file;
    } finally {
      bitmap?.close?.();
    }
  }

  async function openPhotoProgress() {
    const profileAtOpen = currentProfile;
    let selectedFile = null;
    let previewUrl = null;
    let galleryUrls = [];
    let photos = [];
    const compareSelection = new Set();

    showOverlay(`<div class="overlay-page photo-page">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Voltar">←</button><h2>Fotos de evolução</h2><span></span></header>
      <section class="photo-capture-card">
        <div class="photo-intro-icon">▣</div>
        <div class="photo-intro"><h3>Registre sua evolução</h3><p>Repita iluminação, distância e posição para facilitar a comparação.</p></div>
        <input id="progressPhoto" type="file" accept="image/*" hidden>
        <input id="progressCamera" type="file" accept="image/*" capture="environment" hidden>
        <div class="photo-source-actions"><button class="primary-button choose-photo" type="button">▣ &nbsp; Escolher foto</button><button class="secondary-button take-photo" type="button">◎ &nbsp; Usar câmera</button></div>
        <div id="photoPreview" class="photo-preview is-empty"><span>Nenhuma foto selecionada</span></div>
        <div class="photo-editor" hidden>
          <div class="field"><label for="progressPhotoDate">DATA DA FOTO</label><input id="progressPhotoDate" type="date" value="${todayKey}" max="${todayKey}"></div>
          <div class="field"><label for="progressPhotoPose">POSIÇÃO</label><select id="progressPhotoPose"><option>Frente</option><option>Lateral</option><option>Costas</option><option>Outro</option></select></div>
          <button class="primary-button save-photo" type="button">✓ &nbsp; Salvar foto</button>
        </div>
        <p class="photo-status" role="status" aria-live="polite"></p>
        <p class="photo-local-note">As fotos ficam armazenadas somente neste dispositivo e neste perfil.</p>
      </section>
      <section class="photo-library">
        <div class="photo-library-head"><div><h3>Sua galeria</h3><p class="photo-count">Carregando fotos…</p></div><button class="secondary-button compare-photos" type="button" disabled>Comparar 2 fotos</button></div>
        <div id="photoCompare" class="photo-compare" hidden></div>
        <div id="photoGallery" class="photo-gallery"><div class="photo-gallery-empty">Carregando…</div></div>
      </section>
    </div>`);

    const preview = overlay.querySelector("#photoPreview");
    const editor = overlay.querySelector(".photo-editor");
    const status = overlay.querySelector(".photo-status");
    const gallery = overlay.querySelector("#photoGallery");
    const comparePanel = overlay.querySelector("#photoCompare");
    const compareButton = overlay.querySelector(".compare-photos");
    const photoInput = overlay.querySelector("#progressPhoto");
    const cameraInput = overlay.querySelector("#progressCamera");

    const releaseUrls = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null;
      galleryUrls.forEach((url) => URL.revokeObjectURL(url));
      galleryUrls = [];
    };
    overlay._cleanup = releaseUrls;
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    overlay.querySelector(".choose-photo").addEventListener("click", () => photoInput.click());
    overlay.querySelector(".take-photo").addEventListener("click", () => cameraInput.click());

    const setStatus = (message, type = "") => {
      status.textContent = message;
      status.className = `photo-status ${type}`.trim();
    };

    const useSelectedFile = (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setStatus("Selecione um arquivo de imagem.", "is-error");
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      selectedFile = file;
      previewUrl = URL.createObjectURL(file);
      preview.classList.remove("is-empty");
      preview.innerHTML = `<img src="${previewUrl}" alt="Prévia da foto selecionada">`;
      editor.hidden = false;
      setStatus("Foto pronta para salvar.");
    };
    photoInput.addEventListener("change", () => useSelectedFile(photoInput.files?.[0]));
    cameraInput.addEventListener("change", () => useSelectedFile(cameraInput.files?.[0]));

    const updateCompareState = () => {
      compareButton.disabled = compareSelection.size !== 2;
      compareButton.textContent = compareSelection.size ? `Comparar (${compareSelection.size}/2)` : "Comparar 2 fotos";
      gallery.querySelectorAll(".photo-card").forEach((card) => {
        const selected = compareSelection.has(card.dataset.id);
        card.classList.toggle("is-selected", selected);
        card.querySelector(".photo-select")?.setAttribute("aria-pressed", String(selected));
      });
    };

    const renderGallery = async () => {
      galleryUrls.forEach((url) => URL.revokeObjectURL(url));
      galleryUrls = [];
      comparePanel.hidden = true;
      comparePanel.innerHTML = "";
      compareSelection.clear();
      photos = await listProgressPhotos(profileAtOpen);
      overlay.querySelector(".photo-count").textContent = photos.length ? `${photos.length} ${photos.length === 1 ? "foto salva" : "fotos salvas"}` : "Nenhuma foto salva";
      if (!photos.length) {
        gallery.innerHTML = `<div class="photo-gallery-empty"><span>▣</span><strong>Sua galeria está vazia</strong><p>Escolha ou tire uma foto e confirme em “Salvar foto”.</p></div>`;
        updateCompareState();
        return;
      }
      gallery.innerHTML = photos.map((photo) => {
        const url = URL.createObjectURL(photo.blob);
        galleryUrls.push(url);
        return `<article class="photo-card" data-id="${photo.id}">
          <button class="photo-select" type="button" aria-label="Selecionar foto de ${prettyDate(photo.date)} para comparação" aria-pressed="false"><img src="${url}" alt="Foto de evolução — ${escapeHtml(photo.pose)} em ${prettyDate(photo.date)}"><span class="photo-check">✓</span></button>
          <div class="photo-card-meta"><div><strong>${escapeHtml(photo.pose)}</strong><small>${prettyDate(photo.date)}</small></div><button class="photo-delete" type="button" aria-label="Excluir foto de ${prettyDate(photo.date)}">Excluir</button></div>
        </article>`;
      }).join("");
      gallery.querySelectorAll(".photo-select").forEach((button) => button.addEventListener("click", () => {
        const id = button.closest(".photo-card").dataset.id;
        if (compareSelection.has(id)) compareSelection.delete(id);
        else if (compareSelection.size < 2) compareSelection.add(id);
        updateCompareState();
      }));
      gallery.querySelectorAll(".photo-delete").forEach((button) => button.addEventListener("click", async () => {
        if (button.dataset.confirm !== "true") {
          button.dataset.confirm = "true";
          button.textContent = "Confirmar";
          button.classList.add("is-confirm");
          window.setTimeout(() => {
            if (!button.isConnected) return;
            button.dataset.confirm = "false";
            button.textContent = "Excluir";
            button.classList.remove("is-confirm");
          }, 6000);
          return;
        }
        button.disabled = true;
        try {
          await removeProgressPhoto(button.closest(".photo-card").dataset.id);
          setStatus("Foto excluída.");
          await renderGallery();
        } catch (error) {
          button.disabled = false;
          setStatus(error.message, "is-error");
        }
      }));
      updateCompareState();
    };

    overlay.querySelector(".save-photo").addEventListener("click", async (event) => {
      if (!selectedFile) return;
      const button = event.currentTarget;
      const date = overlay.querySelector("#progressPhotoDate").value || todayKey;
      const pose = overlay.querySelector("#progressPhotoPose").value;
      button.disabled = true;
      button.textContent = "Salvando…";
      setStatus("Otimizando a imagem para este dispositivo…");
      try {
        const blob = await optimizeProgressPhoto(selectedFile);
        await saveProgressPhoto({
          id: `${profileAtOpen}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          profile: profileAtOpen,
          date,
          pose,
          createdAt: new Date().toISOString(),
          blob,
          type: blob.type || selectedFile.type,
          originalName: selectedFile.name || "foto-evolucao"
        });
        selectedFile = null;
        photoInput.value = "";
        cameraInput.value = "";
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = null;
        preview.classList.add("is-empty");
        preview.innerHTML = `<span>Nenhuma foto selecionada</span>`;
        editor.hidden = true;
        setStatus("Foto salva com sucesso.", "is-success");
        await renderGallery();
      } catch (error) {
        setStatus(error.name === "QuotaExceededError" ? "Não há espaço suficiente no navegador para salvar esta foto." : error.message, "is-error");
      } finally {
        button.disabled = false;
        button.innerHTML = "✓ &nbsp; Salvar foto";
      }
    });

    compareButton.addEventListener("click", () => {
      if (compareSelection.size !== 2) return;
      const selected = [...compareSelection].map((id) => photos.find((photo) => photo.id === id)).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date));
      comparePanel.innerHTML = `<div class="photo-compare-head"><div><strong>Comparação</strong><small>${prettyDate(selected[0].date)} × ${prettyDate(selected[1].date)}</small></div><button class="photo-compare-close" type="button">Fechar</button></div><div class="photo-compare-grid">${selected.map((photo) => {
        const url = URL.createObjectURL(photo.blob);
        galleryUrls.push(url);
        return `<figure><img src="${url}" alt="${escapeHtml(photo.pose)} em ${prettyDate(photo.date)}"><figcaption><strong>${escapeHtml(photo.pose)}</strong><span>${prettyDate(photo.date)}</span></figcaption></figure>`;
      }).join("")}</div>`;
      comparePanel.hidden = false;
      comparePanel.querySelector(".photo-compare-close").addEventListener("click", () => { comparePanel.hidden = true; });
      comparePanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    try {
      await renderGallery();
    } catch (error) {
      gallery.innerHTML = `<div class="photo-gallery-empty"><strong>Não foi possível abrir a galeria</strong><p>${escapeHtml(error.message)}</p></div>`;
      setStatus(error.message, "is-error");
    }
  }

  function openRecords() {
    const records = personalRecords();
    showOverlay(`<div class="overlay-page"><header class="overlay-header"><button class="overlay-close" type="button">←</button><h2>FitPlan</h2><span></span></header><div class="screen-heading"><h2>Recordes pessoais</h2><p>Suas melhores cargas registradas.</p></div><div class="record-list">${records.length ? records.map((record) => `<article class="record-card"><span class="record-icon">★</span><div><h4>${escapeHtml(record.name)}</h4><p>${prettyDate(record.date)}</p></div><div class="record-load">${formatLoad(record.load)} <small>kg</small></div></article>`).join("") : `<div class="content-card" style="padding:24px;color:var(--fit-muted)">Nenhum recorde registrado.</div>`}</div></div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
  }

  routeButtons.forEach((button) => button.addEventListener("click", () => navigate(button.dataset.route)));
  document.querySelector("#profileSwitcher").addEventListener("click", openUserSwitcher);
  document.querySelector("#settingsButton").addEventListener("click", () => navigate("profile"));
  document.querySelector(".fit-brand").addEventListener("click", (event) => { event.preventDefault(); navigate("workout"); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !overlay.hidden) closeOverlay(); });

  if (currentProfile && state) renderApp();
  else renderProfilePicker();
})();
