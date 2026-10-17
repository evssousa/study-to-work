import { describe, expect, test } from "vitest";
import { importarDoProjeto } from "./carregar.js";

const { textoParaCentavos, formatarCentavos, mascararReais } = await importarDoProjeto("dinheiro.js");

describe("src/dinheiro.js — textoParaCentavos", () => {
  test.each([
    ["12,50", 1250],
    ["12,5", 1250],
    ["12", 1200],
    ["0,07", 7],
    ["0,5", 50],
    ["1.234,56", 123456],
    ["1.234", 123400],
    ["12.345,6", 1234560],
    ["R$ 10,00", 1000],
    ["R$10", 1000],
    ["  45,90  ", 4590],
    ["1.234.567,89", 123456789],
  ])("'%s' → %i centavos", (texto, esperado) => {
    expect(textoParaCentavos(texto)).toBe(esperado);
  });

  test.each(["", "abc", "12,345", "1.23", "-5", "12,", ",50", "1..234", "12,34,56", "R$"])(
    "valor inválido: '%s'",
    (texto) => {
      expect(() => textoParaCentavos(texto)).toThrow(`Valor inválido: ${texto}`);
    },
  );
});

describe("src/dinheiro.js — formatarCentavos", () => {
  test.each([
    [123456, "R$ 1.234,56"],
    [7, "R$ 0,07"],
    [0, "R$ 0,00"],
    [100, "R$ 1,00"],
    [123456789, "R$ 1.234.567,89"],
  ])("%i → %s (com espaço comum, não o inquebrável)", (centavos, esperado) => {
    expect(formatarCentavos(centavos)).toBe(esperado);
  });

  test("valores negativos", () => {
    expect(formatarCentavos(-4590)).toBe("-R$ 45,90");
  });
});

describe("src/dinheiro.js — mascararReais (a máscara do campo de valor)", () => {
  test.each([
    ["", ""],
    ["1", "0,01"],
    ["123", "1,23"],
    ["9000", "90,00"],
    ["123456", "1.234,56"],
    ["abc", ""],
    ["1.234,56", "1.234,56"],
  ])("'%s' → '%s'", (entrada, esperado) => {
    expect(mascararReais(entrada)).toBe(esperado);
  });
});
