import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { inverterTexto } from "./06-inverter-texto.js";

describe("inverterTexto", () => {
  test('"abc" vira "cba"', () => {
    expect(inverterTexto("abc")).toBe("cba");
  });

  test('"JavaScript" vira "tpircSavaJ" (mantém maiúsculas)', () => {
    expect(inverterTexto("JavaScript")).toBe("tpircSavaJ");
  });

  test("mantém espaços e acentos", () => {
    expect(inverterTexto("olá mundo")).toBe("odnum álo");
  });

  test("texto vazio continua vazio", () => {
    expect(inverterTexto("")).toBe("");
  });

  test("não usa o método .reverse()", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "06-inverter-texto.js"));
    const semComentarios = codigo.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    expect(semComentarios, "Resolva com um laço, sem .reverse()").not.toContain(".reverse(");
  });
});
