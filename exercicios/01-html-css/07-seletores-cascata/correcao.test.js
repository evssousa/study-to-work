import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, listarRegras, normalizarValor, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade) => valorCSS(document, seletor, propriedade);

describe("seletores e cascata", () => {
  test("1. body sem margem e com uma fonte definida", () => {
    expect(css("body", "margin")).toMatch(/^0(px)?$/);
    expect(css("body", "font-family")).not.toBe("");
  });

  test("2. h1 e h2 em uma única regra agrupada, com a cor #4b2e1e", () => {
    const agrupada = listarRegras(document).find((r) => {
      const seletores = r.seletor.split(", ");
      return seletores.includes("h1") && seletores.includes("h2");
    });
    expect(agrupada, "Use um seletor agrupado: h1, h2 { ... }").toBeDefined();
    expect(agrupada.estilo.getPropertyValue("color")).toBe(normalizarValor("color", "#4b2e1e"));
  });

  test("3. links do nav sem sublinhado", () => {
    expect(css("nav a", "text-decoration")).toBe("none");
  });

  test("4. links do nav sublinhados no hover", () => {
    expect(css("nav a:hover", "text-decoration")).toBe("underline");
  });

  test("5. .cardapio > li tem padding", () => {
    expect(css(".cardapio > li", "padding") || css(".cardapio > li", "padding-top")).not.toBe("");
  });

  test("6. .preco em negrito", () => {
    expect(["bold", "700"]).toContain(css(".preco", "font-weight"));
  });

  test("7. .destaque com fundo #fff3cd", () => {
    const fundo = css(".destaque", "background-color") || css(".destaque", "background");
    expect(fundo).toBe(normalizarValor("background-color", "#fff3cd"));
  });

  test("8. .destaque .preco com a cor #b00020", () => {
    expect(css(".destaque .preco", "color")).toBe(normalizarValor("color", "#b00020"));
  });
});
