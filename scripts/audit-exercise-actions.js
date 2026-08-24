const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const ui = fs.readFileSync(path.join(root, "stitch-ui.js"), "utf8");
const css = fs.readFileSync(path.join(root, "stitch-ui.css"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const checks = [
  ["menu de ações", /function openExerciseActionMenu\(/],
  ["última carga sem registro automático", /state\.weights\[key\] = String\(lastLoad\);[\s\S]*?showDetailToast\(`Carga preparada:/],
  ["histórico filtrado por exercício", /function openExerciseHistorySheet\(exercise, key\)[\s\S]*?getHistoryEntries\(key\)/],
  ["descanso personalizado aplicado ao cronômetro", /const restSeconds = exerciseRestSeconds\(exercise, key\);[\s\S]*?startRest\(restSeconds\)/],
  ["observação isolada pela chave da alternativa", /state\.exerciseNotes\[key\] = note/],
  ["reinício com remoção apenas do histórico atual", /removeCurrentExerciseHistory\(key\)/],
  ["confirmação do reinício", /button\.dataset\.confirm = "true"/],
  ["Escape fecha primeiro o menu", /if \(activeSheet\) closeActionSheet\(\)/],
  ["persistência do descanso", /exerciseRest: parsed\.exerciseRest \|\| \{\}/],
  ["persistência da observação", /exerciseNotes: parsed\.exerciseNotes \|\| \{\}/],
  ["estilos do menu", /\.exercise-action-list\s*\{/],
  ["estilos do histórico", /\.exercise-history-list\s*\{/],
  ["safe area do menu móvel", /padding-bottom: calc\(24px \+ var\(--safe-bottom\)\)/]
];

new Function(ui);
for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
  if (match[1].trim()) new Function(match[1]);
}

const failures = checks.filter(([, pattern]) => !pattern.test(`${ui}\n${css}\n${html}`));
if (failures.length) {
  console.error(`Falharam ${failures.length} verificações:`);
  failures.forEach(([label]) => console.error(`- ${label}`));
  process.exit(1);
}

console.log(`OK: ${checks.length} verificações do menu de exercício.`);
