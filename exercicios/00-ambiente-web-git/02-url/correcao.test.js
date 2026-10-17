import { describe, expect, test } from "vitest";
import { partes } from "./respostas.js";

const url = new URL("https://loja.exemplo.com.br:8080/produtos/tenis?cor=azul&tamanho=42#avaliacoes");

describe("partes da URL", () => {
  test("protocolo", () => {
    expect(partes.protocolo).toBe(url.protocol.replace(":", ""));
  });

  test("domínio (host, sem a porta)", () => {
    expect(partes.dominio).toBe(url.hostname);
  });

  test("porta", () => {
    expect(partes.porta).toBe(url.port);
  });

  test("caminho (path)", () => {
    expect(partes.caminho).toBe(url.pathname);
  });

  test("parâmetros da query string", () => {
    expect(partes.parametros.cor).toBe(url.searchParams.get("cor"));
    expect(partes.parametros.tamanho).toBe(url.searchParams.get("tamanho"));
  });

  test("fragmento (âncora)", () => {
    expect(partes.fragmento).toBe(url.hash.replace("#", ""));
  });
});
