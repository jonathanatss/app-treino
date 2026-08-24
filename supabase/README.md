# Supabase do FitPlan

Projeto remoto: `fitplan-app`  
Project ref: `ekvewbevtybvkcvvchaa`  
Região: South America (São Paulo) — `sa-east-1`

## Estrutura inicial

As migrações em `migrations/` criam:

- autenticação vinculada a perfis de atleta, treinador e administrador;
- questionários privados e atribuição treinador–atleta;
- planos, dias, catálogo, exercícios prescritos e alternativas;
- sessões, exercícios executados, séries e check-ins sociais;
- medidas corporais e metadados de fotos de evolução;
- conversas, membros, mensagens e notificações;
- buckets privados `avatars` e `progress-photos`;
- Realtime para mensagens, check-ins e notificações;
- RLS em todas as tabelas públicas.

O frontend deverá utilizar apenas a URL pública do projeto e a chave `publishable`/`anon`. A chave `service_role` nunca deve ser incluída no navegador, no repositório ou no Netlify.

## Verificação

```powershell
node scripts/audit-supabase-schema.js
```

As migrações iniciais foram aplicadas pelo SQL Editor em 24/08/2026. Antes de adotar o Supabase CLI para novos deploys, registre essas versões como já aplicadas com o fluxo oficial de `migration repair`, evitando uma reaplicação da base inicial.
