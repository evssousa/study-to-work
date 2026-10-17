import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";

const readme = () => lerTexto(caminhoDoProjeto("README.md"));
const secoes = () => (readme().match(/^##+ .+/gm) ?? []).map((s) => s.toLowerCase());

function remoteDoProjeto() {
  try {
    return execFileSync("git", ["-C", caminhoDoProjeto(), "remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

describe("repositório de perfil", () => {
  test("o README.md existe", () => {
    expect(existe(caminhoDoProjeto("README.md"))).toBe(true);
  });

  test("o repositório se chama igual ao seu usuário (github.com/usuario/usuario)", () => {
    const remote = remoteDoProjeto();
    expect(remote, "Ligue a pasta ao GitHub: git remote add origin ...").toContain("github.com");
    const [, usuario, repositorio] = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)/) ?? [];
    expect(repositorio?.toLowerCase(), "O repositório de perfil precisa ter o mesmo nome do usuário").toBe(
      usuario?.toLowerCase(),
    );
  });
});

describe("conteúdo do README de perfil", () => {
  test("começa com um título", () => {
    expect(readme().trimStart()).toMatch(/^#{1,2} .+/);
  });

  test("tem uma seção sobre você", () => {
    expect(secoes().some((s) => /sobre/.test(s))).toBe(true);
  });

  test("tem uma seção de tecnologias/habilidades", () => {
    expect(secoes().some((s) => /tecnologias|habilidades|stack|ferramentas/.test(s))).toBe(true);
  });

  test("tem uma seção do que está estudando ou dos seus objetivos", () => {
    expect(secoes().some((s) => /estudando|aprendendo|objetivo/.test(s))).toBe(true);
  });

  test("tem uma seção de contato com LinkedIn ou e-mail", () => {
    expect(secoes().some((s) => /contato|onde me encontrar|redes|fale comigo/.test(s))).toBe(true);
    expect(readme()).toMatch(/linkedin\.com|mailto:/i);
  });

  test("tem conteúdo de verdade (pelo menos 400 caracteres de texto)", () => {
    const texto = readme()
      .replace(/<[^>]+>/g, "")
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*_>`|-]/g, "");
    expect(texto.replace(/\s+/g, " ").trim().length).toBeGreaterThanOrEqual(400);
  });

  test("não tem textos de exemplo esquecidos", () => {
    expect(readme()).not.toMatch(/lorem ipsum|seu[_ -]?(nome|usu[aá]rio)/i);
    expect(readme()).not.toMatch(/\b(TODO|XXX)\b/);
  });

  test("todas as imagens têm texto alternativo", () => {
    for (const [, alt] of readme().matchAll(/!\[([^\]]*)\]\(/g)) {
      expect(alt.trim(), "Imagem em Markdown sem alt: ![](...)").not.toBe("");
    }
    for (const [tag] of readme().matchAll(/<img\b[^>]*>/gi)) {
      expect(tag, "Tag <img> sem alt").toMatch(/\balt="[^"]+"/i);
    }
  });
});
