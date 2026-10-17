import { describe, expect, test } from "vitest";
import * as modulo from "./09-classes.js";

const { Produto, Carrinho } = modulo;

const cafe = () => new Produto({ id: 1, nome: "Café", precoCentavos: 2500 });
const pao = () => new Produto({ id: 2, nome: "Pão", precoCentavos: 450 });

describe("Produto", () => {
  test("guarda os dados e expõe por getters", () => {
    expect(typeof Produto, "Exporte a classe Produto").toBe("function");
    const produto = new Produto({ id: 7, nome: "  Leite ", precoCentavos: 650 });
    expect(produto.id).toBe(7);
    expect(produto.nome).toBe("Leite");
    expect(produto.precoCentavos).toBe(650);
  });

  test("precoFormatado", () => {
    expect(pao().precoFormatado).toBe("R$ 4,50");
    expect(new Produto({ id: 3, nome: "Notebook", precoCentavos: 450000 }).precoFormatado).toBe("R$ 4.500,00");
  });

  test("os dados são privados e somente leitura", () => {
    const produto = pao();
    expect(Object.keys(produto)).toEqual([]);
    expect(() => {
      produto.nome = "Outro";
    }).toThrow(); // getter sem setter: em módulos (modo estrito) atribuir dá TypeError
    expect(produto.nome).toBe("Pão");
  });

  test("validações", () => {
    expect(() => new Produto({ id: 1, nome: "   ", precoCentavos: 100 })).toThrow("Nome do produto é obrigatório");
    expect(() => new Produto({ id: 1, nome: "X", precoCentavos: -1 })).toThrow("Preço inválido");
    expect(() => new Produto({ id: 1, nome: "X", precoCentavos: 10.5 })).toThrow("Preço inválido");
    expect(() => new Produto({ id: 1, nome: "X", precoCentavos: "10" })).toThrow("Preço inválido");
    expect(new Produto({ id: 1, nome: "Brinde", precoCentavos: 0 }).precoCentavos).toBe(0);
  });

  test("deObjeto e toJSON permitem ir e voltar do JSON", () => {
    const original = cafe();
    const texto = JSON.stringify(original);
    expect(JSON.parse(texto)).toEqual({ id: 1, nome: "Café", precoCentavos: 2500 });
    const copia = Produto.deObjeto(JSON.parse(texto));
    expect(copia).toBeInstanceOf(Produto);
    expect(copia.nome).toBe("Café");
  });
});

describe("Carrinho", () => {
  test("começa vazio", () => {
    const carrinho = new Carrinho();
    expect(typeof Carrinho, "Exporte a classe Carrinho").toBe("function");
    expect(carrinho.vazio).toBe(true);
    expect(carrinho.itens).toEqual([]);
    expect(carrinho.quantidadeTotal).toBe(0);
    expect(carrinho.totalCentavos).toBe(0);
  });

  test("adicionar soma as quantidades do mesmo produto e permite encadear", () => {
    const carrinho = new Carrinho();
    expect(carrinho.adicionar(cafe())).toBe(carrinho);
    carrinho.adicionar(cafe(), 2).adicionar(pao());
    expect(carrinho.itens.map((i) => [i.produto.nome, i.quantidade])).toEqual([["Café", 3], ["Pão", 1]]);
    expect(carrinho.quantidadeTotal).toBe(4);
    expect(carrinho.vazio).toBe(false);
  });

  test("quantidade inválida", () => {
    const carrinho = new Carrinho();
    for (const invalida of [0, -1, 1.5, "2"]) {
      expect(() => carrinho.adicionar(cafe(), invalida)).toThrow("Quantidade inválida");
    }
  });

  test("subtotal", () => {
    const carrinho = new Carrinho().adicionar(cafe(), 2).adicionar(pao(), 3);
    expect(carrinho.subtotalCentavos).toBe(2 * 2500 + 3 * 450);
    expect(carrinho.totalCentavos).toBe(6350);
  });

  test("remover e alterarQuantidade", () => {
    const carrinho = new Carrinho().adicionar(cafe()).adicionar(pao(), 2);
    carrinho.alterarQuantidade(2, 5);
    expect(carrinho.itens[1].quantidade).toBe(5);
    carrinho.alterarQuantidade(2, 0);
    expect(carrinho.itens.map((i) => i.produto.id)).toEqual([1]);
    carrinho.remover(1);
    expect(carrinho.vazio).toBe(true);
    expect(() => carrinho.alterarQuantidade(99, 1)).toThrow("Produto não está no carrinho");
  });

  test("cupom de desconto", () => {
    const carrinho = new Carrinho({ cupons: { DESC10: 10, METADE: 50 } }).adicionar(cafe(), 2).adicionar(pao());
    expect(carrinho.subtotalCentavos).toBe(5450);
    expect(carrinho.descontoCentavos).toBe(0);
    expect(carrinho.aplicarCupom("desc10")).toBe(carrinho);
    expect(carrinho.descontoCentavos).toBe(545);
    expect(carrinho.totalCentavos).toBe(4905);
    carrinho.aplicarCupom("METADE");
    expect(carrinho.descontoCentavos).toBe(2725);
  });

  test("desconto arredondado em centavos", () => {
    const carrinho = new Carrinho({ cupons: { DESC15: 15 } }).adicionar(new Produto({ id: 9, nome: "X", precoCentavos: 333 }));
    carrinho.aplicarCupom("DESC15");
    expect(carrinho.descontoCentavos).toBe(50); // 49,95 → 50
    expect(Number.isInteger(carrinho.totalCentavos)).toBe(true);
  });

  test("cupom desconhecido", () => {
    expect(() => new Carrinho().aplicarCupom("NAOEXISTE")).toThrow("Cupom inválido: NAOEXISTE");
  });

  test("itens é uma cópia: mexer nela não altera o carrinho", () => {
    const carrinho = new Carrinho().adicionar(cafe());
    carrinho.itens.push({ produto: pao(), quantidade: 99 });
    carrinho.itens[0].quantidade = 50;
    expect(carrinho.itens).toHaveLength(1);
    expect(carrinho.quantidadeTotal).toBe(1);
  });

  test("o estado interno é privado", () => {
    const carrinho = new Carrinho().adicionar(cafe());
    expect(Object.keys(carrinho)).toEqual([]);
  });

  test("dois carrinhos são independentes", () => {
    const a = new Carrinho().adicionar(cafe());
    const b = new Carrinho();
    expect(b.vazio).toBe(true);
    expect(a.vazio).toBe(false);
  });
});
