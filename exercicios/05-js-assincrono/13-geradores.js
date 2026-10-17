/**
 * Exercício 13 — Iteradores e geradores (generators)
 *
 * Um GERADOR é uma função que pode PAUSAR no meio e continuar depois, entregando valores
 * um de cada vez com `yield`. Os valores são produzidos SOB DEMANDA ("preguiçosamente"):
 * um gerador infinito não trava nada, porque só calcula o que alguém pedir.
 *
 *   function* contar() {
 *     yield 1;
 *     yield 2;
 *   }
 *   for (const n of contar()) console.log(n);   // 1, 2
 *   [...contar()]                                 // [1, 2]
 *
 * a) `function* intervalo(inicio, fim, passo = 1)`
 *    Entrega inicio, inicio + passo, ... enquanto for MENOR que `fim` (fim não entra).
 *    Passo negativo conta para trás, enquanto for MAIOR que `fim`.
 *    Passo 0: throw new Error("O passo não pode ser zero") (ao pedir o primeiro valor).
 *      [...intervalo(0, 5)]       → [0, 1, 2, 3, 4]
 *      [...intervalo(10, 0, -3)]  → [10, 7, 4, 1]
 *
 * b) `function* pegar(iteravel, quantidade)`
 *    Entrega só os primeiros `quantidade` valores de qualquer iterável — inclusive de um
 *    gerador INFINITO. Não pode consumir um valor a mais do que o necessário.
 *
 * c) `function* naturais()`
 *    Gerador infinito: 1, 2, 3, 4, ... (com um `while (true)`).
 *    Em conjunto com pegar:  [...pegar(naturais(), 3)] → [1, 2, 3]
 *
 * d) `class Fila`
 *    Uma fila que pode ser percorrida com for...of (ela é ITERÁVEL).
 *      enfileirar(item)  coloca no fim; retorna `this`
 *      desenfileirar()   tira e retorna o primeiro (undefined se vazia)
 *      get tamanho
 *      [Symbol.iterator]()  percorre os itens, do primeiro ao último, SEM tirá-los da fila
 *    Dica: o método pode ser um gerador:  *[Symbol.iterator]() { yield* this.#itens; }
 *
 * e) `async function* paginas(buscarPagina)`
 *    Gerador ASSÍNCRONO para APIs paginadas. `buscarPagina(numero)` (assíncrona; a primeira
 *    página é a 1) retorna { itens: [...], temMais: true | false }. Entregue o array `itens`
 *    de cada página, em ordem, parando depois da página com temMais === false.
 *    Só busca a próxima página quando pedirem (se o consumidor parar, nada mais é buscado).
 *
 * f) `async function coletarTudo(buscarPagina)`
 *    Usa o `paginas` com `for await...of` e retorna UM array com os itens de todas as páginas.
 *
 * Aula: seção 8.
 * Teste: npm run exercicio -- 13-geradores
 */

// escreva aqui: intervalo, pegar, naturais (geradores), a classe Fila, paginas e coletarTudo
// (todos exportados)
