const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { TextEncoder } = require("node:util");

const source = fs.readFileSync(path.resolve(__dirname, "..", "legacy-cloud-migration.js"), "utf8");
const values = new Map([
  ["gym-app-profile-jonathan-state", JSON.stringify({
    history: {
      "lower-a-squat": [{ date: "2026-08-10", tab: "legsA", exerciseId: "lower-a-squat", variant: "hack", load: 100 }],
      "upper-a-row::remada-t-apoiada": [{ date: "2026-08-12", tab: "pullA", exerciseId: "upper-a-row", variant: "remada-t-apoiada", load: 70 }]
    },
    sessions: [
      { date: "2026-08-10", tab: "legsA", title: "Lower A", volume: 2400, completedAt: "2026-08-10T14:00:00.000Z" },
      { date: "2026-08-12", tab: "pullA", title: "Pull", volume: 1680, completedAt: "2026-08-12T14:00:00.000Z" }
    ]
  })],
  ["gym-app-profile-jonathan-measurements", JSON.stringify([
    { date: "2026-08-11", weight: "92,5", fat: "24", arms: "39", chest: "108", waist: "96", thighs: "61" }
  ])]
]);

const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); }
};

const selected = {
  training_plans: [{ id: "00000000-0000-5000-8000-000000000001" }],
  workout_days: [
    { id: "00000000-0000-5000-8000-000000000010", day_key: "legsA", title: "Lower A" },
    { id: "00000000-0000-5000-8000-000000000011", day_key: "pullA", title: "Pull" }
  ],
  plan_exercises: [
    { id: "00000000-0000-5000-8000-000000000020", workout_day_id: "00000000-0000-5000-8000-000000000010", exercise_id: "00000000-0000-5000-8000-000000000030", position: 0 },
    { id: "00000000-0000-5000-8000-000000000021", workout_day_id: "00000000-0000-5000-8000-000000000011", exercise_id: "00000000-0000-5000-8000-000000000031", position: 0 }
  ],
  plan_exercise_alternatives: [
    { plan_exercise_id: "00000000-0000-5000-8000-000000000021", exercise_id: "00000000-0000-5000-8000-000000000032" }
  ],
  exercise_catalog: [
    { id: "00000000-0000-5000-8000-000000000030", slug: "legacy-lower-a-squat" },
    { id: "00000000-0000-5000-8000-000000000031", slug: "legacy-upper-a-row" },
    { id: "00000000-0000-5000-8000-000000000032", slug: "legacy-upper-a-row-remada-t-apoiada" }
  ]
};

const writes = [];
function queryFor(table) {
  const query = {
    eq() { return query; },
    in() { return query; },
    order() { return query; },
    limit() { return query; },
    then(resolve) { return Promise.resolve(resolve({ data: selected[table] || [], error: null })); }
  };
  return query;
}

const client = {
  from(table) {
    return {
      select() { return queryFor(table); },
      upsert(rows, options) {
        writes.push({ table, rows: structuredClone(rows), options: structuredClone(options) });
        return Promise.resolve({ error: null });
      }
    };
  }
};

const userId = "30f59067-44dd-42b8-8a48-9bece52c8e55";
const window = {
  fitplanCloud: {
    client,
    snapshot() {
      return { user: { id: userId }, profile: { legacy_profile_key: "jonathan" } };
    }
  }
};

vm.runInNewContext(source, { window, localStorage, crypto: crypto.webcrypto, TextEncoder, URLSearchParams, console });

const preview = window.fitplanLegacyMigration.preview("jonathan");
assert.deepEqual({ sessions: preview.sessions, exerciseLoads: preview.exerciseLoads, measurements: preview.measurements, hasData: preview.hasData }, {
  sessions: 2,
  exerciseLoads: 2,
  measurements: 1,
  hasData: true
});

(async () => {
  const first = await window.fitplanLegacyMigration.migrate("jonathan");
  assert.deepEqual({ sessions: first.sessions, exerciseLoads: first.exerciseLoads, measurements: first.measurements, skipped: first.skippedExerciseLoads }, {
    sessions: 2,
    exerciseLoads: 2,
    measurements: 1,
    skipped: 0
  });
  assert.deepEqual(writes.map((write) => write.table), ["workout_sessions", "workout_exercise_logs", "workout_set_logs", "body_measurements"]);
  const firstIds = writes.flatMap((write) => write.rows.map((row) => row.id).filter(Boolean));
  assert.equal(new Set(firstIds).size, firstIds.length);
  assert.equal(writes.find((write) => write.table === "body_measurements").options.onConflict, "user_id,measured_on");
  assert.equal(window.fitplanLegacyMigration.status("jonathan").migrated, true);

  writes.length = 0;
  await window.fitplanLegacyMigration.migrate("jonathan");
  const secondIds = writes.flatMap((write) => write.rows.map((row) => row.id).filter(Boolean));
  assert.deepEqual(secondIds, firstIds);

  console.log(JSON.stringify({
    preview,
    tables: writes.map((write) => write.table),
    deterministicIds: firstIds.length,
    idempotent: true,
    failures: 0
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
