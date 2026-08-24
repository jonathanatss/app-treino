const crypto = require("node:crypto");
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
    profile(profileId) {
      currentProfile = profileId;
      state = { variants: {} };
      const profile = profiles[profileId];
      return {
        ...profile,
        workouts: Object.fromEntries(Object.entries(profile.workouts).map(([dayKey, workout]) => [dayKey, {
          ...workout,
          exercises: workout.exercises.map((exercise) => {
            const variants = getExerciseVariants(exercise);
            return {
              ...exercise,
              variants: variants.map((variant) => {
                state.variants[exercise.id] = variant.key;
                return {
                  ...variant,
                  media: variant.media || EXERCISE_MEDIA[exercise.id] || null,
                  target: inferPrepGroupFromName(selectedExerciseName(exercise))
                };
              })
            };
          })
        }]))
      };
    }
  };`
].join("\n"))();

function stableUuid(value) {
  const bytes = Buffer.from(crypto.createHash("sha256").update(`fitplan:${value}`).digest().subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function numericRange(value, { timeIsNull = false } = {}) {
  const text = String(value || "");
  if (timeIsNull && /(?:min|segundos?|\d\s*s\b)/i.test(text)) return [null, null];
  const values = [...text.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => Number(match[0].replace(",", ".")));
  return values.length ? [values[0], values[1] ?? values[0]] : [null, null];
}

function mediaUrl(media) {
  if (!media) return null;
  return media.url || (media.id ? `https://static.exercisedb.dev/media/${media.id}.gif` : null);
}

function equipmentFor(name, explicit) {
  if (explicit) return explicit;
  const text = slugify(name);
  if (/smith/.test(text)) return "Smith";
  if (/halter/.test(text)) return "Halteres";
  if (/barra-ez/.test(text)) return "Barra EZ";
  if (/barra/.test(text)) return "Barra";
  if (/polia|cabo|corda|crossover/.test(text)) return "Polia";
  if (/bike/.test(text)) return "Bike";
  if (/esteira/.test(text)) return "Esteira";
  if (/eliptico/.test(text)) return "Elíptico";
  if (/maquina|hack|leg-press|flexora|extensora|abdutora|panturrilha|chest-press/.test(text)) return "Máquina";
  return null;
}

