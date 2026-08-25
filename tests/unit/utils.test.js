import { describe, it, expect } from "vitest";
import { escapeHtml, slugify, hasAnyTerm, parseLoad, formatLoad } from "../helpers/utils.js";

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------
describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml(">")).toBe("&gt;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  it("leaves safe text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
    expect(escapeHtml("Rosca direta")).toBe("Rosca direta");
  });

  it("handles multiple special chars in one string", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("coerces non-strings to string first", () => {
    expect(escapeHtml(42)).toBe("42");
    expect(escapeHtml(null)).toBe("null");
    expect(escapeHtml(undefined)).toBe("undefined");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Leg Press")).toBe("leg-press");
  });

  it("removes diacritics", () => {
    expect(slugify("Agachamento Búlgaro")).toBe("agachamento-bulgaro");
    expect(slugify("Elevação Pélvica")).toBe("elevacao-pelvica");
    expect(slugify("Rosca Bíceps")).toBe("rosca-biceps");
  });

  it("collapses multiple special chars into single hyphen", () => {
    expect(slugify("a  b--c")).toBe("a-b-c");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-abc-")).toBe("abc");
  });

  it("returns 'opcao' for empty or all-special string", () => {
    expect(slugify("")).toBe("opcao");
    expect(slugify("---")).toBe("opcao");
  });

  it("handles Portuguese exercise names used in the app", () => {
    expect(slugify("Supino Reto")).toBe("supino-reto");
    expect(slugify("Puxada Alta Neutra")).toBe("puxada-alta-neutra");
    expect(slugify("Glúteo no Cabo")).toBe("gluteo-no-cabo");
  });
});

// ---------------------------------------------------------------------------
// hasAnyTerm
// ---------------------------------------------------------------------------
describe("hasAnyTerm", () => {
  it("returns true when at least one term is found", () => {
    expect(hasAnyTerm("leg-press", ["squat", "leg-press"])).toBe(true);
  });

  it("returns false when no term matches", () => {
    expect(hasAnyTerm("supino", ["agachamento", "leg-press"])).toBe(false);
  });

  it("returns false for empty terms array", () => {
    expect(hasAnyTerm("supino", [])).toBe(false);
  });

  it("is case-sensitive (expects pre-slugified input)", () => {
    expect(hasAnyTerm("Supino", ["supino"])).toBe(false);
    expect(hasAnyTerm("supino", ["supino"])).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseLoad
// ---------------------------------------------------------------------------
describe("parseLoad", () => {
  it("parses integer string", () => {
    expect(parseLoad("80")).toBe(80);
  });

  it("parses decimal with comma (Brazilian format)", () => {
    expect(parseLoad("102,5")).toBe(102.5);
  });

  it("parses decimal with dot", () => {
    expect(parseLoad("102.5")).toBe(102.5);
  });

  it("parses number with unit suffix", () => {
    expect(parseLoad("80 kg")).toBe(80);
  });

  it("returns null for empty string", () => {
    expect(parseLoad("")).toBeNull();
  });

  it("returns null for null/undefined", () => {
    expect(parseLoad(null)).toBeNull();
    expect(parseLoad(undefined)).toBeNull();
  });

  it("returns null for non-numeric string", () => {
    expect(parseLoad("abc")).toBeNull();
  });

  it("extracts first number from mixed string", () => {
    expect(parseLoad("3 x 10")).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// formatLoad
// ---------------------------------------------------------------------------
describe("formatLoad", () => {
  it("formats integer as plain number string", () => {
    expect(formatLoad(80)).toBe("80");
    expect(formatLoad(100)).toBe("100");
  });

  it("formats float with 1 decimal using comma", () => {
    expect(formatLoad(102.5)).toBe("102,5");
    expect(formatLoad(7.5)).toBe("7,5");
  });

  it("drops trailing zero for round floats (e.g. 80.0 → '80')", () => {
    expect(formatLoad(80.0)).toBe("80");
  });

  it("returns empty string for non-finite values", () => {
    expect(formatLoad(NaN)).toBe("");
    expect(formatLoad(Infinity)).toBe("");
    expect(formatLoad(-Infinity)).toBe("");
  });

  it("returns empty string for null/undefined", () => {
    expect(formatLoad(null)).toBe("");
    expect(formatLoad(undefined)).toBe("");
  });

  it("round-trips with parseLoad for common loads", () => {
    const loads = [20, 40, 60, 80, 100, 102.5, 7.5, 12.5];
    for (const load of loads) {
      expect(parseLoad(formatLoad(load))).toBe(load);
    }
  });
});
