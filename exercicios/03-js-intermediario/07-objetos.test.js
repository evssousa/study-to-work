import { describe, expect, test } from "vitest";
import {
  cidadeDoUsuario,
  contarPalavras,
  criarObjeto,
  filtrarObjeto,
  inverterObjeto,
  maisFrequente,
} from "./07-objetos.js";

describe("objetos", () => {
  test("contarPalavras: conta em minúsculas", () => {
    expect(contarPalavras("O gato e o rato")).toEqual({ o: 2, gato: 1, e: 1, rato: 1 });
  });

  test("contarPalavras: ignora espaços repetidos e nas pontas", () => {
    expect(contarPalavras("  sol   SOL lua ")).toEqual({ sol: 2, lua: 1 });
  });

  test("contarPalavras: texto vazio dá objeto vazio", () => {
    expect(contarPalavras("")).toEqual({});
  });

  test("maisFrequente", () => {
    expect(maisFrequente({ o: 2, gato: 1, rato: 5 })).toBe("rato");
    expect(maisFrequente({})).toBeNull();
  });

  test("inverterObjeto", () => {
    expect(inverterObjeto({ a: "x", b: "y" })).toEqual({ x: "a", y: "b" });
  });

  test("filtrarObjeto: a condição recebe (valor, chave)", () => {
    expect(filtrarObjeto({ ana: 8, bia: 5, caio: 7 }, (nota) => nota >= 7)).toEqual({ ana: 8, caio: 7 });
    expect(filtrarObjeto({ ana: 8, bia: 5 }, (_nota, nome) => nome.startsWith("b"))).toEqual({ bia: 5 });
  });

  test("filtrarObjeto: não altera o original", () => {
    const notas = { ana: 8, bia: 5 };
    filtrarObjeto(notas, () => false);
    expect(notas).toEqual({ ana: 8, bia: 5 });
  });

  test("criarObjeto: chave dinâmica", () => {
    expect(criarObjeto("email", "a@b.com")).toEqual({ email: "a@b.com" });
    expect(criarObjeto("idade", 30)).toEqual({ idade: 30 });
  });

  test("cidadeDoUsuario: lê a cidade quando existe", () => {
    expect(cidadeDoUsuario({ nome: "Ana", endereco: { cidade: "Recife" } })).toBe("Recife");
  });

  test("cidadeDoUsuario: não quebra quando falta alguma parte", () => {
    expect(cidadeDoUsuario({ nome: "Ana" })).toBe("não informada");
    expect(cidadeDoUsuario({ nome: "Ana", endereco: {} })).toBe("não informada");
    expect(cidadeDoUsuario(undefined)).toBe("não informada");
    expect(cidadeDoUsuario(null)).toBe("não informada");
  });
});
