import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";

const ARQUIVOS = [
  "package.json",
  "README.md",
  ".gitignore",
  "regras.exemplo.json",
  "src/erros.js",
  "src/csv.js",
  "src/conversores.js",
  "src/perfis.js",
  "src/importar.js",
  "src/categorizar.js",
  "src/relatorio.js",
  "src/armazenamento.js",
  "src/cli.js",
];

describe("estrutura do projeto", () => {
  test.each(ARQUIVOS)("o arquivo %s existe", (arquivo) => {
    expect(existe(caminhoDoProjeto(arquivo)), `Crie ${arquivo}`).toBe(true);
  });

  test('package.json com "type": "module", nome e descrição', () => {
    const pacote = JSON.parse(lerTexto(caminhoDoProjeto("package.json")));
    expect(pacote.type).toBe("module");
    expect(pacote.name).toBeTruthy();
    expect(pacote.description).toBeTruthy();
  });

  test(".gitignore impede que extratos (*.csv) e as suas regras pessoais vão para o GitHub", () => {
    const gitignore = lerTexto(caminhoDoProjeto(".gitignore"));
    expect(gitignore).toContain("node_modules");
    expect(gitignore).toContain("*.csv");
    expect(gitignore).toMatch(/^\/?regras\.json$/m);
  });

  test("regras.exemplo.json tem pelo menos 6 regras válidas", () => {
    const regras = JSON.parse(lerTexto(caminhoDoProjeto("regras.exemplo.json")));
    expect(Array.isArray(regras)).toBe(true);
    expect(regras.length).toBeGreaterThanOrEqual(6);
    for (const regra of regras) {
      expect(regra.categoria).toBeTruthy();
      expect(() => new RegExp(regra.padrao, "i"), `Padrão inválido: ${regra.padrao}`).not.toThrow();
    }
  });
});

describe("README.md", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("tem título e a seção de como usar com o comando relatorio", () => {
    expect(readme()).toMatch(/^# .+/m);
    expect(readme()).toMatch(/^## .*(como usar|uso)/im);
    expect(readme()).toContain("relatorio");
  });

  test("explica como exportar o extrato do banco", () => {
    expect(readme()).toMatch(/^##+ .*export/im);
  });

  test("mostra um exemplo de saída", () => {
    expect(readme()).toContain("Gastos por categoria");
  });

  test("fala sobre privacidade (os dados não saem do computador)", () => {
    expect(readme()).toMatch(/privacidade/i);
  });
});
