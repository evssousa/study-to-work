import path from "node:path";
import { ESLint } from "eslint";
import { describe, expect, test } from "vitest";
import { caminhoAoLado } from "../../../suporte/arquivos.js";

const configuracao = caminhoAoLado(import.meta.url, "eslint.config.js");
const pasta = path.dirname(configuracao);

const eslint = new ESLint({ cwd: pasta, overrideConfigFile: configuracao });

async function analisar(codigo) {
  const [resultado] = await eslint.lintText(codigo, { filePath: path.join(pasta, "amostra.js") });
  return resultado.messages;
}

const regras = (mensagens) => mensagens.map((m) => m.ruleId);
const erroDe = (mensagens, regra) => mensagens.find((m) => m.ruleId === regra);

describe("configuração do ESLint", () => {
  test("código limpo não tem nenhum aviso (e import/export são entendidos)", async () => {
    const mensagens = await analisar('import { readFileSync } from "node:fs";\n\nexport const ler = (arquivo) => readFileSync(arquivo, "utf8");\n');
    expect(mensagens).toEqual([]);
  });

  test("globais do Node (console, process) são permitidos e no-console está desligado", async () => {
    const mensagens = await analisar("console.log(process.argv);\n");
    expect(mensagens).toEqual([]);
  });

  test("o navegador não existe: document é um erro (no-undef)", async () => {
    const mensagens = await analisar("export const titulo = document.title;\n");
    expect(erroDe(mensagens, "no-undef")?.severity).toBe(2);
  });

  test("no-var", async () => {
    const mensagens = await analisar("var a = 1;\nexport { a };\n");
    expect(erroDe(mensagens, "no-var")?.severity, "Ative no-var como error").toBe(2);
  });

  test("eqeqeq", async () => {
    const mensagens = await analisar("export function igual(a) {\n  return a == 1;\n}\n");
    expect(erroDe(mensagens, "eqeqeq")?.severity, "Ative eqeqeq como error").toBe(2);
  });

  test("prefer-const", async () => {
    const mensagens = await analisar("let x = 1;\nexport { x };\n");
    expect(erroDe(mensagens, "prefer-const")?.severity, "Ative prefer-const como error").toBe(2);
  });

  test("no-eval", async () => {
    const mensagens = await analisar('export const r = eval("1 + 1");\n');
    expect(erroDe(mensagens, "no-eval")?.severity, "Ative no-eval como error").toBe(2);
  });

  test("regras recomendadas: no-cond-assign e no-unused-vars", async () => {
    const mensagens = await analisar("let a = 0;\nif (a = 1) {\n  console.log(a);\n}\n");
    expect(regras(mensagens)).toContain("no-cond-assign");

    const naoUsada = await analisar("export function g(a, b) {\n  return a;\n}\n");
    expect(erroDe(naoUsada, "no-unused-vars")?.severity).toBe(2);
  });

  test("argumentos e variáveis que começam com _ são ignorados em no-unused-vars", async () => {
    const mensagens = await analisar("const _rascunho = 1;\nexport function h(_req, res) {\n  return res;\n}\n");
    expect(regras(mensagens)).not.toContain("no-unused-vars");
  });

  test("mas variáveis comuns não usadas continuam sendo erro", async () => {
    const mensagens = await analisar("const sobrando = 1;\nexport const ok = 2;\n");
    expect(erroDe(mensagens, "no-unused-vars")?.severity).toBe(2);
  });
});
