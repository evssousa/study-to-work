/**
 * Exercício 17 — Trabalhando com dinheiro
 *
 * Em JavaScript, 0.1 + 0.2 não dá 0.3 (dá 0.30000000000000004). Em sistemas que
 * lidam com dinheiro isso é um bug grave. Leia a seção "Números decimais e dinheiro".
 *
 * a) `somarPrecos(precos)` recebe um array de preços e retorna o total
 *    arredondado em centavos (2 casas decimais).
 *      somarPrecos([0.1, 0.2])            → 0.3
 *      somarPrecos([19.9, 5.99, 0.11])    → 26
 *      somarPrecos([])                    → 0
 *
 * b) `formatarReais(valor)` retorna o valor no formato brasileiro de moeda.
 *      formatarReais(1234.5) → "R$ 1.234,50"
 *    Use: valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
 *
 * c) `aplicarDesconto(valor, percentual)` retorna o valor com desconto, arredondado
 *    em centavos. Percentual inválido (menor que 0 ou maior que 100) lança erro:
 *      throw new Error("Percentual de desconto inválido");
 *      aplicarDesconto(100, 15)   → 85
 *      aplicarDesconto(59.9, 10)  → 53.91
 *
 * Aula: seção 10 (números decimais e dinheiro).
 * Teste: npm run exercicio -- 17-dinheiro
 */
export function somarPrecos(precos) {
  // escreva seu código aqui
}

export function formatarReais(valor) {
  // escreva seu código aqui
}

export function aplicarDesconto(valor, percentual) {
  // escreva seu código aqui
}
