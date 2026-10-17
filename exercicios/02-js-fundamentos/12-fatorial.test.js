import { describe, expect, test } from "vitest";
import { fatorial, fatorialRecursivo } from "./12-fatorial.js";

describe.each([
  ["fatorial (com laço)", fatorial],
  ["fatorialRecursivo", fatorialRecursivo],
])("%s", (_nome, funcao) => {
  test("5! = 120", () => {
    expect(funcao(5)).toBe(120);
  });

  test("0! = 1 e 1! = 1", () => {
    expect(funcao(0)).toBe(1);
    expect(funcao(1)).toBe(1);
  });

  test("10! = 3628800", () => {
    expect(funcao(10)).toBe(3628800);
  });

  test("lança erro para número negativo", () => {
    expect(() => funcao(-1)).toThrow("Não existe fatorial de número negativo");
  });
});
