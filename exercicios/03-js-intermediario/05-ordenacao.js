/**
 * Exercício 05 — Ordenação sem efeitos colaterais
 *
 * REGRA: nenhuma função pode alterar o array recebido. O teste "congela" os arrays
 * com Object.freeze: se você usar .sort() direto no original, vai dar erro.
 * Use .toSorted() (ou copie antes de ordenar).
 *
 * a) `ordenarPorPreco(produtos)`   → do mais barato para o mais caro
 * b) `ordenarPorNome(produtos)`    → ordem alfabética correta em português
 *                                    ("Água" vem antes de "Banana"; use localeCompare)
 * c) `ordenarPorCategoriaEPreco(produtos)` → por categoria (A-Z) e, dentro da mesma
 *                                    categoria, do MAIS CARO para o mais barato
 * d) `maisVendidos(vendas, quantidade)` → os `quantidade` itens com mais unidades vendidas
 *      vendas: [{ produto: "Café", unidades: 30 }, ...]
 *
 * Aula: seção 2.6.
 * Teste: npm run exercicio -- 05-ordenacao
 */
export function ordenarPorPreco(produtos) {
  // escreva seu código aqui
}

export function ordenarPorNome(produtos) {
  // escreva seu código aqui
}

export function ordenarPorCategoriaEPreco(produtos) {
  // escreva seu código aqui
}

export function maisVendidos(vendas, quantidade) {
  // escreva seu código aqui
}
