import { describe, expect, test } from "vitest";
import { lerFiltros, linkWhatsApp, montarBusca } from "./14-url.js";

const padrao = { categoria: null, min: null, max: null, ordem: "relevancia", pagina: 1 };

describe("lerFiltros", () => {
  test("busca vazia → valores padrão", () => {
    expect(lerFiltros("")).toEqual(padrao);
    expect(lerFiltros("?")).toEqual(padrao);
  });

  test("lê todos os parâmetros", () => {
    expect(lerFiltros("?categoria=moveis&min=100&max=500&ordem=preco&pagina=3")).toEqual({
      categoria: "moveis",
      min: 100,
      max: 500,
      ordem: "preco",
      pagina: 3,
    });
  });

  test("funciona sem o ? na frente", () => {
    expect(lerFiltros("ordem=nome").ordem).toBe("nome");
  });

  test("decodifica caracteres especiais", () => {
    expect(lerFiltros("?categoria=casa+e+jardim").categoria).toBe("casa e jardim");
    expect(lerFiltros("?categoria=cama%2C%20mesa").categoria).toBe("cama, mesa");
  });

  test("categoria vazia vira null", () => {
    expect(lerFiltros("?categoria=").categoria).toBeNull();
  });

  test("números inválidos viram null (e vazio NÃO vira 0)", () => {
    expect(lerFiltros("?min=abc&max=").min).toBeNull();
    expect(lerFiltros("?min=abc&max=").max).toBeNull();
    expect(lerFiltros("?min=0").min).toBe(0);
    expect(lerFiltros("?min=12.5").min).toBe(12.5);
  });

  test("ordem desconhecida volta para relevancia", () => {
    expect(lerFiltros("?ordem=aleatorio").ordem).toBe("relevancia");
  });

  test("pagina: inteiro >= 1, senão 1", () => {
    expect(lerFiltros("?pagina=7").pagina).toBe(7);
    expect(lerFiltros("?pagina=0").pagina).toBe(1);
    expect(lerFiltros("?pagina=-2").pagina).toBe(1);
    expect(lerFiltros("?pagina=2.5").pagina).toBe(1);
    expect(lerFiltros("?pagina=xyz").pagina).toBe(1);
  });
});

describe("montarBusca", () => {
  test("tudo padrão → texto vazio", () => {
    expect(montarBusca(padrao)).toBe("");
  });

  test("só o que não é padrão, na ordem certa", () => {
    expect(montarBusca({ categoria: "casa e jardim", min: null, max: 500, ordem: "preco", pagina: 1 })).toBe(
      "?categoria=casa+e+jardim&max=500&ordem=preco",
    );
    expect(montarBusca({ ...padrao, pagina: 4, categoria: "moveis", min: 0 })).toBe("?categoria=moveis&min=0&pagina=4");
  });

  test("codifica acentos e símbolos", () => {
    expect(montarBusca({ ...padrao, categoria: "eletrônicos & cia" })).toBe("?categoria=eletr%C3%B4nicos+%26+cia");
  });

  test("ler(montar(x)) devolve x", () => {
    const filtros = { categoria: "cama, mesa & banho", min: 10, max: 90.5, ordem: "nome", pagina: 6 };
    expect(lerFiltros(montarBusca(filtros))).toEqual(filtros);
  });
});

describe("linkWhatsApp", () => {
  test("celular com máscara e DDD", () => {
    expect(linkWhatsApp("(81) 99999-0000", "Olá, tudo bem?")).toBe(
      "https://wa.me/5581999990000?text=Ol%C3%A1%2C%20tudo%20bem%3F",
    );
  });

  test("telefone fixo (10 dígitos) também recebe o 55", () => {
    expect(linkWhatsApp("8133330000", "oi")).toBe("https://wa.me/558133330000?text=oi");
  });

  test("número que já tem o 55 não repete", () => {
    expect(linkWhatsApp("+55 81 99999-0000", "oi")).toBe("https://wa.me/5581999990000?text=oi");
  });

  test("mensagem com quebra de linha e símbolos", () => {
    expect(linkWhatsApp("81999990000", "Total: R$ 10,00\n& mais")).toBe(
      "https://wa.me/5581999990000?text=Total%3A%20R%24%2010%2C00%0A%26%20mais",
    );
  });

  test("telefone curto demais lança erro", () => {
    expect(() => linkWhatsApp("9999-0000", "oi")).toThrow("Telefone inválido");
    expect(() => linkWhatsApp("", "oi")).toThrow("Telefone inválido");
  });
});
