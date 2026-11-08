import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";

const ARQUIVOS = [
  "package.json",
  "README.md",
  ".gitignore",
  "cardapio.json",
  "src/validar.js",
  "src/formatar.js",
  "src/agrupar.js",
  "src/html.js",
  "src/gerar.js",
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

  test(".gitignore tem node_modules", () => {
    expect(lerTexto(caminhoDoProjeto(".gitignore"))).toContain("node_modules");
  });

  test("cardapio.json é um JSON válido com restaurante e ao menos uma categoria", () => {
    const cardapio = JSON.parse(lerTexto(caminhoDoProjeto("cardapio.json")));
    expect(cardapio.restaurante, "Preencha o nome do restaurante").toBeTruthy();
    expect(Array.isArray(cardapio.categorias), "cardapio.json precisa ter categorias").toBe(true);
    expect(cardapio.categorias.length, "Adicione pelo menos uma categoria").toBeGreaterThanOrEqual(1);
  });
});

describe("README.md", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("tem um título", () => {
    expect(readme()).toMatch(/^# .+/m);
  });

  test("tem o link do site publicado (GitHub Pages ou Vercel)", () => {
    expect(readme()).toMatch(/github\.io|vercel\.app/i);
  });

  test("explica como usar", () => {
    expect(readme()).toMatch(/^## .*(como usar|uso)/im);
    expect(readme()).toContain("gerar.js");
  });
});
