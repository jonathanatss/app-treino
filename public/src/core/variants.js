// Exercise variant resolution — depends on: EXERCISE_MEDIA, EXERCISE_MEDIA_BASE,
// PROFILE_EXERCISE_VARIANTS, EXERCISE_VARIANTS, SHARED_MOVEMENT_VARIANTS, AUTO_VARIANT_MEDIA
// and globals: currentProfile, state, escapeHtml, slugify, hasAnyTerm

const MEDIA_ASSET_VERSION = "63";
const LOCAL_MEDIA_FALLBACK_BY_ID = {
  "5eLRITT": "https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-stiff-leg-deadlift.webp",
  "9XgCBBZ": "assets/exercises/qx4fgX7.gif",
  "qvlMuMl": "assets/exercises/lever-seated-crunch.gif",
  "vQqmGGp": "assets/exercises/DOoWcnA.gif"
};

function versionMediaUrl(src) {
  if (!src || String(src).startsWith("data:") || String(src).startsWith("blob:")) return src;
  const separator = String(src).includes("?") ? "&" : "?";
  return `${src}${separator}v=${MEDIA_ASSET_VERSION}`;
}

function withVariantMedia(exerciseId, variant) {
  const media = variant.media || AUTO_VARIANT_MEDIA[exerciseId]?.[variant.key] || EXERCISE_MEDIA[exerciseId];
  return media ? { ...variant, media } : variant;
}

function orderSharedVariants(exercise, catalogKey, preferredKey) {
  const source = SHARED_MOVEMENT_VARIANTS[catalogKey];
  if (!source?.length) return null;
  const preferred = source.find((variant) => variant.key === preferredKey) || source[0];
  return [preferred, ...source.filter((variant) => variant.key !== preferred.key)].map((variant) => {
    const { perSide, ...cleanVariant } = variant;
    if (!perSide) return cleanVariant;
    const prescribedReps = String(exercise.reps || "");
    return {
      ...cleanVariant,
      reps: /cada lado/i.test(prescribedReps) ? prescribedReps : `${prescribedReps} cada lado`.trim()
    };
  });
}

