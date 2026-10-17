import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { calcularFrete } from "./frete.js";

const pedido = (sobrescrever = {}) => ({ pesoKg: 0.5, cep: "50000-000", valorDoPedido: 50, ...sobrescrever });

describe("faixas de peso (fronteiras exatas)", () => {
  test("até 1 kg custa 15 (inclusive 1 kg exato)", () => {
    assert.equal(calcularFrete(pedido({ pesoKg: 0.5 })), 15);
    assert.equal(calcularFrete(pedido({ pesoKg: 1 })), 15);
  });

  test("logo acima de 1 kg entra na faixa de 25", () => {
    assert.equal(calcularFrete(pedido({ pesoKg: 1.01 })), 25);
    assert.equal(calcularFrete(pedido({ pesoKg: 5 })), 25);
  });

  test("logo acima de 5 kg entra na faixa de 60, até 30 kg exato", () => {
    assert.equal(calcularFrete(pedido({ pesoKg: 5.01 })), 60);
    assert.equal(calcularFrete(pedido({ pesoKg: 30 })), 60);
  });

  test("acima de 30 kg não é entregue", () => {
    assert.throws(() => calcularFrete(pedido({ pesoKg: 30.01 })), /Peso acima do limite/);
    assert.throws(() => calcularFrete(pedido({ pesoKg: 31 })), /Peso acima do limite/);
    assert.throws(() => calcularFrete(pedido({ pesoKg: 100 })), /Peso acima do limite/);
  });
});

describe("validação do peso", () => {
  test("zero, negativo e não numérico são inválidos", () => {
    assert.throws(() => calcularFrete(pedido({ pesoKg: 0 })), /Peso inválido/);
    assert.throws(() => calcularFrete(pedido({ pesoKg: -1 })), /Peso inválido/);
    assert.throws(() => calcularFrete(pedido({ pesoKg: Number.NaN })), /Peso inválido/);
    assert.throws(() => calcularFrete(pedido({ pesoKg: undefined })), /Peso inválido/);
  });
});

describe("validação do CEP", () => {
  test("aceita com e sem hífen", () => {
    assert.equal(calcularFrete(pedido({ cep: "50000-000" })), 15);
    assert.equal(calcularFrete(pedido({ cep: "50000000" })), 15);
  });

  test("recusa CEP com menos ou mais de 8 dígitos", () => {
    assert.throws(() => calcularFrete(pedido({ cep: "5000000" })), /CEP inválido/);
    assert.throws(() => calcularFrete(pedido({ cep: "500000000" })), /CEP inválido/);
    assert.throws(() => calcularFrete(pedido({ cep: "" })), /CEP inválido/);
    assert.throws(() => calcularFrete(pedido({ cep: "abcdefgh" })), /CEP inválido/);
  });
});

describe("adicional de 20% para regiões distantes", () => {
  test("CEPs começando com 6, 7, 8 e 9 pagam 20% a mais", () => {
    for (const inicio of ["6", "7", "8", "9"]) {
      assert.equal(calcularFrete(pedido({ cep: `${inicio}0000-000`, pesoKg: 0.5 })), 18, `CEP iniciado em ${inicio}`);
    }
  });

  test("CEPs começando com 0 a 5 não pagam adicional", () => {
    for (const inicio of ["0", "1", "2", "3", "4", "5"]) {
      assert.equal(calcularFrete(pedido({ cep: `${inicio}0000-000`, pesoKg: 0.5 })), 15, `CEP iniciado em ${inicio}`);
    }
  });

  test("o adicional vale para as três faixas", () => {
    assert.equal(calcularFrete(pedido({ cep: "60000000", pesoKg: 3 })), 30);
    assert.equal(calcularFrete(pedido({ cep: "60000000", pesoKg: 20 })), 72);
  });
});

describe("frete grátis", () => {
  test("a partir de R$ 200 é grátis, e logo abaixo não é", () => {
    assert.equal(calcularFrete(pedido({ valorDoPedido: 200 })), 0);
    assert.equal(calcularFrete(pedido({ valorDoPedido: 500 })), 0);
    assert.equal(calcularFrete(pedido({ valorDoPedido: 199.99 })), 15);
  });

  test("não vale para peso acima do limite nem para dados inválidos", () => {
    assert.throws(() => calcularFrete(pedido({ valorDoPedido: 500, pesoKg: 40 })), /Peso acima do limite/);
    assert.throws(() => calcularFrete(pedido({ valorDoPedido: 500, cep: "123" })), /CEP inválido/);
  });
});
