import { describe, expect, test } from "vitest";
import { formatarCPF, validarCPF } from "./17-cpf.js";

describe("validarCPF", () => {
  test.each(["529.982.247-25", "52998224725", "111.444.777-35", "11144477735"])("válido: %s", (cpf) => {
    expect(validarCPF(cpf)).toBe(true);
  });

  test.each([
    ["529.982.247-24", "segundo dígito errado"],
    ["529.982.247-15", "primeiro dígito errado"],
    ["111.111.111-11", "todos os dígitos iguais"],
    ["000.000.000-00", "todos os dígitos iguais"],
    ["5299822472", "só 10 dígitos"],
    ["529982247250", "12 dígitos"],
    ["", "vazio"],
    ["abc.def.ghi-jk", "letras"],
  ])("inválido: %s (%s)", (cpf) => {
    expect(validarCPF(cpf)).toBe(false);
  });
});

describe("formatarCPF", () => {
  test("formata com a máscara", () => {
    expect(formatarCPF("52998224725")).toBe("529.982.247-25");
    expect(formatarCPF("111.444.777-35")).toBe("111.444.777-35");
  });

  test("CPF inválido lança erro", () => {
    expect(() => formatarCPF("12345678900")).toThrow("CPF inválido");
  });
});
