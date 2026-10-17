import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { aplicarATodos, aplicarDuasVezes, contarSe, executarVezes } from "./01-funcoes-como-valores.js";

describe("aplicarATodos", () => {
  test("aplica a função a cada número", () => {
    expect(aplicarATodos([1, 2, 3], (n) => n * 10)).toEqual([10, 20, 30]);
  });

  test("funciona com qualquer função recebida", () => {
    expect(aplicarATodos([4, 9], Math.sqrt)).toEqual([2, 3]);
    expect(aplicarATodos([1.4, 1.6], Math.round)).toEqual([1, 2]);
  });

  test("retorna um array novo e não altera o original", () => {
    const original = [1, 2];
    const resultado = aplicarATodos(original, (n) => n + 1);
    expect(resultado).not.toBe(original);
    expect(original).toEqual([1, 2]);
  });

  test("não usa .map (o objetivo é entender o que ele faz por dentro)", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "01-funcoes-como-valores.js"));
    expect(codigo.replace(/\/\*[\s\S]*?\*\//g, "")).not.toContain(".map(");
  });
});

describe("contarSe", () => {
  test("conta os itens que passam na condição", () => {
    expect(contarSe([3, 8, 12, 1], (n) => n > 5)).toBe(2);
  });

  test("funciona com strings", () => {
    expect(contarSe(["ana", "bruno", "alice"], (nome) => nome.startsWith("a"))).toBe(2);
  });

  test("lista vazia conta 0", () => {
    expect(contarSe([], () => true)).toBe(0);
  });
});

describe("executarVezes", () => {
  test("chama a ação com 0, 1, 2... e junta os resultados", () => {
    expect(executarVezes(3, (i) => i * i)).toEqual([0, 1, 4]);
  });

  test("zero vezes retorna array vazio", () => {
    expect(executarVezes(0, (i) => i)).toEqual([]);
  });
});

describe("aplicarDuasVezes", () => {
  test("aplica a função no resultado dela mesma", () => {
    expect(aplicarDuasVezes((n) => n + 3, 10)).toBe(16);
    expect(aplicarDuasVezes((texto) => `${texto}!`, "oi")).toBe("oi!!");
  });
});
