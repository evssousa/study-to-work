import path from "node:path";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";
import { carregarPagina, listarMedias, listarRegras, valorCSS } from "../../../suporte/html.js";

const { document, html } = carregarPagina(caminhoDoProjeto("index.html"));
const meta = (seletor) => document.querySelector(seletor)?.getAttribute("content")?.trim() ?? "";
const folhasLocais = [...document.querySelectorAll('link[rel="stylesheet"]')]
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && !/^(https?:)?\/\//.test(href));
const textoDoCss = () => folhasLocais.map((href) => lerTexto(path.join(caminhoDoProjeto(), href))).join("\n");
const regras = () => listarRegras(document);

describe("<head>: SEO e compartilhamento", () => {
  test('lang="pt-BR", charset utf-8 e viewport', () => {
    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR");
    expect(document.querySelector("meta[charset]")?.getAttribute("charset").toLowerCase()).toBe("utf-8");
    expect(meta('meta[name="viewport"]')).toContain("width=device-width");
  });

  test("title com seu nome", () => {
    expect(document.title.trim().length).toBeGreaterThan(3);
  });

  test("meta description entre 50 e 160 caracteres (o tamanho que o Google mostra)", () => {
    const descricao = meta('meta[name="description"]');
    expect(descricao.length).toBeGreaterThanOrEqual(50);
    expect(descricao.length).toBeLessThanOrEqual(160);
  });

  test("Open Graph para a prévia do link no LinkedIn e no WhatsApp", () => {
    expect(meta('meta[property="og:title"]')).not.toBe("");
    expect(meta('meta[property="og:description"]')).not.toBe("");
    expect(meta('meta[property="og:image"]')).not.toBe("");
  });

  test("tem favicon", () => {
    expect(document.querySelector('link[rel~="icon"]')).not.toBeNull();
  });
});

