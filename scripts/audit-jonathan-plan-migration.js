const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const migrationPath = path.join(root, "supabase", "migrations", "20260824213000_migrate_jonathan_training_plan.sql");
const sql = fs.readFileSync(migrationPath, "utf8");
const payloadMatch = sql.match(/\$payload\$([\s\S]*?)\$payload\$::jsonb/);
if (!payloadMatch) throw new Error("Payload JSON não encontrado na migração do Jonathan");

const payload = JSON.parse(payloadMatch[1]);
const failures = [];
const unique = (values) => new Set(values).size === values.length;
const catalogIds = new Set(payload.catalog.map((exercise) => exercise.id));
const dayIds = new Set(payload.days.map((day) => day.id));
const planExerciseIds = new Set(payload.plan_exercises.map((exercise) => exercise.id));

if (payload.profile_key !== "jonathan") failures.push("chave do perfil incorreta");
if (payload.plan.status !== "active") failures.push("plano não está ativo");
if (payload.days.length !== 5) failures.push(`dias ativos: ${payload.days.length}, esperado 5`);
if (payload.plan_exercises.length !== 41) failures.push(`exercícios prescritos: ${payload.plan_exercises.length}, esperado 41`);
if (payload.alternatives.length !== 57) failures.push(`alternativas: ${payload.alternatives.length}, esperado 57`);
if (payload.catalog.length !== 98) failures.push(`catálogo: ${payload.catalog.length}, esperado 98`);
if (payload.days.map((day) => day.weekday).join(",") !== "1,2,3,5,6") failures.push("frequência semanal não preserva quinta e domingo como descanso");
if (!unique(payload.days.map((day) => day.id)) || !unique(payload.days.map((day) => day.position))) failures.push("dias repetidos");
if (!unique(payload.catalog.map((exercise) => exercise.id)) || !unique(payload.catalog.map((exercise) => exercise.slug))) failures.push("catálogo contém duplicatas");
if (!unique(payload.plan_exercises.map((exercise) => exercise.id))) failures.push("prescrições contêm ids repetidos");
if (!unique(payload.alternatives.map((exercise) => exercise.id))) failures.push("alternativas contêm ids repetidos");
if (payload.catalog.some((exercise) => !exercise.name || !exercise.target_muscles.length)) failures.push("catálogo contém exercício sem nome ou músculo-alvo");
if (payload.plan_exercises.some((exercise) => !dayIds.has(exercise.workout_day_id) || !catalogIds.has(exercise.exercise_id))) failures.push("prescrição órfã");
if (payload.alternatives.some((exercise) => !planExerciseIds.has(exercise.plan_exercise_id) || !catalogIds.has(exercise.exercise_id))) failures.push("alternativa órfã");
if (!payload.plan_exercises.some((exercise) => exercise.track_load === false && exercise.reps_min === null && exercise.reps_max === null)) failures.push("cardio não preservou rastreamento sem carga e duração textual");
if (!/on conflict \(id\) do update/i.test(sql) || !/on conflict \(slug\) do update/i.test(sql)) failures.push("migração não é idempotente");
if (!/where legacy_profile_key = payload->>'profile_key'/i.test(sql)) failures.push("migração não exige vínculo do perfil legado");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  profile: payload.profile_key,
  plan: payload.plan.title,
  activeWeekdays: payload.days.map((day) => day.weekday),
  days: payload.days.length,
  planExercises: payload.plan_exercises.length,
  catalogExercises: payload.catalog.length,
  alternatives: payload.alternatives.length,
  failures: 0
}, null, 2));
