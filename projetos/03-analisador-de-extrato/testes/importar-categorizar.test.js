import { describe, expect, test } from "vitest";
import { importarDoProjeto } from "./carregar.js";

const { importarExtrato } = await importarDoProjeto("importar.js");
const { categorizar } = await importarDoProjeto("categorizar.js");
const { perfis } = await importarDoProjeto("perfis.js");

const generico = {
  nome: "Genérico",
  separador: ";",
  temCabecalho: true,
  colunas: { data: 0, descricao: 1, valor: 2 },
  formatoData: "DD/MM/AAAA",
  decimal: ",",
  gastosPositivos: false,
};

function congelar(valor) {
  if (valor && typeof valor === "object") {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}

describe("src/perfis.js", () => {
  test('tem o perfil "generico" exatamente com a configuração do enunciado', () => {
    expect(perfis.generico).toEqual(generico);
  });

  test("tem pelo menos mais um perfil de banco real, com todos os campos", () => {
    const outros = Object.entries(perfis).filter(([id]) => id !== "generico");
    expect(outros.length).toBeGreaterThanOrEqual(1);
    for (const [id, perfil] of outros) {
      expect(perfil.nome, `perfil ${id}`).toBeTruthy();
      expect([",", ";", "\t"]).toContain(perfil.separador);
      expect(typeof perfil.temCabecalho).toBe("boolean");
      expect(Object.keys(perfil.colunas).toSorted()).toEqual(["data", "descricao", "valor"]);
      expect(["DD/MM/AAAA", "AAAA-MM-DD"]).toContain(perfil.formatoData);
      expect([",", "."]).toContain(perfil.decimal);
      expect(typeof perfil.gastosPositivos).toBe("boolean");
    }
  });
});

describe("src/importar.js — importarExtrato", () => {
  const texto = [
    "Data;Descrição;Valor",
    "10/10/2026;  UBER   *TRIP ;-30,00",
    "01/10/2026;Salário;5.000,00",
    "31/02/2026;Data errada;-10,00",
    "",
    "08/10/2026;Netflix;abc",
    "09/10/2026;Só duas colunas",
    '03/10/2026;"Padaria; Filial 2";-12,40',
  ].join("\n");

  test("converte as linhas válidas em transações, ordenadas por data", () => {
    const { transacoes } = importarExtrato(texto, generico);
    expect(transacoes).toEqual([
      { data: "2026-10-01", descricao: "Salário", valorCentavos: 500000 },
      { data: "2026-10-03", descricao: "Padaria; Filial 2", valorCentavos: -1240 },
      { data: "2026-10-10", descricao: "UBER *TRIP", valorCentavos: -3000 },
    ]);
  });

  test("a descrição fica sem espaços nas pontas e sem espaços repetidos", () => {
    const { transacoes } = importarExtrato(texto, generico);
    expect(transacoes[2].descricao).toBe("UBER *TRIP");
  });

  test("linhas com problema não derrubam a importação: viram uma lista de erros", () => {
    const { erros } = importarExtrato(texto, generico);
    expect(erros).toEqual([
      { linha: 4, mensagem: "Data inválida: 31/02/2026" },
      { linha: 5, mensagem: "Valor inválido: abc" },
      { linha: 6, mensagem: "Colunas faltando" },
    ]);
  });

  test("respeita a ordem das colunas do perfil e o formato ISO", () => {
    const perfil = { ...generico, separador: ",", colunas: { data: 2, descricao: 0, valor: 1 }, formatoData: "AAAA-MM-DD", decimal: "." };
    const { transacoes } = importarExtrato("descricao,valor,data\nMercado,-99.90,2026-10-05", perfil);
    expect(transacoes).toEqual([{ data: "2026-10-05", descricao: "Mercado", valorCentavos: -9990 }]);
  });

  test("sem cabeçalho, a primeira linha já é uma transação", () => {
    const perfil = { ...generico, temCabecalho: false };
    expect(importarExtrato("01/10/2026;Pix;10,00", perfil).transacoes).toHaveLength(1);
  });

  test("gastosPositivos: true inverte o sinal (fatura de cartão: compra vem positiva)", () => {
    const perfil = { ...generico, gastosPositivos: true };
    const { transacoes } = importarExtrato("Data;Descrição;Valor\n01/10/2026;Livraria;89,90\n02/10/2026;Estorno;-10,00", perfil);
    expect(transacoes.map((t) => t.valorCentavos)).toEqual([-8990, 1000]);
  });
});

describe("src/categorizar.js — categorizar", () => {
  const regras = congelar([
    { categoria: "transporte", padrao: "uber|99 ?pop" },
    { categoria: "mercado", padrao: "mercado|padaria" },
    { categoria: "saude", padrao: "farmacia|drogaria" },
    { categoria: "delivery", padrao: "ifood|uber eats" },
  ]);

  const transacoes = congelar([
    { data: "2026-10-01", descricao: "Salário", valorCentavos: 500000 },
    { data: "2026-10-02", descricao: "UBER *TRIP", valorCentavos: -3000 },
    { data: "2026-10-03", descricao: "PADARIA SÃO JOÃO", valorCentavos: -1240 },
    { data: "2026-10-04", descricao: "Farmácia Pague Menos", valorCentavos: -5800 },
    { data: "2026-10-05", descricao: "Cinema", valorCentavos: -4000 },
    { data: "2026-10-06", descricao: "99 POP", valorCentavos: -1890 },
  ]);

  test("adiciona a categoria sem alterar as transações originais", () => {
    const resultado = categorizar(transacoes, regras);
    expect(resultado).not.toBe(transacoes);
    expect(resultado[1]).toEqual({ ...transacoes[1], categoria: "transporte" });
  });

  test("ignora maiúsculas e acentos", () => {
    const resultado = categorizar(transacoes, regras);
    expect(resultado[2].categoria).toBe("mercado");
    expect(resultado[3].categoria).toBe("saude");
  });

  test('o padrão é uma expressão regular ("99 ?pop" aceita "99 POP" e "99POP")', () => {
    const resultado = categorizar([{ data: "2026-10-01", descricao: "99POP", valorCentavos: -100 }], regras);
    expect(resultado[0].categoria).toBe("transporte");
    expect(categorizar(transacoes, regras)[5].categoria).toBe("transporte");
  });

  test('sem regra que combine: "outros"', () => {
    expect(categorizar(transacoes, regras)[4].categoria).toBe("outros");
  });

  test('valores positivos são sempre "receitas"', () => {
    expect(categorizar(transacoes, regras)[0].categoria).toBe("receitas");
  });

  test("a primeira regra que combinar vence", () => {
    const resultado = categorizar([{ data: "2026-10-01", descricao: "UBER EATS", valorCentavos: -2500 }], regras);
    expect(resultado[0].categoria).toBe("transporte");
  });

  test("regra com expressão regular inválida lança erro claro", () => {
    expect(() => categorizar(transacoes, [{ categoria: "quebrada", padrao: "(abc" }])).toThrow(
      "Regra inválida para a categoria quebrada: (abc",
    );
  });
});
