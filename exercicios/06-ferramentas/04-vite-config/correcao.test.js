import { pathToFileURL } from "node:url";
import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";

const { default: configuracao } = await import(pathToFileURL(caminhoAoLado(import.meta.url, "vite.config.js")).href);

describe("vite.config.js", () => {
  test("exporta um objeto de configuração", () => {
    expect(configuracao).toBeTypeOf("object");
    expect(configuracao).not.toBeNull();
  });

  test("base: o site fica na subpasta do repositório no GitHub Pages", () => {
    expect(configuracao.base).toBe("/racha-conta/");
  });

  test("build: pasta de saída e mapas de depuração", () => {
    expect(configuracao.build?.outDir).toBe("dist");
    expect(configuracao.build?.sourcemap).toBe(true);
  });

  test("server: porta 3000 e sem abrir o navegador", () => {
    expect(configuracao.server?.port).toBe(3000);
    expect(configuracao.server?.open).toBe(false);
  });

  test("envPrefix: só variáveis APP_ ficam visíveis no navegador", () => {
    expect(configuracao.envPrefix).toBe("APP_");
  });

  test("resolve.alias: @ aponta para /src", () => {
    expect(configuracao.resolve?.alias).toEqual({ "@": "/src" });
  });
});
