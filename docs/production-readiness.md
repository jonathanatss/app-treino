# Preparação para produção

## Concluído

- Login por link mágico sem cadastro público.
- Perfil autenticado vinculado por `legacy_profile_key`.
- RLS de perfis limitada ao próprio usuário, atletas atribuídos ou administrador.
- Plano ativo do Jonathan migrado de forma idempotente.
- Migração opcional de treinos, cargas e medidas locais com consentimento explícito.
- Fotos locais excluídas da migração inicial.
- SDK Supabase fixado em versão exata.
- Cabeçalhos de segurança e cache preparados para o Netlify.
- Modelos de convite e link mágico versionados em `supabase/templates`.
- Site URL de produção e redirects de `127.0.0.1`/`localhost` confirmados no Supabase.
- Security Advisor conferido com 0 erros; o único aviso é proteção de senha vazada, não usada no fluxo passwordless atual.
- Entrada de novos usuários conectada à função `submit-questionnaire`, que grava no Supabase sem expor a chave administrativa.
- Aviso de novo questionário preparado pelo Resend sem incluir respostas de saúde no e-mail.
- Área administrativa para revisar o questionário completo, aprovar e convidar o usuário ou rejeitar com observação.
- Aprovação cria a conta por convite, vincula a solicitação e abre automaticamente um plano inicial em rascunho.

## Antes do deploy público

1. Configurar SMTP próprio no Supabase Auth.
2. Aplicar os modelos de e-mail e testar entrega, spam e expiração do link.
3. Fazer um dump do banco e documentar o procedimento de restauração.
4. Validar login, saída, link expirado e isolamento entre duas contas de teste.
5. Executar teste físico no iPhone somente depois de existir uma URL de preview/produção.
6. Testar o convite e a decisão com uma segunda conta real após configurar o remetente próprio.

## Variáveis e segredos

- A chave pública/anon pode ficar no frontend.
- Nunca adicionar `service_role`, senha do banco ou credenciais SMTP ao repositório.
- As credenciais SMTP devem ser configuradas apenas no painel do Supabase.
- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave administrativa usada somente pela função do Netlify.
- `RESEND_API_KEY`: chave da conta Resend para enviar o aviso.
- `RESEND_FROM_EMAIL`: remetente verificado no Resend, por exemplo `FitPlan <notificacoes@seudominio.com>`.
- `QUESTIONNAIRE_NOTIFICATION_EMAIL`: destinatário dos avisos, configurado somente no ambiente do Netlify.
- `FITPLAN_SITE_URL`: URL pública usada nos links de análise e de retorno após o convite.

As variáveis acima devem existir somente no painel do Netlify. A chave `service_role` e a chave do Resend não podem ser adicionadas ao repositório nem ao frontend.
# Fluxo de autenticação v2 (2026-10-08)

## O que mudou

O frontend usa um único controlador em `public/src/supabase-client.js`, uma única assinatura de `onAuthStateChange` e estados explícitos: `booting`, `signed_out`, `signing_in`, `authenticated`, `recovering_password`, `updating_password`, `profile_pending`, `profile_disabled`, `offline` e `error`. Identidade (`auth.users`), autorização (`profiles`) e vínculo local (`legacy_profile_key`) são resolvidos em etapas separadas.

Não houve migration de banco nesta entrega. Nenhum usuário, UUID, hash, senha, refresh token, perfil ou política RLS foi alterado. Antes de qualquer migration futura, criar backup pelo Dashboard Supabase (Database > Backups) ou executar `pg_dump` autenticado em ambiente seguro e testar a restauração fora de produção.

## Compatibilidade de sessões

- Projeto preservado: `ekvewbevtybvkcvvchaa`.
- O cliente continua com `persistSession`, `autoRefreshToken` e `detectSessionInUrl` ativos.
- Não foi definido `storageKey`; portanto, a chave padrão existente `sb-ekvewbevtybvkcvvchaa-auth-token` continua sendo usada.
- Falhas de rede ou de leitura de perfil não removem a sessão persistida.
- A única saída chama `signOut({ scope: "local" })` e exige ação voluntária do usuário.

## Configuração manual necessária (não aplicada)

No Supabase Dashboard, em Authentication > URL Configuration:

1. Confirmar `https://app-treino-jonathan.netlify.app` como Site URL.
2. Adicionar `https://app-treino-jonathan.netlify.app/?type=recovery` à lista de Redirect URLs. Se o painel normalizar query strings, permitir também `https://app-treino-jonathan.netlify.app/**`.
3. Para staging, adicionar exatamente a origem Netlify de staging e a mesma rota `/?type=recovery`.
4. Confirmar que o template de recuperação usa `{{ .ConfirmationURL }}` e que SMTP/remetente/DNS estão válidos.

No Netlify, não é necessária variável nova. Manter os segredos administrativos apenas nas Functions e nunca no bundle público.

## Validação em staging

1. Fazer deploy preview com HTTPS e adicionar sua URL aos redirects permitidos do Supabase.
2. Em desktop e em viewport 390 x 844, testar teclado, foco, mostrar/ocultar senha, erro de e-mail e duplo clique.
3. Entrar com uma conta de teste existente e confirmar que refresh, nova aba e reabertura da PWA restauram o treino sem mostrar login.
4. Validar contas de teste com perfil ativo/vinculado, sem perfil, inativo, sem vínculo e administrador.
5. Solicitar recuperação para e-mail existente e inexistente; a mensagem visível deve ser idêntica.
6. Abrir o link em Chrome, Safari/iOS e PWA; salvar senha, confirmar sessão mantida e recarregar a URL para garantir que o formulário não reabra.
7. Testar link expirado e confirmar a opção de solicitar outro e-mail sem loop.
8. Desativar a rede durante login e leitura de perfil; reativar e tentar novamente sem perda da sessão local.
9. Confirmar questionários, aprovação/convite, administração, histórico, medidas, fotos, telemetria e sincronização.
10. Em Application > Service Workers, confirmar `fitplan-v71` e que JS/CSS/HTML usam network-first.

## Rollback

Reverter somente os arquivos frontend desta alteração e publicar novamente. Como não há migration nem alteração remota, contas e dados não exigem rollback. A chave de sessão não mudou, então o frontend anterior pode reutilizar sessões ainda válidas. Não limpar localStorage, não revogar tokens e não executar logout em massa.

## Riscos residuais

- Entrega de e-mail depende do SMTP, reputação do remetente e Redirect URLs do projeto Supabase.
- Safari e uma PWA instalada podem manter contextos de armazenamento separados conforme a versão do iOS; o callback continua funcional no contexto que abriu o link, mas deve ser validado em dispositivos reais.
- Testes locais usam mocks e não substituem um ensaio de staging com SMTP e redirects reais.
