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
  let activeSheet = null;
  let adminRouteHandled = false;
  let passwordRecoveryMode = false;

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

  const mediaFallbackById = {
    "5eLRITT": "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-stiff-leg-deadlift.webp",
    "9XgCBBZ": "assets/exercises/qx4fgX7.gif",
    "qvlMuMl": "assets/exercises/lever-seated-crunch.gif",
    "vQqmGGp": "assets/exercises/DOoWcnA.gif"
  };

  function versionMediaUrl(src) {
    if (typeof window.versionMediaUrl === "function") return window.versionMediaUrl(src);
    if (!src || String(src).startsWith("data:") || String(src).startsWith("blob:")) return src;
    const separator = String(src).includes("?") ? "&" : "?";
    return `${src}${separator}v=63`;
  }

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

  const SCIENCE_BASE = {
    jonathan: {
      source: "Questionário respondido em 06/08/2026",
      goal: "Reduzir gordura sem abrir mão de massa muscular e desempenho.",
      plan: "5 sessões de musculação • PPL + Lower/Upper • descanso quinta e domingo",
      signals: ["1 ano consistente", "energia boa", "prioridade em costas, ombros, braços e pernas", "afundo/passada fora"],
      decisions: [
        ["Por que 5 dias?", "A disponibilidade é alta e a experiência já permite distribuir o volume em sessões especializadas. Cinco dias evitam concentrar séries demais em um único treino e mantêm contato frequente com os grupos prioritários."],
        ["Por que PPL + Lower/Upper?", "Push, Pull e Legs organizam o trabalho específico; Lower e Upper oferecem um segundo estímulo semanal. Assim, costas, quadríceps, posteriores e braços recebem frequência e volume maiores sem repetir o mesmo padrão em dias seguidos."],
        ["Por que este volume e RIR?", "O plano usa múltiplas séries semanais e, na maior parte do tempo, termina com 1–2 repetições em reserva. Isso cria estímulo suficiente para hipertrofia, mas controla a fadiga durante uma fase de redução de gordura."],
        ["Por que esses exercícios?", "Máquinas, cabos e exercícios estáveis favorecem progressão mensurável. Afundos e passadas foram excluídos por preferência; o volume de pernas foi realocado para hack, leg press, extensora e flexoras."],
        ["Como o cardio entra?", "Corrida e caminhada podem ser mantidas em intensidade compatível com a recuperação. O cardio complementa o gasto energético, enquanto a musculação e a ingestão de proteína são as âncoras para preservar massa magra."]
      ]
    },
    sara: {
      source: "Dados do perfil e da prescrição atual — questionário não anexado",
      goal: "Desenvolver pernas e glúteos sem deixar os demais grupos sem estímulo direto.",
      plan: "4 sessões de musculação • Upper/Lower 2x • RIR predominante de 1–2",
      signals: ["prioridade em pernas e glúteos", "4 dias por semana", "volume direto para o corpo todo", "progressão controlada"],
      decisions: [
        ["Por que 4 dias?", "Quatro sessões permitem treinar cada metade do corpo duas vezes na semana e ainda deixam dias suficientes para recuperação."],
        ["Por que Upper/Lower?", "A divisão mantém a frequência de duas exposições semanais por grupo e reserva mais séries nos dias inferiores para quadríceps, posteriores e glúteos."],
        ["Como o volume foi distribuído?", "Os grupos prioritários recebem mais séries diretas; peito, costas, ombros e braços continuam presentes para equilíbrio muscular. O volume foi espalhado para preservar a qualidade das séries."],
        ["Por que RIR 1–2?", "Treinar perto da falha torna as séries estimulantes sem exigir falha máxima em toda série. Isso facilita recuperar entre as quatro sessões."],
        ["O que deve ser revisto?", "Como o questionário original não está disponível nesta versão, dores, preferências e restrições precisam ser confirmadas antes de mudar exercícios ou aumentar volume."]
      ]
    },
    fernanda: {
      source: "Dados do perfil e da prescrição atual — questionário não anexado",
      goal: "Recomposição corporal com prioridade em glúteos, pernas e tríceps.",
      plan: "4 sessões principais + sábado opcional • treinos de aproximadamente 45 min",
      signals: ["recomposição", "lipedema informado no perfil", "sessões curtas", "sábado flexível"],
      decisions: [
        ["Por que 4 dias + opcional?", "As quatro sessões formam a base necessária. O sábado é complementar e só entra quando sono, disposição e recuperação estão bons, evitando transformar uma opção em obrigação."],
        ["Por que sessões compactas?", "O limite de cerca de 45 minutos exige priorizar exercícios com boa relação entre estímulo e tempo, mantendo descansos maiores nos movimentos principais e acessórios mais objetivos."],
        ["Como as prioridades aparecem?", "Glúteos e pernas recebem duas exposições principais; tríceps aparece nos treinos superiores. Os outros grupos são mantidos para equilíbrio e saúde articular."],
        ["Como progredir?", "Primeiro aumente repetições dentro da faixa prescrita com técnica estável; depois, aumente a carga. Sintomas, dor ou inchaço fora do padrão devem reduzir o treino opcional e motivar avaliação profissional."],
        ["O que deve ser revisto?", "O questionário original não está anexado. Equipamentos, tolerância individual e orientações clínicas relacionadas ao lipedema devem ser reconfirmados nas revisões."]
      ]
    },
    eduarda: {
      source: "Dados do perfil e da prescrição atual — questionário não anexado",
      goal: "Emagrecimento e condicionamento, priorizando glúteos, costas e abdômen.",
      plan: "5 sessões principais + sábado opcional • duração próxima de 1 hora",
      signals: ["emagrecimento", "condicionamento", "glúteos e costas prioritários", "sábado opcional"],
      decisions: [
        ["Por que 5 dias?", "O volume é distribuído para manter as sessões próximas de uma hora. Dias separados de inferiores, costas e superiores evitam que todos os exercícios importantes se acumulem no mesmo treino."],
        ["Por que repetir costas e inferiores?", "Os grupos prioritários recebem duas exposições semanais. Essa frequência ajuda a praticar os movimentos e permite séries de melhor qualidade do que um único treino muito longo."],
        ["Qual é o papel do sábado?", "É uma sessão opcional de condicionamento ou complemento. Deve ser retirada quando houver fadiga acumulada, dor muscular alta ou queda de desempenho."],
        ["Como o emagrecimento é tratado?", "A musculação ajuda a preservar massa magra, mas a perda de peso depende principalmente do balanço energético. O cardio complementa o plano; não substitui dieta e recuperação."],
        ["O que deve ser revisto?", "Sem o questionário anexado, preferências, limitações e rotina precisam ser confirmadas antes de elevar volume ou tornar o sábado obrigatório."]
      ]
    },
    fernando: {
      source: "Dados do perfil e da prescrição atual — questionário não anexado",
      goal: "Hipertrofia com volume equilibrado e sessões próximas de 1 hora.",
      plan: "5 sessões • Upper/Lower + Full Body • stiff excluído",
      signals: ["hipertrofia", "5 dias por semana", "volume equilibrado", "preferência sem stiff"],
      decisions: [
        ["Por que Upper/Lower + Full Body?", "Quatro dias distribuem o trabalho de superiores e inferiores; o Full Body adiciona uma segunda ou terceira exposição leve sem criar outro treino longo e isolado."],
        ["Por que volume equilibrado?", "Nenhum grupo foi marcado como prioridade dominante. Por isso, o plano reparte séries entre os grandes grupos e usa acessórios para completar braços, ombros e panturrilhas."],
        ["Por que o stiff saiu?", "A preferência foi respeitada e o trabalho de posteriores foi mantido com flexoras e outros padrões tolerados. Adesão e execução consistente valem mais que insistir em um exercício específico."],
        ["Como progredir?", "Aumente repetições até o topo da faixa, mantendo o RIR e a técnica; só então suba a carga. O quinto dia deve ser ajustado se a performance cair por várias sessões."],
        ["O que deve ser revisto?", "O questionário original não está anexado. A razão para evitar o stiff, possíveis dores e equipamentos disponíveis precisam ser confirmados."]
      ]
    },
    nathalia: {
      source: "Questionário respondido em 05/08/2026",
      goal: "Perder gordura, fortalecer a musculatura e recuperar constância com proteção lombar.",
      plan: "3 sessões Full Body • segunda, quarta e sexta • recuperação entre sessões",
      signals: ["nível intermediário", "3 dias disponíveis", "histórico de hérnia lombar", "forte dor muscular com estímulos novos"],
      decisions: [
        ["Por que Full Body 3x?", "Os três dias disponíveis já são alternados. Treinar o corpo todo em cada sessão mantém frequência regular por grupo, sem precisar encaixar uma divisão de quatro ou cinco dias que não caberia na rotina."],
        ["Por que o volume é moderado?", "O histórico de dor muscular forte com exercícios novos favorece começar com dose recuperável e aumentar apenas após constância. Mais volume não ajuda se comprometer a próxima sessão."],
        ["Como a lombar foi considerada?", "O plano prioriza apoio, controle e amplitude tolerada, evitando depender do leg press que já esteve associado a uma crise. Nenhum exercício deve provocar dor irradiada, formigamento ou perda de força."],
        ["Por que esses grupos aparecem?", "Quadríceps, posteriores, glúteos e braços foram citados como prioridades, mas cada treino mantém padrões de empurrar e puxar para não criar lacunas."],
        ["E a perda de gordura?", "A musculação preserva e desenvolve tecido muscular; a redução de gordura exige ajuste alimentar compatível. O primeiro marcador de sucesso definido no questionário é constância, seguido de disposição e composição corporal."]
      ]
    },
    pablo: {
      source: "Questionário respondido em 12/08/2026",
      goal: "Recomposição corporal, redução de gordura abdominal e melhora do condicionamento.",
      plan: "4 sessões Upper/Lower + 2 cardios • descanso quarta e domingo",
      signals: ["iniciante", "treina pela manhã", "evita agachamento livre, RDL, terra e elevação pélvica", "pedala e quer voltar aos 5 km"],
      decisions: [
        ["Por que Upper/Lower 4x?", "Para um iniciante, a divisão permite praticar cada grupo duas vezes por semana e repetir padrões com técnica fresca. Quatro sessões de musculação também deixam espaço para cardio e recuperação."],
        ["Por que descanso na quarta e no domingo?", "A quarta interrompe dois blocos consecutivos de treino e reduz fadiga no meio da semana. O domingo fecha o ciclo antes de reiniciar, enquanto o sábado fica disponível para cardio."],
        ["Por que este volume?", "O volume é suficiente para criar adaptação, mas não exige muitas séries de um mesmo músculo na mesma sessão. A prioridade inicial é execução consistente, progressão gradual e tolerância ao treino."],
        ["Por que esses exercícios?", "Foram evitados os movimentos rejeitados no questionário. Máquinas, halteres e cabos fornecem alternativas comuns e estáveis para treinar os mesmos grupos sem depender de agachamento livre, stiff/RDL, terra ou elevação pélvica."],
        ["Como o cardio foi escolhido?", "Duas sessões preservam a pedalada já praticada e constroem base para voltar aos 5 km. A corrida deve progredir por tempo e tolerância, sem prejudicar os treinos de pernas."]
      ]
    },
    igor: {
      source: "Questionário respondido em 17/08/2026",
      goal: "Perder gordura preservando ou ganhando massa magra.",
      plan: "4 sessões Upper/Lower + cardio 2x • descanso de musculação quarta, sábado e domingo",
      signals: ["intermediário/avançando", "déficit com nutricionista", "cansaço ao longo da semana", "quadríceps direito precisa recuperar força"],
      decisions: [
        ["Por que 4 dias, e não 5?", "Apesar da experiência, o questionário relata cansaço acumulado. Quatro sessões mantêm volume produtivo e duas exposições por grupo, com mais oportunidades de recuperação durante o déficit calórico."],
        ["Por que Upper/Lower?", "A divisão treina superiores e inferiores duas vezes por semana, distribui melhor as séries e permite atenção recorrente ao quadríceps sem concentrar tudo em um único dia."],
        ["Por que descansar quarta, sábado e domingo?", "A quarta separa os pares segunda/terça e quinta/sexta. O fim de semana sem musculação ajuda a dissipar fadiga; os cardios curtos entram conforme a recuperação, sem virar mais dois treinos pesados."],
        ["Como a assimetria foi considerada?", "Exercícios guiados e trabalho unilateral controlado permitem acompanhar o lado direito. A carga deve ser limitada pela técnica e capacidade do lado mais fraco; dor ou piora de força exige avaliação profissional."],
        ["Por que RIR e progressão gradual?", "Treinar próximo da falha gera estímulo, mas falhar em toda série aumentaria a fadiga. A progressão acontece quando a faixa de repetições é concluída com execução estável e o RIR planejado."]
      ]
    }
  };

  const SCIENCE_REFERENCES = [
    ["Diretrizes ACSM 2026", "Personalização, consistência, múltiplas séries e volume semanal orientado ao objetivo.", "https://acsm.org/resistance-training-guidelines-update-2026/"],
    ["Currier et al., 2023", "Treinos resistidos com múltiplas séries promovem força e hipertrofia em diferentes combinações de carga e frequência.", "https://pubmed.ncbi.nlm.nih.gov/37414459/"],
    ["Ramos-Campo et al., 2024", "Split e Full Body produzem resultados semelhantes quando o volume é igualado; a divisão deve servir à rotina e à distribuição do volume.", "https://pubmed.ncbi.nlm.nih.gov/38595233/"],
    ["Robinson et al., 2024", "Para hipertrofia, séries mais próximas da falha tendem a ser mais estimulantes, sem exigir falha em todas as séries.", "https://pubmed.ncbi.nlm.nih.gov/38970765/"],
    ["Binmahfoz et al., 2025", "Durante perda de peso, exercício resistido ajuda a proteger massa livre de gordura e favorece a redução de gordura.", "https://pubmed.ncbi.nlm.nih.gov/40909191/"]
  ];

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
    const remoteExerciseDbSrc = media.id ? `${EXERCISE_MEDIA_BASE}${media.id}.gif` : null;
    const src = media.url ? (localMediaByUrl[media.url] || media.url) : `assets/exercises/${media.id}.gif`;
    const fallbackSrc = media.url ? mediaFallbackByUrl[media.url] : (mediaFallbackById[media.id] || remoteExerciseDbSrc);
    return {
      src: versionMediaUrl(src),
      fallbackSrc: fallbackSrc ? versionMediaUrl(fallbackSrc) : null,
      label: media.label || exercise.name
    };
  }

  function retryMediaUrl(src) {
    if (!src || String(src).startsWith("data:") || String(src).startsWith("blob:")) return src;
    const separator = String(src).includes("?") ? "&" : "?";
    return `${src}${separator}retry=${Date.now()}`;
  }

  function bindMediaErrorFallback(image, media, emptyClassName = "exercise-media-empty") {
    if (!image || !media) return;
    image.addEventListener("error", () => {
      if (image.dataset.retry !== "true") {
        image.dataset.retry = "true";
        image.src = retryMediaUrl(media.src);
        return;
      }
      if (media.fallbackSrc && image.dataset.fallback !== "true") {
        image.dataset.fallback = "true";
        image.src = retryMediaUrl(media.fallbackSrc);
        return;
      }
      image.replaceWith(Object.assign(document.createElement("div"), {
        className: emptyClassName,
        textContent: "Demonstração temporariamente indisponível"
      }));
    });
  }

  function getEquipment(exercise, variant = getSelectedVariant(exercise)) {
    if (variant?.equipment) return variant.equipment;
    const text = slugify(variant?.displayName || variant?.label || exercise.name);
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

  function variantReps(exercise, variant = getSelectedVariant(exercise)) {
    return variant?.reps || exercise.reps;
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
    closeActionSheet();
    if (typeof overlay._cleanup === "function") overlay._cleanup();
    overlay._cleanup = null;
    overlay.hidden = true;
    overlay.innerHTML = "";
    document.body.style.overflow = "";
    activeExercise = null;
    activeExerciseIndex = -1;
  }

  function closeActionSheet() {
    if (!activeSheet) return;
    activeSheet.remove();
    activeSheet = null;
  }

  function showActionSheet(title, content) {
    closeActionSheet();
    const sheet = document.createElement("div");
    sheet.className = "sheet-backdrop exercise-sheet-backdrop";
    sheet.innerHTML = `<section class="bottom-sheet exercise-action-sheet" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <div class="sheet-handle"></div>
      <div class="sheet-header"><h2>${escapeHtml(title)}</h2><button class="sheet-close" type="button" aria-label="Fechar">×</button></div>
      ${content}
    </section>`;
    document.body.appendChild(sheet);
    activeSheet = sheet;
    sheet.querySelector(".sheet-close")?.addEventListener("click", closeActionSheet);
    sheet.addEventListener("click", (event) => { if (event.target === sheet) closeActionSheet(); });
    window.requestAnimationFrame(() => sheet.querySelector("button:not([disabled]), input, textarea")?.focus({ preventScroll: true }));
    return sheet;
  }

  function cloudSnapshot() {
    return window.fitplanCloud?.snapshot?.() || {
      configured: false,
      ready: true,
      session: null,
      user: null,
      profile: null,
      error: "Conexão online indisponível."
    };
  }

  function cloudRoleLabel(role) {
    return ({ admin: "Administrador", coach: "Treinador", athlete: "Aluno" })[role] || "Aluno";
  }

  function cloudAccountLabel(snapshot = cloudSnapshot()) {
    if (!snapshot.ready) return "Conectando ao Supabase…";
    if (!snapshot.user) return snapshot.error ? "Acesso não concluído • tente novamente" : "Acesse seu treino com segurança";
    const linkedId = snapshot.profile?.legacy_profile_key;
    if (linkedId && profiles[linkedId]) return `Vinculada ao perfil ${profileName(linkedId)}`;
    if (snapshot.profile?.role === "admin") return "Conta administrativa conectada";
    return "Cadastro aprovado • treino em elaboração";
  }

  function cloudAccessMarkup() {
    const cloud = cloudSnapshot();
    const signedIn = Boolean(cloud.user);
    const title = signedIn
      ? (cloud.profile?.display_name || cloud.user.email || "Conta online")
      : "Entrar no FitPlan";
    return `<button class="cloud-access-card ${signedIn ? "is-signed-in" : ""}" type="button" ${!cloud.ready ? "disabled" : ""}>
      <span class="cloud-access-icon" aria-hidden="true">${signedIn ? "✓" : "↗"}</span>
      <span class="cloud-access-copy"><small>CONTA ONLINE</small><strong>${escapeHtml(title)}</strong><span>${escapeHtml(cloudAccountLabel(cloud))}</span></span>
      <span class="cloud-status-dot ${signedIn ? "is-online" : ""}" aria-hidden="true"></span>
    </button>`;
  }

  function openCloudAuthSheet() {
    const cloud = cloudSnapshot();
    if (cloud.user) {
      const linkedId = cloud.profile?.legacy_profile_key;
      const linkedText = linkedId && profiles[linkedId]
        ? `Acesso liberado ao treino de ${profileName(linkedId)}.`
        : "A conta está autenticada, mas ainda precisa ser vinculada pelo administrador a um perfil de treino.";
      const sheet = showActionSheet("Conta online", `<div class="cloud-account-summary">
        <span class="cloud-account-check" aria-hidden="true">✓</span>
        <div><small>${escapeHtml(cloudRoleLabel(cloud.profile?.role))}</small><strong>${escapeHtml(cloud.profile?.display_name || "Conta FitPlan")}</strong><span>${escapeHtml(cloud.user.email || "")}</span></div>
      </div>
      <p class="cloud-link-note ${linkedId ? "is-linked" : ""}">${escapeHtml(linkedText)}</p>
      <button class="secondary-button cloud-signout" type="button">Sair da conta online</button>
      <p class="cloud-auth-help">Ao sair, será necessário fazer login novamente.</p>`);
      sheet.querySelector(".cloud-signout")?.addEventListener("click", async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = "Saindo…";
        try {
          await window.fitplanCloud.signOut();
          closeActionSheet();
          if (!screenPicker.hidden) renderProfileCards();
          if (currentProfile) renderProfileView();
        } catch (error) {
          button.disabled = false;
          button.textContent = "Tentar sair novamente";
          sheet.querySelector(".cloud-auth-help").textContent = error.message;
          sheet.querySelector(".cloud-auth-help").classList.add("is-error");
        }
      });
      return;
    }

    // ── Login form: email + password only ────────────────────────────────────
    const sheet = showActionSheet("Entrar no FitPlan", `
      <form class="cloud-auth-form auth-panel" data-panel="password">
        <label><span>E-MAIL</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@exemplo.com" required></label>
        <label><span>SENHA</span><input name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required></label>
        <p class="cloud-auth-status" role="status" aria-live="polite">${cloud.error ? escapeHtml(cloud.error) : ""}</p>
        <button class="primary-button" type="submit">Entrar</button>
        <button class="auth-forgot-btn" type="button">Esqueci minha senha</button>
      </form>
    `);

    // Password login submit
    const passwordForm = sheet.querySelector('[data-panel="password"]');
    passwordForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = passwordForm.querySelector("button[type='submit']");
      const status = passwordForm.querySelector(".cloud-auth-status");
      const data = new FormData(passwordForm);
      submit.disabled = true;
      submit.textContent = "Entrando…";
      status.classList.remove("is-error", "is-success");
      try {
        await window.fitplanCloud.signInWithPassword({
          email: data.get("email"),
          password: data.get("password")
        });
        closeActionSheet();
      } catch (error) {
        status.textContent = error?.message?.includes("signInWithPassword")
          ? "Recarregue a página e tente novamente."
          : (error.message || "Não foi possível entrar. Tente novamente.");
        status.classList.add("is-error");
        submit.textContent = "Tentar novamente";
        submit.disabled = false;
      }
    });

    // Forgot password
    passwordForm?.querySelector(".auth-forgot-btn")?.addEventListener("click", () => {
      const emailInput = passwordForm.querySelector("input[name='email']");
      openForgotPasswordSheet(emailInput?.value || "");
    });
  }

  function openForgotPasswordSheet(prefillEmail = "", prefillError = "") {
    const sheet = showActionSheet("Redefinir senha", `
      <form class="cloud-auth-form forgot-form">
        <div class="cloud-auth-intro"><span aria-hidden="true">🔑</span><div><strong>Esqueceu a senha?</strong><p>Enviaremos um link para você criar uma nova senha.</p></div></div>
        <label><span>E-MAIL</span><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@exemplo.com" value="${escapeHtml(prefillEmail)}" required></label>
        <p class="cloud-auth-status${prefillError ? " is-error" : ""}" role="status" aria-live="polite">${escapeHtml(prefillError)}</p>
        <button class="primary-button" type="submit">Enviar link de redefinição</button>
      </form>
    `);
    const form = sheet.querySelector(".forgot-form");
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector("button[type='submit']");
      const status = form.querySelector(".cloud-auth-status");
      const data = new FormData(form);
      submit.disabled = true;
      submit.textContent = "Enviando…";
      status.classList.remove("is-error", "is-success");
      try {
        const result = await window.fitplanCloud.resetPassword(data.get("email"));
        status.textContent = `Link enviado para ${result.email}. Verifique sua caixa de entrada.`;
        status.classList.add("is-success");
        submit.textContent = "Enviar novamente";
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-error");
        submit.textContent = "Tentar novamente";
      } finally {
        submit.disabled = false;
      }
    });
  }

  function openSetPasswordSheet(options = {}) {
    if (activeSheet?.querySelector?.(".set-password-form")) return;
    const isRecovery = options.recovery === true || isPasswordRecoveryFlow();
    if (isRecovery) passwordRecoveryMode = true;
    const sheet = showActionSheet("Criar senha", `
      <form class="cloud-auth-form set-password-form">
        <div class="cloud-auth-intro"><span aria-hidden="true">🔒</span><div><strong>Crie sua nova senha</strong><p>Depois de salvar, abra o FitPlan instalado no celular e entre com e-mail e senha.</p></div></div>
        <label><span>NOVA SENHA</span><input name="password" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres" required minlength="6"></label>
        <label><span>CONFIRMAR SENHA</span><input name="confirm" type="password" autocomplete="new-password" placeholder="Repita a senha" required minlength="6"></label>
        <p class="cloud-auth-status" role="status" aria-live="polite"></p>
        <button class="primary-button" type="submit">Salvar senha</button>
        <button class="auth-forgot-btn" type="button">Fechar</button>
      </form>
    `);
    const form = sheet.querySelector(".set-password-form");
    form?.querySelector(".auth-forgot-btn")?.addEventListener("click", async () => {
      passwordRecoveryMode = false;
      window.fitplanCloud?.consumePasswordRecovery?.();
      if (isRecovery) {
        try { await window.fitplanCloud?.signOut?.(); } catch {}
      }
      closeActionSheet();
      applyCloudAuthGate();
    });
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector("button[type='submit']");
      const status = form.querySelector(".cloud-auth-status");
      const data = new FormData(form);
      status.classList.remove("is-error", "is-success");
      if (data.get("password") !== data.get("confirm")) {
        status.textContent = "As senhas não coincidem.";
        status.classList.add("is-error");
        return;
      }
      submit.disabled = true;
      submit.textContent = "Salvando…";
      try {
        await window.fitplanCloud.updatePassword(data.get("password"));
        if (isRecovery) {
          passwordRecoveryMode = false;
          window.fitplanCloud?.consumePasswordRecovery?.();
          try { await window.fitplanCloud.signOut(); } catch {}
        }
        status.textContent = "Senha salva! Agora abra o FitPlan instalado no celular e entre com seu e-mail e essa nova senha.";
        status.classList.add("is-success");
        submit.textContent = "Senha salva ✓";
        form.querySelector(".auth-forgot-btn").textContent = "Entendi";
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-error");
        submit.textContent = "Tentar novamente";
        submit.disabled = false;
      }
    });
  }

  function legacyMigrationPreview() {
    if (!currentProfile || !window.fitplanLegacyMigration) return null;
    try { return window.fitplanLegacyMigration.preview(currentProfile); }
    catch { return null; }
  }

  function legacyMigrationButtonMarkup() {
    const preview = legacyMigrationPreview();
    if (!cloudSnapshot().user || !preview?.hasData) return "";
    const migrated = window.fitplanLegacyMigration.status(currentProfile).migrated;
    return `<button class="settings-row" type="button" data-action="legacy-migration"><span class="row-icon">↥</span><span><strong>${migrated ? "Dados locais sincronizados" : "Migrar dados deste aparelho"}</strong><small>${preview.sessions} treinos • ${preview.exerciseLoads} cargas • ${preview.measurements} medidas</small></span><span class="chevron">›</span></button>`;
  }

  function openLegacyMigrationSheet() {
    const preview = legacyMigrationPreview();
    if (!preview) return;
    const migrationStatus = window.fitplanLegacyMigration.status(currentProfile);
    const sheet = showActionSheet("Migrar dados locais", `<div class="legacy-migration-summary">
      <p>Esta ação envia para a sua conta privada no Supabase os registros encontrados neste aparelho.</p>
      <div><span><strong>${preview.sessions}</strong><small>treinos</small></span><span><strong>${preview.exerciseLoads}</strong><small>cargas</small></span><span><strong>${preview.measurements}</strong><small>medidas</small></span></div>
      <p class="cloud-auth-help">Fotos de evolução e foto de perfil continuam somente neste dispositivo e não fazem parte desta migração.</p>
      ${migrationStatus.migrated ? `<p class="cloud-link-note is-linked">Última sincronização concluída. Repetir a ação atualiza os mesmos registros sem duplicá-los.</p>` : ""}
      <label class="legacy-migration-consent"><input type="checkbox"><span>Entendo que esses dados serão enviados para minha conta FitPlan.</span></label>
      <button class="primary-button legacy-migration-start" type="button" disabled>${migrationStatus.migrated ? "Sincronizar novamente" : "Migrar para a conta"}</button>
      <p class="cloud-auth-status" role="status" aria-live="polite"></p>
    </div>`);
    const consent = sheet.querySelector(".legacy-migration-consent input");
    const button = sheet.querySelector(".legacy-migration-start");
    const status = sheet.querySelector(".cloud-auth-status");
    consent.addEventListener("change", () => { button.disabled = !consent.checked; });
    button.addEventListener("click", async () => {
      button.disabled = true;
      consent.disabled = true;
      button.textContent = "Migrando…";
      status.classList.remove("is-error", "is-success");
      try {
        const result = await window.fitplanLegacyMigration.migrate(currentProfile);
        status.textContent = `Concluído: ${result.sessions} treinos, ${result.exerciseLoads} cargas e ${result.measurements} medidas. ${result.skippedExerciseLoads ? `${result.skippedExerciseLoads} cargas antigas não correspondiam ao plano ativo.` : ""}`.trim();
        status.classList.add("is-success");
        button.textContent = "Sincronização concluída";
        renderProfileView();
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-error");
        button.textContent = "Tentar novamente";
        button.disabled = false;
        consent.disabled = false;
      }
    });
  }

  function renderProfileCards() {
    const list = document.querySelector("#profileList");
    if (!list) return;
    const cloud = cloudSnapshot();
    if (cloud.user && cloud.profile && !linkedCloudProfileId(cloud)) {
      const isAdmin = cloud.profile.role === "admin";
      list.innerHTML = `${cloudAccessMarkup()}
        ${isAdmin ? `<button class="new-user-request admin-login-entry" type="button"><span class="new-user-request-icon" aria-hidden="true">⌁</span><span><strong>Solicitações de cadastro</strong><small>Analisar, aprovar ou recusar novos usuários</small></span><span class="new-user-request-arrow" aria-hidden="true">›</span></button>` : `<div class="approved-waiting-card"><span aria-hidden="true">✓</span><div><strong>Cadastro aprovado</strong><p>Seu acesso está ativo. O treino aparecerá aqui assim que a prescrição for concluída.</p></div></div>`}
        <div class="login-gate-note"><span aria-hidden="true">⌁</span><p><strong>Conta protegida</strong>Você entrou como ${escapeHtml(cloud.profile.display_name || cloud.user.email || "usuário FitPlan")}.</p></div>`;
      list.querySelector(".cloud-access-card")?.addEventListener("click", openCloudAuthSheet);
      list.querySelector(".admin-login-entry")?.addEventListener("click", () => openAdminQuestionnaires());
      return;
    }
    list.innerHTML = `${cloudAccessMarkup()}
      <div class="new-user-divider" aria-hidden="true">OU</div>
      <button class="new-user-request" type="button" aria-label="Sou novo, responder questionário e solicitar cadastro">
        <span class="new-user-request-icon" aria-hidden="true">＋</span>
        <span><strong>Sou novo no FitPlan</strong><small>Responder questionário e solicitar cadastro</small></span>
        <span class="new-user-request-arrow" aria-hidden="true">›</span>
      </button>
      <button class="auth-forgot-btn forgot-link" type="button">Esqueci minha senha</button>
      <div class="login-gate-note"><span aria-hidden="true">⌁</span><p><strong>Seus dados ficam privados</strong>Quem já tem acesso entra com e-mail e senha. Novos cadastros são liberados após a análise do questionário.</p></div>`;
    list.querySelector(".cloud-access-card")?.addEventListener("click", openCloudAuthSheet);
    list.querySelector(".new-user-request")?.addEventListener("click", openTrainingQuestionnaire);
    list.querySelector(".forgot-link")?.addEventListener("click", () => openForgotPasswordSheet(""));
  }

  renderProfilePicker = function () {
    document.querySelector("#screen-picker .lock-title").textContent = "Acesse o FitPlan";
    document.querySelector("#screen-picker .lock-subtitle").textContent = "Entre com e-mail e senha para carregar o seu treino.";
    renderProfileCards();
  };

  function linkedCloudProfileId(cloud = cloudSnapshot()) {
    const linkedId = cloud.profile?.legacy_profile_key;
    if (!cloud.ready || !cloud.user || cloud.profile?.active === false) return null;
    return linkedId && profiles[linkedId] ? linkedId : null;
  }

  function isPasswordRecoveryFlow(cloud = cloudSnapshot()) {
    return passwordRecoveryMode || window.fitplanCloud?.pendingPasswordRecovery || cloud?.recovery === true;
  }

  function applyCloudAuthGate(cloud = cloudSnapshot()) {
    if (isPasswordRecoveryFlow(cloud)) {
      showScreen("picker");
      renderProfilePicker();
      return;
    }
    const linkedId = linkedCloudProfileId(cloud);
    if (linkedId) {
      const screenApp = document.querySelector("#screen-app");
      // Already inside the correct app screen — do nothing
      if (currentProfile === linkedId && screenApp && !screenApp.hidden) return;
      enterApp(linkedId);
      // Prompt password setup only when the user JUST signed in via magic link (OTP)
      // in this page load. Consume the flag immediately to prevent repeat prompts.
      const signedInViaOtp = window.fitplanCloud?.lastSignInWasOtp === true;
      if (signedInViaOtp && window.fitplanCloud) {
        window.fitplanCloud.lastSignInWasOtp = false; // consume — only prompt once
      }
      const userId = cloud.user?.id;
      if (signedInViaOtp && userId && !localStorage.getItem(`fitplan-password-set-${userId}`)) {
        setTimeout(() => {
          if (typeof openSetPasswordSheet === "function") {
            localStorage.setItem(`fitplan-password-set-${userId}`, "1");
            openSetPasswordSheet();
          }
        }, 1500);
      }
      return;
    }
    if (currentProfile) logout();
    else {
      renderProfilePicker();
      showScreen("picker");
    }
  }

  const questionnaireDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
  const questionnaireMuscles = ["Peitoral", "Costas/dorsais", "Ombros", "Trapézio", "Bíceps", "Tríceps", "Antebraços", "Quadríceps", "Posterior de coxa", "Glúteos", "Panturrilhas", "Abdômen/core"];

  function choiceMarkup(name, values) {
    return values.map((value) => `<label class="questionnaire-choice"><input type="checkbox" name="${name}" value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span></label>`).join("");
  }

  function questionnaireField(name, label, placeholder, options = {}) {
    const { type = "textarea", required = true, inputMode = "", autocomplete = "", min = "", step = "", suffix = "" } = options;
    const requiredAttr = required ? " required" : "";
    if (type === "select") {
      return `<label class="questionnaire-field"><span>${label}${required ? " *" : ""}</span><select name="${name}"${requiredAttr}><option value="">Selecione</option>${options.values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}</select></label>`;
    }
    if (type !== "textarea") {
      return `<label class="questionnaire-field"><span>${label}${required ? " *" : ""}</span><span class="questionnaire-input-wrap"><input type="${type}" name="${name}" placeholder="${placeholder}"${requiredAttr}${inputMode ? ` inputmode="${inputMode}"` : ""}${autocomplete ? ` autocomplete="${autocomplete}"` : ""}${min ? ` min="${min}"` : ""}${step ? ` step="${step}"` : ""}>${suffix ? `<small>${suffix}</small>` : ""}</span></label>`;
    }
    return `<label class="questionnaire-field"><span>${label}${required ? " *" : ""}</span><textarea name="${name}" rows="4" placeholder="${placeholder}"${requiredAttr}></textarea></label>`;
  }

  function showQuestionnaireSuccess(isLocalPreview = false) {
    showOverlay(`<div class="overlay-page questionnaire-success">
      <div class="questionnaire-success-icon" aria-hidden="true">✓</div>
      <p class="eyebrow">${isLocalPreview ? "PRÉVIA LOCAL" : "QUESTIONÁRIO ENVIADO"}</p>
      <h2>${isLocalPreview ? "Fluxo validado" : "Solicitação recebida"}</h2>
      <p>${isLocalPreview ? "Nenhum dado foi enviado neste teste local. Em produção, a resposta será gravada com segurança no Supabase e poderá gerar a notificação configurada." : "Suas respostas foram registradas e enviadas ao responsável pelo FitPlan. Ele vai analisar o questionário antes de montar e liberar o seu treino."}</p>
      <button class="primary-button questionnaire-done" type="button">Voltar aos perfis</button>
    </div>`);
    overlay.querySelector(".questionnaire-done")?.addEventListener("click", closeOverlay);
  }

  function openTrainingQuestionnaire() {
    const steps = [
      `<section class="questionnaire-step" data-questionnaire-step="0">
        <div class="questionnaire-step-heading"><span>01</span><div><h3>Vamos conhecer você</h3><p>Use seus dados atuais. Eles ajudam a dimensionar o treino com segurança.</p></div></div>
        <div class="questionnaire-grid questionnaire-grid-two">
          ${questionnaireField("nome", "Nome completo", "Seu nome", { type: "text", autocomplete: "name" })}
          ${questionnaireField("email", "E-mail de acesso", "voce@exemplo.com", { type: "email", required: true, autocomplete: "email" })}
          ${questionnaireField("senha", "Criar senha", "Mínimo 6 caracteres", { type: "password", required: true, autocomplete: "new-password" })}
          ${questionnaireField("whatsapp", "WhatsApp", "(00) 00000-0000", { type: "tel", required: false, inputMode: "tel", autocomplete: "tel" })}
          ${questionnaireField("idade", "Idade", "00", { type: "number", inputMode: "numeric", min: "12", suffix: "anos" })}
          ${questionnaireField("altura_cm", "Altura", "000", { type: "number", inputMode: "decimal", min: "100", step: "0.1", suffix: "cm" })}
          ${questionnaireField("peso_kg", "Peso atual", "00,0", { type: "number", inputMode: "decimal", min: "30", step: "0.1", suffix: "kg" })}
          ${questionnaireField("sexo", "Sexo", "", { type: "select", values: ["Feminino", "Masculino", "Intersexo", "Prefiro não informar"] })}
        </div>
        <p class="questionnaire-note">O e-mail e a senha serão usados para acessar o FitPlan após a aprovação do seu cadastro.</p>
      </section>`,
      `<section class="questionnaire-step" data-questionnaire-step="1" hidden>
        <div class="questionnaire-step-heading"><span>02</span><div><h3>Rotina e objetivo</h3><p>Conte como o treino precisa caber na sua vida.</p></div></div>
        <div class="questionnaire-grid">
          ${questionnaireField("rotina", "Rotina", "Profissão, jornada, horário em que costuma treinar e nível de energia no dia.")}
          ${questionnaireField("objetivo", "Objetivo principal e prazo", "Ganho de massa, perda de gordura, recomposição, força, saúde, condicionamento ou uma data específica.")}
          ${questionnaireField("experiencia", "Experiência com musculação", "Tempo de treino, nível atual e experiência com progressão de carga e execução controlada.")}
        </div>
      </section>`,
      `<section class="questionnaire-step" data-questionnaire-step="2" hidden>
        <div class="questionnaire-step-heading"><span>03</span><div><h3>Disponibilidade e preferências</h3><p>A divisão do treino nasce daqui.</p></div></div>
        <fieldset class="questionnaire-fieldset" data-required-group="dias_disponiveis"><legend>Quais dias você pode treinar? *</legend><div class="questionnaire-choices questionnaire-days">${choiceMarkup("dias_disponiveis", questionnaireDays)}</div></fieldset>
        <div class="questionnaire-grid">
          ${questionnaireField("equipamentos_indisponiveis", "Equipamentos que você não tem acesso", "Liste máquinas, barras, halteres, cabos ou aparelhos que faltam. Se tiver tudo, escreva “Nenhum”.")}
        </div>
        <fieldset class="questionnaire-fieldset" data-required-group="prioridades"><legend>Grupos musculares prioritários ou pontos fracos *</legend><div class="questionnaire-choices">${choiceMarkup("prioridades", questionnaireMuscles)}</div></fieldset>
        <div class="questionnaire-grid">
          ${questionnaireField("exercicios_evitar", "Exercícios que não gosta ou prefere evitar", "Se não houver, escreva “Nenhum”.")}
        </div>
      </section>`,
      `<section class="questionnaire-step" data-questionnaire-step="3" hidden>
        <div class="questionnaire-step-heading"><span>04</span><div><h3>Saúde e recuperação</h3><p>Essas respostas evitam escolhas incompatíveis com sua realidade.</p></div></div>
        <div class="questionnaire-grid">
          ${questionnaireField("lesoes_limitacoes", "Lesões, dores e limitações", "Inclua lesões atuais ou antigas, dores por região/exercício e restrições médicas ou fisioterapêuticas. Se não houver, escreva “Nenhuma”.")}
          ${questionnaireField("cardio", "Cardio", "Tipo, frequência semanal, duração, intensidade e qualquer limitação para correr, caminhar, pedalar ou fazer escada.")}
          ${questionnaireField("recuperacao", "Recuperação", "Horas e qualidade do sono, estresse, fadiga entre treinos e dor muscular após treinar.")}
          ${questionnaireField("alimentacao", "Alimentação", "Dieta atual, acompanhamento nutricional, déficit/manutenção/superávit, proteína e suplementos.")}
          ${questionnaireField("saude_medicacoes", "Saúde e medicações", "Medicações relevantes para peso, apetite, hormônios ou saúde e qualquer cuidado importante. Se não houver, escreva “Nenhuma”.")}
        </div>
      </section>`,
      `<section class="questionnaire-step" data-questionnaire-step="4" hidden>
        <div class="questionnaire-step-heading"><span>05</span><div><h3>O que seria sucesso?</h3><p>Última etapa: defina o resultado que espera alcançar.</p></div></div>
        <div class="questionnaire-grid">
          ${questionnaireField("expectativas", "Expectativas para os próximos 3 meses", "O que espera, o que seria sucesso e qualquer observação adicional.")}
        </div>
        <label class="questionnaire-consent"><input type="checkbox" name="consentimento" value="Autorizado" required><span>Autorizo o envio destas respostas, incluindo informações de saúde, ao responsável pelo FitPlan para elaboração do treino.</span></label>
        <div class="questionnaire-privacy"><strong>Seus dados não ficam públicos.</strong><span>Eles serão usados apenas para analisar a solicitação e montar o seu treino.</span></div>
      </section>`
    ];

    showOverlay(`<div class="overlay-page questionnaire-page">
      <header class="overlay-header questionnaire-header"><button class="overlay-close questionnaire-close" type="button" aria-label="Fechar questionário">×</button><h2>Novo treino</h2><span></span></header>
      <div class="questionnaire-progress"><div><span class="questionnaire-progress-label">ETAPA 1 DE ${steps.length}</span><small class="questionnaire-progress-percent">20%</small></div><span class="questionnaire-progress-track"><span class="questionnaire-progress-fill"></span></span></div>
      <form class="questionnaire-form" id="trainingQuestionnaire" name="fitplan-questionario" novalidate>
        <input type="hidden" name="form-name" value="fitplan-questionario">
        <input type="hidden" name="subject" value="Nova solicitação de treino — FitPlan">
        <label class="questionnaire-honeypot" aria-hidden="true">Não preencha<input name="bot-field" tabindex="-1" autocomplete="off"></label>
        ${steps.join("")}
        <p class="questionnaire-status" role="status" aria-live="polite"></p>
        <div class="questionnaire-actions"><button class="secondary-button questionnaire-back" type="button">Voltar</button><button class="primary-button questionnaire-next" type="button">Continuar</button><button class="primary-button questionnaire-submit" type="submit" hidden>Enviar questionário</button></div>
      </form>
    </div>`);

    const form = overlay.querySelector("#trainingQuestionnaire");
    const status = form.querySelector(".questionnaire-status");
    const back = form.querySelector(".questionnaire-back");
    const next = form.querySelector(".questionnaire-next");
    const submit = form.querySelector(".questionnaire-submit");
    let currentStep = 0;

    function setStatus(message = "") {
      status.textContent = message;
      status.classList.toggle("is-error", !!message);
    }

    function renderQuestionnaireStep() {
      form.querySelectorAll("[data-questionnaire-step]").forEach((panel, index) => { panel.hidden = index !== currentStep; });
      const percent = Math.round(((currentStep + 1) / steps.length) * 100);
      overlay.querySelector(".questionnaire-progress-label").textContent = `ETAPA ${currentStep + 1} DE ${steps.length}`;
      overlay.querySelector(".questionnaire-progress-percent").textContent = `${percent}%`;
      overlay.querySelector(".questionnaire-progress-fill").style.width = `${percent}%`;
      back.hidden = currentStep === 0;
      next.hidden = currentStep === steps.length - 1;
      submit.hidden = currentStep !== steps.length - 1;
      setStatus();
      overlay.scrollTo({ top: 0, behavior: "instant" });
    }

    function validateQuestionnaireStep(index, focusInvalid = true) {
      const panel = form.querySelector(`[data-questionnaire-step="${index}"]`);
      const invalidControl = [...panel.querySelectorAll("input, textarea, select")].find((control) => !control.checkValidity());
      if (invalidControl) {
        setStatus("Preencha os campos obrigatórios para continuar.");
        if (focusInvalid) {
          invalidControl.reportValidity();
          invalidControl.focus({ preventScroll: true });
          invalidControl.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        return false;
      }
      if (index === 0 && !form.elements.email.value.trim() && !form.elements.whatsapp.value.trim()) {
        setStatus("Informe um e-mail ou WhatsApp para receber o retorno.");
        if (focusInvalid) form.elements.email.focus();
        return false;
      }
      const missingGroup = [...panel.querySelectorAll("[data-required-group]")].find((group) => !group.querySelector("input:checked"));
      if (missingGroup) {
        setStatus("Selecione ao menos uma opção neste bloco.");
        if (focusInvalid) {
          missingGroup.scrollIntoView({ block: "center", behavior: "smooth" });
          missingGroup.querySelector("input")?.focus({ preventScroll: true });
        }
        return false;
      }
      setStatus();
      return true;
    }

    overlay.querySelector(".questionnaire-close")?.addEventListener("click", closeOverlay);
    back.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep -= 1;
        renderQuestionnaireStep();
      }
    });
    next.addEventListener("click", () => {
      if (!validateQuestionnaireStep(currentStep)) return;
      currentStep += 1;
      renderQuestionnaireStep();
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const invalidIndex = steps.findIndex((_, index) => !validateQuestionnaireStep(index, false));
      if (invalidIndex >= 0) {
        currentStep = invalidIndex;
        renderQuestionnaireStep();
        validateQuestionnaireStep(invalidIndex, true);
        return;
      }
      if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        showQuestionnaireSuccess(true);
        return;
      }
      submit.disabled = true;
      submit.textContent = "Enviando…";
      setStatus();
      const formData = new FormData(form);

      // Create Supabase account before submitting questionnaire
      const emailValue = form.elements.email.value.trim();
      const passwordValue = form.elements.senha?.value;
      if (emailValue && passwordValue) {
        try {
          const { error: signUpError } = await window.fitplanCloud.client.auth.signUp({
            email: emailValue,
            password: passwordValue,
            options: { emailRedirectTo: window.location.origin }
          });
          // Ignore "User already registered" — they may be resubmitting
          if (signUpError && !/already registered/i.test(signUpError.message)) {
            throw new Error(window.fitplanCloud.snapshot().error || signUpError.message);
          }
        } catch (err) {
          setStatus(err.message || "Não foi possível criar a conta. Tente novamente.");
          submit.disabled = false;
          submit.textContent = "Enviar questionário";
          return;
        }
      }

      const payload = {
        fullName: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim(),
        whatsapp: form.elements.whatsapp.value.trim(),
        age: form.elements.idade.value,
        heightCm: form.elements.altura_cm.value,
        weightKg: form.elements.peso_kg.value,
        sex: form.elements.sexo.value,
        routine: form.elements.rotina.value.trim(),
        goal: form.elements.objetivo.value.trim(),
        experience: form.elements.experiencia.value.trim(),
        daysAvailable: formData.getAll("dias_disponiveis").map(String),
        unavailableEquipment: form.elements.equipamentos_indisponiveis.value.trim(),
        priorities: formData.getAll("prioridades").map(String),
        avoidExercises: form.elements.exercicios_evitar.value.trim(),
        limitations: form.elements.lesoes_limitacoes.value.trim(),
        cardio: form.elements.cardio.value.trim(),
        recovery: form.elements.recuperacao.value.trim(),
        nutrition: form.elements.alimentacao.value.trim(),
        healthMedications: form.elements.saude_medicacoes.value.trim(),
        expectations: form.elements.expectativas.value.trim(),
        consent: form.elements.consentimento.checked,
        botField: form.elements["bot-field"].value,
        source: window.location.origin
      };
      try {
        const response = await fetch("/.netlify/functions/submit-questionnaire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
        showQuestionnaireSuccess(false);
      } catch (error) {
        console.error("Falha ao enviar questionário", error);
        setStatus(error.message || "Não foi possível enviar agora. Confira sua conexão e tente novamente.");
        submit.disabled = false;
        submit.textContent = "Enviar questionário";
      }
    });

    renderQuestionnaireStep();
  }

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
        state.expandedExerciseKey = null;
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
      const expanded = state.expandedExerciseKey === stateKey;
      const media = expanded ? mediaFor(exercise) : null;
      const prep = getPrepMeta(exercise);
      const restSeconds = exerciseRestSeconds(exercise, stateKey);
      const history = expanded ? getHistoryEntries(stateKey).filter((entry) => Number.isFinite(entry.load)) : [];
      const last = history.at(-1)?.load;
      const personalNote = state.exerciseNotes?.[stateKey] || "";
      const article = document.createElement("article");
      article.className = `exercise${done ? " done" : ""}${index === firstPending ? " is-current" : ""}${expanded ? " is-expanded" : ""}`;
      article.dataset.id = exercise.id;
      article.dataset.stateKey = stateKey;
      article.innerHTML = `
        ${index === firstPending && !done ? `<button class="exercise-play" type="button" aria-label="Iniciar ${escapeHtml(displayName)}">▶</button>` : `<span class="exercise-number">${done ? "✓" : index + 1}</span>`}
        <div class="exercise-main">
          <h2 class="exercise-title">${escapeHtml(displayName)}</h2>
          <div class="compact-meta"><strong>${seriesText(exercise.sets)}</strong><span>•</span><span>${escapeHtml(repsText(variantReps(exercise, variant)))}</span>${variants.length > 1 ? `<span>•</span><span>${variants.length} opções</span>` : ""}${weight ? `<span>•</span><span>${escapeHtml(weight)} kg</span>` : ""}</div>
          ${expanded ? `
            <div class="inline-detail">
              <div class="inline-detail-visual">${media ? `<img class="inline-media-image" src="${media.src}" alt="Demonstração de ${escapeHtml(displayName)}" referrerpolicy="no-referrer" decoding="async">` : `<span>Demonstração não disponível</span>`}</div>
              ${variantButtons(exercise)}
              <div class="inline-detail-grid">
                <span><small>MÚSCULO-ALVO</small><strong>${escapeHtml(prep.group)}</strong></span>
                <span><small>EQUIPAMENTO</small><strong>${escapeHtml(getEquipment(exercise))}</strong></span>
                <span><small>DESCANSO</small><strong>${escapeHtml(restDurationLabel(restSeconds))}</strong></span>
                <span><small>ÚLTIMA CARGA</small><strong>${Number.isFinite(last) ? `${escapeHtml(formatLoad(last))} kg` : "Sem registro"}</strong></span>
              </div>
              <section class="inline-guide">
                <h3>Guia de execução</h3>
                <ol>
                  <li>Prepare o equipamento e adote uma posição estável antes de iniciar.</li>
                  <li>${escapeHtml(variant.note || exercise.note || "Controle a fase de descida e mantenha a amplitude confortável.")}</li>
                  <li>Respeite o RIR indicado: ${escapeHtml(exercise.rir)}.</li>
                </ol>
                ${personalNote ? `<div class="exercise-personal-note"><small>SUA OBSERVAÇÃO</small><p>${escapeHtml(personalNote)}</p></div>` : ""}
              </section>
              <div class="inline-detail-actions">
                <button class="secondary-button inline-history" type="button">Histórico</button>
                <button class="secondary-button inline-actions" type="button">Ajustes</button>
                <button class="primary-button inline-start" type="button">${done ? "Ver séries / corrigir" : "Iniciar exercício"}</button>
              </div>
            </div>` : ""}
        </div>
        <button class="exercise-menu" type="button" aria-label="${expanded ? "Recolher" : "Expandir"} ${escapeHtml(displayName)}">${expanded ? "⌃" : "⋮"}</button>`;
      article.addEventListener("click", (event) => {
        if (event.target.closest(".exercise-play, .inline-start")) {
          event.stopPropagation();
          openActiveExercise(exercise, index);
          return;
        }
        if (event.target.closest(".inline-history")) {
          event.stopPropagation();
          openExerciseHistorySheet(exercise, article.dataset.stateKey || stateKey);
          return;
        }
        if (event.target.closest(".inline-actions")) {
          event.stopPropagation();
          openExerciseActionMenu(exercise, index);
          return;
        }
        if (event.target.closest(".variant-choice")) {
          event.stopPropagation();
          const scrollXBefore = window.scrollX;
          const scrollYBefore = window.scrollY;
          const button = event.target.closest(".variant-choice");
          state.variants = state.variants || {};
          state.variants[exercise.id] = button.dataset.variant;
          const nextVariant = getSelectedVariant(exercise);
          state.expandedExerciseKey = exerciseStateKey(exercise, nextVariant);
          saveProfileState();
          renderApp();
          requestAnimationFrame(() => window.scrollTo(scrollXBefore, scrollYBefore));
          return;
        }
        if (event.target.closest(".exercise-menu")) {
          event.stopPropagation();
          const scrollXBefore = window.scrollX;
          const scrollYBefore = window.scrollY;
          state.expandedExerciseKey = state.expandedExerciseKey === stateKey ? null : stateKey;
          saveProfileState();
          renderApp();
          requestAnimationFrame(() => window.scrollTo(scrollXBefore, scrollYBefore));
          return;
        }
        if (event.target.closest("button,input,label,a,summary,details")) return;
        const scrollXBefore = window.scrollX;
        const scrollYBefore = window.scrollY;
        state.expandedExerciseKey = state.expandedExerciseKey === stateKey ? null : stateKey;
        saveProfileState();
        renderApp();
        requestAnimationFrame(() => window.scrollTo(scrollXBefore, scrollYBefore));
      });
      const detailImage = article.querySelector(".inline-media-image");
      bindMediaErrorFallback(detailImage, media, "inline-media-empty");
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
    const targetGroup = getPrepMeta(exercise).group;
    return `<section class="exercise-alternatives" aria-labelledby="alternatives-title-${escapeHtml(exercise.id)}">
      <div class="alternatives-heading"><div><small>ALTERNATIVAS PARA</small><strong id="alternatives-title-${escapeHtml(exercise.id)}">${escapeHtml(targetGroup)}</strong></div><span>${variants.length} opções</span></div>
      <p>Escolha conforme o equipamento disponível. As séries e o esforço prescritos permanecem.</p>
      <div class="variant-picker" role="group" aria-label="Alternativas de exercício">${variants.map((variant) => {
      const isSelected = variant.key === selected.key;
      return `<button class="pill-button variant-choice ${isSelected ? "is-selected" : ""}" type="button" data-variant="${escapeHtml(variant.key)}" aria-pressed="${isSelected}">${escapeHtml(variant.label)}</button>`;
    }).join("")}</div></section>`;
  }

  function lastRecordedLoad(key) {
    return getHistoryEntries(key).filter((entry) => Number.isFinite(entry.load)).at(-1)?.load;
  }

  function exerciseRestSeconds(exercise, key) {
    const custom = Number(state.exerciseRest?.[key]);
    return Number.isFinite(custom) && custom > 0 ? custom : Number(exercise.restSeconds || 0);
  }

  function restDurationLabel(seconds) {
    if (!seconds) return "Sem cronômetro";
    if (seconds % 60 === 0) return `${seconds / 60} min`;
    return `${seconds} s`;
  }

  function showDetailToast(message) {
    overlay.querySelector(".exercise-action-toast")?.remove();
    document.querySelector(".exercise-action-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "exercise-action-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    (overlay.querySelector(".detail-page") || document.body).appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function keepExerciseExpanded(exercise, key) {
    state.expandedExerciseKey = key || exerciseStateKey(exercise, getSelectedVariant(exercise));
    saveProfileState();
    renderWorkout();
  }

  function openExerciseRestEditor(exercise, key) {
    const prescribed = Number(exercise.restSeconds || 0);
    const current = exerciseRestSeconds(exercise, key) || 60;
    const presets = [...new Set([45, 60, 75, 90, 120, 180, current])].sort((a, b) => a - b);
    const sheet = showActionSheet("Ajustar descanso", `
      <p class="exercise-sheet-intro">Defina o cronômetro desta alternativa. O descanso padrão do treino é ${escapeHtml(restDurationLabel(prescribed))}.</p>
      <div class="rest-preset-grid">${presets.map((seconds) => `<button class="rest-preset ${seconds === current ? "is-selected" : ""}" type="button" data-seconds="${seconds}">${escapeHtml(restDurationLabel(seconds))}</button>`).join("")}</div>
      <label class="exercise-sheet-field"><span>Tempo personalizado (segundos)</span><input class="custom-rest-input" type="number" inputmode="numeric" min="15" max="600" step="15" value="${current}"></label>
      <div class="exercise-sheet-actions"><button class="primary-button save-rest" type="button">Salvar descanso</button><button class="secondary-button reset-rest" type="button">Usar padrão do treino</button></div>`);
    const input = sheet.querySelector(".custom-rest-input");
    sheet.querySelectorAll(".rest-preset").forEach((button) => button.addEventListener("click", () => {
      input.value = button.dataset.seconds;
      sheet.querySelectorAll(".rest-preset").forEach((item) => item.classList.toggle("is-selected", item === button));
    }));
    sheet.querySelector(".save-rest").addEventListener("click", () => {
      const seconds = Math.max(15, Math.min(600, Math.round(Number(input.value || current))));
      state.exerciseRest = state.exerciseRest || {};
      if (seconds === prescribed) delete state.exerciseRest[key];
      else state.exerciseRest[key] = seconds;
      saveProfileState();
      closeActionSheet();
      showDetailToast(`Descanso definido em ${restDurationLabel(seconds)}.`);
    });
    sheet.querySelector(".reset-rest").addEventListener("click", () => {
      state.exerciseRest = state.exerciseRest || {};
      delete state.exerciseRest[key];
      saveProfileState();
      closeActionSheet();
      showDetailToast(`Descanso restaurado para ${restDurationLabel(prescribed)}.`);
    });
  }

  function openExerciseNoteEditor(exercise, index, key) {
    const currentNote = state.exerciseNotes?.[key] || "";
    const sheet = showActionSheet("Observação pessoal", `
      <p class="exercise-sheet-intro">Salve regulagem, pegada, desconforto ou uma dica para a próxima sessão.</p>
      <label class="exercise-sheet-field"><span>Observação sobre ${escapeHtml(getSelectedVariant(exercise).displayName || exercise.name)}</span><textarea class="exercise-note-input" maxlength="300" rows="5" placeholder="Ex.: banco na posição 4 e pés um pouco mais altos.">${escapeHtml(currentNote)}</textarea></label>
      <small class="note-counter">${currentNote.length}/300</small>
      <div class="exercise-sheet-actions"><button class="primary-button save-note" type="button">Salvar observação</button><button class="secondary-button clear-note" type="button" ${currentNote ? "" : "disabled"}>Remover observação</button></div>`);
    const input = sheet.querySelector(".exercise-note-input");
    const counter = sheet.querySelector(".note-counter");
    input.addEventListener("input", () => { counter.textContent = `${input.value.length}/300`; });
    sheet.querySelector(".save-note").addEventListener("click", () => {
      state.exerciseNotes = state.exerciseNotes || {};
      const note = input.value.trim();
      if (note) state.exerciseNotes[key] = note;
      else delete state.exerciseNotes[key];
      saveProfileState();
      closeActionSheet();
      keepExerciseExpanded(exercise, key);
      showDetailToast(note ? "Observação salva." : "Observação removida.");
    });
    sheet.querySelector(".clear-note")?.addEventListener("click", () => {
      state.exerciseNotes = state.exerciseNotes || {};
      delete state.exerciseNotes[key];
      saveProfileState();
      closeActionSheet();
      keepExerciseExpanded(exercise, key);
      showDetailToast("Observação removida.");
    });
  }

  function openExerciseHistorySheet(exercise, key) {
    const variant = getSelectedVariant(exercise);
    const entries = getHistoryEntries(key)
      .filter((entry) => Number.isFinite(entry.load))
      .slice()
      .reverse();
    const best = entries.reduce((maximum, entry) => Math.max(maximum, entry.load), 0);
    showActionSheet("Histórico do exercício", `
      <p class="exercise-sheet-exercise">${escapeHtml(variant.displayName || variant.label || exercise.name)}</p>
      ${entries.length ? `<div class="exercise-history-summary"><span><small>ÚLTIMA CARGA</small><strong>${escapeHtml(formatLoad(entries[0].load))} kg</strong></span><span><small>MELHOR CARGA</small><strong>${escapeHtml(formatLoad(best))} kg</strong></span></div>
      <div class="exercise-history-list">${entries.slice(0, 16).map((entry) => {
        const workoutName = profiles[currentProfile]?.workouts?.[entry.tab]?.title || "Treino";
        return `<article><span><strong>${escapeHtml(prettyDate(entry.date))}</strong><small>${escapeHtml(workoutName.replace(/^[^•]+•\s*/, ""))}</small></span><b>${escapeHtml(formatLoad(entry.load))} kg</b></article>`;
      }).join("")}</div>` : `<div class="exercise-sheet-empty">As cargas concluídas desta alternativa aparecerão aqui.</div>`}
    `);
  }

  function resetExerciseToday(exercise, index, key) {
    state.seriesProgress = state.seriesProgress || {};
    state.seriesProgress[key] = [];
    delete state.done[key];
    removeCurrentExerciseHistory(key);
    state.sessions = (state.sessions || []).filter((session) => !(session.date === todayKey && session.tab === activeTab));
    saveProfileState();
    closeActionSheet();
    renderWorkout();
    keepExerciseExpanded(exercise, key);
    showDetailToast("Exercício reiniciado para hoje.");
  }

  function openExerciseActionMenu(exercise, index) {
    const variant = getSelectedVariant(exercise);
    const key = exerciseStateKey(exercise, variant);
    const variants = getExerciseVariants(exercise);
    const lastLoad = lastRecordedLoad(key);
    const currentRest = exerciseRestSeconds(exercise, key);
    const hasCustomRest = Number.isFinite(Number(state.exerciseRest?.[key]));
    const personalNote = state.exerciseNotes?.[key] || "";
    const hasTodayProgress = !!state.done[key] || !!state.seriesProgress?.[key]?.length;
    const canUseLoad = exercise.trackWeight !== false && Number.isFinite(lastLoad);
    const sheet = showActionSheet("Ações do exercício", `
      <p class="exercise-sheet-exercise">${escapeHtml(variant.displayName || variant.label || exercise.name)}</p>
      <div class="exercise-action-list">
        <button class="exercise-action use-last-load" type="button" ${canUseLoad ? "" : "disabled"}><span class="exercise-action-icon">↶</span><span><strong>${canUseLoad ? `Usar última carga — ${escapeHtml(formatLoad(lastLoad))} kg` : "Usar última carga"}</strong><small>${canUseLoad ? "Preenche a carga sem registrar uma série" : exercise.trackWeight === false ? "Este exercício não registra carga" : "Nenhuma carga anterior encontrada"}</small></span></button>
        <button class="exercise-action open-exercise-history" type="button"><span class="exercise-action-icon">◷</span><span><strong>Ver histórico do exercício</strong><small>Cargas e sessões registradas</small></span></button>
        <button class="exercise-action choose-variant" type="button" ${variants.length > 1 ? "" : "disabled"}><span class="exercise-action-icon">⇄</span><span><strong>Trocar alternativa</strong><small>${variants.length > 1 ? `${variants.length} opções para este grupo muscular` : "Não há alternativas cadastradas"}</small></span></button>
        <button class="exercise-action edit-rest" type="button" ${exercise.restSeconds > 0 ? "" : "disabled"}><span class="exercise-action-icon">◴</span><span><strong>Ajustar descanso</strong><small>${hasCustomRest ? "Personalizado" : "Padrão"}: ${escapeHtml(restDurationLabel(currentRest))}</small></span></button>
        <button class="exercise-action edit-note" type="button"><span class="exercise-action-icon">✎</span><span><strong>${personalNote ? "Editar observação" : "Adicionar observação"}</strong><small>${personalNote ? escapeHtml(personalNote) : "Regulagem, técnica ou desconforto"}</small></span></button>
        <button class="exercise-action danger reset-exercise" type="button" ${hasTodayProgress ? "" : "disabled"}><span class="exercise-action-icon">↺</span><span><strong>Reiniciar exercício hoje</strong><small>${hasTodayProgress ? "Remove as séries concluídas de hoje" : "Nenhuma série concluída hoje"}</small></span></button>
      </div>`);
    sheet.querySelector(".use-last-load")?.addEventListener("click", () => {
      state.weights = state.weights || {};
      state.weights[key] = String(lastLoad);
      saveProfileState();
      closeActionSheet();
      showDetailToast(`Carga preparada: ${formatLoad(lastLoad)} kg.`);
    });
    sheet.querySelector(".open-exercise-history")?.addEventListener("click", () => {
      closeActionSheet();
      openExerciseHistorySheet(exercise, key);
    });
    sheet.querySelector(".choose-variant")?.addEventListener("click", () => {
      closeActionSheet();
      state.expandedExerciseKey = key;
      saveProfileState();
      renderWorkout();
      const alternatives = document.querySelector(`[data-state-key="${CSS.escape(key)}"] .exercise-alternatives`);
      alternatives?.scrollIntoView({ behavior: "smooth", block: "center" });
      alternatives?.querySelector(".variant-choice")?.focus({ preventScroll: true });
    });
    sheet.querySelector(".edit-rest")?.addEventListener("click", () => {
      closeActionSheet();
      openExerciseRestEditor(exercise, key);
    });
    sheet.querySelector(".edit-note")?.addEventListener("click", () => {
      closeActionSheet();
      openExerciseNoteEditor(exercise, index, key);
    });
    sheet.querySelector(".reset-exercise")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      if (button.dataset.confirm !== "true") {
        button.dataset.confirm = "true";
        button.classList.add("is-confirm");
        button.querySelector("strong").textContent = "Confirmar reinício";
        button.querySelector("small").textContent = "Toque novamente para remover as séries de hoje";
        window.setTimeout(() => {
          if (!button.isConnected || button.dataset.confirm !== "true") return;
          button.dataset.confirm = "false";
          button.classList.remove("is-confirm");
          button.querySelector("strong").textContent = "Reiniciar exercício hoje";
          button.querySelector("small").textContent = "Remove as séries concluídas de hoje";
        }, 6000);
        return;
      }
      resetExerciseToday(exercise, index, key);
    });
  }

  function openExerciseDetail(exercise, index) {
    const scrollXBefore = window.scrollX;
    const scrollYBefore = window.scrollY;
    const variant = getSelectedVariant(exercise);
    const stateKey = exerciseStateKey(exercise, variant);
    state.expandedExerciseKey = state.expandedExerciseKey === stateKey ? null : stateKey;
    saveProfileState();
    renderWorkout();
    requestAnimationFrame(() => window.scrollTo(scrollXBefore, scrollYBefore));
    return;
    const isDone = !!state.done[stateKey];
    const media = mediaFor(exercise);
    const prep = getPrepMeta(exercise);
    const history = getHistoryEntries(stateKey).filter((entry) => Number.isFinite(entry.load));
    const last = history.at(-1)?.load;
    const personalNote = state.exerciseNotes?.[stateKey] || "";
    const variantMarkup = variantButtons(exercise);
    showOverlay(`<div class="overlay-page detail-page ${variantMarkup ? "has-variants" : "no-variants"}">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Voltar">←</button><h2>${escapeHtml(variant.displayName || variant.label || exercise.name)}</h2><button class="overlay-more" type="button" aria-label="Mais opções">⋮</button></header>
      <div class="exercise-media">${media ? `<img class="detail-media-image" src="${media.src}" alt="Demonstração de ${escapeHtml(exercise.name)}" referrerpolicy="no-referrer" decoding="async">` : `<div class="exercise-media-empty">Demonstração não disponível</div>`}<button class="play-fab" type="button" aria-label="Iniciar exercício">▶</button></div>
      ${variantMarkup}
      <div class="detail-metrics"><div class="detail-metric"><small>${icon("target")} MÚSCULO-ALVO</small><strong>${escapeHtml(prep.group)}</strong></div><div class="detail-metric"><small>${icon("equipment")} EQUIPAMENTO</small><strong>${escapeHtml(getEquipment(exercise))}</strong></div></div>
      <section class="guide-card"><h3><span style="color:var(--fit-lime)">▤</span> Guia de execução</h3><ol class="guide-list"><li>Prepare o equipamento e adote uma posição estável antes de iniciar.</li><li>${escapeHtml(variant.note || exercise.note || "Controle a fase de descida e mantenha a amplitude confortável.")}</li><li>Finalize cada repetição sem perder a técnica e respeite o RIR indicado: ${escapeHtml(exercise.rir)}.</li></ol>${personalNote ? `<div class="exercise-personal-note"><small>SUA OBSERVAÇÃO</small><p>${escapeHtml(personalNote)}</p></div>` : ""}</section>
      <div class="history-strip"><div><small>ÚLTIMA CARGA</small><strong>${Number.isFinite(last) ? `${formatLoad(last)} kg` : "Sem registro"}</strong></div><button class="text-button detail-history" type="button">Histórico</button></div>
      <button class="primary-button detail-start" type="button">${isDone ? "✓ &nbsp; VER SÉRIES / CORRIGIR" : "▶ &nbsp; INICIAR EXERCÍCIO"}</button>
    </div>`);
    overlay.querySelector(".overlay-close").addEventListener("click", closeOverlay);
    overlay.querySelector(".overlay-more").addEventListener("click", () => openExerciseActionMenu(exercise, index));
    const detailImage = overlay.querySelector(".detail-media-image");
    bindMediaErrorFallback(detailImage, media);
    overlay.querySelector(".play-fab").addEventListener("click", () => openActiveExercise(exercise, index));
    overlay.querySelector(".detail-start").addEventListener("click", () => openActiveExercise(exercise, index));
    overlay.querySelector(".detail-history").addEventListener("click", () => openExerciseHistorySheet(exercise, stateKey));
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
    const isFinished = series.length >= totalSets;
    const load = parseLoad(state.weights[key]) || 0;
    const reps = defaultReps({ ...exercise, reps: variantReps(exercise, variant) });
    showOverlay(`<div class="overlay-page active-page">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Fechar">×</button><h2 style="color:var(--fit-lime)">FitPlan</h2><span></span></header>
      <span class="set-chip">${isFinished ? `${totalSets} de ${totalSets} séries concluídas` : `Série ${series.length + 1} de ${totalSets}`}</span>
      <h1 class="active-title">${escapeHtml(variant.displayName || variant.label || exercise.name)}</h1>
      <div class="active-tags"><span>${escapeHtml(getPrepMeta(exercise).group)}</span><span>${escapeHtml(getEquipment(exercise))}</span></div>
      <div class="stepper-card load-card"><small>CARGA (KG)</small><div class="stepper"><button type="button" data-adjust="load:-1" aria-label="Diminuir carga">−</button><input id="activeLoad" type="number" inputmode="decimal" min="0" step="0.5" value="${load}" aria-label="Carga em quilogramas"><button type="button" data-adjust="load:1" aria-label="Aumentar carga">+</button></div><div class="quick-adjust" aria-label="Ajustes rápidos de carga"><button type="button" data-quick-load="-10">−10</button><button type="button" data-quick-load="2.5">+2,5</button><button type="button" data-quick-load="5">+5</button><button type="button" data-quick-load="10">+10</button></div></div>
      <div class="stepper-card"><small>REPS</small><div class="stepper"><button type="button" data-adjust="reps:-1" aria-label="Diminuir repetições">−</button><input id="activeReps" type="number" inputmode="numeric" min="0" step="1" value="${reps}" aria-label="Número de repetições"><button type="button" data-adjust="reps:1" aria-label="Aumentar repetições">+</button></div></div>
      <div class="active-set-actions">
        ${isFinished ? `<p class="active-complete-note">Exercício concluído. Você pode desfazer a última série para corrigir carga ou repetições.</p>` : `<button class="primary-button complete-set" type="button">Concluir série &nbsp; ✓</button>`}
        ${series.length ? `<button class="secondary-button undo-last-set" type="button">↶ &nbsp; Desfazer última série</button>` : ""}
      </div>
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
    overlay.querySelector(".complete-set")?.addEventListener("click", completeActiveSet);
    overlay.querySelector(".undo-last-set")?.addEventListener("click", undoLastActiveSet);
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
    const restSeconds = exerciseRestSeconds(exercise, key);
    if (getSettings().autoRest && restSeconds > 0 && !isFinished) startRest(restSeconds);
    if (isFinished) {
      const allDone = selectedExercises().every((item) => state.done[exerciseStateKey(item, getSelectedVariant(item))]);
      closeOverlay();
      renderWorkout();
      if (allDone) showWorkoutSummary();
      return;
    }
    openActiveExercise(exercise, activeExerciseIndex);
  }

  function removeCurrentExerciseHistory(key) {
    if (!state.history?.[key]) return;
    state.history[key] = state.history[key].filter((entry) => !(entry.date === todayKey && entry.tab === activeTab));
    if (!state.history[key].length) delete state.history[key];
  }

  function undoLastActiveSet() {
    if (!activeExercise) return;
    const exercise = activeExercise;
    const variant = getSelectedVariant(exercise);
    const key = exerciseStateKey(exercise, variant);
    const series = activeSeriesFor(key);
    if (!series.length) return;
    series.pop();
    state.seriesProgress[key] = series;
    const totalSets = parseSets(exercise);
    const remainsFinished = series.length >= totalSets;
    if (remainsFinished) {
      state.done[key] = true;
      const latestLoad = series.at(-1)?.load;
      if (Number.isFinite(latestLoad)) recordExerciseHistory(exercise, variant, latestLoad);
    } else {
      delete state.done[key];
      removeCurrentExerciseHistory(key);
      state.sessions = (state.sessions || []).filter((session) => !(session.date === todayKey && session.tab === activeTab));
    }
    const latestSet = series.at(-1);
    if (latestSet && Number.isFinite(latestSet.load)) state.weights[key] = String(latestSet.load);
    saveProfileState();
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

  function prettyTime(value) {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function sessionCompletedLabel(session) {
    const date = prettyDate(session.date);
    const time = prettyTime(session.completedAt);
    return time ? `${date} às ${time}` : date;
  }

  function renderHistoryView() {
    const view = document.querySelector("#view-history");
    if (!view || !state) return;
    const sessions = sessionData();
    const monthKey = todayKey.slice(0, 7);
    const monthSessions = sessions.filter((session) => session.date?.startsWith(monthKey));
    const volume = monthSessions.reduce((sum, session) => sum + (session.volume || 0), 0);
    view.innerHTML = `<div class="screen-heading"><h2>Histórico de Treinos</h2></div><div class="metric-grid"><article class="stat-card"><small>TREINOS NO MÊS</small><strong>${monthSessions.length}</strong></article><article class="stat-card"><small>VOLUME TOTAL</small><strong class="neutral">${(volume / 1000).toFixed(1)}<small style="display:inline"> t</small></strong></article><article class="stat-card wide-card"><small>SEQUÊNCIA ATUAL</small><strong>${Math.min(sessions.length, 7)}<small style="display:inline"> dias</small></strong><div class="streak-bars">${Array.from({length:7},(_,i)=>`<i class="${i < Math.min(sessions.length,7) ? "on" : ""}"></i>`).join("")}</div></article></div><div class="section-title"><h3>Últimos treinos</h3></div><div class="session-list">${sessions.length ? sessions.slice(0, 12).map((session) => `<article class="session-card"><span class="session-icon">${icon("workout")}</span><div><h4>${escapeHtml(session.title.replace(/^[^•]+•\s*/, ""))}</h4><p>◷ ${escapeHtml(sessionCompletedLabel(session))} &nbsp; • &nbsp; ${session.exercises || 0} exercícios</p></div><span class="status-chip">✓ Concluído</span></article>`).join("") : `<article class="content-card" style="padding:24px;color:var(--fit-muted)">Seus treinos concluídos aparecerão aqui.</article>`}</div>`;
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

  const ADMIN_STATUS_LABELS = {
    pending: "Pendente",
    reviewing: "Em análise",
    approved: "Aprovado",
    rejected: "Recusado",
    archived: "Arquivado"
  };

  const ADMIN_ANSWER_LABELS = [
    ["age", "Idade"],
    ["height_cm", "Altura"],
    ["weight_kg", "Peso"],
    ["sex", "Sexo"],
    ["routine", "Rotina"],
    ["goal", "Objetivo"],
    ["experience", "Experiência"],
    ["days_available", "Dias disponíveis"],
    ["unavailable_equipment", "Equipamentos indisponíveis"],
    ["priorities", "Prioridades musculares"],
    ["avoid_exercises", "Exercícios a evitar"],
    ["limitations", "Lesões, dores e limitações"],
    ["cardio", "Cardio"],
    ["recovery", "Recuperação"],
    ["nutrition", "Alimentação"],
    ["health_medications", "Saúde e medicações"],
    ["expectations", "Expectativas"],
    ["source", "Origem"]
  ];

  function adminDate(value) {
    if (!value) return "—";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  }

  function adminAnswerValue(key, value) {
    if (Array.isArray(value)) return value.join(", ");
    if (key === "height_cm" && value !== undefined && value !== null) return `${value} cm`;
    if (key === "weight_kg" && value !== undefined && value !== null) return `${value} kg`;
    if (key === "age" && value !== undefined && value !== null) return `${value} anos`;
    return String(value ?? "—");
  }

  function normalizeProfileMatch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  }

  function legacyProfileOptionsMarkup(submission) {
    const selected = normalizeProfileMatch(submission.full_name);
    const options = Object.keys(profiles).map((id) => {
      const name = profileName(id);
      const isSelected = selected && normalizeProfileMatch(name) === selected;
      return `<option value="${escapeHtml(id)}"${isSelected ? " selected" : ""}>${escapeHtml(name)}</option>`;
    }).join("");
    return `<label class="admin-legacy-link"><span>Perfil antigo para liberar no app</span><select class="admin-legacy-profile"><option value="">Apenas aprovar, sem vincular treino antigo</option>${options}</select><small>Para usuários antigos, escolha o perfil correto antes de aprovar. Sem isso, o login entra, mas o treino não aparece.</small></label>`;
  }

  async function adminQuestionnaireRequest(options = {}) {
    const cloud = cloudSnapshot();
    const token = cloud.session?.access_token;
    if (!token || cloud.profile?.role !== "admin") throw new Error("Entre com a conta administrativa para continuar.");
    const result = await fetch("/.netlify/functions/admin-questionnaires", {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    let payload = {};
    try { payload = await result.json(); } catch { payload = {}; }
    if (!result.ok) throw new Error(payload.error || "Não foi possível concluir a operação.");
    return payload;
  }

  function adminSubmissionMarkup(submission, focusId) {
    const answers = submission.answers || {};
    const status = ADMIN_STATUS_LABELS[submission.status] || submission.status;
    const open = submission.id === focusId ? " open" : "";
    const canApprove = Boolean(submission.email) && submission.status !== "approved";
    const canRelink = submission.status === "approved" && Boolean(submission.user_id);
    const canReject = !["approved", "rejected", "archived"].includes(submission.status);
    const contact = [submission.email, submission.whatsapp].filter(Boolean).join(" • ") || "Sem contato";
    const answerRows = ADMIN_ANSWER_LABELS
      .filter(([key]) => answers[key] !== undefined && answers[key] !== null && String(answers[key]).length)
      .map(([key, label]) => `<div class="admin-answer-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(adminAnswerValue(key, answers[key]))}</dd></div>`)
      .join("");
    return `<details class="admin-request-card" data-request-id="${escapeHtml(submission.id)}" data-status="${escapeHtml(submission.status)}"${open}>
      <summary>
        <span class="admin-request-avatar" aria-hidden="true">${escapeHtml(String(submission.full_name || "?").trim().charAt(0).toUpperCase())}</span>
        <span class="admin-request-summary"><strong>${escapeHtml(submission.full_name)}</strong><small>${escapeHtml(contact)}</small><small>Recebida em ${escapeHtml(adminDate(submission.created_at))}</small></span>
        <span class="admin-status-chip is-${escapeHtml(submission.status)}">${escapeHtml(status)}</span>
      </summary>
      <div class="admin-request-detail">
        <div class="admin-request-meta"><span><small>CONSENTIMENTO</small><strong>${escapeHtml(adminDate(submission.consent_at))}</strong></span><span><small>IDENTIFICADOR</small><strong>${escapeHtml(submission.id.slice(0, 8))}</strong></span></div>
        <dl class="admin-answer-list">${answerRows}</dl>
        ${submission.review_note ? `<div class="admin-review-note"><small>OBSERVAÇÃO DA REVISÃO</small><p>${escapeHtml(submission.review_note)}</p></div>` : ""}
        ${submission.status === "approved" && !canRelink ? "" : legacyProfileOptionsMarkup(submission)}
        <div class="admin-request-actions">
          ${submission.status === "approved" ? `<div class="admin-approved-note">✓ Conta aprovada${submission.invitation_sent_at ? ` • convite enviado em ${escapeHtml(adminDate(submission.invitation_sent_at))}` : ""}</div>${canRelink ? `<button class="secondary-button admin-approve" type="button">Atualizar vínculo</button>` : ""}` : `<button class="primary-button admin-approve" type="button" ${canApprove ? "" : "disabled"}>${submission.status === "reviewing" ? "Tentar aprovação novamente" : "Aprovar e convidar"}</button>`}
          ${canReject ? `<button class="secondary-button admin-reject" type="button">Recusar</button>` : ""}
        </div>
        ${!submission.email && submission.status !== "approved" ? `<p class="admin-action-hint">A aprovação automática exige um e-mail. Entre em contato pelo WhatsApp e atualize a solicitação antes de aprovar.</p>` : ""}
        <p class="admin-card-status" role="status" aria-live="polite"></p>
      </div>
    </details>`;
  }

  function wireAdminSubmissionActions(container, submissions) {
    container.querySelectorAll(".admin-request-card").forEach((card) => {
      const submission = submissions.find((item) => item.id === card.dataset.requestId);
      if (!submission) return;
      const status = card.querySelector(".admin-card-status");
      card.querySelector(".admin-approve")?.addEventListener("click", async () => {
        const isRelink = submission.status === "approved";
        if (!window.confirm(isRelink ? `Atualizar o vínculo de perfil de ${submission.full_name}?` : `Aprovar ${submission.full_name} e enviar o convite de acesso?`)) return;
        const buttons = card.querySelectorAll("button");
        buttons.forEach((button) => { button.disabled = true; });
        status.textContent = isRelink ? "Atualizando vínculo do perfil antigo…" : "Criando a conta, vinculando o questionário e abrindo o plano em rascunho…";
        status.className = "admin-card-status";
        try {
          const legacyProfileKey = card.querySelector(".admin-legacy-profile")?.value || null;
          const result = await adminQuestionnaireRequest({ method: "POST", body: { action: "approve", id: submission.id, legacyProfileKey } });
          status.textContent = isRelink ? "Vínculo atualizado." : (result.invited ? "Cadastro aprovado e convite enviado." : "Cadastro aprovado e vinculado a uma conta existente.");
          status.classList.add("is-success");
          window.setTimeout(() => openAdminQuestionnaires(submission.id), 700);
        } catch (error) {
          status.textContent = error.message;
          status.classList.add("is-error");
          buttons.forEach((button) => { button.disabled = false; });
        }
      });
      card.querySelector(".admin-reject")?.addEventListener("click", async () => {
        const note = window.prompt(`Motivo interno para recusar a solicitação de ${submission.full_name}:`, "");
        if (note === null) return;
        if (!window.confirm("Confirmar a recusa desta solicitação?")) return;
        const buttons = card.querySelectorAll("button");
        buttons.forEach((button) => { button.disabled = true; });
        status.textContent = "Registrando a decisão…";
        status.className = "admin-card-status";
        try {
          await adminQuestionnaireRequest({ method: "POST", body: { action: "reject", id: submission.id, note } });
          status.textContent = "Solicitação recusada.";
          status.classList.add("is-success");
          window.setTimeout(() => openAdminQuestionnaires(submission.id), 700);
        } catch (error) {
          status.textContent = error.message;
          status.classList.add("is-error");
          buttons.forEach((button) => { button.disabled = false; });
        }
      });
    });
  }

  function renderAdminQuestionnaires(container, submissions, focusId = "") {
    const counts = submissions.reduce((result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }), {});
    container.innerHTML = `<div class="admin-filter-bar" role="group" aria-label="Filtrar solicitações">
      <button class="admin-filter is-active" type="button" data-filter="all">Todas <span>${submissions.length}</span></button>
      <button class="admin-filter" type="button" data-filter="pending">Pendentes <span>${counts.pending || 0}</span></button>
      <button class="admin-filter" type="button" data-filter="approved">Aprovadas <span>${counts.approved || 0}</span></button>
      <button class="admin-filter" type="button" data-filter="rejected">Recusadas <span>${counts.rejected || 0}</span></button>
    </div>
    <p class="admin-page-status" role="status" aria-live="polite">${submissions.length ? `${submissions.length} solicitação(ões) encontrada(s).` : "Nenhuma solicitação recebida."}</p>
    <div class="admin-request-list">${submissions.map((submission) => adminSubmissionMarkup(submission, focusId)).join("") || `<div class="admin-empty-state"><span>✓</span><strong>Nenhuma solicitação por aqui</strong><p>Novos questionários aparecerão automaticamente.</p></div>`}</div>`;
    container.querySelectorAll(".admin-filter").forEach((button) => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      container.querySelectorAll(".admin-filter").forEach((item) => item.classList.toggle("is-active", item === button));
      container.querySelectorAll(".admin-request-card").forEach((card) => { card.hidden = filter !== "all" && card.dataset.status !== filter; });
    }));
    wireAdminSubmissionActions(container, submissions);
    if (focusId) container.querySelector(`[data-request-id="${CSS.escape(focusId)}"]`)?.scrollIntoView({ block: "start" });
  }

  async function openAdminQuestionnaires(focusId = "") {
    showOverlay(`<div class="overlay-page admin-questionnaires-page"><header class="overlay-header"><button class="overlay-close" type="button" aria-label="Voltar">←</button><h2>Administração</h2><button class="admin-refresh" type="button" aria-label="Atualizar solicitações">↻</button></header><div class="screen-heading"><p class="eyebrow">NOVOS USUÁRIOS</p><h2>Solicitações de cadastro</h2><p>Revise o questionário. A aprovação cria a conta, vincula os dados e abre um plano em rascunho.</p></div><div class="admin-questionnaires-content"><div class="admin-loading"><span></span><p>Carregando solicitações…</p></div></div></div>`);
    overlay.querySelector(".overlay-close")?.addEventListener("click", closeOverlay);
    const content = overlay.querySelector(".admin-questionnaires-content");
    const load = async () => {
      content.innerHTML = `<div class="admin-loading"><span></span><p>Carregando solicitações…</p></div>`;
      try {
        const result = await adminQuestionnaireRequest();
        renderAdminQuestionnaires(content, result.submissions || [], focusId);
      } catch (error) {
        content.innerHTML = `<div class="admin-empty-state is-error"><span>!</span><strong>Não foi possível carregar</strong><p>${escapeHtml(error.message)}</p><button class="secondary-button admin-retry" type="button">Tentar novamente</button></div>`;
        content.querySelector(".admin-retry")?.addEventListener("click", load);
      }
    };
    overlay.querySelector(".admin-refresh")?.addEventListener("click", load);
    await load();
  }

  function maybeOpenRequestedAdminRequest(cloud = cloudSnapshot()) {
    if (adminRouteHandled || !cloud.ready || !cloud.user || cloud.profile?.role !== "admin") return;
    const query = new URLSearchParams(window.location.search);
    if (query.get("admin") !== "requests") return;
    adminRouteHandled = true;
    const requestId = query.get("request") || "";
    window.setTimeout(() => openAdminQuestionnaires(requestId), 0);
    query.delete("admin");
    query.delete("request");
    const nextUrl = `${window.location.pathname}${query.toString() ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function renderProfileView() {
    const view = document.querySelector("#view-profile");
    if (!view || !currentProfile) return;
    const settings = getSettings();
    const science = SCIENCE_BASE[currentProfile];
    const adminSection = cloudSnapshot().profile?.role === "admin" ? `<p class="settings-label admin-settings-label">ADMINISTRAÇÃO</p><div class="settings-group admin-entry-group"><button class="settings-row admin-entry" type="button" data-action="admin-requests"><span class="row-icon">⌁</span><span><strong>Solicitações de cadastro</strong><small>Analisar questionários e liberar acessos</small></span><span class="chevron">›</span></button></div>` : "";
    view.innerHTML = `<div class="profile-layout"><section class="profile-hero"><div class="profile-hero-avatar" data-avatar-profile="${currentProfile}">${initialsFor(currentProfile)}</div><h2>${escapeHtml(profileName(currentProfile))}</h2><button class="pill-button edit-profile" type="button">Editar perfil</button></section><section>${adminSection}<p class="settings-label science-settings-label">PLANO ATUAL</p><div class="settings-group science-entry-group"><button class="settings-row science-entry" type="button" data-action="science"><span class="row-icon">⌬</span><span><strong>Science Base</strong><small>${escapeHtml(science?.goal || "Entenda as decisões do seu treino")}</small></span><span class="chevron">›</span></button></div><p class="settings-label">GERAL</p><div class="settings-group"><button class="settings-row toggle-setting" type="button" data-setting="notifications"><span class="row-icon">♢</span><span>Notificações</span><span class="toggle ${settings.notifications ? "on" : ""}"></span></button></div><p class="settings-label">TREINO</p><div class="settings-group"><button class="settings-row toggle-setting" type="button" data-setting="autoRest"><span class="row-icon">◷</span><span>Cronômetro automático<small>Inicia após cada série</small></span><span class="toggle ${settings.autoRest ? "on" : ""}"></span></button><button class="settings-row toggle-setting" type="button" data-setting="sound"><span class="row-icon">◖</span><span>Efeitos sonoros</span><span class="toggle ${settings.sound ? "on" : ""}"></span></button><button class="settings-row" type="button" data-action="reset"><span class="row-icon">↺</span><span>Limpar treino do dia</span><span class="chevron">›</span></button></div><p class="settings-label">DADOS</p><div class="settings-group"><button class="settings-row cloud-settings-row" type="button" data-action="cloud"><span class="row-icon">↗</span><span>Conta online<small>${escapeHtml(cloudAccountLabel())}</small></span><span class="cloud-status-dot ${cloudSnapshot().user ? "is-online" : ""}" aria-hidden="true"></span></button>${legacyMigrationButtonMarkup()}<button class="settings-row" type="button" data-action="data"><span class="row-icon">⇅</span><span>Importar e exportar<small>Backup dos seus dados</small></span><span class="chevron">›</span></button><button class="settings-row" type="button" data-action="logout"><span class="row-icon">←</span><span>Sair da conta</span><span class="chevron">›</span></button></div></section></div>`;
    hydrateProfileAvatars(view);
    view.querySelectorAll(".toggle-setting").forEach((button) => button.addEventListener("click", () => {
      const next = getSettings();
      next[button.dataset.setting] = !next[button.dataset.setting];
      saveSettings(next);
      renderProfileView();
    }));
    view.querySelector("[data-action='science']")?.addEventListener("click", openScienceBase);
    view.querySelector("[data-action='admin-requests']")?.addEventListener("click", () => openAdminQuestionnaires());
    view.querySelector("[data-action='cloud']")?.addEventListener("click", openCloudAuthSheet);
    view.querySelector("[data-action='legacy-migration']")?.addEventListener("click", openLegacyMigrationSheet);
    view.querySelector("[data-action='data']")?.addEventListener("click", openDataManagement);
    view.querySelector("[data-action='reset']")?.addEventListener("click", () => document.querySelector("#resetDay").click());
    view.querySelector("[data-action='logout']")?.addEventListener("click", logoutCloudAccount);
    view.querySelector(".edit-profile")?.addEventListener("click", openEditProfile);
  }

  async function logoutCloudAccount() {
    try {
      if (cloudSnapshot().user) await window.fitplanCloud.signOut();
      else logout();
    } catch (error) {
      window.alert(`Não foi possível sair da conta: ${error.message}`);
    }
  }

  function openScienceBase() {
    const science = SCIENCE_BASE[currentProfile];
    if (!science) return;
    const hasQuestionnaire = science.source.startsWith("Questionário respondido");
    showOverlay(`<div class="overlay-page science-page">
      <header class="overlay-header"><button class="overlay-close" type="button" aria-label="Voltar">←</button><h2>Science Base</h2><span></span></header>
      <section class="science-hero">
        <div class="science-kicker"><span>⌬</span> DECISÕES DO PLANO</div>
        <h1>Por que este treino foi escolhido para ${escapeHtml(profileName(currentProfile))}?</h1>
        <p>${escapeHtml(science.goal)}</p>
        <div class="science-source ${hasQuestionnaire ? "is-questionnaire" : "is-profile"}"><span>${hasQuestionnaire ? "✓" : "!"}</span><div><strong>${hasQuestionnaire ? "Base individual confirmada" : "Base individual parcial"}</strong><small>${escapeHtml(science.source)}</small></div></div>
      </section>
      <section class="science-plan" aria-label="Estrutura do plano"><small>ESTRUTURA ATUAL</small><strong>${escapeHtml(science.plan)}</strong></section>
      <section class="science-section">
        <div class="science-section-head"><span>01</span><div><small>ENTRADAS</small><h2>O que orientou a prescrição</h2></div></div>
        <div class="science-signals">${science.signals.map((signal) => `<span>${escapeHtml(signal)}</span>`).join("")}</div>
      </section>
      <section class="science-section">
        <div class="science-section-head"><span>02</span><div><small>RACIOCÍNIO</small><h2>Da resposta para o treino</h2></div></div>
        <div class="science-decisions">${science.decisions.map(([title, body]) => `<article><i aria-hidden="true"></i><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></article>`).join("")}</div>
      </section>
      <section class="science-section science-evidence">
        <div class="science-section-head"><span>03</span><div><small>EVIDÊNCIA</small><h2>Princípios científicos usados</h2></div></div>
        <p class="science-evidence-intro">A literatura orienta os princípios; as respostas do usuário definem como eles são aplicados. Nenhum estudo determina sozinho uma rotina individual.</p>
        <div class="science-references">${SCIENCE_REFERENCES.map(([title, summary, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer"><span>↗</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(summary)}</small></div></a>`).join("")}</div>
      </section>
      <aside class="science-review"><strong>Plano vivo, não receita imutável</strong><p>Volume, exercícios e frequência devem ser revistos com desempenho, recuperação, adesão e sintomas. Dor persistente, perda de força, formigamento ou restrição clínica pedem avaliação de um profissional habilitado.</p></aside>
    </div>`);
    overlay.querySelector(".overlay-close")?.addEventListener("click", closeOverlay);
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
    // 1. Persist locally in IndexedDB (always, even if cloud upload fails)
    const db = await openPhotoDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(avatarStoreName, "readwrite");
      transaction.objectStore(avatarStoreName).put(record);
      transaction.oncomplete = () => resolve(record);
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível salvar a foto do perfil."));
    });
    // 2. Upload to Supabase Storage if authenticated (best-effort, non-blocking)
    const cloud = window.fitplanCloud?.snapshot?.();
    const userId = cloud?.user?.id;
    if (userId && window.fitplanCloud?.uploadProfileAvatar) {
      try {
        await window.fitplanCloud.uploadProfileAvatar(userId, record.blob);
      } catch {
        // Cloud upload failed — local copy still works
      }
    }
    return record;
  }

  async function removeProfileAvatar(profileId) {
    // 1. Remove from local IndexedDB
    const db = await openPhotoDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(avatarStoreName, "readwrite");
      transaction.objectStore(avatarStoreName).delete(profileId);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("Não foi possível remover a foto do perfil."));
    });
    // 2. Remove from Supabase Storage if authenticated
    const cloud = window.fitplanCloud?.snapshot?.();
    const userId = cloud?.user?.id;
    if (userId && window.fitplanCloud?.deleteStorageAvatar) {
      try {
        await window.fitplanCloud.deleteStorageAvatar(userId);
      } catch {
        // Ignore cloud errors — local removal already done
      }
    }
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

    const request = (async () => {
      // 1. Try local IndexedDB first (instant, works offline)
      try {
        const record = await getProfileAvatar(profileId);
        if (record?.blob) {
          const url = URL.createObjectURL(record.blob);
          avatarUrlCache.set(profileId, url);
          avatarRequestCache.delete(profileId);
          return url;
        }
      } catch { /* IndexedDB unavailable — fall through to cloud */ }

      // 2. Fallback: use avatar_url from Supabase profile snapshot
      const cloud = window.fitplanCloud?.snapshot?.();
      const cloudAvatarUrl = cloud?.profile?.avatar_url || null;
      avatarUrlCache.set(profileId, cloudAvatarUrl);
      avatarRequestCache.delete(profileId);
      return cloudAvatarUrl;
    })();

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
  document.querySelector("#profileSwitcher").addEventListener("click", openCloudAuthSheet);
  document.querySelector("#settingsButton").addEventListener("click", () => navigate("profile"));
  document.querySelector(".fit-brand").addEventListener("click", (event) => { event.preventDefault(); navigate("workout"); });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (activeSheet) closeActionSheet();
    else if (!overlay.hidden) closeOverlay();
  });
  window.addEventListener("fitplan:cloud-auth", (event) => {
    if (isPasswordRecoveryFlow(event.detail)) {
      showScreen("picker");
      renderProfilePicker();
      openSetPasswordSheet({ recovery: true });
      return;
    }
    applyCloudAuthGate(event.detail);
    if (currentProfile && currentRoute === "profile") renderProfileView();
    maybeOpenRequestedAdminRequest(event.detail);
    // If avatar_url changed in the cloud snapshot, invalidate cache and re-hydrate
    const newAvatarUrl = event.detail?.profile?.avatar_url;
    const cachedUrl = avatarUrlCache.get(currentProfile);
    if (currentProfile && newAvatarUrl && newAvatarUrl !== cachedUrl) {
      avatarUrlCache.delete(currentProfile);
      avatarRequestCache.delete(currentProfile);
      hydrateProfileAvatars(document);
    }
  });

  // Open set-password modal when user arrives via password-recovery link
  window.addEventListener("fitplan:password-recovery", () => {
    openSetPasswordSheet({ recovery: true });
  });

  (function handlePasswordRecoveryCallback() {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const isRecovery = search.get("type") === "recovery" || hash.get("type") === "recovery" || window.fitplanCloud?.pendingPasswordRecovery;
    const hasError = search.get("error") || search.get("error_description") || hash.get("error") || hash.get("error_description");
    if (!isRecovery || hasError) return;
    const tryOpen = () => {
      if (!window.fitplanCloud?.snapshot?.().ready) {
        window.setTimeout(tryOpen, 150);
        return;
      }
      window.fitplanCloud?.consumePasswordRecovery?.();
      openSetPasswordSheet({ recovery: true });
    };
    window.setTimeout(tryOpen, 150);
  })();

  // When the recovery link is expired/invalid, show forgot-password sheet
  // with an explanation instead of leaving the user on a blank screen.
  (function handleExpiredRecoveryLink() {
    const search = new URLSearchParams(window.location.search);
    const isRecovery = search.get("type") === "recovery";
    const hasError = search.get("error") || search.get("error_description");
    if (!isRecovery || !hasError) return;
    // Wait until the UI is ready, then open the forgot-password flow
    function tryOpen() {
      if (typeof openForgotPasswordSheet === "function") {
        openForgotPasswordSheet("", "Este link de redefinição expirou ou já foi usado. Solicite um novo abaixo.");
      } else {
        setTimeout(tryOpen, 200);
      }
    }
    setTimeout(tryOpen, 300);
  })();

  applyCloudAuthGate();
  maybeOpenRequestedAdminRequest();

  // ── iOS Safari bridge ──────────────────────────────────────────────────────
  // On iOS, magic links open in Safari (isolated from the installed PWA).
  // After successful auth, show a persistent banner to redirect into the PWA.
  // The PWA URL without a hash will trigger supabase-client to restore the
  // session from localStorage (same origin, same storage key — iOS shares
  // localStorage between Safari and PWA only when opened via the same URL).
  (function iosOpenInPwaBanner() {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone === true;
    if (!isIos || isStandalone) return; // not iOS or already inside PWA

    // Show banner once the user is authenticated
    function maybeShowBanner(snap) {
      if (!snap.ready || !snap.user) return;

      // Don't show again if already dismissed this session
      if (sessionStorage.getItem("fitplan-pwa-banner-dismissed")) return;

      const existing = document.getElementById("ios-pwa-banner");
      if (existing) return;

      const pwaUrl = window.location.origin + "/";

      const banner = document.createElement("div");
      banner.id = "ios-pwa-banner";
      banner.innerHTML = `
        <div style="position:fixed;bottom:0;left:0;right:0;z-index:9999;background:rgba(11,15,20,.98);border-top:1px solid rgba(139,234,124,.3);padding:20px 24px 32px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center">
          <p style="margin:0;color:#9AA7B2;font-size:13px;line-height:1.4">Você está no Safari. Para a melhor experiência, abra o app salvo na sua tela inicial.</p>
          <a href="${pwaUrl}" style="display:block;width:100%;max-width:320px;padding:14px;background:linear-gradient(135deg,#8BEA7C,#4DA3FF);color:#0B0F14;font-weight:800;font-size:15px;border-radius:14px;text-decoration:none">
            Abrir no FitPlan App
          </a>
          <button onclick="sessionStorage.setItem('fitplan-pwa-banner-dismissed','1');this.closest('#ios-pwa-banner').remove()" style="background:none;border:none;color:#667481;font-size:13px;cursor:pointer;padding:4px">
            Continuar no Safari
          </button>
        </div>`;
      document.body.appendChild(banner);
    }

    // Check immediately and also when auth state changes
    const snap = window.fitplanCloud?.snapshot?.();
    if (snap) maybeShowBanner(snap);
    window.addEventListener("fitplan:cloud-auth", (e) => maybeShowBanner(e.detail));
  })();
})();

