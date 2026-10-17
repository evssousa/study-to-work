import { describe, expect, test } from "vitest";
import { celsiusParaFahrenheit } from "./01-celsius-para-fahrenheit.js";

describe("celsiusParaFahrenheit", () => {
  test("0 °C é o ponto de congelamento da água: 32 °F", () => {
    expect(celsiusParaFahrenheit(0)).toBe(32);
  });

  test("100 °C é o ponto de ebulição da água: 212 °F", () => {
    expect(celsiusParaFahrenheit(100)).toBe(212);
  });

  test("-40 °C é igual a -40 °F (a única temperatura igual nas duas escalas)", () => {
    expect(celsiusParaFahrenheit(-40)).toBe(-40);
  });

  test("funciona com números decimais: 36.5 °C → 97.7 °F", () => {
    expect(celsiusParaFahrenheit(36.5)).toBeCloseTo(97.7);
  });

  test("retorna um número (e não uma string ou undefined)", () => {
    expect(typeof celsiusParaFahrenheit(25)).toBe("number");
  });
});
