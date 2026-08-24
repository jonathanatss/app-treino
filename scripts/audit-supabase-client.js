const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const client = fs.readFileSync(path.join(root, "supabase-client.js"), "utf8");
const migration = fs.readFileSync(path.join(root, "legacy-cloud-migration.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "stitch-ui.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const failures = [];
const initialPicker = html.match(/function renderProfilePicker\(\) \{[\s\S]*?\/\* === PIN screen === \*\//)?.[0] || "";
const initBlock = html.match(/\(function init\(\) \{[\s\S]*?\}\)\(\);/)?.[0] || "";

for (const [label, source] of [["supabase-client.js", client], ["legacy-cloud-migration.js", migration], ["stitch-ui.js", ui]]) {
  try {
    new Function(source);
  } catch (error) {
    failures.push(`${label} não compila: ${error.message}`);
  }
}

const sdkAt = html.indexOf("@supabase/supabase-js@2.112.3");
const clientAt = html.indexOf("supabase-client.js?v=5");
const migrationAt = html.indexOf("legacy-cloud-migration.js?v=1");
const uiAt = html.indexOf("stitch-ui.js?v=31");
if (!(sdkAt >= 0 && clientAt > sdkAt && migrationAt > clientAt && uiAt > migrationAt)) failures.push("Scripts do Supabase não estão na ordem segura");
if (!client.includes("signInWithOtp")) failures.push("Login por link mágico ausente");
if (!client.includes("shouldCreateUser: false")) failures.push("Login ainda permite cadastro público");
if (!client.includes("emailRedirectTo")) failures.push("Redirect do link mágico ausente");
if (!client.includes("persistSession: true")) failures.push("Persistência de sessão ausente");
if (!client.includes('.from("profiles")')) failures.push("Leitura do perfil autenticado ausente");
if (!client.includes("legacy_profile_key")) failures.push("Vínculo com perfil local ausente");
if (/service[_-]?role/i.test(client)) failures.push("Chave service_role não pode existir no frontend");
if (!ui.includes("cloud-access-card")) failures.push("Entrada de conta online ausente no seletor");
if (!ui.includes("new-user-request") || !ui.includes('addEventListener("click", openTrainingQuestionnaire)')) failures.push("Entrada do questionário para novos usuários ausente");
if (!ui.includes('/.netlify/functions/submit-questionnaire')) failures.push("Questionário não usa a função segura do backend");
if (!ui.includes('/.netlify/functions/admin-questionnaires')) failures.push("Área administrativa não usa a função protegida do backend");
if (!ui.includes('cloud.profile?.role !== "admin"')) failures.push("Interface administrativa não verifica o papel admin");
if (html.includes('data-netlify="true"')) failures.push("Formulário legado do Netlify ainda está ativo");
if (!ui.includes("data-action=\"cloud\"")) failures.push("Conta online ausente nas configurações");
if (!ui.includes("linkedCloudProfileId") || !ui.includes("applyCloudAuthGate")) failures.push("Entrada automática no perfil vinculado ausente");
if (ui.includes("openUserSwitcher")) failures.push("Seletor de perfis ainda está acessível");
if (ui.includes('querySelectorAll(".profile-card")')) failures.push("Cards de perfis ainda estão ativos no login");
if (!html.includes("auth-gate-loading")) failures.push("Estado inicial seguro do login ausente");
if (!initialPicker || initialPicker.includes("Object.entries(profiles)")) failures.push("HTML inicial ainda renderiza perfis antes do login carregar");
if (!initBlock || initBlock.includes("enterApp(")) failures.push("Sessão local antiga ainda consegue contornar o login");
if (!serviceWorker.includes('"./supabase-client.js"')) failures.push("Cliente Supabase ausente do cache offline");
if (!serviceWorker.includes('"./legacy-cloud-migration.js"')) failures.push("Migração local ausente do cache offline");
if (!serviceWorker.includes("ignoreSearch: isSameOrigin")) failures.push("Assets versionados não reutilizam o cache offline");
if (!/fitplan-v45/.test(serviceWorker)) failures.push("Versão do cache não foi incrementada");
if (!serviceWorker.includes('new Request(asset, { cache: "reload" })')) failures.push("Atualização do app shell pode reutilizar assets obsoletos");
if (!migration.includes("gym-app-cloud-migration-") || !migration.includes("photosIncluded: false")) failures.push("Migração local idempotente ou limite de fotos ausente");
if (!migration.includes('onConflict: "user_id,measured_on"')) failures.push("Medidas locais não usam upsert idempotente");
if (!ui.includes("legacy-migration-consent") || !ui.includes("fitplanLegacyMigration.migrate")) failures.push("Consentimento explícito da migração local ausente");

if (failures.length) {
  console.error(`Falharam ${failures.length} verificações:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  sdkBeforeClient: true,
  magicLink: true,
  loginOnly: true,
  newUserQuestionnaireEntry: true,
  linkedLegacyProfile: true,
  pinnedSdk: "2.112.3",
  localMigrationWithConsent: true,
  offlineClientCached: true,
  serviceRoleExposed: false
}, null, 2));
