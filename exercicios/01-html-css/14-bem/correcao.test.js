import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, listarRegras } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

const PALAVRA = "[a-z0-9]+(-[a-z0-9]+)*";
const CLASSE_BEM = new RegExp(`^${PALAVRA}(__${PALAVRA})?(--${PALAVRA})?$`);

describe("componente com BEM", () => {
  test("o index.html liga o estilo.css", () => {
    expect(document.querySelector('link[rel="stylesheet"][href="estilo.css"]')).not.toBeNull();
  });

  test("existem dois cartões .produto", () => {
    expect(document.querySelectorAll("article.produto")).toHaveLength(2);
  });

  test.each([
    ["img", "produto__imagem"],
    ["h2", "produto__nome"],
    ["p", "produto__preco"],
    ["button", "produto__botao"],
  ])("cada cartão tem um <%s class=\"%s\">", (tag, classe) => {
    for (const cartao of document.querySelectorAll("article.produto")) {
      expect(cartao.querySelector(`${tag}.${classe}`)).not.toBeNull();
    }
  });

  test("as imagens têm alt", () => {
    for (const imagem of document.querySelectorAll(".produto__imagem")) {
      expect(imagem.getAttribute("alt")?.trim()).toBeTruthy();
    }
  });

  test("o segundo cartão tem o modificador produto--promocao (junto com a classe base)", () => {
    const segundo = document.querySelectorAll("article.produto")[1];
    expect(segundo.classList.contains("produto--promocao")).toBe(true);
    const preco = segundo.querySelector(".produto__preco");
    expect(preco.classList.contains("produto__preco--promocao")).toBe(true);
  });

  test("todas as classes seguem o padrão BEM (minúsculas e hífens)", () => {
    for (const elemento of document.querySelectorAll("body [class]")) {
      for (const classe of elemento.classList) {
        expect(classe, `A classe "${classe}" não segue o BEM`).toMatch(CLASSE_BEM);
      }
    }
  });

  test("quem tem modificador também tem a classe base", () => {
    for (const elemento of document.querySelectorAll("body [class]")) {
      for (const classe of elemento.classList) {
        if (!classe.includes("--")) continue;
        const base = classe.split("--")[0];
        expect(elemento.classList.contains(base), `"${classe}" precisa vir junto com "${base}"`).toBe(true);
      }
    }
  });

  test.each([
    ".produto",
    ".produto__nome",
    ".produto__preco",
    ".produto__botao",
    ".produto--promocao",
    ".produto__preco--promocao",
  ])("o CSS tem uma regra para %s", (seletor) => {
    const regras = listarRegras(document).filter((r) => r.seletor.split(", ").includes(seletor));
    expect(regras.length).toBeGreaterThan(0);
  });

  test("cada seletor usa uma classe só, sem aninhar (BEM é \"plano\")", () => {
    for (const regra of listarRegras(document)) {
      for (const seletor of regra.seletor.split(", ")) {
        const semPseudo = seletor.replace(/::?[a-z-]+(\([^)]*\))?/g, "");
        expect(semPseudo, `Seletor "${seletor}" está aninhado`).toMatch(/^\.[a-z0-9_-]+$/);
      }
    }
  });
});
