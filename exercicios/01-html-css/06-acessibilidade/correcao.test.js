import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));

describe("acessibilidade corrigida", () => {
  test("1. a página declara o idioma pt-BR", () => {
    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR");
  });

  test("2. todas as imagens têm alt", () => {
    const imagens = document.querySelectorAll("img");
    expect(imagens.length).toBeGreaterThan(0);
    for (const imagem of imagens) expect(imagem.hasAttribute("alt")).toBe(true);
  });

  test('3. "Comprar" é um <button> e nenhuma outra tag usa onclick', () => {
    const comprar = [...document.querySelectorAll("body *")].find(
      (el) => el.children.length === 0 && el.textContent.trim() === "Comprar",
    );
    expect(comprar?.tagName).toBe("BUTTON");
    for (const el of document.querySelectorAll("[onclick]")) {
      expect(el.tagName, "Só botões devem reagir a cliques").toBe("BUTTON");
    }
  });

  test("4. o campo de e-mail é type=email e tem <label> ligado a ele", () => {
    const campo = document.querySelector("input");
    expect(campo.getAttribute("type")).toBe("email");
    const id = campo.getAttribute("id");
    expect(id, "Dê um id ao campo").toBeTruthy();
    expect(document.querySelector(`label[for="${id}"]`)).not.toBeNull();
  });

  test('5. nenhum link usa textos genéricos como "clique aqui" ou "saiba mais"', () => {
    for (const link of document.querySelectorAll("a")) {
      const texto = link.textContent.trim().toLowerCase();
      expect(texto).not.toMatch(/^(clique aqui|aqui|saiba mais|leia mais|clique)$/);
      expect(texto.length).toBeGreaterThan(5);
    }
  });

  test('6. existe um <h1> e "Promoções" é um <h2>', () => {
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    const promocoes = [...document.querySelectorAll("h1, h2, h3")].find((h) => h.textContent.trim() === "Promoções");
    expect(promocoes?.tagName).toBe("H2");
    expect(document.querySelector("h3")).toBeNull();
  });

  test("7. usa <header> e <main> no lugar das divs", () => {
    expect(document.querySelector("header")).not.toBeNull();
    expect(document.querySelector("main")).not.toBeNull();
    expect(document.querySelector("main button")).not.toBeNull();
  });
});
