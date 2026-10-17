export function calcularFrete(pesoKg, tabela) {
  if (pesoKg <= 0) throw new Error("Peso inválido");
  for (const faixa of tabela) {
    if (pesoKg <= faixa.ate) return faixa.preco;
  }
  throw new Error("Peso acima do limite da tabela");
}