function getSharedExerciseVariants(exercise) {
  const text = slugify(exercise.name);
  if (hasAnyTerm(text, [
    "abdominal", "abdomen", "crunch", "prancha", "dead-bug", "mobilidade",
    "corrida-caminhada-intervalada",
    "rotacao-externa", "external-rotation"
  ])) return null;

  if (hasAnyTerm(text, ["cardio", "bike", "bicicleta", "esteira", "caminhada", "eliptico"])) {
    const preferred = hasAnyTerm(text, ["bike", "bicicleta"]) ? "bike" : text.includes("eliptico") ? "eliptico" : "esteira";
    return orderSharedVariants(exercise, "cardio", preferred);
  }
  if (hasAnyTerm(text, ["encolhimento", "shrug"])) {
    return orderSharedVariants(exercise, "shrug", text.includes("maquina") ? "maquina" : "halteres");
  }
  if (hasAnyTerm(text, ["coice", "kickback", "gluteo-no-cabo"])) {
    return orderSharedVariants(exercise, "hipExtension", "polia");
  }
  if (hasAnyTerm(text, ["crucifixo-inverso", "crucifixo-invertido", "voador-inverso", "reverse-fly", "rear-delt", "face-pull"])) {
    return orderSharedVariants(exercise, "rearShoulder", text.includes("face-pull") ? "face-pull" : "maquina");
  }
  if (hasAnyTerm(text, ["supino-inclinado", "incline-press", "incline-chest"])) {
    const preferred = text.includes("smith") ? "smith" : text.includes("maquina") ? "maquina" : "halteres";
    return orderSharedVariants(exercise, "inclinePress", preferred);
  }
  if (hasAnyTerm(text, ["crucifixo", "crossover", "peck-deck", "fly"])) {
    return orderSharedVariants(exercise, "chestFly", text.includes("crossover") ? "crossover" : "maquina");
  }
  if (hasAnyTerm(text, ["supino", "chest-press"])) {
    return orderSharedVariants(exercise, "flatPress", text.includes("maquina") ? "maquina" : "halteres");
  }
  if (hasAnyTerm(text, ["desenvolvimento", "shoulder-press", "overhead-press"])) {
    return orderSharedVariants(exercise, "shoulderPress", text.includes("maquina") ? "maquina" : "halteres");
  }
  if (hasAnyTerm(text, ["elevacao-lateral", "lateral-raise"])) {
    return orderSharedVariants(exercise, "lateralRaise", hasAnyTerm(text, ["polia", "cabo"]) ? "polia" : "halteres");
  }
  if (hasAnyTerm(text, ["pulldown-na-polia", "pullover", "bracos-estendidos", "straight-arm"])) {
    return orderSharedVariants(exercise, "straightArmPull", text.includes("pullover") ? "maquina" : "polia");
  }
  if (hasAnyTerm(text, ["remada", "row"])) {
    const preferred = hasAnyTerm(text, ["unilateral", "um-braco", "one-arm"])
      ? (text.includes("halter") ? "halter-unilateral" : "maquina-unilateral")
      : hasAnyTerm(text, ["curvada", "barra"]) ? "remada-t"
      : hasAnyTerm(text, ["maquina", "articulada", "peito-apoiado"]) ? "maquina-apoiada"
      : "polia-triangulo";
    return orderSharedVariants(exercise, "horizontalRow", preferred);
  }
  if (hasAnyTerm(text, ["puxada", "lat-pulldown", "barra-fixa", "chin-up", "pull-up"])) {
    const preferred = text.includes("supinada") ? "supinada"
      : hasAnyTerm(text, ["aberta", "larga", "pronada"]) ? "pronada"
      : text.includes("barra-fixa") ? "assistida"
      : "neutra";
    return orderSharedVariants(exercise, "verticalPull", preferred);
  }
  if (hasAnyTerm(text, ["rosca-scott", "scott", "preacher-curl"])) {
    return orderSharedVariants(exercise, "preacherCurl", hasAnyTerm(text, ["unilateral", "halter"]) ? "halter" : "maquina");
  }
  if (hasAnyTerm(text, ["rosca-martelo", "hammer-curl", "barra-h"])) {
    return orderSharedVariants(exercise, "hammerCurl", hasAnyTerm(text, ["corda", "polia", "cabo"]) ? "corda" : "halteres");
  }
  if (hasAnyTerm(text, ["rosca", "biceps", "curl"])) {
    const preferred = hasAnyTerm(text, ["polia", "cabo"]) ? "polia" : text.includes("halter") ? "halteres" : "barra-ez";
    return orderSharedVariants(exercise, "bicepsCurl", preferred);
  }
  if (hasAnyTerm(text, ["triceps-frances", "triceps-testa", "frances", "testa", "overhead-triceps"])) {
    const preferred = text.includes("testa") ? (text.includes("cabo") ? "testa-cabo" : "frances-ez") : "frances-cabo";
    return orderSharedVariants(exercise, "tricepsOverhead", preferred);
  }
  if (hasAnyTerm(text, ["triceps", "pulley"])) {
    const preferred = text.includes("unilateral") ? "unilateral" : text.includes("barra") ? "barra-v" : "corda";
    return orderSharedVariants(exercise, "tricepsPushdown", preferred);
  }
  if (hasAnyTerm(text, ["rdl", "terra-romeno", "romeno", "stiff"])) {
    return orderSharedVariants(exercise, "hipHinge", text.includes("halter") ? "halteres" : "barra");
  }
  if (hasAnyTerm(text, ["bulgaro", "afundo", "passada", "split-squat", "lunge"])) {
    return orderSharedVariants(exercise, "splitSquat", text.includes("smith") ? "smith" : "halteres");
  }
  if (hasAnyTerm(text, ["elevacao-pelvica", "hip-thrust", "glute-bridge", "ponte-de-gluteos"])) {
    const preferred = text.includes("maquina") ? "maquina" : text.includes("smith") ? "smith" : "barra";
    return orderSharedVariants(exercise, "hipThrust", preferred);
  }
  if (hasAnyTerm(text, ["flexora", "leg-curl", "nordic"])) {
    return orderSharedVariants(exercise, "legCurl", hasAnyTerm(text, ["cadeira", "sentada", "seated"]) ? "sentada" : "deitada");
  }
  if (hasAnyTerm(text, ["extensora", "leg-extension"])) {
    return orderSharedVariants(exercise, "legExtension", text.includes("unilateral") ? "unilateral" : "bilateral");
  }
  if (hasAnyTerm(text, ["abdutora", "abducao-de-quadril", "hip-abduction", "abductor"])) {
    return orderSharedVariants(exercise, "hipAbduction", hasAnyTerm(text, ["polia", "cabo"]) ? "polia" : "maquina");
  }
  if (hasAnyTerm(text, ["adutora", "aducao-de-quadril", "hip-adduction", "adductor"])) {
    return orderSharedVariants(exercise, "hipAdduction", hasAnyTerm(text, ["polia", "cabo"]) ? "polia" : "maquina");
  }
  if (hasAnyTerm(text, ["panturrilha", "calf"])) {
    return orderSharedVariants(exercise, "calfRaise", hasAnyTerm(text, ["sentada", "seated"]) ? "sentada" : "em-pe");
  }
  if (hasAnyTerm(text, ["leg-press"])) {
    const preferred = text.includes("horizontal") ? "horizontal" : text.includes("unilateral") ? "unilateral" : "45-graus";
    return orderSharedVariants(exercise, "legPress", preferred);
  }
  if (hasAnyTerm(text, ["sumo"])) {
    return orderSharedVariants(exercise, "sumoSquat", text.includes("smith") ? "smith" : "halter");
  }
  if (hasAnyTerm(text, ["agachamento", "hack", "goblet", "squat"])) {
    const preferred = text.includes("hack") ? "hack" : text.includes("smith") ? "smith" : "goblet";
    return orderSharedVariants(exercise, "squat", preferred);
  }
  return null;
}

