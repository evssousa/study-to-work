import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import {
  formatarContato,
  juntarConfiguracoes,
  maiorDeTodos,
  primeiroEResto,
  somarTodos,
  trocar,
} from "./09-desestruturacao.js";

const codigo = () => lerTexto(caminhoAoLado(import.meta.url, "09-desestruturacao.js"));

describe("formatarContato", () => {
  test("com todos os dados", () => {
    expect(formatarContato({ nome: "Ana", telefone: "81 99999-0000", endereco: { cidade: "Recife" } })).toBe(
      "Ana (Recife) — 81 99999-0000",
    );
  });

  test("sem telefone e sem endereço", () => {
    expect(formatarContato({ nome: "Bia" })).toBe("Bia (cidade não informada) — sem telefone");
  });

  test("com endereço mas sem cidade", () => {
    expect(formatarContato({ nome: "Caio", endereco: { uf: "PE" } })).toBe("Caio (cidade não informada) — sem telefone");
  });

  test("usa desestruturação no parâmetro", () => {
    expect(codigo()).toMatch(/function formatarContato\(\s*\{/);
  });
});

describe("arrays", () => {
  test("primeiroEResto", () => {
    expect(primeiroEResto([10, 20, 30])).toEqual({ primeiro: 10, resto: [20, 30] });
    expect(primeiroEResto([5])).toEqual({ primeiro: 5, resto: [] });
  });

  test("trocar", () => {
    expect(trocar([1, 2])).toEqual([2, 1]);
    expect(trocar(["a", "b"])).toEqual(["b", "a"]);
  });
});

describe("rest e spread", () => {
  test("somarTodos aceita qualquer quantidade de números", () => {
    expect(somarTodos(1, 2, 3)).toBe(6);
    expect(somarTodos(10)).toBe(10);
    expect(somarTodos()).toBe(0);
  });

  test("maiorDeTodos", () => {
    expect(maiorDeTodos(3, 99, 7)).toBe(99);
    expect(maiorDeTodos()).toBeNull();
  });

  test("maiorDeTodos usa Math.max com spread", () => {
    expect(codigo()).toMatch(/Math\.max\(\s*\.\.\./);
  });

  test("juntarConfiguracoes: o usuário sobrescreve o padrão", () => {
    const padrao = { tema: "claro", idioma: "pt", notificacoes: true };
    const doUsuario = { tema: "escuro" };
    expect(juntarConfiguracoes(padrao, doUsuario)).toEqual({ tema: "escuro", idioma: "pt", notificacoes: true });
    expect(padrao.tema).toBe("claro");
    expect(doUsuario).toEqual({ tema: "escuro" });
  });
});
