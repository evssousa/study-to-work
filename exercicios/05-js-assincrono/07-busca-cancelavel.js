/**
 * Exercício 07 — Cancelamento e condição de corrida (race condition)
 *
 * Uma busca "ao vivo" dispara uma requisição a cada letra: "j", "ja", "jav", "java".
 * As respostas podem chegar FORA DE ORDEM. Se a resposta de "ja" (lenta) chegar DEPOIS
 * da de "java" (rápida), a tela mostra o resultado errado. Isso é uma condição de corrida.
 *
 * A solução: ao começar uma busca nova, CANCELE a anterior (AbortController) e IGNORE
 * qualquer resposta que não seja da busca mais recente.
 *
 * `criarBuscaCancelavel(buscar)` — `buscar(termo, { signal })` é uma função assíncrona
 * que o aluno recebe pronta (ela deve respeitar o signal). Retorna uma função
 * `pesquisar(termo)` assíncrona que resolve com:
 *
 *    { cancelada: false, dados }    a busca terminou e AINDA É a mais recente
 *    { cancelada: true }            outra busca começou depois (ou esta foi abortada)
 *
 * Regras:
 *   - Cada chamada cria um AbortController novo e passa o signal para `buscar`.
 *   - Uma nova chamada ABORTA o controlador da anterior (controlador.abort()).
 *   - Uma busca que terminou com sucesso, mas não é mais a mais recente, vira
 *     { cancelada: true } (mesmo que a função `buscar` não tenha respeitado o signal).
 *   - Se `buscar` lançar um erro de nome "AbortError", vira { cancelada: true }.
 *   - Se lançar qualquer outro erro e esta busca AINDA for a mais recente: relance o erro.
 *     Se já não for a mais recente, o erro não interessa mais: { cancelada: true }.
 *
 * Dica: guarde o controlador atual numa variável da closure e compare
 * `controlador === controladorAtual` depois do await.
 *
 * Aula: seção 5.2.
 * Teste: npm run exercicio -- 07-busca
 */
export function criarBuscaCancelavel(buscar) {
  // escreva seu código aqui
}
