import { describe, expect, test, vi } from "vitest";
import { criarDom } from "../../suporte/dom.js";
import { ativarLista } from "./05-delegacao.js";

const item = (id, texto) => `
  <li data-id="${id}">
    <span class="texto">${texto}</span>
    <button data-acao="remover" aria-label="Remover ${texto}"><i class="icone">✕</i></button>
  </li>`;

const montar = () => {
  const dom = criarDom(`<ul id="lista">${item(1, "Pão")}${item(2, "Leite")}${item(3, "Café")}</ul>`);
  return { ...dom, ul: dom.document.querySelector("#lista") };
};

const ids = (ul) => [...ul.children].map((li) => li.dataset.id);

describe("delegação de eventos", () => {
  test("clicar no texto alterna a classe feita", () => {
    const { ul } = montar();
    ativarLista(ul);
    ul.querySelector('[data-id="2"] .texto').click();
    expect(ul.querySelector('[data-id="2"]').classList.contains("feita")).toBe(true);
    ul.querySelector('[data-id="2"] .texto').click();
    expect(ul.querySelector('[data-id="2"]').classList.contains("feita")).toBe(false);
  });

  test("clicar no próprio <li> também alterna", () => {
    const { ul } = montar();
    ativarLista(ul);
    ul.querySelector('[data-id="1"]').click();
    expect(ul.querySelector('[data-id="1"]').classList.contains("feita")).toBe(true);
  });

  test("clicar no botão remove o item", () => {
    const { ul } = montar();
    ativarLista(ul);
    ul.querySelector('[data-id="2"] button').click();
    expect(ids(ul)).toEqual(["1", "3"]);
  });

  test("clicar em algo DENTRO do botão também remove (e não marca como feita)", () => {
    const { ul } = montar();
    ativarLista(ul);
    const primeiro = ul.querySelector('[data-id="1"]');
    primeiro.querySelector(".icone").click();
    expect(ids(ul)).toEqual(["2", "3"]);
    expect(ul.querySelector('[data-id="2"]').classList.contains("feita")).toBe(false);
  });

  test("clicar na lista fora de qualquer item não faz nada", () => {
    const { ul } = montar();
    ativarLista(ul);
    ul.click();
    expect(ids(ul)).toEqual(["1", "2", "3"]);
    expect(ul.querySelectorAll(".feita")).toHaveLength(0);
  });

  test("itens adicionados depois também funcionam", () => {
    const { ul } = montar();
    ativarLista(ul);
    ul.insertAdjacentHTML("beforeend", item(4, "Queijo"));
    ul.querySelector('[data-id="4"] .texto').click();
    expect(ul.querySelector('[data-id="4"]').classList.contains("feita")).toBe(true);
    ul.querySelector('[data-id="4"] button').click();
    expect(ids(ul)).toEqual(["1", "2", "3"]);
  });

  test("usa um único addEventListener (delegação de verdade)", () => {
    const { ul } = montar();
    const espiao = vi.spyOn(ul, "addEventListener");
    const filhos = [...ul.querySelectorAll("*")];
    const espioesDosFilhos = filhos.map((filho) => vi.spyOn(filho, "addEventListener"));
    ativarLista(ul);
    expect(espiao).toHaveBeenCalledTimes(1);
    expect(espioesDosFilhos.every((e) => e.mock.calls.length === 0)).toBe(true);
  });
});
