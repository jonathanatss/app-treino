import { describe, it, expect, beforeEach } from "vitest";
import { shouldFlagAsOtp, shouldPromptSetPassword, linkedCloudProfileId } from "../helpers/auth-flow.js";

const PROFILES = { jonathan: { name: "Jonathan" }, sara: { name: "Sara" } };

// ─────────────────────────────────────────────────────────────────────────────
// shouldFlagAsOtp
// Ensures lastSignInWasOtp is only true for genuine magic-link logins.
// ─────────────────────────────────────────────────────────────────────────────
describe("shouldFlagAsOtp", () => {
  // ── password login (the bug that was reported) ────────────────────────────
  it("returns false for password login (no token in URL, no amr otp)", () => {
    const session = { user: { amr: [{ method: "password" }], app_metadata: { provider: "email" } } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(false);
  });

  it("returns false for password login with no amr field at all", () => {
    const session = { user: { app_metadata: { provider: "email" } } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(false);
  });

  it("returns false when amr is an empty array and no token in URL", () => {
    const session = { user: { amr: [] } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(false);
  });

  // ── magic link login (should prompt) ─────────────────────────────────────
  it("returns true when access_token was in URL hash (magic link redirect)", () => {
    const session = { user: { amr: [{ method: "otp" }], app_metadata: { provider: "email" } } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, true)).toBe(true);
  });

  it("returns true when amr explicitly contains otp even without token in URL", () => {
    const session = { user: { amr: [{ method: "otp" }] } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(true);
  });

  it("returns true when amr has multiple methods and otp is one of them", () => {
    const session = { user: { amr: [{ method: "password" }, { method: "otp" }] } };
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(true);
  });

  // ── non SIGNED_IN events ─────────────────────────────────────────────────
  it("returns false for PASSWORD_RECOVERY event", () => {
    const session = { user: { amr: [{ method: "otp" }] } };
    expect(shouldFlagAsOtp("PASSWORD_RECOVERY", session, true)).toBe(false);
  });

  it("returns false for TOKEN_REFRESHED event", () => {
    expect(shouldFlagAsOtp("TOKEN_REFRESHED", null, false)).toBe(false);
  });

  it("returns false for SIGNED_OUT event", () => {
    expect(shouldFlagAsOtp("SIGNED_OUT", null, false)).toBe(false);
  });

  // ── edge cases ────────────────────────────────────────────────────────────
  it("handles null session gracefully", () => {
    expect(shouldFlagAsOtp("SIGNED_IN", null, false)).toBe(false);
  });

  it("handles session with no user gracefully", () => {
    expect(shouldFlagAsOtp("SIGNED_IN", {}, false)).toBe(false);
  });

  it("handles non-array amr gracefully", () => {
    const session = { user: { amr: "otp" } }; // malformed
    expect(shouldFlagAsOtp("SIGNED_IN", session, false)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// shouldPromptSetPassword
// Ensures the set-password modal only appears in the right conditions.
// ─────────────────────────────────────────────────────────────────────────────
describe("shouldPromptSetPassword", () => {
  it("returns true only when OTP, userId present, and flag not set", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: "abc", storedFlag: null })).toBe(true);
  });

  it("returns false when signed in via password (signedInViaOtp = false)", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: false, userId: "abc", storedFlag: null })).toBe(false);
  });

  it("returns false when flag was already set (user already saw the modal)", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: "abc", storedFlag: "1" })).toBe(false);
  });

  it("returns false when userId is missing", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: null, storedFlag: null })).toBe(false);
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: undefined, storedFlag: null })).toBe(false);
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: "", storedFlag: null })).toBe(false);
  });

  it("returns false when all are false/null", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: false, userId: null, storedFlag: null })).toBe(false);
  });

  it("flag being any truthy string counts as already seen", () => {
    expect(shouldPromptSetPassword({ signedInViaOtp: true, userId: "abc", storedFlag: "2026-08-25" })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// linkedCloudProfileId (existing tests kept, extended)
// ─────────────────────────────────────────────────────────────────────────────
describe("linkedCloudProfileId", () => {
  const makeCloud = (overrides = {}) => ({
    ready: true,
    user: { id: "user-1" },
    profile: { id: "user-1", legacy_profile_key: "jonathan", active: true },
    ...overrides
  });

  it("returns profile id when all conditions are met", () => {
    expect(linkedCloudProfileId(makeCloud(), PROFILES)).toBe("jonathan");
  });

  it("returns null when not ready", () => {
    expect(linkedCloudProfileId(makeCloud({ ready: false }), PROFILES)).toBeNull();
  });

  it("returns null when no user", () => {
    expect(linkedCloudProfileId(makeCloud({ user: null }), PROFILES)).toBeNull();
  });

  it("returns null when profile is inactive", () => {
    expect(linkedCloudProfileId(makeCloud({ profile: { legacy_profile_key: "jonathan", active: false } }), PROFILES)).toBeNull();
  });

  it("returns null when legacy_profile_key not in local profiles", () => {
    expect(linkedCloudProfileId(makeCloud({ profile: { legacy_profile_key: "unknown", active: true } }), PROFILES)).toBeNull();
  });

  it("returns null when profile is null", () => {
    expect(linkedCloudProfileId(makeCloud({ profile: null }), PROFILES)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration: full password login flow should never show set-password modal
// ─────────────────────────────────────────────────────────────────────────────
describe("password login flow — modal must not appear", () => {
  it("password login: shouldFlagAsOtp=false → shouldPromptSetPassword=false", () => {
    const session = { user: { amr: [{ method: "password" }], app_metadata: { provider: "email" } } };
    const hasTokenInUrl = false;
    const flaggedAsOtp = shouldFlagAsOtp("SIGNED_IN", session, hasTokenInUrl);
    expect(flaggedAsOtp).toBe(false);
    const shouldPrompt = shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: null });
    expect(shouldPrompt).toBe(false);
  });

  it("password login on clean device (no amr, no token in URL): no modal", () => {
    const session = { user: { app_metadata: { provider: "email" } } };
    const flaggedAsOtp = shouldFlagAsOtp("SIGNED_IN", session, false);
    const shouldPrompt = shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: null });
    expect(flaggedAsOtp).toBe(false);
    expect(shouldPrompt).toBe(false);
  });

  it("session restore (TOKEN_REFRESHED): never shows modal", () => {
    const flaggedAsOtp = shouldFlagAsOtp("TOKEN_REFRESHED", { user: {} }, false);
    expect(flaggedAsOtp).toBe(false);
    expect(shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: null })).toBe(false);
  });

  it("magic link on new device with no flag: shows modal once", () => {
    const session = { user: { amr: [{ method: "otp" }] } };
    const flaggedAsOtp = shouldFlagAsOtp("SIGNED_IN", session, true);
    expect(flaggedAsOtp).toBe(true);
    const shouldPrompt = shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: null });
    expect(shouldPrompt).toBe(true);
  });

  it("magic link second time (flag already set): no modal", () => {
    const session = { user: { amr: [{ method: "otp" }] } };
    const flaggedAsOtp = shouldFlagAsOtp("SIGNED_IN", session, true);
    expect(flaggedAsOtp).toBe(true);
    const shouldPrompt = shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: "1" });
    expect(shouldPrompt).toBe(false);
  });

  it("password recovery event: lastSignInWasOtp cleared, no set-password modal", () => {
    // PASSWORD_RECOVERY should open set-password via a separate event,
    // but should NOT set lastSignInWasOtp = true
    const flaggedAsOtp = shouldFlagAsOtp("PASSWORD_RECOVERY", { user: {} }, false);
    expect(flaggedAsOtp).toBe(false);
    expect(shouldPromptSetPassword({ signedInViaOtp: flaggedAsOtp, userId: "user-1", storedFlag: null })).toBe(false);
  });
});
