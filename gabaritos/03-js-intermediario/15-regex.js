export function apenasDigitos(texto) {
  return texto.replace(/\D/g, "");
}

export function validarCEP(cep) {
  return /^\d{5}-?\d{3}$/.test(cep);
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatarTelefone(telefone) {
  const digitos = apenasDigitos(telefone);
  if (digitos.length === 11) return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (digitos.length === 10) return digitos.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  throw new Error("Telefone inválido");
}

export function extrairHashtags(texto) {
  const encontradas = [...texto.matchAll(/#(\w+)/g)].map((resultado) => resultado[1].toLowerCase());
  return [...new Set(encontradas)];
}
