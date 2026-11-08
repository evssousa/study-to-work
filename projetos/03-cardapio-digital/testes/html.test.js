import { describe, expect, test } from "vitest";
import { carregar } from "./carregar.js";

const { gerarCabecalho, gerarCardItem, gerarSecaoCategoria, gerarPagina } = await carregar("src/html.js");

const cardapio = {
  restaurante: "Pizzaria Bella",
  descricao: "Pizzas artesanais desde 1987",
  cor: "#c0392b",
  categorias: [
    {
      nome: "Pizzas",
      itens: [
        { nome: "Margherita", descricao: "Molho, mussarela, manjericão", preco: 4500, disponivel: true },
      ],
    },
  ],
};

describe("gerarCabecalho", () => {
  test("inclui o nome do restaurante", () => {
    expect(gerarCabecalho(cardapio)).toContain("Pizzaria Bella");
  });

  test("inclui a descrição", () => {
    expect(gerarCabecalho(cardapio)).toContain("Pizzas artesanais");
  });

  test("escapa HTML para prevenir XSS", () => {
    const cfg = { ...cardapio, restaurante: '<img src=x onerror="alert(1)">' };
    expect(gerarCabecalho(cfg)).not.toContain("<img src=x");
  });
});

describe("gerarCardItem", () => {
  const item = { nome: "Margherita", descricao: "Molho, mussarela", preco: 4500, disponivel: true };

  test("inclui o nome e o preço formatado", () => {
    const html = gerarCardItem(item, "Pizzas");
    expect(html).toContain("Margherita");
    expect(html).toContain("R$ 45,00");
  });

  test("inclui a descrição", () => {
    expect(gerarCardItem(item, "Pizzas")).toContain("Molho, mussarela");
  });

  test("escapa o nome para prevenir XSS", () => {
    const itemXSS = { ...item, nome: '<script>alert("xss")</script>' };
    const html = gerarCardItem(itemXSS, "Pizzas");
    expect(html).not.toContain("<script>");
  });
});

describe("gerarPagina", () => {
  const contexto = {
    itens: cardapio.categorias,
    especialDoDia: null,
  };

  test("retorna documento HTML completo", () => {
    const html = gerarPagina(cardapio, contexto);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain("</html>");
  });

  test("inclui o nome do restaurante no title", () => {
    const html = gerarPagina(cardapio, contexto);
    expect(html).toContain("<title>");
    expect(html).toContain("Pizzaria Bella");
  });

  test("inclui charset e viewport", () => {
    const html = gerarPagina(cardapio, contexto);
    expect(html).toContain("UTF-8");
    expect(html).toContain("viewport");
  });
});
