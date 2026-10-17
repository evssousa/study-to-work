import { describe, expect, test } from "vitest";
import { tabuada } from "./10-tabuada.js";

describe("tabuada", () => {
  test("retorna um array com 10 linhas", () => {
    const resultado = tabuada(3);
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado).toHaveLength(10);
  });

  test("a tabuada do 7 começa em 7 x 1 e termina em 7 x 10", () => {
    const resultado = tabuada(7);
    expect(resultado[0]).toBe("7 x 1 = 7");
    expect(resultado[9]).toBe("7 x 10 = 70");
  });

  test("todas as linhas da tabuada do 2 estão corretas", () => {
    expect(tabuada(2)).toEqual([
      "2 x 1 = 2",
      "2 x 2 = 4",
      "2 x 3 = 6",
      "2 x 4 = 8",
      "2 x 5 = 10",
      "2 x 6 = 12",
      "2 x 7 = 14",
      "2 x 8 = 16",
      "2 x 9 = 18",
      "2 x 10 = 20",
    ]);
  });

  test("funciona com zero", () => {
    expect(tabuada(0)[4]).toBe("0 x 5 = 0");
  });
});
