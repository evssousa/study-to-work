import { describe, expect, test } from "vitest";
import { arquivo, caminhoDoBin, existe, ler, lerPacote, nomeSemEscopo } from "./projeto.js";

const NOME_COM_ESCOPO = /^@[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-~][a-z0-9-._~]*$/;
const VERSAO = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?$/;

const ARQUIVOS = [
  "package.json",
  "package-lock.json",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  ".gitignore",
  ".editorconfig",
  ".prettierrc.json",
  "eslint.config.js",
  ".husky/pre-commit",
  ".github/workflows/ci.yml",
  ".github/pull_request_template.md",
  "src/cli.js",
  "src/calculos.js",
  "src/tabelas.js",
  "src/index.js",
];

describe("arquivos do projeto", () => {
  test.each(ARQUIVOS)("existe %s", (nome) => {
    expect(existe(nome), `Crie ${nome}`).toBe(true);
  });

  test("tem pelo menos 2 arquivos de teste na pasta test/", async () => {
    const { readdirSync } = await import("node:fs");
    const testes = existe("test") ? readdirSync(arquivo("test")).filter((n) => /\.test\.[cm]?js$/.test(n)) : [];
    expect(testes.length, "Escreva testes em test/*.test.js (por exemplo calculos.test.js e cli.test.js)").toBeGreaterThanOrEqual(2);
  });
});

describe("package.json — pronto para publicar", () => {
  const pacote = lerPacote();

  test("nome com escopo (@usuario/nome), para não colidir com outros pacotes", () => {
    expect(pacote.name).toMatch(NOME_COM_ESCOPO);
  });

  test("versão válida, descrição, autor e licença MIT", () => {
    expect(pacote.version).toMatch(VERSAO);
    expect(String(pacote.description ?? "").trim().length, "Escreva uma descrição de pelo menos 20 caracteres").toBeGreaterThanOrEqual(20);
    expect(String(pacote.author?.name ?? pacote.author ?? "").trim(), "Preencha o campo author").not.toBe("");
    expect(pacote.license).toBe("MIT");
  });

  test('módulos ES e não privado ("private": true impede a publicação)', () => {
    expect(pacote.type).toBe("module");
    expect(pacote.private).not.toBe(true);
  });

  test("repositório do GitHub, bugs e palavras-chave", () => {
    const url = typeof pacote.repository === "string" ? pacote.repository : pacote.repository?.url;
    expect(url ?? "", "Preencha repository").toContain("github.com");
    expect(Array.isArray(pacote.keywords) && pacote.keywords.length, "Coloque pelo menos 3 keywords").toBeGreaterThanOrEqual(3);
  });

  test("o bin aponta para um arquivo que existe e começa com o shebang do Node", () => {
    const alvo = caminhoDoBin(pacote);
    expect(alvo, 'Defina "bin": { "nome-do-comando": "src/cli.js" }').toBeTruthy();
    expect(existe(alvo)).toBe(true);
    expect(ler(alvo).split("\n")[0]).toBe("#!/usr/bin/env node");
  });

  test("o nome do comando é o nome do pacote sem o escopo", () => {
    expect(typeof pacote.bin).toBe("object");
    expect(Object.keys(pacote.bin)).toContain(nomeSemEscopo(pacote.name));
  });

  test("exports define a entrada da biblioteca e o arquivo existe", () => {
    const entrada = typeof pacote.exports === "string" ? pacote.exports : pacote.exports?.["."];
    const alvo = typeof entrada === "string" ? entrada : (entrada?.import ?? entrada?.default);
    expect(alvo, 'Defina "exports": { ".": "./src/index.js" }').toBeTruthy();
    expect(existe(alvo)).toBe(true);
  });

  test("files publica só o necessário (src e documentos) e nunca os testes", () => {
    expect(Array.isArray(pacote.files)).toBe(true);
    expect(pacote.files).toContain("src");
    for (const item of pacote.files) {
      expect(item, `"${item}" não deve ser publicado`).not.toMatch(/^(\.\/)?(test|\.github|\.husky|node_modules)/);
    }
  });

  test("engines.node exige Node 20 ou mais novo", () => {
    const minimo = Number(/(\d+)/.exec(pacote.engines?.node ?? "")?.[1]);
    expect(minimo, 'Defina "engines": { "node": ">=20" }').toBeGreaterThanOrEqual(20);
  });

  test("os scripts de qualidade e de publicação", () => {
    const { scripts = {} } = pacote;
    expect(scripts.test).toContain("node --test");
    expect(scripts.lint).toContain("eslint");
    expect(scripts.format).toContain("prettier");
    expect(scripts["format:check"]).toContain("prettier");
    expect(scripts["format:check"]).toContain("--check");
    expect(scripts.prepare).toBe("husky");
    for (const parte of ["lint", "format:check", "test"]) {
      expect(scripts.prepublishOnly ?? "", `prepublishOnly precisa rodar ${parte}`).toContain(parte);
    }
  });

  test("as ferramentas estão nas devDependencies e não há dependências de produção", () => {
    const dev = Object.keys(pacote.devDependencies ?? {});
    for (const ferramenta of ["eslint", "prettier", "husky", "lint-staged"]) {
      expect(dev, `Instale ${ferramenta} com npm install -D ${ferramenta}`).toContain(ferramenta);
    }
    expect(Object.keys(pacote.dependencies ?? {}), "O pacote deve ter ZERO dependências de produção (usa só o Node)").toEqual([]);
    for (const [nome, versao] of Object.entries(pacote.devDependencies ?? {})) {
      expect(["*", "latest", ""], `${nome} sem versão definida`).not.toContain(versao);
    }
  });

  test("lint-staged roda ESLint e Prettier nos arquivos JavaScript", () => {
    const configuracao = pacote["lint-staged"];
    expect(configuracao, 'Adicione "lint-staged" ao package.json').toBeTypeOf("object");
    const regraDeJs = Object.entries(configuracao).find(([padrao]) => padrao.includes("js"));
    const comandos = [regraDeJs?.[1]].flat().join(" ");
    expect(comandos).toContain("eslint");
    expect(comandos).toContain("prettier");
  });
});

