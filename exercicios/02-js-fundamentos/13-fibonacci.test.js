import { describe, expect, test } from "vitest";
import { fibonacci } from "./13-fibonacci.js";

describe("fibonacci", () => {
  test("quantidade 0 retorna array vazio", () => {
    expect(fibonacci(0)).toEqual([]);
  });

  test("os dois primeiros são 0 e 1", () => {
    expect(fibonacci(1)).toEqual([0]);
    expect(fibonacci(2)).toEqual([0, 1]);
  });

  test("os 7 primeiros: 0, 1, 1, 2, 3, 5, 8", () => {
    expect(fibonacci(7)).toEqual([0, 1, 1, 2, 3, 5, 8]);
  });

  test("os 20 primeiros terminam em 4181", () => {
    const resultado = fibonacci(20);
    expect(resultado).toHaveLength(20);
    expect(resultado[19]).toBe(4181);
  });
});
