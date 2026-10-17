import { describe, expect, test } from "vitest";
import { adicionarItem, alterarQuantidade, removerItem, totalDoCarrinho } from "./10-carrinho-imutavel.js";

// Congela o objeto e tudo que está dentro dele. Qualquer alteração vira TypeError.
function congelar(valor) {
  if (valor && typeof valor === "object") {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}

const novoCarrinho = () =>
  congelar([
    { id: 1, nome: "Café", preco: 25, quantidade: 2 },
    { id: 2, nome: "Pão", preco: 1, quantidade: 10 },
  ]);

describe("carrinho imutável", () => {
  test("adicionarItem: produto novo entra com quantidade 1", () => {
    const carrinho = novoCarrinho();
    const resultado = adicionarItem(carrinho, congelar({ id: 3, nome: "Leite", preco: 6 }));
    expect(resultado).toEqual([...carrinho, { id: 3, nome: "Leite", preco: 6, quantidade: 1 }]);
  });

  test("adicionarItem: produto que já existe aumenta a quantidade", () => {
    const resultado = adicionarItem(novoCarrinho(), { id: 1, nome: "Café", preco: 25 });
    expect(resultado).toHaveLength(2);
    expect(resultado[0].quantidade).toBe(3);
  });

  test("adicionarItem: retorna um array novo e mantém os itens não alterados", () => {
    const carrinho = novoCarrinho();
    const resultado = adicionarItem(carrinho, { id: 1, nome: "Café", preco: 25 });
    expect(resultado).not.toBe(carrinho);
    expect(resultado[0]).not.toBe(carrinho[0]); // o item alterado é um objeto novo
    expect(resultado[1]).toBe(carrinho[1]); // o item que não mudou pode ser o mesmo objeto
    expect(carrinho[0].quantidade).toBe(2);
  });

  test("removerItem", () => {
    const carrinho = novoCarrinho();
    expect(removerItem(carrinho, 1)).toEqual([carrinho[1]]);
    expect(removerItem(carrinho, 99)).toEqual(carrinho);
  });

  test("alterarQuantidade: muda só o item indicado", () => {
    const resultado = alterarQuantidade(novoCarrinho(), 2, 4);
    expect(resultado[1].quantidade).toBe(4);
    expect(resultado[0].quantidade).toBe(2);
  });

  test("alterarQuantidade: 0 ou menos remove o item", () => {
    expect(alterarQuantidade(novoCarrinho(), 1, 0).map((i) => i.id)).toEqual([2]);
    expect(alterarQuantidade(novoCarrinho(), 2, -1).map((i) => i.id)).toEqual([1]);
  });

  test("totalDoCarrinho", () => {
    expect(totalDoCarrinho(novoCarrinho())).toBe(60);
    expect(totalDoCarrinho([])).toBe(0);
  });
});
