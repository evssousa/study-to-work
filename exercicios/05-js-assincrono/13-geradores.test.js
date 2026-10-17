import { describe, expect, test, vi } from "vitest";
import * as modulo from "./13-geradores.js";

const { intervalo, pegar, naturais, Fila, paginas, coletarTudo } = modulo;

describe("intervalo", () => {
  test("conta para a frente, sem incluir o fim", () => {
    expect([...intervalo(0, 5)]).toEqual([0, 1, 2, 3, 4]);
    expect([...intervalo(2, 11, 3)]).toEqual([2, 5, 8]);
    expect([...intervalo(5, 5)]).toEqual([]);
    expect([...intervalo(6, 5)]).toEqual([]);
  });

  test("passo negativo conta para trás", () => {
    expect([...intervalo(10, 0, -3)]).toEqual([10, 7, 4, 1]);
    expect([...intervalo(0, 5, -1)]).toEqual([]);
  });

  test("é um gerador de verdade: preguiçoso e com next()", () => {
    const g = intervalo(0, 1_000_000_000);
    expect(g.next()).toEqual({ value: 0, done: false });
    expect(g.next()).toEqual({ value: 1, done: false });
    expect(typeof g[Symbol.iterator]).toBe("function");
  });

  test("passo zero lança erro", () => {
    expect(() => [...intervalo(0, 5, 0)]).toThrow("O passo não pode ser zero");
  });
});

describe("naturais e pegar", () => {
  test("naturais é infinito, mas só calcula o que pedem", () => {
    const g = naturais();
    expect([g.next().value, g.next().value, g.next().value]).toEqual([1, 2, 3]);
  });

  test("pegar os primeiros N de um gerador infinito", () => {
    expect([...pegar(naturais(), 5)]).toEqual([1, 2, 3, 4, 5]);
  });

  test("pegar de arrays e outros iteráveis", () => {
    expect([...pegar([10, 20, 30], 2)]).toEqual([10, 20]);
    expect([...pegar("abc", 10)]).toEqual(["a", "b", "c"]);
    expect([...pegar(new Set([1, 2, 3]), 0)]).toEqual([]);
  });

  test("não consome um valor a mais do que precisa", () => {
    let produzidos = 0;
    function* fonte() {
      while (true) {
        produzidos++;
        yield produzidos;
      }
    }
    expect([...pegar(fonte(), 3)]).toEqual([1, 2, 3]);
    expect(produzidos).toBe(3);
  });

  test("pegar também é preguiçoso", () => {
    const g = pegar(naturais(), 2);
    expect(g.next()).toEqual({ value: 1, done: false });
    expect(g.next()).toEqual({ value: 2, done: false });
    expect(g.next().done).toBe(true);
  });
});

describe("Fila", () => {
  test("enfileirar, desenfileirar e tamanho", () => {
    expect(typeof Fila, "Exporte a classe Fila").toBe("function");
    const fila = new Fila();
    expect(fila.enfileirar("a")).toBe(fila);
    fila.enfileirar("b").enfileirar("c");
    expect(fila.tamanho).toBe(3);
    expect(fila.desenfileirar()).toBe("a");
    expect(fila.tamanho).toBe(2);
    expect(new Fila().desenfileirar()).toBeUndefined();
  });

  test("é iterável com for...of e spread, sem esvaziar a fila", () => {
    const fila = new Fila().enfileirar(1).enfileirar(2).enfileirar(3);
    const vistos = [];
    for (const item of fila) vistos.push(item);
    expect(vistos).toEqual([1, 2, 3]);
    expect([...fila]).toEqual([1, 2, 3]);
    expect(fila.tamanho).toBe(3);
  });

  test("combina com pegar e Array.from", () => {
    const fila = new Fila().enfileirar("x").enfileirar("y").enfileirar("z");
    expect([...pegar(fila, 2)]).toEqual(["x", "y"]);
    expect(Array.from(fila, (s) => s.toUpperCase())).toEqual(["X", "Y", "Z"]);
  });

  test("o conteúdo é privado", () => {
    expect(Object.keys(new Fila().enfileirar(1))).toEqual([]);
  });
});

describe("paginas e coletarTudo", () => {
  const dadosPorPagina = {
    1: { itens: ["a", "b"], temMais: true },
    2: { itens: ["c", "d"], temMais: true },
    3: { itens: ["e"], temMais: false },
  };

  test("entrega o array de cada página, em ordem", async () => {
    const buscarPagina = vi.fn(async (n) => dadosPorPagina[n]);
    const recebidas = [];
    for await (const itens of paginas(buscarPagina)) recebidas.push(itens);
    expect(recebidas).toEqual([["a", "b"], ["c", "d"], ["e"]]);
    expect(buscarPagina.mock.calls.map((c) => c[0])).toEqual([1, 2, 3]);
  });

  test("só busca a próxima página quando pedem", async () => {
    const buscarPagina = vi.fn(async (n) => dadosPorPagina[n]);
    for await (const _itens of paginas(buscarPagina)) {
      break; // para na primeira página
    }
    expect(buscarPagina).toHaveBeenCalledTimes(1);
  });

  test("uma página só", async () => {
    const buscarPagina = vi.fn(async () => ({ itens: [1, 2, 3], temMais: false }));
    const todas = [];
    for await (const itens of paginas(buscarPagina)) todas.push(itens);
    expect(todas).toEqual([[1, 2, 3]]);
    expect(buscarPagina).toHaveBeenCalledTimes(1);
  });

  test("coletarTudo junta os itens de todas as páginas", async () => {
    await expect(coletarTudo(async (n) => dadosPorPagina[n])).resolves.toEqual(["a", "b", "c", "d", "e"]);
  });

  test("erro numa página interrompe e sobe", async () => {
    const buscarPagina = async (n) => {
      if (n === 2) throw new Error("página 2 falhou");
      return dadosPorPagina[n];
    };
    await expect(coletarTudo(buscarPagina)).rejects.toThrow("página 2 falhou");
  });
});
