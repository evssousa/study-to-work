/**
 * Exercício 10 — Estado único e "assinantes" (a ideia por trás do React)
 *
 * Em vez de mexer na página em vários lugares, uma aplicação organizada tem:
 *   1. UM objeto de estado com todos os dados;
 *   2. UMA função que desenha a tela a partir do estado;
 *   3. um jeito de AVISAR a tela quando o estado muda.
 * O item 3 é o que você vai construir: uma "store" (loja de estado).
 *
 * `criarStore(estadoInicial)` retorna um objeto com:
 *
 *   obterEstado()      → o estado atual
 *
 *   atualizar(mudanca) → cria um estado NOVO e avisa os assinantes.
 *      - se `mudanca` for um objeto: estadoNovo = { ...estadoAtual, ...mudanca }
 *      - se `mudanca` for uma função: estadoNovo = { ...estadoAtual, ...mudanca(estadoAtual) }
 *        (útil para "somar 1" sem precisar ler o estado antes)
 *      - NUNCA altere o objeto de estado anterior (imutabilidade!): quem guardou uma
 *        referência ao estado antigo continua vendo os valores antigos.
 *      - retorna o estado novo.
 *
 *   assinar(ouvinte)   → registra uma função que será chamada com o estado novo a cada
 *                        atualizar(). Retorna uma função que CANCELA a assinatura.
 *                        (assinar NÃO chama o ouvinte na hora.)
 *
 * Dica: guarde os ouvintes em um array (ou Set) dentro da closure de criarStore.
 *
 * Aula: seção 5.1.
 * Teste: npm run exercicio -- 10-store
 */
export function criarStore(estadoInicial) {
  // escreva seu código aqui
}
