import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { importarDoProjeto, reais, semEspacoEspecial } from "./carregar.js";

const relatorio = await importarDoProjeto("relatorio.js");
const { carregarJson, salvarJson } = await importarDoProjeto("armazenamento.js");

const t = (data, valorCentavos, categoria) => ({ data, descricao: categoria, valorCentavos, categoria });

const transacoes = Object.freeze([
  t("2026-09-05", 500000, "receitas"),
  t("2026-09-10", -2550, "transporte"),
  t("2026-09-12", -30000, "mercado"),
  t("2026-10-01", 500000, "receitas"),
  t("2026-10-02", -3000, "transporte"),
  t("2026-10-03", -1240, "mercado"),
  t("2026-10-05", -42010, "mercado"),
  t("2026-10-07", -5800, "saude"),
  t("2026-10-10", -1890, "transporte"),
  t("2026-10-15", -4000, "outros"),
]);

const outubro = () => relatorio.filtrarPorMes(transacoes, "2026-10");

describe("src/relatorio.js", () => {
  test("filtrarPorMes", () => {
    expect(outubro()).toHaveLength(7);
    expect(relatorio.filtrarPorMes(transacoes, "2026-08")).toEqual([]);
  });

  test("mesAnterior vira o ano em janeiro", () => {
    expect(relatorio.mesAnterior("2026-10")).toBe("2026-09");
    expect(relatorio.mesAnterior("2026-01")).toBe("2025-12");
  });

  test("totais: receitas, gastos (positivo) e saldo", () => {
    expect(relatorio.totais(outubro())).toEqual({ receitasCentavos: 500000, gastosCentavos: 57940, saldoCentavos: 442060 });
  });

  test("resumirPorCategoria: só gastos, do maior para o menor, com percentual de 1 casa", () => {
    expect(relatorio.resumirPorCategoria(outubro())).toEqual([
      { categoria: "mercado", totalCentavos: 43250, quantidade: 2, percentual: 74.6 },
      { categoria: "saude", totalCentavos: 5800, quantidade: 1, percentual: 10 },
      { categoria: "transporte", totalCentavos: 4890, quantidade: 2, percentual: 8.4 },
      { categoria: "outros", totalCentavos: 4000, quantidade: 1, percentual: 6.9 },
    ]);
  });

  test("resumirPorCategoria: empate no total desempata pelo nome", () => {
    const empate = [t("2026-10-01", -100, "b"), t("2026-10-01", -100, "a")];
    expect(relatorio.resumirPorCategoria(empate).map((c) => c.categoria)).toEqual(["a", "b"]);
  });

  test("resumirPorCategoria: sem gastos, lista vazia", () => {
    expect(relatorio.resumirPorCategoria([t("2026-10-01", 100, "receitas")])).toEqual([]);
  });

  test("maioresGastos: os N maiores gastos, do maior para o menor", () => {
    const maiores = relatorio.maioresGastos(outubro(), 2);
    expect(maiores.map((g) => g.valorCentavos)).toEqual([-42010, -5800]);
  });

  test("compararMeses: compara cada categoria com o mês anterior", () => {
    expect(relatorio.compararMeses(transacoes, "2026-10")).toEqual([
      { categoria: "mercado", atualCentavos: 43250, anteriorCentavos: 30000, variacaoPercentual: 44.2 },
      { categoria: "saude", atualCentavos: 5800, anteriorCentavos: 0, variacaoPercentual: null },
      { categoria: "transporte", atualCentavos: 4890, anteriorCentavos: 2550, variacaoPercentual: 91.8 },
      { categoria: "outros", atualCentavos: 4000, anteriorCentavos: 0, variacaoPercentual: null },
    ]);
  });

  test("compararMeses: categoria que sumiu aparece com atual 0 e -100%", () => {
    const resultado = relatorio.compararMeses([t("2026-09-01", -1000, "lazer")], "2026-10");
    expect(resultado).toEqual([{ categoria: "lazer", atualCentavos: 0, anteriorCentavos: 1000, variacaoPercentual: -100 }]);
  });

  test("formatarCentavos", () => {
    expect(semEspacoEspecial(relatorio.formatarCentavos(123456))).toBe("R$ 1.234,56");
    expect(semEspacoEspecial(relatorio.formatarCentavos(-4590))).toBe(reais(-4590));
    expect(semEspacoEspecial(relatorio.formatarCentavos(7))).toBe("R$ 0,07");
  });

  test("não altera a lista recebida", () => {
    relatorio.resumirPorCategoria(outubro());
    relatorio.maioresGastos(transacoes, 3);
    relatorio.compararMeses(transacoes, "2026-10");
    expect(transacoes[0].data).toBe("2026-09-05");
  });
});

describe("src/armazenamento.js", () => {
  let pasta;
  beforeEach(() => {
    pasta = mkdtempSync(path.join(os.tmpdir(), "extrato-"));
  });
  afterEach(() => rmSync(pasta, { recursive: true, force: true }));

  test("salva e carrega JSON", () => {
    const arquivo = path.join(pasta, "sub", "regras.json");
    salvarJson(arquivo, [{ categoria: "x", padrao: "y" }]);
    expect(carregarJson(arquivo, [])).toEqual([{ categoria: "x", padrao: "y" }]);
  });

  test("arquivo inexistente retorna o padrão; JSON inválido lança erro", () => {
    expect(carregarJson(path.join(pasta, "nada.json"), [])).toEqual([]);
    const quebrado = path.join(pasta, "quebrado.json");
    writeFileSync(quebrado, "{");
    expect(() => carregarJson(quebrado, [])).toThrow(`Arquivo JSON inválido: ${quebrado}`);
  });
});
