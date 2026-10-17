import { describe, expect, test } from "vitest";
import { contarVogais } from "./08-contar-vogais.js";

describe("contarVogais", () => {
  test('"banana" tem 3 vogais', () => {
    expect(contarVogais("banana")).toBe(3);
  });

  test("conta vogais maiúsculas", () => {
    expect(contarVogais("AEIOU")).toBe(5);
  });

  test("conta vogais acentuadas: PROGRAMAÇÃO tem 5", () => {
    expect(contarVogais("PROGRAMAÇÃO")).toBe(5);
  });

  test('"Você está aí?" tem 6 vogais', () => {
    expect(contarVogais("Você está aí?")).toBe(6);
  });

  test("texto sem vogais retorna 0", () => {
    expect(contarVogais("xyz")).toBe(0);
    expect(contarVogais("")).toBe(0);
  });
});
