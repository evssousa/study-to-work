/**
 * Exercício 02 — Promises: criar, converter e controlar
 *
 * a) `esperar(ms)`
 *    Retorna uma Promise que se resolve (sem valor) depois de `ms` milissegundos.
 *    É a "pausa" do mundo assíncrono: `await esperar(1000)` espera 1 segundo sem travar nada.
 *
 * b) `promisificar(funcaoComCallback)`
 *    Muitas funções antigas recebem um callback no ESTILO NODE: o último argumento é
 *    uma função (erro, resultado) => {}. Transforme uma dessas em uma função que
 *    RETORNA uma Promise:
 *      const somarAssincrono = (a, b, callback) => callback(null, a + b);
 *      const somar = promisificar(somarAssincrono);
 *      await somar(2, 3);          // 5
 *    Se o callback receber um erro (primeiro argumento verdadeiro), a Promise é REJEITADA
 *    com ele. A função retornada repassa todos os argumentos que receber (use ...argumentos).
 *
 * c) `comTimeout(promise, ms)`
 *    Retorna uma Promise que:
 *      - se resolve com o valor de `promise`, se ela terminar antes de `ms`;
 *      - é rejeitada com Error("Tempo esgotado") se `ms` passar antes;
 *      - se `promise` for rejeitada antes, repassa o erro.
 *    LIMPE o timer (clearTimeout) quando a promise terminar antes, senão ele continua
 *    pendurado. O teste confere!
 *    Dica: new Promise((resolve, reject) => { ... }) e promise.then(resolve, reject).
 *
 * d) `emSequencia(tarefas)`
 *    `tarefas` é um array de FUNÇÕES que retornam Promises (não as promises prontas!).
 *    Execute uma de cada vez, só começando a próxima quando a anterior terminar, e
 *    retorne o array com os resultados, na ordem. (Dica: async/await com for...of.)
 *
 * Aula: seção 2.
 * Teste: npm run exercicio -- 02-promises
 */
export function esperar(ms) {
  // escreva seu código aqui
}

export function promisificar(funcaoComCallback) {
  // escreva seu código aqui
}

export function comTimeout(promise, ms) {
  // escreva seu código aqui
}

export async function emSequencia(tarefas) {
  // escreva seu código aqui
}
