const MAX_BODY_BYTES = 12_000;
const ALLOWED_STATUSES = new Set(["pending", "reviewing", "approved", "rejected", "archived"]);

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

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

function text(value, maxLength = 1_000) {
  return String(value ?? "").trim().replace(/\u0000/g, "").slice(0, maxLength);
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

function envConfig(env) {
  const supabaseUrl = text(env.SUPABASE_URL, 500).replace(/\/$/, "");
  const serviceRoleKey = text(env.SUPABASE_SERVICE_ROLE_KEY, 4_000);
  if (!supabaseUrl || !serviceRoleKey) throw new HttpError(503, "Configuração administrativa indisponível.");
  return { supabaseUrl, serviceRoleKey };
}

function bearerToken(event) {
  const value = text(event.headers?.authorization || event.headers?.Authorization, 8_000);
  const match = value.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new HttpError(401, "Entre com a conta administrativa.");
  return match[1];
}

async function jsonResult(result, fallbackMessage) {
  let payload = null;
  try { payload = await result.json(); } catch { payload = null; }
  if (!result.ok) {
    const detail = text(payload?.msg || payload?.message || payload?.error_description || payload?.error, 500);
    console.error("FitPlan admin request failed", { status: result.status, detail: detail || undefined });
    throw new HttpError(result.status >= 500 ? 502 : result.status, fallbackMessage);
  }
  return payload;
}

function authHeaders(key, token = key, prefer = "") {
  return {
    apikey: key,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {})
  };
}

async function requireAdmin(event, env) {
  const { supabaseUrl, serviceRoleKey } = envConfig(env);
  const token = bearerToken(event);
  const userResult = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: authHeaders(serviceRoleKey, token)
  });
  const user = await jsonResult(userResult, "Sua sessão expirou. Entre novamente.");
  if (!user?.id) throw new HttpError(401, "Sua sessão expirou. Entre novamente.");

  const profileResult = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,display_name,role,active`, {
    headers: authHeaders(serviceRoleKey, token)
  });
  const profiles = await jsonResult(profileResult, "Não foi possível validar o acesso administrativo.");
  const profile = Array.isArray(profiles) ? profiles[0] : null;
  if (!profile || profile.active === false || profile.role !== "admin") {
    throw new HttpError(403, "Esta área é restrita ao administrador.");
  }
  return { profile, token, supabaseUrl, serviceRoleKey };
}

async function loadSubmission(id, admin) {
  const select = "id,user_id,full_name,email,whatsapp,answers,consent_at,status,reviewed_by,reviewed_at,review_note,invitation_sent_at,created_at,updated_at";
  const result = await fetch(`${admin.supabaseUrl}/rest/v1/questionnaire_submissions?id=eq.${encodeURIComponent(id)}&select=${select}&limit=1`, {
    headers: authHeaders(admin.serviceRoleKey, admin.token)
  });
  const rows = await jsonResult(result, "Não foi possível carregar a solicitação.");
  const submission = Array.isArray(rows) ? rows[0] : null;
  if (!submission) throw new HttpError(404, "Solicitação não encontrada.");
  return submission;
}

async function listSubmissions(event, admin) {
  const query = new URLSearchParams(event.queryStringParameters || {});
  const status = text(query.get("status"), 30);
  if (status && !ALLOWED_STATUSES.has(status)) throw new HttpError(400, "Filtro de status inválido.");
  const select = "id,user_id,full_name,email,whatsapp,answers,consent_at,status,reviewed_by,reviewed_at,review_note,invitation_sent_at,created_at,updated_at";
  const filter = status ? `&status=eq.${encodeURIComponent(status)}` : "";
  const result = await fetch(`${admin.supabaseUrl}/rest/v1/questionnaire_submissions?select=${select}${filter}&order=created_at.desc&limit=100`, {
    headers: authHeaders(admin.serviceRoleKey, admin.token)
  });
  const submissions = await jsonResult(result, "Não foi possível carregar as solicitações.");
  return response(200, { submissions: Array.isArray(submissions) ? submissions : [] });
}

async function findExistingUser(email, admin) {
  const result = await fetch(`${admin.supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: authHeaders(admin.serviceRoleKey)
  });
  const payload = await jsonResult(result, "Não foi possível consultar as contas existentes.");
  const users = Array.isArray(payload?.users) ? payload.users : (Array.isArray(payload) ? payload : []);
  return users.find((user) => String(user.email || "").toLowerCase() === email) || null;
}

