import { describe, expect, test } from "vitest";
import { calcularMedia, nomesDosAprovados, situacao } from "./15-boletim.js";

const turma = [
  { nome: "Ana", notas: [8, 6.5, 9] },
  { nome: "Bruno", notas: [5, 6, 4] },
  { nome: "Carla", notas: [10, 9.5, 9] },
  { nome: "Diego", notas: [3, 2, 5] },
  { nome: "Elisa", notas: [7, 7, 7] },
];

describe("calcularMedia", () => {
  test("média de [8, 6.5, 9] é 7.8", () => {
    expect(calcularMedia([8, 6.5, 9])).toBe(7.8);
  });

  test("média de [10] é 10", () => {
    expect(calcularMedia([10])).toBe(10);
  });

  test("sem notas, a média é 0", () => {
    expect(calcularMedia([])).toBe(0);
  });
});

describe("situacao", () => {
  test("média 7 ou mais: aprovado", () => {
    expect(situacao(turma[0])).toBe("aprovado");
    expect(situacao(turma[4])).toBe("aprovado");
  });

  test("média entre 5 e 7: recuperação", () => {
    expect(situacao(turma[1])).toBe("recuperação");
  });

  test("média menor que 5: reprovado", () => {
    expect(situacao(turma[3])).toBe("reprovado");
  });
});

describe("nomesDosAprovados", () => {
  test("retorna só os nomes dos aprovados, na ordem original", () => {
    expect(nomesDosAprovados(turma)).toEqual(["Ana", "Carla", "Elisa"]);
  });

  test("turma vazia retorna array vazio", () => {
    expect(nomesDosAprovados([])).toEqual([]);
  });
});
