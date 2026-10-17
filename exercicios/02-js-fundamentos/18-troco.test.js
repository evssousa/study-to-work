import { describe, expect, test } from "vitest";
import { calcularTroco } from "./18-troco.js";

describe("calcularTroco", () => {
  test("pagamento exato não tem troco", () => {
    expect(calcularTroco(50, 50)).toEqual([]);
  });

  test("troco de 37,65 (compra de 12,35 paga com 50)", () => {
    expect(calcularTroco(12.35, 50)).toEqual([
      { valor: 20, quantidade: 1 },
      { valor: 10, quantidade: 1 },
      { valor: 5, quantidade: 1 },
      { valor: 2, quantidade: 1 },
      { valor: 0.5, quantidade: 1 },
      { valor: 0.1, quantidade: 1 },
      { valor: 0.05, quantidade: 1 },
    ]);
  });

  test("usa várias cédulas iguais quando preciso: troco de 600", () => {
    expect(calcularTroco(400, 1000)).toEqual([
      { valor: 200, quantidade: 3 },
    ]);
  });

  test("troco de 0,03 em moedas de 1 centavo", () => {
    expect(calcularTroco(9.97, 10)).toEqual([{ valor: 0.01, quantidade: 3 }]);
  });

  test("não erra por causa de casas decimais: troco de 0,30", () => {
    expect(calcularTroco(0.7, 1)).toEqual([
      { valor: 0.25, quantidade: 1 },
      { valor: 0.05, quantidade: 1 },
    ]);
  });

  test("valor pago insuficiente lança erro", () => {
    expect(() => calcularTroco(100, 50)).toThrow("Valor pago insuficiente");
  });
});
