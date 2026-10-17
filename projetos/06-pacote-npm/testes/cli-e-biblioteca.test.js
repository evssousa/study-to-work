import { describe, expect, test } from "vitest";
import { clt, importarBiblioteca, ler, lerPacote } from "./projeto.js";

const biblioteca = await importarBiblioteca();

describe("uso como biblioteca (import do pacote)", () => {
  test("exporta as funções de cálculo e as tabelas", () => {
    for (const nome of ["calcularSalarioLiquido", "calcularPacoteAnualCLT", "calcularPJEquivalente", "calcularINSS", "calcularIRRF"]) {
      expect(biblioteca[nome], `O index.js precisa exportar ${nome}`).toBeTypeOf("function");
    }
    expect(biblioteca.tabelas).toBeTypeOf("object");
    expect(biblioteca.tabelas.inss.faixas.length).toBeGreaterThan(3);
  });

  test("calcularSalarioLiquido funciona com as tabelas do pacote", () => {
    const resultado = biblioteca.calcularSalarioLiquido({ salarioBruto: 6000 }, biblioteca.tabelas);
    expect(resultado.liquido).toBeGreaterThan(0);
    expect(resultado.liquido).toBeLessThan(6000);
  });

  test("calculos.js é só cálculo: não imprime nem lê arquivos", () => {
    const codigo = ler("src/calculos.js").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    expect(codigo).not.toMatch(/console\.|process\.|node:fs|readFile/);
  });
});

describe("a linha de comando, executada de outra pasta, como um usuário faria", () => {
  const pacote = lerPacote();

  test("o arquivo do bin tem o shebang", () => {
    const bin = typeof pacote.bin === "string" ? pacote.bin : Object.values(pacote.bin)[0];
    expect(ler(bin).startsWith("#!/usr/bin/env node")).toBe(true);
  });

  test("--versao e -v mostram só a versão do package.json", () => {
    for (const opcao of ["--versao", "-v"]) {
      const { stdout, codigo } = clt(opcao);
      expect(codigo).toBe(0);
      expect(stdout.trim()).toBe(pacote.version);
    }
  });

  test("--ajuda e -h mostram o uso e todas as opções", () => {
    for (const opcao of ["--ajuda", "-h"]) {
      const { stdout, codigo } = clt(opcao);
      expect(codigo).toBe(0);
      expect(stdout).toMatch(/Uso:/);
      for (const nome of ["--salario", "--dependentes", "--beneficios", "--aliquota-pj", "--contador", "--meses", "--json", "--versao", "--ajuda"]) {
        expect(stdout, `A ajuda não menciona ${nome}`).toContain(nome);
      }
    }
  });

  test("sem argumentos: mostra o uso e termina com código 1", () => {
    const { stdout, codigo } = clt();
    expect(codigo).toBe(1);
    expect(stdout).toMatch(/Uso:/);
  });

  test("opção desconhecida: mensagem clara no stderr e código 1", () => {
    const { stderr, stdout, codigo } = clt("--salario", "5000", "--xyz");
    expect(codigo).toBe(1);
    expect(stderr).toMatch(/Opção desconhecida:\s*--xyz/);
    expect(stderr).toContain("--ajuda");
    expect(stdout).toBe("");
  });

  test("salário inválido: erro no stderr e código 1", () => {
    const { stderr, codigo } = clt("--salario", "abc");
    expect(codigo).toBe(1);
    expect(stderr).toContain("Salário bruto inválido");
  });

  test("a saída normal tem as linhas do resumo", () => {
    const { stdout, codigo } = clt("--salario", "6000");
    expect(codigo).toBe(0);
    for (const rotulo of ["Salário bruto:", "INSS:", "IRRF:", "Salário líquido CLT:", "Total anual CLT:", "Faturamento PJ equivalente:"]) {
      expect(stdout, `Falta a linha "${rotulo}"`).toContain(rotulo);
    }
  });

  test("aceita vírgula decimal, como o brasileiro digita", () => {
    const { stdout, codigo } = clt("--salario", "4500,50");
    expect(codigo).toBe(0);
    expect(stdout).toContain("Salário bruto:");
  });

  test("--json imprime SÓ um JSON válido, com números (e não textos formatados)", () => {
    const { stdout, codigo } = clt("--salario", "6000", "--json");
    expect(codigo).toBe(0);
    const dados = JSON.parse(stdout);
    expect(Object.keys(dados).toSorted()).toEqual(["faturamentoPJEquivalente", "inss", "irrf", "salarioBruto", "salarioLiquido", "totalAnualCLT"]);
    for (const valor of Object.values(dados)) expect(valor).toBeTypeOf("number");
  });

  test("o JSON bate com o que a biblioteca calcula", () => {
    const { tabelas, calcularSalarioLiquido, calcularPacoteAnualCLT, calcularPJEquivalente } = biblioteca;
    const { stdout } = clt("--salario", "7000", "--dependentes", "1", "--beneficios", "900", "--aliquota-pj", "15,5", "--contador", "250", "--meses", "11", "--json");
    const dados = JSON.parse(stdout);

    const mensal = calcularSalarioLiquido({ salarioBruto: 7000, dependentes: 1 }, tabelas);
    const anual = calcularPacoteAnualCLT({ salarioBruto: 7000, dependentes: 1, beneficiosMensais: 900 }, tabelas);
    const pj = calcularPJEquivalente(anual.total, { aliquotaImposto: 0.155, custoContadorMensal: 250, mesesFaturados: 11 });

    expect(dados).toEqual({
      salarioBruto: 7000,
      inss: mensal.inss,
      irrf: mensal.irrf,
      salarioLiquido: mensal.liquido,
      totalAnualCLT: anual.total,
      faturamentoPJEquivalente: pj,
    });
  });

  test("com --json, um erro continua indo para o stderr e o stdout fica vazio", () => {
    // Atenção: um valor que começa com "-" precisa ir com "=" (--salario=-5), senão o Node acha que é outra opção.
    const { stdout, stderr, codigo } = clt("--salario=-5", "--json");
    expect(codigo).toBe(1);
    expect(stdout.trim()).toBe("");
    expect(stderr).toContain("Salário bruto inválido");
  });

  test("uma opção sem valor não vira 'opção desconhecida': a mensagem é outra, e o código é 1", () => {
    const { stderr, codigo } = clt("--salario");
    expect(codigo).toBe(1);
    expect(stderr).not.toMatch(/Opção desconhecida/);
    expect(stderr).toContain("--ajuda");
  });
});
