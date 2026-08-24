const MAX_BODY_BYTES = 48_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function response(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    },
    body: JSON.stringify(payload)
  };
}

function text(value, maxLength) {
  return String(value ?? "").trim().replace(/\u0000/g, "").slice(0, maxLength);
}

function numberInRange(value, min, max) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function stringList(value, allowed, maxItems = 14) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, 80)).filter((item) => allowed.includes(item)))].slice(0, maxItems);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function parseSubmission(raw) {
  const allowedDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
  const allowedMuscles = ["Peitoral", "Costas/dorsais", "Ombros", "Trapézio", "Bíceps", "Tríceps", "Antebraços", "Quadríceps", "Posterior de coxa", "Glúteos", "Panturrilhas", "Abdômen/core"];
  const allowedSex = ["Feminino", "Masculino", "Intersexo", "Prefiro não informar"];
  const fullName = text(raw.fullName, 120);
  const email = text(raw.email, 254).toLowerCase();
  const whatsapp = text(raw.whatsapp, 30);
  const whatsappDigits = whatsapp.replace(/\D/g, "");
  const age = numberInRange(raw.age, 12, 100);
  const heightCm = numberInRange(raw.heightCm, 100, 250);
  const weightKg = numberInRange(raw.weightKg, 30, 400);
  const sex = text(raw.sex, 40);
  const daysAvailable = stringList(raw.daysAvailable, allowedDays, 7);
  const priorities = stringList(raw.priorities, allowedMuscles, 12);
  const requiredAnswers = {
    routine: text(raw.routine, 2_000),
    goal: text(raw.goal, 2_000),
    experience: text(raw.experience, 2_000),
    unavailableEquipment: text(raw.unavailableEquipment, 2_000),
    limitations: text(raw.limitations, 3_000),
    avoidExercises: text(raw.avoidExercises, 2_000),
    cardio: text(raw.cardio, 2_000),
    recovery: text(raw.recovery, 2_000),
    nutrition: text(raw.nutrition, 2_000),
    healthMedications: text(raw.healthMedications, 3_000),
    expectations: text(raw.expectations, 2_000)
  };

  if (fullName.length < 2) throw new Error("Informe o nome completo.");
  if (!email && !whatsapp) throw new Error("Informe um e-mail ou WhatsApp.");
  if (email && !EMAIL_PATTERN.test(email)) throw new Error("Informe um e-mail válido.");
  if (whatsapp && (whatsappDigits.length < 10 || whatsappDigits.length > 15)) throw new Error("Informe um WhatsApp válido.");
  if (age === null || heightCm === null || weightKg === null || !allowedSex.includes(sex)) throw new Error("Revise idade, altura, peso e sexo.");
  if (!daysAvailable.length || !priorities.length) throw new Error("Selecione os dias disponíveis e as prioridades.");
  if (Object.values(requiredAnswers).some((answer) => answer.length < 2)) throw new Error("Preencha todas as respostas obrigatórias.");
  if (raw.consent !== true) throw new Error("O consentimento é obrigatório.");

  return {
    full_name: fullName,
    email: email || null,
    whatsapp: whatsapp || null,
    consent_at: new Date().toISOString(),
    status: "pending",
    answers: {
      age,
      height_cm: heightCm,
      weight_kg: weightKg,
      sex,
      routine: requiredAnswers.routine,
      goal: requiredAnswers.goal,
      experience: requiredAnswers.experience,
      days_available: daysAvailable,
      unavailable_equipment: requiredAnswers.unavailableEquipment,
      priorities,
      avoid_exercises: requiredAnswers.avoidExercises,
      limitations: requiredAnswers.limitations,
      cardio: requiredAnswers.cardio,
      recovery: requiredAnswers.recovery,
      nutrition: requiredAnswers.nutrition,
      health_medications: requiredAnswers.healthMedications,
      expectations: requiredAnswers.expectations,
      source: text(raw.source, 200)
    }
  };
}

async function insertSubmission(submission, env) {
  const supabaseUrl = text(env.SUPABASE_URL, 500).replace(/\/$/, "");
  const serviceRoleKey = text(env.SUPABASE_SERVICE_ROLE_KEY, 4_000);
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Configuração do banco indisponível.");
  const result = await fetch(`${supabaseUrl}/rest/v1/questionnaire_submissions`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(submission)
  });
  if (!result.ok) {
    console.error("Questionnaire insert failed", { status: result.status });
    throw new Error("Não foi possível registrar a solicitação.");
  }
  const rows = await result.json();
  if (!Array.isArray(rows) || !rows[0]?.id) throw new Error("O banco não confirmou a solicitação.");
  return rows[0];
}

async function sendNotification(submission, inserted, env) {
  const apiKey = text(env.RESEND_API_KEY, 4_000);
  const from = text(env.RESEND_FROM_EMAIL, 320);
  const to = text(env.QUESTIONNAIRE_NOTIFICATION_EMAIL, 254);
  if (!apiKey || !from || !to) return false;
  const createdAt = inserted.created_at || submission.consent_at;
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Nova solicitação de cadastro — FitPlan",
      html: `<h1>Nova solicitação no FitPlan</h1><p><strong>${escapeHtml(submission.full_name)}</strong> respondeu ao questionário.</p><p>Recebida em ${escapeHtml(new Date(createdAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }))}.</p><p>Identificador: <code>${escapeHtml(inserted.id)}</code></p><p>Consulte as respostas completas somente na área administrativa.</p>`
    })
  });
  if (!result.ok) {
    console.error("Questionnaire email failed", { status: result.status, submissionId: inserted.id });
    return false;
  }
  return true;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return response(204, {});
  if (event.httpMethod !== "POST") return response(405, { error: "Método não permitido." });
  if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY_BYTES) return response(413, { error: "Solicitação muito grande." });

  let raw;
  try {
    raw = JSON.parse(event.body);
  } catch {
    return response(400, { error: "Dados inválidos." });
  }
  if (text(raw.botField, 200)) return response(202, { ok: true });

  let submission;
  try {
    submission = parseSubmission(raw);
  } catch (error) {
    return response(400, { error: error.message });
  }

  try {
    const inserted = await insertSubmission(submission, process.env);
    const notificationSent = await sendNotification(submission, inserted, process.env);
    return response(201, { ok: true, notificationSent });
  } catch (error) {
    console.error("Questionnaire request failed", { message: error.message });
    return response(502, { error: "Não foi possível enviar agora. Tente novamente em alguns minutos." });
  }
}
