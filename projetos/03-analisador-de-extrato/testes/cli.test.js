import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { caminhoDoProjeto } from "../../../suporte/arquivos.js";
import { reais } from "./carregar.js";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
let pasta;
let regras;

beforeEach(() => {
  pasta = mkdtempSync(path.join(os.tmpdir(), "extrato-cli-"));
  regras = path.join(pasta, "regras.json");
  copyFileSync(path.join(fixtures, "regras.json"), regras);
});
afterEach(() => rmSync(pasta, { recursive: true, force: true }));

function rodar(...argumentos) {
  const resultado = spawnSync(process.execPath, [caminhoDoProjeto("src", "cli.js"), ...argumentos], {
    cwd: pasta,
    encoding: "utf8",
    timeout: 10_000,
  });
  return { saida: `${resultado.stdout}\n${resultado.stderr}`.replace(/ /g, " "), codigo: resultado.status };
}

const relatorioDeOutubro = () =>
  rodar("relatorio", "--arquivo", path.join(fixtures, "extrato-generico.csv"), "--perfil", "generico", "--mes", "2026-10", "--regras", regras);

describe("comando relatorio", () => {
  test("mostra receitas, gastos e saldo do mês", () => {
    const { saida, codigo } = relatorioDeOutubro();
    expect(codigo).toBe(0);
    expect(saida).toContain(`Receitas: ${reais(500000)}`);
    expect(saida).toContain(`Gastos: ${reais(57940)}`);
    expect(saida).toContain(`Saldo: ${reais(442060)}`);
  });

  test("mostra os gastos por categoria, com valor e percentual", () => {
    const { saida } = relatorioDeOutubro();
    expect(saida).toContain("Gastos por categoria");
    const linhaDoMercado = saida.split("\n").find((linha) => linha.includes("mercado"));
    expect(linhaDoMercado).toContain(reais(43250));
    expect(linhaDoMercado).toContain("74,6%");
    expect(saida.split("\n").find((linha) => /^\s*outros/.test(linha))).toContain("6,9%");
  });

  test("as categorias aparecem da maior para a menor", () => {
    const { saida } = relatorioDeOutubro();
    const ordem = ["mercado", "saude", "transporte", "outros"].map((c) => saida.search(new RegExp(`^\\s*${c}\\b`, "m")));
    expect(ordem.every((posicao) => posicao >= 0)).toBe(true);
    expect(ordem).toEqual([...ordem].sort((a, b) => a - b));
  });

  test("compara com o mês anterior", () => {
    const { saida } = relatorioDeOutubro();
    expect(saida).toContain("Comparação com 2026-09");
    expect(saida).toContain("+44,2%");
    expect(saida).toContain("+91,8%");
  });

  test("lista os maiores gastos com a data no formato brasileiro", () => {
    const { saida } = relatorioDeOutubro();
    expect(saida).toContain("Maiores gastos");
    expect(saida).toMatch(/05\/10\/2026.*Mercado Bom Preço/);
  });

  test("informa as linhas que foram ignoradas e o motivo", () => {
    const { saida } = relatorioDeOutubro();
    expect(saida).toContain("linha 10: Data inválida: 31/02/2026");
    expect(saida).toContain("linha 11: Valor inválido: abc");
  });

  test("sem --mes, usa o mês da transação mais recente", () => {
    const { saida } = rodar("relatorio", "--arquivo", path.join(fixtures, "extrato-generico.csv"), "--perfil", "generico", "--regras", regras);
    expect(saida).toContain(`Gastos: ${reais(57940)}`);
  });

  test("perfil desconhecido: mensagem com os perfis disponíveis e código 1", () => {
    const { saida, codigo } = rodar("relatorio", "--arquivo", path.join(fixtures, "extrato-generico.csv"), "--perfil", "banco-x");
    expect(codigo).toBe(1);
    expect(saida).toContain("Perfil desconhecido: banco-x");
    expect(saida).toContain("generico");
  });

  test("arquivo inexistente: mensagem clara e código 1", () => {
    const { saida, codigo } = rodar("relatorio", "--arquivo", "nao-existe.csv", "--perfil", "generico");
    expect(codigo).toBe(1);
    expect(saida).toContain("Arquivo não encontrado: nao-existe.csv");
  });
});

describe("comandos de regras", () => {
  test("adicionar-regra grava no arquivo de regras", () => {
    const { saida, codigo } = rodar("adicionar-regra", "--categoria", "lazer", "--padrao", "cinema|teatro", "--regras", regras);
    expect(codigo).toBe(0);
    expect(saida).toContain("Regra adicionada: lazer");
    const gravadas = JSON.parse(readFileSync(regras, "utf8"));
    expect(gravadas.at(-1)).toEqual({ categoria: "lazer", padrao: "cinema|teatro" });
  });

  test("a regra nova já vale no próximo relatório", () => {
    rodar("adicionar-regra", "--categoria", "lazer", "--padrao", "cinema", "--regras", regras);
    const { saida } = relatorioDeOutubro();
    expect(saida).toMatch(/^\s*lazer/m);
    expect(saida).not.toMatch(/^\s*outros/m);
  });

  test("adicionar-regra recusa expressão regular inválida", () => {
    const { saida, codigo } = rodar("adicionar-regra", "--categoria", "x", "--padrao", "(abc", "--regras", regras);
    expect(codigo).toBe(1);
    expect(saida).toContain("Regra inválida");
    expect(JSON.parse(readFileSync(regras, "utf8"))).toHaveLength(4);
  });

  test("regras lista as regras cadastradas", () => {
    const { saida, codigo } = rodar("regras", "--regras", regras);
    expect(codigo).toBe(0);
    expect(saida).toContain("transporte");
    expect(saida).toContain("uber|99 ?pop");
  });

  test("sem comando: mostra como usar e sai com código 1", () => {
    const { saida, codigo } = rodar();
    expect(codigo).toBe(1);
    expect(saida).toContain("Uso:");
  });
});
