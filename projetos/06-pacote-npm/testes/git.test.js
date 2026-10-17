import { describe, expect, test } from "vitest";
import { existe, git, lerPacote } from "./projeto.js";

const COMMIT_CONVENCIONAL = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([\w\-./]+\))?!?: .{3,}/;

describe("histórico do Git do projeto", () => {
  test("é um repositório Git", () => {
    expect(existe(".git"), "Rode `git init` na pasta do projeto").toBe(true);
  });

  test("tem pelo menos 6 commits e TODOS seguem o Conventional Commits", () => {
    const mensagens = git("log", "--format=%s").split("\n").filter(Boolean);
    expect(mensagens.length, "Faça commits pequenos e frequentes (pelo menos 6)").toBeGreaterThanOrEqual(6);
    for (const mensagem of mensagens) {
      expect(mensagem, `O commit "${mensagem}" não segue o padrão tipo(escopo): descrição`).toMatch(COMMIT_CONVENCIONAL);
    }
  });

  test("o histórico mostra o trabalho: tem pelo menos um feat, um test e um ci (ou build)", () => {
    const tipos = git("log", "--format=%s")
      .split("\n")
      .map((m) => /^(\w+)/.exec(m)?.[1]);
    expect(tipos).toContain("feat");
    expect(tipos).toContain("test");
    expect(tipos.some((t) => t === "ci" || t === "build")).toBe(true);
  });

  test("tudo está commitado (git status limpo)", () => {
    expect(git("status", "--porcelain"), "Há arquivos modificados ou novos sem commit").toBe("");
  });

  test("não há arquivos que não deveriam estar no Git (node_modules, .env)", () => {
    const rastreados = git("ls-files").split("\n");
    expect(rastreados.some((a) => a.startsWith("node_modules/"))).toBe(false);
    expect(rastreados).not.toContain(".env");
    expect(rastreados, "O package-lock.json DEVE ser versionado").toContain("package-lock.json");
  });

  test("a versão do package.json tem uma tag anotada vX.Y.Z", () => {
    const { version } = lerPacote();
    const tag = `v${version}`;
    expect(git("tag", "--list", tag), `Crie a tag: git tag -a ${tag} -m "Versão ${version}"`).toBe(tag);
    expect(git("cat-file", "-t", `refs/tags/${tag}`), "A tag precisa ser anotada (git tag -a)").toBe("tag");
    expect(() => git("merge-base", "--is-ancestor", `${tag}^{commit}`, "HEAD")).not.toThrow();
  });
});
