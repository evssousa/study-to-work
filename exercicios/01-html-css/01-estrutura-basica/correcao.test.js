import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document, html } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

describe("estrutura básica", () => {
  test("começa com <!doctype html>", () => {
    expect(html.trimStart().toLowerCase().startsWith("<!doctype html>")).toBe(true);
  });

  test('a tag <html> tem lang="pt-BR"', () => {
    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR");
  });

  test("declara o charset utf-8", () => {
    const charset = document.querySelector("meta[charset]");
    expect(charset, "Falta <meta charset>").not.toBeNull();
    expect(charset.getAttribute("charset").toLowerCase()).toBe("utf-8");
  });

  test("tem a meta viewport para celulares", () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport, "Falta <meta name=\"viewport\">").not.toBeNull();
    expect(viewport.getAttribute("content")).toContain("width=device-width");
    expect(viewport.getAttribute("content")).toContain("initial-scale=1");
  });

  test('o título da aba é "Meu primeiro site"', () => {
    expect(document.title.trim()).toBe("Meu primeiro site");
  });

  test("tem uma meta description com pelo menos 20 caracteres", () => {
    const descricao = document.querySelector('meta[name="description"]');
    expect(descricao, "Falta <meta name=\"description\">").not.toBeNull();
    expect(descricao.getAttribute("content").trim().length).toBeGreaterThanOrEqual(20);
  });

  test('o <body> tem um <h1> com "Olá, mundo!"', () => {
    expect(document.querySelector("body h1")?.textContent.trim()).toBe("Olá, mundo!");
  });

  test("tem um parágrafo de apresentação", () => {
    const paragrafo = document.querySelector("body p");
    expect(paragrafo, "Falta o <p>").not.toBeNull();
    expect(paragrafo.textContent.trim().length).toBeGreaterThan(10);
  });
});
