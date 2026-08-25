/**
 * friendlyError — extracted from public/src/supabase-client.js.
 * Must stay in sync with the source implementation.
 */
export function friendlyError(value) {
  if (!value) return null;
  const message = String(value.message || value).replace(/\+/g, " ");
  if (/rate limit/i.test(message))
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (/invalid.*email/i.test(message))
    return "Digite um endereço de e-mail válido.";
  if (/signups? not allowed|user not found/i.test(message))
    return "Este e-mail ainda não foi convidado para o FitPlan.";
  if (/expired|invalid.*token|otp.*invalid/i.test(message))
    return "Este link expirou ou já foi usado. Solicite um novo link de acesso.";
  if (/failed to fetch|network|offline/i.test(message))
    return "Não foi possível conectar. Confira sua internet e tente novamente.";
  return message;
}
