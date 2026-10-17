export function validarSenha(senha) {
  let temMaiuscula = false;
  let temMinuscula = false;
  let temNumero = false;

  for (const caractere of senha) {
    if (caractere !== caractere.toLowerCase()) temMaiuscula = true;
    if (caractere !== caractere.toUpperCase()) temMinuscula = true;
    if ("0123456789".includes(caractere)) temNumero = true;
  }

  const erros = [];
  if (senha.length < 8) erros.push("A senha deve ter pelo menos 8 caracteres");
  if (!temMaiuscula) erros.push("A senha deve ter pelo menos uma letra maiúscula");
  if (!temMinuscula) erros.push("A senha deve ter pelo menos uma letra minúscula");
  if (!temNumero) erros.push("A senha deve ter pelo menos um número");
  return erros;
}
