import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, listarRegras, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade) => valorCSS(document, seletor, propriedade);

describe("box model", () => {
  test("1. *, *::before, *::after usam box-sizing: border-box", () => {
    const regra = listarRegras(document).find((r) => r.seletor.split(", ").includes("*"));
    expect(regra, "Crie a regra *, *::before, *::after { ... }").toBeDefined();
    const seletores = regra.seletor.split(", ");
    expect(seletores).toContain("*::before");
    expect(seletores).toContain("*::after");
    expect(regra.estilo.getPropertyValue("box-sizing")).toBe("border-box");
  });

  test("2. .plano tem padding", () => {
    expect(css(".plano", "padding-top")).not.toBe("");
  });

  test("2. .plano tem borda de 1px sólida", () => {
    expect(css(".plano", "border-top-width")).toBe("1px");
    expect(css(".plano", "border-top-style")).toBe("solid");
  });

  test("2. .plano tem cantos arredondados e margem inferior", () => {
    expect(css(".plano", "border-radius")).not.toBe("");
    expect(css(".plano", "margin-bottom")).not.toBe("");
  });

  test("2. .plano tem largura máxima de 320px", () => {
    expect(css(".plano", "max-width")).toBe("320px");
  });

  test("3. .plano__botao é inline-block e tem padding", () => {
    expect(css(".plano__botao", "display")).toBe("inline-block");
    expect(css(".plano__botao", "padding-top")).not.toBe("");
  });
});
