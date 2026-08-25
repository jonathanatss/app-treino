/**
 * Pure utility functions extracted from public/index.html and public/stitch-ui.js.
 * Must stay in sync with the source implementations.
 */

// ---------------------------------------------------------------------------
// escapeHtml — index.html
// ---------------------------------------------------------------------------
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

// ---------------------------------------------------------------------------
// slugify — index.html
// ---------------------------------------------------------------------------
export function slugify(value) {
  return (
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "opcao"
  );
}

// ---------------------------------------------------------------------------
// hasAnyTerm — index.html
// ---------------------------------------------------------------------------
export function hasAnyTerm(text, terms) {
  return terms.some((term) => text.includes(term));
}

// ---------------------------------------------------------------------------
// parseLoad — index.html
// ---------------------------------------------------------------------------
export function parseLoad(value) {
  const normalized = String(value || "").replace(",", ".").match(/\d+(?:\.\d+)?/);
  return normalized ? Number(normalized[0]) : null;
}

// ---------------------------------------------------------------------------
// formatLoad — index.html
// ---------------------------------------------------------------------------
export function formatLoad(value) {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value)
    ? String(value)
    : String(Number(value.toFixed(1))).replace(".", ",");
}
