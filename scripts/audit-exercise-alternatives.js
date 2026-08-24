const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function sourceBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Trecho não encontrado: ${startMarker}`);
  return html.slice(start, end);
}

const runtime = new Function([
  sourceBetween("const profiles =", "const PREP_EXERCISE_META"),
  sourceBetween("function hasAnyTerm(text, terms)", "function selectedExerciseName(exercise)"),
  "let currentProfile = null;",
  "let state = { variants: {} };",
  sourceBetween("function slugify(value)", "function renderMovementMedia(exercise"),
  sourceBetween("function selectedExerciseName(exercise)", "function inferWarmupGroup(exercise)"),
  sourceBetween("function inferPrepGroupFromName(name)", "window.FitPlanMuscles"),
  `return {
    profiles,
    auditProfile(profileId) {
      currentProfile = profileId;
      state = { variants: {} };
      const exercises = [...new Map(
        Object.values(profiles[profileId].workouts)
          .flatMap((workout) => workout.exercises)
          .map((exercise) => [exercise.id, exercise])
      ).values()];
      return exercises.map((exercise) => {
        const variants = getExerciseVariants(exercise);
        const targets = variants.map((variant) => {
          state.variants[exercise.id] = variant.key;
          return inferPrepGroupFromName(selectedExerciseName(exercise));
        });
        state.variants = {};
        return {
          exercise,
          variants,
          targets,
          stateKeys: variants.map((variant) => exerciseStateKey(exercise, variant))
        };
      });
    }
  };`
].join("\n"))();

const failures = [];
const summary = {};
let totalSlots = 0;
let slotsWithAlternatives = 0;
let totalChoices = 0;

for (const profileId of Object.keys(runtime.profiles)) {
  const rows = runtime.auditProfile(profileId);
  const alternativeRows = rows.filter((row) => row.variants.length > 1);
  totalSlots += rows.length;
  slotsWithAlternatives += alternativeRows.length;
  totalChoices += rows.reduce((total, row) => total + row.variants.length, 0);
  summary[profileId] = `${alternativeRows.length}/${rows.length}`;

  for (const { exercise, variants, targets, stateKeys } of rows) {
    const keys = variants.map((variant) => variant.key);
    if (new Set(keys).size !== keys.length) failures.push(`${profileId}/${exercise.id}: chaves repetidas`);
    if (new Set(stateKeys).size !== stateKeys.length) failures.push(`${profileId}/${exercise.id}: histórico compartilhado entre alternativas`);
    if (stateKeys[0] !== exercise.id) failures.push(`${profileId}/${exercise.id}: primeira opção não preserva o histórico-base`);

    variants.forEach((variant, index) => {
      if (!variant.key || !variant.label) failures.push(`${profileId}/${exercise.id}: opção ${index + 1} incompleta`);
      if (variants.length > 1 && !variant.media) failures.push(`${profileId}/${exercise.id}/${variant.key}: mídia ausente`);
      if (targets[index].startsWith("Corpo inteiro")) failures.push(`${profileId}/${exercise.id}/${variant.key}: músculo-alvo genérico`);
      if (/unilateral|um braço|um braco/i.test(variant.displayName || "") && !/cada lado/i.test(variant.reps || exercise.reps || "")) {
        failures.push(`${profileId}/${exercise.id}/${variant.key}: repetição unilateral sem indicação por lado`);
      }
    });
  }
}

for (const profileId of ["jonathan", "pablo"]) {
  const absRows = runtime.auditProfile(profileId).filter(({ exercise }) => /abs|abdominal/i.test(exercise.id));
  absRows.forEach(({ exercise, variants }) => {
    if (variants.length !== 1 || !/máquina/i.test(variants[0].displayName || exercise.name)) {
      failures.push(`${profileId}/${exercise.id}: abdominal deve permanecer somente na máquina`);
    }
  });
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  profiles: summary,
  totalSlots,
  slotsWithAlternatives,
  totalChoices,
  failures: 0
}, null, 2));
