import { describe, expect, test } from "vitest";
import { calcularIMC, classificarIMC } from "./03-imc.js";

describe("calcularIMC", () => {
  test("70 kg e 1,75 m → 22.9", () => {
    expect(calcularIMC(70, 1.75)).toBe(22.9);
  });

  test("arredonda para 1 casa decimal: 90 kg e 1,80 m → 27.8", () => {
    expect(calcularIMC(90, 1.8)).toBe(27.8);
  });

  test("50 kg e 1,70 m → 17.3", () => {
    expect(calcularIMC(50, 1.7)).toBe(17.3);
  });
});

describe("classificarIMC", () => {
  test("menor que 18.5 é abaixo do peso", () => {
    expect(classificarIMC(17.3)).toBe("abaixo do peso");
    expect(classificarIMC(18.4)).toBe("abaixo do peso");
  });

  test("18.5 já é normal (cuidado com < e <=)", () => {
    expect(classificarIMC(18.5)).toBe("normal");
    expect(classificarIMC(24.9)).toBe("normal");
  });

  test("25 já é sobrepeso", () => {
    expect(classificarIMC(25)).toBe("sobrepeso");
    expect(classificarIMC(29.9)).toBe("sobrepeso");
  });

  test("30 ou mais é obesidade", () => {
    expect(classificarIMC(30)).toBe("obesidade");
    expect(classificarIMC(42)).toBe("obesidade");
  });
});
