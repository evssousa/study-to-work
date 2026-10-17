import { describe, expect, test } from "vitest";
import { respostas } from "./01-ordem-de-execucao.js";

// Executa cada trecho DE VERDADE e registra o que ele imprimiria.
async function executar(trecho) {
  const log = [];
  trecho((valor) => log.push(valor));
  await new Promise((resolver) => setTimeout(resolver, 50)); // tempo para os timers terminarem
  return log;
}

describe("a ordem de execução", () => {
  test("Trecho A", async () => {
    const real = await executar((imprimir) => {
      imprimir("A");
      setTimeout(() => imprimir("B"), 0);
      Promise.resolve().then(() => imprimir("C"));
      imprimir("D");
    });
    expect(respostas.a).toEqual(real);
  });

  test("Trecho B", async () => {
    const real = await executar((imprimir) => {
      imprimir(1);
      setTimeout(() => imprimir(2), 10);
      setTimeout(() => imprimir(3), 0);
      Promise.resolve()
        .then(() => imprimir(4))
        .then(() => imprimir(5));
      queueMicrotask(() => imprimir(6));
      imprimir(7);
    });
    expect(respostas.b).toEqual(real);
  });

  test("Trecho C", async () => {
    const real = await executar((imprimir) => {
      async function tarefa() {
        imprimir("início da tarefa");
        await null;
        imprimir("depois do await");
      }
      imprimir("antes");
      tarefa();
      imprimir("depois");
    });
    expect(respostas.c).toEqual(real);
  });
});
