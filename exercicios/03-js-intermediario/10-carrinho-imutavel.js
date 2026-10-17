/**
 * Exercício 10 — Carrinho de compras imutável
 *
 * Em React (módulo 10) você NUNCA altera o estado diretamente: cria uma cópia nova.
 * Vamos treinar isso agora. O teste congela o carrinho recebido (Object.freeze em
 * tudo): se você tentar alterar o original (push, item.quantidade++, splice...), vai dar erro.
 *
 * Cada item do carrinho: { id: 1, nome: "Café", preco: 25, quantidade: 2 }
 *
 * a) `adicionarItem(carrinho, produto)` — produto: { id, nome, preco }
 *    - se o produto ainda não está no carrinho: acrescenta com quantidade 1
 *    - se já está: retorna o carrinho com a quantidade daquele item + 1
 *
 * b) `removerItem(carrinho, id)` — retorna o carrinho sem aquele item
 *
 * c) `alterarQuantidade(carrinho, id, quantidade)` — muda a quantidade do item;
 *    se a quantidade for 0 ou menos, remove o item
 *
 * d) `totalDoCarrinho(carrinho)` — soma de preco × quantidade
 *
 * Dicas: map + spread ({ ...item, quantidade: ... }) para alterar um item;
 *        filter para remover; [...carrinho, novoItem] para acrescentar.
 *
 * Aula: seção 4.4 (valor, referência e imutabilidade).
 * Teste: npm run exercicio -- 10-carrinho
 */
export function adicionarItem(carrinho, produto) {
  // escreva seu código aqui
}

export function removerItem(carrinho, id) {
  // escreva seu código aqui
}

export function alterarQuantidade(carrinho, id, quantidade) {
  // escreva seu código aqui
}

export function totalDoCarrinho(carrinho) {
  // escreva seu código aqui
}
