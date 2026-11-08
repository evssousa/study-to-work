import { describe, expect, test } from "vitest";
import { carregar } from "./carregar.js";

const { validarConfig } = await carregar("src/validar.js");

describe("validarConfig", () => {
  test("aceita uma config mínima válida", () => {
    const config = {
      nome: "Ana Silva",
      links: [{ texto: "GitHub", url: "https://github.com/ana" }],
    };
    expect(validarConfig(config)).toEqual(config);
  });

  test("aceita config completa válida", () => {
    const config = {
      nome: "Ana Silva",
      titulo: "Dev Front-end",
      foto: "foto.jpg",
      cor: "#6c3fc9",
      links: [
        { texto: "GitHub", url: "https://github.com/ana", icone: "🐙" },
        { texto: "LinkedIn", url: "https://linkedin.com/in/ana" },
      ],
      redes: { instagram: "@ana", github: "ana" },
    };
    expect(() => validarConfig(config)).not.toThrow();
  });

  test("lança erro quando config não é um objeto", () => {
    expect(() => validarConfig("texto")).toThrow("Config deve ser um objeto");
    expect(() => validarConfig(null)).toThrow("Config deve ser um objeto");
    expect(() => validarConfig(42)).toThrow("Config deve ser um objeto");
  });

  test("lança erro quando nome está ausente ou é muito curto", () => {
    expect(() => validarConfig({ links: [{ texto: "X", url: "https://x.com" }] })).toThrow(
      "Nome obrigatório",
    );
    expect(() => validarConfig({ nome: "A", links: [{ texto: "X", url: "https://x.com" }] })).toThrow(
      "Nome obrigatório",
    );
  });

  test("lança erro quando cor não é hexadecimal válido", () => {
    const base = { nome: "Ana", links: [{ texto: "X", url: "https://x.com" }] };
    expect(() => validarConfig({ ...base, cor: "roxo" })).toThrow("Cor deve ser um valor hexadecimal");
    expect(() => validarConfig({ ...base, cor: "#ZZZZZZ" })).toThrow("hexadecimal");
  });

  test("aceita cores hexadecimais com 3 ou 6 dígitos", () => {
    const base = { nome: "Ana", links: [{ texto: "X", url: "https://x.com" }] };
    expect(() => validarConfig({ ...base, cor: "#fff" })).not.toThrow();
    expect(() => validarConfig({ ...base, cor: "#6c3fc9" })).not.toThrow();
    expect(() => validarConfig({ ...base, cor: "#6C3FC9" })).not.toThrow();
  });

  test("lança erro quando links não é uma lista ou está vazia", () => {
    expect(() => validarConfig({ nome: "Ana" })).toThrow("Links deve ser uma lista");
    expect(() => validarConfig({ nome: "Ana", links: {} })).toThrow("Links deve ser uma lista");
    expect(() => validarConfig({ nome: "Ana", links: [] })).toThrow("Adicione pelo menos um link");
  });

  test("lança erro quando link não tem texto", () => {
    expect(() =>
      validarConfig({ nome: "Ana", links: [{ url: "https://x.com" }] }),
    ).toThrow("texto");
  });

  test("lança erro quando URL é inválida", () => {
    const link = { texto: "X", url: "javascript:alert(1)" };
    expect(() => validarConfig({ nome: "Ana", links: [link] })).toThrow("URL inválida");
    const link2 = { texto: "X", url: "nenhuma-url" };
    expect(() => validarConfig({ nome: "Ana", links: [link2] })).toThrow("URL inválida");
  });
});