function getExerciseVariants(exercise) {
  const profileVariants = PROFILE_EXERCISE_VARIANTS[currentProfile]?.[exercise.id];
  if (profileVariants) return profileVariants.map((variant) => withVariantMedia(exercise.id, variant));
  if (EXERCISE_VARIANTS[exercise.id]) return EXERCISE_VARIANTS[exercise.id].map((variant) => withVariantMedia(exercise.id, variant));
  const sharedVariants = getSharedExerciseVariants(exercise);
  if (sharedVariants) return sharedVariants.map((variant) => withVariantMedia(exercise.id, variant));
  if (!/\sou\s/i.test(exercise.name)) return [{ key: "base", label: exercise.name }];
  return exercise.name.split(/\sou\s/i).map((label) => {
    const cleaned = label.trim();
    return { key: slugify(cleaned), label: cleaned };
  }).map((variant) => withVariantMedia(exercise.id, variant));
}

function getSelectedVariant(exercise) {
  const variants = getExerciseVariants(exercise);
  const storedKey = state?.variants?.[exercise.id];
  return variants.find((variant) => variant.key === storedKey) || variants[0];
}

function exerciseStateKey(exercise, variant) {
  const variants = getExerciseVariants(exercise);
  if (variants.length <= 1 || variant.key === variants[0].key) return exercise.id;
  return `${exercise.id}::${variant.key}`;
}

function renderMovementMedia(exercise, variant = getSelectedVariant(exercise)) {
  const media = variant?.media || EXERCISE_MEDIA[exercise.id];
  if (!media) return "";
  const alt = `${variant?.label || exercise.name}: simulação visual do movimento`;
  const localSrc = media.id ? `assets/exercises/${media.id}.gif` : null;
  const remoteSrc = media.id ? `${EXERCISE_MEDIA_BASE}${media.id}.gif` : null;
  const src = versionMediaUrl(media.url || localSrc || remoteSrc);
  const fallbackSrc = media.id ? versionMediaUrl(LOCAL_MEDIA_FALLBACK_BY_ID[media.id] || remoteSrc) : "";
  return `<img class="movement-image" src="${src}" alt="${escapeHtml(alt)}" title="${escapeHtml(media.label)}" loading="lazy" decoding="async" onerror="${fallbackSrc ? `if(!this.dataset.fallback){this.dataset.fallback='true';this.src='${fallbackSrc}';}else{` : ""}this.closest('.exercise-visual').classList.add('media-error'); this.remove();${fallbackSrc ? "}" : ""}">`;
}


