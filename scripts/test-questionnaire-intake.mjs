import assert from "node:assert/strict";
import { handler } from "../netlify/functions/submit-questionnaire.mjs";

const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;
const originalEnv = { ...process.env };

const validPayload = {
  fullName: "Pessoa Teste",
  email: "pessoa@example.com",
  whatsapp: "",
  age: 30,
  heightCm: 175,
  weightKg: 78.5,
  sex: "Prefiro não informar",
  routine: "Trabalho em horário comercial.",
  goal: "Melhorar força e condicionamento.",
  experience: "Um ano de musculação.",
  daysAvailable: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
  unavailableEquipment: "Nenhum.",
  priorities: ["Costas/dorsais", "Quadríceps"],
  avoidExercises: "Nenhum.",
  limitations: "Nenhuma.",
  cardio: "Caminhada três vezes por semana.",
  recovery: "Sete horas de sono.",
  nutrition: "Alimentação acompanhada.",
  healthMedications: "Nenhuma.",
  expectations: "Treinar com regularidade.",
  consent: true,
  botField: "",
  source: "http://127.0.0.1:4173"
};

function event(payload = validPayload, method = "POST") {
  return { httpMethod: method, body: JSON.stringify(payload) };
}

try {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.RESEND_FROM_EMAIL = "FitPlan <notificacoes@example.com>";
  process.env.QUESTIONNAIRE_NOTIFICATION_EMAIL = "responsavel@example.com";

  assert.equal((await handler(event(validPayload, "GET"))).statusCode, 405);
  assert.equal((await handler(event({ ...validPayload, email: "", whatsapp: "" }))).statusCode, 400);

  let requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), options });
    if (String(url).includes("questionnaire_submissions")) {
      return new Response(JSON.stringify([{ id: "00000000-0000-4000-8000-000000000001", created_at: "2026-08-24T20:00:00Z" }]), { status: 201 });
    }
    return new Response(JSON.stringify({ id: "email-test" }), { status: 200 });
  };

  const success = await handler(event());
  assert.equal(success.statusCode, 201);
  assert.deepEqual(JSON.parse(success.body), { ok: true, notificationSent: true });
  assert.equal(requests.length, 2);
  const databaseBody = JSON.parse(requests[0].options.body);
  assert.equal(databaseBody.status, "pending");
  assert.equal(databaseBody.user_id, undefined);
  assert.deepEqual(databaseBody.answers.days_available, validPayload.daysAvailable);
  const emailBody = requests[1].options.body;
  assert.doesNotMatch(emailBody, /Nenhuma\.|Caminhada três/);
  assert.match(emailBody, /Consulte as respostas completas somente na área administrativa/);

  requests = [];
  const bot = await handler(event({ ...validPayload, botField: "spam" }));
  assert.equal(bot.statusCode, 202);
  assert.equal(requests.length, 0);

  console.error = () => {};
  globalThis.fetch = async () => new Response("erro", { status: 500 });
  assert.equal((await handler(event())).statusCode, 502);
  console.error = originalConsoleError;

  console.log(JSON.stringify({ validation: true, databaseInsert: true, notification: true, healthDataExcludedFromEmail: true, honeypot: true }, null, 2));
} finally {
  globalThis.fetch = originalFetch;
  console.error = originalConsoleError;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
}
