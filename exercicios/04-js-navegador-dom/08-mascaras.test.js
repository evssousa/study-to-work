import { describe, expect, test } from "vitest";
import { criarDom, digitar } from "../../suporte/dom.js";
import { ativarMascara, mascararCEP, mascararReais, mascararTelefone } from "./08-mascaras.js";

describe("mascararTelefone", () => {
  test.each([
    ["", ""],
    ["8", "(8"],
    ["81", "(81"],
    ["819", "(81) 9"],
    ["81999", "(81) 999"],
    ["8199999", "(81) 9999-9"],
    ["8133330000", "(81) 3333-0000"],
    ["81999990000", "(81) 99999-0000"],
    ["(81) 99999-0000", "(81) 99999-0000"],
    ["81 99999-0000 ramal 12", "(81) 99999-0000"],
    ["abc", ""],
  ])('"%s" → "%s"', (entrada, esperado) => {
    expect(mascararTelefone(entrada)).toBe(esperado);
  });
});

describe("mascararCEP", () => {
  test.each([
    ["", ""],
    ["50000", "50000"],
    ["500001", "50000-1"],
    ["50000000", "50000-000"],
    ["50000-000", "50000-000"],
    ["500000009999", "50000-000"],
    ["cep 01310-100!", "01310-100"],
  ])('"%s" → "%s"', (entrada, esperado) => {
    expect(mascararCEP(entrada)).toBe(esperado);
  });
});

describe("mascararReais", () => {
  test.each([
    ["", ""],
    ["abc", ""],
    ["1", "0,01"],
    ["12", "0,12"],
    ["123", "1,23"],
    ["1234", "12,34"],
    ["123456", "1.234,56"],
    ["123456789", "1.234.567,89"],
    ["0001", "0,01"],
    ["0", "0,00"],
    ["1.234,56", "1.234,56"],
    ["R$ 12,3", "1,23"],
  ])('"%s" → "%s"', (entrada, esperado) => {
    expect(mascararReais(entrada)).toBe(esperado);
  });
});

describe("ativarMascara", () => {
  test("formata enquanto a pessoa digita", () => {
    const { document } = criarDom('<input id="tel" />');
    const campo = document.querySelector("#tel");
    ativarMascara(campo, mascararTelefone);
    digitar(campo, "8");
    expect(campo.value).toBe("(8");
    digitar(campo, "(81) 99");
    expect(campo.value).toBe("(81) 99");
    digitar(campo, "81999990000");
    expect(campo.value).toBe("(81) 99999-0000");
  });

  test("formata o valor que já estava no campo", () => {
    const { document } = criarDom('<input id="cep" value="50000000" />');
    const campo = document.querySelector("#cep");
    ativarMascara(campo, mascararCEP);
    expect(campo.value).toBe("50000-000");
  });

  test("funciona com qualquer função de máscara", () => {
    const { document } = criarDom('<input id="v" />');
    const campo = document.querySelector("#v");
    ativarMascara(campo, mascararReais);
    digitar(campo, "12345");
    expect(campo.value).toBe("123,45");
  });
});
