import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("public/index.html");
const client = read("public/src/supabase-client.js");
const migration = read("public/src/legacy-cloud-migration.js");
const ui = read("public/stitch-ui.js");
const serviceWorker = read("public/sw.js");
const failures = [];

for (const [label, source] of [["supabase-client.js", client], ["legacy-cloud-migration.js", migration], ["stitch-ui.js", ui]]) {
  try { new Function(source); } catch (error) { failures.push(`${label} não compila: ${error.message}`); }
}

const sdkAt = html.indexOf("@supabase/supabase-js@2.112.3");
const clientAt = html.indexOf("src/supabase-client.js");
const migrationAt = html.indexOf("src/legacy-cloud-migration.js");
const uiAt = html.indexOf("stitch-ui.js");
if (!(sdkAt >= 0 && clientAt > sdkAt && migrationAt > clientAt && uiAt > migrationAt)) failures.push("Scripts do Supabase não estão na ordem segura");
if (!client.includes("signInWithPassword")) failures.push("Login por senha ausente");
if (!client.includes("resetPasswordForEmail")) failures.push("Recuperação nativa ausente");
if (!client.includes("persistSession: true") || client.includes("storageKey:")) failures.push("Persistência/chave de sessão incompatível");
if (!client.includes('scope: "local"')) failures.push("Logout voluntário não está limitado ao dispositivo");
if (!client.includes('.from("profiles")') || !client.includes("legacy_profile_key")) failures.push("Validação/vínculo do perfil ausente");
if (/service[_-]?role/i.test(client)) failures.push("Referência a service_role no frontend");
for (const legacy of ["signInWithOtp", "lastSignInWasOtp", "fitplan-password-set-", "fitplan:password-recovery", "link de acesso alternativo"]) {
  if (client.includes(legacy) || ui.includes(legacy)) failures.push(`Fluxo legado ainda presente: ${legacy}`);
}
if (!ui.includes("cloud-access-card") || !ui.includes("applyCloudAuthGate")) failures.push("Gate de autenticação ausente");
if (!ui.includes("new-user-request") || !ui.includes("openTrainingQuestionnaire")) failures.push("Questionário para novos usuários ausente");
if (!ui.includes("/.netlify/functions/admin-questionnaires")) failures.push("Admin não usa a Function protegida");
if (!migration.includes("gym-app-cloud-migration-") || !migration.includes("photosIncluded: false")) failures.push("Migração local incompatível");
if (!serviceWorker.includes('const CACHE_VERSION = "fitplan-v73"')) failures.push("Cache do service worker não foi incrementado");
if (!serviceWorker.includes('fetch(request, { cache: "no-store" })')) failures.push("Arquivos executáveis não usam network-first");

if (failures.length) {
  console.error(`Falharam ${failures.length} verificações:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({ passwordLogin: true, recoveryOnly: true, sessionCompatible: true, localLogout: true, linkedLegacyProfile: true, pinnedSdk: "2.112.3", pwaCacheVersion: "fitplan-v73", serviceRoleExposed: false }, null, 2));
