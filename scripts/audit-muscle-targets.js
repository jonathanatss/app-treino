const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!inlineScript) throw new Error("Script principal não encontrado no index.html");
new vm.Script(inlineScript, { filename: "index.inline.js" });

function sourceBetween(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Trecho não encontrado: ${startMarker}`);
  return html.slice(start, end);
}

const sandbox = {};
vm.runInNewContext([
  sourceBetween("function slugify(value)", "function withVariantMedia"),
  sourceBetween("function hasAnyTerm(text, terms)", "function selectedExerciseName"),
  sourceBetween("function inferPrepGroupFromName(name)", "window.FitPlanMuscles"),
  "globalThis.targetForName = inferPrepGroupFromName;"
].join("\n"), sandbox);

const names = new Set(
  [...html.matchAll(/\{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)"/g)]
    .map((match) => match[1])
);
const variantNames = new Set(
  [...html.matchAll(/displayName:\s*"([^"]+)"/g)]
    .map((match) => match[1])
);

const candidates = new Set([...names, ...variantNames]);
for (const name of names) {
  const variants = name.split(/\sou\s/i).map((part) => part.trim());
  if (variants.length <= 1) continue;
  candidates.add(variants[0]);
  const rootWords = variants[0].split(/\s+/).slice(0, 2).join(" ");
  variants.slice(1).forEach((variant) => candidates.add(`${rootWords} ${variant}`));
}

const expected = new Map([
  ["Remada baixa no cabo", "Latíssimo do dorso (grande dorsal) • trapézio médio/inferior • romboides • deltoide posterior"],
  ["Puxada alta pegada neutra", "Latíssimo do dorso (grande dorsal) • redondo maior • bíceps braquial"],
  ["Face pull na corda", "Deltoide posterior • infraespinhal • redondo menor • trapézio médio • romboides"],
  ["RDL (stiff com joelhos levemente flexionados)", "Isquiotibiais: bíceps femoral, semitendíneo e semimembranáceo • glúteo máximo"],
  ["Panturrilha sentada", "Sóleo"],
  ["Elevação lateral na polia", "Deltoide lateral • supraespinhal"],
  ["Tríceps francês na polia", "Tríceps braquial (ênfase na cabeça longa)"],
  ["Rosca martelo com halteres", "Braquial • braquiorradial • bíceps braquial"],
  ["Abdominal na máquina", "Reto abdominal • oblíquos"],
  ["Supino inclinado no Smith", "Peitoral maior (porção clavicular) • deltoide anterior"],
  ["Agachamento no Smith", "Quadríceps femoral • glúteo máximo • adutor magno"],
  ["Elevação pélvica no Smith", "Glúteo máximo"],
  ["Remada baixa na máquina", "Latíssimo do dorso (grande dorsal) • trapézio médio/inferior • romboides • deltoide posterior"],
  ["Puxada alta supinada", "Latíssimo do dorso (grande dorsal) • redondo maior • bíceps braquial"],
  ["Rosca direta na polia", "Bíceps braquial • braquial"]
]);

const failures = [];
for (const [name, target] of expected) {
  const actual = sandbox.targetForName(name);
  if (actual !== target) failures.push(`${name}: esperado "${target}", recebido "${actual}"`);
}

const fallback = [...candidates]
  .map((name) => ({ name, target: sandbox.targetForName(name) }))
  .filter((entry) => entry.target.startsWith("Corpo inteiro"));

if (fallback.length) {
  failures.push(`Sem classificação específica: ${fallback.map((entry) => entry.name).join(" | ")}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  exerciseNames: names.size,
  explicitVariantNames: variantNames.size,
  namesAndVariantsAudited: candidates.size,
  targetClassifications: new Set([...candidates].map(sandbox.targetForName)).size,
  fallback: 0
}, null, 2));
