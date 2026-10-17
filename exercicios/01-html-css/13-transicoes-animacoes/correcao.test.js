import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";
import { carregarPagina, valorCSS } from "../../../suporte/html.js";

const { document } = carregarPagina(caminhoAoLado(import.meta.url, "index.html"));
const css = (seletor, propriedade, media = null) => valorCSS(document, seletor, propriedade, { media });
const MOVIMENTO_REDUZIDO = "(prefers-reduced-motion:reduce)";

function encontrarKeyframes(nome) {
  for (const folha of document.styleSheets) {
    for (const regra of folha.cssRules) {
      if (regra.constructor.name === "CSSKeyframesRule" && regra.name === nome) return regra;
    }
  }
  return null;
}

describe("transições e animações", () => {
  test("1. .botao tem transition em transform", () => {
    const transicao = css(".botao", "transition") || css(".botao", "transition-property");
    expect(transicao).toMatch(/transform|all/);
  });

  test("2. o efeito aparece no hover e no foco pelo teclado", () => {
    expect(css(".botao:hover", "transform")).toMatch(/translateY\(-2px\)/);
    expect(css(".botao:focus-visible", "transform")).toMatch(/translateY\(-2px\)/);
  });

  test("3. existe @keyframes pulsar com pelo menos 2 etapas", () => {
    const animacao = encontrarKeyframes("pulsar");
    expect(animacao, "Crie @keyframes pulsar { ... }").not.toBeNull();
    expect(animacao.cssRules.length).toBeGreaterThanOrEqual(2);
  });

  test("4. .notificacao usa a animação pulsar em loop infinito", () => {
    const animacao = css(".notificacao", "animation") || css(".notificacao", "animation-name");
    expect(animacao).toContain("pulsar");
    const repeticao = css(".notificacao", "animation") || css(".notificacao", "animation-iteration-count");
    expect(repeticao).toContain("infinite");
  });

  test("5. com movimento reduzido, transição e animação são desligadas", () => {
    expect(css(".botao", "transition", MOVIMENTO_REDUZIDO)).toBe("none");
    expect(css(".notificacao", "animation", MOVIMENTO_REDUZIDO)).toBe("none");
  });
});
