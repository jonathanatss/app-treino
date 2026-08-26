/**
 * Pure logic extracted from supabase-client.js and stitch-ui.js for auth flow testing.
 * Must stay in sync with source implementations.
 */

// ---------------------------------------------------------------------------
// lastSignInWasOtp detection — supabase-client.js onAuthStateChange
// ---------------------------------------------------------------------------

/**
 * Determines whether a SIGNED_IN event was from a magic link (OTP).
 * Source: supabase-client.js — onAuthStateChange SIGNED_IN branch.
 *
 * @param {string} event - Supabase auth event name
 * @param {object|null} session - Supabase session object
 * @param {boolean} hasTokenInUrl - whether access_token was in window.location.hash
 * @returns {boolean}
 */
export function shouldFlagAsOtp(event, session, hasTokenInUrl) {
  if (event !== "SIGNED_IN") return false;
  const amr = session?.user?.amr;
  const amrUsedOtp = Array.isArray(amr) && amr.some((a) => a.method === "otp");
  return hasTokenInUrl || amrUsedOtp;
}

// ---------------------------------------------------------------------------
// applyCloudAuthGate set-password prompt logic
// Extracted pure decision: should we show the set-password sheet?
// ---------------------------------------------------------------------------

/**
 * Returns true if the set-password modal should be shown after enterApp.
 * Source: stitch-ui.js — applyCloudAuthGate
 *
 * @param {object} options
 * @param {boolean} options.signedInViaOtp - fitplanCloud.lastSignInWasOtp
 * @param {string|null} options.userId - cloud.user?.id
 * @param {string|null} options.storedFlag - localStorage value for fitplan-password-set-{userId}
 */
export function shouldPromptSetPassword({ signedInViaOtp, userId, storedFlag }) {
  return signedInViaOtp === true && !!userId && !storedFlag;
}

// ---------------------------------------------------------------------------
// linkedCloudProfileId — stitch-ui.js
// ---------------------------------------------------------------------------
export function linkedCloudProfileId(cloud, profiles) {
  const linkedId = cloud?.profile?.legacy_profile_key;
  if (!cloud?.ready || !cloud?.user || cloud?.profile?.active === false) return null;
  return linkedId && profiles[linkedId] ? linkedId : null;
}
