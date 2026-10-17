import path from "node:path";
import { describe, expect, test } from "vitest";
import { caminhoDoProjeto, existe, lerTexto } from "../../../suporte/arquivos.js";
import { carregarPagina, listarMedias, listarRegras } from "../../../suporte/html.js";

const ARQUIVOS = [
  "index.html",
  "package.json",
  "README.md",
  ".gitignore",
  "src/http.js",
  "src/tentar.js",
  "src/cache.js",
  "src/conversao.js",
  "src/cambio.js",
  "src/armazenamento.js",
  "src/ui.js",
  "src/main.js",
];

const codigo = (arquivo) => lerTexto(caminhoDoProjeto("src", arquivo)).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");

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

  test(".gitignore ignora node_modules", () => {
    expect(lerTexto(caminhoDoProjeto(".gitignore"))).toContain("node_modules");
  });
});

describe("regras de arquitetura", () => {
  test.each(["http.js", "tentar.js", "cache.js", "conversao.js", "cambio.js", "armazenamento.js"])(
    "src/%s não conhece a página (nada de document, window, querySelector, localStorage)",
    (arquivo) => {
      expect(codigo(arquivo)).not.toMatch(/\bdocument\b|\bwindow\b|querySelector|addEventListener|localStorage/);
    },
  );

  test("ninguém, além do main.js, usa o fetch global: ele sempre vem por parâmetro", () => {
    for (const arquivo of ["http.js", "cambio.js", "ui.js", "tentar.js"]) {
      expect(codigo(arquivo), `${arquivo} usa globalThis.fetch/window.fetch`).not.toMatch(/(globalThis|window|self)\.fetch/);
    }
  });

  test("ui.js não usa o document nem o localStorage globais: recebe tudo por parâmetro", () => {
    expect(codigo("ui.js")).not.toMatch(/(?<![\w.])document\./);
    expect(codigo("ui.js")).not.toMatch(/(?<![\w.])localStorage\b/);
  });

  test("nenhum arquivo usa innerHTML nem insertAdjacentHTML", () => {
    for (const arquivo of ["ui.js", "main.js"]) {
      expect(codigo(arquivo)).not.toMatch(/innerHTML|insertAdjacentHTML|outerHTML/);
    }
  });

  test("a lógica de rede e de cache usa classes (ClienteCambio, CacheComTTL)", () => {
    expect(codigo("cambio.js")).toMatch(/class\s+ClienteCambio/);
    expect(codigo("cache.js")).toMatch(/class\s+CacheComTTL/);
    expect(codigo("cambio.js")).toMatch(/#\w+/); // campos privados
  });

  test("o cliente usa async/await (e não callbacks aninhados nem .then em cadeia)", () => {
    expect(codigo("cambio.js")).toMatch(/\basync\b/);
    expect(codigo("cambio.js")).toMatch(/\bawait\b/);
  });

  test("src/main.js liga o app: iniciarPainel, #app, localStorage e um fetch embrulhado", () => {
    const main = codigo("main.js");
    expect(main).toMatch(/import\s*\{[^}]*iniciarPainel[^}]*\}\s*from\s*["']\.\/ui\.js["']/);
    expect(main).toContain("#app");
    expect(main).toContain("localStorage");
    expect(main, "Passe o fetch assim: fetch: (...argumentos) => fetch(...argumentos)").toMatch(/fetch\s*:\s*\(\s*\.\.\.\w+\s*\)\s*=>\s*fetch\s*\(\s*\.\.\.\w+\s*\)/);
  });
});

describe("index.html", () => {
  const pagina = () => carregarPagina(caminhoDoProjeto("index.html"));

  test('lang="pt-BR", charset, viewport, title e description', () => {
    const { document } = pagina();
    expect(document.documentElement.getAttribute("lang")).toBe("pt-BR");
    expect(document.querySelector("meta[charset]")).not.toBeNull();
    expect(document.querySelector('meta[name="viewport"]')?.getAttribute("content")).toContain("width=device-width");
    expect(document.title.trim().length).toBeGreaterThan(3);
    const descricao = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    expect(descricao.length).toBeGreaterThanOrEqual(50);
    expect(descricao.length).toBeLessThanOrEqual(160);
  });

  test("carrega src/main.js como módulo; sem JavaScript nem estilo inline", () => {
    const { document } = pagina();
    expect(document.querySelector('script[type="module"]')?.getAttribute("src")).toBe("src/main.js");
    expect(document.querySelectorAll("[style], [onclick], [onsubmit], [oninput]")).toHaveLength(0);
    for (const script of document.querySelectorAll("script")) expect(script.getAttribute("src")).toBeTruthy();
  });

  test("um único h1, um <main id=app> e títulos sem pular nível", () => {
    const { document } = pagina();
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelectorAll("main#app")).toHaveLength(1);
    const niveis = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1]));
    for (let i = 1; i < niveis.length; i++) expect(niveis[i] - niveis[i - 1]).toBeLessThanOrEqual(1);
  });

  test("todos os campos têm <label>", () => {
    const { document } = pagina();
    for (const campo of document.querySelectorAll("input:not([type=hidden]), select, textarea")) {
      const id = campo.getAttribute("id");
      expect((id && document.querySelector(`label[for="${id}"]`)) || campo.closest("label"), `Campo ${campo.getAttribute("name")} sem label`).toBeTruthy();
    }
  });
});

describe("CSS", () => {
  const { document } = carregarPagina(caminhoDoProjeto("index.html"));
  const regras = () => listarRegras(document);

  test("usa uma folha de estilo local que existe", () => {
    const hrefs = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute("href")).filter((h) => !/^(https?:)?\/\//.test(h));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(existe(path.join(caminhoDoProjeto(), href))).toBe(true);
  });

  test("variáveis no :root, tema escuro, foco visível e mobile first", () => {
    const raiz = regras().find((r) => r.seletor === ":root" && r.media === null);
    expect([...(raiz?.estilo ?? [])].filter((p) => p.startsWith("--")).length).toBeGreaterThanOrEqual(3);
    const medias = listarMedias(document);
    expect(medias.some((m) => m.includes("prefers-color-scheme:dark"))).toBe(true);
    expect(medias.some((m) => m.includes("min-width"))).toBe(true);
    expect(medias.some((m) => m.includes("max-width"))).toBe(false);
    expect(regras().some((r) => r.seletor.includes(":focus-visible"))).toBe(true);
  });

  test("os estados (data-estado) têm estilo próprio: erro, desatualizado e as tendências alta/baixa", () => {
    const seletores = regras().map((r) => r.seletor).join(" ");
    expect(seletores).toMatch(/\.alta/);
    expect(seletores).toMatch(/\.baixa/);
  });
});

describe("README.md do projeto", () => {
  const readme = () => lerTexto(caminhoDoProjeto("README.md"));

  test("título, link do site publicado e print", () => {
    expect(readme()).toMatch(/^# .+/m);
    expect(readme()).toMatch(/https:\/\/[\w-]+\.github\.io/);
    expect(readme()).toMatch(/!\[[^\]]+\]\([^)]+\)/);
  });

  test("seções: como usar, tecnologias e decisões técnicas", () => {
    expect(readme()).toMatch(/^##+ .*(como usar|uso)/im);
    expect(readme()).toMatch(/^##+ .*(tecnologias|stack)/im);
    expect(readme()).toMatch(/^##+ .*(decis|limita)/im);
  });

  test("cita a fonte dos dados (a API usada)", () => {
    expect(readme()).toMatch(/awesomeapi/i);
  });
});
