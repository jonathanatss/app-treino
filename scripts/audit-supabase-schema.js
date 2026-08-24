const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const migrationFiles = fs.readdirSync(migrationDir).filter((name) => name.endsWith(".sql")).sort();
const sql = migrationFiles.map((name) => fs.readFileSync(path.join(migrationDir, name), "utf8")).join("\n");

const requiredTables = [
  "profiles", "coach_assignments", "questionnaire_submissions", "training_plans",
  "workout_days", "exercise_catalog", "plan_exercises", "plan_exercise_alternatives",
  "workout_sessions", "workout_exercise_logs", "workout_set_logs", "workout_checkins",
  "body_measurements", "progress_photos", "conversations", "conversation_members",
  "messages", "notifications"
];

const failures = [];
for (const table of requiredTables) {
  if (!new RegExp(`create table public\\.${table}\\s*\\(`).test(sql)) failures.push(`Tabela ausente: ${table}`);
  if (!new RegExp(`alter table public\\.${table} enable row level security;`).test(sql)) failures.push(`RLS ausente: ${table}`);
}

const checks = [
  ["funções SECURITY DEFINER fixam search_path", /security definer\s+set search_path = ''/],
  ["função automática de RLS bloqueada", /revoke execute on function public\.rls_auto_enable\(\) from public, anon, authenticated/],
  ["feed de check-in usa security_invoker", /create view public\.daily_checkin_feed\s+with \(security_invoker = true\)/],
  ["bucket privado de avatares", /\('avatars', 'avatars', false/],
  ["bucket privado de evolução", /\('progress-photos', 'progress-photos', false/],
  ["mensagens habilitadas no Realtime", /alter publication supabase_realtime add table public\.messages/],
  ["check-ins habilitados no Realtime", /alter publication supabase_realtime add table public\.workout_checkins/],
  ["notificações habilitadas no Realtime", /alter publication supabase_realtime add table public\.notifications/],
  ["vínculo temporário com perfil local", /add column legacy_profile_key text unique/],
  ["vínculo não editável pelo próprio usuário", /grant update \(display_name, avatar_url, bio, notifications_enabled, updated_at\) on public\.profiles/]
];

for (const [label, pattern] of checks) if (!pattern.test(sql)) failures.push(label);

const transactionFiles = migrationFiles.filter((name) => {
  const contents = fs.readFileSync(path.join(migrationDir, name), "utf8").trim();
  return contents.startsWith("begin;") && contents.endsWith("commit;");
});
if (transactionFiles.length !== migrationFiles.length) failures.push("Todas as migrações devem ser transacionais");

if (failures.length) {
  console.error(`Falharam ${failures.length} verificações:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  migrations: migrationFiles.length,
  tables: requiredTables.length,
  rlsTables: requiredTables.length,
  policies: (sql.match(/create policy /g) || []).length,
  checks: checks.length
}, null, 2));
