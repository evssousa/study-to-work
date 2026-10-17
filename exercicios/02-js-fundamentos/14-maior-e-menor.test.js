import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { maiorEMenor } from "./14-maior-e-menor.js";

describe("maiorEMenor", () => {
  test("[3, 9, 1, 7] → maior 9, menor 1", () => {
    expect(maiorEMenor([3, 9, 1, 7])).toEqual({ maior: 9, menor: 1 });
  });

  test("funciona com negativos", () => {
    expect(maiorEMenor([-5, -2, -10])).toEqual({ maior: -2, menor: -10 });
  });

  test("array com um único elemento: ele é o maior e o menor", () => {
    expect(maiorEMenor([42])).toEqual({ maior: 42, menor: 42 });
  });

  test("o maior pode ser o primeiro e o menor o último", () => {
    expect(maiorEMenor([100, 50, 0])).toEqual({ maior: 100, menor: 0 });
  });

  test("array vazio retorna null", () => {
    expect(maiorEMenor([])).toBeNull();
  });

  test("não usa Math.max nem Math.min", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "14-maior-e-menor.js"));
    const semComentarios = codigo.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    expect(semComentarios).not.toMatch(/Math\.(max|min)/);
  });
});
