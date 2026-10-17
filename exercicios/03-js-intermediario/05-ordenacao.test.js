import { describe, expect, test } from "vitest";
import { maisVendidos, ordenarPorCategoriaEPreco, ordenarPorNome, ordenarPorPreco } from "./05-ordenacao.js";

const produtos = Object.freeze([
  { nome: "Banana", preco: 6, categoria: "hortifruti" },
  { nome: "Água mineral", preco: 3, categoria: "bebidas" },
  { nome: "abacate", preco: 9, categoria: "hortifruti" },
  { nome: "Café", preco: 25, categoria: "mercearia" },
  { nome: "Suco", preco: 8, categoria: "bebidas" },
]);

const nomesDe = (lista) => lista.map((p) => p.nome);

describe("ordenação", () => {
  test("ordenarPorPreco: do mais barato ao mais caro", () => {
    expect(nomesDe(ordenarPorPreco(produtos))).toEqual(["Água mineral", "Banana", "Suco", "abacate", "Café"]);
  });

  test("ordenarPorPreco: compara números, não textos (100 vem depois de 25)", () => {
    const lista = Object.freeze([{ preco: 100 }, { preco: 25 }, { preco: 3 }]);
    expect(ordenarPorPreco(lista).map((p) => p.preco)).toEqual([3, 25, 100]);
  });

  test("ordenarPorNome: ordem alfabética do português (acentos e minúsculas no lugar certo)", () => {
    expect(nomesDe(ordenarPorNome(produtos))).toEqual(["abacate", "Água mineral", "Banana", "Café", "Suco"]);
  });

  test("ordenarPorCategoriaEPreco: categoria A-Z e, dentro dela, do mais caro ao mais barato", () => {
    expect(nomesDe(ordenarPorCategoriaEPreco(produtos))).toEqual([
      "Suco",
      "Água mineral",
      "abacate",
      "Banana",
      "Café",
    ]);
  });

  test("maisVendidos: os N primeiros por unidades", () => {
    const vendas = Object.freeze([
      { produto: "Café", unidades: 30 },
      { produto: "Pão", unidades: 120 },
      { produto: "Leite", unidades: 45 },
      { produto: "Bolo", unidades: 5 },
    ]);
    expect(maisVendidos(vendas, 2)).toEqual([
      { produto: "Pão", unidades: 120 },
      { produto: "Leite", unidades: 45 },
    ]);
  });

  test("retorna arrays novos (o original continua na mesma ordem)", () => {
    const resultado = ordenarPorPreco(produtos);
    expect(resultado).not.toBe(produtos);
    expect(produtos[0].nome).toBe("Banana");
  });
});
