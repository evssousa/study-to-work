/**
 * Exercício 11 — Closures
 *
 * Uma closure é uma função que "lembra" das variáveis do lugar onde foi criada.
 * Todas as funções abaixo retornam funções (ou um objeto com funções) que guardam
 * um estado PRIVADO: ninguém de fora consegue mexer nele diretamente.
 *
 * a) `criarContador(inicial = 0)` → objeto com:
 *      incrementar() → soma 1 e retorna o novo valor
 *      decrementar() → subtrai 1 e retorna o novo valor
 *      valor()       → retorna o valor atual
 *      resetar()     → volta ao valor inicial e retorna esse valor
 *
 * b) `criarGeradorDeId(prefixo)` → função que, a cada chamada, retorna o próximo id:
 *      const proximoId = criarGeradorDeId("pedido");
 *      proximoId() → "pedido-1";   proximoId() → "pedido-2"
 *
 * c) `executarUmaVez(funcao)` → função que só executa `funcao` na primeira chamada.
 *    Nas próximas, não executa de novo e retorna o resultado da primeira vez.
 *    (Útil para inicializar algo só uma vez, como uma conexão.)
 *
 * d) `criarMultiplicador(fator)` → função que multiplica um número pelo fator.
 *      const dobro = criarMultiplicador(2);  dobro(21) → 42
 *
 * Aula: seção 5.3.
 * Teste: npm run exercicio -- 11-closures
 */
export function criarContador(inicial = 0) {
  // escreva seu código aqui
}

export function criarGeradorDeId(prefixo) {
  // escreva seu código aqui
}

export function executarUmaVez(funcao) {
  // escreva seu código aqui
}

export function criarMultiplicador(fator) {
  // escreva seu código aqui
}
