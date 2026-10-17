import { describe, expect, test, vi } from "vitest";
import { criarContador, criarGeradorDeId, criarMultiplicador, executarUmaVez } from "./11-closures.js";

describe("criarContador", () => {
  test("incrementa, decrementa e informa o valor", () => {
    const contador = criarContador();
    expect(contador.incrementar()).toBe(1);
    expect(contador.incrementar()).toBe(2);
    expect(contador.decrementar()).toBe(1);
    expect(contador.valor()).toBe(1);
  });

  test("aceita um valor inicial e reseta para ele", () => {
    const contador = criarContador(10);
    contador.incrementar();
    contador.incrementar();
    expect(contador.resetar()).toBe(10);
    expect(contador.valor()).toBe(10);
  });

  test("o valor é privado: não existe uma propriedade com o número", () => {
    const contador = criarContador(5);
    const valoresNumericos = Object.values(contador).filter((v) => typeof v === "number");
    expect(valoresNumericos).toEqual([]);
  });

  test("cada contador é independente", () => {
    const a = criarContador();
    const b = criarContador();
    a.incrementar();
    a.incrementar();
    expect(b.valor()).toBe(0);
  });
});

describe("criarGeradorDeId", () => {
  test("gera ids em sequência com o prefixo", () => {
    const proximoId = criarGeradorDeId("pedido");
    expect(proximoId()).toBe("pedido-1");
    expect(proximoId()).toBe("pedido-2");
    expect(proximoId()).toBe("pedido-3");
  });

  test("geradores diferentes têm sequências diferentes", () => {
    const pedidos = criarGeradorDeId("pedido");
    const clientes = criarGeradorDeId("cliente");
    pedidos();
    pedidos();
    expect(clientes()).toBe("cliente-1");
  });
});

describe("executarUmaVez", () => {
  test("executa só na primeira chamada e repete o resultado", () => {
    const inicializar = vi.fn(() => "conectado");
    const conectar = executarUmaVez(inicializar);
    expect(conectar()).toBe("conectado");
    expect(conectar()).toBe("conectado");
    expect(conectar()).toBe("conectado");
    expect(inicializar).toHaveBeenCalledTimes(1);
  });

  test("repassa os argumentos da primeira chamada", () => {
    const somar = executarUmaVez((a, b) => a + b);
    expect(somar(2, 3)).toBe(5);
    expect(somar(100, 100)).toBe(5);
  });
});

describe("criarMultiplicador", () => {
  test("cria funções especializadas", () => {
    const dobro = criarMultiplicador(2);
    const triplo = criarMultiplicador(3);
    expect(dobro(21)).toBe(42);
    expect(triplo(5)).toBe(15);
  });
});
