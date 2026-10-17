import { describe, expect, test } from "vitest";
import { analisarVersao, compararVersoes, proximaVersao, satisfaz } from "./01-semver.js";

describe("analisarVersao", () => {
  test("versões comuns, com números de verdade", () => {
    expect(analisarVersao("1.2.3")).toEqual({ maior: 1, menor: 2, patch: 3, preLancamento: null });
    expect(analisarVersao("0.0.1")).toEqual({ maior: 0, menor: 0, patch: 1, preLancamento: null });
    expect(analisarVersao("10.20.30")).toEqual({ maior: 10, menor: 20, patch: 30, preLancamento: null });
  });

  test("aceita o v na frente e pré-lançamento", () => {
    expect(analisarVersao("v2.0.1")).toEqual({ maior: 2, menor: 0, patch: 1, preLancamento: null });
    expect(analisarVersao("1.0.0-beta.2")).toEqual({ maior: 1, menor: 0, patch: 0, preLancamento: "beta.2" });
    expect(analisarVersao("1.0.0-rc.1").preLancamento).toBe("rc.1");
  });

  test.each(["1.2", "abc", "1.2.3.4", "1.02.3", "01.2.3", "1.2.x", "", " 1.2.3", "1.2.3-"])("inválida: '%s'", (texto) => {
    expect(() => analisarVersao(texto)).toThrow(`Versão inválida: ${texto}`);
  });
});

describe("compararVersoes", () => {
  test.each([
    ["1.2.3", "1.2.3", 0],
    ["1.2.3", "1.2.4", -1],
    ["1.2.4", "1.2.3", 1],
    ["1.3.0", "1.2.9", 1],
    ["2.0.0", "1.99.99", 1],
    ["1.10.0", "1.9.0", 1],
    ["0.9.0", "0.10.0", -1],
  ])("%s vs %s → %i", (a, b, esperado) => {
    expect(compararVersoes(a, b)).toBe(esperado);
  });

  test("versão final é maior que o pré-lançamento dela", () => {
    expect(compararVersoes("1.0.0", "1.0.0-rc.1")).toBe(1);
    expect(compararVersoes("1.0.0-rc.1", "1.0.0")).toBe(-1);
    expect(compararVersoes("1.0.0-rc.1", "0.9.9")).toBe(1);
  });

  test("a ordem OFICIAL dos pré-lançamentos", () => {
    const ordenadas = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
    ];
    for (let i = 0; i < ordenadas.length - 1; i++) {
      expect(compararVersoes(ordenadas[i], ordenadas[i + 1]), `${ordenadas[i]} < ${ordenadas[i + 1]}`).toBe(-1);
      expect(compararVersoes(ordenadas[i + 1], ordenadas[i])).toBe(1);
    }
  });

  test("serve para ordenar uma lista", () => {
    const lista = ["1.10.0", "1.2.0", "1.2.0-beta", "0.9.5", "2.0.0"];
    expect(lista.toSorted(compararVersoes)).toEqual(["0.9.5", "1.2.0-beta", "1.2.0", "1.10.0", "2.0.0"]);
  });
});

describe("satisfaz", () => {
  test("versão exata e qualquer versão", () => {
    expect(satisfaz("1.2.3", "1.2.3")).toBe(true);
    expect(satisfaz("1.2.4", "1.2.3")).toBe(false);
    expect(satisfaz("9.9.9", "*")).toBe(true);
  });

  test("comparações", () => {
    expect(satisfaz("1.2.0", ">=1.2.0")).toBe(true);
    expect(satisfaz("1.1.9", ">=1.2.0")).toBe(false);
    expect(satisfaz("1.2.0", ">1.2.0")).toBe(false);
    expect(satisfaz("1.2.1", ">1.2.0")).toBe(true);
    expect(satisfaz("2.0.0", "<=2.0.0")).toBe(true);
    expect(satisfaz("2.0.1", "<=2.0.0")).toBe(false);
    expect(satisfaz("1.9.9", "<2.0.0")).toBe(true);
    expect(satisfaz("2.0.0", "<2.0.0")).toBe(false);
  });

  test("^ aceita até o próximo MAIOR", () => {
    expect(satisfaz("1.2.3", "^1.2.3")).toBe(true);
    expect(satisfaz("1.9.0", "^1.2.3")).toBe(true);
    expect(satisfaz("1.2.2", "^1.2.3")).toBe(false);
    expect(satisfaz("2.0.0", "^1.2.3")).toBe(false);
  });

  test("^ com maior 0 é mais rígido", () => {
    expect(satisfaz("0.2.9", "^0.2.3")).toBe(true);
    expect(satisfaz("0.3.0", "^0.2.3")).toBe(false);
    expect(satisfaz("0.0.3", "^0.0.3")).toBe(true);
    expect(satisfaz("0.0.4", "^0.0.3")).toBe(false);
  });

  test("~ aceita até o próximo MENOR", () => {
    expect(satisfaz("1.2.3", "~1.2.3")).toBe(true);
    expect(satisfaz("1.2.9", "~1.2.3")).toBe(true);
    expect(satisfaz("1.3.0", "~1.2.3")).toBe(false);
    expect(satisfaz("1.2.2", "~1.2.3")).toBe(false);
  });

  test("pré-lançamento só entra quando o intervalo é exatamente ele", () => {
    expect(satisfaz("2.0.0-beta.1", "^1.2.3")).toBe(false);
    expect(satisfaz("1.5.0-rc.1", "^1.2.3")).toBe(false);
    expect(satisfaz("1.5.0-rc.1", ">=1.0.0")).toBe(false);
    expect(satisfaz("1.5.0-rc.1", "*")).toBe(false);
    expect(satisfaz("1.5.0-rc.1", "1.5.0-rc.1")).toBe(true);
  });

  test("intervalo ou versão que não se entende", () => {
    expect(() => satisfaz("1.2.3", "banana")).toThrow("Intervalo inválido: banana");
    expect(() => satisfaz("1.2.3", "^1.2")).toThrow("Intervalo inválido: ^1.2");
    expect(() => satisfaz("1.2", "^1.0.0")).toThrow("Versão inválida: 1.2");
  });
});

describe("proximaVersao", () => {
  test.each([
    ["1.2.3", "patch", "1.2.4"],
    ["1.2.3", "menor", "1.3.0"],
    ["1.2.3", "maior", "2.0.0"],
    ["0.9.9", "patch", "0.9.10"],
    ["1.9.9", "menor", "1.10.0"],
    ["9.9.9", "maior", "10.0.0"],
  ])("%s + %s → %s", (atual, tipo, esperado) => {
    expect(proximaVersao(atual, tipo)).toBe(esperado);
  });

  test("descarta o pré-lançamento e aceita o v", () => {
    expect(proximaVersao("1.2.3-beta.1", "patch")).toBe("1.2.4");
    expect(proximaVersao("v1.2.3", "menor")).toBe("1.3.0");
  });

  test("tipo ou versão inválidos", () => {
    expect(() => proximaVersao("1.2.3", "gigante")).toThrow("Tipo de versão inválido: gigante");
    expect(() => proximaVersao("abc", "patch")).toThrow("Versão inválida: abc");
  });
});
