(function () {
  "use strict";
  function requireAdmin() {
    const cloud = window.fitplanCloud?.snapshot();
    if (!cloud?.user || cloud.profile?.role !== "admin") throw new Error("Acesso administrativo necessário.");
    return window.fitplanCloud.client;
  }
  async function inactiveUsers(days = 7) {
    const result = await requireAdmin().rpc("admin_user_engagement", { inactive_after_days: Math.max(0, Number(days) || 0) });
    if (result.error) throw result.error;
    return result.data || [];
  }
  async function recentAccess(limit = 100) {
    const result = await requireAdmin().from("user_app_sessions")
      .select("id,user_id,started_at,last_active_at,ended_at,active_seconds,platform,profiles!inner(display_name,role)")
      .order("last_active_at", { ascending: false }).limit(Math.min(500, Math.max(1, limit)));
    if (result.error) throw result.error;
    return result.data || [];
  }
  async function userContacts(userIds = []) {
    const ids = [...new Set(userIds.filter(Boolean))];
    if (!ids.length) return {};
    const result = await requireAdmin().from("questionnaire_submissions")
      .select("user_id,whatsapp,email,created_at")
      .in("user_id", ids)
      .order("created_at", { ascending: false });
    if (result.error) throw result.error;
    return (result.data || []).reduce((contacts, row) => {
      if (row.user_id && !contacts[row.user_id]) contacts[row.user_id] = { whatsapp: row.whatsapp || "", email: row.email || "" };
      return contacts;
    }, {});
  }
  async function userTimeline(userId, options = {}) {
    const query = requireAdmin().from("user_audit_logs")
      .select("id,event_name,occurred_at,payload,app_session_id")
      .eq("user_id", userId).order("occurred_at", { ascending: false })
      .limit(Math.min(500, Math.max(1, options.limit || 100)));
    if (options.eventName) query.eq("event_name", options.eventName);
    if (options.since) query.gte("occurred_at", options.since);
    const result = await query;
    if (result.error) throw result.error;
    return result.data || [];
  }
  window.FitPlanAdminObservability = Object.freeze({ inactiveUsers, recentAccess, userContacts, userTimeline });
})();
