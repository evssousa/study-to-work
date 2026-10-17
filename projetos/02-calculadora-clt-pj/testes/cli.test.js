import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";

const calculos = await import(pathToFileURL(caminhoDoProjeto("src", "calculos.js")).href);
const { tabelas } = await import(pathToFileURL(caminhoDoProjeto("src", "tabelas.js")).href);

function rodarCli(...argumentos) {
  const resultado = spawnSync(process.execPath, [caminhoDoProjeto("src", "cli.js"), ...argumentos], {
    cwd: caminhoDoProjeto(),
    encoding: "utf8",
    timeout: 10_000,
  });
  // Troca o "espaço inquebrável" do formato de moeda por espaço comum.
  const saida = `${resultado.stdout}\n${resultado.stderr}`.replace(/ /g, " ");
  return { saida, codigo: resultado.status };
}

const reais = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");

describe("src/cli.js", () => {
  test("mostra o salário líquido calculado com as SUAS tabelas", () => {
    const { saida, codigo } = rodarCli("--salario", "6000");
    const esperado = calculos.calcularSalarioLiquido({ salarioBruto: 6000 }, tabelas);
    expect(codigo).toBe(0);
    expect(saida).toContain(`Salário bruto: ${reais(6000)}`);
    expect(saida).toContain(`INSS: ${reais(esperado.inss)}`);
    expect(saida).toContain(`IRRF: ${reais(esperado.irrf)}`);
    expect(saida).toContain(`Salário líquido CLT: ${reais(esperado.liquido)}`);
  });

  test("mostra o total anual CLT e o faturamento PJ equivalente", () => {
    const { saida, codigo } = rodarCli(
      "--salario", "8000",
      "--dependentes", "1",
      "--beneficios", "900",
      "--aliquota-pj", "6",
      "--contador", "250",
      "--meses", "11",
    );
    const anual = calculos.calcularPacoteAnualCLT(
      { salarioBruto: 8000, dependentes: 1, beneficiosMensais: 900 },
      tabelas,
    );
    const pj = calculos.calcularPJEquivalente(anual.total, {
      aliquotaImposto: 0.06,
      custoContadorMensal: 250,
      mesesFaturados: 11,
    });
    expect(codigo).toBe(0);
    expect(saida).toContain(`Total anual CLT: ${reais(anual.total)}`);
    expect(saida).toContain(`Faturamento PJ equivalente: ${reais(pj)} por mês`);
  });

  test("usa os valores padrão: alíquota PJ 6%, contador 0 e 12 meses", () => {
    const { saida } = rodarCli("--salario", "5000");
    const anual = calculos.calcularPacoteAnualCLT({ salarioBruto: 5000 }, tabelas);
    const pj = calculos.calcularPJEquivalente(anual.total, {
      aliquotaImposto: 0.06,
      custoContadorMensal: 0,
      mesesFaturados: 12,
    });
    expect(saida).toContain(`Faturamento PJ equivalente: ${reais(pj)} por mês`);
  });

  test("sem --salario mostra como usar e termina com código de erro 1", () => {
    const { saida, codigo } = rodarCli();
    expect(saida).toContain("Uso:");
    expect(codigo).toBe(1);
  });

  test("salário que não é número mostra a mensagem de erro e termina com código 1", () => {
    const { saida, codigo } = rodarCli("--salario", "abc");
    expect(saida).toContain("Salário bruto inválido");
    expect(codigo).toBe(1);
  });

  test("aceita salário com vírgula decimal, como o brasileiro digita: 4500,50", () => {
    const { saida, codigo } = rodarCli("--salario", "4500,50");
    expect(codigo).toBe(0);
    expect(saida).toContain(`Salário bruto: ${reais(4500.5)}`);
  });
});
