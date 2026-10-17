import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { meuFilter, meuMap, meuReduce } from "./04-meus-metodos.js";

describe("meuMap", () => {
  test("transforma cada item", () => {
    expect(meuMap([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
  });

  test("passa (item, indice, lista) para o callback", () => {
    const lista = ["a", "b"];
    expect(meuMap(lista, (item, indice, original) => `${item}${indice}${original.length}`)).toEqual(["a02", "b12"]);
  });

  test("não altera o original", () => {
    const lista = [1, 2];
    meuMap(lista, (n) => n * 100);
    expect(lista).toEqual([1, 2]);
  });
});

describe("meuFilter", () => {
  test("mantém só os que passam na condição", () => {
    expect(meuFilter([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([2, 4]);
  });

  test("passa o índice", () => {
    expect(meuFilter(["x", "y", "z"], (_item, indice) => indice !== 1)).toEqual(["x", "z"]);
  });
});

describe("meuReduce", () => {
  test("soma com valor inicial", () => {
    expect(meuReduce([1, 2, 3], (acumulado, n) => acumulado + n, 0)).toBe(6);
  });

  test("monta um objeto", () => {
    const resultado = meuReduce(
      ["a", "b", "a"],
      (contagem, letra) => {
        contagem[letra] = (contagem[letra] ?? 0) + 1;
        return contagem;
      },
      {},
    );
    expect(resultado).toEqual({ a: 2, b: 1 });
  });

  test("lista vazia retorna o valor inicial", () => {
    expect(meuReduce([], (a, b) => a + b, 42)).toBe(42);
  });

  test("passa o índice para o redutor", () => {
    expect(meuReduce([10, 20], (acumulado, _n, indice) => acumulado + indice, 0)).toBe(1);
  });
});

test("não usa os métodos prontos", () => {
  const codigo = lerTexto(caminhoAoLado(import.meta.url, "04-meus-metodos.js")).replace(/\/\*[\s\S]*?\*\//g, "");
  expect(codigo).not.toMatch(/\.(map|filter|reduce|forEach)\(/);
});
