import { describe, expect, test } from "vitest";
import { carregar } from "./carregar.js";

const { itensPorCategoria, buscarItens, especialDoDia, totalItensDisponiveis } = await carregar("src/agrupar.js");

const categorias = [
  {
    nome: "Pizzas",
    itens: [
      { nome: "Calabresa", preco: 4800, disponivel: true },
      { nome: "Margherita", preco: 4500, disponivel: true },
      { nome: "Frango", preco: 5000, disponivel: false },
    ],
  },
  {
    nome: "Bebidas",
    itens: [
      { nome: "Coca-Cola", preco: 800, disponivel: true },
      { nome: "Suco", preco: 900, disponivel: true },
    ],
  },
];

describe("itensPorCategoria", () => {
  test("exclui itens com disponivel: false", () => {
    const resultado = itensPorCategoria(categorias);
    const pizzas = resultado.find((c) => c.nome === "Pizzas");
    expect(pizzas.itens.some((i) => i.nome === "Frango")).toBe(false);
    expect(pizzas.itens.length).toBe(2);
  });

  test("ordena itens por preço crescente", () => {
    const resultado = itensPorCategoria(categorias);
    const pizzas = resultado.find((c) => c.nome === "Pizzas");
    expect(pizzas.itens[0].nome).toBe("Margherita"); // 4500
    expect(pizzas.itens[1].nome).toBe("Calabresa");  // 4800
  });

  test("não altera o array original (imutável)", () => {
    const original = JSON.stringify(categorias);
    itensPorCategoria(categorias);
    expect(JSON.stringify(categorias)).toBe(original);
  });
});

describe("buscarItens", () => {
  test("retorna itens que combinam com o termo (nome)", () => {
    const resultado = buscarItens(categorias, "Cola");
    expect(resultado.length).toBe(1);
    expect(resultado[0].item.nome).toBe("Coca-Cola");
  });

  test("busca é case-insensitive", () => {
    const resultado = buscarItens(categorias, "margherita");
    expect(resultado.some((r) => r.item.nome === "Margherita")).toBe(true);
  });

  test("retorna [] quando nenhum item combinar", () => {
    expect(buscarItens(categorias, "xyzw")).toEqual([]);
  });

  test("não falha com regex inválido do usuário", () => {
    expect(() => buscarItens(categorias, "[[[")).not.toThrow();
    expect(buscarItens(categorias, "[[[")).toEqual([]);
  });

  test("inclui o nome da categoria no resultado", () => {
    const resultado = buscarItens(categorias, "Coca");
    expect(resultado[0].categoria).toBe("Bebidas");
  });
});

describe("especialDoDia", () => {
  const especial = {
    segunda: { descricao: "10% off em pizzas grandes" },
    sexta: { descricao: "Duas pizzas pelo preço de uma" },
  };

  test("retorna o especial do dia atual", () => {
    const segunda = new Date("2026-11-09"); // Monday
    expect(especialDoDia(especial, segunda)).toEqual(especial.segunda);
  });

  test("retorna null quando não há especial no dia", () => {
    const terca = new Date("2026-11-10"); // Tuesday
    expect(especialDoDia(especial, terca)).toBeNull();
  });

  test("retorna null quando especial é null ou undefined", () => {
    expect(especialDoDia(null, new Date())).toBeNull();
    expect(especialDoDia(undefined, new Date())).toBeNull();
  });
});

describe("totalItensDisponiveis", () => {
  test("conta apenas itens com disponivel: true", () => {
    expect(totalItensDisponiveis(categorias)).toBe(4); // 2 pizzas + 2 bebidas (Frango excluded)
  });
});
