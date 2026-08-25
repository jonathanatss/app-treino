(function () {
  "use strict";

  const VERSION = 1;

  function parseJson(value, fallback) {
    try { return JSON.parse(value) || fallback; }
    catch { return fallback; }
  }

  function slugify(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function numberOrNull(value) {
    const parsed = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function legacyState(profileKey) {
    return parseJson(localStorage.getItem(`gym-app-profile-${profileKey}-state`), {});
  }

  function legacyMeasurements(profileKey) {
    return parseJson(localStorage.getItem(`gym-app-profile-${profileKey}-measurements`), []);
  }

  function historyRows(state) {
    return Object.entries(state.history || {}).flatMap(([stateKey, entries]) =>
      (Array.isArray(entries) ? entries : []).map((entry) => ({ ...entry, stateKey }))
    ).filter((entry) => entry.date && entry.tab && entry.exerciseId);
  }

  function preview(profileKey) {
    const state = legacyState(profileKey);
    const history = historyRows(state);
    const sessions = new Set(history.map((entry) => `${entry.date}|${entry.tab}`));
    (state.sessions || []).forEach((session) => {
      if (session?.date && session?.tab) sessions.add(`${session.date}|${session.tab}`);
    });
    return {
      sessions: sessions.size,
      exerciseLoads: history.filter((entry) => Number.isFinite(Number(entry.load))).length,
      measurements: legacyMeasurements(profileKey).filter((entry) => entry?.date).length,
      photosIncluded: false,
      hasData: sessions.size > 0 || history.length > 0 || legacyMeasurements(profileKey).some((entry) => entry?.date)
    };
  }

  async function stableUuid(value) {
    const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`fitplan:${value}`))).slice(0, 16);
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function markerKey(userId, profileKey) {
    return `gym-app-cloud-migration-${userId}-${profileKey}-v${VERSION}`;
  }

  function status(profileKey) {
    const userId = window.fitplanCloud?.snapshot?.().user?.id;
    if (!userId) return { migrated: false, migratedAt: null };
    const migratedAt = localStorage.getItem(markerKey(userId, profileKey));
    return { migrated: Boolean(migratedAt), migratedAt };
  }

  async function selectAll(query, label) {
    const result = await query;
    if (result.error) throw new Error(`${label}: ${result.error.message}`);
    return result.data || [];
  }

  async function upsert(client, table, rows, options, label) {
    if (!rows.length) return;
    const result = await client.from(table).upsert(rows, options);
    if (result.error) throw new Error(`${label}: ${result.error.message}`);
  }

  async function migrate(profileKey) {
    const cloud = window.fitplanCloud?.snapshot?.();
    const client = window.fitplanCloud?.client;
    const userId = cloud?.user?.id;
    if (!client || !userId) throw new Error("Entre na conta online antes de migrar os dados.");
    if (cloud.profile?.legacy_profile_key !== profileKey) throw new Error("A conta online não está vinculada a este perfil local.");

    const state = legacyState(profileKey);
    const history = historyRows(state);
    const measurements = legacyMeasurements(profileKey).filter((entry) => entry?.date);
    const plans = await selectAll(
      client.from("training_plans").select("id").eq("athlete_id", userId).eq("status", "active").order("version", { ascending: false }).limit(1),
      "Plano ativo"
    );
    if (!plans[0]) throw new Error("O plano ativo ainda não foi liberado para esta conta.");

    const days = await selectAll(
      client.from("workout_days").select("id, day_key, title").eq("plan_id", plans[0].id).order("position"),
      "Dias do treino"
    );
    const dayByKey = new Map(days.map((day) => [day.day_key, day]));
    const prescribed = await selectAll(
      client.from("plan_exercises").select("id, workout_day_id, exercise_id, position").in("workout_day_id", days.map((day) => day.id)),
      "Exercícios prescritos"
    );
    const alternatives = prescribed.length ? await selectAll(
      client.from("plan_exercise_alternatives").select("plan_exercise_id, exercise_id").in("plan_exercise_id", prescribed.map((exercise) => exercise.id)),
      "Alternativas"
    ) : [];
    const catalogIds = [...new Set([...prescribed.map((exercise) => exercise.exercise_id), ...alternatives.map((exercise) => exercise.exercise_id)])];
    const catalog = catalogIds.length ? await selectAll(
      client.from("exercise_catalog").select("id, slug").in("id", catalogIds),
      "Catálogo de exercícios"
    ) : [];
    const catalogById = new Map(catalog.map((exercise) => [exercise.id, exercise]));
    const catalogBySlug = new Map(catalog.map((exercise) => [exercise.slug, exercise]));
    const prescriptionByDayAndExercise = new Map();
    prescribed.forEach((exercise) => {
      const day = days.find((item) => item.id === exercise.workout_day_id);
      const catalogExercise = catalogById.get(exercise.exercise_id);
      const legacyId = catalogExercise?.slug?.replace(/^legacy-/, "");
      if (day && legacyId) prescriptionByDayAndExercise.set(`${day.day_key}|${legacyId}`, exercise);
    });

    const sessionMeta = new Map((state.sessions || []).filter((item) => item?.date && item?.tab).map((item) => [`${item.date}|${item.tab}`, item]));
    const groupedHistory = new Map();
    history.forEach((entry) => {
      const key = `${entry.date}|${entry.tab}`;
      if (!groupedHistory.has(key)) groupedHistory.set(key, []);
      groupedHistory.get(key).push(entry);
    });
    sessionMeta.forEach((_value, key) => { if (!groupedHistory.has(key)) groupedHistory.set(key, []); });

    const sessionRows = [];
    const exerciseRows = [];
    const setRows = [];
    let skippedExerciseLoads = 0;

    for (const [sessionKey, entries] of groupedHistory) {
      const [date, dayKey] = sessionKey.split("|");
      const day = dayByKey.get(dayKey);
      if (!day) {
        skippedExerciseLoads += entries.length;
        continue;
      }
      const meta = sessionMeta.get(sessionKey) || {};
      const sessionId = await stableUuid(`${userId}:legacy-session:${sessionKey}`);
      const completedAt = meta.completedAt || `${date}T12:00:00-03:00`;
      sessionRows.push({
        id: sessionId,
        user_id: userId,
        workout_day_id: day.id,
        status: "completed",
        session_date: date,
        completed_at: completedAt,
        total_volume: Math.max(0, Number(meta.volume) || 0),
        notes: "Importado do armazenamento local do FitPlan."
      });

      const latestByExercise = new Map(entries.map((entry) => [entry.exerciseId, entry]));
      for (const entry of latestByExercise.values()) {
        const baseSlug = `legacy-${slugify(entry.exerciseId)}`;
        const variantKey = String(entry.stateKey || "").split("::")[1];
        const selectedCatalog = variantKey ? catalogBySlug.get(`${baseSlug}-${slugify(variantKey)}`) : catalogBySlug.get(baseSlug);
        const prescribedExercise = prescriptionByDayAndExercise.get(`${dayKey}|${slugify(entry.exerciseId)}`);
        if (!selectedCatalog || !prescribedExercise) {
          skippedExerciseLoads += 1;
          continue;
        }
        const exerciseLogId = await stableUuid(`${sessionId}:legacy-exercise:${entry.stateKey}`);
        exerciseRows.push({
          id: exerciseLogId,
          session_id: sessionId,
          plan_exercise_id: prescribedExercise.id,
          exercise_id: selectedCatalog.id,
          position: prescribedExercise.position,
          personal_note: "Carga final preservada do histórico local.",
          completed_at: completedAt
        });
        const load = Number(entry.load);
        if (Number.isFinite(load) && load >= 0) {
          setRows.push({
            id: await stableUuid(`${exerciseLogId}:legacy-set:1`),
            exercise_log_id: exerciseLogId,
            set_number: 1,
            load_kg: load,
            reps: null,
            completed_at: completedAt
          });
        }
      }
    }

    const measurementRows = measurements.map((entry) => ({
      user_id: userId,
      measured_on: entry.date,
      weight_kg: numberOrNull(entry.weight),
      body_fat_percent: numberOrNull(entry.fat),
      arms_cm: numberOrNull(entry.arms),
      chest_cm: numberOrNull(entry.chest),
      waist_cm: numberOrNull(entry.waist),
      thighs_cm: numberOrNull(entry.thighs),
      notes: "Importado do armazenamento local do FitPlan."
    }));

    await upsert(client, "workout_sessions", sessionRows, { onConflict: "id" }, "Sessões");
    await upsert(client, "workout_exercise_logs", exerciseRows, { onConflict: "id" }, "Cargas dos exercícios");
    await upsert(client, "workout_set_logs", setRows, { onConflict: "id" }, "Séries");
    await upsert(client, "body_measurements", measurementRows, { onConflict: "user_id,measured_on" }, "Medidas corporais");

    const migratedAt = new Date().toISOString();
    localStorage.setItem(markerKey(userId, profileKey), migratedAt);
    return {
      migratedAt,
      sessions: sessionRows.length,
      exerciseLoads: setRows.length,
      measurements: measurementRows.length,
      skippedExerciseLoads,
      photosIncluded: false
    };
  }

  window.fitplanLegacyMigration = { preview, status, migrate };
})();
