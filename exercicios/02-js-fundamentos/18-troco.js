/**
 * Exercício 18 — Caixa eletrônico de troco
 *
 * `calcularTroco(valorCompra, valorPago)` retorna um array dizendo quantas cédulas
 * e moedas de cada valor devem ser devolvidas, usando sempre a MAIOR cédula possível.
 *
 * Cédulas e moedas disponíveis (do maior para o menor):
 *   200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01
 *
 * Formato do retorno (só aparecem os valores usados, do maior para o menor):
 *   calcularTroco(12.35, 50) → troco de 37.65:
 *   [
 *     { valor: 20, quantidade: 1 },
 *     { valor: 10, quantidade: 1 },
 *     { valor: 5, quantidade: 1 },
 *     { valor: 2, quantidade: 1 },
 *     { valor: 0.5, quantidade: 1 },
 *     { valor: 0.1, quantidade: 1 },
 *     { valor: 0.05, quantidade: 1 },
 *   ]
 *
 * Regras:
 *   - Pagamento exato → array vazio [].
 *   - Se o valor pago for menor que o da compra, lance:
 *       throw new Error("Valor pago insuficiente");
 *
 * DICA IMPORTANTE: trabalhe em CENTAVOS (números inteiros) para não sofrer com
 * os erros de casas decimais. Ex.: Math.round(37.65 * 100) → 3765.
 * Math.floor(divisao) dá a quantidade de cédulas; o operador % dá o que sobra.
 *
 * Aula: seções 5 (operador %), 7 (laços), 9 (arrays de objetos) e 10 (dinheiro).
 * Teste: npm run exercicio -- 18-troco
 */
export function calcularTroco(valorCompra, valorPago) {
  // escreva seu código aqui
}
