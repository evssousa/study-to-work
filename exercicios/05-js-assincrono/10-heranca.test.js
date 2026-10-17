import { describe, expect, test } from "vitest";
import * as modulo from "./10-heranca.js";

const { Conta, ContaPoupanca, ContaCorrente, Banco, sacarDeTodas } = modulo;

describe("Conta", () => {
  test("depositar, sacar e extrato", () => {
    expect(typeof Conta, "Exporte a classe Conta").toBe("function");
    const conta = new Conta("Ana");
    expect(conta.titular).toBe("Ana");
    expect(conta.saldo).toBe(0);
    expect(conta.depositar(10000)).toBe(conta);
    conta.sacar(2500);
    expect(conta.saldo).toBe(7500);
    expect(conta.extrato).toEqual([
      { tipo: "deposito", valorCentavos: 10000 },
      { tipo: "saque", valorCentavos: 2500 },
    ]);
  });

  test("valores inválidos e saldo insuficiente", () => {
    const conta = new Conta("Ana").depositar(1000);
    for (const invalido of [0, -5, 10.5, "10"]) {
      expect(() => conta.depositar(invalido)).toThrow("Valor inválido");
      expect(() => conta.sacar(invalido)).toThrow("Valor inválido");
    }
    expect(() => conta.sacar(1001)).toThrow("Saldo insuficiente");
    expect(conta.saldo).toBe(1000);
    expect(conta.extrato).toHaveLength(1);
  });

  test("o saldo é privado e o extrato é uma cópia", () => {
    const conta = new Conta("Ana").depositar(100);
    expect(() => {
      conta.saldo = 999999;
    }).toThrow();
    expect(conta.saldo).toBe(100);
    conta.extrato.push({ tipo: "deposito", valorCentavos: 1 });
    expect(conta.extrato).toHaveLength(1);
  });

  test("tipo e descrever", () => {
    const conta = new Conta("Ana").depositar(500);
    expect(conta.tipo).toBe("Conta");
    expect(conta.descrever()).toBe("Conta de Ana: saldo de 500 centavos");
  });

  test("totalDeContas conta todas as criadas, de qualquer tipo", () => {
    const antes = Conta.totalDeContas;
    new Conta("A");
    new ContaPoupanca("B", 0.01);
    new ContaCorrente("C", 100);
    expect(Conta.totalDeContas).toBe(antes + 3);
  });
});

describe("ContaPoupanca", () => {
  test("é uma Conta, com tipo próprio", () => {
    expect(typeof ContaPoupanca, "Exporte a classe ContaPoupanca").toBe("function");
    const poupanca = new ContaPoupanca("Bia", 0.01);
    expect(poupanca).toBeInstanceOf(Conta);
    expect(poupanca.tipo).toBe("Poupança");
    expect(poupanca.titular).toBe("Bia");
    expect(poupanca.descrever()).toBe("Poupança de Bia: saldo de 0 centavos");
  });

  test("renderJuros deposita o juros arredondado e encadeia", () => {
    const poupanca = new ContaPoupanca("Bia", 0.01).depositar(10050);
    expect(poupanca.renderJuros()).toBe(poupanca);
    expect(poupanca.saldo).toBe(10151); // 100,50 + 1,005 → juros 101 centavos
    expect(poupanca.extrato.at(-1)).toEqual({ tipo: "deposito", valorCentavos: 101 });
  });

  test("juros de saldo zero não registra operação", () => {
    const poupanca = new ContaPoupanca("Bia", 0.01).renderJuros();
    expect(poupanca.extrato).toEqual([]);
  });

  test("continua não podendo ficar negativa", () => {
    const poupanca = new ContaPoupanca("Bia", 0.01).depositar(100);
    expect(() => poupanca.sacar(101)).toThrow("Saldo insuficiente");
  });
});

describe("ContaCorrente", () => {
  test("pode usar o cheque especial até o limite", () => {
    expect(typeof ContaCorrente, "Exporte a classe ContaCorrente").toBe("function");
    const corrente = new ContaCorrente("Caio", 50000).depositar(10000);
    expect(corrente).toBeInstanceOf(Conta);
    expect(corrente.tipo).toBe("Conta corrente");
    corrente.sacar(60000);
    expect(corrente.saldo).toBe(-50000);
    expect(() => corrente.sacar(1)).toThrow("Saldo insuficiente");
  });

  test("limite zero se comporta como Conta comum", () => {
    const corrente = new ContaCorrente("Caio", 0).depositar(100);
    expect(() => corrente.sacar(101)).toThrow("Saldo insuficiente");
  });
});

describe("polimorfismo", () => {
  test("sacarDeTodas funciona com tipos variados sem perguntar o tipo", () => {
    const contas = [
      new Conta("Ana").depositar(10000),
      new ContaPoupanca("Bruno", 0.01).depositar(500),
      new ContaCorrente("Carla", 20000),
    ];
    expect(sacarDeTodas(contas, 1000)).toEqual([
      "Ana (Conta): ok",
      "Bruno (Poupança): Saldo insuficiente",
      "Carla (Conta corrente): ok",
    ]);
    expect(contas[2].saldo).toBe(-1000);
  });

  test("a função não usa instanceof nem compara tipos", async () => {
    const { readFileSync } = await import("node:fs");
    const { caminhoAoLado } = await import("../../suporte/arquivos.js");
    const codigo = readFileSync(caminhoAoLado(import.meta.url, "10-heranca.js"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "");
    const corpo = codigo.slice(codigo.indexOf("function sacarDeTodas"));
    expect(corpo.split("\nexport ")[0]).not.toMatch(/instanceof|\.tipo\s*===|\.tipo\s*==/);
  });
});

describe("Banco (composição)", () => {
  test("guarda contas e calcula o patrimônio", () => {
    expect(typeof Banco, "Exporte a classe Banco").toBe("function");
    const banco = new Banco();
    const ana = banco.abrir(new Conta("Ana").depositar(10000));
    banco.abrir(new ContaPoupanca("Ana", 0.01).depositar(5000));
    banco.abrir(new ContaCorrente("Bruno", 10000).depositar(1000).sacar(3000));
    expect(ana).toBeInstanceOf(Conta);
    expect(banco.contas).toHaveLength(3);
    expect(banco.patrimonioCentavos).toBe(10000 + 5000 + (1000 - 3000));
  });

  test("buscarPorTitular", () => {
    const banco = new Banco();
    banco.abrir(new Conta("Ana"));
    banco.abrir(new ContaPoupanca("Ana", 0.01));
    banco.abrir(new Conta("Bruno"));
    expect(banco.buscarPorTitular("Ana").map((c) => c.tipo)).toEqual(["Conta", "Poupança"]);
    expect(banco.buscarPorTitular("Zé")).toEqual([]);
  });

  test("contas é uma cópia", () => {
    const banco = new Banco();
    banco.abrir(new Conta("Ana"));
    banco.contas.push("lixo");
    expect(banco.contas).toHaveLength(1);
  });
});
