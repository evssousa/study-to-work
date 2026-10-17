import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";

// O frete.js é o código dado (fica sempre na pasta do exercício); o spec é o do aluno.
const pastaDoExercicio = path.dirname(fileURLToPath(import.meta.url));
const fonte = readFileSync(path.join(pastaDoExercicio, "frete.js"), "utf8");
const spec = readFileSync(caminhoAoLado(import.meta.url, "frete.spec.js"), "utf8");

const pastasTemporarias = [];
afterAll(() => pastasTemporarias.forEach((p) => rmSync(p, { recursive: true, force: true })));

function rodarTestes(codigoDoFrete) {
  const pasta = mkdtempSync(path.join(os.tmpdir(), "mutacao-"));
  pastasTemporarias.push(pasta);
  writeFileSync(path.join(pasta, "package.json"), '{ "type": "module" }');
  writeFileSync(path.join(pasta, "frete.js"), codigoDoFrete);
  writeFileSync(path.join(pasta, "frete.spec.js"), spec);

  const resultado = spawnSync(process.execPath, ["--test", "frete.spec.js"], { cwd: pasta, encoding: "utf8", timeout: 30_000 });
  const saida = `${resultado.stdout}\n${resultado.stderr}`;
  const numero = (rotulo) => Number(new RegExp(`(?:ℹ|#)\\s*${rotulo}\\s+(\\d+)`).exec(saida)?.[1] ?? 0);
  return { saida, codigo: resultado.status, total: numero("tests"), passaram: numero("pass"), falharam: numero("fail") };
}

const MUTANTES = [
  ["uma faixa de peso incluída na seguinte (<= virou <)", "pesoKg <= f.ate", "pesoKg < f.ate"],
  ["o frete grátis passou a valer só ACIMA de R$ 200 (>= virou >)", "valorDoPedido >= 200", "valorDoPedido > 200"],
  ["o CEP começando com 6 deixou de pagar o adicional", '["6", "7", "8", "9"]', '["7", "8", "9"]'],
  ["o adicional virou 25% em vez de 20%", "* 1.2 *", "* 1.25 *"],
  ["o peso zero passou a ser aceito (!(x > 0) virou x < 0)", "!(pesoKg > 0)", "pesoKg < 0"],
  ["o preço da faixa de 5 kg mudou de 25 para 26", "{ ate: 5, preco: 25 }", "{ ate: 5, preco: 26 }"],
  ["o CEP com 7 dígitos passou a ser aceito", "/^\\d{8}$/", "/^\\d{7,8}$/"],
  ["o CEP com hífen deixou de ser aceito (a máscara não é mais removida)", 'String(cep).replace(/\\D/g, "")', "String(cep)"],
  ["o limite de peso passou de 30 para 31 kg", "{ ate: 30, preco: 60 }", "{ ate: 31, preco: 60 }"],
  ["o preço da faixa de 1 kg mudou de 15 para 16", "{ ate: 1, preco: 15 }", "{ ate: 1, preco: 16 }"],
];

describe("os seus testes", () => {
  test("o frete.js original está intacto (não o altere)", () => {
    for (const [, original] of MUTANTES) {
      expect(fonte, `frete.js foi alterado: não achei "${original}"`).toContain(original);
    }
  });

  test("passam no código correto, e são pelo menos 10", { timeout: 40_000 }, () => {
    const resultado = rodarTestes(fonte);
    expect(resultado.falharam, `Seus testes falham no código CORRETO:\n${resultado.saida}`).toBe(0);
    expect(resultado.passaram, "Escreva pelo menos 10 testes (cada regra e cada fronteira)").toBeGreaterThanOrEqual(10);
    expect(resultado.codigo).toBe(0);
  });

  test.each(MUTANTES)("detectam o defeito: %s", { timeout: 40_000 }, (_descricao, original, defeituoso) => {
    const mutante = fonte.replace(original, defeituoso);
    expect(mutante).not.toBe(fonte);
    const resultado = rodarTestes(mutante);
    expect(
      resultado.falharam > 0 || resultado.codigo !== 0,
      "Os seus testes PASSARAM mesmo com este defeito no código: falta um teste que perceba isso (pense na fronteira ou no valor exato)",
    ).toBe(true);
  });
});
