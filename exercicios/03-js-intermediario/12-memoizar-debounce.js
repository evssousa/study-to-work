/**
 * Exercício 12 — memoizar e debounce: duas closures que todo dev usa
 *
 * a) `memoizar(funcao)` → retorna uma versão da função que GUARDA os resultados.
 *    Se for chamada de novo com o mesmo argumento, devolve o resultado guardado
 *    sem executar a função original de novo. (Considere funções de UM argumento.)
 *    Use um objeto como "cache" e o operador `in` para saber se já calculou.
 *
 *      const lenta = (n) => { ...conta demorada... };
 *      const rapida = memoizar(lenta);
 *      rapida(40);  // calcula
 *      rapida(40);  // devolve na hora, sem calcular
 *
 * b) `debounce(funcao, esperaMs)` → retorna uma versão da função que só executa depois
 *    que as chamadas PARAM por `esperaMs` milissegundos. Se for chamada de novo antes
 *    disso, o relógio recomeça. Executa com os argumentos da ÚLTIMA chamada.
 *
 *    Uso real: uma busca que só consulta o servidor quando a pessoa para de digitar.
 *
 *    Dica: guarde o retorno de setTimeout numa variável e use clearTimeout nela.
 *
 * Aula: seções 5.3 e 5.4.
 * Teste: npm run exercicio -- 12-memoizar
 */
export function memoizar(funcao) {
  // escreva seu código aqui
}

export function debounce(funcao, esperaMs) {
  // escreva seu código aqui
}
