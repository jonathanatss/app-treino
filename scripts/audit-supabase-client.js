const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const client = fs.readFileSync(path.join(root, "supabase-client.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "stitch-ui.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const failures = [];

for (const [label, source] of [["supabase-client.js", client], ["stitch-ui.js", ui]]) {
  try {
    new Function(source);
  } catch (error) {
    failures.push(`${label} não compila: ${error.message}`);
  }
}

const sdkAt = html.indexOf("@supabase/supabase-js@2");
const clientAt = html.indexOf("supabase-client.js?v=1");
const uiAt = html.indexOf("stitch-ui.js?v=22");
if (!(sdkAt >= 0 && clientAt > sdkAt && uiAt > clientAt)) failures.push("Scripts do Supabase não estão na ordem segura");
if (!client.includes("signInWithOtp")) failures.push("Login por link mágico ausente");
if (!client.includes("emailRedirectTo")) failures.push("Redirect do link mágico ausente");
if (!client.includes("persistSession: true")) failures.push("Persistência de sessão ausente");
if (!client.includes('.from("profiles")')) failures.push("Leitura do perfil autenticado ausente");
if (!client.includes("legacy_profile_key")) failures.push("Vínculo com perfil local ausente");
if (/service[_-]?role/i.test(client)) failures.push("Chave service_role não pode existir no frontend");
if (!ui.includes("cloud-access-card")) failures.push("Entrada de conta online ausente no seletor");
if (!ui.includes("data-action=\"cloud\"")) failures.push("Conta online ausente nas configurações");
if (!ui.includes("isLinkedAccount")) failures.push("Acesso ao perfil vinculado ausente");
if (!serviceWorker.includes('"./supabase-client.js"')) failures.push("Cliente Supabase ausente do cache offline");
if (!serviceWorker.includes("ignoreSearch: isSameOrigin")) failures.push("Assets versionados não reutilizam o cache offline");
if (!/fitplan-v34/.test(serviceWorker)) failures.push("Versão do cache não foi incrementada");

if (failures.length) {
  console.error(`Falharam ${failures.length} verificações:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  sdkBeforeClient: true,
  magicLink: true,
  linkedLegacyProfile: true,
  offlineClientCached: true,
  serviceRoleExposed: false
}, null, 2));
