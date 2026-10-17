import { describe, expect, test } from "vitest";
import { ehPrimo } from "./05-primo.js";

describe("ehPrimo", () => {
  test.each([2, 3, 5, 7, 11, 13, 97, 7919])("%i é primo", (n) => {
    expect(ehPrimo(n)).toBe(true);
  });

  test.each([4, 6, 9, 15, 25, 100, 7917])("%i não é primo", (n) => {
    expect(ehPrimo(n)).toBe(false);
  });

  test("0 e 1 não são primos", () => {
    expect(ehPrimo(0)).toBe(false);
    expect(ehPrimo(1)).toBe(false);
  });

  test("números negativos não são primos", () => {
    expect(ehPrimo(-7)).toBe(false);
  });

  test("retorna sempre um booleano (true/false), nunca undefined", () => {
    expect(typeof ehPrimo(10)).toBe("boolean");
    expect(typeof ehPrimo(11)).toBe("boolean");
  });
});
