import { describe, expect, test } from "vitest";
import { analisarCommit } from "./08-commits.js";

describe("analisarCommit — mensagens válidas", () => {
  test("tipo e descrição", () => {
    expect(analisarCommit("fix: corrige o frete grátis")).toEqual({
      tipo: "fix",
      escopo: null,
      breaking: false,
      descricao: "corrige o frete grátis",
      corpo: null,
    });
  });

  test("com escopo", () => {
    expect(analisarCommit("feat(carrinho): permite alterar a quantidade")).toEqual({
      tipo: "feat",
      escopo: "carrinho",
      breaking: false,
      descricao: "permite alterar a quantidade",
      corpo: null,
    });
  });

  test("escopo com hífen e barra", () => {
    expect(analisarCommit("fix(api-clientes/v2): trata o erro 404").escopo).toBe("api-clientes/v2");
  });

  test.each(["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"])(
    "o tipo %s é aceito",
    (tipo) => {
      expect(analisarCommit(`${tipo}: faz alguma coisa útil`).tipo).toBe(tipo);
    },
  );

  test("! marca uma mudança que quebra a compatibilidade", () => {
    const commit = analisarCommit("feat!: remove a opção antiga");
    expect(commit.breaking).toBe(true);
    expect(commit.tipo).toBe("feat");
    expect(analisarCommit("refactor(api)!: troca o formato da resposta")).toMatchObject({
      tipo: "refactor",
      escopo: "api",
      breaking: true,
    });
  });

  test("corpo: tudo depois da primeira linha, sem a linha em branco inicial", () => {
    const mensagem = "feat: adiciona exportação\n\nGera um CSV com os dados.\nAceita --separador.\n";
    expect(analisarCommit(mensagem).corpo).toBe("Gera um CSV com os dados.\nAceita --separador.");
  });

  test("BREAKING CHANGE no rodapé também marca a quebra", () => {
    const commit = analisarCommit("fix: troca o parâmetro\n\nExplicação.\n\nBREAKING CHANGE: use --nova em vez de --antiga");
    expect(commit.breaking).toBe(true);
    expect(commit.corpo).toContain("BREAKING CHANGE: use --nova");
    expect(analisarCommit("fix: ajuste qualquer\n\nBREAKING-CHANGE: mudou").breaking).toBe(true);
  });

  test("a palavra breaking no meio do texto não conta", () => {
    expect(analisarCommit("fix: corrige\n\nIsto não é um BREAKING CHANGE: de verdade").breaking).toBe(false);
  });

  test("espaços sobrando e quebra de linha do Windows", () => {
    expect(analisarCommit("  fix:   ajusta o arredondamento   ").descricao).toBe("ajusta o arredondamento");
    const commit = analisarCommit("fix: ajusta tudo\r\n\r\nCorpo do commit.\r\n");
    expect(commit.descricao).toBe("ajusta tudo");
    expect(commit.corpo).toBe("Corpo do commit.");
  });

  test("a primeira linha pode ter exatamente 72 caracteres", () => {
    const descricao = "a".repeat(72 - "fix: ".length);
    expect(analisarCommit(`fix: ${descricao}`).descricao).toBe(descricao);
  });
});

describe("analisarCommit — mensagens inválidas", () => {
  test("vazia", () => {
    expect(() => analisarCommit("")).toThrow("Mensagem vazia");
    expect(() => analisarCommit("   \n  ")).toThrow("Mensagem vazia");
  });

  test("primeira linha comprida demais", () => {
    expect(() => analisarCommit(`fix: ${"a".repeat(80)}`)).toThrow("A primeira linha passa de 72 caracteres");
  });

  test.each([
    "ajusta o frete",
    "fix ajusta o frete",
    "fix:ajusta o frete",
    "Fix: ajusta o frete",
    "FIX: ajusta o frete",
    "fix(): ajusta o frete",
    "fix(escopo: ajusta o frete",
    "fix: ",
    ": ajusta o frete",
    "(escopo): ajusta o frete",
  ])("formato inválido: '%s'", (mensagem) => {
    expect(() => analisarCommit(mensagem)).toThrow("Formato inválido. Use tipo(escopo): descrição");
  });

  test("tipo desconhecido", () => {
    expect(() => analisarCommit("feature: adiciona o filtro")).toThrow("Tipo desconhecido: feature");
    expect(() => analisarCommit("bugfix(api): corrige")).toThrow("Tipo desconhecido: bugfix");
  });

  test("descrição curta demais", () => {
    expect(() => analisarCommit("fix: ab")).toThrow("Descrição muito curta");
    expect(() => analisarCommit("feat(x): a")).toThrow("Descrição muito curta");
  });

  test("a ordem das verificações: tamanho antes de formato", () => {
    expect(() => analisarCommit(`isto não tem formato ${"a".repeat(80)}`)).toThrow("A primeira linha passa de 72 caracteres");
  });
});
