import { describe, expect, test } from "vitest";
import { algumEsgotado, buscarPorId, buscarPorNome, disponiveis, nomes, todosDaCategoria } from "./02-loja.js";

const produtos = [
  { id: 1, nome: "Notebook", preco: 4500, categoria: "eletronicos", estoque: 3 },
  { id: 2, nome: "Mouse sem fio", preco: 80, categoria: "eletronicos", estoque: 0 },
  { id: 3, nome: "Cadeira gamer", preco: 1200, categoria: "moveis", estoque: 5 },
  { id: 4, nome: "Mesa", preco: 900, categoria: "moveis", estoque: 2 },
];

describe("catálogo da loja", () => {
  test("nomes: só os nomes, na mesma ordem", () => {
    expect(nomes(produtos)).toEqual(["Notebook", "Mouse sem fio", "Cadeira gamer", "Mesa"]);
  });

  test("disponiveis: só os que têm estoque", () => {
    expect(disponiveis(produtos).map((p) => p.id)).toEqual([1, 3, 4]);
  });

  test("buscarPorId: encontra pelo id", () => {
    expect(buscarPorId(produtos, 3)).toBe(produtos[2]);
  });

  test("buscarPorId: retorna null quando não encontra", () => {
    expect(buscarPorId(produtos, 99)).toBeNull();
  });

  test("buscarPorNome: busca parcial e sem diferenciar maiúsculas", () => {
    expect(buscarPorNome(produtos, "MOU").map((p) => p.id)).toEqual([2]);
    expect(buscarPorNome(produtos, "me").map((p) => p.id)).toEqual([3, 4]);
  });

  test("buscarPorNome: nenhum resultado retorna array vazio", () => {
    expect(buscarPorNome(produtos, "geladeira")).toEqual([]);
  });

  test("algumEsgotado", () => {
    expect(algumEsgotado(produtos)).toBe(true);
    expect(algumEsgotado(disponiveisManual())).toBe(false);
  });

  test("todosDaCategoria", () => {
    expect(todosDaCategoria(produtos, "eletronicos")).toBe(false);
    expect(todosDaCategoria(produtos.slice(2), "moveis")).toBe(true);
  });

  test("não altera o array original", () => {
    const copia = JSON.stringify(produtos);
    nomes(produtos);
    disponiveis(produtos);
    buscarPorNome(produtos, "a");
    expect(JSON.stringify(produtos)).toBe(copia);
  });
});

function disponiveisManual() {
  return produtos.filter((p) => p.estoque > 0);
}
