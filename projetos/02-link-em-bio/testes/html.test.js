import { describe, expect, test } from "vitest";
import { carregar } from "./carregar.js";

const { slugify, escaparHtml, gerarCartao, gerarPagina } = await carregar("src/html.js");

describe("slugify", () => {
  test("converte para minúsculas", () => {
    expect(slugify("ANA SILVA")).toBe("ana-silva");
  });

  test("substitui espaços por hífens", () => {
    expect(slugify("João da Silva")).toMatch(/joao-da-silva/);
  });

  test("remove acentos", () => {
    expect(slugify("ção")).toMatch(/cao/);
    expect(slugify("Ávila")).toMatch(/avila/);
  });
});

describe("escaparHtml", () => {
  test("escapa o caractere &", () => {
    expect(escaparHtml("A & B")).toBe("A &amp; B");
  });

  test("escapa < e >", () => {
    expect(escaparHtml("<script>")).toBe("&lt;script&gt;");
  });

  test("escapa aspas duplas", () => {
    expect(escaparHtml('"texto"')).toBe("&quot;texto&quot;");
  });

  test("não altera texto sem caracteres especiais", () => {
    expect(escaparHtml("texto normal")).toBe("texto normal");
  });
});

describe("gerarCartao", () => {
  const config = {
    nome: "Ana Silva",
    titulo: "Desenvolvedora",
    links: [
      { texto: "GitHub", url: "https://github.com/ana", icone: "🐙" },
      { texto: "LinkedIn", url: "https://linkedin.com/in/ana" },
    ],
  };

  test("contém o nome da pessoa", () => {
    expect(gerarCartao(config)).toContain("Ana Silva");
  });

  test("contém o título", () => {
    expect(gerarCartao(config)).toContain("Desenvolvedora");
  });

  test("contém os links com as URLs", () => {
    expect(gerarCartao(config)).toContain("https://github.com/ana");
    expect(gerarCartao(config)).toContain("https://linkedin.com/in/ana");
  });

  test("escapa o nome para prevenir XSS", () => {
    const configXSS = {
      nome: '<script>alert("xss")</script>',
      links: [{ texto: "X", url: "https://x.com" }],
    };
    const html = gerarCartao(configXSS);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("links abrem em nova aba (rel=noopener)", () => {
    const html = gerarCartao(config);
    expect(html).toContain("noopener");
  });
});

describe("gerarPagina", () => {
  const config = {
    nome: "Ana Silva",
    links: [{ texto: "GitHub", url: "https://github.com/ana" }],
  };

  test("retorna um documento HTML completo", () => {
    const html = gerarPagina(config);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain("</html>");
  });

  test("inclui charset UTF-8 e viewport", () => {
    const html = gerarPagina(config);
    expect(html).toContain("UTF-8");
    expect(html).toContain("viewport");
  });

  test("inclui o nome no título da aba", () => {
    const html = gerarPagina(config);
    expect(html).toContain("<title>");
    expect(html).toContain("Ana Silva");
  });
});