describe("arquivos de configuração", () => {
  test("o hook do Husky roda o lint-staged", () => {
    expect(ler(".husky/pre-commit")).toContain("lint-staged");
  });

  test(".gitignore", () => {
    const texto = ler(".gitignore");
    expect(texto).toMatch(/^node_modules\/?$/m);
    expect(texto).toMatch(/^\.env$/m);
  });

  test(".editorconfig", () => {
    const texto = ler(".editorconfig");
    expect(texto).toMatch(/^root\s*=\s*true$/m);
    expect(texto).toMatch(/^indent_style\s*=\s*space$/m);
    expect(texto).toMatch(/^end_of_line\s*=\s*lf$/m);
    expect(texto).toMatch(/^charset\s*=\s*utf-8$/m);
    expect(texto).toMatch(/^insert_final_newline\s*=\s*true$/m);
  });

  test("o template de Pull Request", () => {
    const texto = ler(".github/pull_request_template.md");
    expect(texto).toMatch(/^##+ .*o que (mudou|muda)/im);
    expect(texto).toMatch(/^##+ .*como testar/im);
    expect(texto.match(/^- \[ \]/gm)?.length ?? 0, "Coloque pelo menos 3 itens de checklist (- [ ])").toBeGreaterThanOrEqual(3);
  });
});

describe("workflow de integração contínua (GitHub Actions)", () => {
  const workflow = () => ler(".github/workflows/ci.yml");

  test("roda em push e em pull request", () => {
    expect(workflow()).toMatch(/^name:\s*\S+/m);
    expect(workflow()).toMatch(/^on:/m);
    expect(workflow()).toMatch(/\bpush\b/);
    expect(workflow()).toMatch(/\bpull_request\b/);
  });

  test("faz checkout, instala o Node com cache e usa o Ubuntu", () => {
    expect(workflow()).toMatch(/actions\/checkout@v\d+/);
    expect(workflow()).toMatch(/actions\/setup-node@v\d+/);
    expect(workflow()).toMatch(/cache:\s*['"]?npm['"]?/);
    expect(workflow()).toMatch(/runs-on:\s*ubuntu-latest/);
  });

  test("testa em mais de uma versão do Node (matriz com 20 e 22)", () => {
    const texto = workflow();
    expect(texto).toMatch(/matrix:/);
    const aposAMatriz = texto.slice(texto.indexOf("matrix:"));
    expect(aposAMatriz).toMatch(/\b20\b/);
    expect(aposAMatriz).toMatch(/\b22\b/);
    expect(texto).toMatch(/node-version:\s*\$\{\{\s*matrix\.node-version\s*\}\}/);
  });

  test("instala com npm ci e roda lint, formatação e testes", () => {
    const texto = workflow();
    expect(texto).toMatch(/run:\s*npm ci\b/);
    expect(texto).toMatch(/run:\s*npm run lint\b/);
    expect(texto).toMatch(/run:\s*npm run format:check\b/);
    expect(texto).toMatch(/run:\s*npm (run )?test\b/);
  });
});

describe("documentos", () => {
  const pacote = lerPacote();

  test("LICENSE é a MIT, com ano e nome", () => {
    const texto = ler("LICENSE");
    expect(texto).toMatch(/^MIT License/m);
    expect(texto).toContain("Permission is hereby granted");
    const copyright = /Copyright \(c\) (\d{4}) (.+)/.exec(texto);
    expect(copyright, "Falta a linha: Copyright (c) ANO Seu Nome").not.toBeNull();
    expect(Number(copyright[1])).toBeGreaterThanOrEqual(2024);
    expect(copyright[2]).not.toMatch(/\[|<|fullname|seu nome|your name/i);
  });

  test("CHANGELOG no formato Keep a Changelog, com a versão atual", () => {
    const texto = ler("CHANGELOG.md");
    expect(texto).toMatch(/^# Changelog/m);
    expect(texto, "Falta a seção [Unreleased] (ou [Não lançado])").toMatch(/^## \[(Unreleased|Não lançado)\]/m);
    const entrada = new RegExp(`^## \\[${pacote.version.replaceAll(".", "\\.")}\\] - \\d{4}-\\d{2}-\\d{2}$`, "m");
    expect(texto, `Falta a entrada: ## [${pacote.version}] - AAAA-MM-DD`).toMatch(entrada);
    const depois = texto.slice(texto.search(entrada));
    expect(depois).toMatch(/^### /m);
  });

  test("README: instalação com npx, uso, opções, biblioteca, desenvolvimento e licença", () => {
    const texto = ler("README.md");
    expect(texto).toMatch(/^# .+/m);
    expect(texto, `Mostre como usar sem instalar: npx ${pacote.name}`).toContain(`npx ${pacote.name}`);
    expect(texto).toContain("npm install");
    for (const [secao, padrao] of [
      ["Instalação", /^##+ .*instala/im],
      ["Uso", /^##+ .*uso/im],
      ["Opções", /^##+ .*op[cç][õo]es/im],
      ["Uso como biblioteca", /^##+ .*bibliotec/im],
      ["Desenvolvimento", /^##+ .*(desenvolvimento|contribu)/im],
      ["Licença", /^##+ .*licen[cç]a/im],
    ]) {
      expect(texto, `Falta a seção "${secao}" no README`).toMatch(padrao);
    }
    expect(texto).toContain("--json");
  });

  test("README: badge da versão no npm", () => {
    expect(ler("README.md")).toContain(`img.shields.io/npm/v/${pacote.name}`);
  });
});
