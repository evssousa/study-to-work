import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

function proximoElementoDepoisDoTitulo(texto) {
  const titulo = [...document.querySelectorAll("h2")].find((h2) => h2.textContent.trim() === texto);
  return titulo?.nextElementSibling ?? null;
}

describe("página de receita", () => {
  test('tem lang="pt-BR", charset e title', () => {
    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR");
    expect(document.querySelector("meta[charset]")).not.toBeNull();
    expect(document.title.trim()).not.toBe("");
  });

  test("tem um único <h1> com o nome da receita", () => {
    const titulos = document.querySelectorAll("h1");
    expect(titulos).toHaveLength(1);
    expect(titulos[0].textContent.trim()).not.toBe("");
  });

  test("a imagem tem src e um alt descritivo (pelo menos 10 caracteres)", () => {
    const imagem = document.querySelector("img");
    expect(imagem, "Falta a <img>").not.toBeNull();
    expect(imagem.getAttribute("src")).toBeTruthy();
    expect(imagem.getAttribute("alt")?.trim().length ?? 0).toBeGreaterThanOrEqual(10);
  });

  test('"Ingredientes" é seguido de uma <ul> com pelo menos 3 itens', () => {
    const lista = proximoElementoDepoisDoTitulo("Ingredientes");
    expect(lista?.tagName, 'Coloque a <ul> logo depois do <h2>Ingredientes</h2>').toBe("UL");
    expect(lista.querySelectorAll("li").length).toBeGreaterThanOrEqual(3);
  });

  test('"Modo de preparo" é seguido de uma <ol> com pelo menos 3 passos', () => {
    const lista = proximoElementoDepoisDoTitulo("Modo de preparo");
    expect(lista?.tagName, 'Coloque a <ol> logo depois do <h2>Modo de preparo</h2>').toBe("OL");
    expect(lista.querySelectorAll("li").length).toBeGreaterThanOrEqual(3);
  });

  test("usa <strong> para destacar algo importante", () => {
    expect(document.querySelector("strong")).not.toBeNull();
  });

  test("o link da fonte abre em nova aba com segurança", () => {
    const link = document.querySelector('a[target="_blank"]');
    expect(link, 'Falta um <a target="_blank">').not.toBeNull();
    expect(link.getAttribute("href")).toMatch(/^https?:\/\//);
    const rel = link.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });
});
