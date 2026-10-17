import { describe, expect, test } from "vitest";
import { gerarChangelog, proximaVersaoPelosCommits, tipoDeVersao } from "./09-changelog.js";

describe("tipoDeVersao", () => {
  test("fix → patch", () => {
    expect(tipoDeVersao(["fix: corrige o frete"])).toBe("patch");
    expect(tipoDeVersao(["perf: acelera o cálculo"])).toBe("patch");
  });

  test("feat → menor (vence fix)", () => {
    expect(tipoDeVersao(["fix: corrige o frete", "feat: adiciona o filtro"])).toBe("menor");
  });

  test("breaking → maior (vence tudo), pelo ! ou pelo rodapé", () => {
    expect(tipoDeVersao(["feat: adiciona o filtro", "fix!: muda o formato"])).toBe("maior");
    expect(tipoDeVersao(["fix: ajusta tudo\n\nBREAKING CHANGE: mudou a API"])).toBe("maior");
    expect(tipoDeVersao(["chore!: remove o suporte ao Node 18"])).toBe("maior");
  });

  test("só mudanças internas → null (nada para lançar)", () => {
    expect(tipoDeVersao(["docs: atualiza o README", "chore: atualiza dependências", "test: cobre o caso vazio", "refactor: reorganiza"])).toBeNull();
    expect(tipoDeVersao([])).toBeNull();
  });

  test("ignora mensagens fora do padrão", () => {
    expect(tipoDeVersao(["Merge branch 'main' into feature", "ajustes", "fix: corrige o bug"])).toBe("patch");
    expect(tipoDeVersao(["Merge pull request #12", "wip"])).toBeNull();
  });
});

describe("proximaVersaoPelosCommits", () => {
  test("aplica o tipo de versão à versão atual", () => {
    expect(proximaVersaoPelosCommits("1.2.3", ["fix: corrige o frete"])).toBe("1.2.4");
    expect(proximaVersaoPelosCommits("1.2.3", ["fix: corrige o frete", "feat: novo filtro"])).toBe("1.3.0");
    expect(proximaVersaoPelosCommits("1.2.3", ["feat!: troca a API"])).toBe("2.0.0");
  });

  test("sem mudanças relevantes, a versão fica igual", () => {
    expect(proximaVersaoPelosCommits("1.2.3", ["docs: ajusta o README"])).toBe("1.2.3");
    expect(proximaVersaoPelosCommits("1.2.3", [])).toBe("1.2.3");
  });
});

describe("gerarChangelog", () => {
  const mensagens = [
    "feat(carrinho): permite alterar a quantidade",
    "fix: corrige o frete grátis",
    "docs: atualiza o README",
    "Merge branch 'main'",
    "perf: acelera o cálculo do imposto",
    "feat: adiciona exportação em CSV",
    "feat(api)!: troca o formato da resposta",
  ];

  test("o formato completo, com todas as seções", () => {
    expect(gerarChangelog("2.0.0", "2026-10-15", mensagens)).toBe(
      [
        "## [2.0.0] - 2026-10-15",
        "",
        "### Mudanças que quebram compatibilidade",
        "",
        "- **api:** troca o formato da resposta",
        "",
        "### Novidades",
        "",
        "- **carrinho:** permite alterar a quantidade",
        "- adiciona exportação em CSV",
        "",
        "### Correções",
        "",
        "- corrige o frete grátis",
        "",
        "### Desempenho",
        "",
        "- acelera o cálculo do imposto",
        "",
      ].join("\n"),
    );
  });

  test("seções vazias não aparecem", () => {
    expect(gerarChangelog("1.0.1", "2026-01-02", ["fix: corrige o frete", "fix(ui): alinha o botão"])).toBe(
      ["## [1.0.1] - 2026-01-02", "", "### Correções", "", "- corrige o frete", "- **ui:** alinha o botão", ""].join("\n"),
    );
  });

  test("um commit breaking aparece só na seção de quebras", () => {
    const texto = gerarChangelog("2.0.0", "2026-10-15", ["fix!: muda o formato do arquivo"]);
    expect(texto).toContain("### Mudanças que quebram compatibilidade");
    expect(texto).not.toContain("### Correções");
    expect(texto.match(/muda o formato do arquivo/g)).toHaveLength(1);
  });

  test("BREAKING CHANGE no rodapé também vai para a seção de quebras", () => {
    const texto = gerarChangelog("2.0.0", "2026-10-15", ["feat: novo comando\n\nBREAKING CHANGE: o antigo foi removido"]);
    expect(texto).toContain("### Mudanças que quebram compatibilidade\n\n- novo comando\n");
    expect(texto).not.toContain("### Novidades");
  });

  test("sem nada relevante", () => {
    expect(gerarChangelog("1.0.1", "2026-01-02", ["docs: ajusta o README", "chore: atualiza dependências"])).toBe(
      "## [1.0.1] - 2026-01-02\n\nSem mudanças relevantes para os usuários.\n",
    );
    expect(gerarChangelog("1.0.1", "2026-01-02", [])).toBe("## [1.0.1] - 2026-01-02\n\nSem mudanças relevantes para os usuários.\n");
  });

  test("termina com uma única quebra de linha", () => {
    const texto = gerarChangelog("1.0.1", "2026-01-02", ["fix: corrige o frete"]);
    expect(texto.endsWith("frete\n")).toBe(true);
    expect(texto.endsWith("\n\n")).toBe(false);
  });
});
