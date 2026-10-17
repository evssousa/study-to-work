import { expect, test } from "vitest";
import { criarSlug } from "./16-slug.js";

test.each([
  ["Olá, Mundo!", "ola-mundo"],
  ["  Promoção de Verão: até 50% OFF! ", "promocao-de-verao-ate-50-off"],
  ["C++ & JavaScript", "c-javascript"],
  ["Ação---Reação", "acao-reacao"],
  ["São João 2026", "sao-joao-2026"],
  ["já", "ja"],
  ["!!!", ""],
])('criarSlug("%s") → "%s"', (texto, esperado) => {
  expect(criarSlug(texto)).toBe(esperado);
});
