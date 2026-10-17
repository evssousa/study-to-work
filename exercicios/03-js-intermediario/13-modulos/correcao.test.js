import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../../suporte/arquivos.js";
import * as biblioteca from "./index.js";
import formatarMoedaPadrao from "./moeda.js";

const semEspacoEspecial = (texto) => texto.replace(/\s/g, " ");

describe("módulos", () => {
  test("moeda.js tem uma exportação padrão que formata em reais", () => {
    expect(typeof formatarMoedaPadrao).toBe("function");
    expect(semEspacoEspecial(formatarMoedaPadrao(1234.5))).toBe("R$ 1.234,50");
  });

  test("index.js expõe exatamente formatarMoeda, capitalizar, truncar e VERSAO", () => {
    expect(Object.keys(biblioteca).toSorted()).toEqual(["VERSAO", "capitalizar", "formatarMoeda", "truncar"]);
    expect(biblioteca.VERSAO).toBe("1.0.0");
  });

  test("capitalizar", () => {
    expect(biblioteca.capitalizar("aNA maria")).toBe("Ana Maria");
    expect(biblioteca.capitalizar("são paulo")).toBe("São Paulo");
  });

  test("truncar", () => {
    expect(biblioteca.truncar("JavaScript", 5)).toBe("Java…");
    expect(biblioteca.truncar("JavaScript", 5)).toHaveLength(5);
    expect(biblioteca.truncar("Oi", 5)).toBe("Oi");
    expect(biblioteca.truncar("Cinco", 5)).toBe("Cinco");
  });

  test("index.js só reexporta (não copia as funções)", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "index.js")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(codigo).toMatch(/export\s*\{\s*default as formatarMoeda\s*\}\s*from\s*["']\.\/moeda\.js["']/);
    expect(codigo).toMatch(/export\s*\*\s*from\s*["']\.\/texto\.js["']/);
    expect(codigo).not.toContain("function");
  });
});
