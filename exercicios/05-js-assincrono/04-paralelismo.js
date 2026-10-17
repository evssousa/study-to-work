/**
 * Exercício 04 — Executando em paralelo: Promise.all, allSettled, any e lotes
 *
 * Em todas as funções, `buscas` é um array de FUNÇÕES que, quando chamadas, iniciam uma
 * operação assíncrona e retornam uma Promise. (Você as chama quando quiser começar.)
 *
 * a) `somarEmParalelo(buscas)`
 *    Cada busca resolve um número. Inicie TODAS ao mesmo tempo e retorne a soma.
 *    O teste mede: três buscas de 100 ms têm que terminar em ~100 ms, e não em 300 ms.
 *    (Promise.all)
 *
 * b) `separarResultados(buscas)`
 *    Inicie todas ao mesmo tempo, espere TODAS terminarem (mesmo as que falham) e retorne:
 *      { valores: [...], erros: [...] }
 *    `valores` tem os resultados das que deram certo (na ordem original) e `erros` tem
 *    a MENSAGEM (erro.message) das que falharam (na ordem original). (Promise.allSettled)
 *
 * c) `fonteMaisRapida(buscas)`
 *    Inicie todas e retorne o resultado da PRIMEIRA que der certo, ignorando as que falharem
 *    antes. Se TODAS falharem: throw new Error("Todas as fontes falharam").
 *    (Promise.any — ele rejeita com um AggregateError, que você troca pela sua mensagem.)
 *
 * d) `emLotes(itens, tamanho, processar)`
 *    Processa a lista de itens com `processar(item)` (assíncrona), mas no máximo `tamanho`
 *    ao mesmo tempo: faz um lote em paralelo, espera acabar, e só então o próximo.
 *    Retorna os resultados na MESMA ordem dos itens. É assim que se evita bombardear uma
 *    API com 500 requisições de uma vez.
 *
 * Aula: seção 3.3.
 * Teste: npm run exercicio -- 04-paralelismo
 */
export async function somarEmParalelo(buscas) {
  // escreva seu código aqui
}

export async function separarResultados(buscas) {
  // escreva seu código aqui
}

export async function fonteMaisRapida(buscas) {
  // escreva seu código aqui
}

export async function emLotes(itens, tamanho, processar) {
  // escreva seu código aqui
}
