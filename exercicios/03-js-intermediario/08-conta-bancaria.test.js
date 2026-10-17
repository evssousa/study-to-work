import { describe, expect, test } from "vitest";
import { criarConta } from "./08-conta-bancaria.js";

describe("conta bancária", () => {
  test("começa com saldo 0 e histórico vazio", () => {
    const conta = criarConta("Ana");
    expect(conta.titular).toBe("Ana");
    expect(conta.saldo).toBe(0);
    expect(conta.historico).toEqual([]);
  });

  test("depositar soma ao saldo e registra no histórico", () => {
    const conta = criarConta("Ana");
    conta.depositar(100);
    expect(conta.saldo).toBe(100);
    expect(conta.historico).toEqual([{ tipo: "deposito", valor: 100 }]);
  });

  test("sacar subtrai do saldo e registra no histórico", () => {
    const conta = criarConta("Ana");
    conta.depositar(100);
    conta.sacar(30);
    expect(conta.saldo).toBe(70);
    expect(conta.historico[1]).toEqual({ tipo: "saque", valor: 30 });
  });

  test("permite encadear: depositar e sacar retornam a própria conta", () => {
    const conta = criarConta("Ana");
    expect(conta.depositar(50)).toBe(conta);
    expect(conta.depositar(100).sacar(30).resumo()).toBe("Ana: saldo de 120 em 3 operações");
  });

  test("valores inválidos lançam erro", () => {
    const conta = criarConta("Ana");
    expect(() => conta.depositar(0)).toThrow("Valor inválido");
    expect(() => conta.depositar(-10)).toThrow("Valor inválido");
    expect(() => conta.sacar(-1)).toThrow("Valor inválido");
  });

  test("não deixa sacar mais que o saldo (e não altera nada)", () => {
    const conta = criarConta("Bia").depositar(20);
    expect(() => conta.sacar(50)).toThrow("Saldo insuficiente");
    expect(conta.saldo).toBe(20);
    expect(conta.historico).toHaveLength(1);
  });

  test("cada conta é independente", () => {
    const ana = criarConta("Ana").depositar(10);
    const bia = criarConta("Bia");
    expect(bia.saldo).toBe(0);
    expect(ana.saldo).toBe(10);
  });

  test("os métodos usam this (funcionam mesmo se o saldo for alterado por fora)", () => {
    const conta = criarConta("Caio");
    conta.saldo = 500;
    conta.sacar(100);
    expect(conta.saldo).toBe(400);
  });
});
