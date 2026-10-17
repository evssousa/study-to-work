import { describe, expect, test } from "vitest";
import { importarDoProjeto } from "./carregar.js";

const { lerLinhaCsv, lerCsv } = await importarDoProjeto("csv.js");
const { converterData, converterValor } = await importarDoProjeto("conversores.js");
const erros = await importarDoProjeto("erros.js");

describe("src/csv.js — lerLinhaCsv", () => {
  test("separa os campos pelo separador", () => {
    expect(lerLinhaCsv("a;b;c", ";")).toEqual(["a", "b", "c"]);
    expect(lerLinhaCsv("a,b", ",")).toEqual(["a", "b"]);
  });

  test("o separador padrão é a vírgula", () => {
    expect(lerLinhaCsv("x,y")).toEqual(["x", "y"]);
  });

  test("campo entre aspas pode conter o separador", () => {
    expect(lerLinhaCsv('03/10/2026;"Padaria; Filial 2";-12,40', ";")).toEqual(["03/10/2026", "Padaria; Filial 2", "-12,40"]);
    expect(lerLinhaCsv('"1.234,56",ok', ",")).toEqual(["1.234,56", "ok"]);
  });

  test('aspas duplas dentro de um campo entre aspas viram uma aspa: "" → "', () => {
    expect(lerLinhaCsv('"Loja ""Boa"" Vista";10', ";")).toEqual(['Loja "Boa" Vista', "10"]);
  });

  test("campos vazios são mantidos", () => {
    expect(lerLinhaCsv("a;;c;", ";")).toEqual(["a", "", "c", ""]);
  });
});

describe("src/csv.js — lerCsv", () => {
  test("retorna uma lista de linhas, cada uma com seus campos", () => {
    expect(lerCsv("a;b\n1;2", ";")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  test("ignora linhas em branco e aceita quebras de linha do Windows", () => {
    expect(lerCsv("a,b\r\n\r\n1,2\r\n", ",")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("src/conversores.js — converterData", () => {
  test("DD/MM/AAAA vira ISO", () => {
    expect(converterData("05/10/2026", "DD/MM/AAAA")).toBe("2026-10-05");
  });

  test("AAAA-MM-DD continua ISO", () => {
    expect(converterData("2026-10-05", "AAAA-MM-DD")).toBe("2026-10-05");
  });

  test("aceita espaços nas pontas", () => {
    expect(converterData(" 05/10/2026 ", "DD/MM/AAAA")).toBe("2026-10-05");
  });

  test.each(["31/02/2026", "32/01/2026", "10/13/2026", "2026-10-05", "abc", ""])(
    "data inválida no formato DD/MM/AAAA: '%s'",
    (texto) => {
      expect(() => converterData(texto, "DD/MM/AAAA")).toThrow(`Data inválida: ${texto}`);
    },
  );

  test("29 de fevereiro só existe em ano bissexto", () => {
    expect(converterData("29/02/2028", "DD/MM/AAAA")).toBe("2028-02-29");
    expect(() => converterData("29/02/2026", "DD/MM/AAAA")).toThrow("Data inválida");
  });

  test("formato desconhecido lança erro", () => {
    expect(() => converterData("05/10/2026", "MM-DD")).toThrow("Formato de data desconhecido: MM-DD");
  });
});

describe("src/conversores.js — converterValor (retorna CENTAVOS inteiros)", () => {
  test.each([
    ["-45,90", ",", -4590],
    ["1.234,56", ",", 123456],
    ["R$ 10,00", ",", 1000],
    ["-R$ 0,07", ",", -7],
    ["5000", ",", 500000],
    ["1234.56", ".", 123456],
    ["-45.9", ".", -4590],
    ["1,234.56", ".", 123456],
    [" 19,99 ", ",", 1999],
  ])("'%s' com decimal '%s' → %i centavos", (texto, decimal, esperado) => {
    expect(converterValor(texto, decimal)).toBe(esperado);
  });

  test.each(["abc", "", "-", "12,34,56"])("valor inválido: '%s'", (texto) => {
    expect(() => converterValor(texto, ",")).toThrow(`Valor inválido: ${texto}`);
  });
});

describe("src/erros.js", () => {
  test("exporta LinhaInvalidaError com o número da linha", () => {
    const erro = new erros.LinhaInvalidaError(7, "Data inválida: 31/02/2026");
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe("LinhaInvalidaError");
    expect(erro.linha).toBe(7);
    expect(erro.message).toBe("Data inválida: 31/02/2026");
  });
});
