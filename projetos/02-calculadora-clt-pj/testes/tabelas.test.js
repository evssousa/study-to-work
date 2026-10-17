import { pathToFileURL } from "node:url";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

const modulo = await import(pathToFileURL(caminhoDoProjeto("src", "tabelas.js")).href);
const { tabelas } = modulo;

// Os valores reais mudam todo ano, então aqui conferimos se a ESTRUTURA está certa
// e se os números fazem sentido. Os valores você busca nas fontes oficiais.
describe("src/tabelas.js", () => {
  test("exporta o objeto `tabelas` com inss, irrf e fgts", () => {
    expect(tabelas).toBeTypeOf("object");
    expect(tabelas.inss).toBeTypeOf("object");
    expect(tabelas.irrf).toBeTypeOf("object");
    expect(tabelas.fgts).toBe(0.08);
  });

  test("informa o ano e a fonte oficial das tabelas", () => {
    expect(tabelas.ano).toBeGreaterThanOrEqual(2026);
    expect(tabelas.fonte).toMatch(/gov\.br/);
  });

  test("faixas do INSS estão em ordem crescente e têm alíquotas entre 0 e 1", () => {
    const { faixas } = tabelas.inss;
    expect(faixas.length).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < faixas.length; i++) {
      expect(faixas[i].aliquota).toBeGreaterThan(0);
      expect(faixas[i].aliquota).toBeLessThan(1);
      if (i > 0) expect(faixas[i].ate).toBeGreaterThan(faixas[i - 1].ate);
    }
  });

  test("faixas do IRRF estão em ordem crescente e a última vai até Infinity", () => {
    const { faixas } = tabelas.irrf;
    expect(faixas.length).toBeGreaterThanOrEqual(5);
    expect(faixas[0].aliquota).toBe(0);
    expect(faixas[faixas.length - 1].ate).toBe(Infinity);
    for (let i = 1; i < faixas.length; i++) {
      expect(faixas[i].ate).toBeGreaterThan(faixas[i - 1].ate);
      expect(faixas[i].aliquota).toBeGreaterThan(faixas[i - 1].aliquota);
      expect(faixas[i].deducao).toBeGreaterThan(faixas[i - 1].deducao);
    }
  });

  test("IRRF tem dedução por dependente, desconto simplificado e as regras de redução", () => {
    const { irrf } = tabelas;
    expect(irrf.deducaoPorDependente).toBeGreaterThan(0);
    expect(irrf.descontoSimplificado).toBeGreaterThan(0);
    expect(irrf.reducao.isencaoTotalAte).toBeGreaterThan(0);
    expect(irrf.reducao.reducaoAte).toBeGreaterThan(irrf.reducao.isencaoTotalAte);
    expect(irrf.reducao.constante).toBeGreaterThan(0);
    expect(irrf.reducao.fator).toBeGreaterThan(0);
  });
});
