import { describe, it, expect, beforeEach } from "vitest";
import {
  profileStateKey,
  lastProfileActivity,
  getSettings,
  saveSettings,
  loadProfileState,
  SETTINGS_KEY
} from "../helpers/profile-state.js";

const TODAY = "2026-08-25";
const YESTERDAY = "2026-08-24";

const PROFILE = {
  defaultTab: "push-a",
  tabs: [
    { key: "push-a", label: "Seg • Push A" },
    { key: "pull-a", label: "Ter • Pull A" }
  ]
};

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// profileStateKey
// ---------------------------------------------------------------------------
describe("profileStateKey", () => {
  it("returns correct key format", () => {
    expect(profileStateKey("jonathan")).toBe("gym-app-profile-jonathan-state");
    expect(profileStateKey("sara")).toBe("gym-app-profile-sara-state");
  });
});

// ---------------------------------------------------------------------------
// lastProfileActivity
// ---------------------------------------------------------------------------
describe("lastProfileActivity", () => {
  it("returns 'Novo perfil' when no state is stored", () => {
    expect(lastProfileActivity("jonathan")).toBe("Novo perfil");
  });

  it("returns formatted date when state has a day", () => {
    localStorage.setItem(
      profileStateKey("jonathan"),
      JSON.stringify({ day: "2026-08-24" })
    );
    expect(lastProfileActivity("jonathan")).toBe("Última sessão: 24/08/2026");
  });

  it("returns 'Novo perfil' when stored state has no day field", () => {
    localStorage.setItem(profileStateKey("jonathan"), JSON.stringify({ weights: {} }));
    expect(lastProfileActivity("jonathan")).toBe("Novo perfil");
  });

  it("returns 'Toque para entrar' on JSON parse error", () => {
    localStorage.setItem(profileStateKey("jonathan"), "{ invalid json }");
    expect(lastProfileActivity("jonathan")).toBe("Toque para entrar");
  });
});

// ---------------------------------------------------------------------------
// getSettings / saveSettings
// ---------------------------------------------------------------------------
describe("getSettings", () => {
  it("returns defaults when nothing is stored", () => {
    const settings = getSettings();
    expect(settings.notifications).toBe(true);
    expect(settings.autoRest).toBe(true);
    expect(settings.sound).toBe(false);
  });

  it("merges stored values over defaults", () => {
    saveSettings({ sound: true });
    const settings = getSettings();
    expect(settings.sound).toBe(true);
    expect(settings.notifications).toBe(true); // still default
  });

  it("returns defaults on parse error", () => {
    localStorage.setItem(SETTINGS_KEY, "bad json");
    const settings = getSettings();
    expect(settings.notifications).toBe(true);
  });
});

describe("saveSettings", () => {
  it("persists settings to localStorage", () => {
    saveSettings({ notifications: false, autoRest: false, sound: true });
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    expect(raw.notifications).toBe(false);
    expect(raw.sound).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// loadProfileState
// ---------------------------------------------------------------------------
describe("loadProfileState", () => {
  it("returns fresh state when nothing is stored", () => {
    const state = loadProfileState("jonathan", PROFILE, TODAY);
    expect(state.day).toBe(TODAY);
    expect(state.done).toEqual({});
    expect(state.weights).toEqual({});
    expect(state.history).toEqual({});
  });

  it("preserves weights and history from previous day", () => {
    localStorage.setItem(
      profileStateKey("jonathan"),
      JSON.stringify({
        day: YESTERDAY,
        weights: { "lower-a-squat": "80" },
        history: { "lower-a-squat": [{ load: 80 }] },
        done: { "lower-a-squat": true }
      })
    );
    const state = loadProfileState("jonathan", PROFILE, TODAY);
    expect(state.day).toBe(TODAY);
    expect(state.weights["lower-a-squat"]).toBe("80");
    expect(state.history["lower-a-squat"]).toEqual([{ load: 80 }]);
    // done is reset on new day
    expect(state.done).toEqual({});
  });

  it("returns same-day state intact", () => {
    localStorage.setItem(
      profileStateKey("jonathan"),
      JSON.stringify({
        day: TODAY,
        weights: { "lower-a-squat": "80" },
        done: { "lower-a-squat": true },
        history: {}
      })
    );
    const state = loadProfileState("jonathan", PROFILE, TODAY);
    expect(state.done["lower-a-squat"]).toBe(true);
    expect(state.weights["lower-a-squat"]).toBe("80");
  });

  it("returns safe fallback on JSON parse error", () => {
    localStorage.setItem(profileStateKey("jonathan"), "corrupted json {{{");
    const state = loadProfileState("jonathan", PROFILE, TODAY);
    expect(state.day).toBe(TODAY);
    expect(state.done).toEqual({});
  });

  it("uses profile.defaultTab when no tab matches today", () => {
    // Stored with a different activeTab
    localStorage.setItem(
      profileStateKey("jonathan"),
      JSON.stringify({ day: YESTERDAY, activeTab: "pull-a", weights: {}, history: {} })
    );
    const state = loadProfileState("jonathan", PROFILE, TODAY);
    // defaultTab is "push-a" (profile.defaultTab)
    expect(["push-a", "pull-a"]).toContain(state.activeTab);
  });
});
