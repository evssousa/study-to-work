import { describe, expect, test } from "vitest";
import { criarDom } from "../../suporte/dom.js";
import {
  alternarTema,
  ativarAba,
  definirCorPrimaria,
  esconder,
  marcarCampoInvalido,
  marcarComoLido,
  mostrar,
  trocarTexto,
} from "./02-alterar.js";

describe("alterando elementos", () => {
  test("trocarTexto", () => {
    const { document } = criarDom('<h1 id="t">Antigo</h1>');
    const titulo = document.querySelector("#t");
    trocarTexto(titulo, "Novo título");
    expect(titulo.textContent).toBe("Novo título");
  });

  test("trocarTexto trata o texto como TEXTO (não interpreta HTML)", () => {
    const { document } = criarDom('<p id="p"></p>');
    const p = document.querySelector("#p");
    trocarTexto(p, "<b>negrito?</b>");
    expect(p.children).toHaveLength(0);
    expect(p.textContent).toBe("<b>negrito?</b>");
  });

  test("alternarTema liga e desliga a classe e informa o resultado", () => {
    const { document } = criarDom("");
    expect(alternarTema(document)).toBe(true);
    expect(document.body.classList.contains("escuro")).toBe(true);
    expect(alternarTema(document)).toBe(false);
    expect(document.body.classList.contains("escuro")).toBe(false);
  });

  test("alternarTema não mexe em outras classes do body", () => {
    const { document } = criarDom("");
    document.body.classList.add("pagina-inicial");
    alternarTema(document);
    alternarTema(document);
    expect(document.body.classList.contains("pagina-inicial")).toBe(true);
  });

  test("marcarComoLido: classe e data-lido", () => {
    const { document } = criarDom('<article id="a" class="post"></article>');
    const artigo = document.querySelector("#a");
    marcarComoLido(artigo);
    expect(artigo.classList.contains("lido")).toBe(true);
    expect(artigo.classList.contains("post")).toBe(true);
    expect(artigo.getAttribute("data-lido")).toBe("true");
  });

  test("esconder e mostrar usam o atributo hidden", () => {
    const { document } = criarDom('<div id="d">oi</div>');
    const div = document.querySelector("#d");
    esconder(div);
    expect(div.hasAttribute("hidden")).toBe(true);
    expect(div.style.display).toBe("");
    mostrar(div);
    expect(div.hasAttribute("hidden")).toBe(false);
  });

  test("ativarAba: só a escolhida fica ativa", () => {
    const { document } = criarDom(`
      <button class="aba ativa" aria-selected="true">A</button>
      <button class="aba" aria-selected="false">B</button>
      <button class="aba" aria-selected="false">C</button>`);
    const abas = [...document.querySelectorAll(".aba")];
    ativarAba(abas, 2);
    expect(abas.map((a) => a.classList.contains("ativa"))).toEqual([false, false, true]);
    expect(abas.map((a) => a.getAttribute("aria-selected"))).toEqual(["false", "false", "true"]);
    ativarAba(abas, 0);
    expect(abas.map((a) => a.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
    expect(abas.every((a) => a.classList.contains("aba"))).toBe(true);
  });

  test("definirCorPrimaria: variável CSS no elemento", () => {
    const { document } = criarDom('<section id="s"></section>');
    const secao = document.querySelector("#s");
    definirCorPrimaria(secao, "#0b6bcb");
    expect(secao.style.getPropertyValue("--cor-primaria")).toBe("#0b6bcb");
  });

  test("marcarCampoInvalido: com mensagem marca o campo", () => {
    const { document } = criarDom('<input id="i" class="campo" />');
    const campo = document.querySelector("#i");
    marcarCampoInvalido(campo, "Preencha este campo");
    expect(campo.getAttribute("aria-invalid")).toBe("true");
    expect(campo.classList.contains("invalido")).toBe(true);
    expect(campo.classList.contains("campo")).toBe(true);
  });

  test("marcarCampoInvalido: sem mensagem limpa tudo (o atributo some, não vira 'false')", () => {
    const { document } = criarDom('<input id="i" class="campo invalido" aria-invalid="true" />');
    const campo = document.querySelector("#i");
    marcarCampoInvalido(campo, "");
    expect(campo.hasAttribute("aria-invalid")).toBe(false);
    expect(campo.classList.contains("invalido")).toBe(false);
    marcarCampoInvalido(campo, "erro");
    marcarCampoInvalido(campo, null);
    expect(campo.hasAttribute("aria-invalid")).toBe(false);
  });
});
