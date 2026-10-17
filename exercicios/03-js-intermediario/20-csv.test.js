import { describe, expect, test } from "vitest";
import { csvParaObjetos, objetosParaCsv } from "./20-csv.js";

describe("csvParaObjetos", () => {
  test("usa o cabeçalho como chaves", () => {
    const texto = "nome;cidade;idade\nAna;Recife;28\nBruno;Natal;35";
    expect(csvParaObjetos(texto, ";")).toEqual([
      { nome: "Ana", cidade: "Recife", idade: "28" },
      { nome: "Bruno", cidade: "Natal", idade: "35" },
    ]);
  });

  test("separador padrão é a vírgula", () => {
    expect(csvParaObjetos("a,b\n1,2")).toEqual([{ a: "1", b: "2" }]);
  });

  test("aceita quebras de linha do Windows, linhas vazias e espaços nas pontas", () => {
    const texto = "nome , cidade\r\n Ana , Recife \r\n\r\nBia,Olinda\r\n";
    expect(csvParaObjetos(texto)).toEqual([
      { nome: "Ana", cidade: "Recife" },
      { nome: "Bia", cidade: "Olinda" },
    ]);
  });

  test("só o cabeçalho → lista vazia", () => {
    expect(csvParaObjetos("nome,cidade\n")).toEqual([]);
  });
});

describe("objetosParaCsv", () => {
  test("gera cabeçalho e linhas", () => {
    const objetos = [
      { nome: "Ana", idade: 28 },
      { nome: "Bruno", idade: 35 },
    ];
    expect(objetosParaCsv(objetos, ";")).toBe("nome;idade\nAna;28\nBruno;35");
  });

  test("ida e volta dá o mesmo resultado", () => {
    const objetos = [{ produto: "Café", preco: "25" }];
    expect(csvParaObjetos(objetosParaCsv(objetos))).toEqual(objetos);
  });

  test("lista vazia → texto vazio", () => {
    expect(objetosParaCsv([])).toBe("");
  });
});
