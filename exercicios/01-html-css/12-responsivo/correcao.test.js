import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, listarMedias, mesmoValorCSS, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade, media = null) => valorCSS(document, seletor, propriedade, { media });

describe("responsividade mobile first", () => {
  test("1. imagens fluidas", () => {
    expect(css("img", "max-width")).toBe("100%");
    expect(css("img", "height")).toBe("auto");
  });

  test("2. .container centralizado com largura máxima", () => {
    expect(css(".container", "max-width")).toBe("1200px");
    expect(css(".container", "margin-left")).toBe("auto");
    expect(css(".container", "margin-right")).toBe("auto");
    expect(css(".container", "padding-left")).not.toBe("");
  });

  test("3. no celular, .cards tem 1 coluna", () => {
    expect(css(".cards", "display")).toBe("grid");
    expect(mesmoValorCSS(css(".cards", "grid-template-columns"), "1fr")).toBe(true);
    expect(css(".cards", "gap")).not.toBe("");
  });

  test("4. a partir de 768px, 2 colunas", () => {
    const colunas = css(".cards", "grid-template-columns", "(min-width:768px)");
    expect(colunas, "Crie @media (min-width: 768px) { .cards { ... } }").not.toBe("");
    expect(mesmoValorCSS(colunas, "repeat(2, 1fr)")).toBe(true);
  });

  test("5. a partir de 1024px, 3 colunas", () => {
    const colunas = css(".cards", "grid-template-columns", "(min-width:1024px)");
    expect(colunas, "Crie @media (min-width: 1024px) { .cards { ... } }").not.toBe("");
    expect(mesmoValorCSS(colunas, "repeat(3, 1fr)")).toBe(true);
  });

  test("é mobile first: nenhuma media query usa max-width", () => {
    for (const media of listarMedias(document)) {
      expect(media).not.toContain("max-width");
    }
  });
});
