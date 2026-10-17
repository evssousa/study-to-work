import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../../suporte/arquivos.js";

const original = lerTexto(caminhoAoLado(import.meta.url, "README.md"));
const texto = original.replace(/<!--[\s\S]*?-->/g, "");
const semBlocosDeCodigo = texto.replace(/```[\s\S]*?```/g, "");

describe("Markdown", () => {
  test("o comentário com o enunciado foi apagado", () => {
    expect(original).not.toContain("Exercício 05");
  });

  test("1. título de nível 1", () => {
    expect(semBlocosDeCodigo).toMatch(/^# Meu ambiente de desenvolvimento\s*$/m);
  });

  test("2. pelo menos dois subtítulos de nível 2", () => {
    expect(semBlocosDeCodigo.match(/^## .+/gm)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  test("3. negrito e itálico", () => {
    expect(semBlocosDeCodigo).toMatch(/\*\*[^*\n]+\*\*/);
    expect(semBlocosDeCodigo.replace(/\*\*[^*\n]+\*\*/g, "")).toMatch(/(\*|_)[^*_\n]+\1/);
  });

  test("4. lista com marcadores (pelo menos 3 itens)", () => {
    expect(semBlocosDeCodigo.match(/^\s*[-*] .+/gm)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  test("5. lista numerada (pelo menos 3 passos)", () => {
    expect(semBlocosDeCodigo.match(/^\s*\d+\. .+/gm)?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  test("6. um link [texto](https://...)", () => {
    expect(semBlocosDeCodigo).toMatch(/\[[^\]]+\]\(https?:\/\/[^)]+\)/);
  });

  test("7. bloco de código com a linguagem indicada", () => {
    expect(texto).toMatch(/^```[a-z]+\s*$[\s\S]*?^```\s*$/m);
  });

  test("8. código dentro de uma frase", () => {
    expect(semBlocosDeCodigo).toMatch(/[^`\n]`[^`\n]+`/);
  });

  test("9. tabela com cabeçalho e pelo menos 2 linhas", () => {
    const linhasDeTabela = semBlocosDeCodigo.split("\n").filter((l) => /^\s*\|.*\|\s*$/.test(l));
    expect(linhasDeTabela.some((l) => /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(l)), "Falta a linha |---|---|").toBe(true);
    expect(linhasDeTabela.length).toBeGreaterThanOrEqual(4);
  });

  test("10. uma citação", () => {
    expect(semBlocosDeCodigo).toMatch(/^> .+/m);
  });
});