function muscles(target) {
  return String(target || "")
    .split(/\s*•\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function weekdayFor(label) {
  const normalized = slugify(label);
  return normalized.startsWith("dom") ? 0
    : normalized.startsWith("seg") ? 1
    : normalized.startsWith("ter") ? 2
    : normalized.startsWith("qua") ? 3
    : normalized.startsWith("qui") ? 4
    : normalized.startsWith("sex") ? 5
    : normalized.startsWith("sab") ? 6
    : null;
}

const profileKey = "jonathan";
const profile = runtime.profile(profileKey);
const planId = stableUuid(`${profileKey}:plan:v1`);
const tabsByKey = Object.fromEntries(profile.tabs.map((tab) => [tab.key, tab]));
const catalogBySlug = new Map();
const days = [];
const planExercises = [];
const alternatives = [];

for (const [dayPosition, tab] of profile.tabs.entries()) {
  const dayKey = tab.key;
  const workout = profile.workouts[dayKey];
  if (!workout) throw new Error(`Treino ativo ausente: ${dayKey}`);
  const dayId = stableUuid(`${profileKey}:plan:v1:day:${dayKey}`);
  days.push({
    id: dayId,
    plan_id: planId,
    day_key: dayKey,
    title: workout.title,
    weekday: weekdayFor(tab?.label || workout.title),
    position: dayPosition,
    notes: [workout.warmup, workout.total].filter(Boolean).join("\n")
  });

  workout.exercises.forEach((exercise, position) => {
    const variants = exercise.variants;
    const primary = variants[0];
    const baseSlug = `legacy-${slugify(exercise.id)}`;
    const primaryId = stableUuid(`catalog:${baseSlug}`);
    const selectedName = primary.displayName || primary.label || exercise.name;
    catalogBySlug.set(baseSlug, {
      id: primaryId,
      slug: baseSlug,
      name: selectedName,
      target_muscles: muscles(primary.target),
      equipment: equipmentFor(selectedName, primary.equipment),
      media_url: mediaUrl(primary.media),
      instructions: []
    });

    const [repsMin, repsMax] = numericRange(primary.reps || exercise.reps, { timeIsNull: true });
    const [rirMin, rirMax] = numericRange(exercise.rir);
    const planExerciseId = stableUuid(`${profileKey}:plan:v1:day:${dayKey}:exercise:${exercise.id}`);
    planExercises.push({
      id: planExerciseId,
      workout_day_id: dayId,
      exercise_id: primaryId,
      position,
      sets: Number.parseInt(exercise.sets, 10),
      reps_min: repsMin,
      reps_max: repsMax,
      rir_min: rirMin,
      rir_max: rirMax,
      rest_seconds: exercise.restSeconds ?? 90,
      track_load: exercise.trackWeight !== false,
      coach_note: [exercise.note, `Prescrição original: ${exercise.sets} × ${primary.reps || exercise.reps}; RIR ${exercise.rir}; descanso ${exercise.restLabel}`].filter(Boolean).join("\n")
    });

    variants.slice(1).forEach((variant, alternativePosition) => {
      const alternativeSlug = `${baseSlug}-${slugify(variant.key)}`;
      const alternativeId = stableUuid(`catalog:${alternativeSlug}`);
      const alternativeName = variant.displayName || variant.label;
      catalogBySlug.set(alternativeSlug, {
        id: alternativeId,
        slug: alternativeSlug,
        name: alternativeName,
        target_muscles: muscles(variant.target),
        equipment: equipmentFor(alternativeName, variant.equipment),
        media_url: mediaUrl(variant.media),
        instructions: []
      });
      const [alternativeRepsMin, alternativeRepsMax] = numericRange(variant.reps || exercise.reps, { timeIsNull: true });
      alternatives.push({
        id: stableUuid(`${planExerciseId}:alternative:${variant.key}`),
        plan_exercise_id: planExerciseId,
        exercise_id: alternativeId,
        label: variant.label,
        position: alternativePosition,
        reps_min: alternativeRepsMin,
        reps_max: alternativeRepsMax,
        note: "Alternativa equivalente; mantenha séries, esforço e descanso prescritos."
      });
    });
  });
}

const payload = {
  profile_key: profileKey,
  plan: {
    id: planId,
    title: "PPL + Upper/Lower 5x",
    goal: "Reduzir gordura preservando massa muscular e desempenho.",
    methodology: "PPL + Lower/Upper, cinco sessões semanais, autorregulação por RIR e progressão dupla.",
    science_rationale: "A disponibilidade e a experiência permitem distribuir o volume em cinco sessões. PPL organiza o trabalho específico e Lower/Upper fornece um segundo estímulo aos grupos prioritários. A maior parte das séries termina com 1–2 repetições em reserva para equilibrar estímulo e fadiga durante a redução de gordura.",
    status: "active",
    version: 1,
    starts_on: "2026-08-09"
  },
  days,
  catalog: [...catalogBySlug.values()],
  plan_exercises: planExercises,
  alternatives
};

const json = JSON.stringify(payload, null, 2);
const migration = `begin;

do $$
declare
  payload jsonb := $payload$${json}$payload$::jsonb;
  athlete uuid;
begin
  select id into athlete
  from public.profiles
  where legacy_profile_key = payload->>'profile_key';

  if athlete is null then
    raise exception 'Perfil legado % ainda não está vinculado a um usuário', payload->>'profile_key';
  end if;

  update public.training_plans
  set status = 'archived'
  where athlete_id = athlete
    and status = 'active'
    and id <> (payload->'plan'->>'id')::uuid;

  insert into public.training_plans (id, athlete_id, title, goal, methodology, science_rationale, status, version, starts_on)
  select
    (p->>'id')::uuid, athlete, p->>'title', p->>'goal', p->>'methodology', p->>'science_rationale',
    p->>'status', (p->>'version')::integer, (p->>'starts_on')::date
  from jsonb_array_elements(jsonb_build_array(payload->'plan')) p
  on conflict (id) do update set
    athlete_id = excluded.athlete_id,
    title = excluded.title,
    goal = excluded.goal,
    methodology = excluded.methodology,
    science_rationale = excluded.science_rationale,
    status = excluded.status,
    version = excluded.version,
    starts_on = excluded.starts_on;

  insert into public.workout_days (id, plan_id, day_key, title, weekday, position, notes)
  select id, plan_id, day_key, title, weekday, position, notes
  from jsonb_to_recordset(payload->'days') as x(
    id uuid, plan_id uuid, day_key text, title text, weekday smallint, position smallint, notes text
  )
  on conflict (id) do update set
    plan_id = excluded.plan_id,
    day_key = excluded.day_key,
    title = excluded.title,
    weekday = excluded.weekday,
    position = excluded.position,
    notes = excluded.notes;

  insert into public.exercise_catalog (id, slug, name, target_muscles, equipment, media_url, instructions)
  select id, slug, name, target_muscles, equipment, media_url, instructions
  from jsonb_to_recordset(payload->'catalog') as x(
    id uuid, slug text, name text, target_muscles text[], equipment text, media_url text, instructions jsonb
  )
  on conflict (slug) do update set
    name = excluded.name,
    target_muscles = excluded.target_muscles,
    equipment = excluded.equipment,
    media_url = excluded.media_url,
    instructions = excluded.instructions,
    active = true;

  insert into public.plan_exercises (
    id, workout_day_id, exercise_id, position, sets, reps_min, reps_max,
    rir_min, rir_max, rest_seconds, track_load, coach_note
  )
  select
    id, workout_day_id, exercise_id, position, sets, reps_min, reps_max,
    rir_min, rir_max, rest_seconds, track_load, coach_note
  from jsonb_to_recordset(payload->'plan_exercises') as x(
    id uuid, workout_day_id uuid, exercise_id uuid, position smallint, sets smallint,
    reps_min smallint, reps_max smallint, rir_min numeric, rir_max numeric,
    rest_seconds smallint, track_load boolean, coach_note text
  )
  on conflict (id) do update set
    workout_day_id = excluded.workout_day_id,
    exercise_id = excluded.exercise_id,
    position = excluded.position,
    sets = excluded.sets,
    reps_min = excluded.reps_min,
    reps_max = excluded.reps_max,
    rir_min = excluded.rir_min,
    rir_max = excluded.rir_max,
    rest_seconds = excluded.rest_seconds,
    track_load = excluded.track_load,
    coach_note = excluded.coach_note;

  insert into public.plan_exercise_alternatives (
    id, plan_exercise_id, exercise_id, label, position, reps_min, reps_max, note
  )
  select id, plan_exercise_id, exercise_id, label, position, reps_min, reps_max, note
  from jsonb_to_recordset(payload->'alternatives') as x(
    id uuid, plan_exercise_id uuid, exercise_id uuid, label text, position smallint,
    reps_min smallint, reps_max smallint, note text
  )
  on conflict (id) do update set
    plan_exercise_id = excluded.plan_exercise_id,
    exercise_id = excluded.exercise_id,
    label = excluded.label,
    position = excluded.position,
    reps_min = excluded.reps_min,
    reps_max = excluded.reps_max,
    note = excluded.note;
end $$;

commit;
`;

const outputPath = path.join(root, "supabase", "migrations", "20260824213000_migrate_jonathan_training_plan.sql");
fs.writeFileSync(outputPath, migration);
console.log(JSON.stringify({
  output: path.relative(root, outputPath),
  planId,
  days: days.length,
  planExercises: planExercises.length,
  catalogExercises: catalogBySlug.size,
  alternatives: alternatives.length
}, null, 2));
