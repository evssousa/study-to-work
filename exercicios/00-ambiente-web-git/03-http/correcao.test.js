import { describe, expect, test } from "vitest";
import { respostas } from "./respostas.js";

describe("HTTP na prática", () => {
  test.each([
    ["metodoParaBuscar", "GET"],
    ["metodoParaCriar", "POST"],
    ["metodoParaAtualizarParcialmente", "PATCH"],
    ["metodoParaSubstituir", "PUT"],
    ["metodoParaRemover", "DELETE"],
  ])("%s", (chave, esperado) => {
    expect(respostas[chave]).toBe(esperado);
  });

  test.each([
    ["statusSucesso", 200],
    ["statusCriado", 201],
    ["statusRequisicaoInvalida", 400],
    ["statusNaoAutenticado", 401],
    ["statusSemPermissao", 403],
    ["statusNaoEncontrado", 404],
    ["statusErroDoServidor", 500],
  ])("%s", (chave, esperado) => {
    expect(respostas[chave]).toBe(esperado);
  });

  test("portaPadraoHttps", () => {
    expect(respostas.portaPadraoHttps).toBe(443);
  });

  test("sistemaQueTraduzDominios", () => {
    expect(respostas.sistemaQueTraduzDominios).toBe("DNS");
  });

  test("ondeVaiOTokenDeLogin", () => {
    expect(respostas.ondeVaiOTokenDeLogin).toBe("cabecalho");
  });
});
