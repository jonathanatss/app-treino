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

## Antes do deploy público

1. Configurar SMTP próprio no Supabase Auth.
2. Aplicar os modelos de e-mail e testar entrega, spam e expiração do link.
3. Fazer um dump do banco e documentar o procedimento de restauração.
4. Validar login, saída, link expirado e isolamento entre duas contas de teste.
5. Executar teste físico no iPhone somente depois de existir uma URL de preview/produção.
6. Configurar e testar as variáveis do questionário no Netlify antes de liberar o formulário em produção.

## Variáveis e segredos

- A chave pública/anon pode ficar no frontend.
- Nunca adicionar `service_role`, senha do banco ou credenciais SMTP ao repositório.
- As credenciais SMTP devem ser configuradas apenas no painel do Supabase.
- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave administrativa usada somente pela função do Netlify.
- `RESEND_API_KEY`: chave da conta Resend para enviar o aviso.
- `RESEND_FROM_EMAIL`: remetente verificado no Resend, por exemplo `FitPlan <notificacoes@seudominio.com>`.
- `QUESTIONNAIRE_NOTIFICATION_EMAIL`: destinatário dos avisos, configurado somente no ambiente do Netlify.

As variáveis acima devem existir somente no painel do Netlify. A chave `service_role` e a chave do Resend não podem ser adicionadas ao repositório nem ao frontend.
