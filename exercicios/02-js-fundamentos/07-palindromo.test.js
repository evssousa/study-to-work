import { describe, expect, test } from "vitest";
import { ehPalindromo } from "./07-palindromo.js";

describe("ehPalindromo", () => {
  test.each(["arara", "ovo", "radar", "a"])('"%s" é palíndromo', (palavra) => {
    expect(ehPalindromo(palavra)).toBe(true);
  });

  test.each(["casa", "javascript", "ab"])('"%s" não é palíndromo', (palavra) => {
    expect(ehPalindromo(palavra)).toBe(false);
  });

  test("ignora maiúsculas: Ana", () => {
    expect(ehPalindromo("Ana")).toBe(true);
  });

  test("ignora espaços: A base do teto desaba", () => {
    expect(ehPalindromo("A base do teto desaba")).toBe(true);
  });

  test("ignora acentos: Após a sopa", () => {
    expect(ehPalindromo("Após a sopa")).toBe(true);
  });

  test("ignora pontuação e hífens: Socorram-me, subi no ônibus em Marrocos!", () => {
    expect(ehPalindromo("Socorram-me, subi no ônibus em Marrocos!")).toBe(true);
  });

  test("frase comum não é palíndromo", () => {
    expect(ehPalindromo("Olá, mundo!")).toBe(false);
  });
});
