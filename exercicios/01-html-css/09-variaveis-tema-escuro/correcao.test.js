import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, listarRegras, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade, media = null) => valorCSS(document, seletor, propriedade, { media });

const VARIAVEIS = ["--cor-fundo", "--cor-texto", "--cor-primaria", "--espaco"];
const PROPRIEDADES_DE_COR = ["color", "background", "background-color", "border-color", "border"];

describe("variáveis CSS e tema escuro", () => {
  test.each(VARIAVEIS)("1. :root define %s", (variavel) => {
    expect(css(":root", variavel)).not.toBe("");
  });

  test("2. body usa as variáveis de fundo e texto", () => {
    const fundo = css("body", "background-color") || css("body", "background");
    expect(fundo).toContain("var(--cor-fundo)");
    expect(css("body", "color")).toContain("var(--cor-texto)");
  });

  test("3. .botao usa as variáveis de cor primária e espaço", () => {
    const fundo = css(".botao", "background-color") || css(".botao", "background");
    expect(fundo).toContain("var(--cor-primaria)");
    expect(css(".botao", "padding")).toContain("var(--espaco)");
  });

  test("4. no tema escuro, :root redefine --cor-fundo e --cor-texto", () => {
    expect(css(":root", "--cor-fundo", "(prefers-color-scheme:dark)")).not.toBe("");
    expect(css(":root", "--cor-texto", "(prefers-color-scheme:dark)")).not.toBe("");
  });

  test("4. as cores do tema escuro são diferentes das do tema claro", () => {
    expect(css(":root", "--cor-fundo", "(prefers-color-scheme:dark)")).not.toBe(css(":root", "--cor-fundo"));
  });

  test("nenhuma cor solta fora do :root", () => {
    for (const regra of listarRegras(document)) {
      if (regra.seletor === ":root") continue;
      for (const propriedade of PROPRIEDADES_DE_COR) {
        const valor = regra.estilo.getPropertyValue(propriedade);
        if (!valor) continue;
        expect(valor, `${regra.seletor} { ${propriedade}: ${valor} } — use uma variável`).not.toMatch(
          /#|rgb|hsl|\b(white|black|red|blue|green|gray|grey)\b/i,
        );
      }
    }
  });
});
