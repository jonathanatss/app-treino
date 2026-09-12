# Observabilidade administrativa

## Fluxo

`public/src/telemetry.js` cria uma sessão por aparelho, conta apenas intervalos em que o documento está visível e envia um heartbeat a cada 90 segundos. Eventos usam UUIDs idempotentes, ficam em `localStorage` quando offline e são enviados em lotes de até 100 ao voltar a ficar online.

O frontend não envia `user_id`: a RPC `ingest_telemetry` sempre usa `auth.uid()`. Ela aceita somente nomes de evento e chaves de payload pré-definidos, com limite de tamanho e janela temporal. Não registrar e-mail, telefone, texto livre de saúde ou outras informações pessoais no payload.

## Consumo administrativo

O módulo `public/src/admin-observability.js` expõe:

```js
const recentes = await FitPlanAdminObservability.recentAccess(100);
const inativos = await FitPlanAdminObservability.inactiveUsers(14);
const eventos = await FitPlanAdminObservability.userTimeline(userId, {
  limit: 100,
  eventName: "workout_completed",
  since: "2026-09-01T00:00:00Z"
});
```

As consultas só funcionam para um perfil ativo com papel `admin`. `inactiveUsers(7|14|30)` retorna também número de sessões e tempo ativo acumulado nos últimos 30 dias. Alunos sem qualquer sessão aparecem com `last_active_at` e `inactive_days` nulos, permitindo tratá-los como “nunca acessou”.

## Semântica de duração

`active_seconds` é uma estimativa de engajamento, não faturamento nem controle de jornada. Cada intervalo é limitado a 180 segundos para que suspensão abrupta do processo do PWA não gere horas fictícias. `beforeunload` é apenas uma otimização; a ausência desse evento no mobile não prejudica o cálculo.

## Implantação

Aplicar `supabase/migrations/20260912120000_admin_observability.sql` antes de publicar o frontend. Depois, validar com uma conta de aluno (inserção/flush offline) e uma conta admin (RPC e leitura global). Uma conta de aluno deve receber negação ao tentar `select` diretamente das duas tabelas.
