/**
 * Exercício 03 — async/await e tentar de novo (retry com backoff)
 *
 * Redes falham: um Wi-Fi que oscila, um servidor que reinicia. Muitas falhas somem se você
 * tentar de novo — mas não imediatamente e não para sempre. A estratégia clássica é o
 * BACKOFF EXPONENCIAL: esperar um pouco, e a cada falha esperar o DOBRO.
 *
 * `tentarNovamente(funcao, opcoes)`
 *
 *   funcao   função assíncrona; é chamada com o número da tentativa (1, 2, 3...)
 *   opcoes   {
 *     tentativas       quantas vezes tentar NO TOTAL (padrão 3)
 *     esperaInicialMs  espera depois da 1ª falha (padrão 100)
 *     fator            multiplicador da espera a cada falha (padrão 2)
 *     tentarSe         função (erro) => true/false; se retornar false, desiste na hora e
 *                      lança o erro (padrão: sempre tenta). Útil para não repetir erros
 *                      que não adiantam repetir, como "400 Bad Request".
 *     esperar          função (ms) => Promise que faz a pausa (padrão: o seu esperar do
 *                      exercício 02, ou escreva uma aqui). Existe como opção para o teste
 *                      não precisar esperar de verdade.
 *   }
 *
 * Comportamento:
 *   - deu certo → retorna o resultado;
 *   - falhou e ainda restam tentativas → espera (esperaInicialMs, depois × fator, ...) e tenta de novo;
 *   - falhou na ÚLTIMA tentativa → lança o erro DESSA última tentativa;
 *   - NÃO espera depois da última falha.
 *
 *   Com tentativas: 4, esperaInicialMs: 100 e fator: 2, as esperas são 100, 200, 400.
 *
 * Aula: seção 3.
 * Teste: npm run exercicio -- 03-tentar
 */
export async function tentarNovamente(funcao, opcoes = {}) {
  // escreva seu código aqui
}
