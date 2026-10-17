import { describe, expect, test } from "vitest";
import { somarAte, somarParesAte } from "./04-somatorios.js";

describe("somarAte", () => {
  test("somarAte(5) = 1 + 2 + 3 + 4 + 5 = 15", () => {
    expect(somarAte(5)).toBe(15);
  });

  test("somarAte(100) = 5050", () => {
    expect(somarAte(100)).toBe(5050);
  });

  test("somarAte(1) = 1", () => {
    expect(somarAte(1)).toBe(1);
  });

  test("limite menor que 1 retorna 0", () => {
    expect(somarAte(0)).toBe(0);
    expect(somarAte(-5)).toBe(0);
  });
});

describe("somarParesAte", () => {
  test("somarParesAte(10) = 2 + 4 + 6 + 8 + 10 = 30", () => {
    expect(somarParesAte(10)).toBe(30);
  });

  test("somarParesAte(100) = 2550", () => {
    expect(somarParesAte(100)).toBe(2550);
  });

  test("limite ímpar não inclui o próprio limite: somarParesAte(7) = 2 + 4 + 6 = 12", () => {
    expect(somarParesAte(7)).toBe(12);
  });

  test("limite menor que 2 retorna 0", () => {
    expect(somarParesAte(1)).toBe(0);
    expect(somarParesAte(0)).toBe(0);
  });
});
