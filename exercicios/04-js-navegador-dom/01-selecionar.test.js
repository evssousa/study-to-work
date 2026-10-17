import { describe, expect, test } from "vitest";
import { criarDom } from "../../suporte/dom.js";
import {
  enderecoDoLinkAtivo,
  itemEmDestaque,
  primeiroItemDe,
  quantosItens,
  textosDosLinks,
  tituloDaPagina,
} from "./01-selecionar.js";

const HTML = `
  <header><nav>
    <a href="/">Início</a>
    <a href="/produtos" class="ativo">Produtos</a>
    <a href="/contato">Contato</a>
  </nav></header>
  <main>
    <h1 id="titulo">Loja do Bairro</h1>
    <ul class="lista">
      <li class="item">Café</li>
      <li class="item destaque">Pão</li>
      <li class="item">Leite</li>
    </ul>
    <ul class="vazia"></ul>
  </main>`;

const pagina = () => criarDom(HTML).document;

describe("selecionando elementos", () => {
  test("tituloDaPagina", () => {
    expect(tituloDaPagina(pagina())).toBe("Loja do Bairro");
  });

  test("textosDosLinks: um array de verdade, na ordem da página", () => {
    const textos = textosDosLinks(pagina());
    expect(Array.isArray(textos)).toBe(true);
    expect(textos).toEqual(["Início", "Produtos", "Contato"]);
  });

  test("quantosItens", () => {
    expect(quantosItens(pagina())).toBe(3);
  });

  test("itemEmDestaque", () => {
    expect(itemEmDestaque(pagina())).toBe("Pão");
  });

  test("itemEmDestaque: null quando não existe", () => {
    const documento = pagina();
    documento.querySelector(".destaque").classList.remove("destaque");
    expect(itemEmDestaque(documento)).toBeNull();
  });

  test("enderecoDoLinkAtivo: o valor do atributo href (não a URL completa)", () => {
    expect(enderecoDoLinkAtivo(pagina())).toBe("/produtos");
  });

  test("primeiroItemDe: procura só dentro da lista recebida", () => {
    const documento = pagina();
    expect(primeiroItemDe(documento.querySelector(".lista"))).toBe("Café");
  });

  test("primeiroItemDe: null quando a lista está vazia", () => {
    const documento = pagina();
    expect(primeiroItemDe(documento.querySelector(".vazia"))).toBeNull();
  });
});
