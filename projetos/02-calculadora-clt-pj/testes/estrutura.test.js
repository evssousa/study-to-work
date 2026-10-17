import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";

describe("estrutura do projeto", () => {
  test.each(["package.json", "README.md", "src/calculos.js", "src/tabelas.js", "src/cli.js"])(
    "o arquivo %s existe",
    (arquivo) => {
      expect(existe(caminhoDoProjeto(arquivo)), `Crie o arquivo ${arquivo}`).toBe(true);
    },
  );

  test('package.json usa módulos ES ("type": "module")', () => {
    const pacote = JSON.parse(lerTexto(caminhoDoProjeto("package.json")));
    expect(pacote.type).toBe("module");
  });

  test("package.json tem nome e descrição", () => {
    const pacote = JSON.parse(lerTexto(caminhoDoProjeto("package.json")));
    expect(pacote.name, "Preencha o campo name").toBeTruthy();
    expect(pacote.description, "Preencha o campo description").toBeTruthy();
  });

  test(".gitignore ignora node_modules", () => {
    expect(existe(caminhoDoProjeto(".gitignore")), "Crie um .gitignore").toBe(true);
    expect(lerTexto(caminhoDoProjeto(".gitignore"))).toContain("node_modules");
  });
});

describe("README.md (é a vitrine do projeto para recrutadores e usuários)", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("tem um título", () => {
    expect(readme()).toMatch(/^# .+/m);
  });

  test("explica como usar, com exemplo de comando", () => {
    expect(readme()).toMatch(/^## .*(como usar|uso)/im);
    expect(readme()).toContain("--salario");
  });

  test("mostra um exemplo de saída do programa", () => {
    expect(readme()).toContain("Salário líquido CLT");
  });

  test("informa as fontes das tabelas e as simplificações feitas", () => {
    expect(readme()).toMatch(/gov\.br/i);
    expect(readme()).toMatch(/simplifica/i);
  });
});