function appUrl(env, path = "/") {
  const candidate = text(env.FITPLAN_SITE_URL || env.URL || "https://app-treino-jonathan.netlify.app", 500);
  try {
    const url = new URL(candidate);
    url.pathname = path;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return `https://app-treino-jonathan.netlify.app${path}`;
  }
}

async function inviteOrFindUser(submission, admin, env) {
  const email = text(submission.email, 254).toLowerCase();
  if (!email) throw new HttpError(400, "Inclua um e-mail antes de aprovar esta solicitação.");
  const existing = await findExistingUser(email, admin);
  if (existing?.id) return { user: existing, invited: false };

  const redirectTo = encodeURIComponent(appUrl(env, "/"));
  const result = await fetch(`${admin.supabaseUrl}/auth/v1/invite?redirect_to=${redirectTo}`, {
    method: "POST",
    headers: authHeaders(admin.serviceRoleKey),
    body: JSON.stringify({
      email,
      data: {
        display_name: submission.full_name,
        questionnaire_submission_id: submission.id
      }
    })
  });
  const payload = await jsonResult(result, "Não foi possível enviar o convite. Verifique o SMTP do Supabase.");
  const user = payload?.user || payload;
  if (!user?.id) throw new HttpError(502, "O Supabase não confirmou a criação da conta.");
  return { user, invited: true };
}

async function ensureDraftPlan(submission, userId, admin) {
  const existingResult = await fetch(`${admin.supabaseUrl}/rest/v1/training_plans?athlete_id=eq.${encodeURIComponent(userId)}&select=id,status&order=created_at.desc&limit=1`, {
    headers: authHeaders(admin.serviceRoleKey, admin.token)
  });
  const existingRows = await jsonResult(existingResult, "Não foi possível verificar o plano do aluno.");
  if (Array.isArray(existingRows) && existingRows[0]?.id) return existingRows[0];

  const goal = text(submission.answers?.goal, 2_000);
  const result = await fetch(`${admin.supabaseUrl}/rest/v1/training_plans`, {
    method: "POST",
    headers: authHeaders(admin.serviceRoleKey, admin.token, "return=representation"),
    body: JSON.stringify({
      athlete_id: userId,
      coach_id: admin.profile.id,
      title: `Plano inicial — ${text(submission.full_name, 80)}`,
      goal: goal || null,
      methodology: "Em elaboração após análise do questionário.",
      science_rationale: "Rascunho criado na aprovação do cadastro; a prescrição será revisada pelo responsável.",
      status: "draft"
    })
  });
  const rows = await jsonResult(result, "A conta foi criada, mas não foi possível abrir o plano em rascunho.");
  return Array.isArray(rows) ? rows[0] : null;
}

