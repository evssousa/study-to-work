import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, mesmoValorCSS, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade) => valorCSS(document, seletor, propriedade);

describe("grid — layout da página", () => {
  test("1. .layout é um grid com colunas 250px e 1fr", () => {
    expect(css(".layout", "display")).toBe("grid");
    expect(mesmoValorCSS(css(".layout", "grid-template-columns"), "250px 1fr")).toBe(true);
    expect(css(".layout", "min-height")).toBe("100vh");
  });

  test("1. .layout define as áreas topo, lateral, conteudo e rodape", () => {
    const areas = css(".layout", "grid-template-areas").replace(/\s+/g, " ");
    expect(areas).toContain('"topo topo"');
    expect(areas).toContain('"lateral conteudo"');
    expect(areas).toContain('"rodape rodape"');
  });

  test.each([
    [".layout__topo", "topo"],
    [".layout__lateral", "lateral"],
    [".layout__conteudo", "conteudo"],
    [".layout__rodape", "rodape"],
  ])("2. %s ocupa a área %s", (seletor, area) => {
    expect(css(seletor, "grid-area")).toBe(area);
  });
});

describe("grid — galeria", () => {
  test("3. .galeria tem 3 colunas iguais e gap", () => {
    expect(css(".galeria", "display")).toBe("grid");
    expect(mesmoValorCSS(css(".galeria", "grid-template-columns"), "repeat(3, 1fr)")).toBe(true);
    expect(css(".galeria", "gap")).not.toBe("");
  });

  test("3. .galeria sem marcadores de lista e sem padding", () => {
    const marcador = css(".galeria", "list-style") || css(".galeria", "list-style-type");
    expect(marcador).toContain("none");
    expect(css(".galeria", "padding-left")).toMatch(/^0(px)?$/);
  });

  test("4. as fotos são quadradas e não distorcem", () => {
    expect(css(".galeria img", "width")).toBe("100%");
    expect(mesmoValorCSS(css(".galeria img", "aspect-ratio"), "1/1")).toBe(true);
    expect(css(".galeria img", "object-fit")).toBe("cover");
  });
});
