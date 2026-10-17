import { describe, expect, test } from "vitest";
import { importarDoProjeto } from "./carregar.js";

const {
  textoParaCentavos,
  mascararReais,
  converterParaReais,
  converterDeReais,
  formatarValor,
  formatarTaxa,
  formatarVariacao,
  tendencia,
  dataDoTimestamp,
  formatarData,
  formatarDataHora,
} = await importarDoProjeto("conversao.js");

describe("src/conversao.js — entrada do usuário", () => {
  test.each([
    ["12,50", 1250],
    ["12", 1200],
    ["0,07", 7],
    ["1.234,56", 123456],
    ["R$ 10,00", 1000],
    ["  45,9  ", 4590],
  ])("textoParaCentavos('%s') → %i", (texto, esperado) => {
    expect(textoParaCentavos(texto)).toBe(esperado);
  });

  test.each(["", "abc", "12,345", "1.23", "-5", ",50", "12,"])("textoParaCentavos('%s') é inválido", (texto) => {
    expect(() => textoParaCentavos(texto)).toThrow(`Valor inválido: ${texto}`);
  });

  test.each([
    ["", ""],
    ["1", "0,01"],
    ["10000", "100,00"],
    ["123456", "1.234,56"],
    ["abc", ""],
  ])("mascararReais('%s') → '%s'", (entrada, esperado) => {
    expect(mascararReais(entrada)).toBe(esperado);
  });
});

describe("src/conversao.js — conversões (valores em centavos)", () => {
  test("converterParaReais multiplica pela taxa e arredonda em centavos", () => {
    expect(converterParaReais(10000, 5.0931)).toBe(50931);
    expect(converterParaReais(12345, 5.0931)).toBe(62874);
    expect(converterParaReais(1, 5.0931)).toBe(5);
    expect(converterParaReais(0, 5.0931)).toBe(0);
  });

  test("converterDeReais divide pela taxa e arredonda em centavos", () => {
    expect(converterDeReais(50931, 5.0931)).toBe(10000);
    expect(converterDeReais(10000, 5.0931)).toBe(1963);
    expect(converterDeReais(10000, 5.7156)).toBe(1750);
  });

  test("taxa inválida", () => {
    for (const taxa of [0, -1, Number.NaN, Infinity, "5", undefined]) {
      expect(() => converterParaReais(100, taxa)).toThrow("Taxa inválida");
      expect(() => converterDeReais(100, taxa)).toThrow("Taxa inválida");
    }
  });

  test("valor inválido", () => {
    for (const valor of [-1, 10.5, "100", Number.NaN]) {
      expect(() => converterParaReais(valor, 5)).toThrow("Valor inválido");
    }
  });
});

describe("src/conversao.js — formatação", () => {
  test("formatarValor: reais com R$, outras moedas com o código", () => {
    expect(formatarValor(50931, "BRL")).toBe("R$ 509,31");
    expect(formatarValor(5, "BRL")).toBe("R$ 0,05");
    expect(formatarValor(0, "BRL")).toBe("R$ 0,00");
    expect(formatarValor(10000, "USD")).toBe("USD 100,00");
    expect(formatarValor(123456789, "EUR")).toBe("EUR 1.234.567,89");
  });

  test("formatarTaxa: de 2 a 4 casas decimais", () => {
    expect(formatarTaxa(5.0931)).toBe("R$ 5,0931");
    expect(formatarTaxa(5.1)).toBe("R$ 5,10");
    expect(formatarTaxa(1234.5)).toBe("R$ 1.234,50");
    expect(formatarTaxa(0.00012345)).toBe("R$ 0,0001");
  });

  test.each([
    [0.895418, "+0,90%"],
    [-1.261425, "-1,26%"],
    [12.3456, "+12,35%"],
    [1000, "+1.000,00%"],
    [0, "0,00%"],
    [0.004, "0,00%"],
    [-0.004, "0,00%"],
  ])("formatarVariacao(%f) → %s", (percentual, esperado) => {
    expect(formatarVariacao(percentual)).toBe(esperado);
  });

  test.each([
    [0.5, "alta"],
    [-0.5, "baixa"],
    [0, "estavel"],
    [0.004, "estavel"],
    [-0.004, "estavel"],
  ])("tendencia(%f) → %s", (percentual, esperado) => {
    expect(tendencia(percentual)).toBe(esperado);
  });
});

describe("src/conversao.js — datas e fuso horário (horário de Brasília)", () => {
  test("dataDoTimestamp usa a data de São Paulo, não a de UTC", () => {
    expect(dataDoTimestamp(1792098492)).toBe("2026-10-15");
    // 16/10 01:30 em UTC ainda é 15/10 22:30 em Brasília
    expect(dataDoTimestamp(Date.UTC(2026, 9, 16, 1, 30) / 1000)).toBe("2026-10-15");
    // meia-noite em Brasília (03:00 UTC) já é o dia 16
    expect(dataDoTimestamp(Date.UTC(2026, 9, 16, 3, 0) / 1000)).toBe("2026-10-16");
  });

  test("formatarData", () => {
    expect(formatarData("2026-10-15")).toBe("15/10/2026");
    expect(formatarData("2027-01-05")).toBe("05/01/2027");
  });

  test("formatarDataHora no horário de Brasília", () => {
    expect(formatarDataHora(1792098492)).toBe("15/10/2026 18:08");
    expect(formatarDataHora(Date.UTC(2026, 0, 5, 2, 5) / 1000)).toBe("04/01/2026 23:05");
    expect(formatarDataHora(Date.UTC(2026, 6, 1, 15, 0) / 1000)).toBe("01/07/2026 12:00");
  });
});
