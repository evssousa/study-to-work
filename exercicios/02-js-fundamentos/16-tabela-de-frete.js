/**
 * Exercício 16 — Tabela de frete (consultar faixas em uma tabela)
 *
 * Lojas virtuais cobram frete por faixa de peso. A tabela vem como um array de
 * objetos, ordenado do menor para o maior peso:
 *
 *   const tabela = [
 *     { ate: 1, preco: 15 },    // até 1 kg custa R$ 15
 *     { ate: 5, preco: 25 },    // de 1 kg até 5 kg custa R$ 25
 *     { ate: 30, preco: 60 },   // de 5 kg até 30 kg custa R$ 60
 *   ];
 *
 * `calcularFrete(pesoKg, tabela)` retorna o preço da PRIMEIRA faixa em que
 * o peso cabe (peso <= ate).
 *
 * Regras:
 *   - Peso zero ou negativo:  throw new Error("Peso inválido");
 *   - Peso maior que a última faixa: throw new Error("Peso acima do limite da tabela");
 *
 * Exemplos (com a tabela acima):
 *   calcularFrete(0.5, tabela) → 15
 *   calcularFrete(1, tabela)   → 15   (1 kg ainda cabe na primeira faixa)
 *   calcularFrete(1.2, tabela) → 25
 *
 * Esse padrão "procurar a faixa certa em uma tabela" aparece no projeto do módulo.
 *
 * Aula: seções 6 (condicionais), 7 (laços: return dentro do for) e 9 (arrays de objetos).
 * Teste: npm run exercicio -- 16-tabela
 */
export function calcularFrete(pesoKg, tabela) {
  // escreva seu código aqui
}
