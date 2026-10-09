import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync("public/src/supabase-client.js", "utf8");
const user = { id: "user-123", email: "athlete@example.com" };
const session = { user, access_token: "test-token" };
const activeProfile = { id: user.id, role: "athlete", active: true, legacy_profile_key: "jonathan" };

function mockClient({ initialSession = null, profile = activeProfile, profileError = null, signInError = null, recoveryError = null, authEventBeforeSignInResolves = false } = {}) {
  let authListener;
  const client = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: initialSession }, error: null }),
      onAuthStateChange: vi.fn((callback) => { authListener = callback; return { data: { subscription: { unsubscribe() {} } } }; }),
      signInWithPassword: vi.fn(async () => {
        if (authEventBeforeSignInResolves) authListener("SIGNED_IN", session);
        return signInError ? { data: {}, error: signInError } : { data: { session }, error: null };
      }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: recoveryError }),
      updateUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null })
    },
    from: vi.fn(() => ({
      select: () => ({ eq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: profile, error: profileError }) }) }),
      update: () => ({ eq: vi.fn().mockResolvedValue({ error: null }) })
    })),
    storage: { from: vi.fn(() => ({ remove: vi.fn(), upload: vi.fn(), createSignedUrl: vi.fn() })) }
  };
  return { client, emitAuth: (event, value) => authListener(event, value) };
}

async function boot(options = {}) {
  const mock = mockClient(options);
  window.supabase = { createClient: vi.fn(() => mock.client) };
  window.eval(source);
  await vi.waitFor(() => expect(window.fitplanCloud.snapshot().ready).toBe(true));
  return { ...mock, cloud: window.fitplanCloud };
}

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); history.replaceState({}, "", "/");
  delete window.fitplanCloud; delete window.supabase;
});

describe("FitPlan auth controller", () => {
  it("preserves the default Supabase storage key and persistence settings", async () => {
    await boot();
    const options = window.supabase.createClient.mock.calls[0][2].auth;
    expect(options).toMatchObject({ persistSession: true, autoRefreshToken: true, detectSessionInUrl: true });
    expect(options.flowType).toBeUndefined();
    expect(options.storageKey).toBeUndefined();
  });

  it("restores an existing session and linked profile without signing out", async () => {
    const { cloud, client } = await boot({ initialSession: session });
    expect(cloud.snapshot()).toMatchObject({ state: "authenticated", user, profile: activeProfile });
    expect(client.auth.signOut).not.toHaveBeenCalled();
  });

  it("logs in with a normalized email and an existing password", async () => {
    const { cloud, client } = await boot();
    await cloud.signInWithPassword({ email: "  ATHLETE@EXAMPLE.COM ", password: "existing-password" });
    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({ email: "athlete@example.com", password: "existing-password" });
    expect(cloud.snapshot().state).toBe("authenticated");
  });

  it("settles login when Safari emits SIGNED_IN before the request resolves", async () => {
    const { cloud, client } = await boot({ authEventBeforeSignInResolves: true });
    await cloud.signInWithPassword({ email: "athlete@example.com", password: "existing-password" });
    expect(cloud.snapshot().state).toBe("authenticated");
    expect(cloud.snapshot().profile).toEqual(activeProfile);
    expect(client.auth.signOut).not.toHaveBeenCalled();
  });

  it("rejects invalid email before a network call", async () => {
    const { cloud, client } = await boot();
    await expect(cloud.signInWithPassword({ email: "bad", password: "password" })).rejects.toThrow("e-mail válido");
    expect(client.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("maps incorrect credentials without provider details", async () => {
    const { cloud } = await boot({ signInError: { message: "Invalid login credentials: internal" } });
    await expect(cloud.signInWithPassword({ email: "athlete@example.com", password: "wrong" })).rejects.toThrow("E-mail ou senha incorretos.");
  });

  it("keeps the authenticated identity when profile loading fails", async () => {
    const { cloud, client } = await boot({ initialSession: session, profileError: { message: "Failed to fetch" } });
    expect(cloud.snapshot()).toMatchObject({ state: "error", user });
    expect(client.auth.signOut).not.toHaveBeenCalled();
  });

  it.each([[null, "profile_pending"], [{ ...activeProfile, active: false }, "profile_disabled"], [{ ...activeProfile, legacy_profile_key: null }, "profile_pending"], [{ ...activeProfile, role: "admin" }, "authenticated"]])("classifies profile authorization %#", async (profile, expected) => {
    const { cloud } = await boot({ initialSession: session, profile });
    expect(cloud.snapshot().state).toBe(expected);
  });

  it("handles token refresh through one auth listener", async () => {
    const { cloud, emitAuth } = await boot({ initialSession: session });
    emitAuth("TOKEN_REFRESHED", { ...session, access_token: "refreshed" });
    await vi.waitFor(() => expect(cloud.snapshot().session.access_token).toBe("refreshed"));
  });

  it("shows a generic recovery failure when the provider rejects delivery", async () => {
    const { cloud, client } = await boot({ recoveryError: { message: "SMTP user not found" } });
    await expect(cloud.requestPasswordRecovery(" ATHLETE@EXAMPLE.COM ")).rejects.toThrow("Não foi possível concluir a solicitação agora");
    expect(client.auth.resetPasswordForEmail.mock.calls[0][0]).toBe("athlete@example.com");
  });

  it("returns neutral recovery copy after the provider accepts the request", async () => {
    const { cloud } = await boot();
    const result = await cloud.requestPasswordRecovery("athlete@example.com");
    expect(result.message).toBe("Se existir uma conta para este e-mail, enviaremos as instruções de recuperação.");
  });

  it("handles an expired recovery link without creating a session or loop", async () => {
    history.replaceState({}, "", "/?type=recovery&error=access_denied&error_description=otp_expired");
    const { cloud, client } = await boot();
    expect(cloud.snapshot()).toMatchObject({ state: "error", user: null, error: expect.stringMatching(/expirou/) });
    expect(client.auth.signOut).not.toHaveBeenCalled();
    expect(location.search).toBe("");
  });

  it("updates a recovery password without automatic logout and consumes URL", async () => {
    history.replaceState({}, "", "/?type=recovery");
    const { cloud, client, emitAuth } = await boot({ initialSession: session });
    expect(cloud.snapshot().state).toBe("recovering_password");
    await cloud.updatePassword("new-password");
    expect(client.auth.updateUser).toHaveBeenCalledWith({ password: "new-password" });
    expect(client.auth.signOut).not.toHaveBeenCalled();
    expect(location.search).toBe("");
    expect(sessionStorage.getItem("fitplan:recovery-consumed-v2")).toBe("1");
    emitAuth("USER_UPDATED", session);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(cloud.snapshot().state).toBe("authenticated");
  });

  it("uses local scope for voluntary logout", async () => {
    const { cloud, client } = await boot({ initialSession: session });
    await cloud.signOut();
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});

describe("legacy removal", () => {
  const ui = readFileSync("public/stitch-ui.js", "utf8");
  it("has no alternate magic-link or automatic OTP password flow", () => {
    expect(source).not.toContain("signInWithOtp");
    expect(source).not.toContain("lastSignInWasOtp");
    expect(ui).not.toContain("link de acesso alternativo");
    expect(ui).not.toContain("fitplan-password-set-");
    expect(ui).not.toContain("fitplan:password-recovery");
  });
});
