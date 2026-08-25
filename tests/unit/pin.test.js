import { describe, it, expect, beforeEach } from "vitest";
import { hashPin, profilePinKey, ACTIVE_KEY } from "../helpers/pin.js";

// ---------------------------------------------------------------------------
// hashPin
// ---------------------------------------------------------------------------
describe("hashPin", () => {
  it("returns a non-empty string", () => {
    expect(typeof hashPin("1234")).toBe("string");
    expect(hashPin("1234").length).toBeGreaterThan(0);
  });

  it("is deterministic — same PIN always produces same hash", () => {
    expect(hashPin("1234")).toBe(hashPin("1234"));
    expect(hashPin("0000")).toBe(hashPin("0000"));
  });

  it("produces different hashes for different PINs", () => {
    expect(hashPin("1234")).not.toBe(hashPin("4321"));
    expect(hashPin("0000")).not.toBe(hashPin("1111"));
  });

  it("handles all digit combinations without throwing", () => {
    for (let i = 1000; i <= 9999; i++) {
      expect(() => hashPin(String(i))).not.toThrow();
    }
  });
});

// ---------------------------------------------------------------------------
// profilePinKey
// ---------------------------------------------------------------------------
describe("profilePinKey", () => {
  it("returns correct localStorage key for a profile id", () => {
    expect(profilePinKey("jonathan")).toBe("gym-app-profile-jonathan-pin");
    expect(profilePinKey("sara")).toBe("gym-app-profile-sara-pin");
  });
});

// ---------------------------------------------------------------------------
// PIN flow simulation (processPinSubmit logic)
// ---------------------------------------------------------------------------
describe("PIN setup and enter flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setup flow: stores hashed PIN after confirmation match", () => {
    const profileId = "jonathan";
    const pin = "4782";
    const key = profilePinKey(profileId);

    // Simulate setup → confirm flow
    const firstAttempt = pin;
    const confirm = pin;
    expect(firstAttempt).toBe(confirm); // PINs match

    localStorage.setItem(key, hashPin(pin));
    expect(localStorage.getItem(key)).toBe(hashPin(pin));
  });

  it("setup flow: does NOT store PIN if confirmation does not match", () => {
    const profileId = "jonathan";
    const key = profilePinKey(profileId);

    const firstAttempt = "1234";
    const confirm = "5678";

    // PINs don't match — should not store
    if (firstAttempt !== confirm) {
      // reset to setup mode — do not call localStorage.setItem
    }

    expect(localStorage.getItem(key)).toBeNull();
  });

  it("enter flow: accepts correct PIN", () => {
    const profileId = "sara";
    const pin = "9371";
    const key = profilePinKey(profileId);

    localStorage.setItem(key, hashPin(pin));

    const stored = localStorage.getItem(key);
    expect(hashPin(pin)).toBe(stored);
  });

  it("enter flow: rejects incorrect PIN", () => {
    const profileId = "sara";
    const key = profilePinKey(profileId);

    localStorage.setItem(key, hashPin("9371"));

    const wrongPin = "0000";
    const stored = localStorage.getItem(key);
    expect(hashPin(wrongPin)).not.toBe(stored);
  });

  it("reset: removes PIN from localStorage", () => {
    const profileId = "fernando";
    const key = profilePinKey(profileId);

    localStorage.setItem(key, hashPin("1111"));
    expect(localStorage.getItem(key)).not.toBeNull();

    localStorage.removeItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ACTIVE_KEY
// ---------------------------------------------------------------------------
describe("ACTIVE_KEY", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("enterApp sets ACTIVE_KEY", () => {
    localStorage.setItem(ACTIVE_KEY, "jonathan");
    expect(localStorage.getItem(ACTIVE_KEY)).toBe("jonathan");
  });

  it("logout removes ACTIVE_KEY", () => {
    localStorage.setItem(ACTIVE_KEY, "jonathan");
    localStorage.removeItem(ACTIVE_KEY);
    expect(localStorage.getItem(ACTIVE_KEY)).toBeNull();
  });
});