describe("estrutura e conteúdo", () => {
  test("o primeiro link da página é o 'pular para o conteúdo'", () => {
    const primeiro = document.querySelector("body a");
    const alvo = primeiro?.getAttribute("href") ?? "";
    expect(alvo, "O primeiro <a> do body deve ser um link para o conteúdo (#conteudo)").toMatch(/^#[\w-]+$/);
    expect(document.querySelector(alvo), `Não existe elemento com id ${alvo}`).not.toBeNull();
  });

  test("header com nav de pelo menos 3 links para seções da página", () => {
    const links = [...document.querySelectorAll("header nav a")];
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      const href = link.getAttribute("href");
      expect(href, "Os links do menu apontam para seções: #sobre, #projetos...").toMatch(/^#/);
      expect(document.querySelector(href), `Não existe elemento com id ${href}`).not.toBeNull();
    }
  });

  test("um único <h1>", () => {
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });

  test.each(["sobre", "projetos", "contato"])("main tem a seção #%s com um <h2>", (id) => {
    expect(document.querySelector(`main section#${id} h2`)).not.toBeNull();
  });

  test("#projetos tem pelo menos 1 projeto em <article>, com <h3> e link", () => {
    const projetos = document.querySelectorAll("#projetos article");
    expect(projetos.length).toBeGreaterThanOrEqual(1);
    for (const projeto of projetos) {
      expect(projeto.querySelector("h3")).not.toBeNull();
      expect(projeto.querySelector("a[href]")).not.toBeNull();
    }
  });

  test("#contato tem e-mail, LinkedIn e GitHub", () => {
    const hrefs = [...document.querySelectorAll("#contato a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h.startsWith("mailto:"))).toBe(true);
    expect(hrefs.some((h) => h.includes("linkedin.com"))).toBe(true);
    expect(hrefs.some((h) => h.includes("github.com"))).toBe(true);
  });

  test("tem <footer>", () => {
    expect(document.querySelector("footer")).not.toBeNull();
  });

  test("os níveis de título não pulam", () => {
    const niveis = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < niveis.length; i++) expect(niveis[i] - niveis[i - 1]).toBeLessThanOrEqual(1);
  });

  test("não tem texto de exemplo esquecido", () => {
    expect(document.body.textContent).not.toMatch(/lorem ipsum|seu nome aqui/i);
    expect(document.body.textContent).not.toMatch(/\bTODO\b/);
  });
});

describe("acessibilidade", () => {
  test("todas as imagens têm alt, width e height (evita a página 'pular' ao carregar)", () => {
    for (const imagem of document.querySelectorAll("img")) {
      const nome = imagem.getAttribute("src");
      expect(imagem.hasAttribute("alt"), `${nome} sem alt`).toBe(true);
      expect(imagem.hasAttribute("width") && imagem.hasAttribute("height"), `${nome} sem width/height`).toBe(true);
    }
  });

  test("links que abrem nova aba usam rel=noopener", () => {
    for (const link of document.querySelectorAll('a[target="_blank"]')) {
      expect(link.getAttribute("rel") ?? "").toContain("noopener");
    }
  });

  test('nenhum link com texto genérico ("clique aqui", "saiba mais")', () => {
    for (const link of document.querySelectorAll("a")) {
      const texto = (link.textContent.trim() || link.getAttribute("aria-label") || "").toLowerCase();
      expect(texto, `Link para ${link.getAttribute("href")} sem texto`).not.toBe("");
      expect(texto).not.toMatch(/^(clique aqui|aqui|saiba mais|leia mais)$/);
    }
  });

  test("nada de onclick em div/span e nada de tabindex positivo", () => {
    expect(document.querySelectorAll("div[onclick], span[onclick]")).toHaveLength(0);
    for (const el of document.querySelectorAll("[tabindex]")) {
      expect(Number(el.getAttribute("tabindex"))).toBeLessThanOrEqual(0);
    }
  });

  test("todo campo de formulário (se houver) tem label", () => {
    for (const campo of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
      const id = campo.getAttribute("id");
      const temLabel = (id && document.querySelector(`label[for="${id}"]`)) || campo.closest("label");
      expect(temLabel, `Campo ${campo.getAttribute("name")} sem label`).toBeTruthy();
    }
  });
});

describe("CSS", () => {
  test("usa pelo menos uma folha de estilo local", () => {
    expect(folhasLocais.length).toBeGreaterThan(0);
    for (const href of folhasLocais) expect(existe(path.join(caminhoDoProjeto(), href)), `${href} não existe`).toBe(true);
  });

  test("sem estilo inline (atributo style) e sem !important", () => {
    expect(document.querySelectorAll("[style]")).toHaveLength(0);
    expect(textoDoCss()).not.toContain("!important");
  });

  test("define pelo menos 3 variáveis no :root", () => {
    const raiz = regras().find((r) => r.seletor === ":root" && r.media === null);
    const variaveis = raiz ? [...raiz.estilo].filter((p) => p.startsWith("--")) : [];
    expect(variaveis.length).toBeGreaterThanOrEqual(3);
  });

  test("é responsivo e mobile first (media queries com min-width)", () => {
    const medias = listarMedias(document);
    expect(medias.some((m) => m.includes("min-width"))).toBe(true);
    expect(medias.some((m) => m.includes("max-width"))).toBe(false);
  });

  test("tem tema escuro automático", () => {
    expect(listarMedias(document).some((m) => m.includes("prefers-color-scheme:dark"))).toBe(true);
  });

  test("usa flexbox ou grid", () => {
    expect(regras().some((r) => ["flex", "grid"].includes(r.estilo.getPropertyValue("display")))).toBe(true);
  });

  test("imagens fluidas", () => {
    expect(valorCSS(document, "img", "max-width")).toBe("100%");
  });

  test("foco visível para quem navega pelo teclado", () => {
    expect(regras().some((r) => r.seletor.includes(":focus-visible"))).toBe(true);
  });

  test("se houver animação ou transição, respeita prefers-reduced-motion", () => {
    const temMovimento = regras().some(
      (r) => r.estilo.getPropertyValue("transition") || r.estilo.getPropertyValue("animation"),
    );
    if (temMovimento) {
      expect(listarMedias(document).some((m) => m.includes("prefers-reduced-motion:reduce"))).toBe(true);
    }
  });
});

describe("README e publicação", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("README com título e link do site publicado no GitHub Pages", () => {
    expect(readme()).toMatch(/^# .+/m);
    expect(readme()).toMatch(/https:\/\/[\w-]+\.github\.io/);
  });

  test("README tem um print do site", () => {
    expect(readme()).toMatch(/!\[[^\]]+\]\([^)]+\)/);
  });

  test("README lista as tecnologias usadas", () => {
    expect(readme()).toMatch(/^##+ .*(tecnologias|stack|ferramentas)/im);
  });

  test("o HTML não está vazio (pelo menos 2 KB)", () => {
    expect(html.length).toBeGreaterThan(2000);
  });
});
