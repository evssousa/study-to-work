import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";

describe("estrutura do projeto", () => {
  test.each(["package.json", "README.md", ".gitignore", "config.json", "src/validar.js", "src/html.js", "src/gerar.js"])(
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

  test("config.json é um JSON válido com nome e ao menos um link", () => {
    const config = JSON.parse(lerTexto(caminhoDoProjeto("config.json")));
    expect(config.nome, "Preencha seu nome no config.json").toBeTruthy();
    expect(Array.isArray(config.links), "config.json precisa ter uma lista de links").toBe(true);
    expect(config.links.length, "Adicione pelo menos um link").toBeGreaterThanOrEqual(1);
  });
});

describe("README.md (vitrine do projeto)", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("tem um título", () => {
    expect(readme()).toMatch(/^# .+/m);
  });

  test("tem o link do site publicado (GitHub Pages ou Vercel)", () => {
    expect(readme()).toMatch(/github\.io|vercel\.app/i);
  });

  test("explica como usar (node src/gerar.js)", () => {
    expect(readme()).toMatch(/^## .*(como usar|uso)/im);
    expect(readme()).toContain("gerar.js");
  });
});
