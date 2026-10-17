export function parOuImpar(numero) {
  return numero % 2 === 0 ? "par" : "ímpar";
}

export function sinal(numero) {
  if (numero > 0) return "positivo";
  if (numero < 0) return "negativo";
  return "zero";
}
