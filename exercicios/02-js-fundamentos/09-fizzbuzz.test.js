import { describe, expect, test } from "vitest";
import { fizzBuzz } from "./09-fizzbuzz.js";

describe("fizzBuzz", () => {
  test("retorna um array com `limite` elementos", () => {
    expect(fizzBuzz(100)).toHaveLength(100);
  });

  test("de 1 até 15", () => {
    expect(fizzBuzz(15)).toEqual([
      "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz",
      "11", "Fizz", "13", "14", "FizzBuzz",
    ]);
  });

  test("os números comuns são strings, não numbers", () => {
    expect(fizzBuzz(1)[0]).toBe("1");
  });

  test("30, 45 e 90 são FizzBuzz", () => {
    const resultado = fizzBuzz(90);
    expect(resultado[29]).toBe("FizzBuzz");
    expect(resultado[44]).toBe("FizzBuzz");
    expect(resultado[89]).toBe("FizzBuzz");
  });
});
