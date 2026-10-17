import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade) => valorCSS(document, seletor, propriedade);

describe("flexbox", () => {
  test("1. .cabecalho: flex, espaço entre os itens e centralizado na vertical", () => {
    expect(css(".cabecalho", "display")).toBe("flex");
    expect(css(".cabecalho", "justify-content")).toBe("space-between");
    expect(css(".cabecalho", "align-items")).toBe("center");
  });

  test("2. .cabecalho__menu: flex, com gap e sem marcadores", () => {
    expect(css(".cabecalho__menu", "display")).toBe("flex");
    expect(css(".cabecalho__menu", "gap")).not.toBe("");
    const marcador = css(".cabecalho__menu", "list-style") || css(".cabecalho__menu", "list-style-type");
    expect(marcador).toContain("none");
  });

  test("3. body: coluna flexível com altura mínima da tela", () => {
    expect(css("body", "display")).toBe("flex");
    expect(css("body", "flex-direction")).toBe("column");
    expect(css("body", "min-height")).toBe("100vh");
  });

  test("3. main cresce para ocupar o espaço livre (flex: 1)", () => {
    const flex = css("main", "flex-grow") || css("main", "flex");
    expect(flex.startsWith("1")).toBe(true);
  });

  test("4. .rodape: coluna centralizada", () => {
    expect(css(".rodape", "display")).toBe("flex");
    expect(css(".rodape", "flex-direction")).toBe("column");
    expect(css(".rodape", "align-items")).toBe("center");
  });
});
