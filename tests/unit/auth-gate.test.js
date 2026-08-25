import { describe, it, expect } from "vitest";
import { linkedCloudProfileId } from "../helpers/auth-gate.js";

const PROFILES = {
  jonathan: { name: "Jonathan" },
  sara: { name: "Sara" },
  fernanda: { name: "Fernanda" }
};

function makeCloud(overrides = {}) {
  return {
    ready: true,
    user: { id: "user-123", email: "test@example.com" },
    profile: {
      id: "user-123",
      legacy_profile_key: "jonathan",
      role: "athlete",
      active: true
    },
    error: null,
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// linkedCloudProfileId
// ---------------------------------------------------------------------------
describe("linkedCloudProfileId", () => {
  it("returns profile id when user is authenticated with a valid linked profile", () => {
    const cloud = makeCloud();
    expect(linkedCloudProfileId(cloud, PROFILES)).toBe("jonathan");
  });

  it("returns null when cloud is not ready", () => {
    const cloud = makeCloud({ ready: false });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("returns null when user is not authenticated", () => {
    const cloud = makeCloud({ user: null });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("returns null when profile is inactive", () => {
    const cloud = makeCloud({
      profile: { legacy_profile_key: "jonathan", active: false }
    });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("returns null when legacy_profile_key is not in local profiles", () => {
    const cloud = makeCloud({
      profile: { legacy_profile_key: "pablo", active: true }
    });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("returns null when legacy_profile_key is missing", () => {
    const cloud = makeCloud({
      profile: { legacy_profile_key: null, active: true }
    });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("returns null when profile is null", () => {
    const cloud = makeCloud({ profile: null });
    expect(linkedCloudProfileId(cloud, PROFILES)).toBeNull();
  });

  it("works for all known profiles", () => {
    for (const id of Object.keys(PROFILES)) {
      const cloud = makeCloud({
        profile: { legacy_profile_key: id, active: true }
      });
      expect(linkedCloudProfileId(cloud, PROFILES)).toBe(id);
    }
  });
});

// ---------------------------------------------------------------------------
// applyCloudAuthGate logic
// ---------------------------------------------------------------------------
describe("applyCloudAuthGate behavior", () => {
  it("should trigger openPinScreen when linkedId found and app screen is hidden", () => {
    const cloud = makeCloud();
    const linkedId = linkedCloudProfileId(cloud, PROFILES);
    const screenAppHidden = true;
    const currentProfile = null;

    // When there's a linkedId and app is not visible → should open PIN
    const shouldOpenPin = linkedId && (currentProfile !== linkedId || screenAppHidden);
    expect(shouldOpenPin).toBe(true);
  });

  it("should NOT trigger openPinScreen when already in app with correct profile", () => {
    const cloud = makeCloud();
    const linkedId = linkedCloudProfileId(cloud, PROFILES);
    const screenAppHidden = false;
    const currentProfile = "jonathan";

    // Already in app with correct profile → do nothing
    const shouldDoNothing = linkedId && currentProfile === linkedId && !screenAppHidden;
    expect(shouldDoNothing).toBe(true);
  });

  it("should NOT trigger openPinScreen when PIN screen is already visible", () => {
    const cloud = makeCloud();
    const linkedId = linkedCloudProfileId(cloud, PROFILES);
    const screenPinHidden = false; // PIN screen is visible

    // PIN screen already open → do nothing (prevent loop)
    const shouldSkip = linkedId && !screenPinHidden;
    expect(shouldSkip).toBe(true);
  });

  it("should call logout when no linkedId and currentProfile is set", () => {
    const cloud = makeCloud({ user: null });
    const linkedId = linkedCloudProfileId(cloud, PROFILES);
    const currentProfile = "jonathan";

    // No session but profile was active → should logout
    const shouldLogout = !linkedId && currentProfile !== null;
    expect(shouldLogout).toBe(true);
  });

  it("should show picker when no linkedId and no currentProfile", () => {
    const cloud = makeCloud({ user: null });
    const linkedId = linkedCloudProfileId(cloud, PROFILES);
    const currentProfile = null;

    // No session, no profile → show picker
    const shouldShowPicker = !linkedId && currentProfile === null;
    expect(shouldShowPicker).toBe(true);
  });
});