async function updateSubmission(id, values, admin) {
  const result = await fetch(`${admin.supabaseUrl}/rest/v1/questionnaire_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(admin.serviceRoleKey, admin.token, "return=representation"),
    body: JSON.stringify(values)
  });
  const rows = await jsonResult(result, "Não foi possível atualizar a solicitação.");
  const updated = Array.isArray(rows) ? rows[0] : null;
  if (!updated) throw new HttpError(404, "Solicitação não encontrada.");
  return updated;
}

async function sendDecisionEmail(submission, decision, env) {
  const apiKey = text(env.RESEND_API_KEY, 4_000);
  const from = text(env.RESEND_FROM_EMAIL, 320);
  const to = text(submission.email, 254);
  if (!apiKey || !from || !to) return false;
  const approved = decision === "approved";
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "fitplan-netlify/1.0",
      "Idempotency-Key": `questionnaire-${decision}-${submission.id}`
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: approved ? "Cadastro aprovado — FitPlan" : "Atualização da sua solicitação — FitPlan",
      html: approved
        ? `<h1>Seu cadastro foi aprovado</h1><p>Olá, ${escapeHtml(text(submission.full_name, 120))}.</p><p>Sua conta FitPlan foi liberada. Use o convite de acesso enviado para o seu e-mail.</p><p><a href="${escapeHtml(appUrl(env, "/"))}">Abrir o FitPlan</a></p>`
        : `<h1>Atualização da solicitação</h1><p>Olá, ${escapeHtml(text(submission.full_name, 120))}.</p><p>Sua solicitação não foi aprovada neste momento. Entre em contato com o responsável caso precise de mais informações.</p>`
    })
  });
  if (!result.ok) {
    console.error("FitPlan decision email failed", { status: result.status, submissionId: submission.id });
    return false;
  }
  return true;
}

async function approveSubmission(submission, admin, env) {
  if (submission.status === "approved" && submission.user_id) {
    return response(200, { ok: true, alreadyApproved: true, submission });
  }
  await updateSubmission(submission.id, { status: "reviewing" }, admin);
  try {
    const { user, invited } = await inviteOrFindUser(submission, admin, env);
    const plan = await ensureDraftPlan(submission, user.id, admin);
    const reviewedAt = new Date().toISOString();
    const updated = await updateSubmission(submission.id, {
      user_id: user.id,
      status: "approved",
      reviewed_by: admin.profile.id,
      reviewed_at: reviewedAt,
      invitation_sent_at: invited ? reviewedAt : submission.invitation_sent_at,
      review_note: null
    }, admin);
    const notificationSent = await sendDecisionEmail(submission, "approved", env);
    return response(200, { ok: true, invited, notificationSent, planId: plan?.id || null, submission: updated });
  } catch (error) {
    await updateSubmission(submission.id, { status: "pending" }, admin).catch(() => {});
    throw error;
  }
}

async function rejectSubmission(submission, note, admin, env) {
  const reviewedAt = new Date().toISOString();
  const updated = await updateSubmission(submission.id, {
    status: "rejected",
    reviewed_by: admin.profile.id,
    reviewed_at: reviewedAt,
    review_note: text(note, 2_000) || null
  }, admin);
  const notificationSent = await sendDecisionEmail(submission, "rejected", env);
  return response(200, { ok: true, notificationSent, submission: updated });
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return response(204, {});
  try {
    const admin = await requireAdmin(event, process.env);
    if (event.httpMethod === "GET") return await listSubmissions(event, admin);
    if (event.httpMethod !== "POST") throw new HttpError(405, "Método não permitido.");
    if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY_BYTES) throw new HttpError(413, "Solicitação inválida.");
    let payload;
    try { payload = JSON.parse(event.body); } catch { throw new HttpError(400, "Dados inválidos."); }
    const id = text(payload.id, 80);
    const action = text(payload.action, 30);
    if (!id || !["approve", "reject"].includes(action)) throw new HttpError(400, "Ação administrativa inválida.");
    const submission = await loadSubmission(id, admin);
    if (action === "approve") return await approveSubmission(submission, admin, process.env);
    return await rejectSubmission(submission, payload.note, admin, process.env);
  } catch (error) {
    const statusCode = Number(error.statusCode) || 500;
    if (statusCode >= 500) console.error("FitPlan questionnaire admin failed", { message: error.message });
    return response(statusCode, { error: statusCode >= 500 ? "Não foi possível concluir a operação agora." : error.message });
  }
}
