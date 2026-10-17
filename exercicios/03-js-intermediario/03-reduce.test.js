import { describe, expect, test } from "vitest";
import { caminhoAoLado, lerTexto } from "../../suporte/arquivos.js";
import { agruparPorCategoria, contarPorCategoria, maisCaro, somar, totalDoCarrinho } from "./03-reduce.js";

const produtos = [
  { nome: "Notebook", preco: 4500, categoria: "eletronicos" },
  { nome: "Cadeira", preco: 1200, categoria: "moveis" },
  { nome: "Mouse", preco: 80, categoria: "eletronicos" },
];

describe("reduce", () => {
  test("somar", () => {
    expect(somar([1, 2, 3, 4])).toBe(10);
    expect(somar([])).toBe(0);
  });

  test("totalDoCarrinho", () => {
    const itens = [
      { nome: "Café", preco: 20, quantidade: 3 },
      { nome: "Pão", preco: 1, quantidade: 10 },
    ];
    expect(totalDoCarrinho(itens)).toBe(70);
    expect(totalDoCarrinho([])).toBe(0);
  });

  test("contarPorCategoria", () => {
    expect(contarPorCategoria(produtos)).toEqual({ eletronicos: 2, moveis: 1 });
    expect(contarPorCategoria([])).toEqual({});
  });

  test("maisCaro", () => {
    expect(maisCaro(produtos)).toBe(produtos[0]);
    expect(maisCaro([produtos[2], produtos[1]])).toBe(produtos[1]);
    expect(maisCaro([])).toBeNull();
  });

  test("agruparPorCategoria", () => {
    expect(agruparPorCategoria(produtos)).toEqual({
      eletronicos: [produtos[0], produtos[2]],
      moveis: [produtos[1]],
    });
  });

  test("usa .reduce", () => {
    const codigo = lerTexto(caminhoAoLado(import.meta.url, "03-reduce.js")).replace(/\/\*[\s\S]*?\*\//g, "");
    expect((codigo.match(/\.reduce\(/g) ?? []).length).toBeGreaterThanOrEqual(5);
  });
});
