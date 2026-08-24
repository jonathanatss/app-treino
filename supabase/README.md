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

## Transição do frontend

O `supabase-client.js` adiciona autenticação por link mágico para contas previamente convidadas. Nesta fase:

- somente e-mails provisionados pelo administrador podem autenticar; o frontend não cria contas novas;
- treinos, cargas e fotos continuam locais até a etapa de sincronização;
- os PINs locais permanecem armazenados somente para rollback durante a migração, mas não aparecem como opção de entrada;
- `legacy_profile_key` só pode ser definido por um administrador e associa a conta autenticada a um perfil estático existente;
- uma conta vinculada pode abrir somente o seu perfil sem repetir o PIN.

Os redirects autorizados são a URL de produção e as URLs locais em `127.0.0.1:4173` e `localhost:4173`.

O plano de conversão dos oito perfis estáticos está em [`PROFILE_MIGRATION.md`](PROFILE_MIGRATION.md).

## Verificação

```powershell
node scripts/audit-supabase-schema.js
node scripts/audit-supabase-client.js
```

As migrações iniciais foram aplicadas pelo SQL Editor em 24/08/2026. Antes de adotar o Supabase CLI para novos deploys, registre essas versões como já aplicadas com o fluxo oficial de `migration repair`, evitando uma reaplicação da base inicial.
