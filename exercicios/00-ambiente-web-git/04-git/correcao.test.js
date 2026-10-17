import { describe, expect, test } from "vitest";
import { caminhoAoLado, existe, lerTexto } from "../../../suporte/arquivos.js";
import { git, padraoConventionalCommit } from "../../../suporte/git.js";

const ARQUIVO = "exercicios/00-ambiente-web-git/04-git/sobre-mim.md";
const caminhoDoArquivo = caminhoAoLado(import.meta.url, "sobre-mim.md");

// Este exercício confere o SEU repositório, então não existe gabarito para ele.
describe.skipIf(process.env.GABARITO === "1")("git na prática", () => {
  test("o curso está dentro de um repositório Git", () => {
    expect(git("rev-parse", "--is-inside-work-tree"), "Rode git init ou clone o repositório").toBe("true");
  });

  test("1. user.name e user.email estão configurados", () => {
    expect(git("config", "user.name"), "Configure: git config --global user.name").toBeTruthy();
    expect(git("config", "user.email"), "Configure: git config --global user.email").toMatch(/@/);
  });

  test("2. a branch pratica/git existe", () => {
    expect(git("branch", "--all", "--list", "*pratica/git")).toContain("pratica/git");
  });

  test("3. sobre-mim.md tem título e pelo menos 3 linhas de texto", () => {
    expect(existe(caminhoDoArquivo), `Crie ${ARQUIVO}`).toBe(true);
    const linhas = lerTexto(caminhoDoArquivo).split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    expect(lerTexto(caminhoDoArquivo)).toMatch(/^# .+/m);
    expect(linhas.length).toBeGreaterThanOrEqual(3);
  });

  test('5. tem a seção "## Meus objetivos"', () => {
    expect(lerTexto(caminhoDoArquivo)).toMatch(/^## Meus objetivos/m);
  });

  test("4 e 5. o arquivo tem pelo menos 2 commits", () => {
    const commits = (git("log", "--format=%s", "--", ARQUIVO) ?? "").split("\n").filter(Boolean);
    expect(commits.length, "Faça os dois commits pedidos").toBeGreaterThanOrEqual(2);
  });

  test("4 e 5. as mensagens seguem o Conventional Commits (ex.: docs: ...)", () => {
    const commits = (git("log", "--format=%s", "--", ARQUIVO) ?? "").split("\n").filter(Boolean);
    for (const mensagem of commits) {
      expect(mensagem, `"${mensagem}" não segue o padrão tipo: descrição`).toMatch(padraoConventionalCommit);
    }
  });

  test("não há mudanças esquecidas sem commit no arquivo", () => {
    expect(git("status", "--porcelain", "--", ARQUIVO)).toBe("");
  });

  test("6. as mudanças chegaram na branch principal", () => {
    const principal = git("rev-parse", "--verify", "--quiet", "main") ? "main" : "master";
    expect(git("log", principal, "--format=%h", "--", ARQUIVO), "Faça o merge na main").toBeTruthy();
  });

  test("7. o repositório está ligado ao GitHub (remote origin)", () => {
    expect(git("remote", "get-url", "origin") ?? "").toContain("github.com");
  });
});
