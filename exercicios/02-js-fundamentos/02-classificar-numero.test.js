import { describe, expect, test } from "vitest";
import { parOuImpar, sinal } from "./02-classificar-numero.js";

describe("parOuImpar", () => {
  test.each([0, 2, 4, 100, -8])("%i é par", (n) => {
    expect(parOuImpar(n)).toBe("par");
  });

  test.each([1, 7, 99, -3])("%i é ímpar (com acento!)", (n) => {
    expect(parOuImpar(n)).toBe("ímpar");
  });
});

describe("sinal", () => {
  test("números maiores que zero são positivos", () => {
    expect(sinal(10)).toBe("positivo");
    expect(sinal(0.5)).toBe("positivo");
  });

  test("números menores que zero são negativos", () => {
    expect(sinal(-3)).toBe("negativo");
    expect(sinal(-0.1)).toBe("negativo");
  });

  test("zero não é positivo nem negativo", () => {
    expect(sinal(0)).toBe("zero");
  });
});
