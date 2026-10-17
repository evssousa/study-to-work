import { describe, expect, test } from "vitest";
import { apenasDigitos, extrairHashtags, formatarTelefone, validarCEP, validarEmail } from "./15-regex.js";

describe("regex", () => {
  test("apenasDigitos", () => {
    expect(apenasDigitos("(81) 99999-0000")).toBe("81999990000");
    expect(apenasDigitos("CPF: 529.982.247-25")).toBe("52998224725");
    expect(apenasDigitos("sem números")).toBe("");
  });

  test.each(["50000-000", "50000000", "01310-100"])("CEP válido: %s", (cep) => {
    expect(validarCEP(cep)).toBe(true);
  });

  test.each(["5000-000", "500000000", "50000-00", "abcde-fgh", " 50000-000", "50000--000"])("CEP inválido: '%s'", (cep) => {
    expect(validarCEP(cep)).toBe(false);
  });

  test.each(["ana@exemplo.com", "ana.souza+loja@mail.com.br", "a@b.co"])("e-mail válido: %s", (email) => {
    expect(validarEmail(email)).toBe(true);
  });

  test.each(["ana@", "ana exemplo.com", "@exemplo.com", "ana@exemplo", "ana @exemplo.com", ""])(
    "e-mail inválido: '%s'",
    (email) => {
      expect(validarEmail(email)).toBe(false);
    },
  );

  test("formatarTelefone: celular", () => {
    expect(formatarTelefone("81999990000")).toBe("(81) 99999-0000");
    expect(formatarTelefone("(81) 99999-0000")).toBe("(81) 99999-0000");
  });

  test("formatarTelefone: fixo", () => {
    expect(formatarTelefone("8133330000")).toBe("(81) 3333-0000");
  });

  test("formatarTelefone: tamanho errado lança erro", () => {
    expect(() => formatarTelefone("9999-0000")).toThrow("Telefone inválido");
  });

  test("extrairHashtags", () => {
    expect(extrairHashtags("Amo #JS e #Node. #js")).toEqual(["js", "node"]);
    expect(extrairHashtags("Nenhuma aqui")).toEqual([]);
    expect(extrairHashtags("#dev_web #2026")).toEqual(["dev_web", "2026"]);
  });
});
