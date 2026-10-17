import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { solucoes } from "./comandos.js";

const pastasTemporarias = [];
afterAll(() => pastasTemporarias.forEach((p) => rmSync(p, { recursive: true, force: true })));

// Um arquivo de configuração vazio, para o Git ignorar a configuração pessoal de quem roda o teste.
// (No Windows, o os.devNull não funciona para isso, por isso criamos um arquivo de verdade.)
const pastaDaConfiguracao = mkdtempSync(path.join(os.tmpdir(), "dojo-config-"));
pastasTemporarias.push(pastaDaConfiguracao);
const configuracaoVazia = path.join(pastaDaConfiguracao, "gitconfig");
writeFileSync(configuracaoVazia, "");

const AMBIENTE = {
  ...process.env,
  GIT_EDITOR: ":", // se algum comando tentar abrir o editor, ele "aceita" a mensagem padrão
  GIT_TERMINAL_PROMPT: "0",
  GIT_CONFIG_GLOBAL: configuracaoVazia,
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_AUTHOR_NAME: "Aluno",
  GIT_AUTHOR_EMAIL: "aluno@exemplo.com",
  GIT_COMMITTER_NAME: "Aluno",
  GIT_COMMITTER_EMAIL: "aluno@exemplo.com",
};

function git(pasta, ...argumentos) {
  return execFileSync("git", argumentos, { cwd: pasta, env: AMBIENTE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function novoRepositorio() {
  const pasta = mkdtempSync(path.join(os.tmpdir(), "dojo-git-"));
  pastasTemporarias.push(pasta);
  git(pasta, "init", "-b", "main");
  git(pasta, "config", "commit.gpgsign", "false");
  git(pasta, "config", "core.autocrlf", "false");
  return pasta;
}

function commitar(pasta, arquivos, mensagem) {
  for (const [nome, conteudo] of Object.entries(arquivos)) writeFileSync(path.join(pasta, nome), conteudo);
  git(pasta, "add", "--all");
  git(pasta, "commit", "-m", mensagem);
}

const ler = (pasta, arquivo) => readFileSync(path.join(pasta, arquivo), "utf8");
const assunto = (pasta, referencia = "HEAD") => git(pasta, "log", "-1", "--format=%s", referencia);
const contar = (pasta, intervalo = "HEAD") => Number(git(pasta, "rev-list", "--count", intervalo));
const ramaAtual = (pasta) => git(pasta, "branch", "--show-current");

// ---- executar os comandos escritos pelo aluno ----

function dividirComando(comando) {
  const partes = [];
  let atual = "";
  let aspas = null;
  for (const caractere of comando) {
    if (aspas) {
      if (caractere === aspas) aspas = null;
      else atual += caractere;
    } else if (caractere === '"' || caractere === "'") {
      aspas = caractere;
    } else if (/\s/.test(caractere)) {
      if (atual !== "") partes.push(atual);
      atual = "";
    } else {
      atual += caractere;
    }
  }
  if (aspas) throw new Error(`Aspas sem fechar em: ${comando}`);
  if (atual !== "") partes.push(atual);
  return partes;
}

function executar(pasta, comandos, cenario) {
  expect(Array.isArray(comandos) && comandos.length > 0, `Escreva os comandos do cenário "${cenario}" em comandos.js`).toBe(true);
  for (const comando of comandos) {
    expect(typeof comando, `Cada comando é um texto (cenário "${cenario}")`).toBe("string");
    if (/&&|\|\||;|\||>|<|`|\$\(/.test(comando)) {
      throw new Error(`Um comando por item, sem encadear: "${comando}"`);
    }
    const [programa, ...argumentos] = dividirComando(comando);
    if (programa !== "git") throw new Error(`O comando precisa começar com git: "${comando}"`);
    if (argumentos.some((a) => ["-i", "--interactive"].includes(a))) throw new Error(`Nada interativo aqui: "${comando}"`);
    if (["push", "pull", "fetch", "clone", "remote"].includes(argumentos[0])) throw new Error(`Este exercício é local, sem rede: "${comando}"`);
    try {
      git(pasta, ...argumentos);
    } catch (erro) {
      throw new Error(`O comando falhou: ${comando}\n${erro.stderr || erro.message}`);
    }
  }
}

// ---- os cenários ----

describe("dojo de Git", { timeout: 60_000 }, () => {
  test("1. mensagem: corrigir a mensagem do último commit", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "README.md": "# Loja\n" }, "chore: inicia o projeto");
    commitar(pasta, { "desconto.js": "export const desconto = 0.1;\n" }, "adiciona calculo de desconto");
    const anterior = git(pasta, "rev-parse", "HEAD~1");
    const conteudo = git(pasta, "rev-parse", "HEAD^{tree}");

    executar(pasta, solucoes.mensagem, "mensagem");

    expect(assunto(pasta)).toBe("feat: adiciona calculo de desconto");
    expect(contar(pasta), "O número de commits não pode mudar").toBe(2);
    expect(git(pasta, "rev-parse", "HEAD~1"), "O commit anterior não pode ser mexido").toBe(anterior);
    expect(git(pasta, "rev-parse", "HEAD^{tree}"), "O conteúdo do commit não pode mudar").toBe(conteudo);
  });

  test("2. desfazer: reverter um commit já publicado, sem reescrever a história", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "imposto.js": "export const IMPOSTO = 0.15;\n" }, "chore: inicia o projeto");
    commitar(pasta, { "imposto.js": "export const IMPOSTO = 0.5;\n" }, "fix: ajusta o imposto");
    const comBug = git(pasta, "rev-parse", "HEAD");

    executar(pasta, solucoes.desfazer, "desfazer");

    expect(contar(pasta), "Deve haver um commit NOVO (3 no total)").toBe(3);
    expect(() => git(pasta, "merge-base", "--is-ancestor", comBug, "HEAD"), "O commit antigo precisa continuar na história").not.toThrow();
    expect(ler(pasta, "imposto.js")).toBe("export const IMPOSTO = 0.15;\n");
    expect(assunto(pasta)).toBe('Revert "fix: ajusta o imposto"');
    expect(git(pasta, "status", "--porcelain")).toBe("");
  });

  test("3. urgencia: guardar o trabalho, resolver o hotfix e voltar", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "relatorio.js": "export const relatorio = [];\n" }, "chore: inicia o projeto");
    git(pasta, "switch", "-c", "feature/relatorio");
    const emAndamento = "export const relatorio = [];\n// em andamento\n";
    writeFileSync(path.join(pasta, "relatorio.js"), emAndamento);
    const pontaDaFeature = git(pasta, "rev-parse", "HEAD");

    executar(pasta, solucoes.urgencia, "urgencia");

    expect(ramaAtual(pasta), "Você precisa terminar na branch feature/relatorio").toBe("feature/relatorio");
    expect(assunto(pasta, "main"), "Falta o commit do hotfix na main").toBe("fix: hotfix urgente");
    expect(ler(pasta, "relatorio.js"), "O trabalho pela metade precisa estar de volta").toBe(emAndamento);
    expect(git(pasta, "stash", "list"), "Não pode sobrar nada guardado").toBe("");
    expect(git(pasta, "rev-parse", "HEAD"), "A branch feature não ganha commits").toBe(pontaDaFeature);
  });

  test("4. umCommit: trazer só um commit de outra branch", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "calc.js": "export const arredondar = (n) => Math.floor(n);\n" }, "chore: inicia o projeto");
    git(pasta, "switch", "-c", "experimento");
    commitar(pasta, { "a.txt": "ideia A\n" }, "feat: ideia A");
    commitar(pasta, { "calc.js": "export const arredondar = (n) => Math.round(n);\n" }, "fix: corrige arredondamento");
    commitar(pasta, { "b.txt": "ideia B\n" }, "feat: ideia B");
    const pontaDoExperimento = git(pasta, "rev-parse", "experimento");
    git(pasta, "switch", "main");

    executar(pasta, solucoes.umCommit, "umCommit");

    expect(ramaAtual(pasta)).toBe("main");
    expect(contar(pasta, "main"), "A main deve ganhar exatamente 1 commit").toBe(2);
    expect(assunto(pasta)).toBe("fix: corrige arredondamento");
    expect(ler(pasta, "calc.js")).toContain("Math.round");
    expect(existsSync(path.join(pasta, "a.txt")), "A ideia A não deve vir junto").toBe(false);
    expect(existsSync(path.join(pasta, "b.txt")), "A ideia B não deve vir junto").toBe(false);
    expect(git(pasta, "rev-parse", "experimento"), "A branch experimento não pode ser alterada").toBe(pontaDoExperimento);
  });

  test("5. limpar: descartar alterações e apagar arquivo solto", () => {
    const pasta = novoRepositorio();
    const original = "export const modo = 'prod';\n";
    commitar(pasta, { "config.js": original }, "chore: inicia o projeto");
    writeFileSync(path.join(pasta, "config.js"), "export const modo = 'teste-do-fulano';\n");
    writeFileSync(path.join(pasta, "rascunho.txt"), "anotações soltas\n");

    executar(pasta, solucoes.limpar, "limpar");

    expect(git(pasta, "status", "--porcelain"), "O git status precisa estar limpo").toBe("");
    expect(ler(pasta, "config.js")).toBe(original);
    expect(existsSync(path.join(pasta, "rascunho.txt"))).toBe(false);
    expect(git(pasta, "stash", "list"), "Descartar não é guardar: não pode sobrar nada no stash").toBe("");
  });

  test("6. segredo: tirar o .env do commit sem apagá-lo do disco", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "README.md": "# API\n" }, "chore: inicia o projeto");
    commitar(pasta, { "api.js": "export const url = process.env.API_URL;\n", ".env": "API_KEY=senha-super-secreta\n" }, "feat: configura a API");

    executar(pasta, solucoes.segredo, "segredo");

    const arquivosNoCommit = git(pasta, "ls-tree", "-r", "--name-only", "HEAD").split("\n");
    expect(arquivosNoCommit, "O .env não pode mais estar no commit").not.toContain(".env");
    expect(arquivosNoCommit, "O api.js tem que continuar no commit").toContain("api.js");
    expect(existsSync(path.join(pasta, ".env")), "O .env precisa continuar no seu disco").toBe(true);
    expect(ler(pasta, ".env")).toBe("API_KEY=senha-super-secreta\n");
    expect(assunto(pasta), "A mensagem do commit continua a mesma").toBe("feat: configura a API");
    expect(contar(pasta), "Não pode ter commit a mais nem a menos").toBe(2);
    expect(git(pasta, "log", "--all", "--format=%H", "--", ".env"), "O .env não pode existir em nenhum commit da história").toBe("");
  });

  test("7. historiaLinear: rebase da feature sobre a main atualizada", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "README.md": "# App\n" }, "chore: inicia o projeto");
    git(pasta, "switch", "-c", "feature");
    commitar(pasta, { "feature.txt": "1\n" }, "feat: primeira parte");
    commitar(pasta, { "feature.txt": "1\n2\n" }, "feat: segunda parte");
    git(pasta, "switch", "main");
    commitar(pasta, { "main.txt": "novidade na main\n" }, "fix: ajuste na main");
    git(pasta, "switch", "feature");

    executar(pasta, solucoes.historiaLinear, "historiaLinear");

    expect(ramaAtual(pasta)).toBe("feature");
    expect(git(pasta, "merge-base", "main", "feature"), "Os commits da feature precisam ficar POR CIMA da ponta atual da main").toBe(git(pasta, "rev-parse", "main"));
    expect(contar(pasta, "main..feature")).toBe(2);
    expect(contar(pasta, "main"), "A main não pode mudar").toBe(2);
    expect(git(pasta, "rev-list", "--merges", "--count", "feature")).toBe("0");
    expect(git(pasta, "log", "-2", "--format=%s", "feature").split("\n")).toEqual(["feat: segunda parte", "feat: primeira parte"]);
    expect(existsSync(path.join(pasta, "main.txt")), "O trabalho novo da main precisa estar na feature").toBe(true);
  });

  test("8. versao: uma tag anotada", () => {
    const pasta = novoRepositorio();
    commitar(pasta, { "README.md": "# App\n" }, "chore: inicia o projeto");
    commitar(pasta, { "app.js": "export const app = 1;\n" }, "feat: primeira funcionalidade");

    executar(pasta, solucoes.versao, "versao");

    expect(git(pasta, "tag", "--list", "v1.0.0")).toBe("v1.0.0");
    expect(git(pasta, "cat-file", "-t", "refs/tags/v1.0.0"), "A tag precisa ser ANOTADA (git tag -a)").toBe("tag");
    expect(git(pasta, "rev-parse", "v1.0.0^{commit}")).toBe(git(pasta, "rev-parse", "HEAD"));
    expect(git(pasta, "for-each-ref", "--format=%(contents:subject)", "refs/tags/v1.0.0")).toBe("Primeira versão");
  });
});
