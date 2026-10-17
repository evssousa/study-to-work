/**
 * Exercício 01 — Em que ordem o código executa? (o event loop)
 *
 * Aqui você NÃO escreve funções: você PREVÊ o que cada trecho de código imprime, e em que
 * ordem. Preencha os arrays abaixo com os valores que o console.log mostraria, na ordem.
 * (Números como número, textos como texto.)
 *
 * Tente primeiro no papel, usando o que a aula explica (pilha, microtasks e macrotasks).
 * Depois, se quiser conferir, copie o trecho para um arquivo à parte e rode com o Node.
 *
 * ── Trecho A ─────────────────────────────────────────────
 *   console.log("A");
 *   setTimeout(() => console.log("B"), 0);
 *   Promise.resolve().then(() => console.log("C"));
 *   console.log("D");
 *
 * ── Trecho B ─────────────────────────────────────────────
 *   console.log(1);
 *   setTimeout(() => console.log(2), 10);
 *   setTimeout(() => console.log(3), 0);
 *   Promise.resolve().then(() => console.log(4)).then(() => console.log(5));
 *   queueMicrotask(() => console.log(6));
 *   console.log(7);
 *
 * ── Trecho C ─────────────────────────────────────────────
 *   async function tarefa() {
 *     console.log("início da tarefa");
 *     await null;
 *     console.log("depois do await");
 *   }
 *   console.log("antes");
 *   tarefa();
 *   console.log("depois");
 *
 * Aula: seção 1.
 * Teste: npm run exercicio -- 01-ordem
 */
export const respostas = {
  a: [], // ex.: ["A", ...]
  b: [], // ex.: [1, ...]
  c: [],
};
