import { describe, expect, test } from "vitest";
import * as modulo from "./14-erros.js";

const { sacar, tentarSacar, comRegistro, ValidacaoError, SaldoInsuficienteError } = modulo;

describe("classes de erro", () => {
  test("ValidacaoError é exportada e estende Error", () => {
    expect(typeof ValidacaoError, "Exporte a classe ValidacaoError").toBe("function");
    const erro = new ValidacaoError("valor", "O valor deve ser um número positivo");
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("ValidacaoError");
    expect(erro.campo).toBe("valor");
    expect(erro.message).toBe("O valor deve ser um número positivo");
  });

  test("SaldoInsuficienteError é exportada e guarda saldo e valor", () => {
    expect(typeof SaldoInsuficienteError, "Exporte a classe SaldoInsuficienteError").toBe("function");
    const erro = new SaldoInsuficienteError(100, 250);
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("SaldoInsuficienteError");
    expect(erro.saldo).toBe(100);
    expect(erro.valor).toBe(250);
    expect(erro.message).toBe("Saldo de 100 insuficiente para sacar 250");
  });
});

describe("sacar", () => {
  test("retorna o novo saldo", () => {
    expect(sacar(100, 30)).toBe(70);
    expect(sacar(100, 100)).toBe(0);
  });

  test("valor inválido lança ValidacaoError", () => {
    expect(() => sacar(100, 0)).toThrow(ValidacaoError);
    expect(() => sacar(100, -5)).toThrow(ValidacaoError);
    expect(() => sacar(100, "50")).toThrow(ValidacaoError);
  });

  test("valor acima do saldo lança SaldoInsuficienteError", () => {
    expect(() => sacar(100, 250)).toThrow(SaldoInsuficienteError);
    expect(() => sacar(100, 250)).toThrow("Saldo de 100 insuficiente para sacar 250");
  });
});

describe("tentarSacar", () => {
  test("sucesso", () => {
    expect(tentarSacar(100, 30)).toEqual({ ok: true, saldo: 70 });
  });

  test("erros conhecidos viram objeto com a mensagem", () => {
    expect(tentarSacar(100, 250)).toEqual({ ok: false, erro: "Saldo de 100 insuficiente para sacar 250" });
    expect(tentarSacar(100, -1)).toEqual({ ok: false, erro: "O valor deve ser um número positivo" });
  });

  test("erros desconhecidos (bugs) são lançados de novo", () => {
    const operacaoComBug = () => {
      throw new TypeError("Cannot read properties of undefined");
    };
    expect(() => tentarSacar(100, 10, operacaoComBug)).toThrow(TypeError);
  });
});

describe("comRegistro", () => {
  test("registra início e fim e retorna o resultado", () => {
    const registro = [];
    expect(comRegistro(() => 42, registro)).toBe(42);
    expect(registro).toEqual(["início", "fim"]);
  });

  test("registra o fim mesmo quando dá erro, e o erro continua subindo", () => {
    const registro = [];
    expect(() =>
      comRegistro(() => {
        throw new Error("falhou");
      }, registro),
    ).toThrow("falhou");
    expect(registro).toEqual(["início", "fim"]);
  });
});
