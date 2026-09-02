import assert from "node:assert/strict";
import { handler } from "../netlify/functions/admin-questionnaires.mjs";

process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
process.env.RESEND_API_KEY = "test-resend-key";
process.env.RESEND_FROM_EMAIL = "FitPlan <fitplan@example.com>";
process.env.FITPLAN_SITE_URL = "https://fitplan.example.com";

const adminProfile = { id: "admin-1", display_name: "Admin", role: "admin", active: true };
const baseSubmission = {
  id: "request-1",
  user_id: null,
  full_name: "Pessoa Teste",
  email: "pessoa@example.com",
  whatsapp: null,
  answers: { goal: "Teste técnico" },
  consent_at: "2026-08-24T12:00:00.000Z",
  status: "pending",
  reviewed_by: null,
  reviewed_at: null,
  review_note: null,
  invitation_sent_at: null,
  created_at: "2026-08-24T12:00:00.000Z",
  updated_at: "2026-08-24T12:00:00.000Z"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

function event(method, body, authorized = true) {
  return {
    httpMethod: method,
    headers: authorized ? { authorization: "Bearer user-token" } : {},
    queryStringParameters: {},
    body: body ? JSON.stringify(body) : null
  };
}

function adminAuthMock(next) {
  return async (url, options = {}) => {
    const value = String(url);
    if (value.endsWith("/auth/v1/user")) return json({ id: "admin-1", email: "admin@example.com" });
    if (value.includes("/rest/v1/profiles?id=eq.admin-1")) return json([adminProfile]);
    return next(value, options);
  };
}

{
  let called = false;
  global.fetch = async () => { called = true; return json({}); };
  const result = await handler(event("GET", null, false));
  assert.equal(result.statusCode, 401);
  assert.equal(called, false);
}

{
  global.fetch = async (url) => {
    const value = String(url);
    if (value.endsWith("/auth/v1/user")) return json({ id: "athlete-1" });
    if (value.includes("/rest/v1/profiles")) return json([{ id: "athlete-1", role: "athlete", active: true }]);
    throw new Error(`Unexpected URL: ${value}`);
  };
  const result = await handler(event("GET"));
  assert.equal(result.statusCode, 403);
}

{
  global.fetch = adminAuthMock(async (url) => {
    if (url.includes("/rest/v1/questionnaire_submissions?select=")) return json([baseSubmission]);
    throw new Error(`Unexpected URL: ${url}`);
  });
  const result = await handler(event("GET"));
  assert.equal(result.statusCode, 200);
  assert.equal(JSON.parse(result.body).submissions[0].id, "request-1");
}

{
  const calls = [];
  global.fetch = adminAuthMock(async (url, options) => {
    calls.push({ url, options });
    if (url.includes("questionnaire_submissions?id=eq.request-1&select=")) return json([baseSubmission]);
    if (url.includes("questionnaire_submissions?id=eq.request-1") && options.method === "PATCH") {
      const values = JSON.parse(options.body);
      return json([{ ...baseSubmission, ...values }]);
    }
    if (url.includes("/rest/v1/profiles?id=eq.athlete-1") && options.method === "PATCH") return json([{ id: "athlete-1", ...JSON.parse(options.body) }]);
    if (url.includes("/auth/v1/admin/users")) return json({ users: [] });
    if (url.startsWith("https://example.supabase.co/auth/v1/invite?")) return json({ id: "athlete-1", email: baseSubmission.email });
    if (url.includes("/rest/v1/training_plans?")) return json([]);
    if (url.endsWith("/rest/v1/training_plans") && options.method === "POST") return json([{ id: "plan-1", status: "draft" }]);
    if (url === "https://api.resend.com/emails") return json({ id: "email-1" });
    throw new Error(`Unexpected URL: ${url}`);
  });
  const result = await handler(event("POST", { action: "approve", id: "request-1", legacyProfileKey: "sara" }));
  const payload = JSON.parse(result.body);
  assert.equal(result.statusCode, 200);
  assert.equal(payload.invited, true);
  assert.equal(payload.planId, "plan-1");
  const invite = calls.find((call) => call.url.startsWith("https://example.supabase.co/auth/v1/invite?"));
  assert.equal(new URL(invite.url).searchParams.get("redirect_to"), "https://fitplan.example.com/");
  assert.equal(Object.hasOwn(JSON.parse(invite.options.body), "redirect_to"), false);
  const approval = calls.filter((call) => call.url.includes("questionnaire_submissions?id=eq.request-1") && call.options.method === "PATCH").at(-1);
  assert.equal(JSON.parse(approval.options.body).status, "approved");
  assert.equal(JSON.parse(approval.options.body).user_id, "athlete-1");
  const linkedProfile = calls.find((call) => call.url.includes("/rest/v1/profiles?id=eq.athlete-1") && call.options.method === "PATCH");
  assert.equal(JSON.parse(linkedProfile.options.body).legacy_profile_key, "sara");
  assert.equal(JSON.parse(linkedProfile.options.body).active, true);
}

{
  global.fetch = adminAuthMock(async (url, options) => {
    if (url.includes("questionnaire_submissions?id=eq.request-1&select=")) return json([baseSubmission]);
    if (url.includes("questionnaire_submissions?id=eq.request-1") && options.method === "PATCH") {
      const values = JSON.parse(options.body);
      return json([{ ...baseSubmission, ...values }]);
    }
    if (url === "https://api.resend.com/emails") return json({ id: "email-2" });
    throw new Error(`Unexpected URL: ${url}`);
  });
  const result = await handler(event("POST", { action: "reject", id: "request-1", note: "Teste" }));
  const payload = JSON.parse(result.body);
  assert.equal(result.statusCode, 200);
  assert.equal(payload.submission.status, "rejected");
  assert.equal(payload.submission.review_note, "Teste");
}

// Approval without legacyProfileKey must NOT send legacy_profile_key in the profile PATCH
// (avoids wiping an existing key set in a previous approval).
{
  const profilePatches = [];
  global.fetch = adminAuthMock(async (url, options) => {
    if (url.includes("questionnaire_submissions?id=eq.request-1&select=")) return json([baseSubmission]);
    if (url.includes("questionnaire_submissions?id=eq.request-1") && options.method === "PATCH") {
      return json([{ ...baseSubmission, ...JSON.parse(options.body) }]);
    }
    if (url.includes("/rest/v1/profiles?id=eq.athlete-1") && options.method === "PATCH") {
      profilePatches.push(JSON.parse(options.body));
      return json([{ id: "athlete-1", ...JSON.parse(options.body) }]);
    }
    if (url.includes("/auth/v1/admin/users")) return json({ users: [] });
    if (url.startsWith("https://example.supabase.co/auth/v1/invite?")) return json({ id: "athlete-1", email: baseSubmission.email });
    if (url.includes("/rest/v1/training_plans?")) return json([]);
    if (url.endsWith("/rest/v1/training_plans") && options.method === "POST") return json([{ id: "plan-1", status: "draft" }]);
    if (url === "https://api.resend.com/emails") return json({ id: "email-3" });
    throw new Error(`Unexpected URL: ${url}`);
  });
  const result = await handler(event("POST", { action: "approve", id: "request-1" }));
  assert.equal(result.statusCode, 200);
  assert.equal(profilePatches.length, 1);
  assert.equal(Object.hasOwn(profilePatches[0], "legacy_profile_key"), false, "legacy_profile_key must not be sent when not provided");
  assert.equal(profilePatches[0].active, true);
}

console.log(JSON.stringify({
  unauthorizedBlocked: true,
  athleteBlocked: true,
  adminList: true,
  approvalInviteAndDraft: true,
  rejection: true,
  approvalWithoutLegacyKeyPreservesExisting: true
}, null, 2));
