import { describe, expect, test, vi } from "vitest";
import { criarDom, pressionar } from "../../suporte/dom.js";
import { ativarAcordeao } from "./12-acordeao.js";

const perguntas = (abertos = []) =>
  [1, 2, 3]
    .map(
      (n) => `
    <h3><button class="acordeao__botao" aria-expanded="${abertos.includes(n)}" aria-controls="p${n}">Pergunta ${n}</button></h3>
    <div class="acordeao__painel" id="p${n}">Resposta ${n}</div>`,
    )
    .join("");

function montar(abertos = []) {
  const dom = criarDom(`<section id="faq">${perguntas(abertos)}</section>`);
  const raiz = dom.document.querySelector("#faq");
  ativarAcordeao(raiz);
  const botoes = [...raiz.querySelectorAll("button")];
  const painel = (n) => raiz.querySelector(`#p${n}`);
  const estado = () => botoes.map((b) => b.getAttribute("aria-expanded"));
  const escondidos = () => [1, 2, 3].map((n) => painel(n).hidden);
  return { ...dom, raiz, botoes, painel, estado, escondidos };
}

describe("estado inicial", () => {
  test("painéis combinam com aria-expanded", () => {
    const m = montar([2]);
    expect(m.estado()).toEqual(["false", "true", "false"]);
    expect(m.escondidos()).toEqual([true, false, true]);
  });

  test("tudo fechado quando nenhum começa aberto", () => {
    const m = montar();
    expect(m.escondidos()).toEqual([true, true, true]);
  });

  test("se mais de um começar aberto, só o primeiro fica aberto", () => {
    const m = montar([2, 3]);
    expect(m.estado()).toEqual(["false", "true", "false"]);
    expect(m.escondidos()).toEqual([true, false, true]);
  });
});

describe("clique", () => {
  test("abre o painel clicado", () => {
    const m = montar();
    m.botoes[0].click();
    expect(m.estado()).toEqual(["true", "false", "false"]);
    expect(m.escondidos()).toEqual([false, true, true]);
  });

  test("só um aberto por vez", () => {
    const m = montar([1]);
    m.botoes[2].click();
    expect(m.estado()).toEqual(["false", "false", "true"]);
    expect(m.escondidos()).toEqual([true, true, false]);
  });

  test("clicar no que está aberto fecha", () => {
    const m = montar([2]);
    m.botoes[1].click();
    expect(m.estado()).toEqual(["false", "false", "false"]);
    expect(m.escondidos()).toEqual([true, true, true]);
  });

  test("clicar em qualquer lugar fora dos botões não faz nada", () => {
    const m = montar([1]);
    m.painel(2).click();
    m.raiz.click();
    expect(m.estado()).toEqual(["true", "false", "false"]);
  });

  test("usa delegação: um listener de click e um de keydown na raiz", () => {
    const dom = criarDom(`<section id="faq">${perguntas()}</section>`);
    const raiz = dom.document.querySelector("#faq");
    const tipos = [];
    const original = raiz.addEventListener.bind(raiz);
    raiz.addEventListener = (tipo, ...resto) => {
      tipos.push(tipo);
      return original(tipo, ...resto);
    };
    const espioes = [...raiz.querySelectorAll("button")].map((b) => vi.spyOn(b, "addEventListener"));
    ativarAcordeao(raiz);
    expect(tipos.toSorted()).toEqual(["click", "keydown"]);
    expect(espioes.every((e) => e.mock.calls.length === 0)).toBe(true);
  });
});

describe("teclado e foco", () => {
  test("ArrowDown vai para o próximo e dá a volta", () => {
    const m = montar();
    m.botoes[0].focus();
    const evento = pressionar(m.botoes[0], "ArrowDown");
    expect(m.document.activeElement).toBe(m.botoes[1]);
    expect(evento.defaultPrevented).toBe(true);
    pressionar(m.botoes[1], "ArrowDown");
    pressionar(m.botoes[2], "ArrowDown");
    expect(m.document.activeElement).toBe(m.botoes[0]);
  });

  test("ArrowUp vai para o anterior e dá a volta", () => {
    const m = montar();
    m.botoes[0].focus();
    pressionar(m.botoes[0], "ArrowUp");
    expect(m.document.activeElement).toBe(m.botoes[2]);
    pressionar(m.botoes[2], "ArrowUp");
    expect(m.document.activeElement).toBe(m.botoes[1]);
  });

  test("Home e End", () => {
    const m = montar();
    m.botoes[1].focus();
    pressionar(m.botoes[1], "End");
    expect(m.document.activeElement).toBe(m.botoes[2]);
    pressionar(m.botoes[2], "Home");
    expect(m.document.activeElement).toBe(m.botoes[0]);
  });

  test("mexer o foco não abre nem fecha nada", () => {
    const m = montar([1]);
    pressionar(m.botoes[0], "ArrowDown");
    expect(m.estado()).toEqual(["true", "false", "false"]);
  });

  test("outras teclas não são bloqueadas", () => {
    const m = montar();
    const evento = pressionar(m.botoes[0], "a");
    expect(evento.defaultPrevented).toBe(false);
    expect(pressionar(m.botoes[0], "Enter").defaultPrevented).toBe(false);
  });
});
