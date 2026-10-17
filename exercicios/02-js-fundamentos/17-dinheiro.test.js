import { describe, expect, test } from "vitest";
import { aplicarDesconto, formatarReais, somarPrecos } from "./17-dinheiro.js";

// toLocaleString usa um "espaço inquebrável" entre R$ e o número.
// Aqui trocamos por um espaço comum só para comparar com mais facilidade.
const semEspacoEspecial = (texto) => texto.replace(/\s/g, " ");

describe("somarPrecos", () => {
  test("0.1 + 0.2 dá exatamente 0.3", () => {
    expect(somarPrecos([0.1, 0.2])).toBe(0.3);
  });

  test("19.90 + 5.99 + 0.11 dá exatamente 26", () => {
    expect(somarPrecos([19.9, 5.99, 0.11])).toBe(26);
  });

  test("lista vazia soma 0", () => {
    expect(somarPrecos([])).toBe(0);
  });

  test("muitos centavos somados não acumulam erro", () => {
    const precos = [];
    for (let i = 0; i < 100; i++) precos.push(0.07);
    expect(somarPrecos(precos)).toBe(7);
  });
});

describe("formatarReais", () => {
  test("1234.5 vira R$ 1.234,50", () => {
    expect(semEspacoEspecial(formatarReais(1234.5))).toBe("R$ 1.234,50");
  });

  test("0 vira R$ 0,00", () => {
    expect(semEspacoEspecial(formatarReais(0))).toBe("R$ 0,00");
  });

  test("milhões usam ponto como separador de milhar", () => {
    expect(semEspacoEspecial(formatarReais(1500000))).toBe("R$ 1.500.000,00");
  });
});

describe("aplicarDesconto", () => {
  test("15% de desconto em 100 dá 85", () => {
    expect(aplicarDesconto(100, 15)).toBe(85);
  });

  test("10% de desconto em 59.90 dá 53.91 (arredondado em centavos)", () => {
    expect(aplicarDesconto(59.9, 10)).toBe(53.91);
  });

  test("0% não muda o valor e 100% zera", () => {
    expect(aplicarDesconto(80, 0)).toBe(80);
    expect(aplicarDesconto(80, 100)).toBe(0);
  });

  test("percentual negativo ou acima de 100 lança erro", () => {
    expect(() => aplicarDesconto(100, -5)).toThrow("Percentual de desconto inválido");
    expect(() => aplicarDesconto(100, 120)).toThrow("Percentual de desconto inválido");
  });
});
