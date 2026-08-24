# Migração dos perfis estáticos para usuários

## Decisão recomendada

Migrar em duas etapas, separando **identidade** de **dados de treino**. O administrador coleta e valida os e-mails, envia os convites pelo Supabase e associa cada conta ao perfil estático por `legacy_profile_key`. Somente após esse vínculo os dados daquele perfil são importados para as tabelas normalizadas.

Não inserir usuários diretamente em `auth.users` por SQL e não colocar `service_role` no frontend.

## Perfis legados

| Chave legada | Nome exibido | Conta Supabase | Situação |
| --- | --- | --- | --- |
| `jonathan` | Jonathan | configurada | vinculada • piloto ativo |
| `sara` | Sara | a coletar | pendente |
| `fernanda` | Fernanda | a coletar | pendente |
| `eduarda` | Maria Eduarda | a coletar | pendente |
| `fernando` | Fernando | a coletar | pendente |
| `nathalia` | Nathália | a coletar | pendente |
| `pablo` | Pablo | a coletar | pendente |
| `igor` | Igor | a coletar | pendente |

## Fluxo de migração

1. **Criar a identidade**
   - O administrador confirma com cada usuário qual endereço deve ser usado.
   - Envia o convite pelo Dashboard do Supabase ou por uma função de backend confiável.
   - O Supabase cria `auth.users`; o trigger cria `public.profiles`.
   - O login do frontend usa `shouldCreateUser: false`, portanto endereços não convidados não criam contas.

2. **Vincular ao legado**
   - O administrador preenche `profiles.legacy_profile_key` com uma das chaves da tabela acima.
   - A restrição `unique` impede duas contas de reivindicarem o mesmo perfil.
   - O frontend passa a abrir automaticamente somente o perfil vinculado.

3. **Migrar a prescrição**
   - Deduplicar os exercícios estáticos em `exercise_catalog` usando uma chave normalizada e estável.
   - Criar um `training_plan` ativo por usuário.
   - Converter as abas em `workout_days` e preservar ordem, séries, repetições, RIR, descanso e observações em `plan_exercises`.
   - Converter as alternativas em `plan_exercise_alternatives`.

4. **Migrar os dados locais do aparelho**
   - Após o primeiro login vinculado, oferecer “Migrar meus dados deste aparelho”.
   - Ler apenas as chaves `gym-app-*` pertencentes ao `legacy_profile_key` autenticado.
   - Mostrar uma prévia com quantidade de sessões, séries, medidas e fotos antes do envio.
   - Enviar com `upsert` e chaves de idempotência para que repetir a operação não duplique registros.
   - Fotos devem ir para o bucket privado `progress-photos`; avatares, para `avatars`.

5. **Validar e encerrar a ponte**
   - Comparar contagens e amostras de carga, datas e exercícios entre origem e banco.
   - Manter um backup local exportável e a versão legada em somente leitura durante a estabilização.
   - Depois que todos os usuários forem validados, carregar o treino exclusivamente do Supabase e remover `legacy_profile_key` e os perfis embutidos do frontend.

## Controles necessários

- A importação deve ser executada por uma função de backend ou RPC transacional e idempotente.
- Cada registro importado deve guardar `legacy_profile_key`, identificador da origem e data da migração em uma tabela de auditoria.
- RLS continua sendo a barreira principal: um atleta só acessa os próprios dados; treinador e administrador seguem as políticas de atribuição.
- O primeiro piloto deve ser `jonathan`; os demais perfis entram somente após validar o processo completo e a possibilidade de recuperação.

## Critérios de aceite do piloto

- login por link mágico abre somente o perfil Jonathan;
- plano, dias, exercícios e alternativas mantêm a mesma ordem e prescrição;
- cargas, sessões, medidas, fotos e avatar apresentam a mesma contagem da origem;
- repetir a importação não cria duplicatas;
- sair da conta remove o acesso sem apagar os dados remotos;
- outro usuário autenticado não consegue consultar os dados de Jonathan.
