import { describe, expect, test } from "vitest";
import { calcularFrete } from "./16-tabela-de-frete.js";

const tabela = [
  { ate: 1, preco: 15 },
  { ate: 5, preco: 25 },
  { ate: 30, preco: 60 },
];

describe("calcularFrete", () => {
  test("peso dentro da primeira faixa", () => {
    expect(calcularFrete(0.5, tabela)).toBe(15);
  });

  test("peso exatamente no limite ainda pertence à faixa", () => {
    expect(calcularFrete(1, tabela)).toBe(15);
    expect(calcularFrete(5, tabela)).toBe(25);
    expect(calcularFrete(30, tabela)).toBe(60);
  });

  test("peso logo acima do limite vai para a próxima faixa", () => {
    expect(calcularFrete(1.2, tabela)).toBe(25);
    expect(calcularFrete(5.01, tabela)).toBe(60);
  });

  test("funciona com qualquer tabela recebida", () => {
    const outraTabela = [{ ate: 10, preco: 9.9 }];
    expect(calcularFrete(3, outraTabela)).toBe(9.9);
  });

  test("peso zero ou negativo lança erro", () => {
    expect(() => calcularFrete(0, tabela)).toThrow("Peso inválido");
    expect(() => calcularFrete(-2, tabela)).toThrow("Peso inválido");
  });

  test("peso acima da última faixa lança erro", () => {
    expect(() => calcularFrete(31, tabela)).toThrow("Peso acima do limite da tabela");
  });
});
