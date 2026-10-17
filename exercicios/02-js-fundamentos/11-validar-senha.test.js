import { describe, expect, test } from "vitest";
import { validarSenha } from "./11-validar-senha.js";

const TAMANHO = "A senha deve ter pelo menos 8 caracteres";
const MAIUSCULA = "A senha deve ter pelo menos uma letra maiúscula";
const MINUSCULA = "A senha deve ter pelo menos uma letra minúscula";
const NUMERO = "A senha deve ter pelo menos um número";

describe("validarSenha", () => {
  test("senha válida retorna array vazio", () => {
    expect(validarSenha("Abcdefg1")).toEqual([]);
    expect(validarSenha("MinhaSenha2026")).toEqual([]);
  });

  test("senha curta", () => {
    expect(validarSenha("Ab1")).toEqual([TAMANHO]);
  });

  test("sem letra maiúscula", () => {
    expect(validarSenha("abcdefg1")).toEqual([MAIUSCULA]);
  });

  test("sem letra minúscula", () => {
    expect(validarSenha("ABCDEFG1")).toEqual([MINUSCULA]);
  });

  test("sem número", () => {
    expect(validarSenha("Abcdefgh")).toEqual([NUMERO]);
  });

  test("vários problemas aparecem todos, na ordem certa", () => {
    expect(validarSenha("abc")).toEqual([TAMANHO, MAIUSCULA, NUMERO]);
    expect(validarSenha("")).toEqual([TAMANHO, MAIUSCULA, MINUSCULA, NUMERO]);
  });

  test("números e símbolos não contam como letras maiúsculas nem minúsculas", () => {
    expect(validarSenha("12345678!")).toEqual([MAIUSCULA, MINUSCULA]);
  });

  test("letras acentuadas também contam", () => {
    expect(validarSenha("ÁÉÍÓÚçã1")).toEqual([]);
  });
});
